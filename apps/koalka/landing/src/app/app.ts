import { Component, inject, effect } from '@angular/core';
import { RouterModule } from '@angular/router';
import { LanguageService } from './services/language.service';
import { MetaService } from './services/meta.service';

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

  constructor() {
    // Update meta tags whenever language changes
    effect(() => {
      const currentLang = this.languageService.currentLanguage();
      this.metaService.updateMetaTags(currentLang);
    });
  }
}
