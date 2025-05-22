import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar } from '@ionic/angular/standalone';
import { NavController } from '@ionic/angular';
import { ClientService } from 'src/app/_services/client/client.service';
import { ToastService } from 'src/app/core/_services/toast/toast.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-client-payment-update',
  templateUrl: './client-payment-update.page.html',
  styleUrls: ['./client-payment-update.page.scss'],
  standalone: true,
  imports: [IonContent, CommonModule, FormsModule, ReactiveFormsModule]
})
export class ClientPaymentUpdatePage implements OnInit {

  form!: FormGroup;
  isSubmitting = false;

  constructor(
    private fb: FormBuilder,
    private clientService: ClientService,
    private navCtrl: NavController,
    private toastService : ToastService,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    const cardNumber = this.route.snapshot.queryParamMap.get('cardNumber');
    const user = JSON.parse(localStorage.getItem('user')!);

    this.form = this.fb.group({
      cardNumber: [{ value: '', disabled: true }, [Validators.required, Validators.pattern(/^(\d{4}-){3}\d{4}$/)]],
      cvv: ['', [Validators.required, Validators.pattern(/^\d{3,4}$/)]],
      expiry: ['', [Validators.required, Validators.pattern(/^(0[1-9]|1[0-2])\/\d{2}$/)]],
      cardHolderName: ['', [Validators.required, Validators.minLength(2)]]
    });

    this.clientService.getCardDetails({ email: user.email, cardNumber }).subscribe((res: any) => {
      const card = res;
      const formattedCardNumber = card.cardNumber.replace(/(\d{4})(?=\d)/g, '$1-').slice(0, 19);
      const expiry = `${card.expiryMonth}/${card.expiryYear}`;
    
      this.form.get('cardNumber')?.setValue(formattedCardNumber, { emitEvent: false });
      this.form.patchValue({
        cvv: card.cvv,
        expiry: expiry,
        cardHolderName: card.cardHolderName
      });
    });    
  }

  prev() {
    this.navCtrl.navigateBack('/client-payment-methods');
  }

  onExpiryInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    let value = input.value.replace(/\D/g, '');
  
    if (value.length > 4) {
      value = value.slice(0, 4);
    }
  
    if (value.length >= 3) {
      value = value.slice(0, 2) + '/' + value.slice(2);
    }
  
    input.value = value;
    this.form.get('expiry')?.setValue(value, { emitEvent: false });
  }
  
  onExpiryBlur(): void {
    const control = this.form.get('expiry');
    const value = control?.value;
  
    // Optional validation on blur
    if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(value)) {
      control?.setErrors({ invalidFormat: true });
    } else {
      control?.setErrors(null);
    }
  }


  onCardNumberInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    let digitsOnly = input.value.replace(/\D/g, '').slice(0, 16); // Only digits, max 16
  
    // Format as ####-####-####-####
    let formatted = '';
    for (let i = 0; i < digitsOnly.length; i++) {
      if (i > 0 && i % 4 === 0) formatted += '-';
      formatted += digitsOnly[i];
    }
  
    input.value = formatted;
    this.form.get('cardNumber')?.setValue(formatted, { emitEvent: false });
  }
  

  blockNonDigits(event: KeyboardEvent) {
    const allowedKeys = ['Backspace', 'Tab', 'ArrowLeft', 'ArrowRight'];
    if (!/^\d$/.test(event.key) && !allowedKeys.includes(event.key)) {
      event.preventDefault();
    }
  }
  
  
  
  onCvvInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    let value = input.value.replace(/\D/g, '').slice(0, 4); // Only digits, max 4
  
    input.value = value;
    this.form.get('cvv')?.setValue(value, { emitEvent: false });
  }

  updateCard() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const user = JSON.parse(localStorage.getItem('user')!);
    if (!user){
      return;
    }

    this.form.get('cardNumber')?.enable({ emitEvent: false });
    const cleanCardNumber = this.form.value.cardNumber.replace(/\D/g, '');
    const { cvv, expiry, cardHolderName } = this.form.value;
    const [expiryMonth, expiryYear] = expiry.split('/');
  
    const payload = {
      email: user.email,
      cardNumber: cleanCardNumber,
      cvv,
      expiryMonth,
      expiryYear,
      cardHolderName
    };

    this.form.get('cardNumber')?.disable({ emitEvent: false });
  
    this.isSubmitting = true;
    this.clientService.updateClientPaymentMethod(payload).subscribe(async(res : any)=> {
      console.log(res)
      if(res.message === 'success'){
        this.toastService.show('Payment method updated successfully!', {
          color: 'primary',
          position: 'bottom',
          duration: 3000
        });
        this.isSubmitting = false;
        this.prev();
        return
      }
      else{
        this.toastService.show('Payment method update failed!', {
          color: 'danger',
          position: 'bottom',
          duration: 3000
        });
        this.isSubmitting = false;
        return
      }
    })
  }
  
  deleteCard() {
    const user = JSON.parse(localStorage.getItem('user')!);
    this.form.get('cardNumber')?.enable({ emitEvent: false });
    const cardNumber = this.form.getRawValue().cardNumber.replace(/\D/g, '');
    this.form.get('cardNumber')?.disable({ emitEvent: false });

  
    this.clientService.deleteClientPaymentMethod({ email: user.email, cardNumber }).subscribe((res: any) => {
      if (res.message === 'success') {
        this.toastService.show('Payment method deleted successfully!', {
          color: 'primary',
          position: 'bottom',
          duration: 3000
        });
        this.isSubmitting = false;
        this.prev();
        return
      } else {
        this.toastService.show('Failed to delete payment method.', {
          color: 'danger',
          position: 'bottom',
          duration: 3000
        });
        this.isSubmitting = false;
        return
      }
    });
  }  
  

  submitCard() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const user = JSON.parse(localStorage.getItem('user')!);
    if (!user){
      return;
    }

    const cleanCardNumber = this.form.value.cardNumber.replace(/\D/g, '');

    const { cvv, expiry, cardHolderName } = this.form.value;
    const [expiryMonth, expiryYear] = expiry.split('/');

    const payload = {
      email : user.email,
      cardNumber : cleanCardNumber,
      cvv : cvv,
      expiryMonth : expiryMonth,
      expiryYear : expiryYear,
      cardHolderName : cardHolderName
    };

    console.log(this.form.value)
    console.log(user.email)
    console.log(payload)
    this.isSubmitting = true;
    this.clientService.addClientPaymentMethod(payload).subscribe(async(res : any)=> {
      console.log(res)
      if(res.message === 'success'){
        this.toastService.show('Payment method added successfully!', {
          color: 'primary',
          position: 'bottom',
          duration: 3000
        });
        this.isSubmitting = false;
        this.prev();
        return
      }
      else{
        this.toastService.show('Payment method could not be updated at the moment!', {
          color: 'danger',
          position: 'bottom',
          duration: 3000
        });
        this.isSubmitting = false;
        return
      }
    })
  }

}
