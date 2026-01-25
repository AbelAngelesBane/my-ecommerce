import type { Product } from "./order.interface";

export interface UserAddress {
  _id: string;
  label: string;          // e.g., "Home" or "Work"
  fullName: string;
  streetAddress: string;
  city: string;
  state: string;
  zipCode: string;
  phoneNumber: string;
  isDefault: boolean;
  createdAt?: string;     // Included if you use { timestamps: true }
  updatedAt?: string;
}


export interface UserAdminModel {
  _id: string;
  email: string;
  name: string;
  imageUrl: string;
  clerkId: string;
  wishlist:WishList[];
  addresses: UserAddress[];
  createdAt: string; // or Date if you parse it
  updatedAt: string; // or Date if you parse it
}

export interface WishList{
  _id: string;
  email: string;
  name: string;
  imageUrl: string;
  clerkId: string;
  wishlist: Product[]; // This is the populated array of products
  createdAt: string;
  updatedAt: string;
}