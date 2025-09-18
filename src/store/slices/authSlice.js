import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// Mock services for development
const mockApiService = {
  auth: {
    async login(email, password) {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (email && password) {
        return {
          user: { id: '1', name: 'Test User', email },
          access_token: 'mock_token_123',
        };
      }
      throw new Error('Invalid credentials');
    }
  }
};

const mockSecureStorage = {
  async storeSecureData(key, data) {
    console.log(`Storing secure data for key: ${key}`);
    return true;
  },
  async getSecureData(key) {
    console.log(`Getting secure data for key: ${key}`);
    if (key === 'user_profile') {
      return { id: '1', name: 'Test User', email: 'test@example.com' };
    }
    return null;
  },
  async removeSecureData(key) {
    console.log(`Removing secure data for key: ${key}`);
    return true;
  },
};

const mockTokenService = {
  async isAuthenticated() {
    return false; // Start as not authenticated for proper flow
  },
  async getTokens() {
    return null; // Start with no tokens
  },
  async clearTokens() {
    console.log('Clearing tokens');
    return true;
  },
  async invalidateSession() {
    console.log('Invalidating session');
    return true;
  },
};

// Use actual services in production, mock in development
const apiService = __DEV__ ? mockApiService : require("../../services/api").default;
const secureStorage = __DEV__ ? mockSecureStorage : require("../../services/secureStorage").default;
const tokenService = __DEV__ ? mockTokenService : require("../../services/tokenService").default;

// Async thunk for secure login
export const secureLogin = createAsyncThunk(
  "auth/secureLogin",
  async ({ email, password, rememberMe = false }, { rejectWithValue }) => {
    try {
      // Input validation
      if (!email || !password) {
        throw new Error("Email and password are required");
      }

      // Real API call using the actual API service
      const response = await apiService.auth.login(email, password);

      // Store user data securely
      await secureStorage.storeSecureData("user_profile", response.user, {
        dataType: "user_profile",
      });

      return {
        user: response.user,
        token: response.access_token,
      };
    } catch (error) {
      console.error("Login error:", error);
      return rejectWithValue(
        error.response?.data?.message ||
          error.message ||
          "Login failed. Please try again.",
      );
    }
  },
);

// Async thunk for secure logout
export const secureLogout = createAsyncThunk(
  "auth/secureLogout",
  async (_, { rejectWithValue }) => {
    try {
      // Clear tokens securely
      await tokenService.clearTokens();

      // Clear all secure user data
      await secureStorage.removeSecureData("user_profile");

      // Invalidate session
      await tokenService.invalidateSession();

      return {};
    } catch (error) {
      return rejectWithValue(error.message);
    }
  },
);

// Async thunk to restore authentication state
export const restoreAuthState = createAsyncThunk(
  "auth/restoreAuthState",
  async (_, { rejectWithValue }) => {
    try {
      console.log(
        "≡ƒöä restoreAuthState: Starting authentication state restoration...",
      );
      // Check if user is authenticated
      const isAuthenticated = await tokenService.isAuthenticated();
      console.log("≡ƒöä restoreAuthState: isAuthenticated =", isAuthenticated);

      if (!isAuthenticated) {
        console.log(
          "≡ƒöä restoreAuthState: User not authenticated, returning false",
        );
        return { isAuthenticated: false };
      }

      // Get tokens
      const tokens = await tokenService.getTokens();
      console.log("≡ƒöä restoreAuthState: Tokens retrieved =", !!tokens);

      // Get user data
      const user = await secureStorage.getSecureData("user_profile");
      console.log("≡ƒöä restoreAuthState: User data retrieved =", !!user);

      if (!tokens || !user) {
        // Clear inconsistent state
        console.log(
          "≡ƒöä restoreAuthState: Missing tokens or user data, clearing state",
        );
        await tokenService.clearTokens();
        return { isAuthenticated: false };
      }

      console.log(
        "≡ƒöä restoreAuthState: Authentication state restored successfully",
      );
      return {
        isAuthenticated: true,
        user,
        token: tokens.accessToken,
      };
    } catch (error) {
      console.error("≡ƒöä restoreAuthState: Error during restoration:", error);
      // Clear potentially corrupted state
      await tokenService.clearTokens();
      return { isAuthenticated: false };
    }
  },
);

const initialState = {
  isAuthenticated: false, // Start with false for proper auth flow
  user: null,
  token: null,
  isLoading: false,
  error: null,
  onboardingCompleted: false, // Start with false for proper onboarding flow
  sessionExpiry: null,
  lastActivity: Date.now(),
  // Add fallback properties to prevent undefined errors
  authChecked: false,
  initializationComplete: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    completeOnboarding: (state) => {
      state.onboardingCompleted = true;
    },
    updateUser: (state, action) => {
      state.user = { ...state.user, ...action.payload };
    },
    updateLastActivity: (state) => {
      state.lastActivity = Date.now();
    },
    setSessionExpiry: (state, action) => {
      state.sessionExpiry = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Secure login cases
      .addCase(secureLogin.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(secureLogin.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.error = null;
        state.lastActivity = Date.now();
        state.sessionExpiry = Date.now() + 3600 * 1000; // 1 hour
      })
      .addCase(secureLogin.rejected, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = false;
        state.user = null;
        state.token = null;
        state.error = action.payload;
      })

      // Secure logout cases
      .addCase(secureLogout.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(secureLogout.fulfilled, (state) => {
        return { ...initialState }; // Reset to initial state
      })
      .addCase(secureLogout.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
        // Still clear auth state even if logout fails
        state.isAuthenticated = false;
        state.user = null;
        state.token = null;
      })

      // Restore auth state cases
      .addCase(restoreAuthState.pending, (state) => {
        console.log("≡ƒöä restoreAuthState.pending: Setting isLoading = true");
        state.isLoading = true;
      })
      .addCase(restoreAuthState.fulfilled, (state, action) => {
        console.log(
          "≡ƒöä restoreAuthState.fulfilled: Auth state restored, setting authChecked = true",
        );
        console.log(
          "≡ƒöä restoreAuthState.fulfilled: isAuthenticated =",
          action.payload.isAuthenticated,
        );
        state.isLoading = false;
        state.authChecked = true;
        if (action.payload.isAuthenticated) {
          state.isAuthenticated = true;
          state.user = action.payload.user;
          state.token = action.payload.token;
          state.lastActivity = Date.now();
        } else {
          state.isAuthenticated = false;
          state.user = null;
          state.token = null;
        }
      })
      .addCase(restoreAuthState.rejected, (state) => {
        console.log(
          "≡ƒöä restoreAuthState.rejected: Auth restoration failed, setting authChecked = true",
        );
        state.isLoading = false;
        state.authChecked = true;
        state.isAuthenticated = false;
        state.user = null;
        state.token = null;
      });
  },
});

export const {
  clearError,
  completeOnboarding,
  updateUser,
  updateLastActivity,
  setSessionExpiry,
} = authSlice.actions;

export default authSlice.reducer;
