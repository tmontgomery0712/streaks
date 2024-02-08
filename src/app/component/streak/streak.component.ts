import { Component, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { StreakService } from 'src/app/services/streak-service.service';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonBackButton,
  IonContent,
  IonIcon,
  IonButtons,
} from '@ionic/angular/standalone';

@Component({
  selector: 'app-streak',
  standalone: true,
  styleUrls: ['./streak.component.scss'],
  imports: [
    IonHeader,
    IonToolbar,
    IonTitle,
    IonButtons,
    IonBackButton,
    RouterLink,
    IonContent,
    IonIcon,
  ],
  template: `
    <ion-header>
      <ion-toolbar>
        <ion-title>Streak Details</ion-title>
        <ion-buttons slot="start">
          <ion-back-button></ion-back-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>

    <ion-content>
      <div>
        <div class="mx-auto max-w-7xl">
          <div
            class="grid grid-cols-1 gap-px sm:grid-cols-2 lg:grid-cols-3 lg:place-items-center"
          >
            <div class="px-4 py-6 sm:px-6 lg:px-8">
              <p class="text-sm font-medium leading-6 text-gray-400">
                Current Streak
              </p>
              <p class="mt-2 flex items-baseline gap-x-2">
                <span
                  class="text-4xl font-semibold tracking-tight text-white"
                  >{{ streak()?.currentStreak }}</span
                >
              </p>
            </div>
            <div class="px-4 py-6 sm:px-6 lg:px-8">
              <p class="text-sm font-medium leading-6 text-gray-400">
                Previous Streak
              </p>
              <p class="mt-2 flex items-baseline gap-x-2">
                <span
                  class="text-4xl font-semibold tracking-tight text-white"
                  >{{ streak()?.previousStreak }}</span
                >
                <span class="text-sm text-gray-400"></span>
              </p>
            </div>
            <div class="px-4 py-6 sm:px-6 lg:px-8">
              <p class="text-sm font-medium leading-6 text-gray-400">
                Longest Streak
              </p>
              <p class="mt-2 flex items-baseline gap-x-2">
                <span
                  class="text-4xl font-semibold tracking-tight text-white"
                  >{{ streak()?.longestStreak }}</span
                >
              </p>
            </div>
          </div>
        </div>
      </div>
    </ion-content>
  `,
})
export default class StreakComponent {
  streakService = inject(StreakService);
  route = inject(ActivatedRoute);

  params = toSignal(this.route.paramMap);

  streak = computed(() =>
    this.streakService
      .streaks()
      .find((streak) => streak.id === Number(this.params()?.get('id')))
  );
}
