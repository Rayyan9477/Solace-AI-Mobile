/**
 * Tests for Secure Storage Service
 */

import AsyncStorage from "@react-native-async-storage/async-storage";
import secureStorage from "src/app/services/secureStorage";

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

describe("SecureStorage", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("Encryption/Decryption", () => {
    it("encrypts and decrypts data correctly", () => {
      const testData = "Hello, World!";
      const encrypted = secureStorage._encrypt(testData);
      const decrypted = secureStorage._decrypt(encrypted);

      expect(encrypted).not.toBe(testData);
      expect(decrypted).toBe(testData);
    });

    it("handles empty data", () => {
      expect(secureStorage._encrypt("")).toBe("");
      expect(secureStorage._decrypt("")).toBe("");
      expect(secureStorage._encrypt(null)).toBe(null);
      expect(secureStorage._decrypt(null)).toBe(null);
    });

    it("handles decryption of invalid data gracefully", () => {
      expect(secureStorage._decrypt("invalid_base64")).toBe(null);
      expect(secureStorage._decrypt("not_encrypted_data")).toBe(null);
    });
  });

  describe("storeSecureData", () => {
    it("stores data with encryption by default", async () => {
      const testData = { user: "test", token: "abc123" };
      const mockKey = "test_key";

      await secureStorage.storeSecureData(mockKey, testData);

      expect(AsyncStorage.setItem).toHaveBeenCalledWith(
        "solace_secure_test_key",
        expect.any(String),
      );

      const storedData = AsyncStorage.setItem.mock.calls[0][1];
      expect(storedData).not.toContain("test"); // Should be encrypted
    });

    it("stores data without encryption when specified", async () => {
      const testData = { user: "test", token: "abc123" };
      const mockKey = "test_key";

      await secureStorage.storeSecureData(mockKey, testData, {
        encrypt: false,
      });

      expect(AsyncStorage.setItem).toHaveBeenCalledWith(
        "solace_secure_test_key",
        expect.stringContaining('"user":"test"'),
      );
    });

    it("includes metadata in stored data", async () => {
      const testData = "test data";
      const mockKey = "test_key";

      await secureStorage.storeSecureData(mockKey, testData, {
        encrypt: false,
        dataType: "custom",
      });

      const storedData = AsyncStorage.setItem.mock.calls[0][1];
      const parsed = JSON.parse(storedData);

      expect(parsed).toHaveProperty("data", "test data");
      expect(parsed).toHaveProperty("dataType", "custom");
      expect(parsed).toHaveProperty("timestamp");
      expect(parsed).toHaveProperty("version", "1.0");
    });

    it("handles AsyncStorage errors", async () => {
      AsyncStorage.setItem.mockRejectedValueOnce(new Error("Storage full"));

      await expect(
        secureStorage.storeSecureData("test", "data"),
      ).rejects.toThrow("Secure storage failed: Storage full");
    });
  });

  describe("getSecureData", () => {
    it("retrieves and decrypts stored data", async () => {
      const testData = { user: "test", token: "abc123" };
      const mockKey = "test_key";

      // Mock encrypted data retrieval
      const encryptedData = secureStorage._encrypt(
        JSON.stringify({
          data: testData,
          dataType: "sensitive",
          timestamp: Date.now(),
          version: "1.0",
        }),
      );

      AsyncStorage.getItem.mockResolvedValueOnce(encryptedData);

      const result = await secureStorage.getSecureData(mockKey);

      expect(AsyncStorage.getItem).toHaveBeenCalledWith(
        "solace_secure_test_key",
      );
      expect(result).toEqual(testData);
    });

    it("retrieves unencrypted data for backwards compatibility", async () => {
      const testData = { user: "test", token: "abc123" };
      const mockKey = "test_key";

      const plainData = JSON.stringify({
        data: testData,
        dataType: "general",
        timestamp: Date.now(),
        version: "1.0",
      });

      AsyncStorage.getItem.mockResolvedValueOnce(plainData);

      const result = await secureStorage.getSecureData(mockKey);

      expect(result).toEqual(testData);
    });

    it("returns null for non-existent data", async () => {
      AsyncStorage.getItem.mockResolvedValueOnce(null);

      const result = await secureStorage.getSecureData("nonexistent");

      expect(result).toBe(null);
    });

    it("returns null for invalid stored data", async () => {
      AsyncStorage.getItem.mockResolvedValueOnce("invalid json");

      const result = await secureStorage.getSecureData("test");

      expect(result).toBe(null);
    });

    it("handles AsyncStorage errors gracefully", async () => {
      AsyncStorage.getItem.mockRejectedValueOnce(new Error("Storage error"));

      const result = await secureStorage.getSecureData("test");

      expect(result).toBe(null);
    });
  });

  describe("removeSecureData", () => {
    it("removes data successfully", async () => {
      const mockKey = "test_key";

      await secureStorage.removeSecureData(mockKey);

      expect(AsyncStorage.removeItem).toHaveBeenCalledWith(
        "solace_secure_test_key",
      );
    });

    it("handles removal errors gracefully", async () => {
      AsyncStorage.removeItem.mockRejectedValueOnce(
        new Error("Removal failed"),
      );

      // Should not throw
      await expect(
        secureStorage.removeSecureData("test"),
      ).resolves.toBeUndefined();
    });
  });

  describe("clearAllSecureData", () => {
    it("clears all secure storage data", async () => {
      const mockKeys = [
        "solace_secure_key1",
        "solace_secure_key2",
        "other_key",
      ];
      AsyncStorage.getAllKeys.mockResolvedValueOnce(mockKeys);

      await secureStorage.clearAllSecureData();

      expect(AsyncStorage.getAllKeys).toHaveBeenCalled();
      expect(AsyncStorage.multiRemove).toHaveBeenCalledWith([
        "solace_secure_key1",
        "solace_secure_key2",
      ]);
    });

    it("handles errors during clearing", async () => {
      AsyncStorage.getAllKeys.mockRejectedValueOnce(
        new Error("Failed to get keys"),
      );

      await expect(secureStorage.clearAllSecureData()).rejects.toThrow(
        "Clear secure storage failed: Failed to get keys",
      );
    });
  });

  describe("getAllKeys", () => {
    it("returns all secure storage keys without prefix", async () => {
      const mockKeys = [
        "solace_secure_key1",
        "solace_secure_key2",
        "other_key",
      ];
      AsyncStorage.getAllKeys.mockResolvedValueOnce(mockKeys);

      const result = await secureStorage.getAllKeys();

      expect(result).toEqual(["key1", "key2"]);
    });

    it("returns empty array on error", async () => {
      AsyncStorage.getAllKeys.mockRejectedValueOnce(new Error("Failed"));

      const result = await secureStorage.getAllKeys();

      expect(result).toEqual([]);
    });
  });

  describe("hasData", () => {
    it("returns true when data exists", async () => {
      const testData = "existing data";
      const encryptedData = secureStorage._encrypt(
        JSON.stringify({
          data: testData,
          dataType: "general",
          timestamp: Date.now(),
          version: "1.0",
        }),
      );

      AsyncStorage.getItem.mockResolvedValueOnce(encryptedData);

      const result = await secureStorage.hasData("test");

      expect(result).toBe(true);
    });

    it("returns false when data does not exist", async () => {
      AsyncStorage.getItem.mockResolvedValueOnce(null);

      const result = await secureStorage.hasData("test");

      expect(result).toBe(false);
    });

    it("returns false on retrieval error", async () => {
      AsyncStorage.getItem.mockRejectedValueOnce(new Error("Failed"));

      const result = await secureStorage.hasData("test");

      expect(result).toBe(false);
    });
  });

  describe("storeSensitiveData", () => {
    it("stores data with encryption and sensitive dataType", async () => {
      const testData = { password: "secret123" };

      await secureStorage.storeSensitiveData("password", testData);

      expect(AsyncStorage.setItem).toHaveBeenCalledWith(
        "solace_secure_password",
        expect.any(String),
      );

      const storedData = AsyncStorage.setItem.mock.calls[0][1];
      const decrypted = secureStorage._decrypt(storedData);
      const parsed = JSON.parse(decrypted);

      expect(parsed.data).toEqual(testData);
      expect(parsed.dataType).toBe("sensitive");
    });
  });

  describe("storeData", () => {
    it("stores data without encryption", async () => {
      const testData = { setting: "value" };

      await secureStorage.storeData("setting", testData);

      const storedData = AsyncStorage.setItem.mock.calls[0][1];
      const parsed = JSON.parse(storedData);

      expect(parsed.data).toEqual(testData);
      expect(parsed.dataType).toBe("general");
    });
  });

  describe("migrateData", () => {
    it("migrates data from old key to new key", async () => {
      const testData = { old: "data" };
      const oldData = JSON.stringify(testData);

      AsyncStorage.getItem.mockResolvedValueOnce(oldData);

      await secureStorage.migrateData("old_key", "new_key");

      expect(AsyncStorage.getItem).toHaveBeenCalledWith("old_key");
      expect(AsyncStorage.setItem).toHaveBeenCalledWith(
        "solace_secure_new_key",
        expect.any(String),
      );
      expect(AsyncStorage.removeItem).toHaveBeenCalledWith("old_key");
    });

    it("handles migration when old data does not exist", async () => {
      AsyncStorage.getItem.mockResolvedValueOnce(null);

      await secureStorage.migrateData("old_key", "new_key");

      expect(AsyncStorage.setItem).not.toHaveBeenCalled();
      expect(AsyncStorage.removeItem).not.toHaveBeenCalled();
    });

    it("handles migration errors gracefully", async () => {
      AsyncStorage.getItem.mockRejectedValueOnce(new Error("Migration failed"));

      // Should not throw
      await expect(
        secureStorage.migrateData("old", "new"),
      ).resolves.toBeUndefined();
    });
  });
});
