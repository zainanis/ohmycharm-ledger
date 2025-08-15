import { configureStore } from "@reduxjs/toolkit";
import customersReducer from "./customerSlice";

export const store = configureStore({
  reducer: { customers: customersReducer },
});
