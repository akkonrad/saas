import { Component, ChangeDetectionStrategy, ViewEncapsulation, inject, computed } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { UiSectionComponent } from '@ui';
import { LanguageService } from '../../services/language.service';

@Component({
  selector: 'app-team',
  standalone: true,
  imports: [CommonModule, NgOptimizedImage, TranslateModule, UiSectionComponent],
  templateUrl: './team.component.html',
  styleUrl: './team.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class TeamComponent {
  private languageService = inject(LanguageService);
  private translateService = inject(TranslateService);

  sectionId = computed(() => {
    this.languageService.currentLanguage();
    return this.translateService.instant('anchors.team');
  });

  member1Alt = computed(() => {
    this.languageService.currentLanguage();
    return this.translateService.instant('team.member1_alt');
  });

  member2Alt = computed(() => {
    this.languageService.currentLanguage();
    return this.translateService.instant('team.member2_alt');
  });

  member3Alt = computed(() => {
    this.languageService.currentLanguage();
    return this.translateService.instant('team.member3_alt');
  });
}
