import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ClientSetAppointmentDatePage } from './client-set-appointment-date.page';

describe('ClientSetAppointmentDatePage', () => {
  let component: ClientSetAppointmentDatePage;
  let fixture: ComponentFixture<ClientSetAppointmentDatePage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ClientSetAppointmentDatePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
