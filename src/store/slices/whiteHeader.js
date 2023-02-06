import {createSlice} from "@reduxjs/toolkit";

const initialState = {
    value: false,
};

export const whiteHeaderSlice = createSlice({
    name: 'whiteHeader',
    initialState,
    reducers: {
        makeHeaderDark: (state) => {
            state.value = false;
        },
        makeHeaderLight: (state) => {
            state.value = true;
        },
    },
});

const { actions, reducer: whiteHeaderReducer } = whiteHeaderSlice
export const { makeHeaderDark, makeHeaderLight } = actions;

export const selectWhiteHeader = (state) => state.whiteHeader.value;

export default whiteHeaderReducer;