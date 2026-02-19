import { configureStore } from "@reduxjs/toolkit";
import itemsReducer from "./slices/addItem";
import cartReducer from "./slices/cartSlice";
import favoritesReducer from "./slices/favoritesSlice";

export const store = configureStore({
  reducer: {
    items: itemsReducer,
    cart: cartReducer,
    favorites: favoritesReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;