import { Component, Input  } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-star-rating',
  templateUrl: './star-rating.component.html',
  styleUrls: ['./star-rating.component.scss'],
  imports: [CommonModule]
})
export class StarRatingComponent {

  @Input() rating: number = 0;
  stars = Array(5).fill(0);

  getStarFillStyle(index: number): string {
    const fill = this.rating - index;
    const percentage = Math.max(0, Math.min(1, fill)) * 100;
    return `linear-gradient(to right, #facc15 ${percentage}%, #e5e7eb ${percentage}%)`;
  }
}
