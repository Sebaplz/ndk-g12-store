import {Component, inject} from '@angular/core';
import {MenuModule} from 'primeng/menu';
import {Button} from 'primeng/button';
import {TabMenuModule} from 'primeng/tabmenu';
import {AsyncPipe} from "@angular/common";
import {AuthStore, CartStore} from '../../../resources/stores';
import {Store} from '@ngrx/store';
import {BadgeModule} from 'primeng/badge';
import {authAction} from '../../actions/auth.action';
import {cartAction} from '../../actions/cart.action';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [
    MenuModule,
    Button,
    TabMenuModule,
    AsyncPipe,
    BadgeModule,
  ],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent{
  authStore = inject(Store<{ auth: AuthStore }>);
  cartStore = inject(Store<{ cart: CartStore }>);
  totalItems$ = this.cartStore.select(state => state.cart.products.length);
  email$ = this.authStore.select(state => state.auth.email);
  isAdmin$ = this.authStore.select(state => state.auth.isAdmin);
  isLoggedIn$ = this.authStore.select(state => state.auth.isLoggedIn);

  logout() {
    this.authStore.dispatch(authAction.logout());
  }

  toggleCart() {
    this.cartStore.dispatch(cartAction.toggleCart());
  }
}
