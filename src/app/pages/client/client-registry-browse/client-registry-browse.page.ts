import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent } from '@ionic/angular/standalone';
import { RegistryService } from 'src/app/_services/registry/registry.service';
import { debounceTime, Subject } from 'rxjs';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-client-registry-browse',
  templateUrl: './client-registry-browse.page.html',
  styleUrls: ['./client-registry-browse.page.scss'],
  standalone: true,
  imports: [IonContent, CommonModule, FormsModule]
})
export class ClientRegistryBrowsePage implements OnInit {

  constructor(private registryService: RegistryService, private navCtrl: NavController,) {}
    
      isLoading = false;
      consultants: any[] = [];
      filteredConsultants: any[] = [];
    
      selectedCategory = 'all';
      searchTerm = '';
      private searchSubject = new Subject<string>();
    
      ngOnInit() {
        this.isLoading = true;
        this.registryService.getAllRegistryLocations().subscribe((res: any) => {
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
        this.registryService.getAllRegistryLocations().subscribe((res: any) => {
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
    
      professionalPage(locationName : any){
        this.navCtrl.navigateForward(['/client-registry-profile'], {
          queryParams: { locationName }
        });
      }
  
      prev(){
        this.navCtrl.back();
      }
}
