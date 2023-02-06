import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import {processCheckoutStripe} from "../../utils/api";

const initialState = {
  submitting: false,
  sessionUrl: ''
};


export const checkoutStripe = createAsyncThunk(
  'checkout/stripe',
  async ({accessToken, cartList, walletData}) => {
    let wallet = walletData;
    return await processCheckoutStripe({accessToken, cartList, wallet})
  }
);

export const checkoutStripeSlice = createSlice({
  name: 'checkoutStripe',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(checkoutStripe.pending, (state) => {
        state.submitting = true;
      })
      .addCase(checkoutStripe.fulfilled, (state, action) => {
        state.submitting = false;
        state.sessionUrl = action.payload.data;
      })
  }
});

const {reducer: checkoutStripeReducer} = checkoutStripeSlice

export const selectCheckoutStripeSubmitting = (state) => state.checkoutStripe.submitting;
export const selectCheckoutStripeUrl = (state) => state.checkoutStripe.sessionUrl;

export default checkoutStripeReducer;
