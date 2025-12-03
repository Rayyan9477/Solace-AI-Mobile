import AsyncStorage from "@react-native-async-storage/async-storage";
import { logger } from "@shared/utils/logger";
import * as Crypto from "expo-crypto";
import * as Haptics from "expo-haptics";
import { Alert, Linking, Platform } from "react-native";

import {
  CRISIS_KEYWORDS,
  KEYWORD_WEIGHTS,
  DANGEROUS_COMBINATIONS,
  COMBINATION_SCORE,
  RISK_THRESHOLDS,
  EMERGENCY_RESOURCES,
  SUPPORT_RESOURCES,
  SAFETY_PLAN_TEMPLATE,
  loadRemoteCrisisConfig,
  mergeCrisisConfig,
} from "./crisisConfig";
import secureStorage from "../../app/services/secureStorage";

// TypeScript interfaces for Crisis Management System

interface CrisisKeywords {
  critical: string[];
  high: string[];
  moderate: string[];
  urgency: string[];
}

interface CrisisWeights {
  critical: number;
  high: number;
  moderate: number;
  urgency: number;
  [key: string]: number;
}

interface RiskThresholds {
  critical: number;
  high: number;
  moderate: number;
  low: number;
}

interface EmergencyResource {
  name: string;
  phone: string;
  text?: string;
  website?: string;
  description: string;
  available247: boolean;
  specialty?: string;
  priority: number;
}

interface EmergencyResourcesRegional {
  US: EmergencyResource[];
  [country: string]: EmergencyResource[];
}

interface CrisisConfig {
  keywords: CrisisKeywords;
  weights: CrisisWeights;
  combinations: [string, string][];
  thresholds: RiskThresholds;
  resources: EmergencyResourcesRegional;
}

interface CrisisAnalysisResult {
  risk: "none" | "low" | "moderate" | "high" | "critical";
  confidence: number;
  score?: number;
  indicators: string[];
  requiresImmediate?: boolean;
}

interface UserDemographics {
  age?: number;
  lgbtq?: boolean;
  veteran?: boolean;
  [key: string]: any;
}

interface UserProfile {
  id?: string | number;
  sessionId?: string;
  demographics?: UserDemographics;
  [key: string]: any;
}

interface CrisisAction {
  type: string;
  number?: string;
  keyword?: string;
  label: string;
  urgent?: boolean;
}

interface CrisisResponse {
  type: string;
  riskLevel: string;
  confidence: number;
  timestamp: string;
  resources: EmergencyResource[];
  message: string;
  actions: CrisisAction[];
}

interface EmergencyContact {
  name: string;
  phone: string;
  relationship?: string;
  type?: string;
}

interface SafetyPlan {
  emergencyContacts: EmergencyContact[];
  createdAt: string;
  lastUpdated: string;
  version: number;
  [key: string]: any;
}

interface CrisisEvent {
  timestamp: string;
  riskLevel: string;
  confidence: number;
  indicatorsHash: string;
  indicatorsCount: number;
  userIdHash: string;
  sessionId: string | null;
  responded: boolean;
  indicators?: string[];
}

interface EmergencyAction {
  timestamp: string;
  type: string;
  targetHash: string;
  successful: boolean;
}

interface CrisisStatistics {
  totalCrisisEvents: number;
  recentCrisisEvents: number;
  totalEmergencyActions: number;
  recentEmergencyActions: number;
  riskLevelDistribution: RiskDistribution;
  mostCommonIndicators: IndicatorCount[];
  responseRate: number;
}

interface RiskDistribution {
  none: number;
  low: number;
  moderate: number;
  high: number;
  critical: number;
}

interface IndicatorCount {
  indicator: string;
  count: number;
}

interface ProviderReport {
  crisis_events: any[];
  intervention_history: any[];
  risk_assessment: {
    current_risk: string;
    confidence: number;
    indicators: string[];
  };
  recommendations: string[];
  report_generated: string;
}

interface FollowUpData {
  type?: string;
  scheduledTime?: string;
  provider?: string;
  priority?: string;
  notes?: string;
}

interface ScheduledFollowUp {
  id: string;
  type: string;
  scheduled_time: string;
  provider: string;
  priority: string;
  notes: string;
  reminder_set: boolean;
  created_at: string;
}

