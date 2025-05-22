import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar } from '@ionic/angular/standalone';
import { BottomTabComponent } from "../../../components/bottom-tab/bottom-tab.component";
import { ProfessionalService } from 'src/app/_services/professional/professional.service';
import { debounceTime, Subject } from 'rxjs';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-client-browse',
  templateUrl: './client-browse.page.html',
  styleUrls: ['./client-browse.page.scss'],
  standalone: true,
  imports: [IonContent, CommonModule, FormsModule, BottomTabComponent]
})
export class ClientBrowsePage implements OnInit {

  constructor(private professionalService: ProfessionalService, private navCtrl: NavController,) {}

  isLoading = false;
  consultants: any[] = [];
  filteredConsultants: any[] = [];

  categories = [
    { label: 'All Professionals', value: 'all' },
    { label: 'Lawyers', value: 'lawyer' },
    { label: 'Surveyors', value: 'surveyor' },
    { label: 'Valuers', value: 'valuer' }
  ];

  selectedCategory = 'all';
  searchTerm = '';
  private searchSubject = new Subject<string>();

  ngOnInit() {
    this.isLoading = true;
    this.professionalService.getAllProfessionalForm().subscribe((res: any) => {
      this.isLoading = false;
      if (Array.isArray(res) && res.length > 0) {
        this.consultants = res;
        this.applyFilters();
      }
    });

    this.searchSubject.pipe(debounceTime(300)).subscribe(() => {
      this.applyFilters();
    });
  }

  selectCategory(categoryValue: string) {
    this.selectedCategory = categoryValue;
    this.applyFilters();
  }

  onSearchChange() {
    this.searchSubject.next(this.searchTerm);
  }

  applyFilters() {
    const searchLower = this.searchTerm.toLowerCase();

    this.filteredConsultants = this.consultants.filter(consultant => {
      const matchesCategory =
        this.selectedCategory === 'all' ||
        consultant.type?.toLowerCase() === this.selectedCategory;

      const fullName = `${consultant.firstName} ${consultant.lastName}`.toLowerCase();
      const matchesSearch = fullName.includes(searchLower);

      return matchesCategory && matchesSearch;
    });
  }

  ionViewWillEnter() {
    this.isLoading = true;
    this.professionalService.getAllProfessionalForm().subscribe((res: any) => {
      this.isLoading = false;
      if (Array.isArray(res) && res.length > 0) {
        this.consultants = res;
        this.applyFilters();
      }
    });

    this.searchSubject.pipe(debounceTime(300)).subscribe(() => {
      this.applyFilters();
    });
  }

  professionalPage(email : any){
    this.navCtrl.navigateForward(['/client-lawyer-detail'], {
      queryParams: { email }
    });
  }
}
