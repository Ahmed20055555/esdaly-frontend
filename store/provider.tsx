// "use client";
// import { Provider } from "react-redux";
// import { store } from ".";

// export default function ReduxProvider({ children } : { children: React.ReactNode }) {
//   return <Provider store={store}>{children}</Provider>;
// }

"use client";

import { Provider, useDispatch } from "react-redux";
import { store } from "./index";
import { useEffect } from "react";
import { setProducts } from "./slices/addItem";
import { setCart } from "./slices/cartSlice";
import { setFavorites } from "./slices/favoritesSlice";

function InitProducts({ children }: { children: React.ReactNode }) {
  const dispatch = useDispatch();

  useEffect(() => {
    // التأكد من أننا في المتصفح (client-side)
    if (typeof window !== "undefined") {
      // تحميل المنتجات
      const storedProducts = localStorage.getItem("products");
      if (storedProducts) {
        try {
          dispatch(setProducts(JSON.parse(storedProducts)));
        } catch (error) {
          console.error("Error loading products from localStorage:", error);
        }
      }

      // تحميل السلة
      const storedCart = localStorage.getItem("cart");
      if (storedCart) {
        try {
          dispatch(setCart(JSON.parse(storedCart)));
        } catch (error) {
          console.error("Error loading cart from localStorage:", error);
        }
      }

      // تحميل المفضلة
      const storedFavorites = localStorage.getItem("favorites");
      if (storedFavorites) {
        try {
          dispatch(setFavorites(JSON.parse(storedFavorites)));
        } catch (error) {
          console.error("Error loading favorites from localStorage:", error);
        }
      }
    }
  }, [dispatch]);

  return <>{children}</>;
}

export default function ReduxProvider({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <InitProducts>{children}</InitProducts>
    </Provider>
  );
}
