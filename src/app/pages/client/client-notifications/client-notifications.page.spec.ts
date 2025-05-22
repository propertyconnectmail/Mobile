import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ClientNotificationsPage } from './client-notifications.page';

describe('ClientNotificationsPage', () => {
  let component: ClientNotificationsPage;
  let fixture: ComponentFixture<ClientNotificationsPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ClientNotificationsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
