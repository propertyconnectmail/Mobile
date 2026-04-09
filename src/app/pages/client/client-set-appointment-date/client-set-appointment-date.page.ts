import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent} from '@ionic/angular/standalone';
import { ProfessionalService } from 'src/app/_services/professional/professional.service';
import { AppointmentService } from 'src/app/_services/appointment/appointment.service';
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

  // ============ ADDED FOR SLOT BLOCKING ============
  professionalAppointments: any[] = [];
  professionalEmail: string = '';
  isLoadingAppointments = true;
  // ============ END ============

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

  constructor(
    private professionalService: ProfessionalService,
    private appointmentService: AppointmentService,
    private navCtrl: NavController,
    private route: ActivatedRoute,
    private toastService: ToastService
  ) {}

  lawyer: any = {};

  ngOnInit(): void {
    const email = this.route.snapshot.queryParamMap.get('email');
    if (email) {
      this.professionalEmail = email;
      localStorage.setItem('selectedLawyerEmail', email);
      this.professionalService.getProfessionalForm({ email: email }).subscribe((res: any) => {
        this.lawyer = res;
      });

      // ============ CHANGED - Fetch appointments first, then generate dates ============
      this.fetchProfessionalAppointments(email);
      // ============ END ============
    } else {
      // If no email, just generate dates without blocking
      this.generateDates();
    }
  }

  ionViewWillEnter() {
    const storedDate = localStorage.getItem('selectedDate');
    const storedSlot = localStorage.getItem('selectedSlot');

    // ============ ADDED - Refetch appointments when returning to page ============
    const storedEmail = localStorage.getItem('selectedLawyerEmail');
    if (storedEmail && this.professionalAppointments.length === 0) {
      this.fetchProfessionalAppointments(storedEmail);
    }
    // ============ END ============

    if (storedDate) {
      this.selectedDate = JSON.parse(storedDate);
      this.updateSlotAvailability();
    }
    if (storedSlot) {
      this.selectedSlot = { time: storedSlot };
    }
  }

  // ============ CHANGED - Removed selectedLawyerEmail from ngOnDestroy ============
  ngOnDestroy(): void {
    localStorage.removeItem('selectedDate');
    localStorage.removeItem('selectedSlot');
    // Don't remove selectedLawyerEmail here - it's needed for the back navigation
  }
  // ============ END ============

  // ============ UPDATED FOR SLOT BLOCKING ============
  fetchProfessionalAppointments(email: string) {
    this.isLoadingAppointments = true;
    this.appointmentService.getAllProfessionalAppointments({ professionalEmail: email }).subscribe({
      next: (res: any) => {
        if (Array.isArray(res)) {
          // Filter only ongoing and pending appointments
          this.professionalAppointments = res.filter(
            (apt: any) => apt.appointmentStatus === 'ongoing' || apt.appointmentStatus === 'pending'
          );
          console.log('Filtered appointments:', this.professionalAppointments);
        }
        this.isLoadingAppointments = false;
        // Generate dates AFTER appointments are fetched
        this.generateDates();
      },
      error: (err) => {
        console.error('Error fetching appointments:', err);
        this.isLoadingAppointments = false;
        // Still generate dates even if appointments fail to load
        this.generateDates();
      }
    });
  }

  updateSlotAvailability() {
    // Reset all slots to enabled first
    this.resetAllSlots();

    if (!this.selectedDate) return;

    // Format selected date to match appointment date format (DD/MM/YYYY)
    const selectedDateFormatted = this.formatSelectedDate();
    console.log('Selected date formatted:', selectedDateFormatted);
    console.log('Professional appointments:', this.professionalAppointments);

    // Find appointments on the selected date
    const appointmentsOnDate = this.professionalAppointments.filter(
      (apt: any) => apt.appointmentDate === selectedDateFormatted
    );
    console.log('Appointments on date:', appointmentsOnDate);

    // Get booked times
    const bookedTimes = appointmentsOnDate.map((apt: any) => apt.appointmentTime.toLowerCase());
    console.log('Booked times:', bookedTimes);

    // Disable booked slots
    this.morningSlots.forEach(slot => {
      if (bookedTimes.includes(slot.time.toLowerCase())) {
        slot.disabled = true;
        console.log('Disabled morning slot:', slot.time);
      }
    });

    this.afternoonSlots.forEach(slot => {
      if (bookedTimes.includes(slot.time.toLowerCase())) {
        slot.disabled = true;
        console.log('Disabled afternoon slot:', slot.time);
      }
    });

    this.eveningSlots.forEach(slot => {
      if (bookedTimes.includes(slot.time.toLowerCase())) {
        slot.disabled = true;
        console.log('Disabled evening slot:', slot.time);
      }
    });
  }

  resetAllSlots() {
    this.morningSlots.forEach(slot => slot.disabled = false);
    this.afternoonSlots.forEach(slot => slot.disabled = false);
    this.eveningSlots.forEach(slot => slot.disabled = false);
  }

  formatSelectedDate(): string {
    // Format: DD/MM/YYYY
    const day = this.selectedDate.date.toString().padStart(2, '0');
    const month = (this.selectedDate.month + 1).toString().padStart(2, '0');
    const year = this.selectedYear;
    return `${day}/${month}/${year}`;
  }
  // ============ END ============

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

    this.isPrevDisabled = (this.currentMonthIndex === today.getMonth() && this.selectedYear === today.getFullYear());
    this.selectedDate = this.dates[0];
    this.isLoadingDates = false;

    // Update slot availability after dates are generated
    this.updateSlotAvailability();

    setTimeout(() => {
      const todayButton = document.querySelector('.date-button.selected');
    }, 100);
  }

  prevMonth() {
    const today = new Date();
    if (this.currentMonthIndex === 0) {
      // Go to previous year December
      this.currentMonthIndex = 11;
      this.selectedYear--;
    } else {
      this.currentMonthIndex--;
    }
    this.generateDates();
  }

  nextMonth() {
    if (this.currentMonthIndex === 11) {
      // Go to next year January
      this.currentMonthIndex = 0;
      this.selectedYear++;
    } else {
      this.currentMonthIndex++;
    }
    this.generateDates();
  }

  selectDate(date: any) {
    this.selectedDate = date;
    this.selectedSlot = null;
    this.updateSlotAvailability();
  }

  selectSlot(slot: any) {
    if (!slot.disabled) {
      this.selectedSlot = slot;
    }
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
    const swipeThreshold = window.innerWidth * 0.6;
  
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
  
  goToPaymentSelection() {
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
      return;
    }
  }

  // ============ CHANGED - Pass email back to detail page ============
  prev() {
    this.navCtrl.navigateBack(['/client-lawyer-detail'], {
      queryParams: { email: this.professionalEmail }
    });
  }
  // ============ END ============
}