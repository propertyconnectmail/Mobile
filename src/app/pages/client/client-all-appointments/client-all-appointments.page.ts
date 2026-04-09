import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent } from '@ionic/angular/standalone';
import { BottomTabComponent } from "../../../components/bottom-tab/bottom-tab.component";
import { debounceTime, Subject } from 'rxjs';
import { NavController } from '@ionic/angular';
import { AppointmentService } from 'src/app/_services/appointment/appointment.service';

@Component({
  selector: 'app-client-all-appointments',
  templateUrl: './client-all-appointments.page.html',
  styleUrls: ['./client-all-appointments.page.scss'],
  standalone: true,
  imports: [IonContent, CommonModule, FormsModule, BottomTabComponent]
})
export class ClientAllAppointmentsPage {
  isLoading = true;
  skeletonArray = Array(3);
  appointments: any[] = [];
  filteredAppointments: any[] = [];
  selectedCategory = 'all';
  searchTerm = '';
  searchSubject: Subject<string> = new Subject();

  // ============ UPDATED - Added Under Review tab ============
  categories = [
    { label: 'All', value: 'all' },
    { label: 'Ongoing', value: 'ongoing' },
    { label: 'Under Review', value: 'under_review' },
    { label: 'Completed', value: 'completed' }
  ];
  // ============ END ============

  constructor(private navCtrl: NavController, private appointmentService: AppointmentService) {}

  ngOnInit() {
    const user = JSON.parse(localStorage.getItem('user')!);
    this.appointmentService.getAllClientAppointments({ clientEmail: user.email }).subscribe((res: any) => {
      this.appointments = res;
      this.isLoading = false;
      this.filterAppointments();
    });

    this.searchSubject.pipe(debounceTime(300)).subscribe(() => {
      this.filterAppointments();
    });
  }

  ionViewWillEnter() {
    const user = JSON.parse(localStorage.getItem('user')!);
    this.appointmentService.getAllClientAppointments({ clientEmail: user.email }).subscribe((res: any) => {
      this.appointments = res;
      this.isLoading = false;
      this.filterAppointments();
    });
  }

  onSearchChange() {
    this.searchSubject.next(this.searchTerm);
  }

  selectCategory(category: string) {
    this.selectedCategory = category;
    this.filterAppointments();
  }

  // ============ UPDATED - Added under_review filter ============
  filterAppointments() {
    let filtered = [...this.appointments];

    if (this.selectedCategory === 'ongoing') {
      filtered = filtered.filter(app => app.appointmentStatus === 'ongoing');
    } else if (this.selectedCategory === 'completed') {
      filtered = filtered.filter(app => app.appointmentStatus === 'completed');
    } else if (this.selectedCategory === 'under_review') {
      filtered = filtered.filter(app => app.appointmentStatus === 'under_review');
    }

    if (this.searchTerm.trim()) {
      filtered = filtered.filter(app =>
        app.professionalName?.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    }

    this.filteredAppointments = filtered;
  }
  // ============ END ============

  // ============ ADDED - Status label helper ============
  getStatusLabel(status: string): string {
    switch(status) {
      case 'ongoing': return 'Ongoing';
      case 'completed': return 'Completed';
      case 'under_review': return 'Under Review';
      default: return status || 'Unknown';
    }
  }
  // ============ END ============

  goToAppointment(appointmentId: any) {
    this.navCtrl.navigateForward(['/client-appointment-detail'], {
      queryParams: { appointmentId }
    });
  }
}