/**
 * Crisis Intervention Manager
 * Handles emergency situations, crisis detection, and resource provision
 * Built specifically for mental health applications
 */

class CrisisManager {
  private config: CrisisConfig;
  private emergencyResources: EmergencyResource[];
  private safetyPlanTemplate: any;
  private configLoaded: boolean;
  private configLoadingPromise: Promise<void> | null;

  constructor() {
    this.config = {
      keywords: CRISIS_KEYWORDS,
      weights: KEYWORD_WEIGHTS,
      combinations: DANGEROUS_COMBINATIONS as [string, string][],
      thresholds: RISK_THRESHOLDS,
      resources: EMERGENCY_RESOURCES as unknown as EmergencyResourcesRegional,
    };

    this.emergencyResources = (EMERGENCY_RESOURCES.US ||
      []) as unknown as EmergencyResource[];
    this.safetyPlanTemplate = SAFETY_PLAN_TEMPLATE;
    this.configLoaded = false;
    this.configLoadingPromise = null;
  }

  async loadConfiguration(): Promise<void> {
    // HIGH-013 FIX: Thread-safe config loading with proper race condition handling
    // Check configLoaded FIRST to avoid unnecessary promise checks
    if (this.configLoaded) {
      return Promise.resolve();
    }

    // If loading is in progress, wait for the existing promise
    if (this.configLoadingPromise) {
      return this.configLoadingPromise;
    }

    // HIGH-013 FIX: Store promise reference before async execution starts
    // This ensures all concurrent callers get the same promise
    const loadPromise = (async (): Promise<void> => {
      try {
        const remoteConfig = await loadRemoteCrisisConfig();
        if (remoteConfig) {
          // HIGH-013 FIX: Apply config atomically
          const mergedConfig = mergeCrisisConfig(remoteConfig);
          this.config = mergedConfig;
          this.emergencyResources =
            mergedConfig.resources.US || EMERGENCY_RESOURCES.US;
        }
        // HIGH-013 FIX: Set loaded flag AFTER config is fully applied
        this.configLoaded = true;
      } catch (error) {
        logger.error(
          "Failed to load remote crisis config, using defaults:",
          error,
        );
        // Still mark as loaded so app can function with default config
        this.configLoaded = true;
      } finally {
        // HIGH-013 FIX: Clear promise AFTER setting configLoaded
        // Use setTimeout to ensure all awaiting callers receive their result first
        setTimeout(() => {
          this.configLoadingPromise = null;
        }, 0);
      }
    })();

    // Store the promise immediately so concurrent calls can await it
    this.configLoadingPromise = loadPromise;

    return loadPromise;
  }

  async ensureConfigLoaded(): Promise<void> {
    // Always call loadConfiguration - it handles the race condition internally
    await this.loadConfiguration();
  }

  /**
   * Get all crisis keywords as a flat array
   */
  getCrisisKeywords(): string[] {
    const { keywords } = this.config;
    return [
      ...keywords.critical,
      ...keywords.high,
      ...keywords.moderate,
      ...keywords.urgency,
    ];
  }

