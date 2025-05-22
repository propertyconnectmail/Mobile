import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonContent } from '@ionic/angular/standalone';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-selection',
  templateUrl: './selection.page.html',
  styleUrls: ['./selection.page.scss'],
  standalone: true,
  imports: [CommonModule, IonContent],
})
export class SelectionPage implements OnInit{

  isLoading = true;

  constructor(private navCtrl: NavController) {}

  ngOnInit() {
    // Simulate shimmer delay
    setTimeout(() => {
      this.isLoading = false;
    }, 1800); // Adjust time as needed
  }

  selectRole(role: 'client' | 'professional') {
    if (role === 'client') {
      this.navCtrl.navigateForward('/onboarding-client');
    } else {
      this.navCtrl.navigateForward('/onboarding-professional');
    }
  }

}

