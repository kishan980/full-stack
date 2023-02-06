import {createSlice} from '@reduxjs/toolkit';
import {moveArrayElement} from "../../utils/helpers";


const emptyFile = {
  file: undefined,
  id: undefined,
  loading:false,
  style:undefined,
}

const initialState = {
  colorHex: '#888888',
  list: [emptyFile, emptyFile, emptyFile],
};

export const filesSlice = createSlice({
  name: 'files',
  initialState,
  reducers: {
    setColorHex: (state, action) => {
      state.colorHex = action.payload
    },
    addFile: (state, action) => {
      state.list[action.payload.index] = {
        file: action.payload.file,
        id: +(new Date()),
      };
    },
    //my code
    setStyle: (state, action) => {
      state.style =action.payload
    },
    updateLoading : (state, action) => {
      state.list[action.payload.index] = {
        loading : action.payload.loading
      }
    },
    removeFile: (state, action) => {
      state.list[action.payload] = emptyFile;
    },
    reorderFiles: (state, action) => {
      const {from, to} = action.payload
      state.list = moveArrayElement(state.list, from, to)
    }
  },
});

const {actions, reducer: filesReducer} = filesSlice
export const {setColorHex, addFile, removeFile, reorderFiles, updateLoading,setStyle} = actions;

export const selectFiles = (state) => state.files.list;
export const selectColorHex = (state) => state.files.colorHex;
export const selectStyle = (state) => state.files.style;

export default filesReducer;
