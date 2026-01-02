import { Component, ChangeDetectionStrategy, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { UiSectionComponent } from '@ui';
import { ContactFormComponent } from '../../components/contact-form/contact-form.component';
import { LanguageService } from '../../services/language.service';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule, TranslateModule, UiSectionComponent, ContactFormComponent],
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContactComponent {
  private languageService = inject(LanguageService);
  private translateService = inject(TranslateService);

  sectionId = computed(() => {
    this.languageService.currentLanguage();
    return this.translateService.instant('anchors.contact');
  });
}
