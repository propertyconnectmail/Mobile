import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ClientOfficialProfilePage } from './client-official-profile.page';

describe('ClientOfficialProfilePage', () => {
  let component: ClientOfficialProfilePage;
  let fixture: ComponentFixture<ClientOfficialProfilePage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ClientOfficialProfilePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
