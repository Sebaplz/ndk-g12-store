import {Order} from '../../modules/dashboard/core/utils/interfaces';

export interface OrderStore {
  data: Order[];
  meta: {
    total: number,
    page: number,
    lastPage: number,
  };
  loading: boolean;
  error: any;
}
