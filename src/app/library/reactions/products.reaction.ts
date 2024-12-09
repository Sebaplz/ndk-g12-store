import {createActionGroup, props} from '@ngrx/store';
import {Product, ProductResponse} from '../../modules/dashboard/core/utils/interfaces';

export const productsReaction = createActionGroup({
  source: 'Products Reactions',
  events: {
    'Load': props<{ page: number, limit: number }>(),
    'Load Success': props<{ products: Product[], total: number, page: number, limit: number }>(),
    'Load Fail': props<{ error: any }>(),

    'Delete': props<{ product: Product }>(),
    'Delete Success': props<{ productId: number }>(),
    'Delete Fail': props<{ error: any }>(),

    'Add': props<{ product: Product }>(),
    'Add Success': props<{ productResponse: ProductResponse }>(),
    'Add Fail': props<{ error: any }>(),

    'Update': props<{ product: Product }>(),
    'Update Success': props<{ productResponse: ProductResponse }>(),
    'Update Fail': props<{ error: any }>(),
  },
});
