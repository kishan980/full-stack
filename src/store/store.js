import { configureStore } from '@reduxjs/toolkit';

import {
  persistReducer,
} from 'redux-persist'
import storage from 'redux-persist/lib/storage'
import reducers from "./slices/rootSlice";

const persistConfig = {
  key: "root",
  storage,
  whitelist: ["cart"],
};
const persistedReducer = persistReducer(persistConfig, reducers);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false
    }),
});
