import {Order} from '../utils/interfaces';
import {createReducer, on} from '@ngrx/store';
import {ordersReaction} from '../../../../library/reactions';

export const ordersInitialState = {
  data: [] as Order[],
  meta: {
    total: 0,
    page: 1,
    lastPage: 0,
  },
  loading: false,
  error: null,
};

export const ordersReducer = createReducer(
  ordersInitialState,
  on(ordersReaction.load,
    (state): any => ({
      ...state,
      loading: true,
      error: null,
    })),

  on(ordersReaction.loadSuccess,
    (state, {orders, total, page, lastPage}): any => ({
      ...state,
      data: orders,
      meta: {
        total,
        page,
        lastPage,
      },
      loading: false,
      error: null,
    })),

  on(ordersReaction.loadFail,
    (state, {error}): any => ({
      ...state,
      loading: false,
      error,
    })),
);
