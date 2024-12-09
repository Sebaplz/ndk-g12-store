import {createReducer, on} from '@ngrx/store';
import {productsReaction} from '../../../../library/reactions/products.reaction';
import {Product} from '../utils/interfaces';

export const productInitialState = {
  data: [] as Product[],
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
  on(productsReaction.delete,
    state => ({
      ...state,
      loading: true,
      error: null,
    })),
  on(productsReaction.deleteSuccess, (state, {productId}) => ({
    ...state,
    data: state.data.filter(product => product.id !== productId),
    total: state.total - 1,
    loading: false
  })),
  on(productsReaction.deleteFail, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),
  on(productsReaction.add,
    state => ({
      ...state,
      loading: true,
      error: null,
    })),
  on(productsReaction.addSuccess, (state, {productResponse}) => ({
    ...state,
    data: [...state.data, productResponse],
    total: state.total + 1,
    loading: false,
    error: null,
  })),
  on(productsReaction.addFail, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),
)
