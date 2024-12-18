import { ApplicationConfig, importProvidersFrom, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideHttpClient } from '@angular/common/http';
import { NgxsModule } from '@ngxs/store';
import { DataState } from './store/state';
import { AuthenticationGuard } from './auth/authentication.guard';
import { DialogService } from 'primeng/dynamicdialog';
import { provideAnimations } from '@angular/platform-browser/animations';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    importProvidersFrom(NgxsModule.forRoot([DataState])),
    provideHttpClient(),
    provideAnimations(),
    AuthenticationGuard,
    DialogService
  ]
};
