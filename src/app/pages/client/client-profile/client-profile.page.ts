import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent } from '@ionic/angular/standalone';
import { BottomTabComponent } from "../../../components/bottom-tab/bottom-tab.component";
import { NavController } from '@ionic/angular';
import { ClientService } from 'src/app/_services/client/client.service';
import { AuthService } from 'src/app/core/_services/auth/auth.service';
import { ToastService } from 'src/app/core/_services/toast/toast.service';

@Component({
  selector: 'app-client-profile',
  templateUrl: './client-profile.page.html',
  styleUrls: ['./client-profile.page.scss'],
  standalone: true,
  imports: [ IonContent, CommonModule, FormsModule, BottomTabComponent]
})
export class ClientProfilePage implements OnInit {

  imageUrl = "";
  name = "";
  email = "";

  constructor(private navCtrl: NavController, private clientService : ClientService, private authService : AuthService, private toastService : ToastService) {}

  ngOnInit(): void {
    const storedUser : any = localStorage.getItem('user');
    const user = JSON.parse(storedUser);
    
    this.clientService.getClientForm({email : user.email}).subscribe(async(res:any)=>{
      this.name = res.firstName+ ' '+ res.lastName;
      this.imageUrl = res.url;
    })

    this.email = user.email;
  }

  ionViewWillEnter() {
    const storedUser : any = localStorage.getItem('user');
    const user = JSON.parse(storedUser);
    
    this.clientService.getClientForm({email : user.email}).subscribe(async(res:any)=>{
      this.name = res.firstName+ ' '+ res.lastName;
      this.imageUrl = res.url;
    })
  }


  profileOptions = [
    { label: 'Edit Profile', icon: 'assets/profile/profile-edit.svg', route: '/client-edit-profile' },
    { label: 'Favorites', icon: 'assets/profile/profile-favourites.svg', route: '/favorites' },
    { label: 'Payment Methods', icon: 'assets/profile/profile-payments.svg', route: '/client-payment-methods' },
    { label: 'Loan Eligibility Checker', icon: 'assets/profile/profile-issues.svg', route: '/client-eligibility' },
  ];

  onOptionClick(item: any) {
    if (item.route) {
      this.navCtrl.navigateForward(item.route);
    }
  }

  onLogout() {
      this.authService.logout();
      this.toastService.show('Client logged out!', {
        color: 'primary',
        position: 'bottom',
        duration: 3000
      });
      this.navCtrl.navigateRoot('/login');
    }

}