import { configureStore } from "@reduxjs/toolkit";
import { apiSlice } from "./api/apiSlice";
// 笔记：This enable
import { setupListeners } from "@reduxjs/toolkit/query"
export const store = configureStore({
  reducer: {
    [apiSlice.reducerPath]: apiSlice.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(apiSlice.middleware),
  devTools: true,
});

setupListeners(store.dispatch)