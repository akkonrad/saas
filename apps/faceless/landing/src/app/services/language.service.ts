import { Injectable, inject, PLATFORM_ID, signal } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { TranslateService } from '@ngx-translate/core';
import { Router } from '@angular/router';
import { Meta, Title } from '@angular/platform-browser';

export type Language = 'pl' | 'en';

@Injectable({
  providedIn: 'root',
})
export class LanguageService {
  private translateService = inject(TranslateService);
  private router = inject(Router);
  private platformId = inject(PLATFORM_ID);
  private meta = inject(Meta);
  private title = inject(Title);

  currentLanguage = signal<Language>('en');

  private readonly STORAGE_KEY = 'faceless-language';
  private readonly SUPPORTED_LANGUAGES: Language[] = ['en', 'pl'];

  constructor() {
    this.initializeLanguage();
  }

  private initializeLanguage(): void {
    // Set supported languages
    this.translateService.addLangs(this.SUPPORTED_LANGUAGES);
    this.translateService.setDefaultLang('en');

    // Determine initial language
    let initialLang: Language = 'en';

    if (isPlatformBrowser(this.platformId)) {
      // Check URL for language prefix
      const urlLang = this.getLanguageFromUrl();
      if (urlLang) {
        initialLang = urlLang;
      } else {
        // Check localStorage
        const storedLang = localStorage.getItem(this.STORAGE_KEY) as Language;
        if (storedLang && this.SUPPORTED_LANGUAGES.includes(storedLang)) {
          initialLang = storedLang;
        }
      }
    }

    this.setLanguage(initialLang, false);
  }

  private getLanguageFromUrl(): Language | null {
    if (isPlatformBrowser(this.platformId)) {
      const path = window.location.pathname;
      if (path.startsWith('/pl')) {
        return 'pl';
      }
    }
    return null;
  }

  setLanguage(lang: Language, navigate: boolean = true): void {
    if (!this.SUPPORTED_LANGUAGES.includes(lang)) {
      lang = 'en';
    }

    this.currentLanguage.set(lang);
    this.translateService.use(lang);

    // Update document lang attribute and meta description
    this.updateDocumentLang(lang);
    this.updateMetaTags();

    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem(this.STORAGE_KEY, lang);

      if (navigate) {
        // Navigate to the appropriate language route
        const currentUrl = this.router.url;
        let newUrl: string;

        if (lang === 'en') {
          // Remove /pl prefix if present
          newUrl = currentUrl.replace(/^\/pl(\/|$)/, '/');
        } else {
          // Add /pl prefix if not present
          if (currentUrl.startsWith('/pl')) {
            newUrl = currentUrl;
          } else {
            newUrl = '/pl' + (currentUrl === '/' ? '' : currentUrl);
          }
        }

        if (newUrl !== currentUrl) {
          this.router.navigateByUrl(newUrl);
        }
      }
    }
  }

  private updateDocumentLang(lang: Language): void {
    if (isPlatformBrowser(this.platformId)) {
      document.documentElement.lang = lang;
    }
  }

  private updateMetaTags(): void {
    this.translateService.get('meta.title').subscribe((title: string) => {
      this.title.setTitle(title);
    });

    this.translateService
      .get('meta.description')
      .subscribe((description: string) => {
        this.meta.updateTag({ name: 'description', content: description });
      });
  }

  toggleLanguage(): void {
    const newLang: Language = this.currentLanguage() === 'en' ? 'pl' : 'en';
    this.setLanguage(newLang);
  }

  getSupportedLanguages(): Language[] {
    return this.SUPPORTED_LANGUAGES;
  }
}
