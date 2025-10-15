/**
 * Secure Storage Service for sensitive data
 * Uses AsyncStorage with encryption for sensitive data
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import { STORAGE_CONFIG } from '../../shared/config/environment';

class SecureStorage {
  constructor() {
    this.encryptionKey = STORAGE_CONFIG.encryptionKey;
  }

  /**
   * Encrypt data using simple XOR encryption (for demo purposes)
   * In production, use a proper encryption library like react-native-keychain
   * @param {string} data - Data to encrypt
   * @returns {string} Encrypted data
   */
  _encrypt(data) {
    if (!data) return data;

    let result = '';
    for (let i = 0; i < data.length; i++) {
      const charCode = data.charCodeAt(i) ^ this.encryptionKey.charCodeAt(i % this.encryptionKey.length);
      result += String.fromCharCode(charCode);
    }
    return btoa(result); // Base64 encode
  }

  /**
   * Decrypt data
   * @param {string} encryptedData - Data to decrypt
   * @returns {string} Decrypted data
   */
  _decrypt(encryptedData) {
    if (!encryptedData) return encryptedData;

    try {
      const decoded = atob(encryptedData); // Base64 decode
      let result = '';
      for (let i = 0; i < decoded.length; i++) {
        const charCode = decoded.charCodeAt(i) ^ this.encryptionKey.charCodeAt(i % this.encryptionKey.length);
        result += String.fromCharCode(charCode);
      }
      return result;
    } catch (error) {
      console.warn('Failed to decrypt data:', error);
      return null;
    }
  }

  /**
   * Store data securely
   * @param {string} key - Storage key
   * @param {any} data - Data to store
   * @param {Object} options - Storage options
   * @param {boolean} options.encrypt - Whether to encrypt the data
   * @param {string} options.dataType - Type of data being stored
   */
  async storeSecureData(key, data, options = {}) {
    try {
      const { encrypt = true, dataType = 'general' } = options;

      const storageData = {
        data,
        dataType,
        timestamp: Date.now(),
        version: '1.0',
      };

      let dataToStore = JSON.stringify(storageData);

      // Encrypt sensitive data
      if (encrypt) {
        dataToStore = this._encrypt(dataToStore);
      }

      const fullKey = `${STORAGE_CONFIG.keyPrefix}${key}`;
      await AsyncStorage.setItem(fullKey, dataToStore);

    } catch (error) {
      console.error('Failed to store secure data:', error);
      throw new Error(`Secure storage failed: ${error.message}`);
    }
  }

  /**
   * Retrieve data from secure storage
   * @param {string} key - Storage key
   * @returns {Promise<any>} Retrieved data or null
   */
  async getSecureData(key) {
    try {
      const fullKey = `${STORAGE_CONFIG.keyPrefix}${key}`;
      const storedData = await AsyncStorage.getItem(fullKey);

      if (!storedData) {
        return null;
      }

      let parsedData;
      try {
        // Try to decrypt first (for encrypted data)
        const decrypted = this._decrypt(storedData);
        parsedData = JSON.parse(decrypted);
      } catch {
        // If decryption fails, try parsing as plain JSON (backwards compatibility)
        parsedData = JSON.parse(storedData);
      }

      // Validate data structure
      if (!parsedData || typeof parsedData !== 'object') {
        return null;
      }

      return parsedData.data;
    } catch (error) {
      console.warn('Failed to retrieve secure data:', error);
      return null;
    }
  }

  /**
   * Remove data from secure storage
   * @param {string} key - Storage key
   */
  async removeSecureData(key) {
    try {
      const fullKey = `${STORAGE_CONFIG.keyPrefix}${key}`;
      await AsyncStorage.removeItem(fullKey);
    } catch (error) {
      console.warn('Failed to remove secure data:', error);
      // Don't throw - removal should be best effort
    }
  }

  /**
   * Clear all secure storage data
   */
  async clearAllSecureData() {
    try {
      const keys = await AsyncStorage.getAllKeys();
      const secureKeys = keys.filter(key => key.startsWith(STORAGE_CONFIG.keyPrefix));
      await AsyncStorage.multiRemove(secureKeys);
    } catch (error) {
      console.warn('Failed to clear all secure data:', error);
      throw new Error(`Clear secure storage failed: ${error.message}`);
    }
  }

  /**
   * Get all stored keys
   * @returns {Promise<string[]>} Array of stored keys
   */
  async getAllKeys() {
    try {
      const keys = await AsyncStorage.getAllKeys();
      return keys
        .filter(key => key.startsWith(STORAGE_CONFIG.keyPrefix))
        .map(key => key.replace(STORAGE_CONFIG.keyPrefix, ''));
    } catch (error) {
      console.warn('Failed to get all keys:', error);
      return [];
    }
  }

  /**
   * Check if data exists for a key
   * @param {string} key - Storage key
   * @returns {Promise<boolean>} True if data exists
   */
  async hasData(key) {
    try {
      const data = await this.getSecureData(key);
      return data !== null;
    } catch (error) {
      console.warn('Failed to check data existence:', error);
      return false;
    }
  }

  /**
   * Store sensitive data with additional security measures
   * @param {string} key - Storage key
   * @param {any} data - Sensitive data to store
   */
  async storeSensitiveData(key, data) {
    return this.storeSecureData(key, data, {
      encrypt: true,
      dataType: 'sensitive'
    });
  }

  /**
   * Store non-sensitive data without encryption
   * @param {string} key - Storage key
   * @param {any} data - Data to store
   */
  async storeData(key, data) {
    return this.storeSecureData(key, data, {
      encrypt: false,
      dataType: 'general'
    });
  }

  /**
   * Migrate data from old storage format
   * @param {string} oldKey - Old storage key
   * @param {string} newKey - New storage key
   */
  async migrateData(oldKey, newKey) {
    try {
      const data = await AsyncStorage.getItem(oldKey);
      if (data) {
        await this.storeSecureData(newKey, JSON.parse(data));
        await AsyncStorage.removeItem(oldKey);
      }
    } catch (error) {
      console.warn('Failed to migrate data:', error);
    }
  }
}

// Export singleton instance
const secureStorage = new SecureStorage();
export default secureStorage;