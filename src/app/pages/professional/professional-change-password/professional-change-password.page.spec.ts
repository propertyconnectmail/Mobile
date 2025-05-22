import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProfessionalChangePasswordPage } from './professional-change-password.page';

describe('ProfessionalChangePasswordPage', () => {
  let component: ProfessionalChangePasswordPage;
  let fixture: ComponentFixture<ProfessionalChangePasswordPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfessionalChangePasswordPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
