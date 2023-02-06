import {createSlice} from "@reduxjs/toolkit";

const initialState = {
    value: true,
};

export const contactSlice = createSlice({
    name: 'contact',
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

const { actions, reducer: contactReducer } = contactSlice
export const { closeWindow, openWindow } = actions;

export const selectContact = (state) => state.contact.value;

export default contactReducer;