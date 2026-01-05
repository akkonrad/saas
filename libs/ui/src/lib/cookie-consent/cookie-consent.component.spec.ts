import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PLATFORM_ID } from '@angular/core';
import { UiCookieConsentComponent } from './cookie-consent.component';

describe('UiCookieConsentComponent', () => {
  let component: UiCookieConsentComponent;
  let fixture: ComponentFixture<UiCookieConsentComponent>;

  beforeEach(async () => {
    // Clear localStorage before each test
    localStorage.clear();

    await TestBed.configureTestingModule({
      imports: [UiCookieConsentComponent],
      providers: [{ provide: PLATFORM_ID, useValue: 'browser' }],
    }).compileComponents();

    fixture = TestBed.createComponent(UiCookieConsentComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('gaTrackingId', 'G-TEST123');
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should show banner on init when no consent saved', () => {
    fixture.detectChanges();
    const banner = fixture.nativeElement.querySelector('[role="dialog"]');
    expect(banner).toBeTruthy();
  });

  it('should hide banner when consent already saved', () => {
    localStorage.setItem(
      'cookie-consent',
      JSON.stringify({ status: 'accepted', timestamp: Date.now() })
    );
    fixture.detectChanges();
    const banner = fixture.nativeElement.querySelector('[role="dialog"]');
    expect(banner).toBeFalsy();
  });

  it('should emit consentChanged with accepted status on accept', () => {
    fixture.detectChanges();
    const spy = jest.spyOn(component.consentChanged, 'emit');

    // Find the actual button inside ui-button
    const buttons = fixture.nativeElement.querySelectorAll('ui-button button');
    const acceptButton = buttons[1]; // Second button is accept (primary)
    acceptButton.click();
    fixture.detectChanges();

    expect(spy).toHaveBeenCalledWith(
      expect.objectContaining({ status: 'accepted' })
    );
  });

  it('should emit consentChanged with rejected status on reject', () => {
    fixture.detectChanges();
    const spy = jest.spyOn(component.consentChanged, 'emit');

    // Find the actual button inside ui-button
    const buttons = fixture.nativeElement.querySelectorAll('ui-button button');
    const rejectButton = buttons[0]; // First button is reject (ghost)
    rejectButton.click();
    fixture.detectChanges();

    expect(spy).toHaveBeenCalledWith(
      expect.objectContaining({ status: 'rejected' })
    );
  });

  it('should save consent to localStorage on accept', () => {
    fixture.detectChanges();

    const buttons = fixture.nativeElement.querySelectorAll('ui-button button');
    const acceptButton = buttons[1];
    acceptButton.click();
    fixture.detectChanges();

    const saved = JSON.parse(localStorage.getItem('cookie-consent') || '{}');
    expect(saved.status).toBe('accepted');
  });

  it('should use custom storage key', () => {
    fixture.componentRef.setInput('storageKey', 'custom-consent-key');
    fixture.detectChanges();

    const buttons = fixture.nativeElement.querySelectorAll('ui-button button');
    const acceptButton = buttons[1];
    acceptButton.click();
    fixture.detectChanges();

    expect(localStorage.getItem('custom-consent-key')).toBeTruthy();
  });

  it('should display custom message', () => {
    const customMessage = 'Custom cookie message';
    fixture.componentRef.setInput('message', customMessage);
    fixture.detectChanges();

    const messageEl = fixture.nativeElement.querySelector('p');
    expect(messageEl.textContent).toContain(customMessage);
  });

  it('should display privacy policy link when URL provided', () => {
    fixture.componentRef.setInput('privacyPolicyUrl', 'https://example.com/privacy');
    fixture.componentRef.setInput('privacyPolicyText', 'Privacy Policy');
    fixture.detectChanges();

    const link = fixture.nativeElement.querySelector('a.link');
    expect(link).toBeTruthy();
    expect(link.href).toBe('https://example.com/privacy');
    expect(link.textContent.trim()).toBe('Privacy Policy');
  });
});
