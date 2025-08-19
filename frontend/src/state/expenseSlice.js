import { createSlice } from "@reduxjs/toolkit";

const expenseSlice = createSlice({
  name: "expenses",
  initialState: { allExpenses: [] },
  reducers: {
    setExpenses: (state, action) => {
      state.allExpenses = action.payload;
    },
    addExpense: (state, action) => {
      state.allExpenses.push(action.payload);
    },
    updateExpense: (state, action) => {
      state.allExpenses = state.allExpenses.map((expense) => {
        return expense._id === action.payload._id ? action.payload : expense;
      });
    },
    deleteExpense: (state, action) => {
      state.allExpenses = state.allExpenses.filter((expense) => {
        return expense._id !== action.payload._id;
      });
    },
  },
});

export const { setExpenses, addExpense, updateExpense, deleteExpense } =
  expenseSlice.actions;

export default expenseSlice.reducer;
