import { Injectable, inject, PLATFORM_ID, signal } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { environment } from '../../environments/environment';

declare global {
  interface Window {
    grecaptcha: {
      ready: (callback: () => void) => void;
      execute: (siteKey: string, options: { action: string }) => Promise<string>;
    };
  }
}

@Injectable({ providedIn: 'root' })
export class RecaptchaService {
  private platformId = inject(PLATFORM_ID);
  private siteKey = environment.recaptchaSiteKey;
  private scriptLoaded = signal(false);
  private scriptLoading = signal(false);

  async execute(action: string): Promise<string> {
    if (!isPlatformBrowser(this.platformId)) {
      throw new Error('reCAPTCHA is not available on server');
    }

    await this.loadScript();

    return new Promise((resolve, reject) => {
      window.grecaptcha.ready(() => {
        window.grecaptcha
          .execute(this.siteKey, { action })
          .then(resolve)
          .catch(reject);
      });
    });
  }

  private loadScript(): Promise<void> {
    if (this.scriptLoaded()) {
      return Promise.resolve();
    }

    if (this.scriptLoading()) {
      return new Promise((resolve) => {
        const checkLoaded = setInterval(() => {
          if (this.scriptLoaded()) {
            clearInterval(checkLoaded);
            resolve();
          }
        }, 100);
      });
    }

    this.scriptLoading.set(true);

    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = `https://www.google.com/recaptcha/api.js?render=${this.siteKey}`;
      script.async = true;
      script.defer = true;

      script.onload = () => {
        this.scriptLoaded.set(true);
        this.scriptLoading.set(false);
        resolve();
      };

      script.onerror = () => {
        this.scriptLoading.set(false);
        reject(new Error('Failed to load reCAPTCHA script'));
      };

      document.head.appendChild(script);
    });
  }
}
