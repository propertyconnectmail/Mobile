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

@Component({
  selector: 'app-forgot-password-code',
  templateUrl: './forgot-password-code.page.html',
  styleUrls: ['./forgot-password-code.page.scss'],
  standalone: true,
  imports: [IonContent, CommonModule, FormsModule, ReactiveFormsModule]
})
export class ForgotPasswordCodePage implements OnInit {

  validationForm: FormGroup | any;
  loading = false;
  isSubmitting = false;
  code : any= '';
  email : any = '';
  type : any = '';

  constructor( private route: ActivatedRoute ,private fb: FormBuilder, private navCtrl: NavController, private clientService : ClientService, private platformService : PlatformService, private toastService : ToastService) {}

  ngOnInit() {
    this.code = this.route.snapshot.queryParamMap.get('Code');
    this.email = this.route.snapshot.queryParamMap.get('email');
    this.type = this.route.snapshot.queryParamMap.get('type') || '';
    this.validationForm = this.fb.group({
      code: ['', [Validators.required, Validators.minLength(6),Validators.maxLength(6)]]
    });
  }

  onValidation(): void {
    
    if (this.validationForm.invalid){
      this.validationForm.markAllAsTouched();
      this.toastService.show('Please fill alll the fields with valid details', {
        color: 'danger',
        position: 'bottom',
        duration: 3000
      });
      return;
    }

    if(this.validationForm.valid){
      let enteredCode = String(this.validationForm.get('code').value);
      if(this.code === enteredCode){
          this.isSubmitting = false;        
          this.toastService.show('Login successful!', {
            color: 'primary',
            position: 'bottom',
            duration: 3000
          });
          this.navCtrl.navigateForward(['/forgot-password-new-password'], {
            queryParams: { email: this.email, type: this.type }
          });
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
