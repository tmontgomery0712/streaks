import { computed, inject } from '@angular/core';
import { map, pipe, switchMap, tap } from 'rxjs';
import {
  patchState,
  signalStore,
  withComputed,
  withHooks,
  withMethods,
  withState,
} from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { tapResponse } from '@ngrx/operators';
import { Streak } from '../model/streak';
import { StreakService } from '../services/streak-service.service';

type StreakState = {
  streaks: Streak[];
  isLoading: boolean;
};

const initialState: StreakState = {
  streaks: [],
  isLoading: false,
};

export const StreakStore = signalStore(
  withState(initialState),
  withComputed(({ streaks }) => ({
    streaks: computed(() => streaks()),
  })),
  withComputed(({ isLoading }) => ({
    isLoading: computed(() => isLoading),
  })),
  withMethods((store, streakService = inject(StreakService)) => ({
    loadStreaks() {
      streakService
        .fetchStreaks()
        .pipe(
          tapResponse({
            next: (streaks) => patchState(store, { streaks }),
            error: console.error,
            finalize: () => patchState(store, { isLoading: false }),
          })
        )
        .subscribe();
    },
    createStreak: rxMethod<Streak>(
      pipe(
        tap(() => patchState(store, { isLoading: true })),
        switchMap((streak) => {
          return streakService.addStreak(streak).pipe(
            tapResponse({
              next: (streak) =>
                patchState(store, { streaks: [...store.streaks(), streak] }),
              error: console.error,
              finalize: () => patchState(store, { isLoading: false }),
            })
          );
        })
      )
    ),
    deleteStreak: rxMethod<number>(
      pipe(
        tap(() => patchState(store, { isLoading: true })),
        switchMap((streakId) => {
          return streakService.deleteStreak(streakId).pipe(
            tapResponse({
              next: () => {
                patchState(store, {
                  streaks: [
                    ...store
                      .streaks()
                      .filter((streak) => streak.id !== streakId),
                  ],
                });
              },
              error: console.error,
              finalize: () => patchState(store, { isLoading: false }),
            })
          );
        })
      )
    ),
    editStreak: rxMethod<Streak>(
      pipe(
        tap(() => patchState(store, { isLoading: true })),
        switchMap((streak) => {
          return streakService.editStreak(streak).pipe(
            tapResponse({
              next: (updatedStreak) => {
                const allStreaks = [...store.streaks()];
                const index = allStreaks.findIndex((x) => x.id === streak.id);
                allStreaks[index] = updatedStreak;
                patchState(store, {
                  streaks: allStreaks,
                });
              },
              error: console.error,
              finalize: () => patchState(store, { isLoading: false }),
            })
          );
        })
      )
    ),
    toggleStreak: rxMethod<Streak>(
      pipe(
        tap(() => patchState(store, { isLoading: true })),
        switchMap((streak) => {
          return streakService.toggleStreak(streak).pipe(
            tapResponse({
              next: (updatedStreak) => {
                const allStreaks = [...store.streaks()];
                const index = allStreaks.findIndex((x) => x.id === streak.id);
                allStreaks[index] = updatedStreak;
                patchState(store, {
                  streaks: allStreaks,
                });
              },
              error: console.error,
              finalize: () => patchState(store, { isLoading: false }),
            })
          );
        })
      )
    ),
  })),
  withHooks({
    onInit({ loadStreaks }) {
      loadStreaks();
    },
    onDestroy({ loadStreaks }) {},
  })
);
