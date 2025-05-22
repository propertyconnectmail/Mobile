import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProfessionalHomePage } from './professional-home.page';

describe('ProfessionalHomePage', () => {
  let component: ProfessionalHomePage;
  let fixture: ComponentFixture<ProfessionalHomePage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfessionalHomePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
