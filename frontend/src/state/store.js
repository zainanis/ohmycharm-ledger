import { configureStore } from "@reduxjs/toolkit";
import customersReducer from "./customerSlice";
import expenseReducer from "./expenseSlice";
import orderReducer from "./orderSlice";
import productsReducer from "./productsSlice";

export const store = configureStore({
  reducer: {
    products: productsReducer,
    customers: customersReducer,
    expenses: expenseReducer,
    orders: orderReducer,
  },
});
