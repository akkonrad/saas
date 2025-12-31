import { Route } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';

export const appRoutes: Route[] = [
  {
    path: '',
    component: HomeComponent,
  },
  {
    path: 'en',
    component: HomeComponent,
  },
  {
    path: '**',
    redirectTo: '',
  },
];
