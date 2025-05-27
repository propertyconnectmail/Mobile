import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonContent, IonCheckbox } from '@ionic/angular/standalone';
import { Validators, FormGroup, FormBuilder } from '@angular/forms';
import { NavController } from '@ionic/angular';
import { PlatformService } from 'src/app/core/_services/platform/platform.service';
import { ToastService } from 'src/app/core/_services/toast/toast.service';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from 'src/app/core/_services/auth/auth.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.page.html',
  styleUrls: ['./forgot-password.page.scss'],
  standalone: true,
  imports: [IonContent, CommonModule, FormsModule, ReactiveFormsModule]
})
export class ForgotPasswordPage implements OnInit {

  validationForm!: FormGroup;
  isSubmitting = false;
  type: string = '';

  constructor( private route: ActivatedRoute ,private fb: FormBuilder, private navCtrl: NavController, private authService: AuthService, private platformService : PlatformService, private toastService : ToastService) {}

  ngOnInit() {
    this.type = this.route.snapshot.paramMap.get('type') || '';

    this.validationForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  onValidation(): void {
    if (this.validationForm.invalid) {
      this.validationForm.markAllAsTouched();
      this.toastService.show('Please enter a valid email.', {
        color: 'danger',
        position: 'bottom',
        duration: 3000
      });
      return;
    }

    const email = this.validationForm.get('email')!.value;
    this.isSubmitting = true;

    this.authService.forgotPasswordRequest({ type: this.type, email : email }).subscribe(async(res: any) => {
      this.isSubmitting = false;
      console.log(res)

      if (res.email === email) {
        this.authService.emailValidation({email: email, firstName : res.firstName}).subscribe(async(emailCode:any)=>{
          if(emailCode.message === 'success'){
            this.isSubmitting = false;
            let Code = emailCode.Code;
            console.log(emailCode)
            this.toastService.show('Reset code sent to your email!', {
              color: 'primary',
              position: 'bottom',
              duration: 3000
            });
            this.navCtrl.navigateForward(['/forgot-password-code'], {
              queryParams: { Code, email : email, type : this.type }
            });
          }
        })
      } else {
        this.toastService.show('Email not found. Please try again.', {
          color: 'danger',
          position: 'bottom',
          duration: 3000
        });
      }
    }, () => {
      this.isSubmitting = false;
      this.toastService.show('Something went wrong. Try again later.', {
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