  /**
   * Analyze text for crisis indicators
   * @param {string} text - User input text
   * @returns {Object} Crisis analysis result
   */
  async analyzeCrisisRisk(text: string): Promise<CrisisAnalysisResult> {
    await this.ensureConfigLoaded();

    if (!text || typeof text !== "string") {
      return { risk: "none", confidence: 0, indicators: [] };
    }

    const normalizedText = text.toLowerCase().trim();
    const detectedKeywords: string[] = [];
    let totalScore = 0;

    const { keywords, weights, combinations, thresholds } = this.config;

    // HIGH-011 FIX: Use word boundary matching to prevent false positives
    // e.g., "therapist" shouldn't match "the", "assignment" shouldn't match "ass"
    Object.entries(keywords).forEach(([category, keywordList]) => {
      keywordList.forEach((keyword: string) => {
        const keywordLower = keyword.toLowerCase();
        // Create regex with word boundaries for whole-word matching
        // Escape special regex characters in the keyword
        const escapedKeyword = keywordLower.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const wordBoundaryRegex = new RegExp(`\\b${escapedKeyword}\\b`, 'i');

        if (wordBoundaryRegex.test(normalizedText)) {
          detectedKeywords.push(keyword);
          totalScore += weights[category] || 3;
        }
      });
    });

    // HIGH-011 FIX: Check for combination patterns with word boundary matching
    combinations.forEach(([word1, word2]) => {
      const escaped1 = word1.toLowerCase().replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const escaped2 = word2.toLowerCase().replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const regex1 = new RegExp(`\\b${escaped1}\\b`, 'i');
      const regex2 = new RegExp(`\\b${escaped2}\\b`, 'i');

      if (regex1.test(normalizedText) && regex2.test(normalizedText)) {
        totalScore += COMBINATION_SCORE;
        detectedKeywords.push(`${word1} + ${word2}`);
      }
    });

    // Determine risk level based on configurable thresholds
    let riskLevel: "none" | "low" | "moderate" | "high" | "critical" = "none";
    let confidence = 0;

    if (totalScore >= thresholds.critical) {
      riskLevel = "critical";
      confidence = Math.min(totalScore / 20, 1.0);
    } else if (totalScore >= thresholds.high) {
      riskLevel = "high";
      confidence = Math.min(totalScore / 15, 0.9);
    } else if (totalScore >= thresholds.moderate) {
      riskLevel = "moderate";
      confidence = Math.min(totalScore / 10, 0.7);
    } else if (totalScore >= thresholds.low) {
      riskLevel = "low";
      confidence = Math.min(totalScore / 5, 0.5);
    }

    return {
      risk: riskLevel,
      confidence: Math.round(confidence * 100) / 100,
      score: totalScore,
      indicators: detectedKeywords,
      requiresImmediate: riskLevel === "critical" || riskLevel === "high",
    };
  }

  /**
   * Handle crisis situation with appropriate response
   * @param {Object} crisisAnalysis - Result from analyzeCrisisRisk
   * @param {Object} userProfile - User profile for personalization
   * @returns {Promise<Object>} Crisis response
   */
  async handleCrisis(
    crisisAnalysis: CrisisAnalysisResult,
    userProfile: UserProfile = {},
  ): Promise<CrisisResponse | null> {
    const { risk, confidence, indicators, requiresImmediate } = crisisAnalysis;

    // Log crisis event for safety
    await this.logCrisisEvent(crisisAnalysis, userProfile);

    // Provide haptic feedback for serious situations
    if (requiresImmediate && Platform.OS === "ios") {
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
    }

    const response: CrisisResponse = {
      type: "crisis_response",
      riskLevel: risk,
      confidence,
      timestamp: new Date().toISOString(),
      resources: [],
      message: "",
      actions: [],
    };

    switch (risk) {
      case "critical":
        response.message =
          "I'm very concerned about what you're sharing. Your life has value, and there are people who want to help you right now. Please reach out for immediate support - you don't have to go through this alone.";
        response.resources = this.getEmergencyResources(userProfile);
        response.actions = [
          { type: "call", number: "988", label: "Call 988 Now", urgent: true },
          {
            type: "text",
            number: "741741",
            keyword: "HOME",
            label: "Text Crisis Line",
            urgent: true,
          },
          {
            type: "emergency",
            number: "911",
            label: "Emergency Services",
            urgent: true,
          },
        ];
        break;

      case "high":
        response.message =
          "I hear that you're in significant distress right now. These feelings can be overwhelming, but support is available. Please consider reaching out to a crisis counselor who can provide immediate help.";
        response.resources = this.getEmergencyResources(userProfile);
        response.actions = [
          { type: "call", number: "988", label: "Talk to Someone Now" },
          {
            type: "text",
            number: "741741",
            keyword: "HOME",
            label: "Text for Support",
          },
          { type: "coping", label: "Emergency Coping Strategies" },
        ];
        break;

      case "moderate":
        response.message =
          "It sounds like you're going through a really difficult time. Your feelings are valid, and it's important to get support. Would you like to talk about what's been most challenging?";
        response.resources = [
          ...this.getEmergencyResources(userProfile),
          ...this.getSupportResources(),
        ];
        response.actions = [
          { type: "continue_chat", label: "Keep Talking" },
          { type: "resources", label: "View Support Resources" },
          { type: "coping", label: "Coping Strategies" },
        ];
        break;

      case "low":
        response.message =
          "I notice you might be struggling with some difficult thoughts. It's okay to not be okay sometimes. Would you like to explore these feelings together or learn some coping strategies?";
        response.resources = this.getSupportResources();
        response.actions = [
          { type: "continue_chat", label: "Talk About It" },
          { type: "exercise", label: "Try Calming Exercise" },
          { type: "resources", label: "Support Resources" },
        ];
        break;

      default:
        return null; // No crisis detected
    }

    return response;
  }

