import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ForgotPasswordNewPasswordPage } from './forgot-password-new-password.page';

describe('ForgotPasswordNewPasswordPage', () => {
  let component: ForgotPasswordNewPasswordPage;
  let fixture: ComponentFixture<ForgotPasswordNewPasswordPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ForgotPasswordNewPasswordPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
