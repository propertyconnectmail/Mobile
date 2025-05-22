import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ClientOfficialBrowsePage } from './client-official-browse.page';

describe('ClientOfficialBrowsePage', () => {
  let component: ClientOfficialBrowsePage;
  let fixture: ComponentFixture<ClientOfficialBrowsePage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ClientOfficialBrowsePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
