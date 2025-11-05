/**
 * Tests for Token Service
 */

import tokenService from "src/app/services/tokenService";

// Mock AsyncStorage
jest.mock("@react-native-async-storage/async-storage", () => ({
  setItem: jest.fn(),
  getItem: jest.fn(),
  removeItem: jest.fn(),
  getAllKeys: jest.fn(),
  multiRemove: jest.fn(),
}));

// Mock environment config
jest.mock("src/shared/config/environment", () => ({
  STORAGE_CONFIG: {
    keyPrefix: "solace_secure_",
    encryptionKey: "test_key_123",
  },
}));

// Mock secureStorage
jest.mock("src/app/services/secureStorage", () => ({
  default: {
    storeSecureData: jest.fn(),
    getSecureData: jest.fn(),
    removeSecureData: jest.fn(),
  },
}));

// Mock API service
jest.mock("src/app/services/api", () => ({
  default: {
    auth: {
      refreshToken: jest.fn(),
    },
  },
}));

describe("TokenService", () => {
  const mockSecureStorage = require("src/app/services/secureStorage").default;
  const mockApiService = require("src/app/services/api").default;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("storeTokens", () => {
    it("stores tokens with required fields", async () => {
      const tokenData = {
        accessToken: "access_123",
        refreshToken: "refresh_456",
        expiresAt: Date.now() + 3600000,
      };

      await tokenService.storeTokens(tokenData);

      expect(mockSecureStorage.storeSecureData).toHaveBeenCalledWith(
        "solace_secure_auth_tokens",
        expect.objectContaining({
          accessToken: "access_123",
          refreshToken: "refresh_456",
          expiresAt: tokenData.expiresAt,
          storedAt: expect.any(Number),
        }),
        { dataType: "auth_tokens" },
      );
    });

    it("sets default expiration if not provided", async () => {
      const tokenData = {
        accessToken: "access_123",
        refreshToken: "refresh_456",
      };

      const beforeCall = Date.now();
      await tokenService.storeTokens(tokenData);
      const afterCall = Date.now();

      expect(mockSecureStorage.storeSecureData).toHaveBeenCalledWith(
        "solace_secure_auth_tokens",
        expect.objectContaining({
          accessToken: "access_123",
          refreshToken: "refresh_456",
          expiresAt: expect.any(Number),
          storedAt: expect.any(Number),
        }),
        { dataType: "auth_tokens" },
      );

      const storedData = mockSecureStorage.storeSecureData.mock.calls[0][1];
      expect(storedData.expiresAt).toBeGreaterThanOrEqual(beforeCall + 3600000);
      expect(storedData.expiresAt).toBeLessThanOrEqual(afterCall + 3600000);
    });

    it("throws error if access token is missing", async () => {
      await expect(
        tokenService.storeTokens({
          refreshToken: "refresh_456",
        }),
      ).rejects.toThrow("Access token and refresh token are required");
    });

    it("throws error if refresh token is missing", async () => {
      await expect(
        tokenService.storeTokens({
          accessToken: "access_123",
        }),
      ).rejects.toThrow("Access token and refresh token are required");
    });
  });

  describe("getTokens", () => {
    it("retrieves valid tokens", async () => {
      const tokenData = {
        accessToken: "access_123",
        refreshToken: "refresh_456",
        expiresAt: Date.now() + 3600000,
        storedAt: Date.now(),
      };

      mockSecureStorage.getSecureData.mockResolvedValueOnce(tokenData);

      const result = await tokenService.getTokens();

      expect(mockSecureStorage.getSecureData).toHaveBeenCalledWith(
        "solace_secure_auth_tokens",
      );
      expect(result).toEqual(tokenData);
    });

    it("returns null when no tokens stored", async () => {
      mockSecureStorage.getSecureData.mockResolvedValueOnce(null);

      const result = await tokenService.getTokens();

      expect(result).toBe(null);
    });

    it("clears and returns null for expired tokens", async () => {
      const expiredTokenData = {
        accessToken: "access_123",
        refreshToken: "refresh_456",
        expiresAt: Date.now() - 1000, // Expired
        storedAt: Date.now(),
      };

      mockSecureStorage.getSecureData.mockResolvedValueOnce(expiredTokenData);

      const result = await tokenService.getTokens();

      expect(result).toBe(null);
      expect(mockSecureStorage.removeSecureData).toHaveBeenCalledWith(
        "solace_secure_auth_tokens",
      );
    });

    it("returns null on retrieval error", async () => {
      mockSecureStorage.getSecureData.mockRejectedValueOnce(
        new Error("Storage error"),
      );

      const result = await tokenService.getTokens();

      expect(result).toBe(null);
    });
  });

  describe("clearTokens", () => {
    it("clears tokens successfully", async () => {
      await tokenService.clearTokens();

      expect(mockSecureStorage.removeSecureData).toHaveBeenCalledWith(
        "solace_secure_auth_tokens",
      );
    });

    it("handles clear errors gracefully", async () => {
      mockSecureStorage.removeSecureData.mockRejectedValueOnce(
        new Error("Clear failed"),
      );

      // Should not throw
      await expect(tokenService.clearTokens()).resolves.toBeUndefined();
    });
  });

  describe("isAuthenticated", () => {
    it("returns true when tokens exist", async () => {
      const tokenData = {
        accessToken: "access_123",
        refreshToken: "refresh_456",
        expiresAt: Date.now() + 3600000,
      };

      mockSecureStorage.getSecureData.mockResolvedValueOnce(tokenData);

      const result = await tokenService.isAuthenticated();

      expect(result).toBe(true);
    });

    it("returns false when no tokens exist", async () => {
      mockSecureStorage.getSecureData.mockResolvedValueOnce(null);

      const result = await tokenService.isAuthenticated();

      expect(result).toBe(false);
    });

    it("returns false when tokens are expired", async () => {
      const expiredTokenData = {
        accessToken: "access_123",
        refreshToken: "refresh_456",
        expiresAt: Date.now() - 1000,
      };

      mockSecureStorage.getSecureData.mockResolvedValueOnce(expiredTokenData);

      const result = await tokenService.isAuthenticated();

      expect(result).toBe(false);
    });

    it("returns false on error", async () => {
      mockSecureStorage.getSecureData.mockRejectedValueOnce(new Error("Error"));

      const result = await tokenService.isAuthenticated();

      expect(result).toBe(false);
    });
  });

  describe("getAccessToken", () => {
    it("returns access token when available", async () => {
      const tokenData = {
        accessToken: "access_123",
        refreshToken: "refresh_456",
      };

      mockSecureStorage.getSecureData.mockResolvedValueOnce(tokenData);

      const result = await tokenService.getAccessToken();

      expect(result).toBe("access_123");
    });

    it("returns null when no tokens available", async () => {
      mockSecureStorage.getSecureData.mockResolvedValueOnce(null);

      const result = await tokenService.getAccessToken();

      expect(result).toBe(null);
    });
  });

  describe("getRefreshToken", () => {
    it("returns refresh token when available", async () => {
      const tokenData = {
        accessToken: "access_123",
        refreshToken: "refresh_456",
      };

      mockSecureStorage.getSecureData.mockResolvedValueOnce(tokenData);

      const result = await tokenService.getRefreshToken();

      expect(result).toBe("refresh_456");
    });

    it("returns null when no tokens available", async () => {
      mockSecureStorage.getSecureData.mockResolvedValueOnce(null);

      const result = await tokenService.getRefreshToken();

      expect(result).toBe(null);
    });
  });

  describe("isTokenExpired", () => {
    it("returns false for valid tokens", async () => {
      const tokenData = {
        accessToken: "access_123",
        refreshToken: "refresh_456",
        expiresAt: Date.now() + 3600000,
      };

      mockSecureStorage.getSecureData.mockResolvedValueOnce(tokenData);

      const result = await tokenService.isTokenExpired();

      expect(result).toBe(false);
    });

    it("returns true for expired tokens", async () => {
      const tokenData = {
        accessToken: "access_123",
        refreshToken: "refresh_456",
        expiresAt: Date.now() - 1000,
      };

      mockSecureStorage.getSecureData.mockResolvedValueOnce(tokenData);

      const result = await tokenService.isTokenExpired();

      expect(result).toBe(true);
    });

    it("returns true when no expiration set", async () => {
      const tokenData = {
        accessToken: "access_123",
        refreshToken: "refresh_456",
      };

      mockSecureStorage.getSecureData.mockResolvedValueOnce(tokenData);

      const result = await tokenService.isTokenExpired();

      expect(result).toBe(true);
    });

    it("returns true when no tokens available", async () => {
      mockSecureStorage.getSecureData.mockResolvedValueOnce(null);

      const result = await tokenService.isTokenExpired();

      expect(result).toBe(true);
    });
  });

  describe("refreshAccessToken", () => {
    it("refreshes tokens successfully", async () => {
      const currentTokens = {
        accessToken: "old_access",
        refreshToken: "refresh_456",
        expiresAt: Date.now() + 3600000,
      };

      const newTokens = {
        access_token: "new_access_123",
        refresh_token: "new_refresh_456",
        expires_in: 7200,
      };

      mockSecureStorage.getSecureData.mockResolvedValueOnce(currentTokens);
      mockApiService.auth.refreshToken.mockResolvedValueOnce(newTokens);

      const result = await tokenService.refreshAccessToken();

      expect(mockApiService.auth.refreshToken).toHaveBeenCalledWith(
        "refresh_456",
      );
      expect(mockSecureStorage.storeSecureData).toHaveBeenCalledWith(
        "solace_secure_auth_tokens",
        expect.objectContaining({
          accessToken: "new_access_123",
          refreshToken: "new_refresh_456",
          expiresAt: expect.any(Number),
          storedAt: expect.any(Number),
        }),
        { dataType: "auth_tokens" },
      );

      expect(result).toEqual({
        accessToken: "new_access_123",
        refreshToken: "new_refresh_456",
        expiresAt: expect.any(Number),
      });
    });

    it("uses existing refresh token if no new one provided", async () => {
      const currentTokens = {
        accessToken: "old_access",
        refreshToken: "refresh_456",
        expiresAt: Date.now() + 3600000,
      };

      const newTokens = {
        access_token: "new_access_123",
        expires_in: 7200,
      };

      mockSecureStorage.getSecureData.mockResolvedValueOnce(currentTokens);
      mockApiService.auth.refreshToken.mockResolvedValueOnce(newTokens);

      const result = await tokenService.refreshAccessToken();

      expect(result.refreshToken).toBe("refresh_456");
    });

    it("returns null when no refresh token available", async () => {
      mockSecureStorage.getSecureData.mockResolvedValueOnce(null);

      const result = await tokenService.refreshAccessToken();

      expect(result).toBe(null);
      expect(mockApiService.auth.refreshToken).not.toHaveBeenCalled();
    });

    it("clears tokens and returns null on refresh failure", async () => {
      const currentTokens = {
        accessToken: "old_access",
        refreshToken: "refresh_456",
        expiresAt: Date.now() + 3600000,
      };

      mockSecureStorage.getSecureData.mockResolvedValueOnce(currentTokens);
      mockApiService.auth.refreshToken.mockRejectedValueOnce(
        new Error("Refresh failed"),
      );

      const result = await tokenService.refreshAccessToken();

      expect(result).toBe(null);
      expect(mockSecureStorage.removeSecureData).toHaveBeenCalledWith(
        "solace_secure_auth_tokens",
      );
    });

    it("prevents concurrent refresh attempts with mutex", async () => {
      const currentTokens = {
        accessToken: "old_access",
        refreshToken: "refresh_456",
        expiresAt: Date.now() + 3600000,
      };

      const newTokens = {
        access_token: "new_access_123",
        refresh_token: "new_refresh_456",
        expires_in: 7200,
      };

      mockSecureStorage.getSecureData.mockResolvedValue(currentTokens);

      // Simulate slow API response
      let resolveRefresh;
      const refreshPromise = new Promise((resolve) => {
        resolveRefresh = resolve;
      });
      mockApiService.auth.refreshToken.mockReturnValue(refreshPromise);

      // Fire 3 concurrent refresh attempts
      const refresh1 = tokenService.refreshAccessToken();
      const refresh2 = tokenService.refreshAccessToken();
      const refresh3 = tokenService.refreshAccessToken();

      // Resolve the API call
      resolveRefresh(newTokens);

      const [result1, result2, result3] = await Promise.all([
        refresh1,
        refresh2,
        refresh3,
      ]);

      // Should only call API once due to mutex
      expect(mockApiService.auth.refreshToken).toHaveBeenCalledTimes(1);

      // All three should get the same result
      expect(result1).toEqual(result2);
      expect(result2).toEqual(result3);

      // Should only store tokens once
      expect(mockSecureStorage.storeSecureData).toHaveBeenCalledTimes(1);
    });

    it("allows new refresh after previous one completes", async () => {
      const currentTokens = {
        accessToken: "old_access",
        refreshToken: "refresh_456",
        expiresAt: Date.now() + 3600000,
      };

      const firstNewTokens = {
        access_token: "new_access_1",
        refresh_token: "new_refresh_1",
        expires_in: 7200,
      };

      const secondNewTokens = {
        access_token: "new_access_2",
        refresh_token: "new_refresh_2",
        expires_in: 7200,
      };

      mockSecureStorage.getSecureData.mockResolvedValue(currentTokens);
      mockApiService.auth.refreshToken
        .mockResolvedValueOnce(firstNewTokens)
        .mockResolvedValueOnce(secondNewTokens);

      // First refresh
      const result1 = await tokenService.refreshAccessToken();
      expect(result1.accessToken).toBe("new_access_1");

      // Second refresh (should be allowed after first completes)
      const result2 = await tokenService.refreshAccessToken();
      expect(result2.accessToken).toBe("new_access_2");

      // Should call API twice
      expect(mockApiService.auth.refreshToken).toHaveBeenCalledTimes(2);
    });

    it("handles concurrent refresh with one failure", async () => {
      const currentTokens = {
        accessToken: "old_access",
        refreshToken: "refresh_456",
        expiresAt: Date.now() + 3600000,
      };

      mockSecureStorage.getSecureData.mockResolvedValue(currentTokens);

      let rejectRefresh;
      const refreshPromise = new Promise((_, reject) => {
        rejectRefresh = reject;
      });
      mockApiService.auth.refreshToken.mockReturnValue(refreshPromise);

      // Fire 2 concurrent refresh attempts
      const refresh1 = tokenService.refreshAccessToken();
      const refresh2 = tokenService.refreshAccessToken();

      // Reject the API call
      rejectRefresh(new Error("Network error"));

      const [result1, result2] = await Promise.all([refresh1, refresh2]);

      // Both should get null
      expect(result1).toBe(null);
      expect(result2).toBe(null);

      // Should only call API once
      expect(mockApiService.auth.refreshToken).toHaveBeenCalledTimes(1);

      // Should clear tokens once
      expect(mockSecureStorage.removeSecureData).toHaveBeenCalledTimes(1);
    });
  });

  describe("invalidateSession", () => {
    it("clears tokens and session data", async () => {
      await tokenService.invalidateSession();

      expect(mockSecureStorage.removeSecureData).toHaveBeenCalledWith(
        "solace_secure_auth_tokens",
      );
      expect(mockSecureStorage.removeSecureData).toHaveBeenCalledWith(
        "solace_secure_session_data",
      );
    });

    it("handles session data clear errors gracefully", async () => {
      mockSecureStorage.removeSecureData.mockRejectedValueOnce(
        new Error("Clear failed"),
      );

      // Should not throw
      await expect(tokenService.invalidateSession()).resolves.toBeUndefined();
    });
  });

  describe("getTokenExpiration", () => {
    it("returns expiration time when available", async () => {
      const tokenData = {
        accessToken: "access_123",
        refreshToken: "refresh_456",
        expiresAt: Date.now() + 3600000, // Future timestamp
      };

      mockSecureStorage.getSecureData.mockResolvedValueOnce(tokenData);

      const result = await tokenService.getTokenExpiration();

      expect(result).toBe(tokenData.expiresAt);
    });

    it("returns null when no tokens available", async () => {
      mockSecureStorage.getSecureData.mockResolvedValueOnce(null);

      const result = await tokenService.getTokenExpiration();

      expect(result).toBe(null);
    });
  });

  describe("shouldRefreshToken", () => {
    it("returns false when token is valid and not expiring soon", async () => {
      const tokenData = {
        accessToken: "access_123",
        refreshToken: "refresh_456",
        expiresAt: Date.now() + 10 * 60 * 1000, // 10 minutes from now
      };

      mockSecureStorage.getSecureData.mockResolvedValueOnce(tokenData);

      const result = await tokenService.shouldRefreshToken();

      expect(result).toBe(false);
    });

    it("returns true when token expires within 5 minutes", async () => {
      const tokenData = {
        accessToken: "access_123",
        refreshToken: "refresh_456",
        expiresAt: Date.now() + 3 * 60 * 1000, // 3 minutes from now
      };

      mockSecureStorage.getSecureData.mockResolvedValueOnce(tokenData);

      const result = await tokenService.shouldRefreshToken();

      expect(result).toBe(true);
    });

    it("returns true when token is already expired", async () => {
      const tokenData = {
        accessToken: "access_123",
        refreshToken: "refresh_456",
        expiresAt: Date.now() - 1000,
      };

      mockSecureStorage.getSecureData.mockResolvedValueOnce(tokenData);

      const result = await tokenService.shouldRefreshToken();

      expect(result).toBe(true);
    });

    it("returns true when no expiration set", async () => {
      const tokenData = {
        accessToken: "access_123",
        refreshToken: "refresh_456",
      };

      mockSecureStorage.getSecureData.mockResolvedValueOnce(tokenData);

      const result = await tokenService.shouldRefreshToken();

      expect(result).toBe(true);
    });

    it("returns true when no tokens available", async () => {
      mockSecureStorage.getSecureData.mockResolvedValueOnce(null);

      const result = await tokenService.shouldRefreshToken();

      expect(result).toBe(true);
    });
  });
});
