import {
  ApplicationConfig,
  provideBrowserGlobalErrorListeners,
} from '@angular/core';
import { provideRouter } from '@angular/router';
import { appRoutes } from './app.routes';
import { SUPABASE_CONFIG } from '@saas/web/data-access-auth';
import { environment } from '../environments/environment.development';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(appRoutes),
    {
      provide: SUPABASE_CONFIG,
      useValue: {
        url: environment.supabase.url,
        publishableKey: environment.supabase.publishableKey,
      },
    },
  ],
};
