import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonButton } from '@ionic/angular/standalone';

@Component({
  selector: 'app-forgot-password-confirmation',
  templateUrl: './forgot-password-confirmation.page.html',
  styleUrls: ['./forgot-password-confirmation.page.scss'],
  standalone: true,
  imports: [IonButton, IonContent, CommonModule, FormsModule]
})
export class ForgotPasswordConfirmationPage implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
