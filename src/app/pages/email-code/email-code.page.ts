import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonContent, IonCheckbox } from '@ionic/angular/standalone';
import { Validators, FormGroup, FormBuilder } from '@angular/forms';
import { NavController } from '@ionic/angular';
import { ClientService } from 'src/app/_services/client/client.service';
import { PlatformService } from 'src/app/core/_services/platform/platform.service';
import { ToastService } from 'src/app/core/_services/toast/toast.service';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from 'src/app/core/_services/auth/auth.service';

@Component({
  selector: 'app-email-code',
  templateUrl: './email-code.page.html',
  styleUrls: ['./email-code.page.scss'],
  standalone: true,
  imports: [IonContent, CommonModule, FormsModule, ReactiveFormsModule]
})
export class EmailCodePage implements OnInit {

  validationForm!: FormGroup;
  isSubmitting = false;
  code: any = '';
  email: any = '';
  type: string = '';
  user: any;
  

  constructor( private route: ActivatedRoute ,private fb: FormBuilder, private navCtrl: NavController, private toastService : ToastService, private authService : AuthService) {}

  ngOnInit() {
    this.code = this.route.snapshot.queryParamMap.get('Code') || '';
    this.email = this.route.snapshot.queryParamMap.get('email') || '';
    this.type = history.state.type || '';
    this.user = history.state.user || null;

    this.validationForm = this.fb.group({
      code: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(6)]]
    });
  }

  onValidation(): void {
    
    if (this.validationForm.invalid) {
      this.validationForm.markAllAsTouched();
      this.toastService.show('Please enter the verification code.', {
        color: 'danger',
        position: 'bottom',
        duration: 3000
      });
      return;
    }

    if(this.validationForm.valid){
      let enteredCode = String(this.validationForm.get('code')!.value);
      if(this.code === enteredCode){
        if (this.user) {
          localStorage.setItem('user', JSON.stringify(this.user));
          this.authService.setLoggedIn(true);
        }
          this.isSubmitting = false;        
          this.toastService.show('Login successful!', {
            color: 'primary',
            position: 'bottom',
            duration: 3000
          });
          if (this.type === 'professional') {
            this.navCtrl.navigateRoot(['/professional-home']);
          } else {
            this.navCtrl.navigateRoot(['/client-home']);
          }
          return;
        }else{
          this.toastService.show('Incorrect validation code please try again!', {
              color: 'danger',
              position: 'bottom',
              duration: 3000
          });
          return
        }
    }
  }

  prev(){
    this.navCtrl.back();
  }

}
