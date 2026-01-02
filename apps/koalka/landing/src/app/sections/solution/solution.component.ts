import { Component, ChangeDetectionStrategy, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { UiSectionComponent } from '@ui';
import { FeatureCardComponent } from '../../components/feature-card/feature-card.component';
import { LanguageService } from '../../services/language.service';

@Component({
  selector: 'app-solution',
  standalone: true,
  imports: [CommonModule, TranslateModule, UiSectionComponent, FeatureCardComponent],
  templateUrl: './solution.component.html',
  styleUrl: './solution.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SolutionComponent {
  private languageService = inject(LanguageService);
  private translateService = inject(TranslateService);

  sectionId = computed(() => {
    this.languageService.currentLanguage();
    return this.translateService.instant('anchors.solution');
  });
}
