import { Component, ChangeDetectionStrategy, signal, inject, PLATFORM_ID, ViewEncapsulation, computed } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { LanguageService } from '../../services/language.service';
import { AnalyticsService } from '../../services/analytics.service';

@Component({
  selector: 'app-hero',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  templateUrl: './hero.component.html',
  styleUrl: './hero.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class HeroComponent {
  private platformId = inject(PLATFORM_ID);
  private languageService = inject(LanguageService);
  private translateService = inject(TranslateService);
  private analyticsService = inject(AnalyticsService);

  mouseX = signal(0);
  mouseY = signal(0);

  anchors = computed(() => {
    const lang = this.languageService.currentLanguage();
    const prefix = lang === 'en' ? '/en' : '';

    return {
      contact: `${prefix}#${this.translateService.instant('anchors.contact')}`,
      howItWorks: `${prefix}#${this.translateService.instant('anchors.how_it_works')}`,
    };
  });

  onBubbleAreaMouseMove(event: MouseEvent) {
    if (!isPlatformBrowser(this.platformId)) return;

    const rect = (event.currentTarget as HTMLElement).getBoundingClientRect();
    const x = (event.clientX - rect.left - rect.width / 2) / rect.width;
    const y = (event.clientY - rect.top - rect.height / 2) / rect.height;

    this.mouseX.set(x);
    this.mouseY.set(y);
  }

  onBubbleAreaMouseLeave() {
    this.mouseX.set(0);
    this.mouseY.set(0);
  }

  getBubbleTransform(factor: number): string {
    return `translate(${this.mouseX() * factor}px, ${this.mouseY() * factor}px)`;
  }

  trackCTA(ctaName: string): void {
    this.analyticsService.trackCTAClick(ctaName, 'hero');
  }
}
