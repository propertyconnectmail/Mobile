import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ClientPaymentCrudPage } from './client-payment-crud.page';

describe('ClientPaymentCrudPage', () => {
  let component: ClientPaymentCrudPage;
  let fixture: ComponentFixture<ClientPaymentCrudPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ClientPaymentCrudPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
