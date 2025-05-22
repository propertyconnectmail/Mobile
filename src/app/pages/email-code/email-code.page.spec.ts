import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EmailCodePage } from './email-code.page';

describe('EmailCodePage', () => {
  let component: EmailCodePage;
  let fixture: ComponentFixture<EmailCodePage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(EmailCodePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
