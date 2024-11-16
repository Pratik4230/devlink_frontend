import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  company: null,
};

const CompanySlice = createSlice({
  name: "company",
  initialState,
  reducers: {
    addCompany: (state, action) => {
      state.company = action.payload;
    },

    removeCompany: (state) => {
      state.company = null;
    },
  },
});

export const { addCompany, removeCompany } = CompanySlice.actions;

export default CompanySlice.reducer;
