// store/emergencySlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { createEmergency, acceptEmergency, getNearbyEmergencies } from '../api/emergency';

// Async thunks
export const createEmergencyAsync = createAsyncThunk(
  'emergency/create',
  async (emergencyData, { rejectWithValue, getState }) => {
    try {
      const state = getState();
      if (!state.auth?.status) {
        return rejectWithValue('Authentication required');
      }
      const response = await createEmergency(emergencyData);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create emergency');
    }
  }
);

export const acceptEmergencyAsync = createAsyncThunk(
  'emergency/accept',
  async (emergencyId, { rejectWithValue, getState }) => {
    try {
      const state = getState();
      if (!state.auth?.status) {
        return rejectWithValue('Authentication required');
      }
      const response = await acceptEmergency(emergencyId);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to accept emergency');
    }
  }
);

export const fetchNearbyEmergencies = createAsyncThunk(
  'emergency/fetchNearby',
  async (maxDistance = 2000, { rejectWithValue, getState }) => {
    try {
      const state = getState();
      if (!state.auth?.status) {
        return rejectWithValue('Authentication required');
      }
      const response = await getNearbyEmergencies(maxDistance);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch emergencies');
    }
  }
);

const emergencySlice = createSlice({
  name: 'emergency',
  initialState: {
    myEmergencies: [],
    nearbyEmergencies: [],
    activeAlert: null,
    loading: false,
    error: null,
    socket: null,
  },
  reducers: {
    setActiveAlert: (state, action) => {
      state.activeAlert = action.payload;
    },
    clearActiveAlert: (state) => {
      state.activeAlert = null;
    },
    addEmergencyAlert: (state, action) => {
      // Add new emergency alert to nearby
      state.nearbyEmergencies.unshift(action.payload);
      state.activeAlert = action.payload;
    },
    updateEmergencyStatus: (state, action) => {
      const { emergencyId, status } = action.payload;
      // Update in both arrays
      state.myEmergencies = state.myEmergencies.map(e => 
        e._id === emergencyId ? { ...e, status } : e
      );
      state.nearbyEmergencies = state.nearbyEmergencies.map(e => 
        e._id === emergencyId ? { ...e, status } : e
      );
    },
    clearError: (state) => {
      state.error = null;
    },
    resetEmergencies: (state) => {
      state.myEmergencies = [];
      state.nearbyEmergencies = [];
      state.activeAlert = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Create Emergency
      .addCase(createEmergencyAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createEmergencyAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.myEmergencies.unshift(action.payload.emergency);
      })
      .addCase(createEmergencyAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Accept Emergency
      .addCase(acceptEmergencyAsync.pending, (state) => {
        state.loading = true;
      })
      .addCase(acceptEmergencyAsync.fulfilled, (state, action) => {
        state.loading = false;
        // Update emergency status
        const emergencyId = action.payload.emergency._id;
        state.nearbyEmergencies = state.nearbyEmergencies.map(e =>
          e._id === emergencyId ? { ...e, status: 'accepted' } : e
        );
      })
      .addCase(acceptEmergencyAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch Nearby
      .addCase(fetchNearbyEmergencies.fulfilled, (state, action) => {
        state.nearbyEmergencies = action.payload;
      });
  },
});

export const {
  setActiveAlert,
  clearActiveAlert,
  addEmergencyAlert,
  updateEmergencyStatus,
  clearError,
  resetEmergencies,
} = emergencySlice.actions;

// Selectors
export const selectMyEmergencies = (state) => state.emergency.myEmergencies;
export const selectNearbyEmergencies = (state) => state.emergency.nearbyEmergencies;
export const selectActiveAlert = (state) => state.emergency.activeAlert;
export const selectEmergencyLoading = (state) => state.emergency.loading;
export const selectEmergencyError = (state) => state.emergency.error;

export default emergencySlice.reducer;
