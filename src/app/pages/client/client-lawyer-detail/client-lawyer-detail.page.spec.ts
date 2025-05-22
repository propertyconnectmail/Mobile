import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ClientLawyerDetailPage } from './client-lawyer-detail.page';

describe('ClientLawyerDetailPage', () => {
  let component: ClientLawyerDetailPage;
  let fixture: ComponentFixture<ClientLawyerDetailPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ClientLawyerDetailPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
