import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent} from '@ionic/angular/standalone';
import { ProfessionalService } from 'src/app/_services/professional/professional.service';
import { NavController } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';
import { ToastService } from 'src/app/core/_services/toast/toast.service';

@Component({
  selector: 'app-client-set-appointment-date',
  templateUrl: './client-set-appointment-date.page.html',
  styleUrls: ['./client-set-appointment-date.page.scss'],
  standalone: true,
  imports: [ IonContent, CommonModule, FormsModule]
})
export class ClientSetAppointmentDatePage {

  months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  currentMonthIndex = new Date().getMonth();
  selectedYear = new Date().getFullYear();
  dates: any[] = [];
  selectedDate: any = null;
  selectedSlot: any = null;
  isLoadingDates = true;
  isPrevDisabled = false;

  morningSlots = [
    { time: '10:30 am', disabled: false },
    { time: '11:00 am', disabled: false },
    { time: '11:30 am', disabled: false },
  ];

  afternoonSlots = [
    { time: '02:30 pm', disabled: false },
    { time: '03:00 pm', disabled: false },
    { time: '03:30 pm', disabled: false },
    { time: '04:00 pm', disabled: false },
    { time: '04:30 pm', disabled: false },
    { time: '05:00 pm', disabled: false },
  ];

  eveningSlots = [
    { time: '06:30 pm', disabled: false },
    { time: '07:00 pm', disabled: false },
    { time: '07:30 pm', disabled: false },
    { time: '08:00 pm', disabled: false },
  ];

  constructor(private professionalService: ProfessionalService,private navCtrl: NavController,private route: ActivatedRoute, private toastService : ToastService){}

  lawyer: any = {};

  ngOnInit(): void {
    const email = this.route.snapshot.queryParamMap.get('email');
    if (email) {
      localStorage.setItem('selectedLawyerEmail', email);
      this.professionalService.getProfessionalForm({ email : email }).subscribe((res: any) => {
        this.lawyer = res;
      });
    }
    
    this.generateDates();
  }


  ionViewWillEnter() {
    const storedDate = localStorage.getItem('selectedDate');
    const storedSlot = localStorage.getItem('selectedSlot');

    if (storedDate) {
      this.selectedDate = JSON.parse(storedDate);
    }

    if (storedSlot) {
      this.selectedSlot = { time: storedSlot };
    }
  }


  ngOnDestroy(): void {
    localStorage.removeItem('selectedDate');
    localStorage.removeItem('selectedSlot');
    localStorage.removeItem('selectedLawyerEmail');
  }

  generateDates() {
    this.isLoadingDates = true;
    this.dates = [];
    const today = new Date();
    const daysInMonth = new Date(this.selectedYear, this.currentMonthIndex + 1, 0).getDate();

    for (let i = 1; i <= daysInMonth; i++) {
      const date = new Date(this.selectedYear, this.currentMonthIndex, i);
      if (date >= new Date(today.getFullYear(), today.getMonth(), today.getDate())) {
        const day = date.toLocaleDateString('en-US', { weekday: 'short' });
        this.dates.push({ day, date: i, month: this.currentMonthIndex });
      }
    }

    this.isPrevDisabled = (this.currentMonthIndex === today.getMonth());
    this.selectedDate = this.dates[0];
    this.isLoadingDates = false;

    setTimeout(() => {
      const todayButton = document.querySelector('.date-button.selected');
    }, 100);
  }

  prevMonth() {
    if (!this.isPrevDisabled && this.currentMonthIndex > 0) {
      this.currentMonthIndex--;
      this.generateDates();
    }
  }

  nextMonth() {
    if (this.currentMonthIndex < 11) {
      this.currentMonthIndex++;
      this.generateDates();
    }
  }

  selectDate(date: any) {
    this.selectedDate = date;
    this.selectedSlot = null;
  }

  selectSlot(slot: any) {
    this.selectedSlot = slot;
  }


  touchStartX = 0;
  touchEndX = 0;

  onTouchStart(event: TouchEvent) {
    this.touchStartX = event.changedTouches[0].screenX;
  }

  onTouchEnd(event: TouchEvent) {
    this.touchEndX = event.changedTouches[0].screenX;
    this.handleSwipe();
  }

  slideDirection: 'left' | 'right' | '' = '';

  handleSwipe() {
    const deltaX = this.touchEndX - this.touchStartX;
    const swipeThreshold = window.innerWidth * 0.6; // 80% of screen width
  
    if (Math.abs(deltaX) > swipeThreshold) {
      if (deltaX > 0) {
        this.slideDirection = 'right';
        this.prevMonth();
      } else {
        this.slideDirection = 'left';
        this.nextMonth();
      }
  
      setTimeout(() => {
        this.slideDirection = '';
      }, 300);
    }
  }
  

  goToPaymentSelection(){
    if (this.selectedDate) {
      localStorage.setItem('selectedDate', JSON.stringify(this.selectedDate));
    }
  
    if (this.selectedSlot) {
      localStorage.setItem('selectedSlot', this.selectedSlot.time);
    }

    if (this.selectedDate && this.selectedSlot) {
      this.navCtrl.navigateForward(['/client-payment-page']);
    } else {
      this.toastService.show('Please select a date and time!', {
        color: 'danger',
        position: 'bottom',
        duration: 3000
      });
      return
    }
  }


  prev(){
    this.navCtrl.navigateBack('/client-lawyer-detail');
  }

}
