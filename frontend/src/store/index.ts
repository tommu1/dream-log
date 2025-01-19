'use client';

import { configureStore } from '@reduxjs/toolkit';
import { authReducer, AuthState } from './slices/authSlice';
import { dreamReducer, DreamState } from './slices/dreamSlice';

export interface RootState {
  auth: AuthState;
  dream: DreamState;
}

export const store = configureStore({
  reducer: {
    auth: authReducer,
    dream: dreamReducer
  }
});

export type AppDispatch = typeof store.dispatch;
