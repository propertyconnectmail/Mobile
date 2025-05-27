import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonToolbar } from '@ionic/angular/standalone';
import { NavController } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';
import { ToastService } from 'src/app/core/_services/toast/toast.service';
import { ClientService } from 'src/app/_services/client/client.service';
import { ProfessionalService } from 'src/app/_services/professional/professional.service';

@Component({
  selector: 'app-forgot-password-new-password',
  templateUrl: './forgot-password-new-password.page.html',
  styleUrls: ['./forgot-password-new-password.page.scss'],
  standalone: true,
  imports: [ IonContent, CommonModule, FormsModule, ReactiveFormsModule]
})
export class ForgotPasswordNewPasswordPage implements OnInit {

  passwordForm!: FormGroup;
  email: string = '';
  type: string = '';
  isSubmitting = false;
  showPassword = false;

  constructor(
    private fb: FormBuilder,
    private navCtrl: NavController,
    private route: ActivatedRoute,
    private toastService: ToastService,
    private clientService: ClientService,
    private professionalService: ProfessionalService
  ) {}

  ngOnInit() {
    this.email = this.route.snapshot.queryParamMap.get('email') || '';
    this.type = this.route.snapshot.queryParamMap.get('type') || '';

    this.passwordForm = this.fb.group({
      newPassword: ['', [Validators.required, Validators.minLength(6)]],
      retypePassword: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  onSubmit() {
    if (this.passwordForm.invalid) {
      this.passwordForm.markAllAsTouched();
      this.toastService.show('Please enter a valid password.', {
        color: 'danger',
        position: 'bottom',
        duration: 3000
      });
      return;
    }

    const { newPassword, retypePassword } = this.passwordForm.value;

    if (newPassword !== retypePassword) {
      this.toastService.show('Passwords do not match.', {
        color: 'danger',
        position: 'bottom',
        duration: 3000
      });
      return;
    }

    this.isSubmitting = true;

    const requestBody = {
      email: this.email,
      password: newPassword
    };

    const request = this.type === 'client'
      ? this.clientService.updateForgotPassword(requestBody)
      : this.professionalService.updateForgotPassword(requestBody);

    request.subscribe((res: any) => {
      this.isSubmitting = false;

      if (res.message === 'success') {
        this.toastService.show('Password updated successfully. Please login.', {
          color: 'primary',
          position: 'bottom',
          duration: 3000
        });
        if(this.type === 'client'){
          this.navCtrl.navigateRoot('/login');
        }else{
          this.navCtrl.navigateRoot('/login-professional')
        }
      } else {
        this.toastService.show(res.Error || 'Something went wrong. Please try again later.', {
          color: 'danger',
          position: 'bottom',
          duration: 3000
        });
      }
    }, () => {
      this.isSubmitting = false;
      this.toastService.show('Something went wrong. Please try again later.', {
        color: 'danger',
        position: 'bottom',
        duration: 3000
      });
    });
  }

  prev() {
    this.navCtrl.back();
  }
}
