// Mock logger
import apiService from "../../../src/app/services/api";
import tokenService from "../../../src/app/services/tokenService";
import { API_CONFIG } from "../../../src/shared/config/environment";

jest.mock("../../../src/shared/utils/logger", () => ({
  logger: {
    warn: jest.fn(),
    error: jest.fn(),
    info: jest.fn(),
    debug: jest.fn(),
  },
}));

// Mock tokenService before importing apiService
jest.mock("../../../src/app/services/tokenService", () => {
  return {
    __esModule: true,
    default: {
      getTokens: jest.fn(() => Promise.resolve(null)),
      storeTokens: jest.fn(() => Promise.resolve()),
      clearTokens: jest.fn(() => Promise.resolve()),
    },
  };
});

// Mock fetch globally
global.fetch = jest.fn();

// Get references to the mocked functions
const mockGetTokens = tokenService.getTokens;
const mockStoreTokens = tokenService.storeTokens;
const mockClearTokens = tokenService.clearTokens;

// Mock environment config
jest.mock("../../../src/shared/config/environment", () => ({
  API_CONFIG: {
    baseURL: "https://api.test.com",
    timeout: 5000,
  },
}));

// Helper function to create mock response
const createMockResponse = (data, ok = true, status = 200) => ({
  ok,
  status,
  json: () => Promise.resolve(data),
});

