import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ClientPaymentMethodsPage } from './client-payment-methods.page';

describe('ClientPaymentMethodsPage', () => {
  let component: ClientPaymentMethodsPage;
  let fixture: ComponentFixture<ClientPaymentMethodsPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ClientPaymentMethodsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
