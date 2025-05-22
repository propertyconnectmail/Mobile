import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent} from '@ionic/angular/standalone';
import { StarRatingComponent } from "../../../components/star-rating/star-rating.component";
import { NavController } from '@ionic/angular';
import { ProfessionalService } from 'src/app/_services/professional/professional.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-client-lawyer-detail',
  templateUrl: './client-lawyer-detail.page.html',
  styleUrls: ['./client-lawyer-detail.page.scss'],
  standalone: true,
  imports: [IonContent, CommonModule, FormsModule, StarRatingComponent]
})
export class ClientLawyerDetailPage implements OnInit {

  constructor(private professionalService: ProfessionalService,private navCtrl: NavController,private route: ActivatedRoute){}

  lawyer: any = {};
  email : any = '';
  review : any = [];

  ngOnInit(): void {
    const email = this.route.snapshot.queryParamMap.get('email');
    this.email = email;

    this.professionalService.getProfessionalForm({ email : email }).subscribe((res: any) => {
      this.lawyer = res;
      this.review = res.rating
    });
  }

  isExpanded: boolean = false;

  expandComment() {
    this.isExpanded = true;
  }

  goToAppointmentCreation(){
    let email = this.lawyer.email
    this.navCtrl.navigateForward(['/client-set-appointment-date'], {
      queryParams: { email }
    });
  }

  ionViewWillEnter() {
    this.professionalService.getProfessionalForm({ email : this.email }).subscribe((res: any) => {
      this.lawyer = res;
    });
  }

  prev() {
    this.navCtrl.back();
  }

  toAllReviews(){
    this.navCtrl.navigateForward('/client-professional-all-reviews')
  }
}
