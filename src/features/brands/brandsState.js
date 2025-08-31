import { createSlice } from "@reduxjs/toolkit";

const brandsState = createSlice({
  name: "brandsState",
  initialState: {
    brands: null,
  },
  reducers: {
    setBrandsData: (state, action) => {
      const { brandsData } = action.payload;
      state.brands = brandsData;
    },
  },
});

export const { setBrandsData } = brandsState.actions;

export default brandsState.reducer;

export const selectBrands = (state) => state.brands.brands;
