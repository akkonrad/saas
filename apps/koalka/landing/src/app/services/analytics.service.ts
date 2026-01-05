import { Injectable, inject, PLATFORM_ID, NgZone, OnDestroy } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    dataLayer?: unknown[];
  }
}

const GA_TRACKING_ID = 'G-V4P12YZRYL';

@Injectable({
  providedIn: 'root',
})
export class AnalyticsService implements OnDestroy {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly ngZone = inject(NgZone);

  private observer: IntersectionObserver | null = null;
  private trackedSections = new Set<string>();
  private gaInitialized = false;

  /**
   * Initialize Google Analytics after user consent
   */
  initializeGA(): void {
    if (!isPlatformBrowser(this.platformId) || this.gaInitialized) {
      return;
    }

    console.log('[GA] Initializing Google Analytics:', GA_TRACKING_ID);

    // Initialize dataLayer and gtag function
    window.dataLayer = window.dataLayer || [];
    window.gtag = function () {
      window.dataLayer!.push(arguments);
    };

    // Set consent granted
    window.gtag('consent', 'default', {
      analytics_storage: 'granted',
    });

    // Load gtag.js script
    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_TRACKING_ID}`;
    document.head.appendChild(script);

    script.onload = () => {
      console.log('[GA] Script loaded, configuring...');
      window.gtag!('js', new Date());
      window.gtag!('config', GA_TRACKING_ID, {
        anonymize_ip: true,
      });
      console.log('[GA] Initialized successfully');
      this.gaInitialized = true;
    };

    script.onerror = () => {
      console.error('[GA] Failed to load script');
    };
  }

  /**
   * Track a custom event in Google Analytics
   */
  trackEvent(
    eventName: string,
    params?: Record<string, string | number | boolean>
  ): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    if (typeof window.gtag === 'function') {
      window.gtag('event', eventName, params);
    }
  }

  /**
   * Track contact form submission
   */
  trackContactFormSubmission(): void {
    this.trackEvent('generate_lead', {
      event_category: 'engagement',
      event_label: 'contact_form',
    });
  }

  /**
   * Track CTA button click
   */
  trackCTAClick(ctaName: string, ctaLocation: string): void {
    this.trackEvent('cta_click', {
      event_category: 'engagement',
      cta_name: ctaName,
      cta_location: ctaLocation,
    });
  }

  /**
   * Track scroll to section (fires once per section per session)
   */
  trackSectionView(sectionId: string): void {
    if (this.trackedSections.has(sectionId)) {
      return;
    }

    this.trackedSections.add(sectionId);
    this.trackEvent('section_view', {
      event_category: 'engagement',
      section_id: sectionId,
    });
  }

  /**
   * Observe a section for scroll tracking
   */
  observeSection(element: HTMLElement, sectionId: string): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    this.ngZone.runOutsideAngular(() => {
      if (!this.observer) {
        this.observer = new IntersectionObserver(
          (entries) => {
            entries.forEach((entry) => {
              if (entry.isIntersecting) {
                const id = entry.target.getAttribute('data-track-section');
                if (id) {
                  this.trackSectionView(id);
                }
              }
            });
          },
          { threshold: 0.5 }
        );
      }

      element.setAttribute('data-track-section', sectionId);
      this.observer.observe(element);
    });
  }

  ngOnDestroy(): void {
    this.observer?.disconnect();
  }
}
