import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ClientPaymentUpdatePage } from './client-payment-update.page';

describe('ClientPaymentUpdatePage', () => {
  let component: ClientPaymentUpdatePage;
  let fixture: ComponentFixture<ClientPaymentUpdatePage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ClientPaymentUpdatePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
