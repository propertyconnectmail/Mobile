import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ClientFavouritesPage } from './client-favourites.page';

describe('ClientFavouritesPage', () => {
  let component: ClientFavouritesPage;
  let fixture: ComponentFixture<ClientFavouritesPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ClientFavouritesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
