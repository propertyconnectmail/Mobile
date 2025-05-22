import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent } from '@ionic/angular/standalone';
import { NavController } from '@ionic/angular';
import { ClientService } from 'src/app/_services/client/client.service';
import { ProfessionalService } from 'src/app/_services/professional/professional.service';
import { AppointmentService } from 'src/app/_services/appointment/appointment.service';
import { ToastService } from 'src/app/core/_services/toast/toast.service';
import { PlatformService } from 'src/app/core/_services/platform/platform.service';

type PaymentCard = {
  cardNumber: string;
  last4: string;
};

@Component({
  selector: 'app-client-payment-page',
  templateUrl: './client-payment-page.page.html',
  styleUrls: ['./client-payment-page.page.scss'],
  standalone: true,
  imports: [ IonContent, CommonModule, FormsModule]
})
export class ClientPaymentPagePage implements OnInit {


  isSubmitting = false;
  paymentCards: PaymentCard[] = [];
  selectedCardIndex: number = 0;
  isLoadingCards: boolean = true;
  lawyer: any = {};
  client: any = {};

  constructor(private platformService : PlatformService, private toastService : ToastService, private navCtrl: NavController, private clientService : ClientService, private professionalService : ProfessionalService, private appointmentService : AppointmentService) {}

  ngOnInit() {
    const user = JSON.parse(localStorage.getItem('user')!);
    this.client = user;

    this.clientService.getClientPaymentMethods({email:user.email}).subscribe(async(res : any)=>{
      this.paymentCards = res.map((cardNumber: string) => ({
        cardNumber: cardNumber,           // add this field
        last4: cardNumber.slice(-4)       // keep last4 for display
      }));
    })

    const storedEmail = localStorage.getItem('selectedLawyerEmail');

    this.professionalService.getProfessionalForm({ email : storedEmail }).subscribe((res: any) => {
      this.lawyer = res;
    });


  }

  goBack() {
    this.navCtrl.back();
  }

  selectCard(index: number) {
    this.selectedCardIndex = index;
  }

  createAppointment() {
    // Step 1: Get selected values from localStorage
    const storedDate = localStorage.getItem('selectedDate');
    const appointmentTime = localStorage.getItem('selectedSlot');
    const professionalEmail = localStorage.getItem('selectedLawyerEmail');
    const user = JSON.parse(localStorage.getItem('user')!);
    const clientEmail = user.email;
    const selectedCard = this.paymentCards[this.selectedCardIndex];
  
    // Step 2: Check for required data
    if (!storedDate || !appointmentTime || !professionalEmail || !selectedCard) {
      console.error('Missing required appointment or card info.');
      return;
    }
  
    // Step 3: Format appointmentDate (dd/mm/yyyy)
    let appointmentDate = '';
    try {
      const parsedDate = JSON.parse(storedDate); // expects { day: 'Fri', date: 9, month: 4 }
      const day = String(parsedDate.date).padStart(2, '0');
      const month = String(parsedDate.month + 1).padStart(2, '0'); // Month is 0-indexed
      const year = new Date().getFullYear(); // You could also store year separately if needed
      appointmentDate = `${day}/${month}/${year}`;
    } catch (err) {
      console.error('Invalid stored date format');
      return;
    }
  
    // Step 4: Calculate fee breakdown
    let consultationFee = parseFloat(this.lawyer.consultationFee);
    let commission = (consultationFee * 0.08).toFixed(2);       // 8%
    let transactionFee = (consultationFee * 0.02).toFixed(2);   // 2%
    let professionalPaymentAmount = (consultationFee * 0.9).toFixed(2);
  
    // Step 5: Build appointment object
    const appointmentData = {
      appointmentId: '', // Let backend generate
      appointmentStatus: 'ongoing',
  
      professionalName: this.lawyer.firstName+' '+this.lawyer.lastName,
      professionalUrl: this.lawyer.url,
      clientEmail,
      clientName: this.client.firstName + ' ' + this.client.lastName,
      clientUrl: this.client.url,
      professionalEmail,
      appointmentDate,
      appointmentTime,
      zoomJoinLink: '',
      zoomStartLink: '',
  
      chatInitiated: false,
      clientDocumentsUploaded: false,
      professionalDocumentsUploaded: false,
      zoomMeetingCompletedClient: false,
      zoomMeetingCompletedProfessional: false,
      appointmentCompleted: false,
  
      clientDocuments: [],
      professionalDocuments: [],
  
      professionalPaymentStatus: 'pending',
      professionalPaymentAmount,
      totalPaymentAmount: consultationFee.toFixed(2),
      commission,
      transactionFee,
  
      chatId: ''
    };

    this.isSubmitting = true;

    console.log(appointmentData)
    this.appointmentService.postAppointmentForm(appointmentData).subscribe(async(res:any)=>{
      console.log(res)
      if(res.message === 'success'){
        this.platformService.updateTotalAppointments().subscribe(async(res:any) =>{
          if(res.message === 'success'){
            this.platformService.updateTotalRevenue({commission : commission}).subscribe(async(res:any)=>{
              if(res.message === 'success'){
                this.toastService.show('Your appointment has been created!', {
                  color: 'primary',
                  position: 'bottom',
                  duration: 3000
                });
                this.isSubmitting = false;
                this.navCtrl.navigateForward('client-payment-success');
                return
              }   
            })
          }
        })
      }
      if(res.message != 'success'){
        this.isSubmitting = false;
        this.toastService.show('Appointment Could not be created. Please try again later!', {
          color: 'danger',
          position: 'bottom',
          duration: 3000
        });
        return
      }
    })
  }
  

  prev(){
    this.navCtrl.navigateBack('/client-set-appointment-date');
  }

}
