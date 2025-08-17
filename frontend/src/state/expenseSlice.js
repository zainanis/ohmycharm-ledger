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
  },
});

export const { setExpenses, addExpense } = expenseSlice.actions;

export default expenseSlice.reducer;
