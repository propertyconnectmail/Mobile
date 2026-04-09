import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent } from '@ionic/angular/standalone';
import { debounceTime, Subject } from 'rxjs';
import { NavController } from '@ionic/angular';
import { AppointmentService } from 'src/app/_services/appointment/appointment.service';
import { ProfessionalBottomTabComponent } from "../../../components/professional-bottom-tab/professional-bottom-tab.component";

@Component({
  selector: 'app-professional-home',
  templateUrl: './professional-home.page.html',
  styleUrls: ['./professional-home.page.scss'],
  standalone: true,
  imports: [IonContent, CommonModule, FormsModule, ProfessionalBottomTabComponent]
})
export class ProfessionalHomePage implements OnInit {

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

    this.appointmentService.getAllProfessionalAppointments({ professionalEmail: user.email }).subscribe((res: any) => {
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

    this.appointmentService.getAllProfessionalAppointments({ professionalEmail: user.email }).subscribe((res: any) => {
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
        app.clientName?.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    }

    this.filteredAppointments = filtered;
  }
  // ============ END ============

  getStatusLabel(status: string): string {
    switch(status) {
      case 'ongoing': return 'Ongoing';
      case 'completed': return 'Completed';
      case 'under_review': return 'Under Review';
      default: return status || 'Unknown';
    }
  }

  goToAppointment(appointmentId: any) {
    this.navCtrl.navigateForward(['/professional-appointment-detail'], {
      queryParams: { appointmentId }
    });
  }
}