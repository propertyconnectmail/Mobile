import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ClientEligibilityPage } from './client-eligibility.page';

describe('ClientEligibilityPage', () => {
  let component: ClientEligibilityPage;
  let fixture: ComponentFixture<ClientEligibilityPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ClientEligibilityPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
