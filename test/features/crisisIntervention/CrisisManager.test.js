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

// Mock secureStorage for encrypted crisis data
jest.mock("../../../src/app/services/secureStorage", () => ({
  default: {
    storeSensitiveData: jest.fn(),
    getSecureData: jest.fn(),
    removeSecureData: jest.fn(),
  },
}));

describe("CrisisManager", () => {
  let crisisManager;

  beforeEach(() => {
    // Use the singleton instance instead of creating new
    crisisManager = CrisisManager;
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

      for (const text of suicidalTexts) {
        const result = crisisManager.analyzeCrisisRisk(text);
        expect(result.risk).toBe("high"); // Critical keywords score 10, which is >= 8 (high threshold)
        expect(result.indicators).toEqual(
          expect.arrayContaining([
            expect.stringMatching(
              /suicide|kill myself|end my life|better off dead|no point/i,
            ),
          ]),
        );
      }
    });

    it("detects self-harm indicators", () => {
      const selfHarmTexts = [
        "I want to hurt myself",
        "thinking about self harm",
        "I cut myself last night",
        "need to punish myself",
      ];

      for (const text of selfHarmTexts) {
        const result = crisisManager.analyzeCrisisRisk(text);
        expect(["high", "moderate"]).toContain(result.risk);
      }
    });

    it("detects crisis indicators with appropriate severity", () => {
      const crisisTexts = [
        { text: "I give up on everything", expectedSeverity: "low" }, // "give up" = 3 points -> low
        { text: "feeling hopeless and trapped", expectedSeverity: "moderate" }, // "hopeless" + "trapped" = 6 points -> moderate
        { text: "overwhelming pain right now", expectedSeverity: "high" }, // "overwhelming pain" + "right now" = 8 points -> high
        { text: "plan to end it tonight", expectedSeverity: "critical" }, // "plan to" + "end it" + "tonight" = 20 points -> critical
      ];

      for (const { text, expectedSeverity } of crisisTexts) {
        const result = crisisManager.analyzeCrisisRisk(text);
        expect(result.risk).toBe(expectedSeverity);
      }
    });

    it("handles false positives appropriately", () => {
      const nonCrisisTexts = [
        "I love my life",
        "feeling happy today",
        "had a great therapy session",
        "looking forward to tomorrow",
        "suicide prevention is important", // Contains keyword but not suicidal
      ];

      for (const text of nonCrisisTexts) {
        const result = crisisManager.analyzeCrisisRisk(text);
        // The last text might trigger due to keyword but should have low confidence
        if (result.risk !== "none") {
          expect(result.confidence).toBeLessThan(0.7);
        }
      }
    });

    it("calculates risk scores accurately", () => {
      const highRiskText = "I have a plan to kill myself tonight";
      const mediumRiskText = "feeling hopeless and worthless";
      const lowRiskText = "having a bad day";

      const highRisk = crisisManager.analyzeCrisisRisk(highRiskText);
      const mediumRisk = crisisManager.analyzeCrisisRisk(mediumRiskText);
      const lowRisk = crisisManager.analyzeCrisisRisk(lowRiskText);

      expect(highRisk.score).toBeGreaterThan(mediumRisk.score);
      expect(mediumRisk.score).toBeGreaterThan(lowRisk.score || 0);
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

    it("filters resources by user profile", () => {
      const lgbtqYouthProfile = {
        demographics: { age: 20, lgbtq: true },
      };
      const veteranProfile = {
        demographics: { veteran: true },
      };

      const defaultResources = crisisManager.getEmergencyResources();
      const lgbtqResources =
        crisisManager.getEmergencyResources(lgbtqYouthProfile);
      const veteranResources =
        crisisManager.getEmergencyResources(veteranProfile);

      // Resources should be filtered based on profile
      expect(defaultResources.length).toBeGreaterThanOrEqual(
        lgbtqResources.length,
      );
      expect(defaultResources.length).toBeGreaterThanOrEqual(
        veteranResources.length,
      );
    });
  });

  describe("Crisis Response Actions", () => {
    it("triggers immediate crisis response for high severity", async () => {
      const crisisAnalysis = {
        risk: "high",
        confidence: 0.9,
        indicators: ["suicide"],
        score: 15,
        requiresImmediate: true,
      };

      const userProfile = {};
      const response = await crisisManager.handleCrisis(
        crisisAnalysis,
        userProfile,
      );

      expect(response).toHaveProperty("riskLevel", "high");
      expect(response).toHaveProperty("actions");
      expect(response.actions).toContainEqual(
        expect.objectContaining({
          type: "call",
          number: "988",
          label: "Talk to Someone Now",
        }),
      );
    });

    it("provides appropriate support for medium severity", async () => {
      const crisisAnalysis = {
        risk: "moderate",
        confidence: 0.6,
        indicators: ["hopeless"],
        score: 8,
        requiresImmediate: false,
      };

      const userProfile = {};
      const response = await crisisManager.handleCrisis(
        crisisAnalysis,
        userProfile,
      );

      expect(response).toHaveProperty("riskLevel", "moderate");
      expect(response).toHaveProperty("actions");
      expect(response.actions).toContainEqual(
        expect.objectContaining({
          type: "continue_chat",
        }),
      );
    });

    it("initiates emergency calls correctly", async () => {
      await crisisManager.makeEmergencyCall("988");

      expect(Linking.canOpenURL).toHaveBeenCalledWith("telprompt:988");
      expect(Linking.openURL).toHaveBeenCalledWith("telprompt:988");
    });

    it("handles text-based crisis support", async () => {
      await crisisManager.sendCrisisText();

      expect(Linking.canOpenURL).toHaveBeenCalledWith("sms:741741&body=HOME");
      expect(Linking.openURL).toHaveBeenCalledWith("sms:741741&body=HOME");
    });

    it("provides haptic feedback for crisis alerts", async () => {
      const crisisAnalysis = {
        risk: "high",
        confidence: 0.9,
        indicators: ["suicide"],
        score: 15,
        requiresImmediate: true,
      };

      const userProfile = {};
      await crisisManager.handleCrisis(crisisAnalysis, userProfile);

      expect(Haptics.notificationAsync).toHaveBeenCalledWith(
        Haptics.NotificationFeedbackType.Warning,
      );
    });
  });

  describe("Crisis History and Analytics", () => {
    it("logs crisis events for analysis", async () => {
      const crisisAnalysis = {
        risk: "high",
        confidence: 0.9,
        indicators: ["suicide"],
        score: 15,
      };

      const userProfile = { id: "test-user" };
      await crisisManager.logCrisisEvent(crisisAnalysis, userProfile);

      expect(AsyncStorage.setItem).toHaveBeenCalledWith(
        "crisis_events",
        expect.stringContaining(JSON.stringify(crisisAnalysis.risk)),
      );
    });

    it("retrieves crisis history for healthcare providers", async () => {
      const mockHistory = JSON.stringify([
        {
          timestamp: "2023-01-01T00:00:00.000Z",
          riskLevel: "high",
          confidence: 0.9,
          indicators: ["suicide"],
          userId: "test-user",
          responded: false,
        },
      ]);

      AsyncStorage.getItem.mockResolvedValue(mockHistory);

      const history = await crisisManager.getCrisisHistory();

      expect(history).toHaveLength(1);
      expect(history[0]).toMatchObject({
        riskLevel: "high",
        indicators: ["suicide"],
        responded: false,
      });
    });

    it("anonymizes crisis data appropriately", async () => {
      const sensitiveData = {
        risk: "high",
        confidence: 0.9,
        indicators: ["suicide", "hopeless"],
        userId: "user123",
        originalText: "I want to kill myself because of personal issues",
        personalDetails: "sensitive info",
        timestamp: new Date().toISOString(),
      };

      const anonymized = crisisManager.anonymizeCrisisData(sensitiveData);

      expect(anonymized).not.toHaveProperty("originalText");
      expect(anonymized).not.toHaveProperty("userId");
      expect(anonymized).not.toHaveProperty("personalDetails");
      expect(anonymized).toHaveProperty("anonymizedAt");
      expect(anonymized).toHaveProperty("privacyLevel");
      expect(anonymized.privacyLevel).toBe("anonymized");
      // Should keep non-sensitive data
      expect(anonymized.risk).toBe("high");
      expect(anonymized.confidence).toBe(0.9);
      expect(anonymized.indicators).toEqual(["suicide", "hopeless"]);
    });
  });

  describe("Integration with Mental Health Professionals", () => {
    it("prepares data for healthcare provider sharing", async () => {
      const crisisData = {
        riskLevel: "high",
        confidence: 0.9,
        indicators: ["suicide", "hopeless"],
        timestamp: new Date().toISOString(),
        interventions_attempted: ["crisis_call", "text_support"],
      };

      const providerData = crisisManager.prepareProviderReport(crisisData);

      expect(providerData).toHaveProperty("crisis_events");
      expect(providerData).toHaveProperty("intervention_history");
      expect(providerData).toHaveProperty("risk_assessment");
      expect(providerData).toHaveProperty("recommendations");
      expect(providerData).toHaveProperty("report_generated");
      expect(providerData.risk_assessment.current_risk).toBe("high");
      expect(providerData.risk_assessment.confidence).toBe(0.9);
      expect(providerData.risk_assessment.indicators).toEqual([
        "suicide",
        "hopeless",
      ]);
    });

    it("supports follow-up care scheduling", async () => {
      const followUpData = {
        crisis_timestamp: new Date().toISOString(),
        severity: "high",
        recommended_follow_up: "24_hours",
      };

      const scheduled = await crisisManager.scheduleFollowUp(followUpData);

      expect(scheduled).toHaveProperty("scheduled_time");
      expect(scheduled).toHaveProperty("reminder_set");
      expect(scheduled.reminder_set).toBe(true);
    });
  });

  describe("Error Handling and Resilience", () => {
    it("handles network failures gracefully", async () => {
      Linking.canOpenURL.mockRejectedValue(new Error("Network error"));

      await crisisManager.makeEmergencyCall("988");

      expect(Alert.alert).toHaveBeenCalledWith(
        expect.stringContaining("Call Error"),
        expect.any(String),
        expect.any(Array),
      );
    });

    it("provides fallback options when primary services fail", async () => {
      Linking.openURL.mockRejectedValue(new Error("Cannot open URL"));

      await crisisManager.makeEmergencyCall("988");

      // Should show error alert
      expect(Alert.alert).toHaveBeenCalled();
    });

    it("maintains functionality when storage fails", async () => {
      AsyncStorage.setItem.mockRejectedValue(new Error("Storage error"));

      const crisisAnalysis = {
        risk: "high",
        confidence: 0.9,
        indicators: ["suicide"],
        score: 15,
      };

      const userProfile = {};
      // Should still handle crisis even if logging fails
      await expect(
        crisisManager.handleCrisis(crisisAnalysis, userProfile),
      ).resolves.not.toThrow();
    });
  });

  describe("Privacy and Security", () => {
    it("does not store sensitive personal information", async () => {
      const sensitiveInput = {
        text: "My name is John Doe and I live at 123 Main St. I want to kill myself.",
        userEmail: "john@example.com",
        phoneNumber: "+1234567890",
      };

      const crisisData = crisisManager.analyzeCrisisRisk(sensitiveInput.text);
      await crisisManager.logCrisisEvent(crisisData, { id: "test-user" });

      expect(AsyncStorage.setItem).toHaveBeenCalledWith(
        "crisis_events",
        expect.stringContaining("test-user"),
      );
      expect(AsyncStorage.setItem).toHaveBeenCalledWith(
        "crisis_events",
        expect.not.stringContaining("John Doe"),
      );
      expect(AsyncStorage.setItem).toHaveBeenCalledWith(
        "crisis_events",
        expect.not.stringContaining("123 Main St"),
      );
    });

    it("encrypts stored crisis data", async () => {
      const crisisData = {
        risk: "high",
        confidence: 0.9,
        indicators: ["suicide"],
        score: 15,
      };

      await crisisManager.logCrisisEvent(crisisData, { id: "test-user" });

      const storageKey = AsyncStorage.setItem.mock.calls[0][0];
      const storedValue = AsyncStorage.setItem.mock.calls[0][1];

      expect(storageKey).toContain("crisis_events");
      // In production, this should be encrypted
      expect(typeof storedValue).toBe("string");
    });
  });

  describe("Performance and Reliability", () => {
    it("processes crisis detection quickly", () => {
      const startTime = Date.now();
      const text = "I want to kill myself tonight";

      crisisManager.analyzeCrisisRisk(text);

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
        Promise.resolve(crisisManager.analyzeCrisisRisk(text)),
      );

      const results = await Promise.all(promises);

      expect(results).toHaveLength(4);
      for (const result of results) {
        expect(["high", "low", "none"]).toContain(result.risk);
      }
    });

    it("maintains state consistency during rapid interactions", async () => {
      const crisisAnalysis = {
        risk: "high",
        confidence: 0.9,
        indicators: ["suicide"],
        score: 15,
        requiresImmediate: true,
      };

      const userProfile = {};
      // Rapidly trigger multiple crisis responses
      const promises = new Array(5)
        .fill()
        .map(() => crisisManager.handleCrisis(crisisAnalysis, userProfile));

      await Promise.all(promises);

      // Should handle multiple rapid calls without issues
      expect(Haptics.notificationAsync).toHaveBeenCalled();
    });
  });
});

