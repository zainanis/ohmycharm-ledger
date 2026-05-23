import { createSlice } from "@reduxjs/toolkit";

const productSlice = createSlice({
  name: "products",
  initialState: {
    allProducts: [],
  },
  reducers: {
    setProducts: (state, action) => {
      state.allProducts = action.payload;
    },
    addProduct: (state, action) => {
      state.allProducts.push(action.payload);
    },
    updateProduct: (state, action) => {
      state.allProducts = state.allProducts.map((product) => {
        return product._id === action.payload._id ? action.payload : product;
      });
    },
    deleteProduct: (state, action) => {
      state.allProducts = state.allProducts.filter((product) => {
        return product._id !== action.payload._id;
      });
    },
    primeProduct: (state, action) => {
      const exists = state.allProducts.some((p) => p._id === action.payload._id);
      if (!exists) state.allProducts.push(action.payload);
    },
  },
});

export const { setProducts, addProduct, updateProduct, deleteProduct, primeProduct } =
  productSlice.actions;

export default productSlice.reducer;
