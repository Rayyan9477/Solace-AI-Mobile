import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Haptics from "expo-haptics";
import * as Crypto from "expo-crypto";
import { Alert, Linking, Platform } from "react-native";
import secureStorage from "../../app/services/secureStorage";
import { logger } from "@shared/utils/logger";
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

/**
 * Crisis Intervention Manager
 * Handles emergency situations, crisis detection, and resource provision
 * Built specifically for mental health applications
 */

class CrisisManager {
  constructor() {
    this.config = {
      keywords: CRISIS_KEYWORDS,
      weights: KEYWORD_WEIGHTS,
      combinations: DANGEROUS_COMBINATIONS,
      thresholds: RISK_THRESHOLDS,
      resources: EMERGENCY_RESOURCES,
    };

    this.emergencyResources = EMERGENCY_RESOURCES.US || [];
    this.safetyPlanTemplate = SAFETY_PLAN_TEMPLATE;
    this.configLoaded = false;
    this.configLoadingPromise = null;
  }

  async loadConfiguration() {
    if (this.configLoadingPromise) {
      return this.configLoadingPromise;
    }

    this.configLoadingPromise = (async () => {
      try {
        const remoteConfig = await loadRemoteCrisisConfig();
        if (remoteConfig) {
          this.config = mergeCrisisConfig(remoteConfig);
          this.emergencyResources = this.config.resources.US || EMERGENCY_RESOURCES.US;
        }
        this.configLoaded = true;
      } catch (error) {
        this.configLoaded = true;
      }
    })();

    return this.configLoadingPromise;
  }

  async ensureConfigLoaded() {
    if (!this.configLoaded) {
      await this.loadConfiguration();
    }
  }

