/**
 * Navigation State Persistence Utility
 *
 * Provides robust navigation state persistence across app sessions with:
 * - Automatic state saving and restoration
 * - Mental health session continuity
 * - Privacy-aware persistence
 * - Deep linking support
 * - Accessibility navigation history
 */

import AsyncStorage from "@react-native-async-storage/async-storage";
import { CommonActions } from "@react-navigation/native";

// Storage keys
const STORAGE_KEYS = {
  NAVIGATION_STATE: "@solace_navigation_state",
  USER_PREFERENCES: "@solace_navigation_preferences",
  SESSION_DATA: "@solace_session_data",
  ACCESSIBILITY_HISTORY: "@solace_accessibility_history",
};

// Mental health session types that should be preserved
const PRESERVABLE_SESSIONS = {
  THERAPY: "therapy",
  MOOD_TRACKING: "moodTracking",
  ASSESSMENT: "assessment",
  JOURNAL: "journal",
  CRISIS_SUPPORT: "crisisSupport",
};

// Screens that should not be persisted for privacy
const PRIVATE_SCREENS = [
  "SignIn",
  "Register",
  "ForgotPassword",
  "CrisisSupport",
  "EmergencyContacts",
];

// Maximum age for persisted state (24 hours)
const MAX_STATE_AGE = 24 * 60 * 60 * 1000;

class NavigationPersistence {
  constructor(options = {}) {
    this.options = {
      // Persistence behavior
      enabled: true,
      persistPrivateScreens: false,
      maxStateAge: MAX_STATE_AGE,

      // Mental health specific options
      preserveTherapySessions: true,
      preserveMoodTracking: true,
      preserveAssessmentProgress: true,

      // Privacy options
      encryptSensitiveData: true,
      clearOnLogout: true,
      respectDoNotTrack: true,

      // Accessibility options
      persistAccessibilityHistory: true,
      announceStateRestoration: true,

      ...options,
    };

    this.currentState = null;
    this.sessionData = {};
    this.accessibilityHistory = [];
  }

  /**
   * Save navigation state to persistent storage
   */
  async saveNavigationState(state) {
    if (!this.options.enabled || !state) {
      return;
    }

    try {
      // Filter sensitive routes if privacy protection is enabled
      const sanitizedState = this.sanitizeState(state);

      // Add metadata
      const stateWithMetadata = {
        state: sanitizedState,
        timestamp: Date.now(),
        version: "1.0",
        sessionId: this.generateSessionId(),
        userAgent: this.getUserAgent(),
      };

      // Save to storage
      await AsyncStorage.setItem(
        STORAGE_KEYS.NAVIGATION_STATE,
        JSON.stringify(stateWithMetadata),
      );

      // Update current state reference
      this.currentState = sanitizedState;

      console.log("✅ Navigation state saved successfully");
    } catch (error) {
      console.error("❌ Failed to save navigation state:", error);
    }
  }

  /**
   * Restore navigation state from persistent storage
   */
  async restoreNavigationState() {
    if (!this.options.enabled) {
      return null;
    }

    try {
      const storedData = await AsyncStorage.getItem(
        STORAGE_KEYS.NAVIGATION_STATE,
      );

      if (!storedData) {
        console.log("ℹ️ No navigation state found in storage");
        return null;
      }

      const parsedData = JSON.parse(storedData);

      // Check if state is too old
      if (this.isStateExpired(parsedData.timestamp)) {
        console.log("⏰ Navigation state expired, clearing...");
        await this.clearNavigationState();
        return null;
      }

      // Validate state structure
      if (!this.isValidState(parsedData.state)) {
        console.log("⚠️ Invalid navigation state structure, clearing...");
        await this.clearNavigationState();
        return null;
      }

      // Restore session data if available
      await this.restoreSessionData();

      // Announce restoration for accessibility
      if (this.options.announceStateRestoration) {
        this.announceStateRestoration(parsedData.state);
      }

      console.log("✅ Navigation state restored successfully");
      return parsedData.state;
    } catch (error) {
      console.error("❌ Failed to restore navigation state:", error);
      // Clear corrupted state
      await this.clearNavigationState();
      return null;
    }
  }

  /**
   * Save mental health session data
   */
  async saveSessionData(sessionType, data) {
    if (!this.shouldPreserveSession(sessionType)) {
      return;
    }

    try {
      const sessionKey = `${STORAGE_KEYS.SESSION_DATA}_${sessionType}`;
      const sessionData = {
        type: sessionType,
        data: this.sanitizeSessionData(data),
        timestamp: Date.now(),
        encrypted: this.options.encryptSensitiveData,
      };

      // Encrypt sensitive data if required
      if (this.options.encryptSensitiveData) {
        sessionData.data = await this.encryptData(sessionData.data);
      }

      await AsyncStorage.setItem(sessionKey, JSON.stringify(sessionData));

      console.log(`✅ ${sessionType} session data saved`);
    } catch (error) {
      console.error(`❌ Failed to save ${sessionType} session data:`, error);
    }
  }

