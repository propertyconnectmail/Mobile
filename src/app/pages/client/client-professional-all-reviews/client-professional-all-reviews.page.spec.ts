import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ClientProfessionalAllReviewsPage } from './client-professional-all-reviews.page';

describe('ClientProfessionalAllReviewsPage', () => {
  let component: ClientProfessionalAllReviewsPage;
  let fixture: ComponentFixture<ClientProfessionalAllReviewsPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ClientProfessionalAllReviewsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
