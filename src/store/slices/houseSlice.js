import {createSlice} from "@reduxjs/toolkit";
const initialState = {
  showModal: false
};

export const houseSlice = createSlice({
  name: 'house',
  initialState,
  reducers: {
    setShowHouseModal: (state, action) => {
      state.showModal = action.payload;
    }
   },
});

const { actions, reducer: houseReducer } = houseSlice
export const { setShowHouseModal } = actions;

export const showModal = (state) => state.house.showModal;
export default houseReducer;

