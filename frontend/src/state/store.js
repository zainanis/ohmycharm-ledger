import { configureStore } from "@reduxjs/toolkit";
import customersReducer from "./customerSlice";
import expenseReducer from "./expenseSlice";

export const store = configureStore({
  reducer: { customers: customersReducer, expenses: expenseReducer },
});
