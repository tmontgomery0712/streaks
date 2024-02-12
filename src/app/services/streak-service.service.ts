import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Streak } from '../model/streak';

@Injectable({
  providedIn: 'root',
})
export class StreakService {
  private http = inject(HttpClient);
  private backend = 'http://localhost:8080/streaks';

  fetchStreaks() {
    return this.http.get<Streak[]>(this.backend);
  }

  addStreak(streak: Streak) {
    return this.http.post<Streak>(`${this.backend}/create`, streak);
  }

  deleteStreak(streakId: number) {
    return this.http.delete<number>(`${this.backend}/delete/${streakId}`);
  }

  editStreak(streak: Streak) {
    return this.http.put<Streak>(`${this.backend}/edit`, streak);
  }

  toggleStreak(streak: Streak) {
    return this.http.put<Streak>(`${this.backend}/toggle`, streak);
  }
}
