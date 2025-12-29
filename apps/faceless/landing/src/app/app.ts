import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Meta, Title } from '@angular/platform-browser';

@Component({
  imports: [RouterModule],
  selector: 'app-root',
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  constructor(
    private meta: Meta,
    private title: Title
  ) {
    this.setupSEO();
  }

  private setupSEO(): void {
    this.title.setTitle('Faceless - Modern SaaS Platform');

    this.meta.addTags([
      {
        name: 'description',
        content: 'A modern SaaS platform built with Angular and NestJS',
      },
      { name: 'keywords', content: 'saas, angular, nestjs, typescript' },
      { name: 'author', content: 'Faceless' },

      { property: 'og:type', content: 'website' },
      { property: 'og:title', content: 'Faceless - Modern SaaS Platform' },
      {
        property: 'og:description',
        content: 'A modern SaaS platform built with Angular and NestJS',
      },

      { name: 'twitter:card', content: 'summary_large_image' },
      { name: 'twitter:title', content: 'Faceless - Modern SaaS Platform' },
      {
        name: 'twitter:description',
        content: 'A modern SaaS platform built with Angular and NestJS',
      },

      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { name: 'theme-color', content: '#ffffff' },
    ]);
  }
}
