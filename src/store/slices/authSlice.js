import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isAuthenticated: true, // Set to true for development/testing - bypasses login
  user: null,
  token: null,
  isLoading: false,
  error: null,
  onboardingCompleted: true, // Set to true for development/testing - allows direct access to main app
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loginStart: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    loginSuccess: (state, action) => {
      state.isLoading = false;
      state.isAuthenticated = true;
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.error = null;
    },
    loginFailure: (state, action) => {
      state.isLoading = false;
      state.isAuthenticated = false;
      state.error = action.payload;
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.user = null;
      state.token = null;
      state.error = null;
    },
    clearError: (state) => {
      state.error = null;
    },
    completeOnboarding: (state) => {
      state.onboardingCompleted = true;
    },
    updateUser: (state, action) => {
      state.user = { ...state.user, ...action.payload };
    },
  },
});

export const {
  loginStart,
  loginSuccess,
  loginFailure,
  logout,
  clearError,
  completeOnboarding,
  updateUser,
} = authSlice.actions;

export default authSlice.reducer;
