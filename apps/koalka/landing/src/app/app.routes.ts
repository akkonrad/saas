import { Route } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { PrivacyPolicyComponent } from './pages/privacy-policy/privacy-policy.component';

export const appRoutes: Route[] = [
  {
    path: '',
    component: HomeComponent,
  },
  {
    path: 'polityka-prywatnosci',
    component: PrivacyPolicyComponent,
  },
  {
    path: 'en',
    component: HomeComponent,
  },
  {
    path: 'en/privacy-policy',
    component: PrivacyPolicyComponent,
  },
  {
    path: '**',
    redirectTo: '',
  },
];
