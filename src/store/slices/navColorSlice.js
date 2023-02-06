import {createSlice} from "@reduxjs/toolkit";

const initialState = {
  value: '',
};

export const navColorSlice = createSlice({
  name: 'navColor',
  initialState,
  reducers: {
    switchToAbout: (state) => {
      state.value = 'ABOUT ARTYST.AI';
    },
    switchToHelp: (state) => {
      state.value = 'COMPOSITION GUIDE';
    },
    switchToCreate: (state) => {
      state.value = 'CREATE ART';
    },
    switchToMyCollection: (state) => {
      state.value = 'MY COLLECTION';
    }
  },
});

const {actions, reducer: navColorReducer} = navColorSlice;
export const {switchToAbout, switchToCreate, switchToHelp, switchToMyCollection} = actions;

export const selectNavColor = (state) => state.navColor.value;

export default navColorReducer;
