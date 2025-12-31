import { Component, inject, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Meta } from '@angular/platform-browser';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { LanguageService } from './services/language.service';

@Component({
  imports: [RouterModule, TranslateModule],
  selector: 'app-root',
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App implements OnInit {
  private meta = inject(Meta);
  private translateService = inject(TranslateService);
  private languageService = inject(LanguageService);

  ngOnInit(): void {
    this.setupStaticSEO();
  }

  private setupStaticSEO(): void {
    // Static meta tags (non-translated)
    this.meta.addTags([
      { name: 'keywords', content: 'saas, angular, nestjs, typescript' },
      { name: 'author', content: 'Faceless' },
      { property: 'og:type', content: 'website' },
      { name: 'twitter:card', content: 'summary_large_image' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { name: 'theme-color', content: '#ffffff' },
    ]);

    // Dynamic meta tags are handled by LanguageService.updateMetaTags()
  }

  toggleLanguage(): void {
    this.languageService.toggleLanguage();
  }

  get currentLang() {
    return this.languageService.currentLanguage;
  }
}
