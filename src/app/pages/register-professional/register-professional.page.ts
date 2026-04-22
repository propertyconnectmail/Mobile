import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonContent, IonCheckbox } from '@ionic/angular/standalone';
import { Validators, FormGroup, FormBuilder } from '@angular/forms';
import { NavController } from '@ionic/angular';
import { PlatformService } from 'src/app/core/_services/platform/platform.service';
import { ToastService } from 'src/app/core/_services/toast/toast.service';
import { ProfessionalService } from 'src/app/_services/professional/professional.service';
import { UploadService } from 'src/app/_services/upload/upload.service';
import { Camera, CameraDirection, CameraResultType, CameraSource } from '@capacitor/camera';
import { Capacitor } from '@capacitor/core';

interface RequiredDocument {
  name: string;
  optional: boolean;
}

@Component({
  selector: 'app-register-professional',
  templateUrl: './register-professional.page.html',
  styleUrls: ['./register-professional.page.scss'],
  standalone: true,
  imports: [IonContent, IonCheckbox, CommonModule, FormsModule, ReactiveFormsModule]
})
export class RegisterProfessionalPage implements OnInit {

  registrationForm!: FormGroup;
  isSubmitting = false;
  showPassword = false;
  selectedCertifications: File[] = [];

  // Popup states
  showRequiredDocsPopup = false;
  showTermsPopup = false;
  selectedProfessionalType = '';

  // Selfie capture
  capturedSelfie: string | null = null;
  identityImageUrl: string | null = null;

  basicFields = [
    { label: 'First Name', controlName: 'firstName', type: 'text', placeholder: 'Your First Name', error: 'First name is required' },
    { label: 'Last Name', controlName: 'lastName', type: 'text', placeholder: 'Your Last Name', error: 'Last name is required' },
    { label: 'Email', controlName: 'email', type: 'email', placeholder: 'Your Email', error: 'Enter a valid email' },
    { label: 'NIC Number', controlName: 'nic', type: 'text', placeholder: 'Your NIC', error: 'Enter a valid NIC' },
    { label: 'Phone', controlName: 'phone', type: 'tel', placeholder: 'Your Phone', error: 'Enter a valid phone number' },
    { label: 'Address', controlName: 'address', type: 'text', placeholder: 'Your Address', error: 'Address is required' },
  ];

  // Province and District data
  provinces: string[] = ['Western', 'Central', 'Southern', 'Northern', 'Eastern', 'North Western', 'North Central', 'Uva', 'Sabaragamuwa'];
  districts: string[] = [];
  districtsByProvince: { [key: string]: string[] } = {
    'Western': ['Colombo', 'Gampaha', 'Kalutara'],
    'Central': ['Kandy', 'Matale', 'Nuwara Eliya'],
    'Southern': ['Galle', 'Matara', 'Hambantota'],
    'Northern': ['Jaffna', 'Kilinochchi', 'Mannar', 'Mullaitivu', 'Vavuniya'],
    'Eastern': ['Batticaloa', 'Ampara', 'Trincomalee'],
    'North Western': ['Kurunegala', 'Puttalam'],
    'North Central': ['Anuradhapura', 'Polonnaruwa'],
    'Uva': ['Badulla', 'Monaragala'],
    'Sabaragamuwa': ['Ratnapura', 'Kegalle']
  };

  // Required documents per professional type
  requiredDocuments: { [key: string]: RequiredDocument[] } = {
    lawyer: [
      { name: 'Copy of Attorney-at-Law Certificate', optional: false },
      { name: 'Sri Lanka Bar Association Registration', optional: false },
      { name: 'NIC / Passport', optional: false },
      { name: 'Office Address Proof (utility bill / lease)', optional: false },
      { name: 'Years of experience / specialization proof', optional: true }
    ],
    surveyor: [
      { name: 'Surveyor License issued by Survey Department of Sri Lanka', optional: false },
      { name: 'Registration Number', optional: false },
      { name: 'NIC / Passport', optional: false },
      { name: 'Sample Survey Plans (for credibility)', optional: true }
    ],
    valuer: [
      { name: 'Certification from Institute of Valuers of Sri Lanka', optional: false },
      { name: 'Government-approved valuer registration (if applicable)', optional: false },
      { name: 'NIC / Passport', optional: false },
      { name: 'Past valuation reports', optional: true }
    ]
  };

  constructor(
    private fb: FormBuilder,
    private navCtrl: NavController,
    private professionalService: ProfessionalService,
    private platformService: PlatformService,
    private toastService: ToastService,
    private uploadService: UploadService
  ) {}

