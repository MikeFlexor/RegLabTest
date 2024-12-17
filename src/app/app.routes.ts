import { Routes } from '@angular/router';
import { AuthenticationGuard } from './auth/authentication.guard';

export const routes: Routes = [
  {
    path: '',
    canActivate: [AuthenticationGuard],
    loadComponent: async () => {
      return (await import('./components/main/main.component')).MainComponent;
    }
  },
  {
    path: 'login',
    loadComponent: async () => {
      return (await import('./components/login/login.component')).LoginComponent;
    }
  },
  {
    path: 'user',
    canActivate: [AuthenticationGuard],
    loadComponent: async () => {
      return (await import('./components/user/user.component')).UserComponent;
    }
  },
  {
    path: '**',
    redirectTo: ''
  }
];
