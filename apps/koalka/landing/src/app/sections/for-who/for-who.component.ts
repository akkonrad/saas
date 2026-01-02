import { Component, ChangeDetectionStrategy, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { UiSectionComponent } from '@ui';
import { MockupCardComponent } from '../../components/mockup-card/mockup-card.component';
import { toSignal } from '@angular/core/rxjs-interop';
import { map, startWith } from 'rxjs';
import { LanguageService } from '../../services/language.service';

@Component({
  selector: 'app-for-who',
  standalone: true,
  imports: [CommonModule, TranslateModule, UiSectionComponent, MockupCardComponent],
  templateUrl: './for-who.component.html',
  styleUrl: './for-who.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ForWhoComponent {
  private translate = inject(TranslateService);
  private languageService = inject(LanguageService);

  sectionId = computed(() => {
    this.languageService.currentLanguage();
    return this.translate.instant('anchors.for_who');
  });

  private langChange = toSignal(
    this.translate.onLangChange.pipe(
      map(() => this.translate.currentLang),
      startWith(this.translate.currentLang)
    )
  );

  ecommerceSteps = computed(() => {
    this.langChange();
    return [
      this.translate.instant('for_who.ecommerce_step.1'),
      this.translate.instant('for_who.ecommerce_step.2'),
      this.translate.instant('for_who.ecommerce_step.3'),
    ];
  });

  logisticsSteps = computed(() => {
    this.langChange();
    return [
      this.translate.instant('for_who.logistics_step.1'),
      this.translate.instant('for_who.logistics_step.2'),
      this.translate.instant('for_who.logistics_step.3'),
    ];
  });

  b2bSteps = computed(() => {
    this.langChange();
    return [
      this.translate.instant('for_who.b2b_step.1'),
      this.translate.instant('for_who.b2b_step.2'),
      this.translate.instant('for_who.b2b_step.3'),
    ];
  });
}