  /**
   * Get all crisis keywords as a flat array
   */
  getCrisisKeywords() {
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
  async analyzeCrisisRisk(text) {
    await this.ensureConfigLoaded();

    if (!text || typeof text !== "string") {
      return { risk: "none", confidence: 0, indicators: [] };
    }

    const normalizedText = text.toLowerCase().trim();
    const detectedKeywords = [];
    let totalScore = 0;

    const { keywords, weights, combinations, thresholds } = this.config;

    // Check for crisis keywords by category
    Object.entries(keywords).forEach(([category, keywordList]) => {
      keywordList.forEach((keyword) => {
        if (normalizedText.includes(keyword.toLowerCase())) {
          detectedKeywords.push(keyword);
          totalScore += weights[category] || 3;
        }
      });
    });

    // Check for combination patterns (more concerning)
    combinations.forEach(([word1, word2]) => {
      if (normalizedText.includes(word1.toLowerCase()) &&
          normalizedText.includes(word2.toLowerCase())) {
        totalScore += COMBINATION_SCORE;
        detectedKeywords.push(`${word1} + ${word2}`);
      }
    });

    // Determine risk level based on configurable thresholds
    let riskLevel = "none";
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
  async handleCrisis(crisisAnalysis, userProfile = {}) {
    const { risk, confidence, indicators, requiresImmediate } = crisisAnalysis;

    // Log crisis event for safety
    await this.logCrisisEvent(crisisAnalysis, userProfile);

    // Provide haptic feedback for serious situations
    if (requiresImmediate && Platform.OS === "ios") {
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
    }

    const response = {
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
  async showCrisisAlert(crisisResponse) {
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
  async makeEmergencyCall(number) {
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
  async sendCrisisText() {
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
  getEmergencyResources(userProfile = {}) {
    let resources = [...this.emergencyResources];

    // Filter by specialty if applicable
    if (userProfile.demographics) {
      const { age, lgbtq, veteran } = userProfile.demographics;

      if (lgbtq && age < 25) {
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
  getSupportResources() {
    return SUPPORT_RESOURCES;
  }

  /**
   * Create safety plan
   * @param {Object} userInputs - User's safety plan inputs
   * @returns {Object} Formatted safety plan
   */
  async createSafetyPlan(userInputs) {
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
  async getSafetyPlan() {
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
  async updateSafetyPlan(updates) {
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
  async logCrisisEvent(crisisAnalysis, userProfile) {
    try {
      const indicatorsHash = await Crypto.digestStringAsync(
        Crypto.CryptoDigestAlgorithm.SHA256,
        JSON.stringify(crisisAnalysis.indicators.sort())
      );

      const userIdHash = await Crypto.digestStringAsync(
        Crypto.CryptoDigestAlgorithm.SHA256,
        (userProfile.id || "anonymous").toString()
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

      const existingLogs = await secureStorage.getSecureData("crisis_events") || [];
      const logs = Array.isArray(existingLogs) ? existingLogs : [];

      logs.push(event);

      const trimmedLogs = logs.slice(-50);

      await secureStorage.storeSensitiveData("crisis_events", trimmedLogs);

      if (crisisAnalysis.risk === "critical" || crisisAnalysis.risk === "high") {
        await this.notifyEmergencyContacts(event);
      }
    } catch (error) {
      this.fallbackCrisisLog(crisisAnalysis, userProfile);
    }
  }

  async fallbackCrisisLog(crisisAnalysis, userProfile) {
    try {
      const fallbackEvent = {
        timestamp: new Date().toISOString(),
        riskLevel: crisisAnalysis.risk,
        fallback: true,
      };
      await AsyncStorage.setItem(
        `crisis_fallback_${Date.now()}`,
        JSON.stringify(fallbackEvent)
      );
    } catch {
      // Silent fallback failure
    }
  }

  async notifyEmergencyContacts(event) {
    // Implementation for notifying emergency contacts if configured
  }

  /**
   * Log emergency action taken
   * @param {string} actionType - Type of action (call, text, etc.)
   * @param {string} target - Target of action (phone number, etc.)
   */
  async logEmergencyAction(actionType, target) {
    try {
      const targetHash = await Crypto.digestStringAsync(
        Crypto.CryptoDigestAlgorithm.SHA256,
        target || "unknown"
      );

      const action = {
        timestamp: new Date().toISOString(),
        type: actionType,
        targetHash,
        successful: true,
      };

      const existingActions = await secureStorage.getSecureData("emergency_actions") || [];
      const actions = Array.isArray(existingActions) ? existingActions : [];

      actions.push(action);

      const trimmedActions = actions.slice(-50);

      await secureStorage.storeSensitiveData("emergency_actions", trimmedActions);
    } catch (error) {
      // Silent fallback
    }
  }

  /**
   * Get crisis statistics for user insights
   * @returns {Object} Crisis statistics
   */
  async getCrisisStatistics() {
    try {
      const crisisEvents = await secureStorage.getSecureData("crisis_events") || [];
      const emergencyActions = await secureStorage.getSecureData("emergency_actions") || [];

      const last30Days = new Date();
      last30Days.setDate(last30Days.getDate() - 30);

      const recentEvents = crisisEvents.filter(
        (event) => new Date(event.timestamp) > last30Days,
      );

      const recentActions = emergencyActions.filter(
        (action) => new Date(action.timestamp) > last30Days,
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
  calculateRiskDistribution(events) {
    const distribution = { none: 0, low: 0, moderate: 0, high: 0, critical: 0 };

    events.forEach((event) => {
      if (distribution.hasOwnProperty(event.riskLevel)) {
        distribution[event.riskLevel]++;
      }
    });

    return distribution;
  }

  /**
   * Get most common crisis indicators
   * @param {Array} events - Crisis events
   * @returns {Array} Top indicators
   */
  getTopIndicators(events) {
    const indicatorCounts = {};

    events.forEach((event) => {
      event.indicators?.forEach((indicator) => {
        indicatorCounts[indicator] = (indicatorCounts[indicator] || 0) + 1;
      });
    });

    return Object.entries(indicatorCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 10)
      .map(([indicator, count]) => ({ indicator, count }));
  }

  /**
   * Calculate crisis response rate
   * @param {Array} events - Crisis events
   * @param {Array} actions - Emergency actions
   * @returns {number} Response rate (0-1)
   */
  calculateResponseRate(events, actions) {
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
        const timeDiff = actionTime - eventTime;
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
  async getCrisisHistory() {
    try {
      const events = await AsyncStorage.getItem("crisis_events");
      return events ? JSON.parse(events) : [];
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
  anonymizeCrisisData(data) {
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
  prepareProviderReport(crisisData) {
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
  async scheduleFollowUp(followUpData) {
    const followUp = {
      id: `followup_${Date.now()}`,
      type: followUpData.type || "crisis_followup",
      scheduled_time: followUpData.scheduledTime || new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // Default to 24 hours
      provider: followUpData.provider || "crisis_team",
      priority: followUpData.priority || "high",
      notes: followUpData.notes || "",
      reminder_set: true,
      created_at: new Date().toISOString(),
    };

    try {
      const existingFollowUps = await AsyncStorage.getItem("scheduled_followups");
      const followUps = existingFollowUps ? JSON.parse(existingFollowUps) : [];

      followUps.push(followUp);
      await AsyncStorage.setItem("scheduled_followups", JSON.stringify(followUps));

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
  generateProviderRecommendations(crisisData) {
    const recommendations = [];

    switch (crisisData.riskLevel) {
      case "critical":
        recommendations.push(
          "Immediate psychiatric evaluation recommended",
          "Consider inpatient stabilization",
          "Monitor for suicidal ideation",
          "Coordinate with emergency services"
        );
        break;
      case "high":
        recommendations.push(
          "Schedule urgent mental health assessment",
          "Consider crisis intervention therapy",
          "Monitor medication compliance",
          "Establish safety plan"
        );
        break;
      case "moderate":
        recommendations.push(
          "Schedule outpatient therapy appointment",
          "Consider medication evaluation",
          "Implement coping strategies",
          "Regular follow-up monitoring"
        );
        break;
      case "low":
        recommendations.push(
          "Continue supportive therapy",
          "Monitor symptom progression",
          "Reinforce coping skills",
          "Regular wellness check-ins"
        );
        break;
    }

    return recommendations;
  }
}

export default new CrisisManager();
