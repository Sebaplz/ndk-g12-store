import {createActionGroup, emptyProps, props} from '@ngrx/store';
import {CartProduct, Product} from '../../modules/dashboard/core/utils/interfaces';

export const cartAction = createActionGroup({
  source: 'Cart Actions',
  events: {
    'Load Cart': emptyProps(),
    'Load Cart Success': props<{ cartProducts: CartProduct[], total: number, blockedProducts: number[] }>(),
    'Load Cart Fail': props<{ error: any }>(),

    'Add Product': props<{ product: Product }>(),
    'Add Product Success': props<{ product: Product }>(),
    'Add Product Fail': props<{ error: any }>(),

    'Save Cart': props<{ cartProducts: CartProduct[], total: number }>(),

    'Increment Quantity': props<{ productId: number }>(),
    'Block Add Button': props<{ productId: number }>(),

  },
});
