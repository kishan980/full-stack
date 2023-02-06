import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import {fetchImagesListRequest, saveImage, deleteImage, trackInteraction} from "../../utils/api";

const initialState = {
  list: [],
  loading: false
};

export const fetchImagesList = createAsyncThunk(
  'collection/fetchList',
  async (accessToken) => {
    const {data} = await fetchImagesListRequest({accessToken})
    return data
  }
);

export const saveImageToCollection = createAsyncThunk(
  'collection/saveImage',
  async ({accessToken, imgUrl}) => {
    await trackInteraction({
      accessToken,
      type: "SAVE_TO_COLLECTION",
      data: JSON.stringify({
        url: imgUrl,
      }),
    });
    return await saveImage({accessToken, imgUrl})
  }
);

export const deleteImageFromCollection = createAsyncThunk(
  'collection/deleteImage',
  async ({accessToken, imgUrl}) => {
    return await deleteImage({accessToken, imgUrl})
  }
);

export const collectionSlice = createSlice({
  name: 'collection',
  initialState,
  reducers: {
    setCollectionList: (state, action) => {
      state.list = action.payload
    },
    addImageToCollectionList: (state, action) => {
      state.list = [...state.list, action.payload]
    },
    addImagesToCollectionList: (state, action) => {
      state.list = [...state.list, ...action.payload]
    },
    removeImageFromCollectionList: (state, action) => {
      state.list = state.list.filter((item, index) => (index !== action.payload));
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchImagesList.pending, (state, action) => {
        state.loading = true
      })
      .addCase(fetchImagesList.fulfilled, (state, action) => {
        state.list = action.payload || []
        state.loading = false
      })
      .addCase(saveImageToCollection.pending, (state) => {
        state.loading = true
      })
      .addCase(saveImageToCollection.fulfilled, (state, action) => {
        // state.list = action.payload || []
        state.loading = false
      })
      .addCase(deleteImageFromCollection.pending, (state) => {
        state.loading = true
      })
      .addCase(deleteImageFromCollection.fulfilled, (state, action) => {
        // state.list = action.payload || []
        state.loading = false
      })
  }
});

const {actions, reducer: collectionReducer} = collectionSlice
export const {
  setCollectionList,
  addImageToCollectionList,
  addImagesToCollectionList,
  removeImageFromCollectionList,

} = actions;

export const selectCollectionList = (state) => state.collection.list;
export const selectCollectionLoading = (state) => state.collection.loading;
export const selectCollectionItem = (state) => state.collection.item;

export default collectionReducer;
