import { Component, ChangeDetectionStrategy, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { UiSectionComponent } from '@ui';
import { StepCardComponent } from '../../components/step-card/step-card.component';
import { LanguageService } from '../../services/language.service';

@Component({
  selector: 'app-how-it-works',
  standalone: true,
  imports: [CommonModule, TranslateModule, UiSectionComponent, StepCardComponent],
  templateUrl: './how-it-works.component.html',
  styleUrl: './how-it-works.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HowItWorksComponent {
  private languageService = inject(LanguageService);
  private translateService = inject(TranslateService);

  sectionId = computed(() => {
    this.languageService.currentLanguage();
    return this.translateService.instant('anchors.how_it_works');
  });
}
