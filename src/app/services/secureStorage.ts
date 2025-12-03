import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Crypto from "expo-crypto";
import * as SecureStore from "expo-secure-store";
import { Platform } from "react-native";

import { STORAGE_CONFIG } from "../../shared/config/environment";

interface StorageData {
  data: any;
  dataType: string;
  timestamp: number;
  version: string;
  checksum: string;
}

class SecureStorage {
  private deviceKeyCache: string | null = null;
  private encryptionKeyCache: string | null = null;

  /**
   * Get or generate device-specific encryption key
   * This provides a secure fallback when environment encryption key is not set
   */
  async getDeviceKey(): Promise<string> {
    if (this.deviceKeyCache) {
      return this.deviceKeyCache;
    }

    try {
      let key = await SecureStore.getItemAsync("device_master_key");

      if (!key) {
        const randomBytes = await Crypto.getRandomBytesAsync(32);
        key = Array.from(randomBytes)
          .map((b) => b.toString(16).padStart(2, "0"))
          .join("");

        await SecureStore.setItemAsync("device_master_key", key, {
          keychainAccessible: SecureStore.WHEN_UNLOCKED,
        });
      }

      this.deviceKeyCache = key;
      return key;
    } catch (error) {
      throw new Error(`Failed to get device key: ${error}`);
    }
  }

  /**
   * Get encryption key from environment or generate device-specific key
   * Priority: Environment Key > Device-Specific Generated Key
   */
  async getEncryptionKey(): Promise<string> {
    if (this.encryptionKeyCache) {
      return this.encryptionKeyCache;
    }

    // If environment key is provided, use it
    if (STORAGE_CONFIG.encryptionKey) {
      const key = STORAGE_CONFIG.encryptionKey;
      this.encryptionKeyCache = key;
      return key;
    }

    // Otherwise, generate or retrieve device-specific key
    // This is secure because it's stored in SecureStore and unique per device
    this.encryptionKeyCache = await this.getDeviceKey();
    return this.encryptionKeyCache;
  }

  async calculateChecksum(data: any): Promise<string> {
    const jsonString = JSON.stringify(data);
    return await Crypto.digestStringAsync(
      Crypto.CryptoDigestAlgorithm.SHA256,
      jsonString,
    );
  }

  async storeSecureData(
    key: string,
    data: any,
    options: {
      encrypt?: boolean;
      dataType?: string;
      requireAuth?: boolean;
    } = {},
  ): Promise<void> {
    try {
      const {
        encrypt = true,
        dataType = "general",
        requireAuth = false,
      } = options;

      const checksum = await this.calculateChecksum(data);

      const storageData: StorageData = {
        data,
        dataType,
        timestamp: Date.now(),
        version: "2.0",
        checksum,
      };

      const jsonData = JSON.stringify(storageData);
      const fullKey = `${STORAGE_CONFIG.keyPrefix}${key}`;

      if (encrypt && Platform.OS !== "web") {
        await SecureStore.setItemAsync(fullKey, jsonData, {
          keychainAccessible: SecureStore.WHEN_UNLOCKED,
          requireAuthentication: requireAuth,
        });
      } else {
        await AsyncStorage.setItem(fullKey, jsonData);
      }
    } catch (error) {
      throw new Error(`Secure storage failed: ${error}`);
    }
  }

  async getSecureData(key: string): Promise<any> {
    try {
      const fullKey = `${STORAGE_CONFIG.keyPrefix}${key}`;
      let jsonData: string | null = null;

      if (Platform.OS !== "web") {
        try {
          jsonData = await SecureStore.getItemAsync(fullKey);
        } catch {
          jsonData = await AsyncStorage.getItem(fullKey);
        }
      } else {
        jsonData = await AsyncStorage.getItem(fullKey);
      }

      if (!jsonData) {
        return null;
      }

      try {
        const parsedData: StorageData | null = JSON.parse(jsonData);

        // HIGH-003 FIX: Explicit null check after JSON.parse
        // JSON.parse("null") returns null, which could cause issues
        if (parsedData === null || parsedData === undefined) {
          return null;
        }

        if (
          typeof parsedData === "object" &&
          "data" in parsedData
        ) {
          if (parsedData.version === "2.0" && parsedData.checksum) {
            const expectedChecksum = await this.calculateChecksum(
              parsedData.data,
            );
            if (parsedData.checksum !== expectedChecksum) {
              await this.removeSecureData(key);
              throw new Error("Data integrity check failed");
            }
          }

          return parsedData.data;
        }

        return parsedData;
      } catch (parseError) {
        return null;
      }
    } catch (error) {
      return null;
    }
  }

  async removeSecureData(key: string): Promise<void> {
    try {
      const fullKey = `${STORAGE_CONFIG.keyPrefix}${key}`;

      if (Platform.OS !== "web") {
        try {
          await SecureStore.deleteItemAsync(fullKey);
        } catch {
          await AsyncStorage.removeItem(fullKey);
        }
      } else {
        await AsyncStorage.removeItem(fullKey);
      }
    } catch (error) {
      // Best effort removal
    }
  }

  async clearAllSecureData(): Promise<void> {
    try {
      const keys = await AsyncStorage.getAllKeys();
      const secureKeys = keys.filter((key) =>
        key.startsWith(STORAGE_CONFIG.keyPrefix),
      );
      await AsyncStorage.multiRemove(secureKeys);

      if (Platform.OS !== "web") {
        for (const key of secureKeys) {
          try {
            await SecureStore.deleteItemAsync(key);
          } catch {
            // Continue clearing other keys
          }
        }
      }
    } catch (error) {
      throw new Error(`Clear secure storage failed: ${error}`);
    }
  }

  async getAllKeys(): Promise<string[]> {
    try {
      const keys = await AsyncStorage.getAllKeys();
      return keys
        .filter((key) => key.startsWith(STORAGE_CONFIG.keyPrefix))
        .map((key) => key.replace(STORAGE_CONFIG.keyPrefix, ""));
    } catch (error) {
      return [];
    }
  }

  async hasData(key: string): Promise<boolean> {
    try {
      const data = await this.getSecureData(key);
      return data !== null;
    } catch (error) {
      return false;
    }
  }

  async storeSensitiveData(key: string, data: any): Promise<void> {
    return this.storeSecureData(key, data, {
      encrypt: true,
      dataType: "sensitive",
      requireAuth: false,
    });
  }

  async storeData(key: string, data: any): Promise<void> {
    return this.storeSecureData(key, data, {
      encrypt: false,
      dataType: "general",
    });
  }

  async migrateData(oldKey: string, newKey: string): Promise<void> {
    try {
      const data = await AsyncStorage.getItem(oldKey);
      if (data) {
        await this.storeSecureData(newKey, JSON.parse(data));
        await AsyncStorage.removeItem(oldKey);
      }
    } catch (error) {
      // Migration is best effort
    }
  }
}

const secureStorage = new SecureStorage();
export default secureStorage;
