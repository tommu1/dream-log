'use client';

import { User } from '@/types';
import { api } from '@/utils/api';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import Cookies from 'js-cookie';

export interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  loading: false,
  error: null
};

export const login = createAsyncThunk('auth/login', async (credentials: { email: string; password: string }) => {
  try {
    const response = await api.post('/auth/login', credentials);
    const { token, user } = response.data;
    Cookies.set('token', token, { expires: 7 });
    return user;
  } catch (error) {
    throw error;
  }
});

export const register = createAsyncThunk(
  'auth/register',
  async ({ username, email, password }: { username: string; email: string; password: string }) => {
    const response = await api.post('/auth/register', { username, email, password });
    Cookies.set('token', response.data.token, { expires: 7 });
    return response.data.user;
  }
);

export const getCurrentUser = createAsyncThunk('auth/getCurrentUser', async () => {
  try {
    const response = await api.get('/auth/me');
    return response.data;
  } catch (error) {
    Cookies.remove('token');
    throw error;
  }
});

export const logout = createAsyncThunk('auth/logout', async () => {
  Cookies.remove('token');
  return null;
});

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError: state => {
      state.error = null;
    }
  },
  extraReducers: builder => {
    builder
      // Login
      .addCase(login.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.error = null;
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'ログインに失敗しました';
      })
      // Register
      .addCase(register.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(register.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'アカウント作成に失敗しました';
      })
      // Get Current User
      .addCase(getCurrentUser.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getCurrentUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.error = null;
      })
      .addCase(getCurrentUser.rejected, state => {
        state.loading = false;
        state.user = null;
        state.error = null;
      })
      // Logout
      .addCase(logout.fulfilled, state => {
        state.user = null;
        state.error = null;
      });
  }
});

export const { clearError } = authSlice.actions;
export const authReducer = authSlice.reducer;