  /**
   * Restore mental health session data
   */
  async restoreSessionData() {
    try {
      const sessionTypes = Object.values(PRESERVABLE_SESSIONS);
      const restoredSessions = {};

      for (const sessionType of sessionTypes) {
        if (!this.shouldPreserveSession(sessionType)) {
          continue;
        }

        const sessionKey = `${STORAGE_KEYS.SESSION_DATA}_${sessionType}`;
        const storedData = await AsyncStorage.getItem(sessionKey);

        if (storedData) {
          const sessionData = JSON.parse(storedData);

          // Check if session data is expired
          if (this.isStateExpired(sessionData.timestamp)) {
            await AsyncStorage.removeItem(sessionKey);
            continue;
          }

          // Decrypt if necessary
          let data = sessionData.data;
          if (sessionData.encrypted) {
            data = await this.decryptData(data);
          }

          restoredSessions[sessionType] = data;
        }
      }

      this.sessionData = restoredSessions;
      return restoredSessions;
    } catch (error) {
      console.error("❌ Failed to restore session data:", error);
      return {};
    }
  }

  /**
   * Clear all persisted navigation data
   */
  async clearNavigationState() {
    try {
      const keys = Object.values(STORAGE_KEYS);
      await AsyncStorage.multiRemove(keys);

      // Clear session data for all types
      const sessionTypes = Object.values(PRESERVABLE_SESSIONS);
      const sessionKeys = sessionTypes.map(
        (type) => `${STORAGE_KEYS.SESSION_DATA}_${type}`,
      );
      await AsyncStorage.multiRemove(sessionKeys);

      this.currentState = null;
      this.sessionData = {};
      this.accessibilityHistory = [];

      console.log("✅ Navigation state cleared successfully");
    } catch (error) {
      console.error("❌ Failed to clear navigation state:", error);
    }
  }

  /**
   * Save accessibility navigation history
   */
  async saveAccessibilityHistory(screenName, action, metadata = {}) {
    if (!this.options.persistAccessibilityHistory) {
      return;
    }

    try {
      const historyEntry = {
        screenName,
        action,
        metadata,
        timestamp: Date.now(),
      };

      this.accessibilityHistory.push(historyEntry);

      // Keep only last 50 entries
      if (this.accessibilityHistory.length > 50) {
        this.accessibilityHistory = this.accessibilityHistory.slice(-50);
      }

      await AsyncStorage.setItem(
        STORAGE_KEYS.ACCESSIBILITY_HISTORY,
        JSON.stringify(this.accessibilityHistory),
      );
    } catch (error) {
      console.error("❌ Failed to save accessibility history:", error);
    }
  }

  /**
   * Get accessibility navigation history
   */
  async getAccessibilityHistory() {
    try {
      const storedHistory = await AsyncStorage.getItem(
        STORAGE_KEYS.ACCESSIBILITY_HISTORY,
      );
      return storedHistory ? JSON.parse(storedHistory) : [];
    } catch (error) {
      console.error("❌ Failed to get accessibility history:", error);
      return [];
    }
  }

  /**
   * Handle deep linking with state restoration
   */
  handleDeepLink(url, navigationRef) {
    try {
      // Parse deep link
      const { screenName, params } = this.parseDeepLink(url);

      if (!screenName) {
        console.warn("⚠️ Invalid deep link:", url);
        return false;
      }

      // Check if we need to restore session data for this screen
      const sessionType = this.getSessionTypeForScreen(screenName);
      if (sessionType && this.sessionData[sessionType]) {
        params.restoredSession = this.sessionData[sessionType];
      }

      // Navigate to deep linked screen
      navigationRef.current?.dispatch(
        CommonActions.navigate({
          name: screenName,
          params,
        }),
      );

      // Save accessibility history
      this.saveAccessibilityHistory(screenName, "DEEP_LINK", { url });

      return true;
    } catch (error) {
      console.error("❌ Failed to handle deep link:", error);
      return false;
    }
  }

  /**
   * Get navigation reset action for clean start
   */
  getResetAction(routeName = "Home") {
    return CommonActions.reset({
      index: 0,
      routes: [{ name: routeName }],
    });
  }

  // Private helper methods

  /**
   * Sanitize navigation state for privacy
   */
  sanitizeState(state) {
    if (!state || !state.routes) {
      return state;
    }

    const sanitizedState = { ...state };

    if (!this.options.persistPrivateScreens) {
      sanitizedState.routes = state.routes.filter(
        (route) => !PRIVATE_SCREENS.includes(route.name),
      );

      // Adjust index if necessary
      if (sanitizedState.index >= sanitizedState.routes.length) {
        sanitizedState.index = Math.max(0, sanitizedState.routes.length - 1);
      }
    }

    return sanitizedState;
  }

