import { Component, inject, effect, computed } from '@angular/core';
import { RouterModule } from '@angular/router';
import { LanguageService } from './services/language.service';
import { MetaService } from './services/meta.service';
import { AnalyticsService } from './services/analytics.service';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { UiCookieConsentComponent } from '@ui';

@Component({
  imports: [RouterModule, TranslateModule, UiCookieConsentComponent],
  selector: 'app-root',
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  protected title = 'koalka-landing';

  private languageService = inject(LanguageService);
  private metaService = inject(MetaService);
  private analyticsService = inject(AnalyticsService);
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

  /**
   * Called when user accepts cookies - initialize GA
   */
  onCookieAccepted(): void {
    this.analyticsService.initializeGA();
  }
}
