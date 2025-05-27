import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent } from '@ionic/angular/standalone';
import { ProfessionalService } from 'src/app/_services/professional/professional.service';
import { StarRatingComponent } from "../../../components/star-rating/star-rating.component";
import { NavController } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-client-professional-all-reviews',
  templateUrl: './client-professional-all-reviews.page.html',
  styleUrls: ['./client-professional-all-reviews.page.scss'],
  standalone: true,
  imports: [IonContent, CommonModule, FormsModule, StarRatingComponent]
})
export class ClientProfessionalAllReviewsPage implements OnInit {

  constructor(private professionalService : ProfessionalService, private navCtrl: NavController, private route: ActivatedRoute) { }
  
  reviews: any = [];

  isExpanded: boolean = false;

  expandComment() {
    this.isExpanded = true;
  }


  ngOnInit() {
    const email = this.route.snapshot.queryParamMap.get('email');

    this.professionalService.getProfessionalForm({email : email}).subscribe(async(res:any)=>{
      this.reviews = (res.rating || []).slice().reverse();
    })
  }

  prev(){
    this.navCtrl.back();
  }
}
