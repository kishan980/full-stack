import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';

import {createImageCompositionRequest, uploadImage, trackInteraction} from '../../utils/api';
import { selectStyle } from '../../store/slices/filesSlice';
import { useSelector } from 'react-redux';
import axios from 'axios';

// let temp = "";
// console.log("🚀 ~ file: resultsSlice.js ~ line 9 ~ temp", temp)

const uploadImages = async (accessToken, fileList = []) => {
  const promises = fileList.map(({file}) => (
    new Promise((resolve, reject) => {
      const formData = new FormData();
      formData.append('file', file);
      uploadImage({data: formData, accessToken}).then((result) => {
        resolve(result.data.url);
      }).catch((error) => {
        reject(error);
      });
    }
    )
    ));
  return Promise.all(promises);
}


export const createImageComposition = createAsyncThunk(
  'results/createImage',
  async ({files, colorHex, accessToken, resubmit, select}, {dispatch}) => {
    const [first, second, third] = await uploadImages(accessToken, files);
    dispatch(setResultsProgress(10));
  
    let imageCompositionData = {
      image_urls: {
        first,
        second,
        third,
      },
      priority: 'first:a;second:b;third:c',
      bboxes: '',
      blending_mode: 'first:none;second:none;third:none;',
      color_A_hex: colorHex,
      people_extraction: '',
      style_type: select
    };


    let req1 = async () => {
      if(select==='style_1'){

        imageCompositionData.color_mode = 'analogous+30';
      }else{
        imageCompositionData.color_mode = 'triadic-120';
        
      }
      return (await createImageCompositionRequest(imageCompositionData))[0];
    };
    const result1 = await req1();
    dispatch(setResultsProgress(40));

    //get the config file for this response
    const url = new URL('./config.json', result1);
    const {data} = await axios.get(url.href);


    let req2 = async () => {
      if(select==='style_1'){
        imageCompositionData.color_mode = 'complementary';
      }else{
        imageCompositionData.color_mode = 'triadic-120_obj';
      }
      return (await createImageCompositionRequest(imageCompositionData))[0];
    };
    const result2 = await req2();
    dispatch(setResultsProgress(70));

    if (data.image_a_extracted) {
      imageCompositionData.people_extraction = 'first:no;second:no;third:no;';
    }

    let req3 = async () => {
      if(select==='style_1'){
        imageCompositionData.color_mode = 'analogous-30';
      }else{
        imageCompositionData.color_mode = 'triadic+120';      
      }
      return (await createImageCompositionRequest(imageCompositionData))[0];
    };
    const result3 = await req3();
    dispatch(setResultsProgress(100));

    await trackInteraction({
      accessToken,
      type: resubmit ? 'RESUBMIT_ART' : 'SUBMIT_ART',
      data: JSON.stringify({
        image_urls: {
          first,
          second,
          third,
        },
        color_hex: colorHex,
        result_urls: {
          result1,
          result2,
          result3,
        },
      }),
    });

    return [
      result1,
      result2,
      result3,
    ];
  }
);

const initialState = {
  choice: '',
  list: [],
  loading: false,
  progress: 1,

};

export const resultsSlice = createSlice({
  name: 'results',
  initialState,

  reducers: {
    setNewStyle: (state, action) => {
      console.log("🚀 ~ file: resultsSlice.js ~ line 119 ~ state", state)
      
      state.style =action.payload
    
    },
    setChoice: (state, action) => {
      state.choice = action.payload;
    },
    setResultsList: (state, action) => {
      state.list = action.payload;
    },
    addImageToResultsList: (state, action) => {
      state.list = [...state.list, action.payload];
    },
    addImagesToResultsList: (state, action) => {
      state.list = [...state.list, ...action.payload];
    },
    removeImageFromResultsList: (state, action) => {
      state.list = state.list.filter((item, index) => (index !== action.payload));
    },
    setResultsProgress: (state, action) => {
      state.progress = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createImageComposition.pending, (state) => {
        state.loading = true;
      })
      .addCase(createImageComposition.fulfilled, (state, action) => {
             
        state.list = action.payload || [];
        state.loading = false;
        state.progress = 1;
       
      })
      .addCase(createImageComposition.rejected, (state, action) => {

      })
  }
});

const {actions, reducer: resultsReducer} = resultsSlice
export const {
  setChoice,
  setResultsList,
  addImageToResultsList,
  addImagesToResultsList,
  removeImageFromResultsList,
  setResultsProgress,
  setNewStyle
} = actions;

export const selectResultsChoice = (state) => state.results.choice;
export const selectResultsList = (state) => state.results.list;
export const selectResultsLoading = (state) => state.results.loading;
export const selectResultsProgress = (state) => state.results.progress;
export const selectStyleData = (state) =>  state.files.style;

export default resultsReducer;
