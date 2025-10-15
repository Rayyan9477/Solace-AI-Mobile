import AsyncStorage from "@react-native-async-storage/async-storage";
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

/**
 * Crisis Intervention Manager
 * Handles emergency situations, crisis detection, and resource provision
 * Built specifically for mental health applications
 */

class CrisisManager {
  constructor() {
    // Use configuration from crisisConfig
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

    // Load remote configuration asynchronously
    this.loadConfiguration();
  }

  /**
   * Load and merge remote configuration with local defaults
   */
  async loadConfiguration() {
    try {
      const remoteConfig = await loadRemoteCrisisConfig();
      if (remoteConfig) {
        this.config = mergeCrisisConfig(remoteConfig);
        this.emergencyResources = this.config.resources.US || EMERGENCY_RESOURCES.US;
        console.log('Crisis configuration updated from remote source');
      }
      this.configLoaded = true;
    } catch (error) {
      console.warn('Failed to load remote crisis configuration:', error);
      this.configLoaded = true;
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
  analyzeCrisisRisk(text) {
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
      console.error("Error making emergency call:", error);
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
      console.error("Error sending crisis text:", error);
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

    // Add default emergency contacts if none provided
    if (safetyPlan.emergencyContacts.length === 0) {
      safetyPlan.emergencyContacts = [
        { name: "988 Crisis Lifeline", number: "988", type: "crisis" },
        { name: "Emergency Services", number: "911", type: "emergency" },
      ];
    }

    // Save safety plan
    await AsyncStorage.setItem("user_safety_plan", JSON.stringify(safetyPlan));

    return safetyPlan;
  }

  /**
   * Get saved safety plan
   * @returns {Object|null} User's safety plan
   */
  async getSafetyPlan() {
    try {
      const safetyPlanData = await AsyncStorage.getItem("user_safety_plan");
      return safetyPlanData ? JSON.parse(safetyPlanData) : null;
    } catch (error) {
      console.error("Error loading safety plan:", error);
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

    await AsyncStorage.setItem("user_safety_plan", JSON.stringify(updatedPlan));

    return updatedPlan;
  }

  /**
   * Log crisis event for safety and analytics
   * @param {Object} crisisAnalysis - Crisis analysis result
   * @param {Object} userProfile - User profile
   */
  async logCrisisEvent(crisisAnalysis, userProfile) {
    try {
      const event = {
        timestamp: new Date().toISOString(),
        riskLevel: crisisAnalysis.risk,
        confidence: crisisAnalysis.confidence,
        indicators: crisisAnalysis.indicators,
        userId: userProfile.id || "anonymous",
        sessionId: userProfile.sessionId || null,
        responded: false, // Will be updated when user takes action
      };

      const existingLogs = await AsyncStorage.getItem("crisis_events");
      const logs = existingLogs ? JSON.parse(existingLogs) : [];

      logs.push(event);

      // Keep only last 100 events for privacy
      const trimmedLogs = logs.slice(-100);

      await AsyncStorage.setItem("crisis_events", JSON.stringify(trimmedLogs));
    } catch (error) {
      console.error("Error logging crisis event:", error);
    }
  }

  /**
   * Log emergency action taken
   * @param {string} actionType - Type of action (call, text, etc.)
   * @param {string} target - Target of action (phone number, etc.)
   */
  async logEmergencyAction(actionType, target) {
    try {
      const action = {
        timestamp: new Date().toISOString(),
        type: actionType,
        target,
        successful: true,
      };

      const existingActions = await AsyncStorage.getItem("emergency_actions");
      const actions = existingActions ? JSON.parse(existingActions) : [];

      actions.push(action);

      // Keep only last 50 actions
      const trimmedActions = actions.slice(-50);

      await AsyncStorage.setItem(
        "emergency_actions",
        JSON.stringify(trimmedActions),
      );
    } catch (error) {
      console.error("Error logging emergency action:", error);
    }
  }

  /**
   * Get crisis statistics for user insights
   * @returns {Object} Crisis statistics
   */
  async getCrisisStatistics() {
    try {
      const events = await AsyncStorage.getItem("crisis_events");
      const actions = await AsyncStorage.getItem("emergency_actions");

      const crisisEvents = events ? JSON.parse(events) : [];
      const emergencyActions = actions ? JSON.parse(actions) : [];

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
      console.error("Error getting crisis statistics:", error);
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
}

export default new CrisisManager();
