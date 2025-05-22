import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent } from '@ionic/angular/standalone';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-client-payment-success',
  templateUrl: './client-payment-success.page.html',
  styleUrls: ['./client-payment-success.page.scss'],
  standalone: true,
  imports: [IonContent, CommonModule, FormsModule]
})
export class ClientPaymentSuccessPage implements OnInit {

  constructor(private navCtrl: NavController,) { }

  ngOnInit() {
  }

  prev() {
    this.navCtrl.navigateRoot('/client-home');
  }

}
