import { Injectable, inject, PLATFORM_ID, signal } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { TranslateService } from '@ngx-translate/core';

export type Language = 'pl' | 'en';
export type Variant = 'default' | 'gov';

@Injectable({
  providedIn: 'root'
})
export class LanguageService {
  private translateService = inject(TranslateService);
  private platformId = inject(PLATFORM_ID);

  currentLanguage = signal<Language>('pl');
  currentVariant = signal<Variant>('default');

  private readonly STORAGE_KEY = 'koalka-language';
  private readonly VARIANT_STORAGE_KEY = 'koalka-variant';
  private readonly SUPPORTED_LANGUAGES: Language[] = ['pl', 'en'];
  private readonly SUPPORTED_VARIANTS: Variant[] = ['default', 'gov'];

  constructor() {
    this.initializeLanguage();
  }

  private initializeLanguage(): void {
    // Set supported languages
    this.translateService.addLangs(this.SUPPORTED_LANGUAGES);
    this.translateService.setDefaultLang('pl');

    // Determine initial language
    let initialLang: Language = 'pl';

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
      if (path.startsWith('/en')) {
        return 'en';
      }
    }
    return null;
  }

  setLanguage(lang: Language, navigate: boolean = true): void {
    if (!this.SUPPORTED_LANGUAGES.includes(lang)) {
      lang = 'pl';
    }

    this.currentLanguage.set(lang);
    this.translateService.use(lang);

    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem(this.STORAGE_KEY, lang);

      if (navigate) {
        // Use window.location for SSR landing page to ensure proper URL change
        const currentPath = window.location.pathname;
        const hash = window.location.hash;
        let newPath: string;

        if (lang === 'pl') {
          // Remove /en prefix if present
          newPath = currentPath.replace(/^\/en(\/|$)/, '/');
        } else {
          // Add /en prefix if not present
          if (!currentPath.startsWith('/en')) {
            newPath = '/en' + (currentPath === '/' ? '' : currentPath);
          } else {
            newPath = currentPath;
          }
        }

        if (newPath !== currentPath) {
          window.location.href = newPath + hash;
        }
      }
    }
  }

  toggleLanguage(): void {
    const newLang: Language = this.currentLanguage() === 'pl' ? 'en' : 'pl';
    this.setLanguage(newLang);
  }

  getSupportedLanguages(): Language[] {
    return this.SUPPORTED_LANGUAGES;
  }
}
