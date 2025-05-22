import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ClientRegistryProfilePage } from './client-registry-profile.page';

describe('ClientRegistryProfilePage', () => {
  let component: ClientRegistryProfilePage;
  let fixture: ComponentFixture<ClientRegistryProfilePage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ClientRegistryProfilePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
