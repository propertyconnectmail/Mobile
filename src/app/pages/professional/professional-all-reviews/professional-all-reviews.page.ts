import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent } from '@ionic/angular/standalone';
import { ProfessionalBottomTabComponent } from "../../../components/professional-bottom-tab/professional-bottom-tab.component";
import { ProfessionalService } from 'src/app/_services/professional/professional.service';
import { StarRatingComponent } from "../../../components/star-rating/star-rating.component";
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-professional-all-reviews',
  templateUrl: './professional-all-reviews.page.html',
  styleUrls: ['./professional-all-reviews.page.scss'],
  standalone: true,
  imports: [IonContent, CommonModule, FormsModule, ProfessionalBottomTabComponent, StarRatingComponent]
})
export class ProfessionalAllReviewsPage implements OnInit {

  constructor(private professionalService : ProfessionalService, private navCtrl: NavController) { }

  reviews: any = [];

  isExpanded: boolean = false;

  expandComment() {
    this.isExpanded = true;
  }


  ngOnInit() {
    const user = JSON.parse(localStorage.getItem('user')!);

    this.professionalService.getProfessionalForm({email : user.email}).subscribe(async(res:any)=>{
      this.reviews = res.rating
    })
  }


  goToAppointment(appointmentId:any){
    this.navCtrl.navigateForward(['/professional-appointment-detail'], {
      queryParams: { appointmentId }
    });
  }

}
