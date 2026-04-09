import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent } from '@ionic/angular/standalone';
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
  selector: 'app-client-appointment-detail',
  templateUrl: './client-appointment-detail.page.html',
  styleUrls: ['./client-appointment-detail.page.scss'],
  standalone: true,
  animations: [
    trigger('fadeSlideIn', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(20px)' }),
        animate('400ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ])
    ]),
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
    trigger('bounceIn', [
      transition(':enter', [
        style({ transform: 'scale(0.8)', opacity: 0 }),
        animate('500ms cubic-bezier(0.175, 0.885, 0.32, 1.275)', style({ transform: 'scale(1)', opacity: 1 }))
      ])
    ])
  ],
  imports: [IonContent, CommonModule, FormsModule]
})
export class ClientAppointmentDetailPage implements OnInit {
  isLoading: boolean = true;
  hasDocuments: boolean = true;
  selectedCategory = 'appointment details';

  categories = [
    { label: 'Appointment', value: 'appointment details' },
    { label: 'Complaints', value: 'complaint details' },
    { label: 'Client', value: 'client detail' },
    { label: 'Professional', value: 'lawyer detail' },
    { label: 'Payment', value: 'payment detail' }
  ];

  guidelines: string[] = [
    "Contact the lawyer and get the necessary details for the appointment",
    "Please arrive at least 15 minutes early for the zoom meeting.",
    "Write down any questions for the lawyer and bring them along.",
    "Have necessary documents ready, like ID and insurance details etc.",
    "Once the meeting is over and professional has submitted related documents complete the appointment."
  ];

  appointment: any = {};
  client: any = {};
  professional: any = {};
  isSubmitting = false;
  appointmentId: any = '';

  // Feedback/Complaint System
  showFeedbackModal = false;
  feedbackSatisfied: boolean | null = null;
  selectedComplaintType: string = '';
  complaintMessage: string = '';
  isSubmittingFeedback = false;

  complaintTypes = [
    { label: 'Service Quality', value: 'service' },
    { label: 'Professional Behavior', value: 'behavior' },
    { label: 'Technical Issues', value: 'technical' },
    { label: 'Payment Issues', value: 'payment' },
    { label: 'Other', value: 'other' }
  ];

  // Complaint type labels for display
  complaintTypeLabels: { [key: string]: string } = {
    'service': 'Service Quality',
    'behavior': 'Professional Behavior',
    'technical': 'Technical Issues',
    'payment': 'Payment Issues',
    'communication': 'Communication Issues',
    'no_show': 'No Show',
    'other': 'Other'
  };

  constructor(
    private toastService: ToastService,
    private uploadService: UploadService,
    private navCtrl: NavController,
    private route: ActivatedRoute,
    private appointmentService: AppointmentService,
    private professionalService: ProfessionalService,
    private clientService: ClientService
  ) {}

  ngOnInit() {
    this.appointmentId = this.route.snapshot.queryParamMap.get('appointmentId');
    this.getAppointment();
  }

  selectCategory(categoryValue: string) {
    this.selectedCategory = categoryValue;
  }

  async getAppointment() {
    this.appointmentService.getAppointment({ appointmentId: this.appointmentId }).subscribe(async (res: any) => {
      console.log(res);
      this.appointment = res;
      this.professionalService.getProfessionalForm({ email: this.appointment.professionalEmail }).subscribe(async (professional: any) => {
        this.professional = professional;
        this.clientService.getClientForm({ email: this.appointment.clientEmail }).subscribe(async (client: any) => {
          this.client = client;
          this.isLoading = false;
        });
      });
    });
  }

  prev() {
    this.navCtrl.back();
  }

  // ============ STATUS DISPLAY HELPERS ============
  getStatusDisplay(status: string): string {
    switch(status) {
      case 'ongoing': return 'Ongoing';
      case 'completed': return 'Completed';
      case 'under_review': return 'Under Review';
      default: return status ? status.charAt(0).toUpperCase() + status.slice(1) : '';
    }
  }

  getComplaintTypeLabel(type: string): string {
    return this.complaintTypeLabels[type] || type;
  }

  getClientFeedbackBadge(): string {
    if (!this.appointment?.clientFeedback?.submittedAt) return 'Pending';
    return this.appointment.clientFeedback.satisfied ? 'Satisfied' : 'Complaint';
  }

  getProfessionalFeedbackBadge(): string {
    if (!this.appointment?.professionalFeedback?.submittedAt) return 'Pending';
    return this.appointment.professionalFeedback.satisfied ? 'Satisfied' : 'Complaint';
  }

  // ============ BUTTON VISIBILITY LOGIC ============
  canShowCompleteButton(): boolean {
    // Don't show if appointment already completed
    if (this.appointment?.appointmentStatus === 'completed') return false;
    
    // Don't show if client already completed their part
    if (this.appointment?.appointmentCompletedByClient === true) return false;
    
    // Don't show if professional hasn't uploaded documents yet
    if (this.appointment?.professionalDocumentsUploaded !== true) return false;
    
    // Show the button - client can submit feedback even if there's an existing complaint from professional
    return true;
  }

  showComplaintWarning(): boolean {
    // Show warning if:
    // 1. Client has completed (satisfied)
    // 2. There's an active complaint (not resolved)
    // 3. The complaint is from the professional (not from client)
    
    if (this.appointment?.appointmentCompletedByClient === true &&
        this.appointment?.clientFeedback?.satisfied === true &&
        this.appointment?.hasComplaint === true &&
        this.appointment?.complaintStatus !== 'resolved' &&
        this.appointment?.professionalFeedback?.satisfied === false) {
      return true;
    }
    return false;
  }