  /**
   * Show crisis alert dialog
   * @param {Object} crisisResponse - Response from handleCrisis
   */
  async showCrisisAlert(crisisResponse: CrisisResponse): Promise<string> {
    const { riskLevel, message, actions } = crisisResponse;

    if (riskLevel === "critical" || riskLevel === "high") {
      return new Promise((resolve) => {
        Alert.alert(
          "Emergency Support Available",
          message,
          [
            {
              text: "Call 988 Now",
              style: "default",
              onPress: async () => {
                await this.makeEmergencyCall("988");
                resolve("call_988");
              },
            },
            {
              text: "Text Crisis Line",
              style: "default",
              onPress: async () => {
                await this.sendCrisisText();
                resolve("text_crisis");
              },
            },
            {
              text: "Emergency 911",
              style: "destructive",
              onPress: async () => {
                await this.makeEmergencyCall("911");
                resolve("call_911");
              },
            },
            {
              text: "I'm Safe For Now",
              style: "cancel",
              onPress: () => resolve("safe_for_now"),
            },
          ],
          { cancelable: false },
        );
      });
    } else {
      return new Promise((resolve) => {
        Alert.alert("Support Available", message, [
          {
            text: "Get Support",
            onPress: () => resolve("get_support"),
          },
          {
            text: "Continue Talking",
            onPress: () => resolve("continue_chat"),
          },
          {
            text: "Not Right Now",
            style: "cancel",
            onPress: () => resolve("dismiss"),
          },
        ]);
      });
    }
  }

  /**
   * Make emergency call
   * @param {string} number - Phone number to call
   */
  async makeEmergencyCall(number: string): Promise<void> {
    try {
      const phoneNumber =
        Platform.OS === "ios" ? `telprompt:${number}` : `tel:${number}`;
      const canCall = await Linking.canOpenURL(phoneNumber);

      if (canCall) {
        await Linking.openURL(phoneNumber);
        await this.logEmergencyAction("call", number);
      } else {
        Alert.alert(
          "Unable to Make Call",
          `Your device cannot make phone calls. Please dial ${number} manually for immediate assistance.`,
          [{ text: "OK" }],
        );
      }
    } catch (error) {
      logger.error("Error making emergency call:", error);
      Alert.alert(
        "Call Error",
        `Unable to place call. Please dial ${number} manually for immediate assistance.`,
        [{ text: "OK" }],
      );
    }
  }

  /**
   * Send crisis text message
   */
  async sendCrisisText(): Promise<void> {
    try {
      const smsUrl =
        Platform.OS === "ios" ? "sms:741741&body=HOME" : "sms:741741?body=HOME";

      const canText = await Linking.canOpenURL(smsUrl);

      if (canText) {
        await Linking.openURL(smsUrl);
        await this.logEmergencyAction("text", "741741");
      } else {
        Alert.alert(
          "Unable to Send Text",
          "Your device cannot send text messages. Please text HOME to 741741 manually.",
          [{ text: "OK" }],
        );
      }
    } catch (error) {
      logger.error("Error sending crisis text:", error);
      Alert.alert(
        "Text Error",
        "Unable to open messaging. Please text HOME to 741741 manually.",
        [{ text: "OK" }],
      );
    }
  }

