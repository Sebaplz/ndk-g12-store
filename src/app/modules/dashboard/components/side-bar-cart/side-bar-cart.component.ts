import {Component, inject} from '@angular/core';
import {Store} from '@ngrx/store';
import {AuthStore, CartStore, OrderStore} from '../../../../resources/stores';
import {AsyncPipe, NgForOf, NgIf} from '@angular/common';
import {CartProduct, Product} from '../../core/utils/interfaces';
import {TooltipModule} from 'primeng/tooltip';
import {Button, ButtonDirective} from 'primeng/button';
import {DividerModule} from 'primeng/divider';
import {BadgeModule} from 'primeng/badge';
import {environment} from '../../../../../environments/environment.development';
import {HttpClient} from '@angular/common/http';
import {cartAction} from '../../../../global/actions/cart.action';

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
    BadgeModule,
    Button
  ],
  templateUrl: './side-bar-cart.component.html',
  styleUrl: './side-bar-cart.component.scss'
})
export class SideBarCartComponent {
  cartStore = inject(Store<{ cart: CartStore }>);
  authStore = inject(Store<{ auth: AuthStore }>);
  orderStore = inject(Store<{ orders: OrderStore }>);
  private readonly API_URL = environment.apiUrl;
  private readonly http = inject(HttpClient);
  isLoggedIn$ = this.authStore.select(state => state.auth.isLoggedIn);

  products$ = this.cartStore.select(state => state.cart.products);

  totalItems$ = this.cartStore.select(state => state.cart.products.length);

  decreaseQuantity(product: Product): void {
    this.cartStore.dispatch(cartAction.decrementQuantity({ productId: product.id }));
  }

  increaseQuantity(product: Product): void {
    this.cartStore.dispatch(cartAction.incrementQuantity({ productId: product.id }));
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

  checkout() {
    this.products$.subscribe(products => {
      const items = products.map((product: CartProduct) => ({
        productId: product.id,
        quantity: product.quantity
      }));
      this.http.post<any>(`${this.API_URL}/orders`, { items }).subscribe({
        next: (response) => {
          window.location.href = response.paymentSession.url;
        },
        error: (err) => {
          console.error('Error al crear la orden:', err);
          alert('Hubo un problema al procesar tu orden. Intenta nuevamente.');
        }
      });
    });
  }

  toggleCart() {
    this.cartStore.dispatch(cartAction.toggleCart());
  }
}
