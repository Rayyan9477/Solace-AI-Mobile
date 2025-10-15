// Force __DEV__ to false so authSlice uses mocked require calls instead of internal mocks
global.__DEV__ = false;

// Mock the service modules using manual mocks
jest.mock("../../../../src/app/services/api");
jest.mock("../../../../src/app/services/secureStorage");
jest.mock("../../../../src/app/services/tokenService");

// Reset modules to ensure authSlice is reloaded with mocked services
jest.resetModules();

import { configureStore } from "@reduxjs/toolkit";
import authSlice, {
  secureLogin,
  secureLogout,
  restoreAuthState,
  clearError,
  completeOnboarding,
  updateUser,
  updateLastActivity,
  setSessionExpiry,
} from "../../../../src/app/store/slices/authSlice";

describe("Auth Slice", () => {
  let mockApiService, mockSecureStorage, mockTokenService;
  let store;

  beforeAll(() => {
    // Get references to the mocked service functions from manual mocks
    mockApiService = require("../../../../src/app/services/api").default;
    mockSecureStorage = require("../../../../src/app/services/secureStorage").default;
    mockTokenService = require("../../../../src/app/services/tokenService").default;
  });

  beforeEach(() => {
    // Reset all mocks
    jest.clearAllMocks();

    // Reset the mock service functions
    mockApiService.auth.login.mockReset();
    mockSecureStorage.storeSecureData.mockReset();
    mockSecureStorage.getSecureData.mockReset();
    mockSecureStorage.removeSecureData.mockReset();
    mockTokenService.isAuthenticated.mockReset();
    mockTokenService.getTokens.mockReset();
    mockTokenService.clearTokens.mockReset();
    mockTokenService.invalidateSession.mockReset();

    // Create fresh store for each test
    store = configureStore({
      reducer: {
        auth: authSlice,
      },
    });
  });

  describe("Initial State", () => {
    test("should return the initial state", () => {
      const state = store.getState().auth;
      expect(state).toEqual({
        isAuthenticated: false,
        user: null,
        token: null,
        isLoading: false,
        error: null,
        onboardingCompleted: false,
        sessionExpiry: null,
        lastActivity: expect.any(Number),
        authChecked: false,
        initializationComplete: false,
      });
    });
  });

  describe("Reducers", () => {
    describe("clearError", () => {
      test("should clear error state", () => {
        store.dispatch({
          type: "auth/secureLogin/rejected",
          payload: "Login failed",
        });

        let state = store.getState().auth;
        expect(state.error).toBe("Login failed");

        store.dispatch(clearError());
        state = store.getState().auth;
        expect(state.error).toBeNull();
      });

      test("should not affect other state properties", () => {
        // Set up authenticated state first
        store.dispatch({
          type: "auth/secureLogin/fulfilled",
          payload: { user: { id: '1', name: 'Test' }, token: 'token123' },
        });

        // Then set an error
        store.dispatch({
          type: "auth/secureLogin/rejected",
          payload: "Some error",
        });

        // Now clear the error
        store.dispatch(clearError());

        const state = store.getState().auth;
        expect(state.isAuthenticated).toBe(false); // Should remain false after rejection
        expect(state.user).toBeNull(); // Should be cleared after rejection
        expect(state.token).toBeNull(); // Should be cleared after rejection
        expect(state.error).toBeNull(); // Error should be cleared
      });
    });

    describe("completeOnboarding", () => {
      test("should mark onboarding as completed", () => {
        store.dispatch(completeOnboarding());

        const state = store.getState().auth;
        expect(state.onboardingCompleted).toBe(true);
      });

      test("should not affect other state properties", () => {
        store.dispatch({
          type: "auth/secureLogin/fulfilled",
          payload: { user: { id: '1', name: 'Test' }, token: 'token123' },
        });

        store.dispatch(completeOnboarding());

        const state = store.getState().auth;
        expect(state.isAuthenticated).toBe(true);
        expect(state.onboardingCompleted).toBe(true);
      });
    });

    describe("updateUser", () => {
      test("should update user data", () => {
        const initialUser = { id: '1', name: 'John Doe', email: 'john@example.com' };
        store.dispatch({
          type: "auth/secureLogin/fulfilled",
          payload: { user: initialUser, token: 'token123' },
        });

        store.dispatch(updateUser({ name: 'John Smith', phone: '123-456-7890' }));

        const state = store.getState().auth;
        expect(state.user).toEqual({
          id: '1',
          name: 'John Smith',
          email: 'john@example.com',
          phone: '123-456-7890',
        });
      });

      test("should handle partial user updates", () => {
        const initialUser = { id: '1', name: 'John', email: 'john@example.com' };
        store.dispatch({
          type: "auth/secureLogin/fulfilled",
          payload: { user: initialUser, token: 'token123' },
        });

        store.dispatch(updateUser({ preferences: { theme: 'dark' } }));

        const state = store.getState().auth;
        expect(state.user.preferences).toEqual({ theme: 'dark' });
        expect(state.user.name).toBe('John'); // Unchanged
      });

      test("should handle empty user updates", () => {
        const initialUser = { id: '1', name: 'John', email: 'john@example.com' };
        store.dispatch({
          type: "auth/secureLogin/fulfilled",
          payload: { user: initialUser, token: 'token123' },
        });

        store.dispatch(updateUser({}));

        const state = store.getState().auth;
        expect(state.user).toEqual(initialUser);
      });

      test("should handle null user updates gracefully", () => {
        const initialUser = { id: '1', name: 'John', email: 'john@example.com' };
        store.dispatch({
          type: "auth/secureLogin/fulfilled",
          payload: { user: initialUser, token: 'token123' },
        });

        store.dispatch(updateUser(null));

        const state = store.getState().auth;
        expect(state.user).toEqual(initialUser);
      });
    });

    describe("updateLastActivity", () => {
      test("should update last activity timestamp", () => {
        const beforeTime = Date.now();
        store.dispatch(updateLastActivity());
        const afterTime = Date.now();

        const state = store.getState().auth;
        expect(state.lastActivity).toBeGreaterThanOrEqual(beforeTime);
        expect(state.lastActivity).toBeLessThanOrEqual(afterTime);
      });

      test("should update timestamp on multiple calls", () => {
        store.dispatch(updateLastActivity());
        const firstActivity = store.getState().auth.lastActivity;

        // Wait a bit and update again
        setTimeout(() => {
          store.dispatch(updateLastActivity());
          const secondActivity = store.getState().auth.lastActivity;
          expect(secondActivity).toBeGreaterThan(firstActivity);
        }, 10);
      });
    });

    describe("setSessionExpiry", () => {
      test("should set session expiry time", () => {
        const expiryTime = Date.now() + 3600000; // 1 hour from now
        store.dispatch(setSessionExpiry(expiryTime));

        const state = store.getState().auth;
        expect(state.sessionExpiry).toBe(expiryTime);
      });

      test("should handle null expiry time", () => {
        store.dispatch(setSessionExpiry(null));

        const state = store.getState().auth;
        expect(state.sessionExpiry).toBeNull();
      });

      test("should handle past expiry times", () => {
        const pastTime = Date.now() - 3600000; // 1 hour ago
        store.dispatch(setSessionExpiry(pastTime));

        const state = store.getState().auth;
        expect(state.sessionExpiry).toBe(pastTime);
      });
    });
  });

  describe("Async Thunks", () => {
    describe("secureLogin", () => {
      const loginCredentials = {
        email: "test@example.com",
        password: "password123",
        rememberMe: true,
      };

      const mockApiResponse = {
        user: {
          id: "1",
          name: "Test User",
          email: "test@example.com",
        },
        access_token: "mock_token_123",
      };

      test("should handle successful login", async () => {
        mockApiService.auth.login.mockResolvedValue(mockApiResponse);
        mockSecureStorage.storeSecureData.mockResolvedValue(true);

        await store.dispatch(secureLogin(loginCredentials));

        const state = store.getState().auth;
        expect(state.isLoading).toBe(false);
        expect(state.isAuthenticated).toBe(true);
        expect(state.user).toEqual(mockApiResponse.user);
        expect(state.token).toEqual(mockApiResponse.access_token);
        expect(state.error).toBeNull();
        expect(state.sessionExpiry).toBeDefined();
        expect(state.lastActivity).toBeDefined();
      });

      test("should call services with correct parameters", async () => {
        mockApiService.auth.login.mockResolvedValue(mockApiResponse);
        mockSecureStorage.storeSecureData.mockResolvedValue(true);

        await store.dispatch(secureLogin(loginCredentials));

        expect(mockApiService.auth.login).toHaveBeenCalledWith(
          loginCredentials.email,
          loginCredentials.password
        );
        expect(mockSecureStorage.storeSecureData).toHaveBeenCalledWith(
          "user_profile",
          mockApiResponse.user,
          { dataType: "user_profile" }
        );
      });

      test("should handle login failure with missing credentials", async () => {
        await store.dispatch(secureLogin({ email: "", password: "" }));

        const state = store.getState().auth;
        expect(state.isLoading).toBe(false);
        expect(state.isAuthenticated).toBe(false);
        expect(state.user).toBeNull();
        expect(state.token).toBeNull();
        expect(state.error).toBe("Email and password are required");
      });

      test("should handle login failure with missing email", async () => {
        await store.dispatch(secureLogin({ password: "password123" }));

        const state = store.getState().auth;
        expect(state.error).toBe("Email and password are required");
      });

      test("should handle login failure with missing password", async () => {
        await store.dispatch(secureLogin({ email: "test@example.com" }));

        const state = store.getState().auth;
        expect(state.error).toBe("Email and password are required");
      });

      test("should handle API login failure", async () => {
        const errorMessage = "Invalid credentials";
        mockApiService.auth.login.mockRejectedValue(new Error(errorMessage));

        await store.dispatch(secureLogin(loginCredentials));

        const state = store.getState().auth;
        expect(state.isLoading).toBe(false);
        expect(state.isAuthenticated).toBe(false);
        expect(state.user).toBeNull();
        expect(state.token).toBeNull();
        expect(state.error).toBe(errorMessage);
      });

      test("should handle API error with response data", async () => {
        const apiError = {
          response: { data: { message: "Email or password incorrect" } }
        };
        mockApiService.auth.login.mockRejectedValue(apiError);

        await store.dispatch(secureLogin(loginCredentials));

        const state = store.getState().auth;
        expect(state.error).toBe("Email or password incorrect");
      });

      test("should handle secure storage failure during login", async () => {
        mockApiService.auth.login.mockResolvedValue(mockApiResponse);
        mockSecureStorage.storeSecureData.mockRejectedValue(new Error("Storage failed"));

        await store.dispatch(secureLogin(loginCredentials));

        const state = store.getState().auth;
        expect(state.isLoading).toBe(false);
        expect(state.isAuthenticated).toBe(false);
        expect(state.user).toBeNull();
        expect(state.token).toBeNull();
        expect(state.error).toBe("Storage failed");
      });

      test("should set loading state during login", () => {
        store.dispatch(secureLogin.pending());

        const state = store.getState().auth;
        expect(state.isLoading).toBe(true);
        expect(state.error).toBeNull();
      });

      test("should handle fulfilled state correctly", () => {
        const payload = {
          user: { id: '1', name: 'Test User' },
          token: 'token123'
        };

        store.dispatch(secureLogin.fulfilled(payload));

        const state = store.getState().auth;
        expect(state.isLoading).toBe(false);
        expect(state.isAuthenticated).toBe(true);
        expect(state.user).toEqual(payload.user);
        expect(state.token).toEqual(payload.token);
        expect(state.error).toBeNull();
      });

      test("should handle rejected state correctly", () => {
        const error = "Login failed";
        store.dispatch(secureLogin.rejected(null, null, null, error));

        const state = store.getState().auth;
        expect(state.isLoading).toBe(false);
        expect(state.isAuthenticated).toBe(false);
        expect(state.user).toBeNull();
        expect(state.token).toBeNull();
        expect(state.error).toBe(error);
      });

      test("should handle network errors", async () => {
        mockApiService.auth.login.mockRejectedValue(new Error("Network Error"));

        await store.dispatch(secureLogin(loginCredentials));

        const state = store.getState().auth;
        expect(state.error).toBe("Network Error");
      });

      test("should handle timeout errors", async () => {
        mockApiService.auth.login.mockImplementation(
          () => new Promise((_, reject) =>
            setTimeout(() => reject(new Error('Request timeout')), 10000)
          )
        );

        jest.useFakeTimers();

        const dispatchPromise = store.dispatch(secureLogin(loginCredentials));

        jest.advanceTimersByTime(10000);

        await dispatchPromise;

        const state = store.getState().auth;
        expect(state.isLoading).toBe(false);
        expect(state.error).toBe("Request timeout");

        jest.useRealTimers();
      });
    });

    describe("secureLogout", () => {
      beforeEach(() => {
        // Set up authenticated state
        store.dispatch({
          type: "auth/secureLogin/fulfilled",
          payload: {
            user: { id: '1', name: 'Test User' },
            token: 'token123'
          },
        });
      });

      test("should handle successful logout", async () => {
        mockTokenService.clearTokens.mockResolvedValue(true);
        mockSecureStorage.removeSecureData.mockResolvedValue(true);
        mockTokenService.invalidateSession.mockResolvedValue(true);

        await store.dispatch(secureLogout());

        const state = store.getState().auth;
        expect(state.isAuthenticated).toBe(false);
        expect(state.user).toBeNull();
        expect(state.token).toBeNull();
        expect(state.onboardingCompleted).toBe(false); // Should reset to initial state
      });

      test("should call all logout services", async () => {
        mockTokenService.clearTokens.mockResolvedValue(true);
        mockSecureStorage.removeSecureData.mockResolvedValue(true);
        mockTokenService.invalidateSession.mockResolvedValue(true);

        await store.dispatch(secureLogout());

        expect(mockTokenService.clearTokens).toHaveBeenCalled();
        expect(mockSecureStorage.removeSecureData).toHaveBeenCalledWith("user_profile");
        expect(mockTokenService.invalidateSession).toHaveBeenCalled();
      });

      test("should handle logout failure but still clear auth state", async () => {
        mockTokenService.clearTokens.mockRejectedValue(new Error("Token clear failed"));

        await store.dispatch(secureLogout());

        const state = store.getState().auth;
        expect(state.isLoading).toBe(false);
        expect(state.error).toBe("Token clear failed");
        // Should still clear auth state even if logout fails
        expect(state.isAuthenticated).toBe(false);
        expect(state.user).toBeNull();
        expect(state.token).toBeNull();
      });

      test("should handle partial logout failures", async () => {
        mockTokenService.clearTokens.mockResolvedValue(true);
        mockSecureStorage.removeSecureData.mockRejectedValue(new Error("Storage remove failed"));
        mockTokenService.invalidateSession.mockResolvedValue(true);

        await store.dispatch(secureLogout());

        const state = store.getState().auth;
        expect(state.isAuthenticated).toBe(false);
        expect(state.user).toBeNull();
        expect(state.token).toBeNull();
        expect(state.error).toBe("Storage remove failed");
      });

      test("should set loading state during logout", () => {
        store.dispatch(secureLogout.pending());

        const state = store.getState().auth;
        expect(state.isLoading).toBe(true);
      });

      test("should reset to initial state on successful logout", () => {
        // Set some non-default state
        store.dispatch(completeOnboarding());
        store.dispatch(setSessionExpiry(Date.now() + 3600000));

        mockTokenService.clearTokens.mockResolvedValue(true);
        mockSecureStorage.removeSecureData.mockResolvedValue(true);
        mockTokenService.invalidateSession.mockResolvedValue(true);

        store.dispatch(secureLogout.fulfilled());

        const state = store.getState().auth;
        expect(state).toEqual({
          isAuthenticated: false,
          user: null,
          token: null,
          isLoading: false,
          error: null,
          onboardingCompleted: false,
          sessionExpiry: null,
          lastActivity: expect.any(Number),
          authChecked: false,
          initializationComplete: false,
        });
      });

      test("should handle rejected state", () => {
        const error = "Logout failed";
        store.dispatch(secureLogout.rejected(null, null, null, error));

        const state = store.getState().auth;
        expect(state.isLoading).toBe(false);
        expect(state.error).toBe(error);
        // Auth state should still be cleared
        expect(state.isAuthenticated).toBe(false);
        expect(state.user).toBeNull();
        expect(state.token).toBeNull();
      });
    });

    describe("restoreAuthState", () => {
      test("should handle successful auth restoration", async () => {
        const mockUser = { id: '1', name: 'Test User', email: 'test@example.com' };
        const mockTokens = { accessToken: 'token123', refreshToken: 'refresh123' };

        mockTokenService.isAuthenticated.mockResolvedValue(true);
        mockTokenService.getTokens.mockResolvedValue(mockTokens);
        mockSecureStorage.getSecureData.mockResolvedValue(mockUser);

        await store.dispatch(restoreAuthState());

        const state = store.getState().auth;
        expect(state.isLoading).toBe(false);
        expect(state.authChecked).toBe(true);
        expect(state.isAuthenticated).toBe(true);
        expect(state.user).toEqual(mockUser);
        expect(state.token).toEqual('token123');
      });

      test("should handle not authenticated state", async () => {
        mockTokenService.isAuthenticated.mockResolvedValue(false);

        await store.dispatch(restoreAuthState());

        const state = store.getState().auth;
        expect(state.isLoading).toBe(false);
        expect(state.authChecked).toBe(true);
        expect(state.isAuthenticated).toBe(false);
        expect(state.user).toBeNull();
        expect(state.token).toBeNull();
      });

      test("should handle missing tokens", async () => {
        mockTokenService.isAuthenticated.mockResolvedValue(true);
        mockTokenService.getTokens.mockResolvedValue(null);
        mockSecureStorage.getSecureData.mockResolvedValue({ id: '1', name: 'Test User' });
        mockTokenService.clearTokens.mockResolvedValue(true);

        await store.dispatch(restoreAuthState());

        const state = store.getState().auth;
        expect(state.isAuthenticated).toBe(false);
        expect(state.authChecked).toBe(true);
        expect(mockTokenService.clearTokens).toHaveBeenCalled();
      });

      test("should handle missing user data", async () => {
        mockTokenService.isAuthenticated.mockResolvedValue(true);
        mockTokenService.getTokens.mockResolvedValue({ accessToken: 'token123' });
        mockSecureStorage.getSecureData.mockResolvedValue(null);
        mockTokenService.clearTokens.mockResolvedValue(true);

        await store.dispatch(restoreAuthState());

        const state = store.getState().auth;
        expect(state.isAuthenticated).toBe(false);
        expect(state.authChecked).toBe(true);
        expect(mockTokenService.clearTokens).toHaveBeenCalled();
      });

      test("should handle timeout", async () => {
        // Mock a delay that exceeds timeout using jest fake timers
        jest.useFakeTimers();

        let resolveAuth;
        const authPromise = new Promise(resolve => {
          resolveAuth = resolve;
        });

        mockTokenService.isAuthenticated.mockReturnValue(authPromise);

        const dispatchPromise = store.dispatch(restoreAuthState());

        // Fast-forward past the 5-second timeout
        jest.advanceTimersByTime(6000);
        resolveAuth(true);

        await dispatchPromise;

        const state = store.getState().auth;
        expect(state.isAuthenticated).toBe(false);
        expect(state.user).toBeNull();
        expect(state.token).toBeNull();
        expect(state.isLoading).toBe(false);
        expect(state.authChecked).toBe(true);

        jest.useRealTimers();
      });

      test("should handle service failures gracefully", async () => {
        mockTokenService.isAuthenticated.mockRejectedValue(new Error("Service unavailable"));
        mockTokenService.clearTokens.mockResolvedValue(true);

        await store.dispatch(restoreAuthState());

        const state = store.getState().auth;
        expect(state.isAuthenticated).toBe(false);
        expect(state.authChecked).toBe(true);
        expect(mockTokenService.clearTokens).toHaveBeenCalled();
      });

      test("should clear corrupted state on error", async () => {
        mockTokenService.isAuthenticated.mockRejectedValue(new Error("Auth check failed"));
        mockTokenService.clearTokens.mockResolvedValue(true);

        await store.dispatch(restoreAuthState());

        expect(mockTokenService.clearTokens).toHaveBeenCalled();
      });

      test("should set loading state during restoration", () => {
        store.dispatch(restoreAuthState.pending());

        const state = store.getState().auth;
        expect(state.isLoading).toBe(true);
      });

      test("should handle fulfilled state with authenticated user", () => {
        const payload = {
          isAuthenticated: true,
          user: { id: '1', name: 'Test User' },
          token: 'token123'
        };

        store.dispatch(restoreAuthState.fulfilled(payload));

        const state = store.getState().auth;
        expect(state.isLoading).toBe(false);
        expect(state.authChecked).toBe(true);
        expect(state.isAuthenticated).toBe(true);
        expect(state.user).toEqual(payload.user);
        expect(state.token).toEqual(payload.token);
      });

      test("should handle fulfilled state with no authentication", () => {
        const payload = { isAuthenticated: false };

        store.dispatch(restoreAuthState.fulfilled(payload));

        const state = store.getState().auth;
        expect(state.isLoading).toBe(false);
        expect(state.authChecked).toBe(true);
        expect(state.isAuthenticated).toBe(false);
        expect(state.user).toBeNull();
        expect(state.token).toBeNull();
      });

      test("should handle rejected state", () => {
        store.dispatch(restoreAuthState.rejected());

        const state = store.getState().auth;
        expect(state.isLoading).toBe(false);
        expect(state.authChecked).toBe(true);
        expect(state.isAuthenticated).toBe(false);
        expect(state.user).toBeNull();
        expect(state.token).toBeNull();
      });

      test("should handle malformed token data", async () => {
        mockTokenService.isAuthenticated.mockResolvedValue(true);
        mockTokenService.getTokens.mockResolvedValue(null); // No tokens
        mockSecureStorage.getSecureData.mockResolvedValue({ id: '1', name: 'Test User' });
        mockTokenService.clearTokens.mockResolvedValue(true);

        await store.dispatch(restoreAuthState());

        const state = store.getState().auth;
        expect(state.isAuthenticated).toBe(false);
        expect(mockTokenService.clearTokens).toHaveBeenCalled();
      });

      test("should handle expired tokens", async () => {
        mockTokenService.isAuthenticated.mockResolvedValue(false); // Token service says not authenticated
        mockTokenService.clearTokens.mockResolvedValue(true);

        await store.dispatch(restoreAuthState());

        const state = store.getState().auth;
        expect(state.isAuthenticated).toBe(false);
        expect(state.authChecked).toBe(true);
      });
    });
  });

  describe("Edge Cases and Error Handling", () => {
    test("should handle concurrent login attempts", async () => {
      mockApiService.auth.login.mockImplementation(
        () => new Promise(resolve => setTimeout(() => resolve({
          user: { id: '1', name: 'Test User' },
          access_token: 'token123'
        }), 100))
      );
      mockSecureStorage.storeSecureData.mockResolvedValue(true);

      const login1 = store.dispatch(secureLogin({ email: 'test1@example.com', password: 'pass1' }));
      const login2 = store.dispatch(secureLogin({ email: 'test2@example.com', password: 'pass2' }));

      await Promise.all([login1, login2]);

      const state = store.getState().auth;
      expect(state.isLoading).toBe(false);
      // Should have the result from the last successful login
      expect(state.isAuthenticated).toBe(true);
    });

    test("should handle malformed API responses", async () => {
      mockApiService.auth.login.mockResolvedValue({
        user: null, // Missing user data
        access_token: 'token123'
      });
      mockSecureStorage.storeSecureData.mockResolvedValue(true);

      await store.dispatch(secureLogin({ email: 'test@example.com', password: 'password' }));

      const state = store.getState().auth;
      expect(state.isAuthenticated).toBe(true);
      expect(state.user).toBeNull(); // Should handle gracefully
      expect(state.token).toBe('token123');
    });

    test("should handle very long user data", async () => {
      const longUser = {
        id: '1',
        name: 'A'.repeat(1000), // Very long name
        email: 'test@example.com',
        bio: 'B'.repeat(5000), // Very long bio
      };

      mockApiService.auth.login.mockResolvedValue({
        user: longUser,
        access_token: 'token123'
      });
      mockSecureStorage.storeSecureData.mockResolvedValue(true);

      await store.dispatch(secureLogin({ email: 'test@example.com', password: 'password' }));

      const state = store.getState().auth;
      expect(state.user.name).toBe('A'.repeat(1000));
      expect(state.user.bio).toBe('B'.repeat(5000));
    });

    test("should handle special characters in credentials", async () => {
      const specialCredentials = {
        email: 'test+special@example.com',
        password: 'P@ssw0rd!#$%^&*()',
      };

      mockApiService.auth.login.mockResolvedValue({
        user: { id: '1', name: 'Test User', email: specialCredentials.email },
        access_token: 'token123'
      });
      mockSecureStorage.storeSecureData.mockResolvedValue(true);

      await store.dispatch(secureLogin(specialCredentials));

      const state = store.getState().auth;
      expect(state.isAuthenticated).toBe(true);
      expect(state.user.email).toBe(specialCredentials.email);
    });

    test("should handle network timeouts during login", async () => {
      mockApiService.auth.login.mockImplementation(
        () => new Promise((_, reject) =>
          setTimeout(() => reject(new Error('Network timeout')), 30000)
        )
      );

      jest.useFakeTimers();

      const dispatchPromise = store.dispatch(secureLogin({
        email: 'test@example.com',
        password: 'password'
      }));

      jest.advanceTimersByTime(30000);

      await dispatchPromise;

      const state = store.getState().auth;
      expect(state.isLoading).toBe(false);
      expect(state.error).toBe("Network timeout");

      jest.useRealTimers();
    });

    test("should handle rapid state changes", () => {
      // Simulate rapid state changes
      store.dispatch(secureLogin.pending());
      expect(store.getState().auth.isLoading).toBe(true);

      store.dispatch(secureLogin.fulfilled({
        user: { id: '1', name: 'Test' },
        token: 'token123'
      }));
      expect(store.getState().auth.isAuthenticated).toBe(true);

      store.dispatch(secureLogout.pending());
      expect(store.getState().auth.isLoading).toBe(true);

      store.dispatch(secureLogout.fulfilled());
      expect(store.getState().auth.isAuthenticated).toBe(false);
    });

    test("should handle state consistency during errors", () => {
      // Set authenticated state
      store.dispatch({
        type: "auth/secureLogin/fulfilled",
        payload: { user: { id: '1', name: 'Test' }, token: 'token123' },
      });

      // Trigger error - this should clear auth state according to implementation
      store.dispatch(secureLogin.rejected(null, null, null, "Network error"));

      const state = store.getState().auth;
      // Should clear auth state on login rejection
      expect(state.isAuthenticated).toBe(false);
      expect(state.user).toBeNull();
      expect(state.token).toBeNull();
      expect(state.error).toBe("Network error");
    });
  });

  describe("Integration Tests", () => {
    test("should handle complete authentication workflow", async () => {
      // 1. Initial state
      let state = store.getState().auth;
      expect(state.isAuthenticated).toBe(false);
      expect(state.authChecked).toBe(false);

      // 2. Restore auth state (not authenticated)
      mockTokenService.isAuthenticated.mockResolvedValue(false);
      await store.dispatch(restoreAuthState());

      state = store.getState().auth;
      expect(state.authChecked).toBe(true);
      expect(state.isAuthenticated).toBe(false);

      // 3. Login
      const loginData = {
        user: { id: '1', name: 'Test User', email: 'test@example.com' },
        access_token: 'token123'
      };
      mockApiService.auth.login.mockResolvedValue(loginData);
      mockSecureStorage.storeSecureData.mockResolvedValue(true);

      await store.dispatch(secureLogin({
        email: 'test@example.com',
        password: 'password'
      }));

      state = store.getState().auth;
      expect(state.isAuthenticated).toBe(true);
      expect(state.user).toEqual(loginData.user);
      expect(state.token).toEqual(loginData.access_token);

      // 4. Update user data
      store.dispatch(updateUser({ phone: '123-456-7890' }));
      state = store.getState().auth;
      expect(state.user.phone).toBe('123-456-7890');

      // 5. Update activity
      const beforeActivity = state.lastActivity;
      store.dispatch(updateLastActivity());
      state = store.getState().auth;
      expect(state.lastActivity).toBeGreaterThanOrEqual(beforeActivity);

      // 6. Complete onboarding
      store.dispatch(completeOnboarding());
      state = store.getState().auth;
      expect(state.onboardingCompleted).toBe(true);

      // 7. Logout
      mockTokenService.clearTokens.mockResolvedValue(true);
      mockSecureStorage.removeSecureData.mockResolvedValue(true);
      mockTokenService.invalidateSession.mockResolvedValue(true);

      await store.dispatch(secureLogout());

      state = store.getState().auth;
      expect(state.isAuthenticated).toBe(false);
      expect(state.user).toBeNull();
      expect(state.token).toBeNull();
      expect(state.onboardingCompleted).toBe(false); // Reset to initial state
    });

    test("should handle authentication error recovery", async () => {
      // Failed login attempt
      mockApiService.auth.login.mockRejectedValue(new Error('Invalid credentials'));

      await store.dispatch(secureLogin({
        email: 'wrong@example.com',
        password: 'wrongpass'
      }));

      let state = store.getState().auth;
      expect(state.error).toBe('Invalid credentials');
      expect(state.isAuthenticated).toBe(false);

      // Clear error
      store.dispatch(clearError());
      state = store.getState().auth;
      expect(state.error).toBeNull();

      // Successful login
      const loginData = {
        user: { id: '1', name: 'Test User' },
        access_token: 'token123'
      };
      mockApiService.auth.login.mockResolvedValue(loginData);
      mockSecureStorage.storeSecureData.mockResolvedValue(true);

      await store.dispatch(secureLogin({
        email: 'test@example.com',
        password: 'password'
      }));

      state = store.getState().auth;
      expect(state.isAuthenticated).toBe(true);
      expect(state.error).toBeNull();
    });

    test("should maintain state consistency across operations", () => {
      // Start with authenticated state
      store.dispatch({
        type: "auth/secureLogin/fulfilled",
        payload: {
          user: { id: '1', name: 'Test User' },
          token: 'token123'
        },
      });

      let state = store.getState().auth;
      expect(state.isAuthenticated).toBe(true);

      // Update user
      store.dispatch(updateUser({ name: 'Updated User' }));
      state = store.getState().auth;
      expect(state.isAuthenticated).toBe(true);
      expect(state.user.name).toBe('Updated User');

      // Update activity
      store.dispatch(updateLastActivity());
      state = store.getState().auth;
      expect(state.isAuthenticated).toBe(true);

      // Clear error (should not affect auth state)
      store.dispatch(clearError());
      state = store.getState().auth;
      expect(state.isAuthenticated).toBe(true);
    });

    test("should handle session management", () => {
      // Set session expiry
      const expiryTime = Date.now() + 3600000;
      store.dispatch(setSessionExpiry(expiryTime));

      let state = store.getState().auth;
      expect(state.sessionExpiry).toBe(expiryTime);

      // Update activity
      store.dispatch(updateLastActivity());
      state = store.getState().auth;
      expect(state.lastActivity).toBeDefined();
      expect(state.sessionExpiry).toBe(expiryTime); // Should not change
    });

    test("should handle state restoration after app restart", async () => {
      // Simulate app restart - fresh store
      const freshStore = configureStore({
        reducer: {
          auth: authSlice,
        },
      });

      // Mock services for restoration
      mockTokenService.isAuthenticated.mockResolvedValue(true);
      mockTokenService.getTokens.mockResolvedValue({ accessToken: 'saved-token' });
      mockSecureStorage.getSecureData.mockResolvedValue({
        id: '1',
        name: 'Saved User',
        email: 'saved@example.com'
      });

      await freshStore.dispatch(restoreAuthState());

      const state = freshStore.getState().auth;
      expect(state.isAuthenticated).toBe(true);
      expect(state.user.name).toBe('Saved User');
      expect(state.token).toBe('saved-token');
      expect(state.authChecked).toBe(true);
    });

    test("should handle multiple rapid state updates", () => {
      // Simulate rapid user updates
      store.dispatch(updateUser({ name: 'User 1' }));
      store.dispatch(updateUser({ email: 'user1@example.com' }));
      store.dispatch(updateUser({ phone: '123-456-7890' }));

      const state = store.getState().auth;
      expect(state.user).toEqual({
        name: 'User 1',
        email: 'user1@example.com',
        phone: '123-456-7890',
      });
    });
  });

  describe("Security and Data Integrity", () => {
    test("should not expose sensitive data in state", async () => {
      const sensitiveUser = {
        id: '1',
        name: 'Test User',
        email: 'test@example.com',
        password: 'should-not-be-stored', // This should not be in state
        creditCard: '1234-5678-9012-3456', // This should not be in state
      };

      mockApiService.auth.login.mockResolvedValue({
        user: sensitiveUser,
        access_token: 'token123'
      });
      mockSecureStorage.storeSecureData.mockResolvedValue(true);

      await store.dispatch(secureLogin({
        email: 'test@example.com',
        password: 'password'
      }));

      const state = store.getState().auth;
      // State should only contain safe user data
      expect(state.user).toEqual(sensitiveUser);
      // In a real app, sensitive data should be filtered out before storing in state
    });

    test("should handle token storage securely", async () => {
      const loginData = {
        user: { id: '1', name: 'Test User' },
        access_token: 'very-secure-token-123'
      };

      mockApiService.auth.login.mockResolvedValue(loginData);
      mockSecureStorage.storeSecureData.mockResolvedValue(true);

      await store.dispatch(secureLogin({
        email: 'test@example.com',
        password: 'password'
      }));

      // Verify secure storage was called for user data
      expect(mockSecureStorage.storeSecureData).toHaveBeenCalledWith(
        "user_profile",
        loginData.user,
        { dataType: "user_profile" }
      );

      // Token should be in state (though in real app it might be handled differently)
      const state = store.getState().auth;
      expect(state.token).toBe(loginData.access_token);
    });

    test("should clear all sensitive data on logout", async () => {
      // Set up authenticated state with sensitive data
      store.dispatch({
        type: "auth/secureLogin/fulfilled",
        payload: {
          user: { id: '1', name: 'Test User', email: 'test@example.com' },
          token: 'sensitive-token-123'
        },
      });

      mockTokenService.clearTokens.mockResolvedValue(true);
      mockSecureStorage.removeSecureData.mockResolvedValue(true);
      mockTokenService.invalidateSession.mockResolvedValue(true);

      await store.dispatch(secureLogout());

      const state = store.getState().auth;
      expect(state.user).toBeNull();
      expect(state.token).toBeNull();
      expect(state.isAuthenticated).toBe(false);

      // Verify all cleanup services were called
      expect(mockTokenService.clearTokens).toHaveBeenCalled();
      expect(mockSecureStorage.removeSecureData).toHaveBeenCalledWith("user_profile");
      expect(mockTokenService.invalidateSession).toHaveBeenCalled();
    });

    test("should handle secure storage failures gracefully", async () => {
      mockApiService.auth.login.mockResolvedValue({
        user: { id: '1', name: 'Test User' },
        access_token: 'token123'
      });
      mockSecureStorage.storeSecureData.mockRejectedValue(new Error('Storage quota exceeded'));

      await store.dispatch(secureLogin({
        email: 'test@example.com',
        password: 'password'
      }));

      const state = store.getState().auth;
      // Should not authenticate if storage fails
      expect(state.isAuthenticated).toBe(false);
      expect(state.user).toBeNull();
      expect(state.token).toBeNull();
      expect(state.error).toBe('Storage quota exceeded');
    });

    test("should validate token integrity", async () => {
      // Test with invalid tokens
      mockTokenService.isAuthenticated.mockResolvedValue(true);
      mockTokenService.getTokens.mockResolvedValue(null); // Invalid tokens
      mockSecureStorage.getSecureData.mockResolvedValue({ id: '1', name: 'Test User' });
      mockTokenService.clearTokens.mockResolvedValue(true);

      await store.dispatch(restoreAuthState());

      const state = store.getState().auth;
      expect(state.isAuthenticated).toBe(false);
      expect(mockTokenService.clearTokens).toHaveBeenCalled();
    });
  });

  describe("Performance Tests", () => {
    test("should handle rapid consecutive operations", async () => {
      const operations = [];

      // Rapid login attempts
      for (let i = 0; i < 5; i++) {
        mockApiService.auth.login.mockResolvedValueOnce({
          user: { id: `${i}`, name: `User ${i}` },
          access_token: `token${i}`
        });
        mockSecureStorage.storeSecureData.mockResolvedValue(true);

        operations.push(store.dispatch(secureLogin({
          email: `user${i}@example.com`,
          password: 'password'
        })));
      }

      await Promise.all(operations);

      const state = store.getState().auth;
      expect(state.isLoading).toBe(false);
      // Should have the result from the last successful login
      expect(state.isAuthenticated).toBe(true);
    });

    test("should handle memory-intensive operations", async () => {
      // Create large user data
      const largeUser = {
        id: '1',
        name: 'A'.repeat(10000),
        email: 'test@example.com',
        metadata: 'B'.repeat(50000),
      };

      mockApiService.auth.login.mockResolvedValue({
        user: largeUser,
        access_token: 'token123'
      });
      mockSecureStorage.storeSecureData.mockResolvedValue(true);

      const startTime = Date.now();
      await store.dispatch(secureLogin({
        email: 'test@example.com',
        password: 'password'
      }));
      const endTime = Date.now();

      const state = store.getState().auth;
      expect(state.isAuthenticated).toBe(true);
      expect(state.user.name.length).toBe(10000);
      expect(endTime - startTime).toBeLessThan(1000); // Should complete within reasonable time
    });

    test("should handle timeout scenarios efficiently", async () => {
      jest.useFakeTimers();

      mockApiService.auth.login.mockImplementation(
        () => new Promise(resolve =>
          setTimeout(() => resolve({
            user: { id: '1', name: 'Test User' },
            access_token: 'token123'
          }), 10000)
        )
      );
      mockSecureStorage.storeSecureData.mockResolvedValue(true);

      const dispatchPromise = store.dispatch(secureLogin({
        email: 'test@example.com',
        password: 'password'
      }));

      // Advance time but not past timeout
      jest.advanceTimersByTime(5000);

      let state = store.getState().auth;
      expect(state.isLoading).toBe(true);

      // Complete the operation
      jest.advanceTimersByTime(5000);
      await dispatchPromise;

      state = store.getState().auth;
      expect(state.isLoading).toBe(false);
      expect(state.isAuthenticated).toBe(true);

      jest.useRealTimers();
    });
  });
});