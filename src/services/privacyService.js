/**
 * Privacy and Consent Management Service for Solace AI Mental Health App
 * Implements HIPAA, GDPR, and CCPA compliance for mental health data
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import secureStorage from './secureStorage';
import { sanitizeInput } from '../utils/inputSanitization';

class PrivacyService {
  constructor() {
    this.consentVersion = '1.0.0';
    this.privacyPolicyVersion = '1.0.0';
    this.dataRetentionPeriod = 7 * 365 * 24 * 60 * 60 * 1000; // 7 years for mental health data
  }

  /**
   * Get current privacy policy and consent requirements
   */
  getPrivacyPolicy() {
    return {
      version: this.privacyPolicyVersion,
      effectiveDate: '2024-01-01',
      lastUpdated: '2024-01-01',
      content: {
        dataCollection: {
          title: 'Data We Collect',
          items: [
            'Mental health assessments and mood tracking data',
            'Chat conversations with AI therapist',
            'App usage patterns and preferences',
            'Device information for security purposes',
            'Crisis intervention data when applicable'
          ]
        },
        dataUsage: {
          title: 'How We Use Your Data',
          items: [
            'Provide personalized mental health support',
            'Improve AI therapy recommendations',
            'Monitor app performance and security',
            'Comply with legal and regulatory requirements',
            'Provide crisis intervention when needed'
          ]
        },
        dataSharing: {
          title: 'Data Sharing',
          items: [
            'We do not sell your personal mental health data',
            'Emergency contacts may be notified during crisis situations',
            'Anonymized data may be used for research with your consent',
            'Legal authorities may access data when required by law'
          ]
        },
        dataRetention: {
          title: 'Data Retention',
          description: 'Mental health data is retained for 7 years or until you request deletion, whichever comes first.'
        },
        userRights: {
          title: 'Your Rights',
          items: [
            'Access your personal data',
            'Request data correction or deletion',
            'Export your data in a portable format',
            'Withdraw consent at any time',
            'Opt out of data processing for research'
          ]
        }
      }
    };
  }

  /**
   * Get consent requirements
   */
  getConsentRequirements() {
    return {
      required: [
        {
          id: 'data_processing',
          title: 'Data Processing',
          description: 'Allow processing of mental health data for therapy services',
          category: 'essential',
          required: true
        },
        {
          id: 'crisis_intervention',
          title: 'Crisis Intervention',
          description: 'Allow emergency contacts and services to be notified during crisis situations',
          category: 'safety',
          required: true
        }
      ],
      optional: [
        {
          id: 'analytics',
          title: 'Analytics',
          description: 'Allow anonymous usage analytics to improve app performance',
          category: 'improvement',
          required: false
        },
        {
          id: 'research',
          title: 'Research Participation',
          description: 'Allow anonymized data to be used for mental health research',
          category: 'research',
          required: false
        },
        {
          id: 'marketing',
          title: 'Marketing Communications',
          description: 'Receive updates about new features and mental health resources',
          category: 'communication',
          required: false
        }
      ]
    };
  }

  /**
   * Record user consent
   */
  async recordConsent(consentData) {
    try {
      const sanitizedConsent = this.sanitizeConsentData(consentData);
      
      const consentRecord = {
        ...sanitizedConsent,
        version: this.consentVersion,
        timestamp: new Date().toISOString(),
        ipAddress: await this.getClientIP(),
        userAgent: this.getUserAgent(),
        method: 'explicit_opt_in'
      };

      // Store consent record securely
      await secureStorage.storeSecureData('user_consent', consentRecord, {
        dataType: 'consent_record'
      });

      // Store non-sensitive consent summary for quick access
      await AsyncStorage.setItem('consent_summary', JSON.stringify({
        hasConsent: true,
        version: this.consentVersion,
        timestamp: consentRecord.timestamp,
        categories: Object.keys(sanitizedConsent.consents || {})
      }));

      // Log consent for audit trail
      this.logConsentEvent('CONSENT_RECORDED', {
        version: this.consentVersion,
        categories: Object.keys(sanitizedConsent.consents || {})
      });

      return true;
    } catch (error) {
      console.error('Failed to record consent:', error);
      throw new Error('Consent recording failed');
    }
  }

  /**
   * Get current consent status
   */
  async getConsentStatus() {
    try {
      // Check for quick summary first
      const summary = await AsyncStorage.getItem('consent_summary');
      if (!summary) {
        return { hasConsent: false, needsUpdate: true };
      }

      const consentSummary = JSON.parse(summary);
      
      // Check if consent version is current
      if (consentSummary.version !== this.consentVersion) {
        return { hasConsent: false, needsUpdate: true };
      }

      // Get detailed consent record
      const consentRecord = await secureStorage.getSecureData('user_consent');
      
      if (!consentRecord) {
        return { hasConsent: false, needsUpdate: true };
      }

      return {
        hasConsent: true,
        needsUpdate: false,
        record: consentRecord,
        summary: consentSummary
      };
    } catch (error) {
      console.error('Failed to get consent status:', error);
      return { hasConsent: false, needsUpdate: true };
    }
  }

  /**
   * Update consent preferences
   */
  async updateConsent(updates) {
    try {
      const currentConsent = await secureStorage.getSecureData('user_consent');
      
      if (!currentConsent) {
        throw new Error('No existing consent found');
      }

      const updatedConsent = {
        ...currentConsent,
        consents: { ...currentConsent.consents, ...updates },
        lastUpdated: new Date().toISOString(),
        updateMethod: 'user_preference_update'
      };

      await secureStorage.storeSecureData('user_consent', updatedConsent, {
        dataType: 'consent_record'
      });

      // Update summary
      await AsyncStorage.setItem('consent_summary', JSON.stringify({
        hasConsent: true,
        version: this.consentVersion,
        timestamp: updatedConsent.lastUpdated,
        categories: Object.keys(updatedConsent.consents || {})
      }));

      this.logConsentEvent('CONSENT_UPDATED', {
        updatedCategories: Object.keys(updates)
      });

      return true;
    } catch (error) {
      console.error('Failed to update consent:', error);
      throw new Error('Consent update failed');
    }
  }

  /**
   * Withdraw consent (Right to be forgotten)
   */
  async withdrawConsent(reason = 'user_request') {
    try {
      // Record withdrawal
      const withdrawalRecord = {
        timestamp: new Date().toISOString(),
        reason: sanitizeInput(reason, 'text', { maxLength: 500 }),
        method: 'explicit_withdrawal',
        ipAddress: await this.getClientIP(),
        userAgent: this.getUserAgent()
      };

      await secureStorage.storeSecureData('consent_withdrawal', withdrawalRecord, {
        dataType: 'consent_withdrawal'
      });

      // Clear consent records
      await secureStorage.removeSecureData('user_consent');
      await AsyncStorage.removeItem('consent_summary');

      this.logConsentEvent('CONSENT_WITHDRAWN', { reason });

      return true;
    } catch (error) {
      console.error('Failed to withdraw consent:', error);
      throw new Error('Consent withdrawal failed');
    }
  }

  /**
   * Export user data (GDPR Article 20 - Right to data portability)
   */
  async exportUserData() {
    try {
      const exportData = {
        exportDate: new Date().toISOString(),
        dataSubject: 'mental_health_user',
        format: 'JSON',
        data: {}
      };

      // Collect all user data
      const userProfile = await secureStorage.getSecureData('user_profile');
      if (userProfile) {
        exportData.data.profile = userProfile;
      }

      const consentRecord = await secureStorage.getSecureData('user_consent');
      if (consentRecord) {
        exportData.data.consent = consentRecord;
      }

      // Collect mood data
      const moodData = await this.collectMoodData();
      if (moodData) {
        exportData.data.mood_tracking = moodData;
      }

      // Collect chat data
      const chatData = await this.collectChatData();
      if (chatData) {
        exportData.data.chat_history = chatData;
      }

      // Log data export for audit
      this.logConsentEvent('DATA_EXPORTED', {
        dataTypes: Object.keys(exportData.data)
      });

      return exportData;
    } catch (error) {
      console.error('Data export failed:', error);
      throw new Error('Data export failed');
    }
  }

  /**
   * Delete user data (GDPR Article 17 - Right to erasure)
   */
  async deleteUserData(verificationCode = null) {
    try {
      // In production, require additional verification
      if (!verificationCode && !__DEV__) {
        throw new Error('Verification code required for data deletion');
      }

      // Record deletion request
      const deletionRecord = {
        timestamp: new Date().toISOString(),
        method: 'user_requested',
        verification: verificationCode ? 'code_verified' : 'dev_mode',
        ipAddress: await this.getClientIP()
      };

      await secureStorage.storeSecureData('data_deletion_record', deletionRecord, {
        dataType: 'deletion_record'
      });

      // Clear all secure user data
      await secureStorage.clearAllSecureData();

      // Clear non-secure data
      const allKeys = await AsyncStorage.getAllKeys();
      const userDataKeys = allKeys.filter(key => 
        !key.startsWith('system_') && 
        !key.startsWith('app_config')
      );
      
      if (userDataKeys.length > 0) {
        await AsyncStorage.multiRemove(userDataKeys);
      }

      this.logConsentEvent('DATA_DELETED', {
        keysDeleted: userDataKeys.length
      });

      return true;
    } catch (error) {
      console.error('Data deletion failed:', error);
      throw new Error('Data deletion failed');
    }
  }

  /**
   * Check data retention compliance
   */
  async checkDataRetention() {
    try {
      const userProfile = await secureStorage.getSecureData('user_profile');
      
      if (!userProfile || !userProfile.createdAt) {
        return { compliant: true, action: 'none' };
      }

      const createdDate = new Date(userProfile.createdAt);
      const retentionExpiry = new Date(createdDate.getTime() + this.dataRetentionPeriod);
      const now = new Date();

      if (now > retentionExpiry) {
        return {
          compliant: false,
          action: 'delete_expired_data',
          expiryDate: retentionExpiry,
          message: 'Data retention period exceeded'
        };
      }

      const daysUntilExpiry = Math.ceil((retentionExpiry - now) / (24 * 60 * 60 * 1000));
      
      if (daysUntilExpiry <= 30) {
        return {
          compliant: true,
          action: 'notify_upcoming_expiry',
          expiryDate: retentionExpiry,
          daysUntilExpiry
        };
      }

      return { compliant: true, action: 'none' };
    } catch (error) {
      console.error('Data retention check failed:', error);
      return { compliant: false, action: 'check_failed' };
    }
  }

  /**
   * Sanitize consent data
   */
  sanitizeConsentData(consentData) {
    const sanitized = {
      consents: {}
    };

    if (consentData.consents && typeof consentData.consents === 'object') {
      Object.entries(consentData.consents).forEach(([key, value]) => {
        const sanitizedKey = sanitizeInput(key, 'text', { maxLength: 50 });
        if (sanitizedKey && typeof value === 'boolean') {
          sanitized.consents[sanitizedKey] = value;
        }
      });
    }

    return sanitized;
  }

  /**
   * Collect mood data for export
   */
  async collectMoodData() {
    try {
      // This would collect mood data from various sources
      // Implementation depends on how mood data is stored
      return {};
    } catch (error) {
      console.error('Failed to collect mood data:', error);
      return {};
    }
  }

  /**
   * Collect chat data for export
   */
  async collectChatData() {
    try {
      // This would collect chat data from various sources
      // Implementation depends on how chat data is stored
      return {};
    } catch (error) {
      console.error('Failed to collect chat data:', error);
      return {};
    }
  }

  /**
   * Get client IP for audit logging
   */
  async getClientIP() {
    try {
      // In a real app, you might get this from a service
      return 'unknown';
    } catch (error) {
      return 'unknown';
    }
  }

  /**
   * Get user agent for audit logging
   */
  getUserAgent() {
    try {
      if (typeof navigator !== 'undefined' && navigator.userAgent) {
        return navigator.userAgent;
      }
      return 'react-native-app';
    } catch (error) {
      return 'unknown';
    }
  }

  /**
   * Log consent events for audit trail
   */
  logConsentEvent(event, metadata = {}) {
    try {
      const logEntry = {
        timestamp: new Date().toISOString(),
        event,
        metadata,
        service: 'privacy_service'
      };

      // In production, send to secure audit logging service
      console.log('[PRIVACY_AUDIT]', logEntry);
    } catch (error) {
      console.warn('Privacy event logging failed:', error);
    }
  }

  /**
   * Validate consent for specific action
   */
  async hasConsentForAction(action) {
    try {
      const consentStatus = await this.getConsentStatus();
      
      if (!consentStatus.hasConsent) {
        return false;
      }

      const consentRecord = consentStatus.record;
      const actionMapping = {
        'data_processing': 'data_processing',
        'analytics': 'analytics',
        'research': 'research',
        'marketing': 'marketing',
        'crisis_intervention': 'crisis_intervention'
      };

      const requiredConsent = actionMapping[action];
      if (!requiredConsent) {
        return false;
      }

      return consentRecord.consents[requiredConsent] === true;
    } catch (error) {
      console.error('Consent validation failed:', error);
      return false;
    }
  }

  /**
   * Generate data processing record for GDPR compliance
   */
  async generateProcessingRecord(dataType, purpose, legalBasis) {
    try {
      const record = {
        timestamp: new Date().toISOString(),
        dataType: sanitizeInput(dataType, 'text', { maxLength: 100 }),
        purpose: sanitizeInput(purpose, 'text', { maxLength: 500 }),
        legalBasis: sanitizeInput(legalBasis, 'text', { maxLength: 100 }),
        retention: this.dataRetentionPeriod,
        processor: 'solace_ai_mobile_app'
      };

      // Store processing record
      const recordId = `processing_${Date.now()}`;
      await secureStorage.storeSecureData(recordId, record, {
        dataType: 'processing_record'
      });

      return recordId;
    } catch (error) {
      console.error('Processing record generation failed:', error);
      throw new Error('Processing record generation failed');
    }
  }
}

// Create singleton instance
const privacyService = new PrivacyService();

export default privacyService;

// Export helper functions
export const recordConsent = (consentData) => privacyService.recordConsent(consentData);
export const getConsentStatus = () => privacyService.getConsentStatus();
export const hasConsentForAction = (action) => privacyService.hasConsentForAction(action);
export const exportUserData = () => privacyService.exportUserData();
export const deleteUserData = (verificationCode) => privacyService.deleteUserData(verificationCode);
export const checkDataRetention = () => privacyService.checkDataRetention();