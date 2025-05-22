import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent } from '@ionic/angular/standalone';
import { NavController } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';
import { RegistryService } from 'src/app/_services/registry/registry.service';

@Component({
  selector: 'app-client-registry-profile',
  templateUrl: './client-registry-profile.page.html',
  styleUrls: ['./client-registry-profile.page.scss'],
  standalone: true,
  imports: [IonContent, CommonModule, FormsModule]
})
export class ClientRegistryProfilePage implements OnInit {

  constructor(private registryService: RegistryService,private navCtrl: NavController,private route: ActivatedRoute){}
  
    lawyer: any = {};
    locationName : any = '';
  
    ngOnInit(): void {
      this.locationName = this.route.snapshot.queryParamMap.get('locationName');
  
      this.registryService.getRegistryLocation({ locationName : this.locationName }).subscribe((res: any) => {
        this.lawyer = res;
      });
    }
  
    ionViewWillEnter() {
      this.registryService.getRegistryLocation({ locationName :  this.locationName }).subscribe((res: any) => {
        this.lawyer = res;
      });
    }
  
    prev() {
      this.navCtrl.back();
    }
}
