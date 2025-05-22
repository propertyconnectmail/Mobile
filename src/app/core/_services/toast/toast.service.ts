import { Injectable } from '@angular/core';
import { ToastController } from '@ionic/angular/standalone';

@Injectable({
  providedIn: 'root'
})
export class ToastService {

  constructor(private toastController: ToastController) {}

  async show(
    message: string,
    options?: {
      color?: 'success' | 'danger' | 'primary' | 'warning' | 'dark' | 'light' | 'medium';
      duration?: number;
      position?: 'top' | 'bottom' | 'middle';
    }
  ) {
    const toast = await this.toastController.create({
      message,
      duration: options?.duration ?? 3000,
      color: options?.color ?? 'success',
      position: options?.position ?? 'bottom',
      buttons: [
        {
          text: '✖',
          role: 'cancel',
        },
      ],
    });

    await toast.present();
  }
}