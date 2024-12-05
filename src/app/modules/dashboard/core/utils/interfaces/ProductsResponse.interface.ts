import {Product} from './Product.interface';

export interface ProductsResponse {
  data: Product[];
  total: number;
  page: number;
  limit: number;
}
