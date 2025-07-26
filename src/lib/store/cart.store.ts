import { create } from "zustand";
import type { ICart } from "../../types/cart.type";

interface CartState {
  count: number;
  cartItems: ICart[];
  setCount: (quantity: number) => void;
  setProducts: (cartItems: ICart[]) => void;
  increaseProductQuantity: (productId: number) => void;
  decreaseProductQuantity: (prdouctId: number) => void;
  deleteProduct: (productId: number) => void;
  clearCart: () => void;
}

export const useCartStore = create<CartState>((set) => ({
  count: 0,
  cartItems: [],
  setProducts(cartItems) {
    set({ cartItems: cartItems });
  },
  increaseProductQuantity(productId) {
    set((state) => ({
      cartItems: state.cartItems.map((item) =>
        item.producto.id === productId
          ? { ...item, cantidad: item.cantidad + 1 }
          : item
      ),
    }));
  },
  decreaseProductQuantity(productId) {
    set((state) => ({
      cartItems: state.cartItems.map((item) =>
        item.producto.id === productId
          ? { ...item, cantidad: item.cantidad - 1 }
          : item
      ),
    }));
  },
  deleteProduct(productId) {
    set((state) => ({
      cartItems: state.cartItems.filter(
        (item) => item.producto.id !== productId
      ),
    }));
  },
  clearCart() {
    set({ cartItems: [] });
  },
  setCount: (quantity: number) =>
    set((state) => ({ ...state, count: quantity })),
}));
