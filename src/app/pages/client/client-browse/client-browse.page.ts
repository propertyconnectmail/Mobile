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

  // ============ ADDED FOR LOCATION FILTER ============
  showLocationFilter = false;
  selectedProvince = 'all';
  selectedDistrict = 'all';
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
  // ============ END ============

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

      // ============ ADDED FOR LOCATION FILTER ============
      const matchesProvince =
        this.selectedProvince === 'all' ||
        consultant.province === this.selectedProvince;

      const matchesDistrict =
        this.selectedDistrict === 'all' ||
        consultant.district === this.selectedDistrict;

      return matchesCategory && matchesSearch && matchesProvince && matchesDistrict;
      // ============ END ============
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

  // ============ ADDED FOR LOCATION FILTER ============
  toggleLocationFilter() {
    this.showLocationFilter = !this.showLocationFilter;
  }

  onProvinceChange() {
    this.selectedDistrict = 'all';
    if (this.selectedProvince === 'all') {
      this.districts = [];
    } else {
      this.districts = this.districtsByProvince[this.selectedProvince] || [];
    }
    this.applyFilters();
  }

  onDistrictChange() {
    this.applyFilters();
  }

  clearLocationFilters() {
    this.selectedProvince = 'all';
    this.selectedDistrict = 'all';
    this.districts = [];
    this.applyFilters();
  }
  // ============ END ============
}