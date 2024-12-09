export interface Order {
  id: string,
  totalAmount: number,
  totalItems: number,
  status: string,
  paid: boolean,
  paidAt: string,
  stripeChargeId: string,
  createdAt: string,
  updatedAt: string,
}