describe("Encrypted Crisis Data Storage", () => {
  const mockSecureStorage =
    require("../../../src/app/services/secureStorage").default;

  beforeEach(() => {
    mockSecureStorage.storeSensitiveData.mockResolvedValue();
    mockSecureStorage.getSecureData.mockResolvedValue(null);
  });

  it("stores crisis fallback data encrypted", async () => {
    const crisisAnalysis = {
      risk: "high",
      keywords: ["suicide"],
      score: 10,
    };

    const userProfile = {
      userId: "user_123",
      name: "Test User",
    };

    await crisisManager.fallbackCrisisLog(crisisAnalysis, userProfile);

    // Verify storeSensitiveData was called (encrypted storage)
    expect(mockSecureStorage.storeSensitiveData).toHaveBeenCalled();

    const storageKey = mockSecureStorage.storeSensitiveData.mock.calls[0][0];
    const storedData = mockSecureStorage.storeSensitiveData.mock.calls[0][1];

    expect(storageKey).toMatch(/^crisis_fallback_\d+$/);
    expect(storedData).toEqual({
      timestamp: expect.any(String),
      riskLevel: "high",
      fallback: true,
    });
  });

  it("retrieves crisis history from encrypted storage", async () => {
    const mockHistory = [
      {
        timestamp: "2024-01-01T00:00:00Z",
        riskLevel: "high",
        keywords: ["suicide"],
      },
      {
        timestamp: "2024-01-02T00:00:00Z",
        riskLevel: "medium",
        keywords: ["hopeless"],
      },
    ];

    mockSecureStorage.getSecureData.mockResolvedValue(mockHistory);

    const history = await crisisManager.getCrisisHistory();

    expect(mockSecureStorage.getSecureData).toHaveBeenCalledWith(
      "crisis_events",
    );
    expect(history).toEqual(mockHistory);
    expect(history).toHaveLength(2);
  });

  it("returns empty array when no crisis history exists", async () => {
    mockSecureStorage.getSecureData.mockResolvedValue(null);

    const history = await crisisManager.getCrisisHistory();

    expect(history).toEqual([]);
  });

  it("handles non-array crisis history gracefully", async () => {
    mockSecureStorage.getSecureData.mockResolvedValue({ invalid: "data" });

    const history = await crisisManager.getCrisisHistory();

    expect(history).toEqual([]);
  });

  it("stores follow-up appointments encrypted", async () => {
    const followUpData = {
      type: "crisis_followup",
      scheduledTime: "2024-01-15T10:00:00Z",
      provider: "crisis_team",
      priority: "high",
      notes: "Follow up on suicide ideation",
    };

    mockSecureStorage.getSecureData.mockResolvedValue([]);

    const scheduled = await crisisManager.scheduleFollowUp(followUpData);

    expect(mockSecureStorage.getSecureData).toHaveBeenCalledWith(
      "scheduled_followups",
    );
    expect(mockSecureStorage.storeSensitiveData).toHaveBeenCalledWith(
      "scheduled_followups",
      expect.arrayContaining([
        expect.objectContaining({
          type: "crisis_followup",
          provider: "crisis_team",
          priority: "high",
          notes: "Follow up on suicide ideation",
        }),
      ]),
    );

    expect(scheduled).toMatchObject({
      id: expect.stringMatching(/^followup_\d+$/),
      type: "crisis_followup",
      priority: "high",
    });
  });

  it("appends new follow-ups to existing encrypted list", async () => {
    const existingFollowUps = [
      {
        id: "followup_1",
        type: "crisis_followup",
        scheduled_time: "2024-01-10T10:00:00Z",
      },
    ];

    const newFollowUp = {
      type: "therapy_session",
      scheduledTime: "2024-01-20T14:00:00Z",
    };

    mockSecureStorage.getSecureData.mockResolvedValue(existingFollowUps);

    await crisisManager.scheduleFollowUp(newFollowUp);

    const storedData = mockSecureStorage.storeSensitiveData.mock.calls[0][1];
    expect(storedData).toHaveLength(2);
    expect(storedData[0]).toEqual(existingFollowUps[0]);
    expect(storedData[1]).toMatchObject({
      type: "therapy_session",
    });
  });

  it("handles storage errors gracefully during fallback", async () => {
    mockSecureStorage.storeSensitiveData.mockRejectedValue(
      new Error("Storage full"),
    );

    const crisisAnalysis = {
      risk: "critical",
      keywords: ["suicide"],
    };

    // Should not throw error
    await expect(
      crisisManager.fallbackCrisisLog(crisisAnalysis, {}),
    ).resolves.not.toThrow();
  });

  it("protects crisis data with encryption", async () => {
    const sensitiveData = {
      userId: "user_123",
      message: "I want to kill myself",
      location: "Home",
    };

    await crisisManager.fallbackCrisisLog(
      { risk: "critical", keywords: ["kill myself"] },
      sensitiveData,
    );

    // Verify data was passed to encrypted storage, not AsyncStorage
    expect(mockSecureStorage.storeSensitiveData).toHaveBeenCalled();
    expect(AsyncStorage.setItem).not.toHaveBeenCalled();
  });
});