  /**
   * Get emergency resources based on user profile
   * @param {Object} userProfile - User profile for personalization
   * @returns {Array} Relevant emergency resources
   */
  getEmergencyResources(userProfile: UserProfile = {}): EmergencyResource[] {
    let resources = [...this.emergencyResources];

    // Filter by specialty if applicable
    if (userProfile.demographics) {
      const { age, lgbtq, veteran } = userProfile.demographics;

      if (lgbtq && age !== undefined && age < 25) {
        // Prioritize Trevor Project for LGBTQ+ youth
        resources = resources.sort((a, b) => {
          if (a.specialty === "lgbtq") return -1;
          if (b.specialty === "lgbtq") return 1;
          return a.priority - b.priority;
        });
      }

      if (veteran) {
        // Prioritize Veterans Crisis Line
        resources = resources.sort((a, b) => {
          if (a.specialty === "veterans") return -1;
          if (b.specialty === "veterans") return 1;
          return a.priority - b.priority;
        });
      }
    }

    return resources.slice(0, 5); // Return top 5 most relevant
  }

  /**
   * Get general support resources
   * @returns {Array} Support resources
   */
  getSupportResources(): any[] {
    return SUPPORT_RESOURCES;
  }

  /**
   * Create safety plan
   * @param {Object} userInputs - User's safety plan inputs
   * @returns {Object} Formatted safety plan
   */
  async createSafetyPlan(userInputs: any): Promise<SafetyPlan> {
    const safetyPlan = {
      ...this.safetyPlanTemplate,
      ...userInputs,
      createdAt: new Date().toISOString(),
      lastUpdated: new Date().toISOString(),
      version: 1,
    };

    if (safetyPlan.emergencyContacts.length === 0) {
      safetyPlan.emergencyContacts = [
        { name: "988 Crisis Lifeline", number: "988", type: "crisis" },
        { name: "Emergency Services", number: "911", type: "emergency" },
      ];
    }

    await secureStorage.storeSensitiveData("user_safety_plan", safetyPlan);

    return safetyPlan;
  }

  /**
   * Get saved safety plan
   * @returns {Object|null} User's safety plan
   */
  async getSafetyPlan(): Promise<SafetyPlan | null> {
    try {
      return await secureStorage.getSecureData("user_safety_plan");
    } catch (error) {
      return null;
    }
  }

  /**
   * Update safety plan
   * @param {Object} updates - Updates to apply
   * @returns {Object} Updated safety plan
   */
  async updateSafetyPlan(updates: any): Promise<SafetyPlan> {
    const currentPlan = await this.getSafetyPlan();

    if (!currentPlan) {
      return await this.createSafetyPlan(updates);
    }

    const updatedPlan = {
      ...currentPlan,
      ...updates,
      lastUpdated: new Date().toISOString(),
      version: (currentPlan.version || 1) + 1,
    };

    await secureStorage.storeSensitiveData("user_safety_plan", updatedPlan);

    return updatedPlan;
  }

  /**
   * Log crisis event for safety and analytics
   * @param {Object} crisisAnalysis - Crisis analysis result
   * @param {Object} userProfile - User profile
   */
  async logCrisisEvent(
    crisisAnalysis: CrisisAnalysisResult,
    userProfile: UserProfile,
  ): Promise<void> {
    try {
      const indicatorsHash = await Crypto.digestStringAsync(
        Crypto.CryptoDigestAlgorithm.SHA256,
        JSON.stringify(crisisAnalysis.indicators.sort()),
      );

      const userIdHash = await Crypto.digestStringAsync(
        Crypto.CryptoDigestAlgorithm.SHA256,
        (userProfile.id || "anonymous").toString(),
      );

      const event = {
        timestamp: new Date().toISOString(),
        riskLevel: crisisAnalysis.risk,
        confidence: crisisAnalysis.confidence,
        indicatorsHash,
        indicatorsCount: crisisAnalysis.indicators.length,
        userIdHash,
        sessionId: userProfile.sessionId || null,
        responded: false,
      };

      const existingLogs =
        (await secureStorage.getSecureData("crisis_events")) || [];
      const logs = Array.isArray(existingLogs) ? existingLogs : [];

      logs.push(event);

      const trimmedLogs = logs.slice(-50);

      await secureStorage.storeSensitiveData("crisis_events", trimmedLogs);

      // CRIT-004 FIX: Notify emergency contacts with proper error isolation
      // This should not cause logging to fail if notification fails
      if (
        crisisAnalysis.risk === "critical" ||
        crisisAnalysis.risk === "high"
      ) {
        try {
          await this.notifyEmergencyContacts(event);
        } catch (notifyError) {
          // Log but don't throw - notification failure shouldn't fail crisis logging
          logger.error("Emergency contact notification failed:", notifyError);
        }
      }
      logger.debug(
        `Crisis event logged successfully: ${crisisAnalysis.risk} risk level`,
      );
    } catch (error) {
      logger.error("Primary crisis event logging failed:", error);
      // CRIT-004 FIX: AWAIT the fallback to ensure it completes
      try {
        await this.fallbackCrisisLog(crisisAnalysis, userProfile, error);
      } catch (fallbackError) {
        // Last resort - log both errors but don't crash
        logger.error("Both primary and fallback crisis logging failed:", {
          primaryError: error,
          fallbackError,
        });
      }
    }
  }

