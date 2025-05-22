import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-professional-bottom-tab',
  templateUrl: './professional-bottom-tab.component.html',
  styleUrls: ['./professional-bottom-tab.component.scss'],
  imports: [IonicModule]
})
export class ProfessionalBottomTabComponent  implements OnInit {

  currentRoute = '';

  constructor(private navCtrl: NavController) {}

  ngOnInit() {
    this.currentRoute = window.location.pathname;
  }

  isActive(path: string): boolean {
    return this.currentRoute === path;
  }

  navigate(path: string) {
    this.currentRoute = path;
    this.navCtrl.navigateRoot(path);
  }

}
