import { createSlice } from "@reduxjs/toolkit";

const orderSlice = createSlice({
  name: "orders",
  initialState: { allOrders: [] },
  reducers: {
    setOrders: (state, action) => {
      state.allOrders = action.payload;
    },
    addOrder: (state, action) => {
      state.allOrders.push(action.payload);
    },
  },
});
export const { setOrders, addOrder } = orderSlice.actions;
export default orderSlice.reducer;
