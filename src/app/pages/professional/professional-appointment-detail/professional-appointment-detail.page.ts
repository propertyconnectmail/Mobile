import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader } from '@ionic/angular/standalone';
import {
  trigger,
  transition,
  style,
  animate,
  query,
  stagger
} from '@angular/animations';
import { NavController } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';
import { AppointmentService } from 'src/app/_services/appointment/appointment.service';
import { ProfessionalService } from 'src/app/_services/professional/professional.service';
import { ClientService } from 'src/app/_services/client/client.service';
import { UploadService } from 'src/app/_services/upload/upload.service';
import { ToastService } from 'src/app/core/_services/toast/toast.service';

@Component({
  selector: 'app-professional-appointment-detail',
  templateUrl: './professional-appointment-detail.page.html',
  styleUrls: ['./professional-appointment-detail.page.scss'],
  standalone: true,
  animations: [
    // Global fade-slide animation for cards
    trigger('fadeSlideIn', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(20px)' }),
        animate('400ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ])
    ]),

    // Staggered animation for checklist items
    trigger('listStagger', [
      transition(':enter', [
        query(':enter', [
          style({ opacity: 0, transform: 'translateY(20px)' }),
          stagger('100ms', [
            animate('300ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
          ])
        ], { optional: true })
      ])
    ]),

    // Lawyer image bounce
    trigger('bounceIn', [
      transition(':enter', [
        style({ transform: 'scale(0.8)', opacity: 0 }),
        animate('500ms cubic-bezier(0.175, 0.885, 0.32, 1.275)', style({ transform: 'scale(1)', opacity: 1 }))
      ])
    ])
  ],
  imports: [ IonContent, CommonModule, FormsModule]
})
export class ProfessionalAppointmentDetailPage implements OnInit {

  isLoading: boolean = true;
  hasDocuments: boolean = true;// Toggle this to false to test "no documents uploaded" view

  selectedCategory = 'appointment details';

  selectCategory(categoryValue: string) {
    this.selectedCategory = categoryValue;
  }

  categories = [
    { label: 'Appointment Details', value: 'appointment details' },
    { label: 'Client Details', value: 'client detail' },
    { label: 'Professional Details', value: 'lawyer detail' },
    { label: 'Payment Details', value: 'payment detail' }
  ];

  checklist = [
    { title: 'Contact Lawyer', duration: '3-4 Minutes', icon: 'check-circle.svg' },
    { title: 'Client uploaded required documents', duration: 'Less than 2 minutes', icon: 'upload.svg' },
    { title: 'Both parties attended the meeting', duration: '4-5 Minutes', icon: 'calendar.svg' },
    { title: 'Professional uploaded final documents', duration: '1-2 Minutes', icon: 'star.svg' }
  ];

  guidelines: string[] = [
    "Contact the lawyer and get the necessary details for the appointment",
    "Please arrive atleast 15 minutes early for the zoom meeting.",
    "Write down any questions for the lawyer and bring them along.",
    "Have necessary documents ready, like ID and insurance details etc.",
    "Once the meeting is over and professional has submitted related documents complete the appointment."
  ];

  uploadedDocs = [
    { name: 'Document 1', img: 'assets/appointment/word-icon.png' },
    { name: 'Document 2', img: 'assets/appointment/pdf-icon.png' },
    { name: 'Document 3', img: 'assets/appointment/pdf-icon.png' }
  ];

  appointment: any = {};
  client: any = {};
  professional:any = {};
  appointmentId: any = '';

  constructor(private toastService : ToastService, private uploadService: UploadService, private navCtrl: NavController,private route: ActivatedRoute, private appointmentService : AppointmentService, private professionalService : ProfessionalService, private clientService : ClientService) {}

  ngOnInit() {
    this.appointmentId = this.route.snapshot.queryParamMap.get('appointmentId');
    this.getAppointment();
  }

  async getAppointment(){
    this.appointmentService.getAppointment({appointmentId : this.appointmentId}).subscribe(async(res:any)=>{
      console.log(res)
      this.appointment = res;

      this.professionalService.getProfessionalForm({email : this.appointment.professionalEmail}).subscribe(async(professional:any)=>{
        this.professional = professional;
        this.clientService.getClientForm({email : this.appointment.clientEmail}).subscribe(async(client:any)=>{
          this.client=client;
          this.isLoading = false;
        })
      })
    })
  }

  prev(){
    this.navCtrl.back()
  }


  clientDocuments: File[] = [];
  professionalDocuments: File[] = [];

  handleFileUpload(event: any, userType: 'client' | 'professional') {
    const files: File[] = Array.from(event.target.files);
  
    const validMimeTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ];
  
    const invalidFiles = files.filter(file => !validMimeTypes.includes(file.type));
  
    if (invalidFiles.length > 0) {
      alert('Only .pdf, .doc, and .docx files are allowed.');
      event.target.value = ''; // Clear selection
      return;
    }
  
    if (userType === 'client') {
      this.clientDocuments = [...this.clientDocuments, ...files];
      console.log("Client files selected:", this.clientDocuments);
    } else {
      this.professionalDocuments = [...this.professionalDocuments, ...files];
      console.log("Professional files selected:", this.professionalDocuments);
    }
  
    event.target.value = ''; // Allow re-selection of the same files
  }


  uploadProfessionalDocuments() {
    if(this.appointment.professionalDocumentsUploaded === false){
      this.appointment.professionalDocumentsUploaded = true;
    }
    
    const formData = new FormData();
    this.professionalDocuments.forEach(file => {
      formData.append('certifications', file); // 'certifications' must match the Multer field name
    });


    this.uploadService.postProfessionalFiles(formData).subscribe(async(files:any)=>{
      this.appointment.professionalDocuments = files.fileUrls;
      this.professionalDocuments = [];
      this.appointmentService.updateAppointmentProfessionalFiles(this.appointment).subscribe(async(res:any)=>{
        console.log(res);
        if (res.message === 'success') {
            this.toastService.show('Documents uploaded successfully!', {
              color: 'primary',
              position: 'bottom',
              duration: 3000
            });
            this.getAppointment();
          } else {
            this.toastService.show('Failed to update documents.', {
              color: 'danger',
              position: 'bottom',
              duration: 3000
          });
        }
      })
    })
  }
  

  downloadDocuments(userType: 'client' | 'professional') {
    const docs = userType === 'client' ? this.appointment.clientDocuments : this.appointment.professionalDocuments;
    if (docs.length === 0) return;

    const apiUrl = 'https://propertconnectbackend.onrender.com/api/certifications/download-zip';
    const params = new URLSearchParams();
    docs.forEach((url: string) => params.append('urls', url));

    const downloadUrl = `${apiUrl}?${params.toString()}`;
    window.open(downloadUrl, '_blank');
  }


  contactProfessional() {
    const phone = this.client?.phone;
    if (phone) {
      window.open(`tel:${phone}`, '_system');
    } else {
      alert('Phone number not available');
    }
  }

  emailProfessional() {
    const email = this.client?.email;
    if (email) {
      const subject = encodeURIComponent('Regarding Appointment');
      const body = encodeURIComponent('Hi, I have a question regarding our scheduled appointment.');
      window.open(`mailto:${email}?subject=${subject}&body=${body}`, '_system');
    } else {
      alert('Email address not available');
    }
  }

  openZoomMeeting() {
    if(this.appointment.zoomMeetingCompletedProfessional === false){
      this.appointment.zoomMeetingCompletedProfessional = true;
      this.appointmentService.updateAppointment(this.appointment).subscribe(async(res:any)=>{
        this.getAppointment();
        console.log(res)
      })
    }
    const zoomLink = this.appointment?.zoomStartLink;
    if (zoomLink) {
      window.open(zoomLink, '_blank');
    } else {
      alert('Zoom meeting link not available');
    }
  }

}
