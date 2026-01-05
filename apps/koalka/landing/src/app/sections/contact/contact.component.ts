import { Component, ChangeDetectionStrategy, inject, computed, AfterViewInit, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { UiSectionComponent } from '@ui';
import { ContactFormComponent } from '../../components/contact-form/contact-form.component';
import { LanguageService } from '../../services/language.service';
import { AnalyticsService } from '../../services/analytics.service';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule, TranslateModule, UiSectionComponent, ContactFormComponent],
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContactComponent implements AfterViewInit {
  private languageService = inject(LanguageService);
  private translateService = inject(TranslateService);
  private analyticsService = inject(AnalyticsService);
  private elementRef = inject(ElementRef);

  sectionId = computed(() => {
    this.languageService.currentLanguage();
    return this.translateService.instant('anchors.contact');
  });

  ngAfterViewInit(): void {
    this.analyticsService.observeSection(this.elementRef.nativeElement, 'contact');
  }
}
