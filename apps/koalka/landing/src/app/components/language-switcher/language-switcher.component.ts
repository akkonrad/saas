import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LanguageService, Language } from '../../services/language.service';

@Component({
  selector: 'app-language-switcher',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './language-switcher.component.html',
  styleUrl: './language-switcher.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LanguageSwitcherComponent {
  languageService = inject(LanguageService);

  toggleLanguage(): void {
    const newLang = this.languageService.currentLanguage() === 'pl' ? 'en' : 'pl';
    this.languageService.setLanguage(newLang);
  }
}
