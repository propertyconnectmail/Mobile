import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonContent, IonHeader, IonTitle, IonToolbar } from '@ionic/angular/standalone';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AbstractControl, ValidationErrors, Validators, FormGroup, FormBuilder, ValidatorFn } from '@angular/forms';
import { NavController } from '@ionic/angular';
import { ClientService } from 'src/app/_services/client/client.service';
import { ToastService } from 'src/app/core/_services/toast/toast.service';
import { UploadService } from 'src/app/_services/upload/upload.service';

@Component({
  selector: 'app-client-edit-profile',
  templateUrl: './client-edit-profile.page.html',
  styleUrls: ['./client-edit-profile.page.scss'],
  standalone: true,
  imports: [IonContent,CommonModule, FormsModule, ReactiveFormsModule]
})
export class ClientEditProfilePage implements OnInit {

  registrationForm: FormGroup;
  isSubmitting = false;
  isLoadingImage = true;
  isLoadingName = true;

  constructor(private fb: FormBuilder,private navCtrl: NavController,private clientService: ClientService,private toastService: ToastService, private uploadService : UploadService) {
    this.registrationForm = this.fb.group({
      firstName: ['', [Validators.required, Validators.minLength(3)]],
      lastName: ['', [Validators.required, Validators.minLength(3)]],
      email: [{ value: '', disabled: true }, [Validators.required, Validators.email]],
      nic: ['', [Validators.required, Validators.pattern(/^[0-9]{9}[vVxX]?$|^[0-9]{12}$/)]],
      phone: ['', [Validators.required, Validators.pattern(/^[0-9]{10}$/)]],
      address: ['', [Validators.required, Validators.minLength(5)]],
      dob: ['', Validators.required],
      url: [''],
      password: [''],
      googleId: [''],
      status: ['']
    });
  }

  ngOnInit() {
    const user = JSON.parse(localStorage.getItem('user')!);
    this.clientService.getClientForm({ email: user.email }).subscribe((res: any) => {

      if (res.dob && typeof res.dob === 'string') {
        const parts = res.dob.split('/');
        if (parts.length === 3) {
          // Convert dd/mm/yyyy to yyyy-MM-dd
          res.dob = `${parts[2]}-${parts[1].padStart(2, '0')}-${parts[0].padStart(2, '0')}`;
        }
      }
      this.registrationForm.patchValue(res);
      this.isLoadingImage = false;
      this.isLoadingName = false;
    });
  }

  prev() {
    this.navCtrl.navigateBack('/client-profile');
  }

  updateProfile() {
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
      const { ...rest } = this.registrationForm.getRawValue();

      const rawDob = new Date(rest.dob);
      const formattedDob = `${rawDob.getDate().toString().padStart(2, '0')}/${(rawDob.getMonth() + 1).toString().padStart(2, '0')}/${rawDob.getFullYear()}`;

      let client: any = {
        ...rest,
        dob: formattedDob
      };

      this.isSubmitting = true;
      
      this.clientService.updateClientForm(client).subscribe(async(res:any) => {
        console.log(res)
        if(res.message === 'success'){
          this.toastService.show('Your account has been updated successfully!', {
            color: 'primary',
            position: 'bottom',
            duration: 3000
          });
          this.isSubmitting = false;
          return
        }
        if(res.Type === 'Joi'){
              this.isSubmitting = false;
              this.toastService.show('Please enter valid details!', {
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

  get f() {
    return this.registrationForm.controls;
  }

  changePassword(){
    this.navCtrl.navigateForward('/client-change-password')
  }


  onImageSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) return;
  
    const file = input.files[0];
    const allowedTypes = ['image/png', 'image/jpeg', 'image/jpg'];
  
    if (!allowedTypes.includes(file.type)) {
      alert('Only PNG, JPG, and JPEG formats are allowed.');
      return;
    }

    const formData = new FormData();
    formData.append('image', file);
  
    // Call your service to upload the image
    this.uploadService.postImage(formData).subscribe(async(res:any)=>{
      if(res.message === "File uploaded successfully"){
        console.log(res)
        this.clientService.updateProfilePicture({email : this.registrationForm.get('email')?.value, url : res.fileUrl}).subscribe(async(updated:any)=>{
          if(updated.message === "success"){
            console.log(updated.url)
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
        })
      }else{
        this.toastService.show('Image upload failed. Try again later!', {
          color: 'danger',
          position: 'bottom',
          duration: 3000
        });
        return;
      }
    })
  }
  
  
}
