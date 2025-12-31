import { Component, ChangeDetectionStrategy, signal, inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-hero',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  templateUrl: './hero.component.html',
  styleUrl: './hero.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeroComponent {
  private platformId = inject(PLATFORM_ID);

  mouseX = signal(0);
  mouseY = signal(0);

  onBubbleAreaMouseMove(event: MouseEvent) {
    if (!isPlatformBrowser(this.platformId)) return;

    const rect = (event.currentTarget as HTMLElement).getBoundingClientRect();
    const x = (event.clientX - rect.left - rect.width / 2) / rect.width;
    const y = (event.clientY - rect.top - rect.height / 2) / rect.height;

    this.mouseX.set(x);
    this.mouseY.set(y);
  }

  onBubbleAreaMouseLeave() {
    this.mouseX.set(0);
    this.mouseY.set(0);
  }

  getBubbleTransform(factor: number): string {
    return `translate(${this.mouseX() * factor}px, ${this.mouseY() * factor}px)`;
  }
}
