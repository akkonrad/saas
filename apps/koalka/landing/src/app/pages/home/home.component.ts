import { Component, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from '../../sections/header/header.component';
import { HeroComponent } from '../../sections/hero/hero.component';
import { ProblemComponent } from '../../sections/problem/problem.component';
import { SolutionComponent } from '../../sections/solution/solution.component';
import { HowItWorksComponent } from '../../sections/how-it-works/how-it-works.component';
import { ForWhoComponent } from '../../sections/for-who/for-who.component';
import { WhyMeComponent } from '../../sections/why-me/why-me.component';
import { TeamComponent } from '../../sections/team/team.component';
import { ContactComponent } from '../../sections/contact/contact.component';
import { FooterComponent } from '../../sections/footer/footer.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    HeaderComponent,
    HeroComponent,
    ProblemComponent,
    SolutionComponent,
    HowItWorksComponent,
    ForWhoComponent,
    WhyMeComponent,
    TeamComponent,
    ContactComponent,
    FooterComponent,
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeComponent {}
