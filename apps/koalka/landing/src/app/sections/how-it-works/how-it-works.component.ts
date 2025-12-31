import { Component, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { UiSectionComponent } from '@ui';
import { StepCardComponent } from '../../components/step-card/step-card.component';

@Component({
  selector: 'app-how-it-works',
  standalone: true,
  imports: [CommonModule, TranslateModule, UiSectionComponent, StepCardComponent],
  templateUrl: './how-it-works.component.html',
  styleUrl: './how-it-works.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HowItWorksComponent {}
