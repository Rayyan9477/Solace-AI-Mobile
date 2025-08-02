import AsyncStorage from '@react-native-async-storage/async-storage';
import CryptoJS from 'crypto-js';

class SecureStorageService {
  constructor() {
    // Generate a unique encryption key per device
    this.encryptionKey = this.generateEncryptionKey();
    this.initializeKey();
  }

  async initializeKey() {
    try {
      // Check if we have a stored key
      const storedKey = await AsyncStorage.getItem('__secure_key__');
      if (storedKey) {
        this.encryptionKey = storedKey;
      } else {
        // Generate and store new key
        const newKey = this.generateEncryptionKey();
        await AsyncStorage.setItem('__secure_key__', newKey);
        this.encryptionKey = newKey;
      }
    } catch (error) {
      console.error('Error initializing encryption key:', error);
    }
  }

  generateEncryptionKey() {
    // Generate a secure random key
    return CryptoJS.lib.WordArray.random(256/8).toString();
  }

  encrypt(data) {
    try {
      const encrypted = CryptoJS.AES.encrypt(JSON.stringify(data), this.encryptionKey).toString();
      return encrypted;
    } catch (error) {
      console.error('Encryption error:', error);
      return null;
    }
  }

  decrypt(encryptedData) {
    try {
      const decrypted = CryptoJS.AES.decrypt(encryptedData, this.encryptionKey);
      const decryptedString = decrypted.toString(CryptoJS.enc.Utf8);
      return JSON.parse(decryptedString);
    } catch (error) {
      console.error('Decryption error:', error);
      return null;
    }
  }

  // Mental Health Data Storage Methods
  async storeMoodData(moodData) {
    try {
      const timestamp = new Date().toISOString();
      const dataWithTimestamp = {
        ...moodData,
        stored_at: timestamp,
        id: moodData.id || `mood_${Date.now()}`,
      };

      const encrypted = this.encrypt(dataWithTimestamp);
      if (!encrypted) throw new Error('Failed to encrypt mood data');

      await AsyncStorage.setItem(`secure_mood_${dataWithTimestamp.id}`, encrypted);
      
      // Update mood data index
      await this.updateMoodDataIndex(dataWithTimestamp.id);
      
      console.log('Mood data stored securely');
      return dataWithTimestamp.id;
    } catch (error) {
      console.error('Error storing mood data:', error);
      throw error;
    }
  }

  async getMoodData(moodId) {
    try {
      const encrypted = await AsyncStorage.getItem(`secure_mood_${moodId}`);
      if (!encrypted) return null;

      const decrypted = this.decrypt(encrypted);
      return decrypted;
    } catch (error) {
      console.error('Error retrieving mood data:', error);
      return null;
    }
  }

  async getAllMoodData() {
    try {
      const index = await this.getMoodDataIndex();
      const moodDataPromises = index.map(id => this.getMoodData(id));
      const moodDataArray = await Promise.all(moodDataPromises);
      
      // Filter out null values and sort by timestamp
      return moodDataArray
        .filter(data => data !== null)
        .sort((a, b) => new Date(b.stored_at) - new Date(a.stored_at));
    } catch (error) {
      console.error('Error retrieving all mood data:', error);
      return [];
    }
  }

  async updateMoodDataIndex(moodId) {
    try {
      const index = await this.getMoodDataIndex();
      if (!index.includes(moodId)) {
        index.push(moodId);
        const encrypted = this.encrypt(index);
        await AsyncStorage.setItem('secure_mood_index', encrypted);
      }
    } catch (error) {
      console.error('Error updating mood data index:', error);
    }
  }

  async getMoodDataIndex() {
    try {
      const encrypted = await AsyncStorage.getItem('secure_mood_index');
      if (!encrypted) return [];
      
      const decrypted = this.decrypt(encrypted);
      return Array.isArray(decrypted) ? decrypted : [];
    } catch (error) {
      console.error('Error retrieving mood data index:', error);
      return [];
    }
  }

  // Assessment Data Storage
  async storeAssessmentData(assessmentData) {
    try {
      const timestamp = new Date().toISOString();
      const dataWithTimestamp = {
        ...assessmentData,
        stored_at: timestamp,
        id: assessmentData.id || `assessment_${Date.now()}`,
        // Add metadata for privacy
        privacy_level: 'high',
        data_type: 'mental_health_assessment'
      };

      const encrypted = this.encrypt(dataWithTimestamp);
      if (!encrypted) throw new Error('Failed to encrypt assessment data');

      await AsyncStorage.setItem(`secure_assessment_${dataWithTimestamp.id}`, encrypted);
      await this.updateAssessmentDataIndex(dataWithTimestamp.id);
      
      console.log('Assessment data stored securely');
      return dataWithTimestamp.id;
    } catch (error) {
      console.error('Error storing assessment data:', error);
      throw error;
    }
  }

