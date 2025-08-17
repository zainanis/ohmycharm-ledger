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
    updateCustomer: (state, action) => {
      state.allCustomers = state.allCustomers.map((customer) => {
        return customer._id == action.payload._id ? action.payload : customer;
      });
    },
    deleteCustomer: (state, action) => {
      state.allCustomers = state.allCustomers.filter((customer) => {
        return customer._id !== action.payload._id;
      });
    },
  },
});
export const { setCustomers, addCustomer, updateCustomer, deleteCustomer } =
  customersSlice.actions;

export default customersSlice.reducer;
