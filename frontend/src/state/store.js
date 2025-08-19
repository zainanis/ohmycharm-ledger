import { configureStore } from "@reduxjs/toolkit";
import customersReducer from "./customerSlice";
import expenseReducer from "./expenseSlice";
import orderReducer from "./orderSlice";

export const store = configureStore({
  reducer: {
    customers: customersReducer,
    expenses: expenseReducer,
    orders: orderReducer,
  },
});
