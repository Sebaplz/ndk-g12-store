import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { AuthStore } from '../../resources/stores/auth.store';
import { map, take } from 'rxjs';

export const authGuard: CanActivateFn = () => {
  const authStore = inject(Store<{ auth: AuthStore }>);
  const router = inject(Router);

  return authStore.select(state => state.auth).pipe(
    take(1),
    map(auth => {
      const { isLoggedIn, isAdmin } = auth;
      if (isLoggedIn && isAdmin) {
        router.navigate(['/dashboard/admin']);
        return false;
      }else if (isLoggedIn) {
        router.navigate(['/dashboard/user']);
        return false;
      }
      return true;
    })
  );
};
