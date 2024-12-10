import {inject, Injectable} from '@angular/core';
import {Actions, createEffect, ofType} from '@ngrx/effects';
import {authAction} from '../../global/actions';
import {exhaustMap, of, Subject, tap} from 'rxjs';
import {AuthorizationService} from '../../global/services/authorization.service';
import {catchError, map, mergeMap} from 'rxjs/operators';
import {environment} from '../../../environments/environment.development';
import {HttpClient} from '@angular/common/http';
import {authReaction} from '../reactions';
import {Router} from '@angular/router';
import {jwtDecode, JwtPayload} from 'jwt-decode';

@Injectable()
export class AuthEffect {
  private readonly API_URL = environment.apiUrl;
  private readonly actions$ = inject(Actions);
  //private readonly authStore = inject(Store<{ auth: AuthStore }>);
  private readonly authorizationService = inject(AuthorizationService);
  private readonly http = inject(HttpClient);
  public loginError$ = new Subject<string>();
  private readonly router = inject(Router);

  constructor() {}

  loadToken = createEffect(() =>
      this.actions$.pipe(
        ofType(authAction.loadToken),
        exhaustMap(() => {
            const token = this.authorizationService.getTokenStorage;
            if (token) {
              console.log('Existe sesión');
              const decoded = jwtDecode<JwtPayload>(token);
              // @ts-ignore
              const email = decoded.email;
              if(email === 'admin@admin.com') {
                return of(authAction.loadTokenSuccess({ token, isAdmin: true, email, isLoggedIn: true }));
              }
              return of(authAction.loadTokenSuccess({ token, isAdmin: false, email, isLoggedIn: true }));
            }else{
              console.log('No existe sesión');
              return of(authAction.loadTokenFailure({error: 'No existe sesión'}));
            }
          }
        )
      ),
    { functional: true }
  );

  login$ = createEffect(() =>
    this.actions$.pipe(
      ofType(authReaction.login),
      mergeMap(action =>
        this.http.post<any>(`${this.API_URL}/auth/login`, {
          email: action.email,
          password: action.password
        }).pipe(
          map(response => {
            this.authorizationService.saveToken(response.token);
            if(action.email === 'admin@admin.com') {
              return authReaction.loginSuccess({
                token: response.token,
                isAdmin: true,
                email: action.email,
              });
            }

            return authReaction.loginSuccess({
              token: response.token,
              isAdmin: false,
              email: action.email,
            });
          }),
          catchError(err => {
            const errorMessage = err.error?.message || 'An unexpected error occurred';
            this.loginError$.next(errorMessage);
            return of(authReaction.loginFail({ error: errorMessage }));
          })
        )
      )
    ),
    { functional: true }
  );

  logout$ = createEffect(() =>
      this.actions$.pipe(
        ofType(authAction.logout),
        tap(() => {
          this.authorizationService.logout();
          this.router.navigate(['/auth/login']);
        })
      ),
    { dispatch: false, functional: true }
  );
}
