export interface OrderResponse {
  orders: OrderModel[];
}

export interface User {
  _id: string;
  email: string;
  name: string;
}

export interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  category: string;
  images: string[];
  averageRating: number;
  totalReviews: number;
  createdAt: string;
  updatedAt: string;
  __v: number;
  archivedAt: string | null;
  isArchived: boolean;
}

export interface OrderItem {
  _id: string;
  product: Product;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

export interface ShippingAddress {
  _id: string;
  fullName: string;
  streetAddress: string;
  city: string;
  state: string;
  zipCode: string;
  phoneNumber: string;
}

export interface PaymentResult {
  id: string;
  status: string;
}

export interface OrderModel {
  _id: string;
  user: User; // Changed from string to User object
  clerkId: string;
  paymentResult: PaymentResult;
  orderItems: OrderItem[];
  shippingAddress: ShippingAddress;
  totalPrice: number;
  status: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
  hasReviewed?: boolean;
}

