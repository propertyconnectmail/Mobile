import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonContent, IonHeader, IonTitle, IonToolbar } from '@ionic/angular/standalone';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AbstractControl, ValidationErrors, Validators, FormGroup, FormBuilder, ValidatorFn } from '@angular/forms';
import { NavController } from '@ionic/angular';
import { ToastService } from 'src/app/core/_services/toast/toast.service';
import { UploadService } from 'src/app/_services/upload/upload.service';
import { ProfessionalService } from 'src/app/_services/professional/professional.service';

@Component({
  selector: 'app-professional-edit-profile',
  templateUrl: './professional-edit-profile.page.html',
  styleUrls: ['./professional-edit-profile.page.scss'],
  standalone: true,
  imports: [IonContent, CommonModule, FormsModule, ReactiveFormsModule]
})
export class ProfessionalEditProfilePage implements OnInit {

  registrationForm!: FormGroup;
  isSubmitting = false;
  isLoadingImage = true;
  isLoadingName = true;

  constructor(
    private fb: FormBuilder,
    private navCtrl: NavController,
    private professionalService: ProfessionalService,
    private toastService: ToastService,
    private uploadService: UploadService
  ) {}

  ngOnInit() {
    this.registrationForm = this.fb.group({
      firstName: ['', [Validators.required, Validators.minLength(3)]],
      lastName: ['', [Validators.required, Validators.minLength(3)]],
      email: [{ value: '', disabled: true }],
      nic: ['', [Validators.required, Validators.pattern(/^[0-9]{9}[vVxX]?$|^[0-9]{12}$/)]],
      phone: ['', [Validators.required, Validators.pattern(/^[0-9]{10}$/)]],
      address: ['', [Validators.required, Validators.minLength(5)]],
      dob: ['', Validators.required],
      url: [''],
      status: [''],
      experience: ['', Validators.required],
      consultationFee: ['', Validators.required],
      about: ['', Validators.required],
      password: [''],
      googleId: [''],
      certifications: [[]]
    });

    const user = JSON.parse(localStorage.getItem('user')!);
    this.professionalService.getProfessionalForm({ email: user.email }).subscribe((res: any) => {
      if (res.dob && typeof res.dob === 'string') {
        const parts = res.dob.split('/');
        if (parts.length === 3) {
          res.dob = `${parts[2]}-${parts[1].padStart(2, '0')}-${parts[0].padStart(2, '0')}`;
        }
      }

      this.registrationForm.patchValue(res);
      this.isLoadingImage = false;
      this.isLoadingName = false;
    });
  }

  prev() {
    this.navCtrl.navigateBack('/professional-profile');
  }

  updateProfile() {
    if (this.registrationForm.invalid) {
      this.registrationForm.markAllAsTouched();
      this.toastService.show('Please fill all required fields correctly.', {
        color: 'danger',
        position: 'bottom',
        duration: 3000
      });
      return;
    }

    const { ...rest } = this.registrationForm.getRawValue();
    const rawDob = new Date(rest.dob);
    const formattedDob = `${rawDob.getDate().toString().padStart(2, '0')}/${(rawDob.getMonth() + 1)
      .toString()
      .padStart(2, '0')}/${rawDob.getFullYear()}`;

    const updatedProfessional = {
      ...rest,
      dob: formattedDob,
      consultationFee: String(rest.consultationFee),
      experience: String(rest.experience)
    };

    this.isSubmitting = true;

    this.professionalService.updateProfessionalForm(updatedProfessional).subscribe(async(res: any) => {
        this.isSubmitting = false;
        console.log(res)
        if (res.message === 'success') {
          this.toastService.show('Profile updated successfully!', {
            color: 'primary',
            position: 'bottom',
            duration: 3000
          });
        } else if (res.Type === 'Joi') {
          this.toastService.show('Please enter valid details!', {
            color: 'danger',
            position: 'bottom',
            duration: 3000
          });
        } else {
          this.toastService.show('Something went wrong. Please try again later.', {
            color: 'danger',
            position: 'bottom',
            duration: 3000
          });
        }
      },
      () => {
        this.isSubmitting = false;
        this.toastService.show('Update failed. Please try again later.', {
          color: 'danger',
          position: 'bottom',
          duration: 3000
        });
      }
    );
  }

  onImageSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (!input.files?.length) return;

    const file = input.files[0];
    const allowedTypes = ['image/png', 'image/jpeg', 'image/jpg'];
    if (!allowedTypes.includes(file.type)) {
      this.toastService.show('Only PNG, JPG, and JPEG formats are allowed.', {
        color: 'danger',
        position: 'bottom',
        duration: 3000
      });
      return;
    }

    const formData = new FormData();
    formData.append('image', file);

    this.uploadService.postImage(formData).subscribe((res: any) => {
      if (res.message === 'File uploaded successfully') {
        this.professionalService
          .updateProfilePicture({ email: this.registrationForm.get('email')?.value, url: res.fileUrl }).subscribe((updated: any) => {
            if(updated.message === "success"){
              this.registrationForm.get('url')?.setValue(updated.url as string);
              this.toastService.show('Updated profile picture successfully!', {
                color: 'primary',
                position: 'bottom',
                duration: 3000
              });
              
              return;
            }else{
              this.toastService.show('Image upload failed. Try again later!', {
                color: 'danger',
                position: 'bottom',
                duration: 3000
              });
              return;
            }
          });
      }
    });
  }

  get f() {
    return this.registrationForm.controls;
  }

  changePassword() {
    this.navCtrl.navigateForward('/professional-change-password');
  }
  
}
