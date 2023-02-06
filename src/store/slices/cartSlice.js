import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { fetchCart, saveCart } from "../../utils/api";

const initialState = {
  list: [],
  totalPrice: 0,
  loading: false,
  dirty: false,
};

export const getCart = createAsyncThunk("cart/get", async (accessToken) => {
  const { data } = await fetchCart({ accessToken });
  return data;
});

export const updateCart = createAsyncThunk(
  "cart/update",
  async ({ accessToken, list, totalPrice }, { getState, dispatch }) => {
    const state = getState().cart;
    if (state.dirty) {
      return await saveCart({
        accessToken,
        itemList: JSON.stringify(list),
        totalPrice,
      });
    }
  }
);

export const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    setCartItemList: (state, action) => {
      state.list = action.payload;

      let totalPrice = 0;

      state.totalPrice = action.payload.map((cartItem) => {
        const item = {
          ...cartItem,
        };

        totalPrice = totalPrice + item.artSize.price * item.quantity;

        return { totalPrice };
      });
      state.totalPrice = parseInt(totalPrice);

      state.dirty = true;
    },
    clearCartList: (state) => {
      state.list = [];
      state.dirty = true;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getCart.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(getCart.fulfilled, (state, action) => {
        const payload = action.payload;
        if (payload[0]) {
          const cart = payload[0];
          state.list = JSON.parse(cart.itemList);
          state.totalPrice = cart.totalPrice;
        } else {
          state.list = [];
          state.totalPrice = 0;
        }
        state.loading = false;
        state.dirty = false;
      });
  },
});

const { actions, reducer: cartReducer } = cartSlice;
export const { setCartItemList, clearCartList } = actions;

export const selectCart = (state) => state.cart.list;
export const selectTotalPrice = (state) => state.cart.totalPrice;
export const selectCartLoading = (state) => state.cart.loading;

export default cartReducer;
