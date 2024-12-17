import {inject, Injectable} from '@angular/core';
import {Actions, createEffect, ofType} from '@ngrx/effects';
import {exhaustMap, of, Subject, tap} from 'rxjs';
import {AuthorizationService} from '../../global/services/authorization.service';
import {catchError, map, mergeMap} from 'rxjs/operators';
import {environment} from '../../../environments/environment.development';
import {HttpClient} from '@angular/common/http';
import {authReaction} from '../reactions';
import {Router} from '@angular/router';
import {jwtDecode, JwtPayload} from 'jwt-decode';
import {authAction} from '../../global/actions/auth.action';
import {RegisterResponse} from '../../resources/io/auth/register.out';
import {LoginResponse} from '../../resources/io/auth/login.out';
import {MessageService} from 'primeng/api';

@Injectable()
export class AuthEffect {
  private readonly API_URL = environment.apiUrl;
  private readonly actions$ = inject(Actions);
  //private readonly authStore = inject(Store<{ auth: AuthStore }>);
  private readonly authorizationService = inject(AuthorizationService);
  private readonly http = inject(HttpClient);
  public loginError$ = new Subject<string>();
  private readonly router = inject(Router);
  private readonly messageService = inject(MessageService);

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
          this.http.post<LoginResponse>(`${this.API_URL}/auth/login`, {
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
              console.log(err)
              const errorMessage = err.error?.message || 'An unexpected error occurred';
              /*this.loginError$.next(errorMessage);*/
              return of(authReaction.loginFail({ error: errorMessage }));
            })
          )
        )
      ),
    { functional: true }
  );

  loginRedirect$ = createEffect(() =>
      this.actions$.pipe(
        ofType(authReaction.loginSuccess),
        tap(({ isAdmin }) => {
          if (isAdmin) {
            this.router.navigate(['/dashboard/admin']);
          } else {
            this.router.navigate(['/dashboard/user']);
          }
        })
      ),
    { dispatch: false }
  );

  logout$ = createEffect(() =>
      this.actions$.pipe(
        ofType(authAction.logout),
        tap(() => {
          this.authorizationService.logout();
          this.router.navigate(['/auth/login']);
          this.messageService.add({
            severity: 'success',
            summary: 'Logout Success',
            detail: 'You have been logged out successfully.',
          });
        })
      ),
    { dispatch: false, functional: true }
  );

  register$ = createEffect(() =>
      this.actions$.pipe(
        ofType(authReaction.register),
        mergeMap((action) =>
          this.http.post<RegisterResponse>(`${this.API_URL}/auth/register`, {
            email: action.email,
            password: action.password
          }, { responseType: 'text' as 'json' }).pipe(
            map(() => {
              return authReaction.login({
                email: action.email,
                password: action.password
              });
            }),
            catchError(err => {
              if(err.status === 409) {
                const errorMessage = "User with this email already exists";
                return of(authReaction.registerFail({ error: errorMessage }));
              }
              return of(authReaction.registerFail({ error: 'An unexpected error occurred' }));
            })
          )
        )
      ),
    { functional: true }
  );

  clearError$ = createEffect(()=>
    this.actions$.pipe(
      ofType(authAction.clearError),
      tap(()=>{
        console.log("Se limpio el error")
      })
    ),
    { dispatch: false }
  );
}