  /**
   * Sanitize session data for privacy
   */
  sanitizeSessionData(data) {
    if (!data || typeof data !== "object") {
      return data;
    }

    // Remove sensitive fields
    const sensitiveFields = ["password", "token", "creditCard", "ssn"];
    const sanitized = { ...data };

    sensitiveFields.forEach((field) => {
      if (field in sanitized) {
        delete sanitized[field];
      }
    });

    return sanitized;
  }

  /**
   * Check if state is expired
   */
  isStateExpired(timestamp) {
    return Date.now() - timestamp > this.options.maxStateAge;
  }

  /**
   * Validate navigation state structure
   */
  isValidState(state) {
    return (
      state &&
      typeof state === "object" &&
      Array.isArray(state.routes) &&
      typeof state.index === "number" &&
      state.index >= 0 &&
      state.index < state.routes.length
    );
  }

  /**
   * Check if session type should be preserved
   */
  shouldPreserveSession(sessionType) {
    switch (sessionType) {
      case PRESERVABLE_SESSIONS.THERAPY:
        return this.options.preserveTherapySessions;
      case PRESERVABLE_SESSIONS.MOOD_TRACKING:
        return this.options.preserveMoodTracking;
      case PRESERVABLE_SESSIONS.ASSESSMENT:
        return this.options.preserveAssessmentProgress;
      default:
        return true;
    }
  }

  /**
   * Generate unique session ID
   */
  generateSessionId() {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Get user agent string
   */
  getUserAgent() {
    return `SolaceAI/1.0 (React Native)`;
  }

  /**
   * Parse deep link URL
   */
  parseDeepLink(url) {
    try {
      const urlObj = new URL(url);
      const pathSegments = urlObj.pathname.split("/").filter(Boolean);

      return {
        screenName: pathSegments[0],
        params: Object.fromEntries(urlObj.searchParams),
      };
    } catch (error) {
      console.error("❌ Failed to parse deep link:", error);
      return { screenName: null, params: {} };
    }
  }

  /**
   * Get session type for screen
   */
  getSessionTypeForScreen(screenName) {
    const sessionTypeMap = {
      Therapy: PRESERVABLE_SESSIONS.THERAPY,
      TherapySession: PRESERVABLE_SESSIONS.THERAPY,
      MoodTracker: PRESERVABLE_SESSIONS.MOOD_TRACKING,
      MoodTracking: PRESERVABLE_SESSIONS.MOOD_TRACKING,
      Assessment: PRESERVABLE_SESSIONS.ASSESSMENT,
      MentalHealthAssessment: PRESERVABLE_SESSIONS.ASSESSMENT,
      Journal: PRESERVABLE_SESSIONS.JOURNAL,
      JournalEntry: PRESERVABLE_SESSIONS.JOURNAL,
    };

    return sessionTypeMap[screenName] || null;
  }

  /**
   * Announce state restoration for accessibility
   */
  announceStateRestoration(state) {
    if (!state || !state.routes || !state.routes[state.index]) {
      return;
    }

    const currentRoute = state.routes[state.index];
    const screenName = currentRoute.name;

    // Import FocusManagement dynamically to avoid circular dependencies
    import("./accessibility").then(({ FocusManagement }) => {
      FocusManagement.announceForScreenReader(
        `Returning to ${screenName} screen where you left off.`,
        "polite",
      );
    });
  }

  /**
   * Encrypt sensitive data (placeholder implementation)
   */
  async encryptData(data) {
    // In a real implementation, use proper encryption
    // For now, just return the data (implement with react-native-crypto or similar)
    return JSON.stringify(data);
  }

  /**
   * Decrypt sensitive data (placeholder implementation)
   */
  async decryptData(encryptedData) {
    // In a real implementation, use proper decryption
    try {
      return JSON.parse(encryptedData);
    } catch {
      return encryptedData;
    }
  }
}

// Create singleton instance
const navigationPersistence = new NavigationPersistence();

// Export utility functions
export const saveNavigationState = (state) =>
  navigationPersistence.saveNavigationState(state);

export const restoreNavigationState = () =>
  navigationPersistence.restoreNavigationState();

export const clearNavigationState = () =>
  navigationPersistence.clearNavigationState();

export const saveSessionData = (sessionType, data) =>
  navigationPersistence.saveSessionData(sessionType, data);

export const restoreSessionData = () =>
  navigationPersistence.restoreSessionData();

export const handleDeepLink = (url, navigationRef) =>
  navigationPersistence.handleDeepLink(url, navigationRef);

export const getResetAction = (routeName) =>
  navigationPersistence.getResetAction(routeName);

export const saveAccessibilityHistory = (screenName, action, metadata) =>
  navigationPersistence.saveAccessibilityHistory(screenName, action, metadata);

export const getAccessibilityHistory = () =>
  navigationPersistence.getAccessibilityHistory();

// Export class for advanced usage
export { NavigationPersistence, PRESERVABLE_SESSIONS, PRIVATE_SCREENS };

export default navigationPersistence;
