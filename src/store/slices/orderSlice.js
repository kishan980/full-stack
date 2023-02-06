import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { fetchOrdersListRequest, fetchProductItemsRequest } from "../../utils/api";

const initialState = {
  list: [],
  productlist: [],
  loading: false,
  productsLoading: false

};

export const fetchOrdersList = createAsyncThunk(
  'order/fetchList',
  async (accessToken) => {
    const { data } = await fetchOrdersListRequest({ accessToken });
    return data
  }
);

export const fetchProductItems = createAsyncThunk(
  'order/fetchProduct',
  async (sessionId) => {
    const { data } = await fetchProductItemsRequest({sessionId});
    return data
  }
);

export const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchOrdersList.pending, (state, action) => {
        state.loading = true
      })
      .addCase(fetchOrdersList.fulfilled, (state, action) => {
        state.list = action.payload || []
        state.loading = false
      })
      .addCase(fetchProductItems.pending, (state, action) => {
        state.productsLoading = true
      })
      .addCase(fetchProductItems.fulfilled, (state, action) => {
        state.productlist = action.payload.data || []
        state.productsLoading = false
      })
  }
});

const { reducer: orderReducer } = orderSlice

export const selectOrderList = (state) => state.order.list;
export const selectOrderListLoading = (state) => state.order.loading;
export const selectProductList = (state) => state.order.productlist;
export const selectProductListLoading = (state) => state.order.productsLoading;

export default orderReducer;
