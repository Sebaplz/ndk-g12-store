import {createActionGroup, props} from '@ngrx/store';
import {Product} from '../../modules/dashboard/core/utils/interfaces';

export const productsReaction = createActionGroup({
  source: 'Products Reactions',
  events: {
    'Load': props<{ page: number, limit: number }>(),
    'Load Success': props<{ products: Product[], total: number, page: number, limit: number }>(),
    'Load Fail': props<{ error: any }>(),
  },
});
