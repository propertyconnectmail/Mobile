import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ClientAppointmentReviewPage } from './client-appointment-review.page';

describe('ClientAppointmentReviewPage', () => {
  let component: ClientAppointmentReviewPage;
  let fixture: ComponentFixture<ClientAppointmentReviewPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ClientAppointmentReviewPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