  async fallbackCrisisLog(
    crisisAnalysis: CrisisAnalysisResult,
    userProfile: UserProfile,
    primaryError?: any,
  ): Promise<void> {
    const fallbackEvent = {
      timestamp: new Date().toISOString(),
      riskLevel: crisisAnalysis.risk,
      indicators: crisisAnalysis.indicators,
      confidence: crisisAnalysis.confidence,
      fallback: true,
      primaryError: primaryError?.message || "Unknown error",
    };

    try {
      // Try secure storage first
      await secureStorage.storeSensitiveData(
        `crisis_fallback_${Date.now()}`,
        fallbackEvent,
      );

      logger.debug("Crisis event logged to fallback storage");
    } catch (secureStorageError) {
      // Last resort: use AsyncStorage (less secure but better than losing data)
      try {
        const asyncStorageKey = `crisis_emergency_${Date.now()}`;
        await AsyncStorage.setItem(
          asyncStorageKey,
          JSON.stringify(fallbackEvent),
        );
        logger.warn(
          "Crisis event logged to AsyncStorage (emergency fallback)",
        );
      } catch (asyncStorageError) {
        // Absolute last resort: log to console for developer visibility
        logger.error("CRITICAL: All crisis logging mechanisms failed!");
        logger.error("Crisis Data:", JSON.stringify(fallbackEvent, null, 2));

        // Alert user that logging failed (but don't block crisis response)
        Alert.alert(
          "Crisis Support",
          "We were unable to save this crisis event, but help is still available. Please call 988 immediately if you are in danger.",
          [{ text: "OK" }],
        );
      }
    }
  }

  async notifyEmergencyContacts(event: CrisisEvent): Promise<void> {
    try {
      // Get emergency contacts from secure storage
      const emergencyContactsData =
        await secureStorage.getSecureData("emergency_contacts");

      if (
        !emergencyContactsData ||
        !Array.isArray(emergencyContactsData) ||
        emergencyContactsData.length === 0
      ) {
        logger.debug("No emergency contacts configured");
        return;
      }

      const { riskLevel, timestamp } = event;
      const crisisMessage = `CRISIS ALERT: Your loved one has triggered a ${riskLevel} crisis alert at ${new Date(timestamp).toLocaleString()}. Please check on them immediately. If you believe they are in immediate danger, call 911 or text 988.`;

      // Notify each emergency contact
      for (const contact of emergencyContactsData) {
        try {
          if (contact.phoneNumber) {
            // Send SMS notification
            const smsUrl = `sms:${contact.phoneNumber}${Platform.OS === "ios" ? "&" : "?"}body=${encodeURIComponent(crisisMessage)}`;
            const canOpen = await Linking.canOpenURL(smsUrl);

            if (canOpen) {
              await Linking.openURL(smsUrl);
              logger.debug(
                `Crisis notification sent to ${contact.name || contact.phoneNumber}`,
              );
            }
          }
        } catch (contactError) {
          logger.error(
            `Failed to notify emergency contact ${contact.name}:`,
            contactError,
          );
          // Continue to next contact even if one fails
        }
      }

      // Log that notifications were attempted
      logger.debug(
        `Emergency contact notifications attempted for ${emergencyContactsData.length} contacts`,
      );
    } catch (error) {
      logger.error("Failed to notify emergency contacts:", error);
      // Don't throw - this is a best-effort notification
    }
  }