  showWaitingMessage(): boolean {
    // Show waiting message if:
    // 1. Client has completed (satisfied)
    // 2. No active complaints OR complaint is resolved
    // 3. Professional hasn't completed yet
    
    if (this.appointment?.appointmentCompletedByClient === true &&
        this.appointment?.clientFeedback?.satisfied === true &&
        this.appointment?.appointmentCompletedByProfessional !== true &&
        (!this.appointment?.hasComplaint || this.appointment?.complaintStatus === 'resolved')) {
      return true;
    }
    return false;
  }

  // ============ FILE HANDLING ============
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
      event.target.value = '';
      return;
    }
    if (userType === 'client') {
      this.clientDocuments = [...this.clientDocuments, ...files];
    } else {
      this.professionalDocuments = [...this.professionalDocuments, ...files];
    }
    event.target.value = '';
  }

  uploadClientDocuments() {
    if (this.appointment.clientDocumentsUploaded === false) {
      this.appointment.clientDocumentsUploaded = true;
    }
    const formData = new FormData();
    this.clientDocuments.forEach(file => {
      formData.append('certifications', file);
    });
    this.uploadService.postProfessionalFiles(formData).subscribe(async (files: any) => {
      this.appointment.clientDocuments = files.fileUrls;
      this.clientDocuments = [];
      this.appointmentService.updateAppointmentClientFiles(this.appointment).subscribe(async (res: any) => {
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
      });
    });
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

  // ============ CONTACT METHODS ============
  contactProfessional() {
    const phone = this.professional?.phone;
    if (phone) {
      window.open(`tel:${phone}`, '_system');
    } else {
      alert('Phone number not available');
    }
  }

  emailProfessional() {
    if (this.appointment.chatInitiated === false) {
      this.appointment.chatInitiated = true;
      this.appointmentService.updateAppointment(this.appointment).subscribe(async (res: any) => {
        this.getAppointment();
      });
    }
    const email = this.professional?.email;
    if (email) {
      const subject = encodeURIComponent('Regarding Appointment');
      const body = encodeURIComponent('Hi, I have a question regarding our scheduled appointment.');
      window.open(`mailto:${email}?subject=${subject}&body=${body}`, '_system');
    } else {
      alert('Email address not available');
    }
  }

  openZoomMeeting() {
    if (this.appointment.zoomMeetingCompletedClient === false) {
      this.appointment.zoomMeetingCompletedClient = true;
      this.appointmentService.updateAppointment(this.appointment).subscribe(async (res: any) => {
        this.getAppointment();
      });
    }
    const zoomLink = this.appointment?.zoomJoinLink;
    if (zoomLink) {
      window.open(zoomLink, '_blank');
    } else {
      alert('Zoom meeting link not available');
    }
  }

  // ============ FEEDBACK/COMPLAINT SYSTEM ============
  onCompleteAppointment() {
    if (this.appointment.clientFeedback?.submittedAt) {
      // Feedback already submitted
      this.toastService.show('You have already submitted your feedback.', {
        color: 'warning',
        position: 'bottom',
        duration: 3000
      });
      return;
    }
    this.showFeedbackModal = true;
  }

  closeFeedbackModal() {
    this.showFeedbackModal = false;
    this.resetFeedbackForm();
  }

  resetFeedbackForm() {
    this.feedbackSatisfied = null;
    this.selectedComplaintType = '';
    this.complaintMessage = '';
  }

  selectSatisfaction(satisfied: boolean) {
    this.feedbackSatisfied = satisfied;
    if (satisfied) {
      this.selectedComplaintType = '';
      this.complaintMessage = '';
    }
  }

  selectComplaintType(type: string) {
    this.selectedComplaintType = type;
  }

  submitFeedback() {
    if (this.feedbackSatisfied === null) return;
    if (this.feedbackSatisfied === false && !this.selectedComplaintType) return;

    this.isSubmittingFeedback = true;

    const feedbackData = {
      appointmentId: this.appointment.appointmentId,
      satisfied: this.feedbackSatisfied,
      complaintType: this.selectedComplaintType,
      complaintMessage: this.complaintMessage
    };

    this.appointmentService.submitClientFeedback(feedbackData).subscribe({
      next: (res: any) => {
        this.isSubmittingFeedback = false;
        if (res.message === 'success') {
          this.showFeedbackModal = false;
          this.resetFeedbackForm();
          
          if (this.feedbackSatisfied === false) {
            this.toastService.show('Your complaint has been submitted and is under review.', {
              color: 'warning',
              position: 'bottom',
              duration: 4000
            });
          } else {
            this.toastService.show('Thank you for your feedback!', {
              color: 'primary',
              position: 'bottom',
              duration: 3000
            });
          }
          
          this.getAppointment();
        } else {
          this.toastService.show('Failed to submit feedback. Please try again.', {
            color: 'danger',
            position: 'bottom',
            duration: 3000
          });
        }
      },
      error: () => {
        this.isSubmittingFeedback = false;
        this.toastService.show('Failed to submit feedback. Please try again.', {
          color: 'danger',
          position: 'bottom',
          duration: 3000
        });
      }
    });
  }
}