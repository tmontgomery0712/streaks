import { Injectable, computed, inject, signal } from '@angular/core';
import { AddStreak, EditStreak, RemoveStreak, Streak } from '../model/streak';
import { Subject, map, merge } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { HttpClient } from '@angular/common/http';
import { connect } from 'ngxtension/connect';

export interface StreakState {
  streaks: Streak[];
  loaded: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class StreakService {
  private http = inject(HttpClient);
  private backend = 'http://localhost:8080/streaks';
  // state
  private state = signal<StreakState>({
    streaks: [],
    loaded: false,
  });

  // selectors
  streaks = computed(() => this.state().streaks);
  loaded = computed(() => this.state().loaded);

  // sources
  streaks$ = this.fetchStreaks();
  add$ = new Subject<Streak>();
  toggle$ = new Subject<RemoveStreak>();
  remove$ = new Subject<RemoveStreak>();
  edit$ = new Subject<EditStreak>();

  constructor() {
    // reducers

    const nextState$ = merge(
      this.streaks$.pipe(map((streaks) => ({ streaks, loaded: true })))
    );

    connect(this.state)
      .with(nextState$)
      .with(this.add$, (state, streak) => ({
        streaks: [...state.streaks, this.addStreak(streak)],
      }))
      .with(this.remove$, (state, id) => ({
        streaks: state.streaks.filter((streak) => streak.id !== id),
      }))
      .with(this.edit$, (state, update) => ({
        streaks: state.streaks.map((streak) =>
          streak.id === update.id
            ? { ...streak, title: update.data.title }
            : streak
        ),
      }));
  }

  private fetchStreaks() {
    return this.http.get<Streak[]>(this.backend);
  }

  private addStreak(streak: Streak) {
    const streakRequest = {
      ...streak,
      completed: false,
      currentStreak: 0,
      previousStreak: 0,
      longestStreak: 0,
    };
    let returnStreak: Streak = {
      ...streakRequest,
    };
    this.http
      .post<Streak>(`${this.backend}/create`, streakRequest)
      .subscribe((streak) => {
        returnStreak = streak;
      });
    return returnStreak;
  }
}