  /**
   * Log emergency action taken
   * @param {string} actionType - Type of action (call, text, etc.)
   * @param {string} target - Target of action (phone number, etc.)
   */
  async logEmergencyAction(actionType: string, target: string): Promise<void> {
    try {
      const targetHash = await Crypto.digestStringAsync(
        Crypto.CryptoDigestAlgorithm.SHA256,
        target || "unknown",
      );

      const action = {
        timestamp: new Date().toISOString(),
        type: actionType,
        targetHash,
        successful: true,
      };

      const existingActions =
        (await secureStorage.getSecureData("emergency_actions")) || [];
      const actions = Array.isArray(existingActions) ? existingActions : [];

      actions.push(action);

      const trimmedActions = actions.slice(-50);

      await secureStorage.storeSensitiveData(
        "emergency_actions",
        trimmedActions,
      );
    } catch (error) {
      // CRIT-004 FIX: Log error instead of silent swallow
      logger.warn("Failed to log emergency action (non-critical):", error);
    }
  }

  /**
   * Get crisis statistics for user insights
   * @returns {Object} Crisis statistics
   */
  async getCrisisStatistics(): Promise<CrisisStatistics | null> {
    try {
      const crisisEvents =
        (await secureStorage.getSecureData("crisis_events")) || [];
      const emergencyActions =
        (await secureStorage.getSecureData("emergency_actions")) || [];

      const last30Days = new Date();
      last30Days.setDate(last30Days.getDate() - 30);

      const recentEvents = crisisEvents.filter(
        (event: CrisisEvent) => new Date(event.timestamp) > last30Days,
      );

      const recentActions = emergencyActions.filter(
        (action: EmergencyAction) => new Date(action.timestamp) > last30Days,
      );

      return {
        totalCrisisEvents: crisisEvents.length,
        recentCrisisEvents: recentEvents.length,
        totalEmergencyActions: emergencyActions.length,
        recentEmergencyActions: recentActions.length,
        riskLevelDistribution: this.calculateRiskDistribution(crisisEvents),
        mostCommonIndicators: this.getTopIndicators(crisisEvents),
        responseRate: this.calculateResponseRate(
          crisisEvents,
          emergencyActions,
        ),
      };
    } catch (error) {
      logger.error("Error getting crisis statistics:", error);
      return null;
    }
  }

  /**
   * Calculate risk level distribution
   * @param {Array} events - Crisis events
   * @returns {Object} Risk distribution
   */
  calculateRiskDistribution(events: CrisisEvent[]): RiskDistribution {
    const distribution: RiskDistribution = {
      none: 0,
      low: 0,
      moderate: 0,
      high: 0,
      critical: 0,
    };

    events.forEach((event) => {
      const riskLevel = event.riskLevel as keyof RiskDistribution;
      if (distribution.hasOwnProperty(riskLevel)) {
        distribution[riskLevel]++;
      }
    });

    return distribution;
  }

  /**
   * Get most common crisis indicators
   * @param {Array} events - Crisis events
   * @returns {Array} Top indicators
   */
  getTopIndicators(events: CrisisEvent[]): IndicatorCount[] {
    const indicatorCounts: Record<string, number> = {};

    events.forEach((event) => {
      event.indicators?.forEach((indicator) => {
        indicatorCounts[indicator] = (indicatorCounts[indicator] || 0) + 1;
      });
    });

    return Object.entries(indicatorCounts)
      .sort(([, a], [, b]) => (b as number) - (a as number))
      .slice(0, 10)
      .map(([indicator, count]) => ({ indicator, count: count as number }));
  }

  /**
   * Calculate crisis response rate
   * @param {Array} events - Crisis events
   * @param {Array} actions - Emergency actions
   * @returns {number} Response rate (0-1)
   */
  calculateResponseRate(
    events: CrisisEvent[],
    actions: EmergencyAction[],
  ): number {
    if (events.length === 0) return 0;

    const highRiskEvents = events.filter(
      (event) => event.riskLevel === "high" || event.riskLevel === "critical",
    );

    if (highRiskEvents.length === 0) return 1; // No high-risk events to respond to

    // Simple heuristic: if actions were taken within reasonable timeframe of high-risk events
    let responsiveActions = 0;

    highRiskEvents.forEach((event) => {
      const eventTime = new Date(event.timestamp);
      const withinWindow = actions.some((action) => {
        const actionTime = new Date(action.timestamp);
        const timeDiff = actionTime.getTime() - eventTime.getTime();
        return timeDiff >= 0 && timeDiff <= 24 * 60 * 60 * 1000; // Within 24 hours
      });

      if (withinWindow) responsiveActions++;
    });

    return responsiveActions / highRiskEvents.length;
  }

