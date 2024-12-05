import {createReducer, on} from '@ngrx/store';
import {productsReaction} from '../../../../library/reactions/products.reaction';

export const productInitialState = {
  data: [],
  total: 0,
  page: 1,
  limit: 10,
  loading: false,
  error: null,
};

export const productReducer = createReducer(
  productInitialState,
  on(productsReaction.load,
    (state, {page, limit}): any => ({
      ...state,
      page,
      limit,
      loading: true,
      error: null,
    })),
  on(productsReaction.loadSuccess,
    (state, {products, total, page, limit}): any => ({
      ...state,
      data: products,
      total,
      page,
      limit,
      loading: false,
      error: null,
    })),
  on(productsReaction.loadFail,
    (state, {error}): any => ({
      ...state,
      loading: false,
      error,
    })),
)
