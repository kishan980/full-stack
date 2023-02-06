import {createSlice} from "@reduxjs/toolkit";

const initialState = {
  value: {},
};

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.value = action.payload
    },
    removeUser: (state) => {
      state.value = {}
    },
  },
});

const { actions, reducer: userReducer } = userSlice
export const { setUser, removeUser } = actions;

export const selectUser = (state) => state.user.value;

export default userReducer;