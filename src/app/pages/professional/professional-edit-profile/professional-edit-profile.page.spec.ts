import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProfessionalEditProfilePage } from './professional-edit-profile.page';

describe('ProfessionalEditProfilePage', () => {
  let component: ProfessionalEditProfilePage;
  let fixture: ComponentFixture<ProfessionalEditProfilePage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfessionalEditProfilePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
