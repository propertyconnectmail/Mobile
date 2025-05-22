import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar } from '@ionic/angular/standalone';
import { OfficialService } from 'src/app/_services/official/official.service';
import { debounceTime, Subject } from 'rxjs';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-client-official-browse',
  templateUrl: './client-official-browse.page.html',
  styleUrls: ['./client-official-browse.page.scss'],
  standalone: true,
  imports: [IonContent, CommonModule, FormsModule]
})
export class ClientOfficialBrowsePage implements OnInit {

  constructor(private officialService: OfficialService, private navCtrl: NavController,) {}
  
    isLoading = false;
    consultants: any[] = [];
    filteredConsultants: any[] = [];
  
    categories = [
      { label: 'All Officers', value: 'all' },
      { label: 'PHI Officers', value: 'phi officer' },
      { label: 'Municipal Council Officers', value: 'municipal council officer' },
      { label: 'Grama Niladhari Officers', value: 'grama niladhari officer' }
    ];
  
    selectedCategory = 'all';
    searchTerm = '';
    private searchSubject = new Subject<string>();
  
    ngOnInit() {
      this.isLoading = true;
      this.officialService.getAllOfficials().subscribe((res: any) => {
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
  
        const fullName = `${consultant.province}`.toLowerCase();
        const matchesSearch = fullName.includes(searchLower);
  
        return matchesCategory && matchesSearch;
      });
    }
  
    ionViewWillEnter() {
      this.isLoading = true;
      this.officialService.getAllOfficials().subscribe((res: any) => {
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
  
    professionalPage(id : any){
      this.navCtrl.navigateForward(['/client-official-profile'], {
        queryParams: { id }
      });
    }

    prev(){
      this.navCtrl.back();
    }
}
