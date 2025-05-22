import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonContent } from '@ionic/angular/standalone';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AbstractControl, ValidationErrors, Validators, FormGroup, FormBuilder, ValidatorFn } from '@angular/forms';
import { NavController } from '@ionic/angular';
import { ToastService } from 'src/app/core/_services/toast/toast.service';
import { UploadService } from 'src/app/_services/upload/upload.service';
import { ProfessionalService } from 'src/app/_services/professional/professional.service';

@Component({
  selector: 'app-professional-certifications',
  templateUrl: './professional-certifications.page.html',
  styleUrls: ['./professional-certifications.page.scss'],
  standalone: true,
  imports: [IonContent, CommonModule, FormsModule, ReactiveFormsModule]
})
export class ProfessionalCertificationsPage implements OnInit {

  registrationForm!: FormGroup;
  isSubmitting = false;
  isLoadingImage = true;
  isLoadingName = true;
  selectedCertifications: File[] = [];
  orginalCertifications = [];
  professionalData : any = {};

  constructor(private fb: FormBuilder,private navCtrl: NavController, private professionalService: ProfessionalService, private toastService: ToastService,private uploadService: UploadService ) {}

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

      this.orginalCertifications = res.certifications;
      this.professionalData = res;
      this.registrationForm.patchValue(res);
      this.isLoadingImage = false;
      this.isLoadingName = false;
    });
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

  prev() {
    this.navCtrl.navigateBack('/professional-profile');
  }


  uploadFiles(){
    
    const formData = new FormData();
    this.selectedCertifications.forEach(file => {
      formData.append('certifications', file); // 'certifications' must match the Multer field name
    });


    this.isSubmitting = true;
    this.uploadService.postProfessionalFiles(formData).subscribe(async(files:any)=>{
      if (files.fileUrls && Array.isArray(files.fileUrls)) {
        const updatedData = {
          ...this.professionalData,
          certifications: files.fileUrls
        };

        this.professionalService.updateProfessionalForm(updatedData).subscribe(async(res: any) => {
          console.log(res);
          if (res.message === 'success') {
            this.toastService.show('Certifications updated successfully!', {
              color: 'primary',
              position: 'bottom',
              duration: 3000
            });
            this.isSubmitting = false;
            this.prev();
          } else {
            this.toastService.show('Failed to update certifications.', {
              color: 'danger',
              position: 'bottom',
              duration: 3000
            });
            this.isSubmitting = false;
          }
        });
      }
    })
  }

  downloadFiles(){
    const docs = this.orginalCertifications;
    if (docs.length === 0) return;

    const apiUrl = 'https://propertconnectbackend.onrender.com/api/certifications/download-zip';
    const params = new URLSearchParams();
    docs.forEach((url: string) => params.append('urls', url));

    const downloadUrl = `${apiUrl}?${params.toString()}`;
    window.open(downloadUrl, '_blank');
  }

}
