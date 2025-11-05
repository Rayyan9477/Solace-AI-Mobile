/**
 * Encryption Utilities for PHI Data
 * HIPAA-compliant AES-256 encryption for mental health data
 */

import CryptoJS from "crypto-js";
import * as Crypto from "expo-crypto";
import * as SecureStore from "expo-secure-store";

import { logger } from "./logger";

interface EncryptionMetadata {
  version: string;
  algorithm: string;
  timestamp: number;
}

class EncryptionService {
  private static instance: EncryptionService;
  private encryptionKey: string | null = null;
  private readonly KEY_NAME = "solace_encryption_master_key";
  private readonly ALGORITHM = "AES-256-CBC";
  private readonly VERSION = "1.0";

  private constructor() {}

  static getInstance(): EncryptionService {
    if (!EncryptionService.instance) {
      EncryptionService.instance = new EncryptionService();
    }
    return EncryptionService.instance;
  }

  /**
   * Initialize encryption key from secure storage or generate new one
   * Uses Expo SecureStore (backed by iOS Keychain / Android Keystore)
   */
  async initialize(): Promise<void> {
    try {
      let key = await SecureStore.getItemAsync(this.KEY_NAME);

      if (!key) {
        // Generate new 256-bit key using cryptographically secure random
        // Use the random bytes directly to maintain full 256-bit entropy
        // DO NOT hash - hashing would reduce entropy to ~128 bits (collision resistance)
        const randomBytes = await Crypto.getRandomBytesAsync(32); // 32 bytes = 256 bits
        key = Array.from(randomBytes)
          .map((b) => b.toString(16).padStart(2, "0"))
          .join("");

        await SecureStore.setItemAsync(this.KEY_NAME, key);
      }

      this.encryptionKey = key;
    } catch (error) {
      logger.error("Encryption key initialization failed:", error);
      throw new Error("Failed to initialize encryption");
    }
  }

  /**
   * Encrypt data using AES-256-CBC with HMAC authentication
   */
  encrypt(data: any): string | null {
    if (!this.encryptionKey) {
      logger.error("Encryption key not initialized");
      return null;
    }

    try {
      const plaintext = JSON.stringify(data);
      const iv = CryptoJS.lib.WordArray.random(16);

      const encrypted = CryptoJS.AES.encrypt(plaintext, this.encryptionKey, {
        iv,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7,
      });

      // Create HMAC for authentication
      const hmac = CryptoJS.HmacSHA256(
        iv.toString() + encrypted.ciphertext.toString(),
        this.encryptionKey,
      );

      const metadata: EncryptionMetadata = {
        version: this.VERSION,
        algorithm: this.ALGORITHM,
        timestamp: Date.now(),
      };

      const package_ = {
        metadata,
        iv: iv.toString(),
        ciphertext: encrypted.ciphertext.toString(),
        hmac: hmac.toString(),
      };

      return CryptoJS.enc.Base64.stringify(
        CryptoJS.enc.Utf8.parse(JSON.stringify(package_)),
      );
    } catch (error) {
      logger.error("Encryption failed:", error);
      return null;
    }
  }

  /**
   * Decrypt data and verify HMAC authentication
   */
  decrypt(encryptedData: string): any | null {
    if (!this.encryptionKey) {
      logger.error("Encryption key not initialized");
      return null;
    }

    try {
      const packageStr = CryptoJS.enc.Base64.parse(encryptedData).toString(
        CryptoJS.enc.Utf8,
      );
      const package_ = JSON.parse(packageStr);

      // Verify HMAC
      const computedHmac = CryptoJS.HmacSHA256(
        package_.iv + package_.ciphertext,
        this.encryptionKey,
      ).toString();

      if (computedHmac !== package_.hmac) {
        logger.error("HMAC verification failed");
        return null;
      }

      // Decrypt
      const iv = CryptoJS.enc.Hex.parse(package_.iv);
      const ciphertext = CryptoJS.enc.Hex.parse(package_.ciphertext);

      const decrypted = CryptoJS.AES.decrypt(
        { ciphertext } as any,
        this.encryptionKey,
        {
          iv,
          mode: CryptoJS.mode.CBC,
          padding: CryptoJS.pad.Pkcs7,
        },
      );

      const plaintext = decrypted.toString(CryptoJS.enc.Utf8);

      if (!plaintext) {
        return null;
      }

      return JSON.parse(plaintext);
    } catch (error) {
      logger.error("Decryption failed:", error);
      return null;
    }
  }

  /**
   * Check if data is encrypted
   */
  isEncrypted(data: any): boolean {
    if (typeof data !== "string") return false;

    try {
      const packageStr = CryptoJS.enc.Base64.parse(data).toString(
        CryptoJS.enc.Utf8,
      );
      const package_ = JSON.parse(packageStr);
      return !!(
        package_.metadata &&
        package_.iv &&
        package_.ciphertext &&
        package_.hmac
      );
    } catch {
      return false;
    }
  }

  /**
   * Rotate encryption key (enhanced security)
   */
  async rotateKey(): Promise<boolean> {
    try {
      const randomBytes = await Crypto.getRandomBytesAsync(32);
      const randomHex = Array.from(randomBytes)
        .map((b) => b.toString(16).padStart(2, "0"))
        .join("");

      const newKey = await Crypto.digestStringAsync(
        Crypto.CryptoDigestAlgorithm.SHA256,
        randomHex,
      );

      await SecureStore.setItemAsync(this.KEY_NAME, newKey);
      this.encryptionKey = newKey;

      return true;
    } catch (error) {
      logger.error("Key rotation failed:", error);
      return false;
    }
  }

  /**
   * Delete encryption key (logout/account deletion)
   */
  async deleteKey(): Promise<void> {
    try {
      await SecureStore.deleteItemAsync(this.KEY_NAME);
      this.encryptionKey = null;
    } catch (error) {
      logger.error("Key deletion failed:", error);
      throw error;
    }
  }
}

export const encryptionService = EncryptionService.getInstance();
export default encryptionService;
