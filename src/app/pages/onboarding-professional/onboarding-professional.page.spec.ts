import { ComponentFixture, TestBed } from '@angular/core/testing';
import { OnboardingProfessionalPage } from './onboarding-professional.page';

describe('OnboardingProfessionalPage', () => {
  let component: OnboardingProfessionalPage;
  let fixture: ComponentFixture<OnboardingProfessionalPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(OnboardingProfessionalPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
