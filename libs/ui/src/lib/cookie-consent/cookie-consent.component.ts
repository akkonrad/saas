import {
  Component,
  ChangeDetectionStrategy,
  input,
  output,
  signal,
  inject,
  PLATFORM_ID,
  OnInit,
  computed,
} from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { UiButtonComponent } from '../button/button.component';

export type ConsentStatus = 'pending' | 'accepted' | 'rejected';

export interface ConsentResult {
  status: ConsentStatus;
  timestamp: number;
}

const STORAGE_KEY_DEFAULT = 'cookie-consent';

@Component({
  selector: 'ui-cookie-consent',
  standalone: true,
  imports: [CommonModule, UiButtonComponent],
  templateUrl: './cookie-consent.component.html',
  styleUrl: './cookie-consent.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UiCookieConsentComponent implements OnInit {
  private readonly platformId = inject(PLATFORM_ID);

  /**
   * Main message displayed in the consent banner
   */
  message = input<string>(
    'Ta strona używa plików cookie do analizy ruchu. Twoje dane pomagają nam ulepszać serwis.'
  );

  /**
   * Accept button text
   */
  acceptButtonText = input<string>('Akceptuję');

  /**
   * Reject button text
   */
  rejectButtonText = input<string>('Odrzucam');

  /**
   * Privacy policy URL (optional)
   */
  privacyPolicyUrl = input<string | undefined>(undefined);

  /**
   * Privacy policy link text
   */
  privacyPolicyText = input<string>('Polityka prywatności');

  /**
   * localStorage key for storing consent decision
   */
  storageKey = input<string>(STORAGE_KEY_DEFAULT);

  /**
   * Emitted when user accepts cookies
   */
  accepted = output<ConsentResult>();

  /**
   * Emitted when user rejects cookies
   */
  rejected = output<ConsentResult>();

  /**
   * Emitted when consent status changes (either accepted or rejected)
   */
  consentChanged = output<ConsentResult>();

  /**
   * Current visibility state of the banner
   */
  protected isVisible = signal(false);

  /**
   * Current consent status
   */
  protected consentStatus = signal<ConsentStatus>('pending');

  /**
   * Whether we're in browser environment
   */
  protected readonly isBrowser = computed(() => isPlatformBrowser(this.platformId));

  ngOnInit(): void {
    if (!this.isBrowser()) {
      return;
    }

    const savedConsent = this.getSavedConsent();

    if (savedConsent) {
      this.consentStatus.set(savedConsent.status);
      // Emit the saved consent so app can react (e.g., load GA if accepted)
      if (savedConsent.status === 'accepted') {
        this.accepted.emit(savedConsent);
      }
      this.consentChanged.emit(savedConsent);
      // Don't show banner if user already made a decision
      this.isVisible.set(false);
    } else {
      // Show banner for new visitors
      this.isVisible.set(true);
    }
  }

  /**
   * Handle accept button click
   */
  protected onAccept(): void {
    const result = this.handleConsent('accepted');
    this.accepted.emit(result);
  }

  /**
   * Handle reject button click
   */
  protected onReject(): void {
    const result = this.handleConsent('rejected');
    this.rejected.emit(result);
  }

  /**
   * Handle consent decision (save and emit)
   */
  private handleConsent(status: ConsentStatus): ConsentResult {
    const result: ConsentResult = {
      status,
      timestamp: Date.now(),
    };

    this.saveConsent(result);
    this.consentStatus.set(status);
    this.isVisible.set(false);
    this.consentChanged.emit(result);

    return result;
  }

  /**
   * Save consent to localStorage
   */
  private saveConsent(result: ConsentResult): void {
    try {
      localStorage.setItem(this.storageKey(), JSON.stringify(result));
    } catch {
      console.warn('Could not save cookie consent to localStorage');
    }
  }

  /**
   * Get saved consent from localStorage
   */
  private getSavedConsent(): ConsentResult | null {
    try {
      const saved = localStorage.getItem(this.storageKey());
      if (saved) {
        return JSON.parse(saved) as ConsentResult;
      }
    } catch {
      // localStorage might be disabled or corrupted
    }
    return null;
  }
}
