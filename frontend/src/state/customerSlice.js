import { createSlice } from "@reduxjs/toolkit";

const customersSlice = createSlice({
  name: "customers",
  initialState: {
    allCustomers: [],
  },
  reducers: {
    setCustomers: (state, action) => {
      state.allCustomers = action.payload;
    },
    addCustomer: (state, action) => {
      state.allCustomers.push(action.payload);
    },
  },
});
export const { setCustomers, addCustomer } = customersSlice.actions;

export default customersSlice.reducer;
