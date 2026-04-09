import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent} from '@ionic/angular/standalone';
import { StarRatingComponent } from "../../../components/star-rating/star-rating.component";
import { NavController } from '@ionic/angular';
import { ProfessionalService } from 'src/app/_services/professional/professional.service';
import { ActivatedRoute } from '@angular/router';
import { ClientService } from 'src/app/_services/client/client.service';
import { ToastService } from 'src/app/core/_services/toast/toast.service';

@Component({
  selector: 'app-client-lawyer-detail',
  templateUrl: './client-lawyer-detail.page.html',
  styleUrls: ['./client-lawyer-detail.page.scss'],
  standalone: true,
  imports: [IonContent, CommonModule, FormsModule, StarRatingComponent]
})
export class ClientLawyerDetailPage implements OnInit {

  constructor(
    private professionalService: ProfessionalService,
    private navCtrl: NavController,
    private route: ActivatedRoute,
    private clientService: ClientService,
    private toastService: ToastService
  ) {}

  lawyer: any = {};
  email: any = '';
  review: any = [];
  clientEmail: string = '';
  clientData: any = {};
  isFavourite: boolean = false;

  ngOnInit(): void {
    const email = this.route.snapshot.queryParamMap.get('email');
    this.email = email;

    this.clientEmail = JSON.parse(localStorage.getItem('user') || '{}')?.email;

    this.professionalService.getProfessionalForm({ email: email }).subscribe((res: any) => {
      this.lawyer = res;
      this.review = res.rating;

      this.loadClientData();
    });
  }

  // ============ UPDATED - Get email from query params on every view enter ============
  ionViewWillEnter() {
    // Get email from query params (in case navigating back from appointment page)
    const email = this.route.snapshot.queryParamMap.get('email');
    if (email) {
      this.email = email;
    }

    if (this.email) {
      this.professionalService.getProfessionalForm({ email: this.email }).subscribe((res: any) => {
        this.lawyer = res;
        this.review = res.rating;
      });
    }
  }
  // ============ END ============

  loadClientData() {
    if (!this.clientEmail) return;

    this.clientService.getClientForm({ email: this.clientEmail }).subscribe((res: any) => {
      this.clientData = res;

      const favs = res.favorites || [];
      this.isFavourite = favs.some((f: any) => f.email === this.lawyer.email);
    });
  }

  toggleFavourite() {
    if (!this.clientData || !this.clientData.email) return;

    let flag;
    const favs = this.clientData.favorites || [];
    const index = favs.findIndex((f: any) => f.email === this.lawyer.email);

    if (index > -1) {
      favs.splice(index, 1);
      flag = -1;
    } else {
      favs.push(this.lawyer);
      flag = 1;
    }

    // Update client object
    this.clientData.favorites = favs;

    this.clientService.updateClientForm(this.clientData).subscribe((res: any) => {
      console.log(res);
      this.isFavourite = !this.isFavourite;
      if (res.message === 'success') {
        if (flag === 1) {
          this.toastService.show('Professional added to favourites!', {
            color: 'primary',
            position: 'bottom',
            duration: 3000
          });
          return;
        }
        if (flag === -1) {
          this.toastService.show('Professional removed from favourites!', {
            color: 'primary',
            position: 'bottom',
            duration: 3000
          });
          return;
        }
      }
      if (res.message != 'success') {
        this.toastService.show('Something went wrong. Please try again Later!', {
          color: 'danger',
          position: 'bottom',
          duration: 3000
        });
        return;
      }
    });
  }

  isExpanded: boolean = false;

  expandComment() {
    this.isExpanded = true;
  }

  goToAppointmentCreation() {
    let email = this.lawyer.email;
    this.navCtrl.navigateForward(['/client-set-appointment-date'], {
      queryParams: { email }
    });
  }

  // ============ UPDATED - Navigate to browse page instead of using back() ============
  prev() {
    // Clear the selected lawyer email when leaving this flow
    localStorage.removeItem('selectedLawyerEmail');
    this.navCtrl.navigateBack('/client-browse');
  }
  // ============ END ============

  toAllReviews() {
    this.navCtrl.navigateForward('/client-professional-all-reviews', {
      queryParams: { email: this.lawyer.email }
    });
  }
}