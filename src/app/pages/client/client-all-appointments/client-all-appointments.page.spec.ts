import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ClientAllAppointmentsPage } from './client-all-appointments.page';

describe('ClientAllAppointmentsPage', () => {
  let component: ClientAllAppointmentsPage;
  let fixture: ComponentFixture<ClientAllAppointmentsPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ClientAllAppointmentsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
