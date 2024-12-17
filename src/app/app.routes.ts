import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
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
    loadComponent: async () => {
      return (await import('./components/user/user.component')).UserComponent;
    }
  },
  {
    path: '**',
    loadComponent: async () => {
      return (await import('./components/main/main.component')).MainComponent;
    }
  }
];
