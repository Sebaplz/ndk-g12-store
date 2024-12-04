import { Injectable } from '@angular/core';
import {Actions, createEffect, ofType} from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, map, mergeMap } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { AuthActions } from './auth.actions';
import { Router } from '@angular/router';
import {environment} from '../../../environments/environment';

@Injectable()
export class AuthEffects {
  private readonly TOKEN_KEY = 'token';
  private readonly API_URL = environment.apiUrl;

  login$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.loginRequest),
      mergeMap(action =>
        this.http.post<any>(`${this.API_URL}/auth/login`, {
          email: action.email,
          password: action.password
        }).pipe(
          map(response => {
            // Guardar token en localStorage
            localStorage.setItem('authToken', response.token);

            if(response.email == 'admin@admin.com') {
              return AuthActions.loginSuccess({
                user: {
                  email: response.email,
                  token: response.token,
                  isAdmin: true,
                }
              });
            }

            return AuthActions.loginSuccess({
              user: {
                email: response.email,
                token: response.token,
                isAdmin: false,
              }
            });
          }),
          catchError(error =>
            of(AuthActions.loginFailure({
              error: error.message || 'Login failed'
            }))
          )
        )
      )
    )
  );

  logout$ = createEffect(() =>
      this.actions$.pipe(
        ofType(AuthActions.logout),
        map(() => {
          // Limpiar token de localStorage
          localStorage.removeItem('authToken');
          // Redirigir al login
          this.router.navigate(['/login']);
          return { type: 'NO_ACTION' }; // Efecto sin acción de retorno
        })
      ),
    { dispatch: false }
  );

  constructor(
    private actions$: Actions,
    private http: HttpClient,
    private router: Router,
  ) {
    console.log('Actions$:', this.actions$);
  }


}