  async getAssessmentData(assessmentId) {
    try {
      const encrypted = await AsyncStorage.getItem(`secure_assessment_${assessmentId}`);
      if (!encrypted) return null;

      return this.decrypt(encrypted);
    } catch (error) {
      console.error('Error retrieving assessment data:', error);
      return null;
    }
  }

  async getAllAssessmentData() {
    try {
      const index = await this.getAssessmentDataIndex();
      const assessmentDataPromises = index.map(id => this.getAssessmentData(id));
      const assessmentDataArray = await Promise.all(assessmentDataPromises);
      
      return assessmentDataArray
        .filter(data => data !== null)
        .sort((a, b) => new Date(b.stored_at) - new Date(a.stored_at));
    } catch (error) {
      console.error('Error retrieving all assessment data:', error);
      return [];
    }
  }

  async updateAssessmentDataIndex(assessmentId) {
    try {
      const index = await this.getAssessmentDataIndex();
      if (!index.includes(assessmentId)) {
        index.push(assessmentId);
        const encrypted = this.encrypt(index);
        await AsyncStorage.setItem('secure_assessment_index', encrypted);
      }
    } catch (error) {
      console.error('Error updating assessment data index:', error);
    }
  }

  async getAssessmentDataIndex() {
    try {
      const encrypted = await AsyncStorage.getItem('secure_assessment_index');
      if (!encrypted) return [];
      
      const decrypted = this.decrypt(encrypted);
      return Array.isArray(decrypted) ? decrypted : [];
    } catch (error) {
      console.error('Error retrieving assessment data index:', error);
      return [];
    }
  }

  // Crisis Events Storage (highest security)
  async storeCrisisEvent(crisisData) {
    try {
      const timestamp = new Date().toISOString();
      const dataWithTimestamp = {
        ...crisisData,
        stored_at: timestamp,
        id: crisisData.id || `crisis_${Date.now()}`,
        privacy_level: 'maximum',
        data_type: 'crisis_event',
        // Add additional security metadata
        requires_professional_review: crisisData.severity === 'critical',
      };

      const encrypted = this.encrypt(dataWithTimestamp);
      if (!encrypted) throw new Error('Failed to encrypt crisis data');

      await AsyncStorage.setItem(`secure_crisis_${dataWithTimestamp.id}`, encrypted);
      await this.updateCrisisDataIndex(dataWithTimestamp.id);
      
      console.log('Crisis event stored securely');
      
      // Schedule data review reminder if critical
      if (dataWithTimestamp.requires_professional_review) {
        console.log('Critical crisis event stored - consider professional review');
      }
      
      return dataWithTimestamp.id;
    } catch (error) {
      console.error('Error storing crisis data:', error);
      throw error;
    }
  }

  async getCrisisData(crisisId) {
    try {
      const encrypted = await AsyncStorage.getItem(`secure_crisis_${crisisId}`);
      if (!encrypted) return null;

      return this.decrypt(encrypted);
    } catch (error) {
      console.error('Error retrieving crisis data:', error);
      return null;
    }
  }

  async getAllCrisisData() {
    try {
      const index = await this.getCrisisDataIndex();
      const crisisDataPromises = index.map(id => this.getCrisisData(id));
      const crisisDataArray = await Promise.all(crisisDataPromises);
      
      return crisisDataArray
        .filter(data => data !== null)
        .sort((a, b) => new Date(b.stored_at) - new Date(a.stored_at));
    } catch (error) {
      console.error('Error retrieving all crisis data:', error);
      return [];
    }
  }

  async updateCrisisDataIndex(crisisId) {
    try {
      const index = await this.getCrisisDataIndex();
      if (!index.includes(crisisId)) {
        index.push(crisisId);
        const encrypted = this.encrypt(index);
        await AsyncStorage.setItem('secure_crisis_index', encrypted);
      }
    } catch (error) {
      console.error('Error updating crisis data index:', error);
    }
  }

  async getCrisisDataIndex() {
    try {
      const encrypted = await AsyncStorage.getItem('secure_crisis_index');
      if (!encrypted) return [];
      
      const decrypted = this.decrypt(encrypted);
      return Array.isArray(decrypted) ? decrypted : [];
    } catch (error) {
      console.error('Error retrieving crisis data index:', error);
      return [];
    }
  }

  // User Settings (less sensitive but still encrypted)
  async storeUserSettings(settings) {
    try {
      const encrypted = this.encrypt(settings);
      await AsyncStorage.setItem('secure_user_settings', encrypted);
      console.log('User settings stored securely');
    } catch (error) {
      console.error('Error storing user settings:', error);
      throw error;
    }
  }

