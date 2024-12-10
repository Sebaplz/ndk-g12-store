export interface OrderResponse {
  id: string,
  totalAmount: number,
  totalItems: number,
  status: string,
  paid: boolean,
  paidAt: string,
  stripeChargeId: string,
  createdAt: string,
  updatedAt: string,
  OrderItem: {
    name: string,
    price: number,
    quantity: number,
    productId: number,
  }[],
  paymentSession: {
    cancel_url: string,
    success_url: string,
    url: string,
  }
}
