import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProfessionalAppointmentDetailPage } from './professional-appointment-detail.page';

describe('ProfessionalAppointmentDetailPage', () => {
  let component: ProfessionalAppointmentDetailPage;
  let fixture: ComponentFixture<ProfessionalAppointmentDetailPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfessionalAppointmentDetailPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
