import {ApplicationConfig, LOCALE_ID, provideZoneChangeDetection} from '@angular/core';
import {provideRouter} from '@angular/router';

import {routes} from './app.routes';
import {provideHttpClient, withInterceptors} from '@angular/common/http';
import {provideAnimations} from '@angular/platform-browser/animations';
import {provideStoreDevtools} from '@ngrx/store-devtools';
import {provideStore} from "@ngrx/store";
import {authReducer} from "./modules/authentication/core/reducers/auth.reducer";
import {provideEffects} from "@ngrx/effects";
import {AuthEffect, CartEffect, OrderEffect, ProductEffect} from './library/effects';
import {ConfirmationService, MessageService} from 'primeng/api';
import {authInterceptor} from './library/interceptors/auth.interceptor';
import {cartReducer, ordersReducer, productReducer} from './modules/dashboard/core/reducers';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideStore({
      auth: authReducer,
      products: productReducer,
      orders: ordersReducer,
      cart: cartReducer,
    }),
      provideEffects([
          AuthEffect, ProductEffect, OrderEffect, CartEffect
      ]),
    provideAnimations(),
    provideRouter(routes),
    provideHttpClient(
        withInterceptors([authInterceptor])
    ),
    provideStoreDevtools({
      maxAge: 25,
      logOnly: true,
      autoPause: true,
      traceLimit: 75,
    }),
    { provide: LOCALE_ID, useValue: 'es-CL' },
    MessageService,
    ConfirmationService,
  ]
};
