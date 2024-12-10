import {Component, inject, OnInit} from '@angular/core';
import {Router, RouterOutlet} from '@angular/router';
import {AuthStore, CartStore} from './resources/stores';
import {Store} from '@ngrx/store';
import {authAction, cartAction} from './global/actions';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  template: `
    <router-outlet></router-outlet>
  `,
})
export class AppComponent implements OnInit {
  cartStore = inject(Store<{ cart: CartStore }>);
  authStore = inject(Store<{ auth: AuthStore }>);
  router = inject(Router);

  ngOnInit() {
    this.authStore.dispatch(authAction.loadToken());
    this.cartStore.dispatch(cartAction.loadCart());
    this.authStore.select(state => state.auth).subscribe(auth => {
      if (auth.checked && auth.isLoggedIn) {
        const currentUrl = this.router.url; // Obtén la URL actual
        if (currentUrl !== '/') {
          this.router.navigate(['/dashboard']);
        }
      }
    });


  }
}
