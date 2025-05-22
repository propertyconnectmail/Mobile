import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ClientRegistryBrowsePage } from './client-registry-browse.page';

describe('ClientRegistryBrowsePage', () => {
  let component: ClientRegistryBrowsePage;
  let fixture: ComponentFixture<ClientRegistryBrowsePage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ClientRegistryBrowsePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
