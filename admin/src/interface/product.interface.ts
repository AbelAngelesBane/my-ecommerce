import type { Product } from "./Order.interface";

export interface ProductPageResponse {
  products: Product[];
  total: number;
}
