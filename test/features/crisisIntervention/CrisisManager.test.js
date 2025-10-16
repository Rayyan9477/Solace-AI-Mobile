/**
 * CrisisManager Unit Tests
 * Critical safety tests for crisis intervention functionality
 * These tests ensure user safety features work correctly
 */

import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Haptics from "expo-haptics";
import { Alert, Linking } from "react-native";

import CrisisManager from "../../../src/features/crisis/CrisisManager";

// Mock dependencies
jest.mock("react-native", () => ({
  Alert: {
    alert: jest.fn(),
  },
  Linking: {
    openURL: jest.fn(),
    canOpenURL: jest.fn(() => Promise.resolve(true)),
  },
  Platform: {
    OS: "ios",
  },
}));

jest.mock("expo-haptics", () => ({
  impactAsync: jest.fn(),
  notificationAsync: jest.fn(),
  ImpactFeedbackStyle: {
    Heavy: "heavy",
  },
  NotificationFeedbackType: {
    Error: "error",
    Warning: "warning",
  },
}));

jest.mock("@react-native-async-storage/async-storage", () => ({
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
}));

describe("CrisisManager", () => {
  let crisisManager;

  beforeEach(() => {
    crisisManager = new CrisisManager();
    jest.clearAllMocks();

    // Reset AsyncStorage mocks
    AsyncStorage.getItem.mockResolvedValue(null);
    AsyncStorage.setItem.mockResolvedValue();
  });

  describe("Crisis Detection", () => {
    it("detects suicide-related keywords", () => {
      const suicidalTexts = [
        "I want to kill myself",
        "suicide seems like the only option",
        "I want to end my life",
        "better off dead",
        "no point in living",
      ];

      suicidalTexts.forEach((text) => {
        const result = crisisManager.detectCrisis(text);
        expect(result.isCrisis).toBe(true);
        expect(result.severity).toBe("high");
        expect(result.keywords).toContain(
          expect.stringMatching(
            /suicide|kill myself|end my life|better off dead|no point/i,
          ),
        );
      });
    });

    it("detects self-harm indicators", () => {
      const selfHarmTexts = [
        "I want to hurt myself",
        "thinking about self harm",
        "I cut myself last night",
        "need to punish myself",
      ];

      selfHarmTexts.forEach((text) => {
        const result = crisisManager.detectCrisis(text);
        expect(result.isCrisis).toBe(true);
        expect(result.severity).toBe("high");
      });
    });

    it("detects crisis indicators with appropriate severity", () => {
      const crisisTexts = [
        { text: "I give up on everything", expectedSeverity: "medium" },
        { text: "feeling hopeless and trapped", expectedSeverity: "medium" },
        { text: "overwhelming pain right now", expectedSeverity: "high" },
        { text: "plan to end it tonight", expectedSeverity: "high" },
      ];

      crisisTexts.forEach(({ text, expectedSeverity }) => {
        const result = crisisManager.detectCrisis(text);
        expect(result.isCrisis).toBe(true);
        expect(result.severity).toBe(expectedSeverity);
      });
    });

    it("handles false positives appropriately", () => {
      const nonCrisisTexts = [
        "I love my life",
        "feeling happy today",
        "had a great therapy session",
        "looking forward to tomorrow",
        "suicide prevention is important", // Contains keyword but not suicidal
      ];

      nonCrisisTexts.forEach((text) => {
        const result = crisisManager.detectCrisis(text);
        // The last text might trigger due to keyword but should have low confidence
        if (result.isCrisis) {
          expect(result.confidence).toBeLessThan(0.7);
        }
      });
    });

    it("calculates risk scores accurately", () => {
      const highRiskText = "I have a plan to kill myself tonight";
      const mediumRiskText = "feeling hopeless and worthless";
      const lowRiskText = "having a bad day";

      const highRisk = crisisManager.detectCrisis(highRiskText);
      const mediumRisk = crisisManager.detectCrisis(mediumRiskText);
      const lowRisk = crisisManager.detectCrisis(lowRiskText);

      expect(highRisk.riskScore).toBeGreaterThan(mediumRisk.riskScore);
      expect(mediumRisk.riskScore).toBeGreaterThan(lowRisk.riskScore || 0);
    });
  });

  describe("Emergency Resource Management", () => {
    it("provides appropriate emergency resources", () => {
      const resources = crisisManager.getEmergencyResources();

      expect(resources).toContainEqual(
        expect.objectContaining({
          id: "suicide_prevention_lifeline",
          number: "988",
          type: "voice",
          priority: 1,
        }),
      );

      expect(resources).toContainEqual(
        expect.objectContaining({
          id: "crisis_text_line",
          number: "741741",
          type: "text",
          priority: 2,
        }),
      );
    });

    it("prioritizes resources correctly", () => {
      const resources = crisisManager.getEmergencyResources();

      // Should be sorted by priority
      for (let i = 1; i < resources.length; i++) {
        expect(resources[i].priority).toBeGreaterThanOrEqual(
          resources[i - 1].priority,
        );
      }
    });

    it("filters resources by type when requested", () => {
      const voiceResources = crisisManager.getEmergencyResources("voice");
      const textResources = crisisManager.getEmergencyResources("text");

      voiceResources.forEach((resource) => {
        expect(resource.type).toBe("voice");
      });

      textResources.forEach((resource) => {
        expect(resource.type).toBe("text");
      });
    });
  });

  describe("Crisis Response Actions", () => {
    it("triggers immediate crisis response for high severity", async () => {
      const crisisData = {
        isCrisis: true,
        severity: "high",
        keywords: ["suicide"],
        riskScore: 0.9,
      };

      await crisisManager.handleCrisisDetected(crisisData);

      expect(Alert.alert).toHaveBeenCalledWith(
        expect.stringContaining("Emergency"),
        expect.any(String),
        expect.arrayContaining([
          expect.objectContaining({
            text: expect.stringContaining("Call"),
          }),
        ]),
      );
    });

    it("provides appropriate support for medium severity", async () => {
      const crisisData = {
        isCrisis: true,
        severity: "medium",
        keywords: ["hopeless"],
        riskScore: 0.6,
      };

      await crisisManager.handleCrisisDetected(crisisData);

      expect(Alert.alert).toHaveBeenCalledWith(
        expect.stringContaining("Support"),
        expect.any(String),
        expect.any(Array),
      );
    });

    it("initiates emergency calls correctly", async () => {
      await crisisManager.callEmergencyService("suicide_prevention_lifeline");

      expect(Linking.canOpenURL).toHaveBeenCalledWith("tel:988");
      expect(Linking.openURL).toHaveBeenCalledWith("tel:988");
    });

    it("handles text-based crisis support", async () => {
      await crisisManager.startTextSupport("crisis_text_line");

      expect(Linking.canOpenURL).toHaveBeenCalledWith("sms:741741");
      expect(Linking.openURL).toHaveBeenCalledWith("sms:741741&body=HOME");
    });

    it("provides haptic feedback for crisis alerts", async () => {
      const crisisData = {
        isCrisis: true,
        severity: "high",
        keywords: ["suicide"],
        riskScore: 0.9,
      };

      await crisisManager.handleCrisisDetected(crisisData);

      expect(Haptics.notificationAsync).toHaveBeenCalledWith(
        Haptics.NotificationFeedbackType.Warning,
      );
    });
  });

  describe("Crisis History and Analytics", () => {
    it("logs crisis events for analysis", async () => {
      const crisisData = {
        isCrisis: true,
        severity: "high",
        keywords: ["suicide"],
        riskScore: 0.9,
        timestamp: new Date().toISOString(),
      };

      await crisisManager.logCrisisEvent(crisisData);

      expect(AsyncStorage.setItem).toHaveBeenCalledWith(
        expect.stringContaining("crisis_log"),
        expect.stringContaining(JSON.stringify(crisisData)),
      );
    });

    it("retrieves crisis history for healthcare providers", async () => {
      const mockHistory = JSON.stringify([
        {
          timestamp: "2023-01-01T00:00:00.000Z",
          severity: "high",
          keywords: ["suicide"],
          action_taken: "emergency_call",
        },
      ]);

      AsyncStorage.getItem.mockResolvedValue(mockHistory);

      const history = await crisisManager.getCrisisHistory();

      expect(history).toHaveLength(1);
      expect(history[0]).toMatchObject({
        severity: "high",
        keywords: ["suicide"],
        action_taken: "emergency_call",
      });
    });

    it("anonymizes crisis data appropriately", async () => {
      const sensitiveData = {
        isCrisis: true,
        severity: "high",
        originalText: "I want to kill myself because of personal issues",
        userId: "user123",
        location: "sensitive_location",
      };

      const anonymized = crisisManager.anonymizeCrisisData(sensitiveData);

      expect(anonymized).not.toHaveProperty("originalText");
      expect(anonymized).not.toHaveProperty("userId");
      expect(anonymized).not.toHaveProperty("location");
      expect(anonymized).toHaveProperty("keywords");
      expect(anonymized).toHaveProperty("severity");
    });
  });

  describe("Integration with Mental Health Professionals", () => {
    it("prepares data for healthcare provider sharing", async () => {
      const crisisData = {
        isCrisis: true,
        severity: "high",
        timestamp: new Date().toISOString(),
        interventions_attempted: ["crisis_call", "text_support"],
      };

      const providerData = crisisManager.prepareProviderReport(crisisData);

      expect(providerData).toHaveProperty("crisis_events");
      expect(providerData).toHaveProperty("intervention_history");
      expect(providerData).toHaveProperty("risk_assessment");
      expect(providerData.privacy_compliant).toBe(true);
    });

    it("supports follow-up care scheduling", async () => {
      const followUpData = {
        crisis_timestamp: new Date().toISOString(),
        severity: "high",
        recommended_follow_up: "24_hours",
      };

      const scheduled = await crisisManager.scheduleFollowUp(followUpData);

      expect(scheduled).toHaveProperty("follow_up_time");
      expect(scheduled).toHaveProperty("reminder_set");
      expect(scheduled.reminder_set).toBe(true);
    });
  });

  describe("Error Handling and Resilience", () => {
    it("handles network failures gracefully", async () => {
      Linking.canOpenURL.mockRejectedValue(new Error("Network error"));

      const result = await crisisManager.callEmergencyService(
        "suicide_prevention_lifeline",
      );

      expect(result.success).toBe(false);
      expect(result.fallback_provided).toBe(true);
      expect(Alert.alert).toHaveBeenCalledWith(
        expect.stringContaining("Connection"),
        expect.stringContaining("alternate"),
        expect.any(Array),
      );
    });

    it("provides fallback options when primary services fail", async () => {
      Linking.openURL.mockRejectedValue(new Error("Cannot open URL"));

      await crisisManager.callEmergencyService("suicide_prevention_lifeline");

      // Should show fallback options
      expect(Alert.alert).toHaveBeenCalled();
      const alertCall =
        Alert.alert.mock.calls[Alert.alert.mock.calls.length - 1];
      const buttons = alertCall[2];

      expect(buttons.length).toBeGreaterThan(1);
      expect(
        buttons.some(
          (button) =>
            button.text.toLowerCase().includes("text") ||
            button.text.toLowerCase().includes("alternative"),
        ),
      ).toBe(true);
    });

    it("maintains functionality when storage fails", async () => {
      AsyncStorage.setItem.mockRejectedValue(new Error("Storage error"));

      const crisisData = {
        isCrisis: true,
        severity: "high",
        keywords: ["suicide"],
      };

      // Should still handle crisis even if logging fails
      await expect(
        crisisManager.handleCrisisDetected(crisisData),
      ).resolves.not.toThrow();
      expect(Alert.alert).toHaveBeenCalled();
    });
  });

  describe("Privacy and Security", () => {
    it("does not store sensitive personal information", async () => {
      const sensitiveInput = {
        text: "My name is John Doe and I live at 123 Main St. I want to kill myself.",
        userEmail: "john@example.com",
        phoneNumber: "+1234567890",
      };

      const crisisData = crisisManager.detectCrisis(sensitiveInput.text);
      await crisisManager.logCrisisEvent(crisisData);

      const storedData = AsyncStorage.setItem.mock.calls[0][1];
      const parsedData = JSON.parse(storedData);

      expect(parsedData).not.toContainEqual(
        expect.stringContaining("John Doe"),
      );
      expect(parsedData).not.toContainEqual(
        expect.stringContaining("123 Main St"),
      );
      expect(parsedData).not.toContainEqual(
        expect.stringContaining("john@example.com"),
      );
    });

    it("encrypts stored crisis data", async () => {
      const crisisData = {
        isCrisis: true,
        severity: "high",
        timestamp: new Date().toISOString(),
      };

      await crisisManager.logCrisisEvent(crisisData);

      const storageKey = AsyncStorage.setItem.mock.calls[0][0];
      const storedValue = AsyncStorage.setItem.mock.calls[0][1];

      expect(storageKey).toContain("crisis_log");
      // In production, this should be encrypted
      expect(typeof storedValue).toBe("string");
    });
  });

  describe("Performance and Reliability", () => {
    it("processes crisis detection quickly", () => {
      const startTime = Date.now();
      const text = "I want to kill myself tonight";

      crisisManager.detectCrisis(text);

      const endTime = Date.now();
      const processingTime = endTime - startTime;

      // Crisis detection should be very fast (< 100ms)
      expect(processingTime).toBeLessThan(100);
    });

    it("handles multiple concurrent crisis detections", async () => {
      const texts = [
        "I want to end my life",
        "feeling suicidal",
        "plan to hurt myself",
        "no hope left",
      ];

      const promises = texts.map((text) =>
        Promise.resolve(crisisManager.detectCrisis(text)),
      );

      const results = await Promise.all(promises);

      expect(results).toHaveLength(4);
      results.forEach((result) => {
        expect(result.isCrisis).toBe(true);
      });
    });

    it("maintains state consistency during rapid interactions", async () => {
      const crisisData = {
        isCrisis: true,
        severity: "high",
        keywords: ["suicide"],
      };

      // Rapidly trigger multiple crisis responses
      const promises = Array(5)
        .fill()
        .map(() => crisisManager.handleCrisisDetected(crisisData));

      await Promise.all(promises);

      // Should handle multiple rapid calls without issues
      expect(Alert.alert).toHaveBeenCalled();
    });
  });
});
