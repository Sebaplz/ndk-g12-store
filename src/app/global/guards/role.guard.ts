import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { map, take } from 'rxjs';
import {AuthStore} from '../../resources/stores/auth.store';

export const roleGuard: CanActivateFn = () => {
  const authStore = inject(Store<{ auth: AuthStore }>);
  const router = inject(Router);

  return authStore.select(state => state.auth).pipe(
    take(1),
    map(auth => {
      const { isLoggedIn, isAdmin } = auth;
      if (isLoggedIn && isAdmin) {
        return true;
      }
      if (isLoggedIn) {
        router.navigate(['/dashboard/user']);
        return false;
      }
      router.navigate(['/auth/login']);
      return false;
    })
  );
};
