import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { RemoveStreak, Streak } from 'src/app/model/streak';
import {
  IonHeader,
  IonToolbar,
  IonModal,
  IonTitle,
  IonContent,
  IonList,
  IonItem,
  IonLabel,
  IonCheckbox,
  IonIcon,
  IonButton,
  IonGrid,
  IonCol,
  IonRow,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { trash, create, flameOutline } from 'ionicons/icons';
import { FormModalComponent } from '../form-modal/form-modal.component';
import { CommonModule } from '@angular/common';
import { StreakService } from 'src/app/services/streak-service.service';
import { Router, RouterLink } from '@angular/router';

@Component({
  standalone: true,
  selector: 'app-streak-list',
  template: `
    <div class="mt-8">
      @for (streak of streaks; track streak.id){
      <div
        (click)="navigateToDetails($event, streak.id!)"
        class="cardBg mx-4 mb-3 py-4 rounded"
        id="streak"
      >
        <div class="flex justify-between items-center">
          <div class="flex items-center ml-4" id="checkBoxContainer">
            <ion-checkbox
              (click)="$event.stopPropagation(); toggle.emit(streak)"
              [checked]="streak.completed"
              justify="start"
            ></ion-checkbox>
            <p class="text-white ml-4 break-all">{{ streak.title }}</p>
          </div>
          <div class="flex mr-4" id="btnContainer">
            <ion-button
              (click)="$event.stopPropagation(); edit.emit(streak)"
              size="small"
              class="ion-float-right"
            >
              <ion-icon size="small" slot="icon-only" name="create"></ion-icon>
            </ion-button>
            <ion-button
              (click)="$event.stopPropagation(); delete.emit(streak.id)"
              size="small"
              class="ion-float-right margin-right"
            >
              <ion-icon size="small" slot="icon-only" name="trash"></ion-icon>
            </ion-button>
          </div>
        </div>
        <div class="mt-2 ml-4 flex items-center" id="streakInfoContainer">
          🔥
          <p class="text-xs ml-1">{{ streak.currentStreak }}</p>
        </div>
      </div>
      } @empty {
      <p class="text-white ml-4">
        Click the add button to create your first streak!
      </p>
      }
    </div>
  `,
  imports: [
    IonHeader,
    IonToolbar,
    IonModal,
    IonTitle,
    IonContent,
    IonList,
    IonLabel,
    IonItem,
    IonCheckbox,
    IonIcon,
    IonButton,
    IonGrid,
    IonRow,
    IonCol,
    FormModalComponent,
    CommonModule,
    RouterLink,
  ],
})
export class StreakListComponent {
  streakService = inject(StreakService);
  router = inject(Router);
  @Input() streaks!: Streak[];
  @Output() toggle = new EventEmitter<Streak>();
  @Output() delete = new EventEmitter<RemoveStreak>();
  @Output() edit = new EventEmitter<Streak>();

  constructor() {
    addIcons({ trash, create, flameOutline });
  }

  navigateToDetails(event: Event, streakId: number) {
    event.preventDefault();
    this.router.navigateByUrl(`/streak/${streakId}`);
  }
}
