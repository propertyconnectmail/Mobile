import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar } from '@ionic/angular/standalone';
import { OfficialService } from 'src/app/_services/official/official.service';
import { NavController } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';
import { CustomTitlecasePipe } from "../../../core/pipes/custom-titlecase/custom-titlecase.pipe";

@Component({
  selector: 'app-client-official-profile',
  templateUrl: './client-official-profile.page.html',
  styleUrls: ['./client-official-profile.page.scss'],
  standalone: true,
  imports: [IonContent, CommonModule, FormsModule, CustomTitlecasePipe]
})
export class ClientOfficialProfilePage implements OnInit {

  constructor(private officialService: OfficialService,private navCtrl: NavController,private route: ActivatedRoute){}
  
    lawyer: any = {};
    id : any = '';
  
    ngOnInit(): void {
      this.id = this.route.snapshot.queryParamMap.get('id');
  
      this.officialService.getOfficial({ id : this.id }).subscribe((res: any) => {
        this.lawyer = res;
      });
    }
  
    prev() {
      this.navCtrl.back();
    }

}
