import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProfessionalProfilePage } from './professional-profile.page';

describe('ProfessionalProfilePage', () => {
  let component: ProfessionalProfilePage;
  let fixture: ComponentFixture<ProfessionalProfilePage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfessionalProfilePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
