import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getNearbyUsers } from '../api'; // Your axios API function

// Async thunk for fetching nearby users with auth guard
export const fetchNearbyUsers = createAsyncThunk(
  'nearbyUsers/fetchNearbyUsers',
  async ({ profession = 'all', maxDistance = 5000 }, { rejectWithValue, getState }) => {
    try {
      // ✅ Check authentication using your auth slice
      const state = getState();
      const isAuthenticated = state.auth?.status;
      const userData = state.auth?.userData;
      
      if (!isAuthenticated || !userData) {
        return rejectWithValue('Please log in to view nearby users');
      }

      const response = await getNearbyUsers(profession);
      return response.data.data;
    } catch (error) {
      // Handle 401 specifically to avoid triggering refresh loop
      if (error.response?.status === 401) {
        return rejectWithValue('Authentication required. Please log in.');
      }
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch nearby users'
      );
    }
  }
);

const nearbyUsersSlice = createSlice({
  name: 'nearbyUsers',
  initialState: {
    users: [],
    loading: false,
    error: null,
    selectedProfession: 'all',
    maxDistance: 5000,
  },
  reducers: {
    clearNearbyUsers: (state) => {
      state.users = [];
      state.error = null;
    },
    setSelectedProfession: (state, action) => {
      state.selectedProfession = action.payload;
    },
    setMaxDistance: (state, action) => {
      state.maxDistance = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
    // ✅ Clear nearby users on logout
    resetOnLogout: (state) => {
      state.users = [];
      state.error = null;
      state.loading = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchNearbyUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchNearbyUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload;
        state.error = null;
      })
      .addCase(fetchNearbyUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const {
  clearNearbyUsers,
  setSelectedProfession,
  setMaxDistance,
  clearError,
  resetOnLogout,
} = nearbyUsersSlice.actions;

// Selectors
export const selectNearbyUsers = (state) => state.nearbyUsers.users;
export const selectNearbyUsersLoading = (state) => state.nearbyUsers.loading;
export const selectNearbyUsersError = (state) => state.nearbyUsers.error;
export const selectSelectedProfession = (state) => state.nearbyUsers.selectedProfession;
export const selectMaxDistance = (state) => state.nearbyUsers.maxDistance;

// ✅ Auth-aware selector
export const selectCanFetchNearbyUsers = (state) => state.auth?.status;

export default nearbyUsersSlice.reducer;
