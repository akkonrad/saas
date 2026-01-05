import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { HeaderComponent } from '../../sections/header/header.component';
import { FooterComponent } from '../../sections/footer/footer.component';
import { LanguageService } from '../../services/language.service';

@Component({
  selector: 'app-privacy-policy',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    TranslateModule,
    HeaderComponent,
    FooterComponent,
  ],
  templateUrl: './privacy-policy.component.html',
  styleUrl: './privacy-policy.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PrivacyPolicyComponent {
  private readonly languageService = inject(LanguageService);

  protected readonly currentLang = this.languageService.currentLanguage;
  protected readonly currentYear = new Date().getFullYear();

  protected get homeLink(): string {
    return this.currentLang() === 'en' ? '/en' : '/';
  }
}
