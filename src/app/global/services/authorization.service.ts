import { inject, Injectable } from '@angular/core';
import { AuthStore } from '../../resources/stores/auth.store';
import { Store } from '@ngrx/store';
import { map, take } from 'rxjs/operators';
import { filter, Observable } from 'rxjs';
import { CanActivateFn, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthorizationService {

  store = inject(Store<{ auth: AuthStore }>);
  router = inject(Router);


  constructor() {
    console.log('AuthorizationService');

  }

  get getAuth() {
    return this.store.select<AuthStore>(state => state.auth).pipe(
      filter(auth => !auth.loading && auth.check),
      take(1)
    );
  }

  saveToken(token: string) {
    localStorage.setItem('authorization', token);
  }

  get getTokenStorage() {
    return localStorage.getItem('authorization');
  }

  getToken() {
    return this.getAuth.pipe(
      map(auth => auth.token)
    );
  }

  loggedInActivate(): Observable<boolean> {
    return this.getAuth.pipe(
      map(auth => {
        const isLoggedIn = auth.token !== null;
        if (!isLoggedIn && !this.router.url.includes("auth")) {
          console.error('No tiene permisos para acceder a esta ruta');
          this.router.navigate(['/auth/login']);
        }
        return isLoggedIn;
      })
    );
  }

  loggedInDeactivate(): Observable<boolean> {
    return this.getAuth.pipe(
      map(auth => {
        const isLoggedIn = auth.token !== null;
        if (isLoggedIn && this.router.url.includes("auth")) {
          console.error('No tiene permisos para acceder a esta ruta');
          this.router.navigate(['/perfil']);
        }
        return !isLoggedIn;
      })
    );
  }
}

export const loggedInActivate: CanActivateFn = (route, state) => {
  const service = inject(AuthorizationService);
  return service.loggedInActivate();
}

export const loggedInDeactivate: CanActivateFn = (route, state) => {
  const service = inject(AuthorizationService);
  return service.loggedInDeactivate();
}
