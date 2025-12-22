import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Crypto from "expo-crypto";
import * as SecureStore from "expo-secure-store";
import { Platform } from "react-native";

import { STORAGE_CONFIG } from "../../shared/config/environment";
import { logger } from "@shared/utils/logger";

interface StorageData {
  data: any;
  dataType: string;
  timestamp: number;
  version: string;
  checksum: string;
  encrypted?: boolean; // CRIT-004 FIX: Track if data is encrypted
}

// CRIT-004 FIX: Simple XOR-based encryption for web platform
// Note: This provides basic encryption, not military-grade security
// For production, consider using Web Crypto API or a library like crypto-js
interface EncryptedData {
  iv: string;
  ciphertext: string;
  tag: string;
}

/**
 * MED-NEW-011 FIX: Recursively sort object keys for consistent JSON serialization
 * JSON.stringify doesn't guarantee key ordering, which could cause checksum mismatches
 * if the same data is serialized with different key orders.
 * This ensures deterministic serialization regardless of object property order.
 */
function sortObjectKeys(obj: unknown): unknown {
  if (obj === null || obj === undefined) {
    return obj;
  }

  if (Array.isArray(obj)) {
    return obj.map(sortObjectKeys);
  }

  if (typeof obj === 'object' && obj !== null) {
    const sortedObj: Record<string, unknown> = {};
    const keys = Object.keys(obj).sort();
    for (const key of keys) {
      sortedObj[key] = sortObjectKeys((obj as Record<string, unknown>)[key]);
    }
    return sortedObj;
  }

  return obj;
}

/**
 * MED-NEW-011 FIX: Create deterministic JSON string with sorted keys
 * This ensures checksum consistency regardless of object property order
 */
function deterministicStringify(data: unknown): string {
  return JSON.stringify(sortObjectKeys(data));
}

class SecureStorage {
  private deviceKeyCache: string | null = null;
  private encryptionKeyCache: string | null = null;
  private webEncryptionKey: CryptoKey | null = null;
  // CRIT-NEW-003 FIX: Cache the Web Crypto availability check result
  private webCryptoAvailable: boolean | null = null;

  /**
   * CRIT-NEW-003 FIX: Check if Web Crypto API is available and functional
   * This performs a comprehensive check including:
   * - window object existence (for SSR compatibility)
   * - crypto object existence
   * - crypto.subtle existence (not available in insecure contexts)
   * - Actual key generation capability (some browsers may have subtle but fail operations)
   */
  async isWebCryptoAvailable(): Promise<boolean> {
    // Return cached result if already checked
    if (this.webCryptoAvailable !== null) {
      return this.webCryptoAvailable;
    }

    try {
      // Check basic object availability
      if (typeof window === "undefined") {
        logger.warn('[SecureStorage] Window not available (SSR context)');
        this.webCryptoAvailable = false;
        return false;
      }

      if (!window.crypto) {
        logger.warn('[SecureStorage] window.crypto not available');
        this.webCryptoAvailable = false;
        return false;
      }

      if (!window.crypto.subtle) {
        // This happens in insecure contexts (HTTP instead of HTTPS)
        logger.warn('[SecureStorage] window.crypto.subtle not available - likely insecure context (HTTP)');
        this.webCryptoAvailable = false;
        return false;
      }

      // CRIT-NEW-003 FIX: Actually try to use the API to confirm it works
      // Some browsers may have the API but throw on usage
      const testKey = await window.crypto.subtle.generateKey(
        { name: "AES-GCM", length: 256 },
        false,
        ["encrypt", "decrypt"]
      );

      if (!testKey) {
        logger.warn('[SecureStorage] Web Crypto key generation returned null');
        this.webCryptoAvailable = false;
        return false;
      }

      logger.info('[SecureStorage] Web Crypto API verified and functional');
      this.webCryptoAvailable = true;
      return true;
    } catch (error) {
      logger.error('[SecureStorage] Web Crypto API check failed', {
        error: error instanceof Error ? error.message : String(error),
      });
      this.webCryptoAvailable = false;
      return false;
    }
  }

