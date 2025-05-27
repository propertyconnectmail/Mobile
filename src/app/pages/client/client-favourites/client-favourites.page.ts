import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar } from '@ionic/angular/standalone';
import { debounceTime, Subject } from 'rxjs';
import { NavController } from '@ionic/angular';
import { ClientService } from 'src/app/_services/client/client.service';

@Component({
  selector: 'app-client-favourites',
  templateUrl: './client-favourites.page.html',
  styleUrls: ['./client-favourites.page.scss'],
  standalone: true,
  imports: [IonContent, CommonModule, FormsModule]
})
export class ClientFavouritesPage implements OnInit {

  constructor(private clientService: ClientService, private navCtrl: NavController,) {}
  
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
    this.loadClientFavourites();

    this.searchSubject.pipe(debounceTime(300)).subscribe(() => {
      this.applyFilters();
    });
  }

  loadClientFavourites() {
    this.isLoading = true;
    const clientEmail = JSON.parse(localStorage.getItem('user') || '{}')?.email;

    if (!clientEmail) {
      this.isLoading = false;
      return;
    }

    this.clientService.getClientForm({ email: clientEmail }).subscribe((res: any) => {
      this.isLoading = false;
      this.consultants = res.favorites || [];
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
    this.loadClientFavourites();
  }

  professionalPage(email : any){
    this.navCtrl.navigateForward(['/client-lawyer-detail'], {
      queryParams: { email }
    });
  }

  prev(){
    this.navCtrl.back();
  }
}
