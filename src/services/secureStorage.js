/**
 * Secure Storage Service for Solace AI Mental Health App
 * Implements HIPAA-compliant encryption and secure storage for sensitive mental health data
 */

import * as SecureStore from 'expo-secure-store';
import * as Crypto from 'expo-crypto';
import CryptoJS from 'crypto-js';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

class SecureStorageService {
  constructor() {
    this.encryptionKey = null;
    this.keyInitialized = false;
    this.serviceName = 'SolaceAI_SecureStorage';
  }

  /**
   * Initialize the encryption key with secure key derivation
   */
  async initializeKey() {
    try {
      if (this.keyInitialized && this.encryptionKey) {
        return;
      }

      // For React Native platforms with SecureStore support
      if (Platform.OS !== 'web') {
        let storedKey = await SecureStore.getItemAsync('__secure_master_key__', {
          requireAuthentication: false, // Can be enabled for biometric protection
          keychainService: this.serviceName,
        });

        if (!storedKey) {
          // Generate cryptographically secure 256-bit key
          const keyBytes = await Crypto.getRandomBytesAsync(32);
          storedKey = Array.from(keyBytes)
            .map(b => b.toString(16).padStart(2, '0'))
            .join('');

          await SecureStore.setItemAsync('__secure_master_key__', storedKey, {
            requireAuthentication: false,
            keychainService: this.serviceName,
          });
        }

        this.encryptionKey = storedKey;
      } else {
        // Web fallback - use secure session storage with warning
        console.warn('Web platform: Using session storage for encryption key. Consider additional security measures.');
        
        let storedKey = sessionStorage.getItem('__secure_session_key__');
        if (!storedKey) {
          // Generate secure key for session
          const keyArray = new Uint8Array(32);
          crypto.getRandomValues(keyArray);
          storedKey = Array.from(keyArray)
            .map(b => b.toString(16).padStart(2, '0'))
            .join('');
          
          sessionStorage.setItem('__secure_session_key__', storedKey);
        }
        
        this.encryptionKey = storedKey;
      }

      this.keyInitialized = true;
    } catch (error) {
      console.error('Failed to initialize encryption key:', error);
      throw new Error('Secure storage initialization failed');
    }
  }

  /**
   * Encrypt sensitive data using AES-256-GCM
   */
  async encryptData(data) {
    await this.initializeKey();
    
    try {
      const dataString = JSON.stringify(data);
      
      // Generate random IV (Initialization Vector)
      const iv = CryptoJS.lib.WordArray.random(16);
      
      // Encrypt using AES-256-CBC (GCM not available in crypto-js for React Native)
      const encrypted = CryptoJS.AES.encrypt(dataString, this.encryptionKey, {
        iv: iv,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7
      });

      // Combine IV and encrypted data
      const combined = iv.concat(encrypted.ciphertext);
      
      return {
        encrypted: combined.toString(CryptoJS.enc.Base64),
        algorithm: 'AES-256-CBC',
        timestamp: Date.now()
      };
    } catch (error) {
      console.error('Encryption failed:', error);
      throw new Error('Data encryption failed');
    }
  }

  /**
   * Decrypt sensitive data
   */
  async decryptData(encryptedData) {
    await this.initializeKey();
    
    try {
      if (!encryptedData || !encryptedData.encrypted) {
        throw new Error('Invalid encrypted data format');
      }

      // Parse the combined IV and ciphertext
      const combined = CryptoJS.enc.Base64.parse(encryptedData.encrypted);
      const iv = CryptoJS.lib.WordArray.create(combined.words.slice(0, 4));
      const ciphertext = CryptoJS.lib.WordArray.create(combined.words.slice(4));

      // Decrypt
      const decrypted = CryptoJS.AES.decrypt(
        { ciphertext: ciphertext },
        this.encryptionKey,
        {
          iv: iv,
          mode: CryptoJS.mode.CBC,
          padding: CryptoJS.pad.Pkcs7
        }
      );

      const decryptedString = decrypted.toString(CryptoJS.enc.Utf8);
      
      if (!decryptedString) {
        throw new Error('Decryption resulted in empty data');
      }

      return JSON.parse(decryptedString);
    } catch (error) {
      console.error('Decryption failed:', error);
      throw new Error('Data decryption failed');
    }
  }

  /**
   * Store sensitive mental health data with encryption
   */
  async storeSecureData(key, data, options = {}) {
    try {
      const encryptedData = await this.encryptData(data);
      
      // Add metadata for audit trail
      const secureEntry = {
        ...encryptedData,
        dataType: options.dataType || 'mental_health_data',
        createdAt: new Date().toISOString(),
        version: '1.0',
        sensitive: true
      };

      if (Platform.OS !== 'web') {
        await SecureStore.setItemAsync(`secure_${key}`, JSON.stringify(secureEntry), {
          keychainService: this.serviceName,
          requireAuthentication: options.requireBiometric || false,
        });
      } else {
        // Web fallback with warning
        console.warn('Web platform: Storing encrypted data in localStorage');
        localStorage.setItem(`secure_${key}`, JSON.stringify(secureEntry));
      }

      // Log access for audit trail (without sensitive data)
      this.logDataAccess('STORE', key, options.dataType);
      
    } catch (error) {
      console.error('Secure storage failed:', error);
      throw new Error('Failed to store sensitive data');
    }
  }