  /**
   * CRIT-004 FIX: Initialize Web Crypto encryption key
   * Uses AES-GCM for authenticated encryption on web platform
   * CRIT-NEW-003 FIX: Now uses the availability check before attempting operations
   */
  private async getWebEncryptionKey(): Promise<CryptoKey> {
    if (this.webEncryptionKey) {
      return this.webEncryptionKey;
    }

    // CRIT-NEW-003 FIX: Use comprehensive availability check
    const isAvailable = await this.isWebCryptoAvailable();
    if (!isAvailable) {
      throw new Error("Web Crypto API not available - cannot securely store encrypted data");
    }

    // Try to get existing key from localStorage (base64 encoded)
    const storedKeyBase64 = localStorage.getItem("_solace_web_key");

    if (storedKeyBase64) {
      try {
        const keyBytes = Uint8Array.from(atob(storedKeyBase64), (c) =>
          c.charCodeAt(0)
        );
        this.webEncryptionKey = await window.crypto.subtle.importKey(
          "raw",
          keyBytes,
          { name: "AES-GCM", length: 256 },
          false,
          ["encrypt", "decrypt"]
        );
        return this.webEncryptionKey;
      } catch {
        // Key corrupted, generate new one
        localStorage.removeItem("_solace_web_key");
      }
    }

    // Generate new key
    this.webEncryptionKey = await window.crypto.subtle.generateKey(
      { name: "AES-GCM", length: 256 },
      true,
      ["encrypt", "decrypt"]
    );

    // Export and store key
    const exportedKey = await window.crypto.subtle.exportKey(
      "raw",
      this.webEncryptionKey
    );
    const keyBase64 = btoa(
      String.fromCharCode(...new Uint8Array(exportedKey))
    );
    localStorage.setItem("_solace_web_key", keyBase64);

    return this.webEncryptionKey;
  }

  /**
   * CRIT-004 FIX: Encrypt data for web platform using AES-GCM
   */
  private async encryptForWeb(plaintext: string): Promise<string> {
    const key = await this.getWebEncryptionKey();
    const iv = window.crypto.getRandomValues(new Uint8Array(12));
    const encoder = new TextEncoder();
    const data = encoder.encode(plaintext);

    const ciphertext = await window.crypto.subtle.encrypt(
      { name: "AES-GCM", iv },
      key,
      data
    );

    // Combine IV + ciphertext and encode as base64
    const combined = new Uint8Array(iv.length + ciphertext.byteLength);
    combined.set(iv);
    combined.set(new Uint8Array(ciphertext), iv.length);

    return btoa(String.fromCharCode(...combined));
  }

  /**
   * CRIT-004 FIX: Decrypt data for web platform using AES-GCM
   */
  private async decryptForWeb(encryptedBase64: string): Promise<string> {
    const key = await this.getWebEncryptionKey();
    const combined = Uint8Array.from(atob(encryptedBase64), (c) =>
      c.charCodeAt(0)
    );

    // Extract IV (first 12 bytes) and ciphertext
    const iv = combined.slice(0, 12);
    const ciphertext = combined.slice(12);

    const decrypted = await window.crypto.subtle.decrypt(
      { name: "AES-GCM", iv },
      key,
      ciphertext
    );

    const decoder = new TextDecoder();
    return decoder.decode(decrypted);
  }

