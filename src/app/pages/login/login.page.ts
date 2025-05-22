import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonContent, IonCheckbox } from '@ionic/angular/standalone';
import { AbstractControl, ValidationErrors, Validators, FormGroup, FormBuilder, ValidatorFn } from '@angular/forms';
import { AuthService } from 'src/app/core/_services/auth/auth.service';
import { NavController , IonicModule} from '@ionic/angular';
import { ToastService } from 'src/app/core/_services/toast/toast.service';

@Component({
  selector: 'app-login',
  standalone: true,
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  imports: [IonCheckbox, CommonModule, FormsModule, IonContent, ReactiveFormsModule],
})
export class LoginPage implements OnInit {
  loginForm: FormGroup | any;
  showPassword = false;
  rememberMe = false;
  isSubmitting = false;

  constructor(private fb: FormBuilder, private navCtrl: NavController, private toastService : ToastService, private authService: AuthService) {}

  ngOnInit() {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      rememberMe: [false]
    });
  }

  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  onLogin(): void {
    if (this.loginForm.invalid){
      this.loginForm.markAllAsTouched();
      this.toastService.show('Please enter your email and password!', {
        color: 'danger',
        position: 'bottom',
        duration: 3000
      });
      return;
    }

    if(this.loginForm.valid){
      const {rememberMe, ...rest } = this.loginForm.value;

      let client: any = {
        ...rest,
      };

      this.isSubmitting = true;
      
      this.authService.loginClient(client).subscribe(async(res:any) => {
        if(res.email === client.email){
          this.authService.emailValidation({email: client.email, firstName : res.firstName}).subscribe(async(emailCode:any)=>{
            if(emailCode.message === 'success'){
              this.isSubmitting = false;
              let Code = emailCode.Code;
              this.navCtrl.navigateForward(['/email-code'], {
                queryParams: { Code, email : client.email }
              });
            }
          })
        }
        if(res.Error === 'Email or Password is Incorrect'){
          console.log(res.Error)
              this.isSubmitting = false;
              this.toastService.show('Email or Password is Incorrect!', {
                color: 'danger',
                position: 'bottom',
                duration: 3000
              });
              return
        }
        if(res.email != client.email){
          this.isSubmitting = false;
          this.toastService.show('Something went wrong. Please try again Later!', {
            color: 'danger',
            position: 'bottom',
            duration: 3000
          });
          return
        }
      })
    }
  }

  // prev(){
  //   this.navCtrl.navigateBack('/onboarding-client');
  // }

  toRegistration(){
    this.navCtrl.navigateForward('/register');
  }

  toProfessionaLogin(){
    this.navCtrl.navigateForward('/login-professional');
  }
}
