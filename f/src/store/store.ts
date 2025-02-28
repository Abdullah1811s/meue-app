import { configureStore } from "@reduxjs/toolkit";
import authReducer from './authSlice.ts'

const store = configureStore({
  reducer: {
    auth: authReducer,
  },
});

// Export types for TypeScript
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