  /**
   * Get or generate device-specific encryption key
   * This provides a secure fallback when environment encryption key is not set
   */
  async getDeviceKey(): Promise<string> {
    if (this.deviceKeyCache) {
      return this.deviceKeyCache;
    }

    try {
      // CRIT-004 FIX: Handle web platform differently
      if (Platform.OS === "web") {
        // On web, generate and store key in localStorage
        let key = localStorage.getItem("_solace_device_key");
        if (!key) {
          const array = new Uint8Array(32);
          window.crypto.getRandomValues(array);
          key = Array.from(array)
            .map((b) => b.toString(16).padStart(2, "0"))
            .join("");
          localStorage.setItem("_solace_device_key", key);
        }
        this.deviceKeyCache = key;
        return key;
      }

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

  // MED-011 FIX: Calculate checksum directly from a string for consistency
  async calculateChecksumFromString(str: string): Promise<string> {
    return await Crypto.digestStringAsync(
      Crypto.CryptoDigestAlgorithm.SHA256,
      str,
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
        encrypt: requestedEncrypt = true,
        dataType = "general",
        requireAuth = false,
      } = options;

      // HIGH-NEW-019 FIX: HIPAA-compliant mandatory encryption for PHI data types
      // These data types contain Protected Health Information and MUST be encrypted
      const PHI_DATA_TYPES = [
        'sensitive',
        'auth_tokens',
        'user_profile',
        'health_data',
        'assessment',
        'journal',
        'mood',
        'therapy',
        'medical',
        'personal',
        'phi',
      ];

      const isPHI = PHI_DATA_TYPES.some(type =>
        dataType.toLowerCase().includes(type.toLowerCase())
      );

      // Force encryption for PHI data regardless of caller request
      let encrypt = requestedEncrypt;
      if (isPHI && !requestedEncrypt) {
        logger.warn('[SecureStorage] HIPAA: Forcing encryption for PHI data type', { dataType });
        encrypt = true;
      }

      // CRIT-NEW-003 FIX: Early verification of Web Crypto for encrypted web storage
      // This prevents attempting to store PHI data without proper encryption
      if (encrypt && Platform.OS === "web") {
        const cryptoAvailable = await this.isWebCryptoAvailable();
        if (!cryptoAvailable) {
          throw new Error(
            "Cannot store encrypted data: Web Crypto API is not available. " +
            "This may be due to an insecure context (HTTP instead of HTTPS) or unsupported browser."
          );
        }
      }

      // MED-011 FIX: Calculate checksum on JSON-serialized data for consistency
      // MED-NEW-011 FIX: Use deterministicStringify for consistent key ordering
      // This ensures the checksum matches exactly what will be stored and retrieved
      // regardless of object property insertion order
      const serializedData = deterministicStringify(data);
      const checksum = await this.calculateChecksumFromString(serializedData);

      const storageData: StorageData = {
        data,
        dataType,
        timestamp: Date.now(),
        version: "2.0",
        checksum,
        encrypted: encrypt, // CRIT-004 FIX: Track encryption status
      };

      const jsonData = JSON.stringify(storageData);
      const fullKey = `${STORAGE_CONFIG.keyPrefix}${key}`;

      if (encrypt && Platform.OS !== "web") {
        // Native platforms: use SecureStore
        await SecureStore.setItemAsync(fullKey, jsonData, {
          keychainAccessible: SecureStore.WHEN_UNLOCKED,
          requireAuthentication: requireAuth,
        });
      } else if (encrypt && Platform.OS === "web") {
        // CRIT-004 FIX: Web platform - encrypt data before storing
        try {
          const encryptedData = await this.encryptForWeb(jsonData);
          // Store with a prefix to identify encrypted data
          await AsyncStorage.setItem(fullKey, `ENC:${encryptedData}`);
        } catch (encryptError) {
          // If Web Crypto API fails, throw error - don't store unencrypted
          throw new Error(
            `Web encryption failed: ${encryptError}. PHI data cannot be stored securely.`
          );
        }
      } else {
        // Non-sensitive data or encryption disabled
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

      // CRIT-004 FIX: Handle web-encrypted data
      if (Platform.OS === "web" && jsonData.startsWith("ENC:")) {
        try {
          const encryptedData = jsonData.slice(4); // Remove "ENC:" prefix
          jsonData = await this.decryptForWeb(encryptedData);
        } catch (decryptError) {
          // If decryption fails, data may be corrupted or key changed
          // Remove the corrupted data and return null
          await this.removeSecureData(key);
          throw new Error(`Web decryption failed: ${decryptError}. Data has been cleared for security.`);
        }
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
            // MED-011 FIX: Use same serialization approach for consistency
            // MED-NEW-011 FIX: Use deterministicStringify for consistent key ordering
            const serializedData = deterministicStringify(parsedData.data);
            const expectedChecksum = await this.calculateChecksumFromString(serializedData);
            if (parsedData.checksum !== expectedChecksum) {
              await this.removeSecureData(key);
              throw new Error("Data integrity check failed");
            }
          }

          return parsedData.data;
        }

        return parsedData;
      } catch (parseError) {
        // CRIT-NEW-005 FIX: Log JSON parse errors instead of silent failure
        logger.error('[SecureStorage] JSON parse error', { error: parseError instanceof Error ? parseError.message : String(parseError) });
        return null;
      }
    } catch (error) {
      // CRIT-NEW-005 FIX: Log retrieval errors instead of silent failure
      logger.error('[SecureStorage] Failed to retrieve secure data', { error: error instanceof Error ? error.message : String(error) });
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