  /**
   * Get crisis history for user
   * @returns {Promise<Array>} Crisis history
   */
  async getCrisisHistory(): Promise<any[]> {
    try {
      const events = await secureStorage.getSecureData("crisis_events");
      return Array.isArray(events) ? events : [];
    } catch (error) {
      logger.error("Error getting crisis history:", error);
      return [];
    }
  }

  /**
   * Anonymize crisis data for privacy
   * @param {Object} data - Crisis data to anonymize
   * @returns {Object} Anonymized data
   */
  anonymizeCrisisData(data: any): any {
    const anonymized = { ...data };

    // Remove or hash sensitive personal information
    delete anonymized.userId;
    delete anonymized.originalText;
    delete anonymized.personalDetails;

    // Add anonymization timestamp
    anonymized.anonymizedAt = new Date().toISOString();
    anonymized.privacyLevel = "anonymized";

    return anonymized;
  }

  /**
   * Prepare crisis data for healthcare provider sharing
   * @param {Object} crisisData - Crisis event data
   * @returns {Object} Formatted provider report
   */
  prepareProviderReport(crisisData: any): ProviderReport {
    const anonymizedData = this.anonymizeCrisisData(crisisData);

    return {
      crisis_events: [anonymizedData],
      intervention_history: [],
      risk_assessment: {
        current_risk: anonymizedData.riskLevel,
        confidence: anonymizedData.confidence,
        indicators: anonymizedData.indicators,
      },
      recommendations: this.generateProviderRecommendations(anonymizedData),
      report_generated: new Date().toISOString(),
    };
  }

  /**
   * Schedule follow-up care
   * @param {Object} followUpData - Follow-up scheduling data
   * @returns {Promise<Object>} Scheduled follow-up
   */
  async scheduleFollowUp(
    followUpData: FollowUpData,
  ): Promise<ScheduledFollowUp> {
    const followUp = {
      id: `followup_${Date.now()}`,
      type: followUpData.type || "crisis_followup",
      scheduled_time:
        followUpData.scheduledTime ||
        new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // Default to 24 hours
      provider: followUpData.provider || "crisis_team",
      priority: followUpData.priority || "high",
      notes: followUpData.notes || "",
      reminder_set: true,
      created_at: new Date().toISOString(),
    };

    try {
      const existingFollowUps = await secureStorage.getSecureData(
        "scheduled_followups",
      );
      const followUps = Array.isArray(existingFollowUps)
        ? existingFollowUps
        : [];

      followUps.push(followUp);
      await secureStorage.storeSensitiveData("scheduled_followups", followUps);

      return followUp;
    } catch (error) {
      logger.error("Error scheduling follow-up:", error);
      throw error;
    }
  }

  /**
   * Generate recommendations for healthcare providers
   * @param {Object} crisisData - Anonymized crisis data
   * @returns {Array} Provider recommendations
   */
  generateProviderRecommendations(crisisData: any): string[] {
    const recommendations = [];

    switch (crisisData.riskLevel) {
      case "critical":
        recommendations.push(
          "Immediate psychiatric evaluation recommended",
          "Consider inpatient stabilization",
          "Monitor for suicidal ideation",
          "Coordinate with emergency services",
        );
        break;
      case "high":
        recommendations.push(
          "Schedule urgent mental health assessment",
          "Consider crisis intervention therapy",
          "Monitor medication compliance",
          "Establish safety plan",
        );
        break;
      case "moderate":
        recommendations.push(
          "Schedule outpatient therapy appointment",
          "Consider medication evaluation",
          "Implement coping strategies",
          "Regular follow-up monitoring",
        );
        break;
      case "low":
        recommendations.push(
          "Continue supportive therapy",
          "Monitor symptom progression",
          "Reinforce coping skills",
          "Regular wellness check-ins",
        );
        break;
    }

    return recommendations;
  }
}

export default new CrisisManager();
