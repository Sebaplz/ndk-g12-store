import {ApplicationConfig, provideZoneChangeDetection} from '@angular/core';
import {provideRouter} from '@angular/router';
import {routes} from './app.routes';
import {provideHttpClient, withInterceptors} from '@angular/common/http';
import {ConfirmationService, MessageService} from 'primeng/api';
import {provideAnimations} from '@angular/platform-browser/animations';
import {authInterceptor} from './core/interceptors/auth.interceptor';
import {authReducer} from './store/auth/auth.reducer';
import {provideStore} from '@ngrx/store';
import {provideStoreDevtools} from '@ngrx/store-devtools';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideAnimations(),
    MessageService,
    ConfirmationService,
    provideHttpClient(
      withInterceptors([authInterceptor])
    ),
    provideStore({
      auth: authReducer,
    }),
    provideStoreDevtools({ maxAge: 25 })
  ],
};
