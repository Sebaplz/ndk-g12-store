import {inject, Injectable} from '@angular/core';
import {Actions, createEffect, ofType} from '@ngrx/effects';
import {AuthStore} from '../../resources/stores/auth.store';
import {Store} from '@ngrx/store';
import {authAction} from '../../global/actions/auth.action';
import {exhaustMap, of} from 'rxjs';
import {AuthorizationService} from '../../global/services/authorization.service';

@Injectable()
export class AuthEffect {

  private readonly actions$ = inject(Actions);
  private readonly authStore = inject(Store<{ auth: AuthStore }>);
  private readonly authService = inject(AuthorizationService);

  constructor() {}

  loadToken = createEffect(() =>
      this.actions$.pipe(
        ofType(authAction.loadToken),
        exhaustMap(() => {
            const token = this.authService.getTokenStorage;
            if (token) {
              console.log('Existe sesión');
              return of(authAction.loadTokenSuccess({ token }));
            }else{
              console.log('No existe sesión');
              return of(authAction.loadTokenFailure({error: 'No existe sesión'}));
            }
          }
        )
      ),
    { functional: true }
  );

}
