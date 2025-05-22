import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ClientEditProfilePage } from './client-edit-profile.page';

describe('ClientEditProfilePage', () => {
  let component: ClientEditProfilePage;
  let fixture: ComponentFixture<ClientEditProfilePage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ClientEditProfilePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
