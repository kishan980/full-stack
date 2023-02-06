import {createSlice} from "@reduxjs/toolkit";

const initialState = {
    value: false,
};

export const signInSlice = createSlice({
    name: 'signIn',
    initialState,
    reducers: {
        closeWindow: (state, action) => {
            state.value = false;
        },
        openWindow: (state) => {
            state.value = true;
        },
    },
});

const { actions, reducer: signInReducer } = signInSlice
export const { closeWindow, openWindow } = actions;

export const selectSignIn = (state) => state.signIn.value;

export default signInReducer;