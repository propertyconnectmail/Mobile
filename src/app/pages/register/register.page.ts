import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonContent, IonCheckbox } from '@ionic/angular/standalone';
import { Validators, FormGroup, FormBuilder } from '@angular/forms';
import { NavController } from '@ionic/angular';
import { ClientService } from 'src/app/_services/client/client.service';
import { PlatformService } from 'src/app/core/_services/platform/platform.service';
import { ToastService } from 'src/app/core/_services/toast/toast.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
  standalone: true,
  imports: [ IonCheckbox, CommonModule, FormsModule, IonContent, ReactiveFormsModule]
})
export class RegisterPage implements OnInit {

  registrationForm: FormGroup | any;
  loading = false;
  showPassword = false;
  rememberMe = false;
  isSubmitting = false;

  constructor(private fb: FormBuilder, private navCtrl: NavController, private clientService : ClientService, private platformService : PlatformService, private toastService : ToastService) {}

  ngOnInit() {
    this.registrationForm = this.fb.group({
      firstName: ['', [Validators.required, Validators.minLength(3)]],
      lastName: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      nic: ['', [Validators.required, Validators.pattern(/^[0-9]{9}[vVxX]?$|^[0-9]{12}$/)]],
      phone: ['', [Validators.required, Validators.pattern(/^[0-9]{10}$/)]],
      address: ['', [Validators.required, Validators.minLength(5)]],
      dob: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(6)]],
      retypePassword: ['', [Validators.required, Validators.minLength(6)]],
      agreement: [false, Validators.requiredTrue],
      url:['https://property-connect-bucket.s3.eu-north-1.amazonaws.com/profile-image.svg'],
      googleId: [''],
      status: ['active']
    });
  }

  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  onRegistration(): void {
    
    if (this.registrationForm.invalid){
      this.registrationForm.markAllAsTouched();
      this.toastService.show('Please fill alll the fields with valid details', {
        color: 'danger',
        position: 'bottom',
        duration: 3000
      });
      return;
    }

    if (this.registrationForm.get('agreement')?.invalid) {
      this.registrationForm.get('agreement')?.markAsTouched(); 
      return;
    }

    if(this.registrationForm.valid){
      const {retypePassword,agreement, ...rest } = this.registrationForm.value;
      const rawDob = new Date(rest.dob);
      const formattedDob = `${rawDob.getDate().toString().padStart(2, '0')}/${(rawDob.getMonth() + 1).toString().padStart(2, '0')}/${rawDob.getFullYear()}`;

      let client: any = {
        ...rest,
        dob: formattedDob
      };

      console.log(client);

      this.isSubmitting = true;
      
      this.clientService.postClientForm(client).subscribe(async(res:any) => {
        if(res.message === 'success'){
          // Simulate API delay
          this.platformService.updateTotalClients().subscribe(async(res:any) =>{
            this.isSubmitting = false;        
            this.toastService.show('Your account has been created successfully!', {
              color: 'primary',
              position: 'bottom',
              duration: 3000
            });
            this.prev();
            return
          })
        }
        if(res.Type === 'Joi'){
              this.isSubmitting = false;
              this.toastService.show('Please fill out all required fields', {
                color: 'danger',
                position: 'bottom',
                duration: 3000
              });
              return
        }
        if(res.Error === 'Email Already Exists!'){
          console.log(res.Error)
              this.isSubmitting = false;
              this.toastService.show('An account with this email already exists!', {
                color: 'danger',
                position: 'bottom',
                duration: 3000
              });
              return
        }
        if(res.message != 'success'){
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

  prev(){
    this.navCtrl.navigateBack('/login');
  }
}
