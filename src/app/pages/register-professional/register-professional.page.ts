import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonContent, IonCheckbox } from '@ionic/angular/standalone';
import {Validators, FormGroup, FormBuilder } from '@angular/forms';
import { NavController } from '@ionic/angular';
import { PlatformService } from 'src/app/core/_services/platform/platform.service';
import { ToastService } from 'src/app/core/_services/toast/toast.service';
import { ProfessionalService } from 'src/app/_services/professional/professional.service';
import { UploadService } from 'src/app/_services/upload/upload.service';

@Component({
  selector: 'app-register-professional',
  templateUrl: './register-professional.page.html',
  styleUrls: ['./register-professional.page.scss'],
  standalone: true,
  imports: [IonContent,IonCheckbox, CommonModule, FormsModule, ReactiveFormsModule]
})
export class RegisterProfessionalPage implements OnInit {

  registrationForm!: FormGroup;
  isSubmitting = false;
  showPassword = false;
  selectedCertifications: File[] = [];

  basicFields = [
    { label: 'First Name', controlName: 'firstName', type: 'text', placeholder: 'Your First Name', error: 'First name is required' },
    { label: 'Last Name', controlName: 'lastName', type: 'text', placeholder: 'Your Last Name', error: 'Last name is required' },
    { label: 'Email', controlName: 'email', type: 'email', placeholder: 'Your Email', error: 'Enter a valid email' },
    { label: 'NIC Number', controlName: 'nic', type: 'text', placeholder: 'Your NIC', error: 'Enter a valid NIC' },
    { label: 'Phone', controlName: 'phone', type: 'tel', placeholder: 'Your Phone', error: 'Enter a valid phone number' },
    { label: 'Address', controlName: 'address', type: 'text', placeholder: 'Your Address', error: 'Address is required' },
  ];

  constructor( private fb: FormBuilder,private navCtrl: NavController,private professionalService: ProfessionalService,private platformService: PlatformService,private toastService: ToastService, private uploadService : UploadService ) {}

  ngOnInit(): void {
    this.registrationForm = this.fb.group({
      firstName: ['', [Validators.required, Validators.minLength(3)]],
      lastName: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      nic: ['', [Validators.required, Validators.pattern(/^[0-9]{9}[vVxX]?$|^[0-9]{12}$/)]],
      phone: ['', [Validators.required, Validators.pattern(/^[0-9]{10}$/)]],
      address: ['', [Validators.required, Validators.minLength(5)]],
      dob: ['', Validators.required],
      experience: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(6)]],
      retypePassword: ['', [Validators.required, Validators.minLength(6)]],
      type: ['', Validators.required],
      agreement: [false, Validators.requiredTrue],
      url: ['https://property-connect-bucket.s3.eu-north-1.amazonaws.com/profile-image.svg'],
      googleId: [''],
      status: ['pending'],
      consultationFee: ['',[Validators.required]],
      totalRating: ['0'],
      totalCount: ['0'],
      averageRating: ['0'],
      about: ['',[Validators.required]],
      consults: ['0'],
      certifications: [[]]
    });
  }

  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  handleCertUpload(event: any) {
    const files: File[] = Array.from(event.target.files);
    const validTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    const validFiles = files.filter(file => validTypes.includes(file.type));

    if (!validFiles.length) {
      this.toastService.show('Only PDF, DOC, or DOCX files are allowed.', {
        color: 'danger',
        duration: 3000,
        position: 'bottom'
      });
      return;
    }

    this.selectedCertifications = validFiles;
  }

  onRegistration() {
    if (this.registrationForm.invalid) {
      this.registrationForm.markAllAsTouched();
      this.toastService.show('Please fill all required fields correctly.', {
        color: 'danger',
        position: 'bottom',
        duration: 3000
      });
      return;
    }

    if (!this.selectedCertifications.length) {
      this.toastService.show('Please upload at least one certification document.', {
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

    this.isSubmitting = true;

    try {

      if(this.registrationForm.valid){
        const formData = new FormData();
        this.selectedCertifications.forEach(file => formData.append('certifications', file));
        this.uploadService.postProfessionalFiles(formData).subscribe(async(res:any)=>{
          const { retypePassword, agreement, ...rest } = this.registrationForm.value;
          const rawDob = new Date(rest.dob);
          const formattedDob = `${rawDob.getDate().toString().padStart(2, '0')}/${(rawDob.getMonth() + 1).toString().padStart(2, '0')}/${rawDob.getFullYear()}`;
          const dataToSend = {
            ...rest,
            consultationFee: String(rest.consultationFee),
            experience: String(rest.experience),
            dob: formattedDob
          };
          dataToSend.certifications = res.fileUrls;
          this.professionalService.postProfessionalForm(dataToSend).subscribe(async (res: any) => {
            console.log(res)
            if(res.message === 'success'){
              // Simulate API delay
              this.platformService.updateTotalProfessionals().subscribe(async(res:any) =>{
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
          });
        })
      }
    } catch (err) {
      this.isSubmitting = false;
      this.toastService.show('File upload failed. Please try again.', {
        color: 'danger',
        duration: 3000,
        position: 'bottom'
      });
    }
  }

  prev() {
    this.navCtrl.navigateBack('/login-professional');
  }
}
