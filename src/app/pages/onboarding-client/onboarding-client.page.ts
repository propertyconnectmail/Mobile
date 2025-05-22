import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { IonContent, IonImg } from '@ionic/angular/standalone';
import { CommonModule } from '@angular/common';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-onboarding-client',
  templateUrl: './onboarding-client.page.html',
  styleUrls: ['./onboarding-client.page.scss'],
  standalone: true,
  imports: [CommonModule, IonContent, IonImg],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class OnboardingClientPage {

  constructor(private navCtrl: NavController) {}
  animationClass = '';
  isAnimating = false;
  currentIndex = 1;

  nextSlide() {
    if (this.isAnimating || this.currentIndex >= 3) return;

    this.animationClass = 'fade-leave-left';
    this.isAnimating = true;

    setTimeout(() => {
      this.currentIndex++;
      this.animationClass = 'fade-enter-right';

      setTimeout(() => {
        this.isAnimating = false;
        this.animationClass = '';
      }, 400);
    }, 400);
  }

  prevSlide() {
    if (this.isAnimating || this.currentIndex <= 1) return;

    this.animationClass = 'fade-leave-right';
    this.isAnimating = true;

    setTimeout(() => {
      this.currentIndex--;
      this.animationClass = 'fade-enter-left';

      setTimeout(() => {
        this.isAnimating = false;
        this.animationClass = '';
      }, 400);
    }, 400);
  }

  getScreenClass(index: number) {
    const isActive = index === this.currentIndex;
    return {
      'visible': isActive,
      [this.animationClass]: isActive,
      'hidden': !isActive
    };
  }

  prev(){

    this.navCtrl.navigateBack('/selection');
  }


  toLogin(){
    this.navCtrl.navigateForward('/login');
    localStorage.setItem('firstLaunchDone', 'true');
  }
}
