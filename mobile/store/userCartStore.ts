import { create } from "zustand";
import { Product } from "@/types/types";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { api, useApi } from "@/lib/api";
import { Alert } from "react-native";

interface StoredCartItem {
  product: Product;
  quantity: number;
  _id: string;
  subTotal?: number;
}

interface CartState {
  items: StoredCartItem[];
  // Action to add item
  addItem: (product: Product) => void;
  removeItem: (productId: string) => void; // Good to have!
  // Action to clear cart
  clearCart: () => void;
  // Computed value (like useMemo, but built-in)
  getTotalPrice: () => number;
  getTotalItems: () => number;
  setItems: (product: StoredCartItem[]) => void;
  updateQuantity: (productId: string, newQty: number) => void;
  setSelecteditem: (product: Product) => void;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [] as StoredCartItem[],

      addItem: (product) =>
        set((state) => {
          const existingItem = state.items.find(
            (item) => item.product._id === product._id,
          );

          if (existingItem) {
            return {
              items: state.items.map((item) =>
                item.product._id === product._id
                  ? { ...item, quantity: item.quantity + 1}
                  : item,
              ),
            } as Partial<CartState>;
          }
          // M{ productId: product, quantity: 1, _id: Date.now().toString() }
          return {
            items: [
              ...state.items,
              { product: {
                ...product,
                isSelected:true,
              }, quantity: 1, _id: Date.now().toString()},
            ],
          }
        }),
      // setItems: (products: StoredCartItem[]) => {
      //   set((state: CartState) => {
      //     return { items: products };
      //   });
      // },
      setItems: (cart) => {
        //if this is not empty write the previous selected state, selected sTATE ONLY
        //check first if the same product is present
        const cartProducts = cart.map((item) => ({
          ...item,
          product: {
            ...item.product,
            isSelected: true
          },
        }));
        set({
          items: cartProducts,
        }); // Direct object update
      },

      removeItem: (productId) =>
        set((state) => ({
          items: state.items.filter((item) => item.product._id !== productId),
        })),
      setSelecteditem: (product) => {
        set((state) => ({
          items: state.items.map((item) =>
            item.product._id === product._id
              ? {
                  ...item,
                  product: {
                    ...item.product,
                    isSelected: !(item.product.isSelected) ,
                  },
                }
              : item,
          ),
        }));
      },
      clearCart: () => {
        set({ items: [] });
      },

      getTotalPrice: () => {
        return get().items.reduce(
          (sum, item) => sum + item.product.price * item.quantity,
          0,
        );
      },
      updateQuantity: async (productId: string, newQty: number) => {
        const previousItems = get().items; // Keep a backup in case the API fails

        //  UPDATE UI INSTANTLY, as I am displaying values from STORAGE FIRST
        set((state) => ({
          items: state.items.map((item) =>
            item.product._id === productId
              ? { ...item, quantity: newQty } //...spreads the object otherwise the other fields inside the object will be deleted
              : item,
          ),
        }));

        try {
          //  CALL API IN BACKGROUND
          await api.patch(`/cart/${productId}`, { quantity: newQty });
          // Success! No further action needed since UI is already updated above.
        } catch (error) {
          //  ROLLBACK IF API FAILS
          set({ items: previousItems });
          Alert.alert("Error", "Could not update quantity. Rolling back.");
        }
      },

      getTotalItems: () => {
        if (!Array.isArray(get().items)) return 0;
        return get().items.reduce((sum, item) => sum + item.quantity, 0);
      },
    }),
    {
      name: "cart-storage", // Unique name for localStorage/AsyncStorage
      storage: createJSONStorage(() => AsyncStorage),
      version: 2, // Change this to 2 if you change your store structure again! so u wont run into the RAM SPIKKKKEEEE AGAIN
    },
  ),
);
