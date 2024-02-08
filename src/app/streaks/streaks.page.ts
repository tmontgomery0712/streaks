import { Component, effect, inject, signal } from '@angular/core';
import {
  IonHeader,
  IonModal,
  IonToolbar,
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
  IonButtons,
} from '@ionic/angular/standalone';
import { StreakService } from '../services/streak-service.service';
import { StreakListComponent } from '../component/streak-list/streak-list.component';
import { FormBuilder, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FormModalComponent } from '../component/form-modal/form-modal.component';
import { BehaviorSubject } from 'rxjs';
import { addIcons } from 'ionicons';
import { add } from 'ionicons/icons';
import { Streak } from '../model/streak';

@Component({
  selector: 'app-streaks',
  styleUrls: ['streaks.page.scss'],
  standalone: true,
  template: `
    <ion-header [translucent]="true">
      <ion-toolbar>
        <ion-title> Streaks </ion-title>
        <ion-buttons slot="end">
          <ion-button (click)="formModalIsOpen$.next(true)">
            <ion-icon name="add" slot="icon-only"></ion-icon>
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>

    <ion-content [fullscreen]="true">
      <ion-header collapse="condense">
        <ion-toolbar>
          <ion-title size="large">Streaks</ion-title>
        </ion-toolbar>
      </ion-header>
      <section>
        <app-streak-list
          [streaks]="streakService.streaks()"
          (toggle)="streakService.toggle$.next($event)"
          (edit)="streakBeingEdited.set($event)"
          (delete)="streakService.remove$.next($event)"
        />
      </section>
      <ion-modal
        [isOpen]="formModalIsOpen$ | async"
        [canDismiss]="true"
        (ionModalDidDismiss)="
          formModalIsOpen$.next(false); streakBeingEdited.set(null)
        "
      >
        <ng-template>
          <app-form-modal
            [title]="streakBeingEdited()?.id ? 'Edit Streak' : 'Create Streak'"
            [formGroup]="streakForm"
            (save)="
              streakBeingEdited()?.id
                ? streakService.edit$.next({
                    id: streakBeingEdited()!.id!,
                    data: streakForm.getRawValue()
                  })
                : streakService.add$.next(streakForm.getRawValue())
            "
          ></app-form-modal>
        </ng-template>
      </ion-modal>
    </ion-content>
  `,
  imports: [
    IonHeader,
    IonModal,
    IonToolbar,
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
    StreakListComponent,
    CommonModule,
    FormModalComponent,
    IonButtons,
  ],
  styles: [
    `
      :host {
        height: 100%;
      }
    `,
  ],
})
export class StreaksPage {
  streakService = inject(StreakService);
  formBuilder = inject(FormBuilder);
  formModalIsOpen$ = new BehaviorSubject<boolean>(false);
  streakBeingEdited = signal<Partial<Streak> | null>(null);

  streakForm = this.formBuilder.nonNullable.group({
    title: ['', Validators.required],
  });

  constructor() {
    addIcons({ add });

    effect(() => {
      const streak = this.streakBeingEdited();

      if (!streak) {
        this.streakForm.reset();
      } else {
        this.streakForm.patchValue({
          title: streak.title,
        });
        this.formModalIsOpen$.next(true);
      }
    });
  }
}
