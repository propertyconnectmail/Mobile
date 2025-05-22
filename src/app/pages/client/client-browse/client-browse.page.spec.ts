import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ClientBrowsePage } from './client-browse.page';

describe('ClientBrowsePage', () => {
  let component: ClientBrowsePage;
  let fixture: ComponentFixture<ClientBrowsePage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ClientBrowsePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
