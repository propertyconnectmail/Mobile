import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonContent } from '@ionic/angular/standalone';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-splash',
  templateUrl: './splash.page.html',
  styleUrls: ['./splash.page.scss'],
  standalone: true,
  imports: [IonContent, CommonModule]
})
export class SplashPage implements OnInit {

   constructor(private navCtrl: NavController) {}

  ngOnInit(): void {
    setTimeout(() => {
      const isFirstLaunch = !localStorage.getItem('firstLaunchDone');
      const user = localStorage.getItem('user');

      if (user) {
        const parsed = JSON.parse(user);
        if (parsed.type) {
          this.navCtrl.navigateRoot('/professional-home');
        } else {
          this.navCtrl.navigateRoot('/client-home');
        }
      } else if (isFirstLaunch) {
        this.navCtrl.navigateRoot('/selection');
      } else {
        this.navCtrl.navigateRoot('/login');
      }
    }, 3000);
  }

}
