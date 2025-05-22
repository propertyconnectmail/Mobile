import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RegisterProfessionalPage } from './register-professional.page';

describe('RegisterProfessionalPage', () => {
  let component: RegisterProfessionalPage;
  let fixture: ComponentFixture<RegisterProfessionalPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(RegisterProfessionalPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
