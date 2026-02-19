import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type Item = {
  id: string;
  name: string;
  image: string;
  description: string;
  price: string;
};

const initialState: Item[] = [];

const itemsSlice = createSlice({
  name: "items",
  initialState,
  
  reducers : {

    addProduct : (state, action: PayloadAction<Item>) => {
      state.push(action.payload);
    },

    setProducts: (state, action: PayloadAction<Item[]>) => {
      return action.payload;
    },

    clearItems: () => {
      return [];
    },
  },
});

export const { addProduct, clearItems , setProducts} = itemsSlice.actions;
export default itemsSlice.reducer;