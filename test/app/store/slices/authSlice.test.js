import { configureStore } from "@reduxjs/toolkit";

// Force __DEV__ to false so authSlice uses mocked require calls instead of internal mocks
global.__DEV__ = false;

// Mock the service modules using manual mocks
jest.mock("../../../../src/app/services/api");
jest.mock("../../../../src/app/services/secureStorage");
jest.mock("../../../../src/app/services/tokenService");

// Reset modules to ensure authSlice is reloaded with mocked services
jest.resetModules();

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

describe("authSlice", () => {
  let mockApiService, mockSecureStorage, mockTokenService;
  let store;
  
  beforeAll(() => {
    // Get references to the mocked service functions from manual mocks
    mockApiService = require("../../../../src/app/services/api").default;
    mockSecureStorage = require("../../../../src/app/services/secureStorage").default;
    mockTokenService = require("../../../../src/app/services/tokenService").default;
    
    // Create store with authSlice
    store = configureStore({
      reducer: {
        auth: authSlice,
      },
    });
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
    
    store = configureStore({
      reducer: {
        auth: authSlice,
      },
    });
  });

  describe("initial state", () => {
    it("should have correct initial state", () => {
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

  describe("reducers", () => {
    it("should clear error", () => {
      store.dispatch({ type: "auth/secureLogin/rejected", payload: "Login failed" });
      expect(store.getState().auth.error).toBe("Login failed");

      store.dispatch(clearError());
      expect(store.getState().auth.error).toBeNull();
    });

    it("should complete onboarding", () => {
      store.dispatch(completeOnboarding());
      expect(store.getState().auth.onboardingCompleted).toBe(true);
    });

    it("should update user", () => {
      const userUpdate = { name: "Updated Name", email: "updated@example.com" };
      store.dispatch(updateUser(userUpdate));
      expect(store.getState().auth.user).toEqual(userUpdate);
    });

    it("should update last activity", () => {
      const beforeUpdate = store.getState().auth.lastActivity;
      store.dispatch(updateLastActivity());
      const afterUpdate = store.getState().auth.lastActivity;
      expect(afterUpdate).toBeGreaterThanOrEqual(beforeUpdate);
    });

    it("should set session expiry", () => {
      const expiryTime = Date.now() + 3600000; // 1 hour from now
      store.dispatch(setSessionExpiry(expiryTime));
      expect(store.getState().auth.sessionExpiry).toBe(expiryTime);
    });
  });

  describe("secureLogin", () => {
    it("should handle successful login", async () => {
      const loginData = { email: "test@example.com", password: "password123" };
      const mockResponse = {
        user: { id: "1", name: "Test User", email: "test@example.com" },
        access_token: "mock_token_123",
      };

      mockApiService.auth.login.mockResolvedValue(mockResponse);
      mockSecureStorage.storeSecureData.mockResolvedValue(true);

      await store.dispatch(secureLogin(loginData));

      const state = store.getState().auth;
      expect(state.isAuthenticated).toBe(true);
      expect(state.user).toEqual(mockResponse.user);
      expect(state.token).toBe(mockResponse.access_token);
      expect(state.isLoading).toBe(false);
      expect(state.error).toBeNull();
      expect(state.sessionExpiry).toBeGreaterThan(Date.now());
    });

    it("should handle login failure with invalid credentials", async () => {
      const loginData = { email: "", password: "" };
      const errorMessage = "Email and password are required";

      await store.dispatch(secureLogin(loginData));

      const state = store.getState().auth;
      expect(state.isAuthenticated).toBe(false);
      expect(state.user).toBeNull();
      expect(state.token).toBeNull();
      expect(state.isLoading).toBe(false);
      expect(state.error).toBe(errorMessage);
    });

    it("should handle API login failure", async () => {
      const loginData = { email: "test@example.com", password: "wrongpassword" };
      const apiError = new Error("Invalid credentials");

      mockApiService.auth.login.mockRejectedValue(apiError);

      await store.dispatch(secureLogin(loginData));

      const state = store.getState().auth;
      expect(state.isAuthenticated).toBe(false);
      expect(state.user).toBeNull();
      expect(state.token).toBeNull();
      expect(state.isLoading).toBe(false);
      expect(state.error).toBe("Invalid credentials");
    });

    it("should handle secure storage failure during login", async () => {
      const loginData = { email: "test@example.com", password: "password123" };
      const mockResponse = {
        user: { id: "1", name: "Test User", email: "test@example.com" },
        access_token: "mock_token_123",
      };

      mockApiService.auth.login.mockResolvedValue(mockResponse);
      mockSecureStorage.storeSecureData.mockRejectedValue(new Error("Storage failed"));

      await store.dispatch(secureLogin(loginData));

      const state = store.getState().auth;
      expect(state.isAuthenticated).toBe(false);
      expect(state.user).toBeNull();
      expect(state.token).toBeNull();
      expect(state.isLoading).toBe(false);
      expect(state.error).toBe("Storage failed");
    });

    it("should set loading state during login", () => {
      store.dispatch(secureLogin.pending());
      expect(store.getState().auth.isLoading).toBe(true);
      expect(store.getState().auth.error).toBeNull();
    });
  });

  describe("secureLogout", () => {
    beforeEach(() => {
      // Set up authenticated state
      store.dispatch({
        type: "auth/secureLogin/fulfilled",
        payload: {
          user: { id: "1", name: "Test User", email: "test@example.com" },
          token: "mock_token_123",
        },
      });
    });

    it("should handle successful logout", async () => {
      mockTokenService.clearTokens.mockResolvedValue(true);
      mockSecureStorage.removeSecureData.mockResolvedValue(true);
      mockTokenService.invalidateSession.mockResolvedValue(true);

      await store.dispatch(secureLogout());

      const state = store.getState().auth;
      expect(state.isAuthenticated).toBe(false);
      expect(state.user).toBeNull();
      expect(state.token).toBeNull();
      expect(state.isLoading).toBe(false);
      expect(state.error).toBeNull();
      expect(state.onboardingCompleted).toBe(false);
      expect(state.authChecked).toBe(false);
    });

    it("should handle logout failure but still clear auth state", async () => {
      mockTokenService.clearTokens.mockRejectedValue(new Error("Logout failed"));

      await store.dispatch(secureLogout());

      const state = store.getState().auth;
      expect(state.isAuthenticated).toBe(false);
      expect(state.user).toBeNull();
      expect(state.token).toBeNull();
      expect(state.isLoading).toBe(false);
      expect(state.error).toBe("Logout failed");
    });

    it("should set loading state during logout", () => {
      store.dispatch(secureLogout.pending());
      expect(store.getState().auth.isLoading).toBe(true);
    });
  });

  describe("restoreAuthState", () => {
    it("should restore auth state when user is authenticated", async () => {
      const mockUser = { id: "1", name: "Test User", email: "test@example.com" };
      const mockTokens = { accessToken: "mock_token_123" };

      mockTokenService.isAuthenticated.mockResolvedValue(true);
      mockTokenService.getTokens.mockResolvedValue(mockTokens);
      mockSecureStorage.getSecureData.mockResolvedValue(mockUser);

      await store.dispatch(restoreAuthState());

      const state = store.getState().auth;
      expect(state.isAuthenticated).toBe(true);
      expect(state.user).toEqual(mockUser);
      expect(state.token).toBe(mockTokens.accessToken);
      expect(state.isLoading).toBe(false);
      expect(state.authChecked).toBe(true);
    });

    it("should handle unauthenticated state", async () => {
      mockTokenService.isAuthenticated.mockResolvedValue(false);

      await store.dispatch(restoreAuthState());

      const state = store.getState().auth;
      expect(state.isAuthenticated).toBe(false);
      expect(state.user).toBeNull();
      expect(state.token).toBeNull();
      expect(state.isLoading).toBe(false);
      expect(state.authChecked).toBe(true);
    });

    it("should handle missing tokens", async () => {
      const mockUser = { id: "1", name: "Test User", email: "test@example.com" };

      mockTokenService.isAuthenticated.mockResolvedValue(true);
      mockTokenService.getTokens.mockResolvedValue(null);
      mockSecureStorage.getSecureData.mockResolvedValue(mockUser);
      mockTokenService.clearTokens.mockResolvedValue(true);

      await store.dispatch(restoreAuthState());

      const state = store.getState().auth;
      expect(state.isAuthenticated).toBe(false);
      expect(state.user).toBeNull();
      expect(state.token).toBeNull();
      expect(state.isLoading).toBe(false);
      expect(state.authChecked).toBe(true);
    });

    it("should handle missing user data", async () => {
      const mockTokens = { accessToken: "mock_token_123" };

      mockTokenService.isAuthenticated.mockResolvedValue(true);
      mockTokenService.getTokens.mockResolvedValue(mockTokens);
      mockSecureStorage.getSecureData.mockResolvedValue(null);
      mockTokenService.clearTokens.mockResolvedValue(true);

      await store.dispatch(restoreAuthState());

      const state = store.getState().auth;
      expect(state.isAuthenticated).toBe(false);
      expect(state.user).toBeNull();
      expect(state.token).toBeNull();
      expect(state.isLoading).toBe(false);
      expect(state.authChecked).toBe(true);
    });

    it("should handle timeout", async () => {
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

    it("should handle service errors gracefully", async () => {
      mockTokenService.isAuthenticated.mockRejectedValue(new Error("Service error"));
      mockTokenService.clearTokens.mockResolvedValue(true);

      await store.dispatch(restoreAuthState());

      const state = store.getState().auth;
      expect(state.isAuthenticated).toBe(false);
      expect(state.user).toBeNull();
      expect(state.token).toBeNull();
      expect(state.isLoading).toBe(false);
      expect(state.authChecked).toBe(true);
    });

    it("should set loading state during restoration", () => {
      store.dispatch(restoreAuthState.pending());
      expect(store.getState().auth.isLoading).toBe(true);
    });
  });

  describe("integration tests", () => {
    it("should handle complete login flow", async () => {
      const loginData = { email: "test@example.com", password: "password123" };
      const mockResponse = {
        user: { id: "1", name: "Test User", email: "test@example.com" },
        access_token: "mock_token_123",
      };

      mockApiService.auth.login.mockResolvedValue(mockResponse);
      mockSecureStorage.storeSecureData.mockResolvedValue(true);

      // Login
      await store.dispatch(secureLogin(loginData));

      let state = store.getState().auth;
      expect(state.isAuthenticated).toBe(true);
      expect(state.user).toEqual(mockResponse.user);
      expect(state.token).toBe(mockResponse.access_token);

      // Update user
      store.dispatch(updateUser({ name: "Updated Name" }));
      state = store.getState().auth;
      expect(state.user.name).toBe("Updated Name");
      expect(state.user.email).toBe("test@example.com");

      // Complete onboarding
      store.dispatch(completeOnboarding());
      state = store.getState().auth;
      expect(state.onboardingCompleted).toBe(true);

      // Update activity
      const beforeActivity = state.lastActivity;
      store.dispatch(updateLastActivity());
      state = store.getState().auth;
      expect(state.lastActivity).toBeGreaterThanOrEqual(beforeActivity);
    });

    it("should handle complete logout flow", async () => {
      // First login
      const loginData = { email: "test@example.com", password: "password123" };
      const mockResponse = {
        user: { id: "1", name: "Test User", email: "test@example.com" },
        access_token: "mock_token_123",
      };

      mockApiService.auth.login.mockResolvedValue(mockResponse);
      mockSecureStorage.storeSecureData.mockResolvedValue(true);

      await store.dispatch(secureLogin(loginData));

      // Verify logged in
      expect(store.getState().auth.isAuthenticated).toBe(true);

      // Logout
      mockTokenService.clearTokens.mockResolvedValue(true);
      mockSecureStorage.removeSecureData.mockResolvedValue(true);
      mockTokenService.invalidateSession.mockResolvedValue(true);

      await store.dispatch(secureLogout());

      const state = store.getState().auth;
      expect(state.isAuthenticated).toBe(false);
      expect(state.user).toBeNull();
      expect(state.token).toBeNull();
      expect(state.onboardingCompleted).toBe(false);
      expect(state.authChecked).toBe(false);
    });
  });
});