  async getUserSettings() {
    try {
      const encrypted = await AsyncStorage.getItem('secure_user_settings');
      if (!encrypted) return null;

      return this.decrypt(encrypted);
    } catch (error) {
      console.error('Error retrieving user settings:', error);
      return null;
    }
  }

  // Data Export (for user data portability)
  async exportUserData() {
    try {
      const moodData = await this.getAllMoodData();
      const assessmentData = await this.getAllAssessmentData();
      const crisisData = await this.getAllCrisisData();
      const settings = await this.getUserSettings();

      const exportData = {
        export_date: new Date().toISOString(),
        data_type: 'mental_health_export',
        mood_entries: moodData,
        assessments: assessmentData,
        crisis_events: crisisData,
        user_settings: settings,
        // Add privacy notice
        privacy_notice: 'This export contains sensitive mental health data. Handle with care and delete when no longer needed.',
      };

      return exportData;
    } catch (error) {
      console.error('Error exporting user data:', error);
      throw error;
    }
  }

  // Data Cleanup
  async deleteMoodData(moodId) {
    try {
      await AsyncStorage.removeItem(`secure_mood_${moodId}`);
      
      // Update index
      const index = await this.getMoodDataIndex();
      const updatedIndex = index.filter(id => id !== moodId);
      const encrypted = this.encrypt(updatedIndex);
      await AsyncStorage.setItem('secure_mood_index', encrypted);
      
      console.log('Mood data deleted securely');
    } catch (error) {
      console.error('Error deleting mood data:', error);
      throw error;
    }
  }

  async deleteAssessmentData(assessmentId) {
    try {
      await AsyncStorage.removeItem(`secure_assessment_${assessmentId}`);
      
      const index = await this.getAssessmentDataIndex();
      const updatedIndex = index.filter(id => id !== assessmentId);
      const encrypted = this.encrypt(updatedIndex);
      await AsyncStorage.setItem('secure_assessment_index', encrypted);
      
      console.log('Assessment data deleted securely');
    } catch (error) {
      console.error('Error deleting assessment data:', error);
      throw error;
    }
  }

  async deleteAllUserData() {
    try {
      // Get all data indices
      const moodIndex = await this.getMoodDataIndex();
      const assessmentIndex = await this.getAssessmentDataIndex();
      const crisisIndex = await this.getCrisisDataIndex();

      // Delete all mood data
      for (const id of moodIndex) {
        await AsyncStorage.removeItem(`secure_mood_${id}`);
      }

      // Delete all assessment data
      for (const id of assessmentIndex) {
        await AsyncStorage.removeItem(`secure_assessment_${id}`);
      }

      // Delete all crisis data
      for (const id of crisisIndex) {
        await AsyncStorage.removeItem(`secure_crisis_${id}`);
      }

      // Delete indices and settings
      await AsyncStorage.removeItem('secure_mood_index');
      await AsyncStorage.removeItem('secure_assessment_index');
      await AsyncStorage.removeItem('secure_crisis_index');
      await AsyncStorage.removeItem('secure_user_settings');

      console.log('All user data deleted securely');
    } catch (error) {
      console.error('Error deleting all user data:', error);
      throw error;
    }
  }

  // Data integrity checks
  async verifyDataIntegrity() {
    try {
      const results = {
        mood_data: { total: 0, corrupted: 0 },
        assessment_data: { total: 0, corrupted: 0 },
        crisis_data: { total: 0, corrupted: 0 },
      };

      // Check mood data
      const moodIndex = await this.getMoodDataIndex();
      results.mood_data.total = moodIndex.length;
      for (const id of moodIndex) {
        const data = await this.getMoodData(id);
        if (!data) results.mood_data.corrupted++;
      }

      // Check assessment data
      const assessmentIndex = await this.getAssessmentDataIndex();
      results.assessment_data.total = assessmentIndex.length;
      for (const id of assessmentIndex) {
        const data = await this.getAssessmentData(id);
        if (!data) results.assessment_data.corrupted++;
      }

      // Check crisis data
      const crisisIndex = await this.getCrisisDataIndex();
      results.crisis_data.total = crisisIndex.length;
      for (const id of crisisIndex) {
        const data = await this.getCrisisData(id);
        if (!data) results.crisis_data.corrupted++;
      }

      console.log('Data integrity check completed:', results);
      return results;
    } catch (error) {
      console.error('Error verifying data integrity:', error);
      return null;
    }
  }
}

// Create singleton instance
const secureStorage = new SecureStorageService();

export default secureStorage;