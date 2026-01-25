import type { Product } from "./order.interface";

export interface ProductPageResponse {
  products: Product[];
  total: number;
}
