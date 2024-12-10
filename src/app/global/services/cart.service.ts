import {inject, Injectable} from '@angular/core';
import {Store} from '@ngrx/store';
import {CartStore} from '../../resources/stores';
import {filter} from 'rxjs';
import {take} from 'rxjs/operators';
import {CartProduct} from '../../modules/dashboard/core/utils/interfaces';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  cartStore = inject(Store<{cart: CartStore}>);
  private readonly CART_KEY = 'cart';

  constructor() {
    console.log('CartService constructor');
  }

  get getCartFromLocalStorage(): CartProduct[] {
    const cart = localStorage.getItem(this.CART_KEY);
    return cart ? JSON.parse(cart) : [];
  }

  saveCart(cartProducts: CartProduct[]): void {
    localStorage.setItem(this.CART_KEY, JSON.stringify(cartProducts));
  }

  get getCartFromStore() {
    return this.cartStore.select<CartStore>(state => state.cart).pipe(
      filter(cart => !cart.loading && cart.check),
      take(1)
    );
  }
}
