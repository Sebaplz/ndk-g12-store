import {Order} from './Order.interface';

export interface OrderList{
  data: Order[],
  meta:{
    total: number,
    page: number,
    lastPage: number,
  }
}
