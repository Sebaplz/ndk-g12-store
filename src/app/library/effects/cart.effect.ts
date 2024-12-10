import {inject, Injectable} from '@angular/core';
import {Actions, createEffect, ofType} from '@ngrx/effects';
import {cartAction} from '../../global/actions';
import {exhaustMap, of, switchMap} from 'rxjs';
import {CartService} from '../../global/services/cart.service';
import {catchError, map} from 'rxjs/operators';
import {Product} from '../../modules/dashboard/core/utils/interfaces';

@Injectable()
export class CartEffect {
  private readonly actions$ = inject(Actions);
  private readonly cartService = inject(CartService);

  constructor() {}

  loadCart$ = createEffect(() =>
      this.actions$.pipe(
        ofType(cartAction.loadCart),
        exhaustMap(() => {
          const cartProducts = this.cartService.getCartFromLocalStorage;
          if (cartProducts.length > 0) {
            const blockedProducts = cartProducts.map(product => product.id);
            const total = cartProducts.reduce((sum, product) => sum + product.price, 0);
            return of(cartAction.loadCartSuccess({ cartProducts, total, blockedProducts }));
          }
          return of(cartAction.loadCartFail({ error: 'No existe cart' }));
        })
      ),
    { functional: true }
  );

  saveCart$ = createEffect(() =>
    this.actions$.pipe(
      ofType(cartAction.saveCart),
      switchMap(({ cartProducts }) => {
        this.cartService.saveCart(cartProducts);
        const blockedProducts = cartProducts.map(product => product.id);
        return of(cartAction.loadCartSuccess({ cartProducts, total: cartProducts.length, blockedProducts }));
      })
    ),
    { functional: true }
  );

  addProduct$ = createEffect(() =>
    this.actions$.pipe(
      ofType(cartAction.addProduct),
      switchMap(({ product }) => {
        /*TODO: Esto se puede mejorar, pero es suficiente para el momento*/
        const cartProducts = this.cartService.getCartFromLocalStorage;
        const productExists = cartProducts.find(p => p.id === product.id);

        if (!productExists) {
          const newProduct = { ...product, quantity: 1, subTotal: product.price };
          cartProducts.push(newProduct);
          this.cartService.saveCart(cartProducts);
          return of(
            cartAction.addProductSuccess({ product }),
            cartAction.blockAddButton({ productId: product.id }) // Bloquea el botón
          );
        }

        return of(cartAction.blockAddButton({ productId: product.id }));
      })
    ),
    { functional: true }
  );

  incrementQuantity$ = createEffect(() =>
      this.actions$.pipe(
        ofType(cartAction.incrementQuantity),
        switchMap(({ productId }) => {
          const cartProducts = this.cartService.getCartFromLocalStorage;
          const updatedProducts = cartProducts.map(product =>
            product.id === productId
              ? { ...product, quantity: product.quantity + 1, subTotal: product.subTotal + product.price }
              : product
          );

          this.cartService.saveCart(updatedProducts);
          return of(cartAction.saveCart({ cartProducts: updatedProducts, total: updatedProducts.length }));
        })
      ),
    { functional: true }
  );

  removeProduct$ = createEffect(() =>
      this.actions$.pipe(
        ofType(cartAction.removeProduct),
        map((action) => action.product),
        switchMap((product: Product) => {
          const cartProducts = this.cartService.getCartFromLocalStorage;
          const updatedProducts = cartProducts.filter(p => p.id !== product.id);

          this.cartService.saveCart(updatedProducts);

          const total = updatedProducts.reduce((sum, p) => sum + p.subTotal, 0);

          return of(
            cartAction.saveCart({ cartProducts: updatedProducts, total })
          );
        }),
        catchError(error =>
          of(cartAction.loadCartFail({ error }))
        )
      ),
    { functional: true }
  );
}
