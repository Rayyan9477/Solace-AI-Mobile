import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { logger } from "@shared/utils/logger";

import apiService from "../../services/api";
import secureStorage from "../../services/secureStorage";
import tokenService from "../../services/tokenService";

// Type safety fix: Define proper interfaces for auth operations
interface User {
  id: string;
  email: string;
  name?: string;
  avatar?: string;
  [key: string]: unknown; // Allow additional properties from API
}

interface LoginPayload {
  email: string;
  password: string;
  rememberMe?: boolean;
}

interface LoginResult {
  user: User;
  token: string;
}

interface RestoreAuthResult {
  isAuthenticated: boolean;
  user?: User;
  token?: string;
}

/**
 * Type guard to extract error message from unknown error
 */
function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }
  if (typeof error === 'object' && error !== null && 'message' in error) {
    return String((error as { message: unknown }).message);
  }
  if (typeof error === 'string') {
    return error;
  }
  return 'An unknown error occurred';
}

/**
 * Type guard to extract API error message
 */
function getApiErrorMessage(error: unknown, defaultMsg: string): string {
  if (typeof error === 'object' && error !== null) {
    const err = error as Record<string, unknown>;
    if (err.response && typeof err.response === 'object') {
      const response = err.response as Record<string, unknown>;
      if (response.data && typeof response.data === 'object') {
        const data = response.data as Record<string, unknown>;
        if (typeof data.message === 'string') {
          return data.message;
        }
      }
    }
    if (err.message && typeof err.message === 'string') {
      return err.message;
    }
  }
  return defaultMsg;
}

export const secureLogin = createAsyncThunk<LoginResult, LoginPayload, { rejectValue: string }>(
  "auth/secureLogin",
  async (payload, { rejectWithValue }) => {
    try {
      const { email, password, rememberMe = false } = payload || {};
      if (!email || !password) {
        throw new Error("Email and password are required");
      }

      const response = await apiService.auth.login(email, password);

      if (!response?.user) {
        throw new Error("Invalid API response");
      }

      await secureStorage.storeSecureData("user_profile", response.user, {
        dataType: "user_profile",
      });

      return {
        user: response.user as User,
        token: response.access_token,
      };
    } catch (error: unknown) {
      logger.error("Login error:", error);
      return rejectWithValue(
        getApiErrorMessage(error, "Login failed. Please try again."),
      );
    }
  },
);

export const secureLogout = createAsyncThunk<Record<string, never>, void, { rejectValue: string }>(
  "auth/secureLogout",
  async (_, { rejectWithValue }) => {
    try {
      await tokenService.clearTokens();
      await secureStorage.removeSecureData("user_profile");
      await tokenService.invalidateSession();

      return {};
    } catch (error: unknown) {
      const message = getErrorMessage(error) || "Logout failed";
      return rejectWithValue(message);
    }
  },
);

// Async thunk to restore authentication state with timeout
export const restoreAuthState = createAsyncThunk<RestoreAuthResult, void, { rejectValue: string }>(
  "auth/restoreAuthState",
  async (_) => {
    try {
      logger.debug(
        "restoreAuthState: Starting authentication state restoration...",
      );

      // Add timeout to prevent hanging
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error("Auth restoration timeout")), 5000);
      });

      const authCheckPromise = async () => {
        const isAuthenticated = await tokenService.isAuthenticated();
        logger.debug("restoreAuthState: isAuthenticated =", isAuthenticated);

        if (!isAuthenticated) {
          logger.debug(
            "restoreAuthState: User not authenticated, returning false",
          );
          return { isAuthenticated: false };
        }

        const tokens = await tokenService.getTokens();
        logger.debug("restoreAuthState: Tokens retrieved =", !!tokens);

        const user = await secureStorage.getSecureData("user_profile");
        logger.debug("restoreAuthState: User data retrieved =", !!user);

        if (!tokens || !user) {
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
          user: user as User,
          token: tokens.accessToken,
        };
      };

      return await Promise.race([authCheckPromise(), timeoutPromise]) as RestoreAuthResult;
    } catch (error) {
      logger.error("restoreAuthState: Error during restoration:", error);
      try {
        await tokenService.clearTokens();
      } catch (clearError) {
        logger.warn("Failed to clear tokens:", clearError);
      }
      return { isAuthenticated: false };
    }
  },
);

interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
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
    updateUser: (state, action: PayloadAction<Partial<User>>) => {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
      } else {
        state.user = action.payload as User;
      }
    },
    updateLastActivity: (state) => {
      state.lastActivity = Date.now();
    },
    setSessionExpiry: (state, action: PayloadAction<number | null>) => {
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
        state.error = action.payload ?? "Login failed";
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
        state.error = action.payload ?? "Logout failed";
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
          action.payload.isAuthenticated,
        );
        state.isLoading = false;
        state.authChecked = true;
        if (action.payload.isAuthenticated && action.payload.user) {
          state.isAuthenticated = true;
          state.user = action.payload.user;
          state.token = action.payload.token ?? null;
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
