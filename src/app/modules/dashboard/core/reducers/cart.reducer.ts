import {CartProduct} from '../utils/interfaces';
import {createReducer, on} from '@ngrx/store';
import {cartAction} from '../../../../global/actions';
import {CartStore} from '../../../../resources/stores';

export const cartInitialState = {
  products: [] as CartProduct[],
  total: 0,
  loading: true,
  check: false,
  error: null,
  blockedProducts: [] as number[],
};

export const cartReducer = createReducer(
  cartInitialState,
  on(cartAction.loadCart, (): CartStore => ({
    ...cartInitialState,
    loading: true,
    check: false,
  })),

  on(cartAction.loadCartSuccess, (state, {cartProducts, total, blockedProducts}): CartStore => ({
    ...state,
    products: cartProducts,
    total,
    loading: false,
    check: true,
    error: null,
    blockedProducts,
  })),

  on(cartAction.loadCartFail, (state, {error}): CartStore => ({
    ...state,
    loading: false,
    check: true,
    error,
  })),

  on(cartAction.saveCart, (state, { cartProducts, total }): CartStore => ({
    ...state,
    products: cartProducts,
    total,
    blockedProducts: cartProducts.map(product => product.id),
    loading: false,
    check: true,
    error: null,
  })),


  on(cartAction.addProduct, (state): CartStore => ({
    ...state,
    loading: true,
    check: false,
    error: null,
  })),

  on(cartAction.addProductSuccess, (state, { product }): CartStore => {
    const productExists = state.products.find(p => p.id === product.id);

    if (productExists) {
      return state;
    }

    const newProduct: CartProduct = {
      ...product,
      quantity: 1,
      subTotal: product.price,
    };

    return {
      ...state,
      loading: false,
      products: [...state.products, newProduct],
      total: state.total + newProduct.price,
      error: null,
    };
  }),

  on(cartAction.incrementQuantity, (state, { productId }): CartStore => {
    const updatedProducts = state.products.map(product =>
      product.id === productId
        ? {
          ...product,
          quantity: product.quantity + 1,
          subTotal: product.subTotal + product.price,
        }
        : product
    );

    return {
      ...state,
      products: updatedProducts,
      total: updatedProducts.reduce((sum, p) => sum + p.subTotal, 0),
    };
  }),

  on(cartAction.blockAddButton, (state, { productId }) => ({
    ...state,
    blockedProducts: [...state.blockedProducts, productId],
  })),
);
