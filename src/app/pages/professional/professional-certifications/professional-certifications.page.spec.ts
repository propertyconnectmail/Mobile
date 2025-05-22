import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProfessionalCertificationsPage } from './professional-certifications.page';

describe('ProfessionalCertificationsPage', () => {
  let component: ProfessionalCertificationsPage;
  let fixture: ComponentFixture<ProfessionalCertificationsPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfessionalCertificationsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