describe("API Service", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  beforeEach(() => {
    jest.clearAllMocks();
    fetch.mockRestore();
    fetch.mockImplementation(() =>
      Promise.reject(new Error("Fetch not mocked")),
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
    fetch.mockRestore();
  });

  describe("AuthAPIError", () => {
    it("creates error with correct properties", () => {
      const { AuthAPIError } = require("../../../src/app/services/api");
      const error = new AuthAPIError("Test error", 400, "/test");

      expect(error.message).toBe("Test error");
      expect(error.name).toBe("AuthAPIError");
      expect(error.statusCode).toBe(400);
      expect(error.endpoint).toBe("/test");
      expect(error.timestamp).toBeDefined();
    });
  });

  describe("authAPI.login", () => {
    const mockLoginData = {
      user: { id: 1, email: "test@example.com" },
      access_token: "access_token_123",
      refresh_token: "refresh_token_456",
      expires_in: 3600,
    };

    it("successfully logs in user", async () => {
      fetch.mockResolvedValueOnce(createMockResponse(mockLoginData));

      mockStoreTokens.mockResolvedValueOnce();

      const result = await apiService.auth.login(
        "test@example.com",
        "password123",
      );

      expect(fetch).toHaveBeenCalledWith(
        `${API_CONFIG.baseURL}/auth/login`,
        expect.objectContaining({
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: "test@example.com",
            password: "password123",
          }),
          signal: expect.any(AbortSignal),
        }),
      );

      expect(mockStoreTokens).toHaveBeenCalledWith({
        accessToken: "access_token_123",
        refreshToken: "refresh_token_456",
        expiresAt: expect.any(Number),
      });

      expect(result).toEqual({
        user: mockLoginData.user,
        access_token: "access_token_123",
        refresh_token: "refresh_token_456",
      });
    });

    it("throws error for missing email", async () => {
      await expect(apiService.auth.login("", "password123")).rejects.toThrow(
        "Email and password are required",
      );
    });

    it("throws error for missing password", async () => {
      await expect(
        apiService.auth.login("test@example.com", ""),
      ).rejects.toThrow("Email and password are required");
    });

    it("handles login failure", async () => {
      fetch.mockResolvedValueOnce(
        createMockResponse({ message: "Invalid credentials" }, false, 401),
      );

      await expect(
        apiService.auth.login("test@example.com", "wrongpassword"),
      ).rejects.toThrow("Invalid credentials");
    });
  });

  describe("authAPI.register", () => {
    const mockRegisterData = {
      user: { id: 1, email: "new@example.com" },
      message: "Registration successful",
    };

    it("successfully registers user", async () => {
      fetch.mockResolvedValueOnce(createMockResponse(mockRegisterData));

      const result = await apiService.auth.register({
        email: "new@example.com",
        password: "password123",
        name: "Test User",
        additionalField: "value",
      });

      expect(fetch).toHaveBeenCalledWith(
        `${API_CONFIG.baseURL}/auth/register`,
        expect.objectContaining({
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: "new@example.com",
            password: "password123",
            name: "Test User",
            additionalField: "value",
          }),
          signal: expect.any(AbortSignal),
        }),
      );

      expect(result).toEqual(mockRegisterData);
    });

    it("throws error for missing required fields", async () => {
      await expect(apiService.auth.register({})).rejects.toThrow(
        "Email, password, and name are required",
      );
    });
  });

  describe("authAPI.logout", () => {
    it("successfully logs out user", async () => {
      mockGetTokens.mockResolvedValueOnce({
        accessToken: "access_token_123",
      });

      fetch.mockResolvedValueOnce(
        createMockResponse({ message: "Logged out" }),
      );

      mockClearTokens.mockResolvedValueOnce();

      const result = await apiService.auth.logout();

      expect(fetch).toHaveBeenCalledWith(
        `${API_CONFIG.baseURL}/auth/logout`,
        expect.any(Object),
      );
      expect(mockClearTokens).toHaveBeenCalled();
      expect(result).toEqual({ success: true });
    });

    it("handles logout API failure gracefully", async () => {
      mockGetTokens.mockResolvedValueOnce({
        accessToken: "access_token_123",
      });

      fetch.mockRejectedValueOnce(new Error("Network error"));
      mockClearTokens.mockResolvedValueOnce();

      const result = await apiService.auth.logout();

      expect(mockClearTokens).toHaveBeenCalled();
      expect(result).toEqual({ success: true });
    });
  });

  describe("authAPI.getProfile", () => {
    it("successfully retrieves user profile", async () => {
      const mockProfile = {
        id: 1,
        name: "Test User",
        email: "test@example.com",
      };

      mockGetTokens.mockResolvedValueOnce({
        accessToken: "access_token_123",
      });

      fetch.mockResolvedValueOnce(createMockResponse(mockProfile));

      const result = await apiService.auth.getProfile();

      expect(fetch).toHaveBeenCalledWith(
        `${API_CONFIG.baseURL}/auth/profile`,
        expect.any(Object),
      );
      expect(result).toEqual(mockProfile);
    });
  });

  describe("authAPI.updateProfile", () => {
    it("successfully updates user profile", async () => {
      const updateData = { name: "Updated Name" };
      const mockResponse = {
        id: 1,
        name: "Updated Name",
        email: "test@example.com",
      };

      mockGetTokens.mockResolvedValueOnce({
        accessToken: "access_token_123",
      });

      fetch.mockResolvedValueOnce(createMockResponse(mockResponse));

      const result = await apiService.auth.updateProfile(updateData);

      expect(fetch).toHaveBeenCalledWith(`${API_CONFIG.baseURL}/auth/profile`, {
        method: "PUT",
        headers: expect.objectContaining({
          "Content-Type": "application/json",
          Authorization: "Bearer access_token_123",
        }),
        body: JSON.stringify(updateData),
        signal: expect.any(AbortSignal),
      });

      expect(result).toEqual(mockResponse);
    });
  });

  describe("authAPI.changePassword", () => {
    it("successfully changes password", async () => {
      const mockResponse = { message: "Password changed successfully" };

      mockGetTokens.mockResolvedValueOnce({
        accessToken: "access_token_123",
      });

      fetch.mockResolvedValueOnce(createMockResponse(mockResponse));

      const result = await apiService.auth.changePassword("oldpass", "newpass");

      expect(fetch).toHaveBeenCalledWith(
        `${API_CONFIG.baseURL}/auth/change-password`,
        {
          method: "POST",
          headers: expect.objectContaining({
            "Content-Type": "application/json",
            Authorization: "Bearer access_token_123",
          }),
          body: JSON.stringify({
            currentPassword: "oldpass",
            newPassword: "newpass",
          }),
          signal: expect.any(AbortSignal),
        },
      );

      expect(result).toEqual(mockResponse);
    });
  });

  describe("authAPI.requestPasswordReset", () => {
    it("successfully requests password reset", async () => {
      const mockResponse = { message: "Reset email sent" };

      fetch.mockResolvedValueOnce(createMockResponse(mockResponse));

      const result =
        await apiService.auth.requestPasswordReset("test@example.com");

      expect(fetch).toHaveBeenCalledWith(
        `${API_CONFIG.baseURL}/auth/forgot-password`,
        expect.objectContaining({
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: "test@example.com" }),
          signal: expect.any(AbortSignal),
        }),
      );

      expect(result).toEqual(mockResponse);
    });
  });

  describe("authAPI.resetPassword", () => {
    it("successfully resets password", async () => {
      const mockResponse = { message: "Password reset successful" };

      fetch.mockResolvedValueOnce(createMockResponse(mockResponse));

      const result = await apiService.auth.resetPassword(
        "reset_token_123",
        "newpassword",
      );

      expect(fetch).toHaveBeenCalledWith(
        `${API_CONFIG.baseURL}/auth/reset-password`,
        expect.objectContaining({
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            token: "reset_token_123",
            newPassword: "newpassword",
          }),
          signal: expect.any(AbortSignal),
        }),
      );

      expect(result).toEqual(mockResponse);
    });
  });

  describe("authenticatedFetch - Token Refresh", () => {
    it("refreshes token on 401 and retries request", async () => {
      mockGetTokens.mockResolvedValueOnce({
        accessToken: "expired_token",
        refreshToken: "refresh_token_123",
      });

      // First call returns 401
      fetch.mockResolvedValueOnce({
        ok: false,
        status: 401,
        json: () => Promise.resolve({ message: "Token expired" }),
      });

      // Token refresh call
      fetch.mockResolvedValueOnce({
        ok: true,
        json: () =>
          Promise.resolve({
            access_token: "new_access_token",
            refresh_token: "new_refresh_token",
          }),
      });

      mockStoreTokens.mockResolvedValueOnce();

      // Retry call with new token
      fetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ data: "success" }),
      });

      const result = await apiService.auth.getProfile();

      expect(fetch).toHaveBeenCalledTimes(3);
      expect(mockStoreTokens).toHaveBeenCalledWith({
        accessToken: "new_access_token",
        refreshToken: "new_refresh_token",
        expiresAt: expect.any(Number),
      });
      expect(result).toEqual({ data: "success" });
    });

    it("handles request timeout", async () => {
      mockGetTokens.mockResolvedValueOnce({
        accessToken: "access_token_123",
      });

      // Mock AbortController
      const mockController = {
        signal: {},
        abort: jest.fn(),
      };
      global.AbortController = jest.fn(() => mockController);

      // Mock fetch to simulate timeout
      const timeoutError = new Error("Aborted");
      timeoutError.name = "AbortError";
      fetch.mockRejectedValueOnce(timeoutError);

      await expect(apiService.auth.getProfile()).rejects.toThrow(
        "Request timeout",
      );
    });
  });

  describe("userAPI", () => {
    describe("getPreferences", () => {
      it("successfully retrieves user preferences", async () => {
        const mockPreferences = { theme: "dark", notifications: true };

        mockGetTokens.mockResolvedValueOnce({
          accessToken: "access_token_123",
        });

        fetch.mockResolvedValueOnce(createMockResponse(mockPreferences));

        const result = await apiService.user.getPreferences();

        expect(fetch).toHaveBeenCalledWith(
          `${API_CONFIG.baseURL}/user/preferences`,
          expect.any(Object),
        );
        expect(result).toEqual(mockPreferences);
      });
    });

    describe("updatePreferences", () => {
      it("successfully updates user preferences", async () => {
        const updateData = { theme: "light" };
        const mockResponse = { theme: "light", notifications: true };

        mockGetTokens.mockResolvedValueOnce({
          accessToken: "access_token_123",
        });

        fetch.mockResolvedValueOnce(createMockResponse(mockResponse));

        const result = await apiService.user.updatePreferences(updateData);

        expect(fetch).toHaveBeenCalledWith(
          `${API_CONFIG.baseURL}/user/preferences`,
          {
            method: "PUT",
            headers: expect.objectContaining({
              "Content-Type": "application/json",
              Authorization: "Bearer access_token_123",
            }),
            body: JSON.stringify(updateData),
            signal: expect.any(Object),
          },
        );

        expect(result).toEqual(mockResponse);
      });
    });

    describe("deleteAccount", () => {
      it("successfully deletes user account", async () => {
        const mockResponse = { message: "Account deleted successfully" };

        mockGetTokens.mockResolvedValueOnce({
          accessToken: "access_token_123",
        });

        fetch.mockResolvedValueOnce(createMockResponse(mockResponse));

        const result = await apiService.user.deleteAccount();

        expect(fetch).toHaveBeenCalledWith(
          `${API_CONFIG.baseURL}/user/account`,
          {
            method: "DELETE",
            headers: expect.objectContaining({
              "Content-Type": "application/json",
              Authorization: "Bearer access_token_123",
            }),
            signal: expect.any(Object),
          },
        );

        expect(result).toEqual(mockResponse);
      });
    });
  });
});
