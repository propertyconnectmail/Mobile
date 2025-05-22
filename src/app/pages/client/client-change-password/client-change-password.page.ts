import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonContent } from '@ionic/angular/standalone';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AbstractControl, ValidationErrors, Validators, FormGroup, FormBuilder, ValidatorFn } from '@angular/forms';
import { NavController } from '@ionic/angular';
import { ClientService } from 'src/app/_services/client/client.service';
import { ToastService } from 'src/app/core/_services/toast/toast.service';


@Component({
  selector: 'app-client-change-password',
  templateUrl: './client-change-password.page.html',
  styleUrls: ['./client-change-password.page.scss'],
  standalone: true,
  imports: [IonContent, CommonModule, ReactiveFormsModule]
})
export class ClientChangePasswordPage implements OnInit {

  passwordForm: FormGroup;
  registrationForm: FormGroup; // For name/image/status display only

  isSubmitting = false;
  isLoadingImage = true;
  isLoadingName = true;

  showOldPassword = false;
  showNewPassword = false;
  showConfirmPassword = false;

  constructor(
    private fb: FormBuilder,
    private navCtrl: NavController,
    private clientService: ClientService,
    private toastService: ToastService
  ) {
    this.passwordForm = this.fb.group({
      oldPassword: ['', [Validators.required]],
      newPassword: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]]
    }, { validators: this.passwordMatchValidator });

    this.registrationForm = this.fb.group({
      firstName: [''],
      lastName: [''],
      url: [''],
      status: ['']
    });
  }

  ngOnInit() {
    const user = JSON.parse(localStorage.getItem('user')!);
    this.clientService.getClientForm({ email: user.email }).subscribe((res: any) => {
      this.registrationForm.patchValue(res);
      this.isLoadingImage = false;
      this.isLoadingName = false;
    });
  }

  passwordMatchValidator: ValidatorFn = (group: AbstractControl): ValidationErrors | null => {
    const newPassword = group.get('newPassword')?.value;
    const confirmPassword = group.get('confirmPassword')?.value;
    return newPassword === confirmPassword ? null : { passwordMismatch: true };
  };

  updatePassword() {
    if (this.passwordForm.invalid) {
      this.passwordForm.markAllAsTouched();
      this.toastService.show('Please fill out all fields correctly.', {
        color: 'danger',
        position: 'bottom',
        duration: 3000
      });
      return;
    }

    const user = JSON.parse(localStorage.getItem('user')!);
    const { oldPassword, newPassword } = this.passwordForm.value;
    this.isSubmitting = true;
    this.clientService.updateClientPassword({ email : user.email ,oldPassword : oldPassword, newPassword : newPassword }).subscribe(async(res:any)=> {
        if (res.message === 'success') {
          this.toastService.show('Password updated successfully!', {
            color: 'primary',
            position: 'bottom',
            duration: 3000
          });
          this.isSubmitting = false;
          this.navCtrl.navigateBack('/client-edit-profile');
          return;
        } 
        if (res.Error === 'Please Enter the Valid Old Password') {
          this.toastService.show('Please enter the correct old password!', {
            color: 'danger',
            position: 'bottom',
            duration: 3000
          });
          this.isSubmitting = false;
          return;
        } 
        else {
          this.toastService.show(res.message || 'Failed to update password. Please try again later!', {
            color: 'danger',
            position: 'bottom',
            duration: 3000
          });
          this.isSubmitting = false;
          return;
        }
      });
  }

  prev() {
    this.navCtrl.navigateBack('/client-edit-profile');
  }

  get f() {
    return this.passwordForm.controls;
  }
}
