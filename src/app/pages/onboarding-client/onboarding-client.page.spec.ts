import { ComponentFixture, TestBed } from '@angular/core/testing';
import { OnboardingClientPage } from './onboarding-client.page';

describe('OnboardingClientPage', () => {
  let component: OnboardingClientPage;
  let fixture: ComponentFixture<OnboardingClientPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(OnboardingClientPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
