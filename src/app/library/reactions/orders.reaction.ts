import {createActionGroup, emptyProps, props} from '@ngrx/store';
import {Order} from '../../modules/dashboard/core/utils/interfaces';

export const ordersReaction = createActionGroup({
  source: 'Orders Reactions',
  events: {
    'Load': emptyProps(),
    'Load Success': props<{ orders: Order[], total: number, page: number, lastPage: number }>(),
    'Load Fail': props<{ error: any }>(),
  },
});
