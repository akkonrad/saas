import { Component, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { UiSectionComponent } from '@ui';
import { FeatureCardComponent } from '../../components/feature-card/feature-card.component';

@Component({
  selector: 'app-solution',
  standalone: true,
  imports: [CommonModule, TranslateModule, UiSectionComponent, FeatureCardComponent],
  templateUrl: './solution.component.html',
  styleUrl: './solution.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SolutionComponent {}
