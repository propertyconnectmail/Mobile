import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ClientPaymentSuccessPage } from './client-payment-success.page';

describe('ClientPaymentSuccessPage', () => {
  let component: ClientPaymentSuccessPage;
  let fixture: ComponentFixture<ClientPaymentSuccessPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ClientPaymentSuccessPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
