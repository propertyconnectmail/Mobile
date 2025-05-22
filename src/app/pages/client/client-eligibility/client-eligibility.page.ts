import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent } from '@ionic/angular/standalone';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-client-eligibility',
  templateUrl: './client-eligibility.page.html',
  styleUrls: ['./client-eligibility.page.scss'],
  standalone: true,
  imports: [IonContent,CommonModule, FormsModule]
})
export class ClientEligibilityPage implements OnInit {

  forcedSaleValue: number = 0;
  monthlyIncome: number = 0;
  monthlyExpenses: number = 0;
  existingEMI: number = 0;
  interestRate: number = 13; // Default annual interest
  tenure: number = 20;       // Default years

  eligibleLoan: number = 0;
  calculatedEMI: number = 0;
  showResults: boolean = false;

  constructor(private navCtrl: NavController) {}

  ngOnInit() {}

  prev() {
    this.navCtrl.navigateBack('/client-profile');
  }

  calculateEligibility() {
  // Step 1: Loan based on Forced Sale Value
  const loanA = this.forcedSaleValue * 0.75;

  // Step 2: Calculate repayment capacity
  const netDisposableIncome = this.monthlyIncome - (this.monthlyExpenses + this.existingEMI);
  const maxEMI = netDisposableIncome * 0.6;

  const r = this.interestRate / 12 / 100; // Monthly interest rate
  const n = this.tenure * 12; // Total number of months

  // Step 3: Reverse EMI formula to calculate max eligible loan (Loan B)
  const compoundFactor = Math.pow(1 + r, n);
  const loanB = maxEMI * ((compoundFactor - 1) / (r * compoundFactor));

  // Step 4: Determine the final eligible loan
  const eligible = Math.min(loanA, loanB);
  this.eligibleLoan = eligible > 0 ? Math.round(eligible) : 0;

  // Step 5: Calculate the actual EMI for the eligible loan
  const actualEMI = this.eligibleLoan * r * compoundFactor / (compoundFactor - 1);
  this.calculatedEMI = Math.round(actualEMI);

  // Step 6: Show results
  this.showResults = true;
} 

}
