export interface OrderResponse {
  data: Order[];
  meta: Meta;
}

export interface Order {
  id: string;
  totalAmount: number;
  totalItems: number;
  status: string;
  paid: boolean;
  paidAt: Date | null;
  stripeChargeId: null | string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Meta {
  total: number;
  page: number;
  lastPage: number;
}

// export enum OrderStatus {
//   Pending = 'PENDING',
//   Paid = 'PAID',
//   Cancelled = 'CANCELLED',
//   Delivered = 'DELIVERED',
// }

export class orderStatus {
  public static readonly Pending: string = 'PENDINIG';
  public static readonly Paid: string = 'PAID';
  public static readonly Cancelled: string = 'CANCELLED';
  public static readonly Delivered: string = 'DELIVERED';
}

