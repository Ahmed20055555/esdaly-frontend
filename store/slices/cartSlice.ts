import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Item } from "./addItem";



export type CartItem = Item & {
  quantity: number;
};

const initialState: CartItem[] = [];

function ensureArray(state: unknown): CartItem[] {
  return Array.isArray(state) ? state : [];
}

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {

    addToCart: (state, action: PayloadAction<Item & { stock?: number | { quantity?: number } }>) => {
      const arr = ensureArray(state);
      const payload = action.payload;

      const existingItem = arr.find((item) => item.id === payload.id);

      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        arr.push({ ...payload, quantity: 1 });
      }

    },

    removeFromCart: (state, action: PayloadAction<string>) => {
      const arr = ensureArray(state);
      return arr.filter((item) => item.id !== action.payload);
    },

    updateQuantity: (state, action: PayloadAction<{ id: string; quantity: number }>) => {
      const arr = ensureArray(state);
      const item = arr.find((i) => i.id === action.payload.id);
      if (item) {
        if (action.payload.quantity <= 0) {
          return arr.filter((i) => i.id !== action.payload.id);
        }
        item.quantity = action.payload.quantity;
      }
      return arr;
    },

    clearCart: () => {
      return [];
    },

    setCart: (_state, action: PayloadAction<CartItem[]>) => {
      return Array.isArray(action.payload) ? action.payload : [];
    },
    
  },
});

export const { addToCart, removeFromCart, updateQuantity, clearCart, setCart } = cartSlice.actions;
export default cartSlice.reducer;
