import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { logger } from "@shared/utils/logger";
// Note: Use runtime requires so Jest tests with jest.resetModules can still mock these services

// Async thunk for secure login
export const secureLogin = createAsyncThunk(
  "auth/secureLogin",
  async (payload: any, { rejectWithValue }) => {
    try {
      const { email, password, rememberMe = false } = payload || {};
      // Input validation
      if (!email || !password) {
        throw new Error("Email and password are required");
      }

      // Real API call using the actual API service
  const apiService = require("../../services/api").default;
  const response = await apiService.auth.login(email, password);

      // Validate response
      if (!response?.user) {
        throw new Error("Invalid API response");
      }

      // Store user data securely
      const secureStorage = require("../../services/secureStorage").default;
      await secureStorage.storeSecureData("user_profile", response.user, {
        dataType: "user_profile",
      });

      return {
        user: response.user,
        token: response.access_token,
      };
    } catch (error: any) {
      logger.error("Login error:", error);
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
      const tokenService = require("../../services/tokenService").default;
      const secureStorage = require("../../services/secureStorage").default;
      // Clear tokens securely
  await tokenService.clearTokens();

      // Clear all secure user data
  await secureStorage.removeSecureData("user_profile");

      // Invalidate session
  await tokenService.invalidateSession();

      return {};
    } catch (error) {
      const message = (error as any)?.message || 'Logout failed';
      return rejectWithValue(message);
    }
  },
);

// Async thunk to restore authentication state with timeout
export const restoreAuthState = createAsyncThunk(
  "auth/restoreAuthState",
  async (_, { rejectWithValue }) => {
    try {
      logger.debug(
        "restoreAuthState: Starting authentication state restoration...",
      );

      // Add timeout to prevent hanging
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('Auth restoration timeout')), 5000);
      });

      const authCheckPromise = async () => {
        const tokenService = require("../../services/tokenService").default;
        const secureStorage = require("../../services/secureStorage").default;
        // Check if user is authenticated
  const isAuthenticated = await tokenService.isAuthenticated();
        logger.debug("restoreAuthState: isAuthenticated =", isAuthenticated);

        if (!isAuthenticated) {
          logger.debug(
            "restoreAuthState: User not authenticated, returning false",
          );
          return { isAuthenticated: false };
        }

        // Get tokens
  const tokens = await tokenService.getTokens();
        logger.debug("restoreAuthState: Tokens retrieved =", !!tokens);

        // Get user data
  const user = await secureStorage.getSecureData("user_profile");
        logger.debug("restoreAuthState: User data retrieved =", !!user);

        if (!tokens || !user) {
          // Clear inconsistent state
          logger.debug(
            "restoreAuthState: Missing tokens or user data, clearing state",
          );
          await tokenService.clearTokens();
          return { isAuthenticated: false };
        }

        logger.debug(
          "restoreAuthState: Authentication state restored successfully",
        );
        return {
          isAuthenticated: true,
          user,
          token: tokens.accessToken,
        };
      };

      // Race between auth check and timeout
      return await Promise.race([authCheckPromise(), timeoutPromise]);

    } catch (error) {
      logger.error("restoreAuthState: Error during restoration:", error);
      // Clear potentially corrupted state
      try {
        const tokenService = require("../../services/tokenService").default;
        await tokenService.clearTokens();
      } catch (clearError) {
        logger.warn("Failed to clear tokens:", clearError);
      }
      // Always return a valid state instead of rejecting
      return { isAuthenticated: false };
    }
  },
);

interface AuthState {
  isAuthenticated: boolean;
  user: any;
  token: string | null;
  isLoading: boolean;
  error: string | null;
  onboardingCompleted: boolean;
  sessionExpiry: number | null;
  lastActivity: number;
  authChecked: boolean;
  initializationComplete: boolean;
}

const initialState: AuthState = {
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
      state.user = { ...(state.user || {}), ...action.payload } as any;
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
        state.user = (action.payload as any).user;
        state.token = (action.payload as any).token;
        state.error = null;
        state.lastActivity = Date.now();
        state.sessionExpiry = (Date.now() + 3600 * 1000) as any; // 1 hour
      })
      .addCase(secureLogin.rejected, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = false;
        state.user = null;
        state.token = null;
        state.error = (action.payload as any) ?? 'Login failed';
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
        state.error = (action.payload as any) ?? 'Logout failed';
        // Still clear auth state even if logout fails
        state.isAuthenticated = false;
        state.user = null;
        state.token = null;
      })

      // Restore auth state cases
      .addCase(restoreAuthState.pending, (state) => {
        logger.debug("restoreAuthState.pending: Setting isLoading = true");
        state.isLoading = true;
      })
      .addCase(restoreAuthState.fulfilled, (state, action) => {
        logger.debug(
          "restoreAuthState.fulfilled: Auth state restored, setting authChecked = true",
        );
        logger.debug(
          "restoreAuthState.fulfilled: isAuthenticated =",
          (action.payload as any).isAuthenticated,
        );
        state.isLoading = false;
        state.authChecked = true;
        if ((action.payload as any).isAuthenticated) {
          state.isAuthenticated = true;
          state.user = (action.payload as any).user;
          state.token = (action.payload as any).token;
          state.lastActivity = Date.now();
        } else {
          state.isAuthenticated = false;
          state.user = null;
          state.token = null;
        }
      })
      .addCase(restoreAuthState.rejected, (state) => {
        logger.debug(
          "restoreAuthState.rejected: Auth restoration failed, setting authChecked = true",
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
