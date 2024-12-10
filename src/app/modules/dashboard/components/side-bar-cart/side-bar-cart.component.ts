import {Component, inject} from '@angular/core';
import {Store} from '@ngrx/store';
import {AuthStore, CartStore} from '../../../../resources/stores';
import {AsyncPipe, NgForOf, NgIf} from '@angular/common';
import {CartProduct, Product} from '../../core/utils/interfaces';
import {TooltipModule} from 'primeng/tooltip';
import {ButtonDirective} from 'primeng/button';
import {DividerModule} from 'primeng/divider';
import {BadgeModule} from 'primeng/badge';
import {cartAction} from '../../../../global/actions';

@Component({
  selector: 'app-side-bar-cart',
  standalone: true,
  imports: [
    AsyncPipe,
    NgIf,
    NgForOf,
    TooltipModule,
    ButtonDirective,
    DividerModule,
    BadgeModule
  ],
  templateUrl: './side-bar-cart.component.html',
  styleUrl: './side-bar-cart.component.scss'
})
export class SideBarCartComponent {
  cartStore = inject(Store<{ cart: CartStore }>);
  authStore = inject(Store<{ auth: AuthStore }>);
  isLoggedIn$ = this.authStore.select(state => state.auth.isLoggedIn);

  products$ = this.cartStore.select(state => state.cart.products);

  decreaseQuantity(product: Product){

  }

  increaseQuantity(product: Product){

  }

  removeFromCart(product: Product){
    this.cartStore.dispatch(cartAction.removeProduct({product}));
  }

  calculateTotal(products: CartProduct[]){
    let total = 0;
    products.forEach(product => {
      total += product.price * product.quantity;
    });
    return total;
  }
}
