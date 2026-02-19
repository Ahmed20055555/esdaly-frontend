import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Item } from "./addItem";

const initialState: Item[] = [];

const favoritesSlice = createSlice({
  name: "favorites",
  initialState,
  reducers: {
    addToFavorites: (state, action: PayloadAction<Item>) => {
      const exists = state.find((item) => item.id === action.payload.id);
      if (!exists) {
        state.push(action.payload);
      }   
    },
    removeFromFavorites: (state, action: PayloadAction<string>) => {
      return state.filter((item) => item.id !== action.payload);
    },
    toggleFavorite: (state, action: PayloadAction<Item>) => {
      const exists = state.find((item) => item.id === action.payload.id);
      if (exists) {
        return state.filter((item) => item.id !== action.payload.id);
      } else {
        state.push(action.payload);
      }
    },
    clearFavorites: () => {
      return [];
    },
    setFavorites: ( _ , action: PayloadAction<Item[]>) => {
      return action.payload;
    },
  },
});

export const { addToFavorites, removeFromFavorites, toggleFavorite, clearFavorites, setFavorites } = favoritesSlice.actions;
export default favoritesSlice.reducer;
