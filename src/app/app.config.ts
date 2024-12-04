import {ApplicationConfig, isDevMode, provideZoneChangeDetection} from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import {provideHttpClient, withInterceptors} from '@angular/common/http';
import {provideAnimations} from '@angular/platform-browser/animations';
import {provideStoreDevtools} from '@ngrx/store-devtools';
import {provideStore} from "@ngrx/store";
import {authInitialState, authReducer} from "./modules/authentication/core/reducers/auth.reducer";
import {provideEffects} from "@ngrx/effects";
import {AuthEffect} from "./library/effects/auth.effect";

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideStore({
      auth: authReducer,
    }),
      provideEffects([
          AuthEffect
      ]),
    provideAnimations(),
    provideRouter(routes),
    provideHttpClient(
        withInterceptors([])
    ),
    provideStoreDevtools({
      maxAge: 25,
      logOnly: true,
      autoPause: true,
      traceLimit: 75,
    }),
  ]
};
