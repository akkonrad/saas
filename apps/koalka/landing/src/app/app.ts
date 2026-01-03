import { Component, inject, effect } from '@angular/core';
import { RouterModule } from '@angular/router';
import { LanguageService } from './services/language.service';
import { MetaService } from './services/meta.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  imports: [RouterModule],
  selector: 'app-root',
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  protected title = 'koalka-landing';

  private languageService = inject(LanguageService);
  private metaService = inject(MetaService);
  private translate = inject(TranslateService);

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
