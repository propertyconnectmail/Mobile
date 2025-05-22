import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ClientAppointmentDetailPage } from './client-appointment-detail.page';

describe('ClientAppointmentDetailPage', () => {
  let component: ClientAppointmentDetailPage;
  let fixture: ComponentFixture<ClientAppointmentDetailPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ClientAppointmentDetailPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
