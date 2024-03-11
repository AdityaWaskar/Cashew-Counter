import { configureStore } from "@reduxjs/toolkit";
import workerSlice from "./workerSlice.js";

export const store = configureStore({
  reducer: {
    workers: workerSlice,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});
