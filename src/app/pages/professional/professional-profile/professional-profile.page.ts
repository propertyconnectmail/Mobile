import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent } from '@ionic/angular/standalone';
import { NavController } from '@ionic/angular';
import { ProfessionalBottomTabComponent } from 'src/app/components/professional-bottom-tab/professional-bottom-tab.component';
import { ProfessionalService } from 'src/app/_services/professional/professional.service';
import { AuthService } from 'src/app/core/_services/auth/auth.service';
import { ToastService } from 'src/app/core/_services/toast/toast.service';

@Component({
  selector: 'app-professional-profile',
  templateUrl: './professional-profile.page.html',
  styleUrls: ['./professional-profile.page.scss'],
  standalone: true,
  imports: [IonContent, ProfessionalBottomTabComponent, CommonModule, FormsModule]
})
export class ProfessionalProfilePage implements OnInit {

  imageUrl = "";
    name = "";
    email = "";
  
    constructor(private navCtrl: NavController, private professionalService : ProfessionalService, private authService : AuthService, private toastService : ToastService) {}
  
    ngOnInit(): void {
      const storedUser : any = localStorage.getItem('user');
      const user = JSON.parse(storedUser);
      
      this.professionalService.getProfessionalForm({email : user.email}).subscribe(async(res:any)=>{
        this.name = res.firstName+ ' '+ res.lastName;
        this.imageUrl = res.url;
      })
  
      this.email = user.email;
    }
  
    ionViewWillEnter() {
      const storedUser : any = localStorage.getItem('user');
      const user = JSON.parse(storedUser);
      
      this.professionalService.getProfessionalForm({email : user.email}).subscribe(async(res:any)=>{
        this.name = res.firstName+ ' '+ res.lastName;
        this.imageUrl = res.url;
      })
    }
  
  
    profileOptions = [
      { label: 'Edit Profile', icon: 'assets/profile/profile-edit.svg', route: '/professional-edit-profile' },
      { label: 'Certification Management', icon: 'assets/profile/profile-certifications.svg', route: '/professional-certifications' }
    ];
  
    onOptionClick(item: any) {
      if (item.route) {
        this.navCtrl.navigateForward(item.route);
      }
    }
  
    onLogout() {
      this.authService.logout();
      this.toastService.show('Professional logged out!', {
        color: 'primary',
        position: 'bottom',
        duration: 3000
      });
      this.navCtrl.navigateRoot('/login-professional');
    }
}
