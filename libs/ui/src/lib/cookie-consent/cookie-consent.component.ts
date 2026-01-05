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

export interface CookieConsentConfig {
  /** Google Analytics Measurement ID (e.g., 'G-XXXXXXXXXX') */
  gaTrackingId: string;
  /** Main message displayed in the banner */
  message?: string;
  /** Text for the accept button */
  acceptButtonText?: string;
  /** Text for the reject button */
  rejectButtonText?: string;
  /** Optional link to privacy policy */
  privacyPolicyUrl?: string;
  /** Text for privacy policy link */
  privacyPolicyText?: string;
  /** localStorage key for storing consent */
  storageKey?: string;
}

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
   * Google Analytics Measurement ID (required)
   * Format: 'G-XXXXXXXXXX' for GA4
   */
  gaTrackingId = input.required<string>();

  /**
   * Main message displayed in the consent banner
   */
  message = input<string>(
    'Ta strona używa plików cookie do analizy ruchu (Google Analytics). Twoje dane pomagają nam ulepszać serwis.'
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
   * Emitted when user makes a consent decision
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

    // Initialize Google Consent Mode with default denied state
    this.initGoogleConsentMode();

    // Check for existing consent
    const savedConsent = this.getSavedConsent();

    if (savedConsent) {
      this.consentStatus.set(savedConsent.status);
      if (savedConsent.status === 'accepted') {
        this.updateGoogleConsent(true);
        this.loadGoogleAnalytics();
      }
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
    this.handleConsent('accepted');
    this.updateGoogleConsent(true);
    this.loadGoogleAnalytics();
  }

  /**
   * Handle reject button click
   */
  protected onReject(): void {
    this.handleConsent('rejected');
    this.updateGoogleConsent(false);
  }

  /**
   * Initialize Google Consent Mode v2 with default denied state
   * This must be called BEFORE loading gtag.js
   */
  private initGoogleConsentMode(): void {
    // Initialize dataLayer
    (window as any).dataLayer = (window as any).dataLayer || [];

    // Define gtag function (must use arguments, not rest params)
    (window as any).gtag = function () {
      (window as any).dataLayer.push(arguments);
    };

    // Set default consent state (denied by default for GDPR compliance)
    (window as any).gtag('consent', 'default', {
      analytics_storage: 'denied',
      ad_storage: 'denied',
      ad_user_data: 'denied',
      ad_personalization: 'denied',
      wait_for_update: 500,
    });
  }

  /**
   * Update Google Consent Mode based on user decision
   */
  private updateGoogleConsent(granted: boolean): void {
    const gtag = (window as any).gtag;
    if (!gtag) return;

    gtag('consent', 'update', {
      analytics_storage: granted ? 'granted' : 'denied',
    });
  }

  /**
   * Dynamically load Google Analytics script
   */
  private loadGoogleAnalytics(): void {
    const trackingId = this.gaTrackingId();
    console.log('[GA] Loading Google Analytics:', trackingId);

    // Check if already loaded
    if (document.querySelector(`script[src*="${trackingId}"]`)) {
      console.log('[GA] Script already loaded');
      return;
    }

    // Load gtag.js
    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${trackingId}`;
    document.head.appendChild(script);

    // Initialize GA
    script.onload = () => {
      console.log('[GA] Script loaded, initializing...');
      const gtag = (window as any).gtag;
      if (gtag) {
        gtag('js', new Date());
        gtag('config', trackingId, {
          anonymize_ip: true,
        });
        console.log('[GA] Initialized successfully');
      }
    };

    script.onerror = () => {
      console.error('[GA] Failed to load script');
    };
  }

  /**
   * Handle consent decision (save and emit)
   */
  private handleConsent(status: ConsentStatus): void {
    const result: ConsentResult = {
      status,
      timestamp: Date.now(),
    };

    // Save to localStorage
    this.saveConsent(result);

    // Update state
    this.consentStatus.set(status);
    this.isVisible.set(false);

    // Emit event
    this.consentChanged.emit(result);
  }

  /**
   * Save consent to localStorage
   */
  private saveConsent(result: ConsentResult): void {
    try {
      localStorage.setItem(this.storageKey(), JSON.stringify(result));
    } catch {
      // localStorage might be disabled
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
