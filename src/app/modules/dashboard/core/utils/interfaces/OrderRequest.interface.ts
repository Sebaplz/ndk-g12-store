export interface OrderRequest {
  items: {
    productId: number;
    quantity: number;
  }[];
}
