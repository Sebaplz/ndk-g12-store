import {Product} from './Product.interface';

export interface CartProduct extends Product {
  quantity: number;
  subTotal: number;
}
