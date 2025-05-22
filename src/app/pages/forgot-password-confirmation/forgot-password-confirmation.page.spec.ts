import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ForgotPasswordConfirmationPage } from './forgot-password-confirmation.page';

describe('ForgotPasswordConfirmationPage', () => {
  let component: ForgotPasswordConfirmationPage;
  let fixture: ComponentFixture<ForgotPasswordConfirmationPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ForgotPasswordConfirmationPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
