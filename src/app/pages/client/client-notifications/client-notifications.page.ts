import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonIcon } from '@ionic/angular/standalone';
import { BottomTabComponent } from "../../../components/bottom-tab/bottom-tab.component";

@Component({
  selector: 'app-client-notifications',
  templateUrl: './client-notifications.page.html',
  styleUrls: ['./client-notifications.page.scss'],
  standalone: true,
  imports: [IonIcon, IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, BottomTabComponent]
})
export class ClientNotificationsPage implements OnInit {

  isLoading = true;

  placeholders = new Array(4); // Used for shimmer cards

  todayNotifications = [
    {
      title: 'Appointment Success',
      message: 'You have successfully booked your appointment with Emily Walker.',
      time: '1h',
      icon: 'assets/icons/appointment-success.svg',
      type: 'success'
    },
    {
      title: 'Appointment Cancelled',
      message: 'You have successfully cancelled your appointment with Janaka Perera.',
      time: '2h',
      icon: 'assets/icons/appointment-cancel.svg',
      type: 'cancel'
    },
    {
      title: 'Schedule Changed',
      message: 'You have successfully changed your appointment with Janaka Perera.',
      time: '8h',
      icon: 'assets/icons/schedule-change.svg',
      type: 'schedule'
    }
  ];

  yesterdayNotifications = [
    {
      title: 'Appointment Success',
      message: 'You have successfully booked your appointment with Janaka Perera.',
      time: '1d',
      icon: 'assets/icons/appointment-success.svg',
      type: 'success'
    },
    {
      title: 'Payment Success',
      message: 'You have been charged Rs.3000 for your appointment with Janaka Perera.',
      time: '1d',
      icon: 'assets/icons/payment-success.svg',
      type: 'success'
    }
  ];

  ngOnInit() {
    // Simulate shimmer loading for a short time
    setTimeout(() => {
      this.isLoading = false;
    }, 1200); // Adjust for real API timing
  }

}
