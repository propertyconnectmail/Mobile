import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ClientPaymentPagePage } from './client-payment-page.page';

describe('ClientPaymentPagePage', () => {
  let component: ClientPaymentPagePage;
  let fixture: ComponentFixture<ClientPaymentPagePage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ClientPaymentPagePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
