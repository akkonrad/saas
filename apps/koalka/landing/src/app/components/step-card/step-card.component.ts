import { Component, ChangeDetectionStrategy, input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-step-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './step-card.component.html',
  styleUrl: './step-card.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StepCardComponent {
  stepNumber = input.required<number>();
  title = input.required<string>();
  description = input.required<string>();
}
