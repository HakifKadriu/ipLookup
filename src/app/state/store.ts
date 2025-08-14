import { configureStore } from "@reduxjs/toolkit";
import ipReducer from "./ip/ipSlice";

export const store = configureStore({
  reducer: {
    ip: ipReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