  ngOnInit(): void {
    this.registrationForm = this.fb.group({
      firstName: ['', [Validators.required, Validators.minLength(3)]],
      lastName: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      nic: ['', [Validators.required, Validators.pattern(/^[0-9]{9}[vVxX]?$|^[0-9]{12}$/)]],
      phone: ['', [Validators.required, Validators.pattern(/^[0-9]{10}$/)]],
      address: ['', [Validators.required, Validators.minLength(5)]],
      province: ['', Validators.required],
      district: ['', Validators.required],
      dob: ['', Validators.required],
      experience: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(6)]],
      retypePassword: ['', [Validators.required, Validators.minLength(6)]],
      type: ['', Validators.required],
      agreement: [false, Validators.requiredTrue],
      url: ['https://property-connect-bucket.s3.eu-north-1.amazonaws.com/profile-image.svg'],
      googleId: [''],
      status: ['pending'],
      consultationFee: ['', [Validators.required]],
      totalRating: ['0'],
      totalCount: ['0'],
      averageRating: ['0'],
      about: ['', [Validators.required]],
      consults: ['0'],
      certifications: [[]]
    });
  }

  // Province change handler
  onProvinceChange() {
    const selectedProvince = this.registrationForm.get('province')?.value;
    this.registrationForm.get('district')?.setValue('');
    if (selectedProvince) {
      this.districts = this.districtsByProvince[selectedProvince] || [];
    } else {
      this.districts = [];
    }
  }

  // Professional type change handler
  onProfessionalTypeChange(): void {
    const type = this.registrationForm.get('type')?.value;
    if (type) {
      this.selectedProfessionalType = type;
      this.showRequiredDocsPopup = true;
    }
  }

  // Get required documents for selected type
  getRequiredDocuments(): RequiredDocument[] {
    return this.requiredDocuments[this.selectedProfessionalType] || [];
  }

  // Required Documents Popup methods
  openRequiredDocsPopup(): void {
    this.selectedProfessionalType = this.registrationForm.get('type')?.value;
    if (this.selectedProfessionalType) {
      this.showRequiredDocsPopup = true;
    }
  }

  closeRequiredDocsPopup(): void {
    this.showRequiredDocsPopup = false;
  }

  // Terms & Conditions Popup methods
  openTermsPopup(): void {
    this.showTermsPopup = true;
  }

  closeTermsPopup(): void {
    this.showTermsPopup = false;
  }

  acceptTerms(): void {
    this.registrationForm.get('agreement')?.setValue(true);
    this.showTermsPopup = false;
    this.toastService.show('Terms & Conditions accepted!', {
      color: 'primary',
      position: 'bottom',
      duration: 2000
    });
  }

  // Camera methods - with browser/native detection
  async captureFace() {
    try {
      const isNative = Capacitor.isNativePlatform();

      const image = await Camera.getPhoto({
        quality: 90,
        allowEditing: false,
        resultType: CameraResultType.Base64,
        source: isNative ? CameraSource.Camera : CameraSource.Photos,
        direction: CameraDirection.Front
      });

      this.capturedSelfie = `data:image/jpeg;base64,${image.base64String}`;

      const selfieFile = this.base64ToFile(this.capturedSelfie, 'identity-selfie.jpg');
      const formData = new FormData();
      formData.append('image', selfieFile);

      this.uploadService.postImage(formData).subscribe((res: any) => {
        if (res.message === 'File uploaded successfully') {
          this.identityImageUrl = res.fileUrl;
          this.toastService.show('Photo uploaded successfully!', {
            color: 'primary',
            position: 'bottom',
            duration: 2000
          });
        }
      }, (error) => {
        console.error('Upload error:', error);
        this.toastService.show('Failed to upload photo. Please try again.', {
          color: 'danger',
          position: 'bottom',
          duration: 3000
        });
      });
    } catch (error) {
      console.error('Camera error:', error);
    }
  }

  retakeSelfie() {
    this.capturedSelfie = null;
    this.identityImageUrl = null;
  }

  base64ToFile(base64: string, filename: string): File {
    const arr = base64.split(',');
    const mime = arr[0].match(/:(.*?);/)![1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, { type: mime });
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

    if (!this.identityImageUrl) {
      this.toastService.show('Please take a photo for identity verification.', {
        color: 'danger',
        position: 'bottom',
        duration: 3000
      });
      return;
    }

    if (this.registrationForm.get('agreement')?.invalid) {
      this.registrationForm.get('agreement')?.markAsTouched();
      this.toastService.show('Please accept the Terms & Conditions.', {
        color: 'danger',
        position: 'bottom',
        duration: 3000
      });
      return;
    }

    // Check password match
    const password = this.registrationForm.get('password')?.value;
    const retypePassword = this.registrationForm.get('retypePassword')?.value;
    if (password !== retypePassword) {
      this.toastService.show('Passwords do not match.', {
        color: 'danger',
        position: 'bottom',
        duration: 3000
      });
      return;
    }

    this.isSubmitting = true;

    try {
      if (this.registrationForm.valid) {
        const formData = new FormData();
        this.selectedCertifications.forEach(file => formData.append('certifications', file));

        this.uploadService.postProfessionalFiles(formData).subscribe(async (res: any) => {
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
          dataToSend.identityImage = this.identityImageUrl;

          this.professionalService.postProfessionalForm(dataToSend).subscribe(async (res: any) => {
            console.log(res);
            if (res.message === 'success') {
              this.platformService.updateTotalProfessionals().subscribe(async (res: any) => {
                this.isSubmitting = false;
                this.toastService.show('Your account has been created successfully!', {
                  color: 'primary',
                  position: 'bottom',
                  duration: 3000
                });
                this.prev();
                return;
              });
            }
            if (res.Type === 'Joi') {
              this.isSubmitting = false;
              this.toastService.show('Please fill out all required fields', {
                color: 'danger',
                position: 'bottom',
                duration: 3000
              });
              return;
            }
            if (res.Error === 'Email Already Exists!') {
              console.log(res.Error);
              this.isSubmitting = false;
              this.toastService.show('An account with this email already exists!', {
                color: 'danger',
                position: 'bottom',
                duration: 3000
              });
              return;
            }
            if (res.message != 'success') {
              this.isSubmitting = false;
              this.toastService.show('Something went wrong. Please try again Later!', {
                color: 'danger',
                position: 'bottom',
                duration: 3000
              });
              return;
            }
          });
        });
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