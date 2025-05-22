import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-bottom-tab',
  templateUrl: './bottom-tab.component.html',
  imports: [IonicModule],
  styleUrls: ['./bottom-tab.component.scss'],
})
export class BottomTabComponent  implements OnInit {

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
