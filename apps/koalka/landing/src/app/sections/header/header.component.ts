import { Component, ChangeDetectionStrategy, signal, ViewEncapsulation, inject, computed, PLATFORM_ID, effect } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { UiLanguageSwitcherComponent, UiThemeToggleComponent, Language, Theme } from '@ui';
import { LanguageService } from '../../services/language.service';

type KoalkaTheme = 'koalka-light' | 'koalka-dark';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    CommonModule,
    TranslateModule,
    UiLanguageSwitcherComponent,
    UiThemeToggleComponent,
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class HeaderComponent {
  private languageService = inject(LanguageService);
  private translateService = inject(TranslateService);
  private platformId = inject(PLATFORM_ID);
  private isBrowser = isPlatformBrowser(this.platformId);

  mobileMenuOpen = signal(false);

  languages: Language[] = [
    { code: 'pl', label: 'Polski', flag: '🇵🇱' },
    { code: 'en', label: 'English', flag: '🇬🇧' },
  ];

  currentLanguage = computed(() => this.languageService.currentLanguage());
  currentTheme = signal<Theme>('light');

  constructor() {
    if (this.isBrowser) {
      const savedTheme = localStorage.getItem('koalka-theme') as KoalkaTheme | null;
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      const initialTheme = savedTheme
        ? (savedTheme === 'koalka-dark' ? 'dark' : 'light')
        : (prefersDark ? 'dark' : 'light');
      this.currentTheme.set(initialTheme);

      effect(() => {
        const theme = this.currentTheme();
        const koalkaTheme: KoalkaTheme = theme === 'dark' ? 'koalka-dark' : 'koalka-light';
        document.documentElement.setAttribute('data-theme', koalkaTheme);
        localStorage.setItem('koalka-theme', koalkaTheme);
      });
    }
  }

  onLanguageChange(code: string): void {
    this.languageService.setLanguage(code as 'pl' | 'en');
  }

  onThemeChange(theme: Theme): void {
    this.currentTheme.set(theme);
  }

  // Computed anchors based on current language
  anchors = computed(() => {
    const lang = this.languageService.currentLanguage();
    const prefix = lang === 'en' ? '/en' : '';

    return {
      hero: `${prefix}#${this.translateService.instant('anchors.hero')}`,
      problem: `${prefix}#${this.translateService.instant('anchors.problem')}`,
      solution: `${prefix}#${this.translateService.instant('anchors.solution')}`,
      howItWorks: `${prefix}#${this.translateService.instant('anchors.how_it_works')}`,
      forWho: `${prefix}#${this.translateService.instant('anchors.for_who')}`,
      team: `${prefix}#${this.translateService.instant('anchors.team')}`,
      contact: `${prefix}#${this.translateService.instant('anchors.contact')}`,
    };
  });

  toggleMobileMenu(): void {
    this.mobileMenuOpen.update((v) => !v);
  }

  closeMobileMenu(): void {
    this.mobileMenuOpen.set(false);
  }
}
