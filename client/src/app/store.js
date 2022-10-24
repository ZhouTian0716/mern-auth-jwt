import { configureStore } from "@reduxjs/toolkit";
import { apiSlice } from "./api/apiSlice";
// 笔记：This enable
import { setupListeners } from "@reduxjs/toolkit/query";
// 笔记，lesson 9 added
import authReducer from "../features/auth/authSlice";

export const store = configureStore({
  reducer: {
    [apiSlice.reducerPath]: apiSlice.reducer,
    auth: authReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(apiSlice.middleware),
  devTools: true,
});

setupListeners(store.dispatch);
