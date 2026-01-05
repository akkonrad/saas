import { Component, inject, effect, computed } from '@angular/core';
import { RouterModule } from '@angular/router';
import { LanguageService } from './services/language.service';
import { MetaService } from './services/meta.service';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { UiCookieConsentComponent } from '@ui';

/**
 * Google Analytics Measurement ID for Koalka Landing
 */
const GA_TRACKING_ID = 'G-V4P12YZRYL';

@Component({
  imports: [RouterModule, TranslateModule, UiCookieConsentComponent],
  selector: 'app-root',
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  protected title = 'koalka-landing';
  protected readonly gaTrackingId = GA_TRACKING_ID;

  private languageService = inject(LanguageService);
  private metaService = inject(MetaService);
  private translate = inject(TranslateService);

  protected readonly privacyPolicyUrl = computed(() =>
    this.languageService.currentLanguage() === 'en'
      ? '/en/privacy-policy'
      : '/polityka-prywatnosci'
  );

  constructor() {
    // Update meta tags whenever language changes AND translations are loaded
    effect(() => {
      const currentLang = this.languageService.currentLanguage();

      // Wait for translations to load before updating meta tags
      this.translate.get('seo.title').subscribe(() => {
        this.metaService.updateMetaTags(currentLang);
      });
    });
  }
}
