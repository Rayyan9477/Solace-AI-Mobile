/**
 * Auth Slice Tests
 * Tests for authentication state management
 */

// Force __DEV__ to false so authSlice uses mocked require calls instead of internal mocks
(globalThis as any).__DEV__ = false;

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
  let mockApiService: any;
  let mockSecureStorage: any;
  let mockTokenService: any;
  let store: any;

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
    });

    describe("completeOnboarding", () => {
      test("should mark onboarding as completed", () => {
        store.dispatch(completeOnboarding());

        const state = store.getState().auth;
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
    });

    describe("updateLastActivity", () => {
      test("should update last activity timestamp", () => {
        const initialTime = Date.now();
        jest.spyOn(Date, 'now').mockReturnValue(initialTime + 5000);

        store.dispatch(updateLastActivity());

        const state = store.getState().auth;
        expect(state.lastActivity).toBe(initialTime + 5000);
      });
    });

    describe("setSessionExpiry", () => {
      test("should set session expiry time", () => {
        const expiryTime = Date.now() + 3600000;
        store.dispatch(setSessionExpiry(expiryTime));

        const state = store.getState().auth;
        expect(state.sessionExpiry).toBe(expiryTime);
      });
    });
  });

  describe("Async Thunks", () => {
    describe("secureLogin", () => {
      const loginCredentials = {
        email: "test@example.com",
        password: "password123",
      };

      const mockApiResponse = {
        user: { id: '1', name: 'Test User', email: 'test@example.com' },
        access_token: 'mock_token_123',
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

      test("should handle API login failure", async () => {
        // Mock invalid API response (no user field)
        mockApiService.auth.login.mockResolvedValue({ access_token: 'token' });

        await store.dispatch(secureLogin(loginCredentials));

        const state = store.getState().auth;
        expect(state.isLoading).toBe(false);
        expect(state.isAuthenticated).toBe(false);
        expect(state.error).toBe("Invalid API response");
      });

      test("should handle API rejection with error message", async () => {
        const errorMessage = "Invalid credentials";
        const mockError = new Error(errorMessage);
        mockApiService.auth.login.mockRejectedValue(mockError);

        await store.dispatch(secureLogin(loginCredentials));

        const state = store.getState().auth;
        expect(state.isLoading).toBe(false);
        expect(state.isAuthenticated).toBe(false);
        expect(state.error).toBe(errorMessage);
      });
    });

    describe("secureLogout", () => {
      test("should handle successful logout", async () => {
        // First login
        mockApiService.auth.login.mockResolvedValue({
          user: { id: '1', name: 'Test User' },
          access_token: 'token123',
        });
        mockSecureStorage.storeSecureData.mockResolvedValue(true);
        await store.dispatch(secureLogin({ email: "test@test.com", password: "pass" }));

        // Then logout
        mockTokenService.clearTokens.mockResolvedValue(true);
        mockSecureStorage.removeSecureData.mockResolvedValue(true);
        mockTokenService.invalidateSession.mockResolvedValue(true);

        await store.dispatch(secureLogout());

        const state = store.getState().auth;
        expect(state.isAuthenticated).toBe(false);
        expect(state.user).toBeNull();
        expect(state.token).toBeNull();
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

      test("should handle missing tokens", async () => {
        mockTokenService.isAuthenticated.mockResolvedValue(false);
        mockTokenService.clearTokens.mockResolvedValue(true);

        await store.dispatch(restoreAuthState());

        const state = store.getState().auth;
        expect(state.isAuthenticated).toBe(false);
        expect(state.authChecked).toBe(true);
      });
    });
  });
});
