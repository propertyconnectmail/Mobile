import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProfessionalAllReviewsPage } from './professional-all-reviews.page';

describe('ProfessionalAllReviewsPage', () => {
  let component: ProfessionalAllReviewsPage;
  let fixture: ComponentFixture<ProfessionalAllReviewsPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfessionalAllReviewsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