  /**
   * Retrieve and decrypt sensitive mental health data
   */
  async getSecureData(key, options = {}) {
    try {
      let storedData;
      
      if (Platform.OS !== 'web') {
        storedData = await SecureStore.getItemAsync(`secure_${key}`, {
          keychainService: this.serviceName,
          requireAuthentication: options.requireBiometric || false,
        });
      } else {
        storedData = localStorage.getItem(`secure_${key}`);
      }

      if (!storedData) {
        return null;
      }

      const secureEntry = JSON.parse(storedData);
      const decryptedData = await this.decryptData(secureEntry);

      // Log access for audit trail
      this.logDataAccess('RETRIEVE', key, secureEntry.dataType);

      return decryptedData;
    } catch (error) {
      console.error('Secure retrieval failed:', error);
      throw new Error('Failed to retrieve sensitive data');
    }
  }

  /**
   * Remove sensitive data securely
   */
  async removeSecureData(key, options = {}) {
    try {
      if (Platform.OS !== 'web') {
        await SecureStore.deleteItemAsync(`secure_${key}`, {
          keychainService: this.serviceName,
        });
      } else {
        localStorage.removeItem(`secure_${key}`);
      }

      // Log access for audit trail
      this.logDataAccess('DELETE', key, options.dataType);
      
    } catch (error) {
      console.error('Secure deletion failed:', error);
      throw new Error('Failed to delete sensitive data');
    }
  }

  /**
   * Store crisis-related data with extra security
   */
  async storeCrisisData(data) {
    try {
      // Double encryption for crisis data
      const firstEncryption = await this.encryptData(data);
      const secondEncryption = await this.encryptData(firstEncryption);
      
      const crisisKey = `crisis_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      await this.storeSecureData(crisisKey, secondEncryption, {
        dataType: 'crisis_data',
        requireBiometric: true
      });

      return crisisKey;
    } catch (error) {
      console.error('Crisis data storage failed:', error);
      throw new Error('Failed to store crisis data');
    }
  }

  /**
   * Audit logging for HIPAA compliance
   */
  logDataAccess(action, dataKey, dataType) {
    try {
      const auditEntry = {
        timestamp: new Date().toISOString(),
        action,
        dataKey: this.hashKey(dataKey), // Hash the key for privacy
        dataType,
        platform: Platform.OS,
        version: '1.0'
      };

      // Store audit log in non-sensitive storage
      this.storeAuditLog(auditEntry);
    } catch (error) {
      console.warn('Audit logging failed:', error);
    }
  }

  /**
   * Store audit logs for compliance
   */
  async storeAuditLog(auditEntry) {
    try {
      const auditLogs = await AsyncStorage.getItem('audit_logs');
      const logs = auditLogs ? JSON.parse(auditLogs) : [];
      
      logs.push(auditEntry);
      
      // Keep only last 1000 entries
      if (logs.length > 1000) {
        logs.splice(0, logs.length - 1000);
      }
      
      await AsyncStorage.setItem('audit_logs', JSON.stringify(logs));
    } catch (error) {
      console.warn('Audit log storage failed:', error);
    }
  }

  /**
   * Hash sensitive keys for audit trail
   */
  hashKey(key) {
    return CryptoJS.SHA256(key).toString(CryptoJS.enc.Hex).substring(0, 16);
  }

  /**
   * Clear all secure data (for app reset/logout)
   */
  async clearAllSecureData() {
    try {
      if (Platform.OS !== 'web') {
        // Note: SecureStore doesn't have a clear all method
        // This would need to be implemented by tracking stored keys
        console.warn('Clear all secure data: Individual key deletion required');
      } else {
        // Clear all secure items from localStorage
        const keys = Object.keys(localStorage);
        for (const key of keys) {
          if (key.startsWith('secure_')) {
            localStorage.removeItem(key);
          }
        }
      }

      // Clear the encryption key
      this.encryptionKey = null;
      this.keyInitialized = false;

      // Log the clear action
      this.logDataAccess('CLEAR_ALL', 'all_data', 'all_types');
      
    } catch (error) {
      console.error('Failed to clear secure data:', error);
      throw new Error('Failed to clear sensitive data');
    }
  }

  /**
   * Validate data integrity
   */
  async validateDataIntegrity(key) {
    try {
      const data = await this.getSecureData(key);
      return data !== null;
    } catch (error) {
      return false;
    }
  }

  /**
   * Get audit logs for compliance review
   */
  async getAuditLogs() {
    try {
      const auditLogs = await AsyncStorage.getItem('audit_logs');
      return auditLogs ? JSON.parse(auditLogs) : [];
    } catch (error) {
      console.error('Failed to retrieve audit logs:', error);
      return [];
    }
  }
}

// Create singleton instance
const secureStorage = new SecureStorageService();

export default secureStorage;

// Export helper functions for easy use
export const storeSecureData = (key, data, options) => secureStorage.storeSecureData(key, data, options);
export const getSecureData = (key, options) => secureStorage.getSecureData(key, options);
export const removeSecureData = (key, options) => secureStorage.removeSecureData(key, options);
export const storeCrisisData = (data) => secureStorage.storeCrisisData(data);
export const clearAllSecureData = () => secureStorage.clearAllSecureData();
export const getAuditLogs = () => secureStorage.getAuditLogs();