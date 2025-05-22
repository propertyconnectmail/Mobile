import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { IonContent, IonImg } from '@ionic/angular/standalone';
import { CommonModule } from '@angular/common';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-onboarding-professional',
  templateUrl: './onboarding-professional.page.html',
  styleUrls: ['./onboarding-professional.page.scss'],
  standalone: true,
  imports: [IonContent, CommonModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class OnboardingProfessionalPage {

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

  toLogin(){
    this.navCtrl.navigateForward('/login-professional');
    localStorage.setItem('firstLaunchDone', 'true');
  }

  prev(){
    this.navCtrl.navigateBack('/selection');
  }
}
