import { Injectable, inject, PLATFORM_ID, DestroyRef } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { TranslateService } from '@ngx-translate/core';
import { isPlatformBrowser, DOCUMENT } from '@angular/common';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Injectable({
  providedIn: 'root'
})
export class MetaService {
  private meta = inject(Meta);
  private title = inject(Title);
  private translate = inject(TranslateService);
  private platformId = inject(PLATFORM_ID);
  private document = inject(DOCUMENT);

  private readonly BASE_URL = 'https://koalka.pl';

  updateMetaTags(language: 'pl' | 'en'): void {
    // Get translations for SEO
    const seoTitle = this.translate.instant('seo.title');

    // Check if translations are loaded (instant returns the key if not loaded)
    // If translations aren't loaded yet, skip updating meta tags
    // The static meta tags in index.html will be used instead
    if (seoTitle === 'seo.title') {
      return;
    }

    const seoDescription = this.translate.instant('seo.description');
    const seoKeywords = this.translate.instant('seo.keywords');
    const seoLanguage = this.translate.instant('seo.language');
    const ogTitle = this.translate.instant('seo.og_title');
    const ogDescription = this.translate.instant('seo.og_description');
    const ogImageAlt = this.translate.instant('seo.og_image_alt');
    const ogLocale = this.translate.instant('seo.og_locale');
    const twitterTitle = this.translate.instant('seo.twitter_title');
    const twitterDescription = this.translate.instant('seo.twitter_description');
    const twitterImageAlt = this.translate.instant('seo.twitter_image_alt');

    // Determine current URL based on language
    const currentUrl = language === 'en' ? `${this.BASE_URL}/en` : this.BASE_URL;

    // Update page title
    this.title.setTitle(seoTitle);

    // Update standard meta tags
    this.meta.updateTag({ name: 'title', content: seoTitle });
    this.meta.updateTag({ name: 'description', content: seoDescription });
    this.meta.updateTag({ name: 'keywords', content: seoKeywords });
    this.meta.updateTag({ name: 'language', content: seoLanguage });

    // Update canonical URL
    this.updateCanonicalUrl(currentUrl);

    // Update alternate language links
    this.updateAlternateLinks(language);

    // Update Open Graph meta tags
    this.meta.updateTag({ property: 'og:url', content: currentUrl });
    this.meta.updateTag({ property: 'og:title', content: ogTitle });
    this.meta.updateTag({ property: 'og:description', content: ogDescription });
    this.meta.updateTag({ property: 'og:image:alt', content: ogImageAlt });
    this.meta.updateTag({ property: 'og:locale', content: ogLocale });

    // Update Twitter Card meta tags
    this.meta.updateTag({ name: 'twitter:url', content: currentUrl });
    this.meta.updateTag({ name: 'twitter:title', content: twitterTitle });
    this.meta.updateTag({ name: 'twitter:description', content: twitterDescription });
    this.meta.updateTag({ name: 'twitter:image:alt', content: twitterImageAlt });

    // Update html lang attribute
    this.updateHtmlLang(language);
  }

  private updateCanonicalUrl(url: string): void {
    if (isPlatformBrowser(this.platformId)) {
      // Remove existing canonical link
      const existingCanonical = this.document.querySelector('link[rel="canonical"]');
      if (existingCanonical) {
        existingCanonical.setAttribute('href', url);
      }
    }
  }

  private updateAlternateLinks(currentLang: 'pl' | 'en'): void {
    if (isPlatformBrowser(this.platformId)) {
      // Update hreflang links
      const plLink = this.document.querySelector('link[hreflang="pl"]');
      const enLink = this.document.querySelector('link[hreflang="en"]');
      const defaultLink = this.document.querySelector('link[hreflang="x-default"]');

      if (plLink) {
        plLink.setAttribute('href', this.BASE_URL);
      }
      if (enLink) {
        enLink.setAttribute('href', `${this.BASE_URL}/en`);
      }
      if (defaultLink) {
        defaultLink.setAttribute('href', this.BASE_URL);
      }
    }
  }

  private updateHtmlLang(language: 'pl' | 'en'): void {
    if (isPlatformBrowser(this.platformId)) {
      this.document.documentElement.setAttribute('lang', language);
    }
  }
}
