import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ForgotPasswordCodePage } from './forgot-password-code.page';

describe('ForgotPasswordCodePage', () => {
  let component: ForgotPasswordCodePage;
  let fixture: ComponentFixture<ForgotPasswordCodePage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ForgotPasswordCodePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
