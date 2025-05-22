import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent } from '@ionic/angular/standalone';
import { ClientService } from 'src/app/_services/client/client.service';
import { NavController } from '@ionic/angular';

type PaymentCard = {
  cardNumber: string;
  last4: string;
};

@Component({
  selector: 'app-client-payment-methods',
  templateUrl: './client-payment-methods.page.html',
  styleUrls: ['./client-payment-methods.page.scss'],
  standalone: true,
  imports: [IonContent, CommonModule, FormsModule]
})
export class ClientPaymentMethodsPage implements OnInit {

  paymentCards: PaymentCard[] = [];

  constructor(
    private navCtrl: NavController,
    private clientService: ClientService
  ) {}

  ngOnInit() {
    const user = JSON.parse(localStorage.getItem('user')!);
    console.log(user.email)

    this.clientService.getClientPaymentMethods({email:user.email}).subscribe(async(res : any)=>{
      this.paymentCards = res.map((cardNumber: string) => ({
        cardNumber: cardNumber,           // add this field
        last4: cardNumber.slice(-4)       // keep last4 for display
      }));
    })
  }

  ionViewWillEnter() {
    const user = JSON.parse(localStorage.getItem('user')!);
    this.clientService.getClientPaymentMethods({ email: user.email }).subscribe((res: any) => {
      this.paymentCards = res.map((cardNumber: string) => ({
        cardNumber: cardNumber,
        last4: cardNumber.slice(-4)
      }));
    });
  }
  

  prev() {
    this.navCtrl.navigateBack('/client-profile');
  }

  cardAdd() {
    this.navCtrl.navigateForward('/client-payment-crud');
  }

  cardUpdate(cardNumber: string): void {
    this.navCtrl.navigateForward(['/client-payment-update'], {
      queryParams: { cardNumber }
    });
  }

}
