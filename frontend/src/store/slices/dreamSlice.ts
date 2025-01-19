'use client';

import { Dream, ErrorResponse } from '@/types';
import { api } from '@/utils/api';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

export interface DreamState {
  dreams: Dream[];
  currentDream: Dream | null;
  loading: boolean;
  error: string | null;
}

const initialState: DreamState = {
  dreams: [],
  currentDream: null,
  loading: false,
  error: null
};

export const getDreams = createAsyncThunk<Dream[], void, { rejectValue: ErrorResponse }>(
  'dream/getDreams',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get<{ dreams: Dream[] }>('/dreams');
      return response.data.dreams;
    } catch (error: any) {
      return rejectWithValue({ error: error.response?.data?.error || '夢の取得に失敗しました' });
    }
  }
);

export const searchDreams = createAsyncThunk<
  Dream[],
  { q?: string; tag?: string; sort?: string },
  { rejectValue: ErrorResponse }
>('dream/searchDreams', async (params, { rejectWithValue }) => {
  try {
    const response = await api.get<{ dreams: Dream[] }>('/dreams/search', { params });
    return response.data.dreams;
  } catch (error: any) {
    return rejectWithValue({ error: error.response?.data?.error || '夢の検索に失敗しました' });
  }
});

export const getDream = createAsyncThunk<Dream, string, { rejectValue: ErrorResponse }>(
  'dream/getDream',
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.get<{ dream: Dream }>(`/dreams/${id}`);
      return response.data.dream;
    } catch (error: any) {
      return rejectWithValue({ error: error.response?.data?.error || '夢の取得に失敗しました' });
    }
  }
);

export const createDream = createAsyncThunk<
  Dream,
  { title: string; content: string; tags?: string[]; isPublic?: boolean },
  { rejectValue: ErrorResponse }
>('dream/createDream', async (data, { rejectWithValue }) => {
  try {
    const response = await api.post<{ dream: Dream }>('/dreams', data);
    return response.data.dream;
  } catch (error: any) {
    return rejectWithValue({ error: error.response?.data?.error || '夢の作成に失敗しました' });
  }
});

export const updateDream = createAsyncThunk<
  Dream,
  { id: string; title: string; content: string; tags?: string[]; isPublic: boolean },
  { rejectValue: ErrorResponse }
>('dream/updateDream', async ({ id, ...data }, { rejectWithValue }) => {
  try {
    const response = await api.put<{ dream: Dream }>(`/dreams/${id}`, data);
    return response.data.dream;
  } catch (error: any) {
    return rejectWithValue({ error: error.response?.data?.error || '夢の更新に失敗しました' });
  }
});

export const deleteDream = createAsyncThunk<string, string, { rejectValue: ErrorResponse }>(
  'dream/deleteDream',
  async (id, { rejectWithValue }) => {
    try {
      await api.delete(`/dreams/${id}`);
      return id;
    } catch (error: any) {
      return rejectWithValue({ error: error.response?.data?.error || '夢の削除に失敗しました' });
    }
  }
);

const dreamSlice = createSlice({
  name: 'dream',
  initialState,
  reducers: {
    clearError: state => {
      state.error = null;
    },
    clearCurrentDream: state => {
      state.currentDream = null;
    }
  },
  extraReducers: builder => {
    builder
      // Get Dreams
      .addCase(getDreams.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getDreams.fulfilled, (state, action) => {
        state.loading = false;
        state.dreams = action.payload;
      })
      .addCase(getDreams.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.error || '夢の取得に失敗しました';
      })
      // Search Dreams
      .addCase(searchDreams.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(searchDreams.fulfilled, (state, action) => {
        state.loading = false;
        state.dreams = action.payload;
      })
      .addCase(searchDreams.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.error || '夢の検索に失敗しました';
      })
      // Get Dream
      .addCase(getDream.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getDream.fulfilled, (state, action) => {
        state.loading = false;
        state.currentDream = action.payload;
      })
      .addCase(getDream.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.error || '夢の取得に失敗しました';
      })
      // Create Dream
      .addCase(createDream.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createDream.fulfilled, (state, action) => {
        state.loading = false;
        state.dreams = [action.payload, ...state.dreams];
        state.error = null;
      })
      .addCase(createDream.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.error || '夢の作成に失敗しました';
      })
      // Update Dream
      .addCase(updateDream.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateDream.fulfilled, (state, action) => {
        state.loading = false;
        state.currentDream = action.payload;
        state.dreams = state.dreams.map(dream => (dream.id === action.payload.id ? action.payload : dream));
      })
      .addCase(updateDream.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.error || '夢の更新に失敗しました';
      })
      // Delete Dream
      .addCase(deleteDream.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteDream.fulfilled, (state, action) => {
        state.loading = false;
        state.dreams = state.dreams.filter(dream => dream.id !== action.payload);
        if (state.currentDream?.id === action.payload) {
          state.currentDream = null;
        }
      })
      .addCase(deleteDream.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.error || '夢の削除に失敗しました';
      });
  }
});

export const { clearError, clearCurrentDream } = dreamSlice.actions;
export const dreamReducer = dreamSlice.reducer;
