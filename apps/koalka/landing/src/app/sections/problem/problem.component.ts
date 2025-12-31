import { Component, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { UiSectionComponent } from '@ui';
import { FeatureCardComponent } from '../../components/feature-card/feature-card.component';

@Component({
  selector: 'app-problem',
  standalone: true,
  imports: [CommonModule, TranslateModule, UiSectionComponent, FeatureCardComponent],
  templateUrl: './problem.component.html',
  styleUrl: './problem.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProblemComponent {}
