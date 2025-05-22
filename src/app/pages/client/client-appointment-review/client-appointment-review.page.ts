import { IonContent } from '@ionic/angular/standalone';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { ToastService } from 'src/app/core/_services/toast/toast.service';
import { ProfessionalService } from 'src/app/_services/professional/professional.service';
import { NavController } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-client-appointment-review',
  templateUrl: './client-appointment-review.page.html',
  styleUrls: ['./client-appointment-review.page.scss'],
  standalone: true,
  imports: [ IonContent,  CommonModule, FormsModule, ReactiveFormsModule]
})
export class ClientAppointmentReviewPage implements OnInit {

  reviewForm!: FormGroup;
  isSubmitting = false;
  stars = Array(5).fill(0);

  constructor(
    private fb: FormBuilder,
    private professionalService: ProfessionalService,
    private toastService: ToastService,
    private navCtrl: NavController,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.reviewForm = this.fb.group({
      rating: [0, [Validators.required, Validators.min(1)]],
      message: ['', [Validators.required, Validators.minLength(10)]],
    });
  }

  
  setRating(value: number) {
    this.reviewForm.get('rating')?.setValue(value);
  }

  skipReview() {
    this.navCtrl.navigateRoot('/client-home')
  }

  submitReview() {
    if (this.reviewForm.invalid) return;

    const user = JSON.parse(localStorage.getItem('user')!);
    const appointmentId = this.route.snapshot.queryParamMap.get('appointmentId');
    const professionalEmail = this.route.snapshot.queryParamMap.get('professionalEmail');

    const review = {
      appointmentId,
      clientEmail: user.email,
      clientUrl: user.url,
      clientName: user.firstName,
      rating: String(this.reviewForm.get('rating')?.value),
      message: this.reviewForm.get('message')?.value,
      date: new Date().toLocaleDateString('en-GB')
    };

    this.isSubmitting = true;

    // Step 1: Fetch professional data
    this.professionalService.getProfessionalForm({ email: professionalEmail }).subscribe(async(res: any) => {
        const professional = res;

        // Step 2: Push new review and update rating metrics
        if (!Array.isArray(professional.rating)) {
          professional.rating = [];
        }
        professional.rating.push(review);

        // Convert string fields to numbers for calculations
        const newRating = Number(review.rating);
        const currentTotalRating = Number(professional.totalRating);
        const currentTotalCount = Number(professional.totalCount);
        const currentConsults = Number(professional.consults);

        // Update values
        const updatedTotalRating = currentTotalRating + newRating;
        const updatedTotalCount = currentTotalCount + 1;
        const updatedAverage = updatedTotalRating / updatedTotalCount;
        const updatedConsults = currentConsults + 1;

        // Convert back to string with formatting
        professional.totalRating = updatedTotalRating.toString();
        professional.totalCount = updatedTotalCount.toString();
        professional.consults = updatedConsults.toString();
        professional.averageRating = updatedAverage.toFixed(1); // e.g., "4.5"

        // Step 3: Update professional with new review
        this.professionalService.updateProfessionalForm(professional).subscribe(async(res:any) => {
          console.log(res);
          if(res.message === 'success'){
            this.toastService.show('Thank you for your feedback!', {
              color: 'primary',
              duration: 3000,
              position: 'bottom'
            });
            this.reviewForm.reset({ rating: 0, message: '' });
            this.isSubmitting = false;
            this.navCtrl.navigateRoot('/client-home')
            return
          }
          
          if(res.message != 'success'){
            this.toastService.show('Failed to submit review. Try again later.', {
              color: 'danger',
              duration: 3000,
              position: 'bottom'
            });
            this.isSubmitting = false;
          }
        });
    });
  }
}