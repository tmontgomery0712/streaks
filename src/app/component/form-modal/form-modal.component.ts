import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
  inject,
} from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { IonHeader, IonToolbar, IonInput, IonModal, IonTitle, IonContent, IonList, IonItem, IonLabel, IonCheckbox,
  IonIcon, IonButton, IonGrid, IonButtons, IonCol, IonRow } from '@ionic/angular/standalone';
  import { ModalController } from '@ionic/angular';
import { KeyValuePipe, UpperCasePipe } from '@angular/common';
import { addIcons } from 'ionicons';
import { close, saveOutline } from 'ionicons/icons';

@Component({
  selector: 'app-form-modal',
  standalone: true,
  template: `
    <ion-header>
      <ion-toolbar>
        <ion-title>{{ title }}</ion-title>
        <ion-buttons slot="start">
          <ion-button (click)="dismiss()">
            <ion-icon name="close" slot="icon-only"></ion-icon>
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>

    <ion-content>
      <form class="mt-4" [formGroup]="formGroup" (ngSubmit)="handleSave()">
        @for (control of formGroup.controls | keyvalue; track control.key){
          <ion-item>
            <ion-input  labelPlacement="stacked" 
                        [label]="control.key | uppercase" type="text" 
                        [formControlName]="control.key"
                        [counter]="true"
                        maxlength="50"
                        [counterFormatter]="customCounterFormatter"></ion-input>
          </ion-item>
        }
        <ion-button
          expand="full"
          type="submit"
          [disabled]="!formGroup.valid"
        >
          <ion-icon slot="start" name="save-outline"></ion-icon> Save
        </ion-button>
      </form>
    </ion-content>
  `,
  imports: [IonHeader, IonInput, IonToolbar, IonModal, IonTitle, IonContent, IonList, IonLabel, IonItem, IonCheckbox, IonIcon, IonButton,
    IonGrid, IonRow, IonCol, ReactiveFormsModule, IonButtons, KeyValuePipe, UpperCasePipe],
  styles: [
      `
        :host {
          height: 100%;
        }
      `,
    ],
    providers: [ModalController]
})
export class FormModalComponent {
  modalCtrl = inject(ModalController);
  @Input() title!: string;
  @Input() formGroup!: FormGroup;

  @Output() save = new EventEmitter<boolean>();

  constructor() {
    addIcons({ close, saveOutline });
  }

  customCounterFormatter(inputLength: number, maxLength: number) {
    return `${maxLength - inputLength} characters remaining`;
  }


  handleSave() {
    this.save.emit(true);
    this.dismiss();
  }

  dismiss() {
    this.formGroup.reset();
    this.modalCtrl.dismiss();
  }
}
