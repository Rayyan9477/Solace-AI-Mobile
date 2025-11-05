/**
 * Crisis Configuration Tests
 * Tests for centralized crisis detection configuration
 */

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
} from "../../../src/features/crisis/crisisConfig";

// Mock fetch at the module level
const mockFetch = jest.fn();
global.fetch = mockFetch;

// Mock process.env
const originalEnv = process.env;
beforeAll(() => {
  process.env = { ...originalEnv };
});

afterAll(() => {
  process.env = originalEnv;
});

describe("Crisis Configuration", () => {
  describe("CRISIS_KEYWORDS", () => {
    it("should have organized keyword categories", () => {
      expect(CRISIS_KEYWORDS).toHaveProperty("critical");
      expect(CRISIS_KEYWORDS).toHaveProperty("high");
      expect(CRISIS_KEYWORDS).toHaveProperty("moderate");
      expect(CRISIS_KEYWORDS).toHaveProperty("urgency");
    });

    it("should have critical severity keywords", () => {
      expect(Array.isArray(CRISIS_KEYWORDS.critical)).toBe(true);
      expect(CRISIS_KEYWORDS.critical.length).toBeGreaterThan(0);

      // Should include suicide-related terms
      const hasSupport = CRISIS_KEYWORDS.critical.some(
        (k) => k.includes("suicide") || k.includes("kill myself"),
      );
      expect(hasSupport).toBe(true);
    });

    it("should have high severity keywords", () => {
      expect(Array.isArray(CRISIS_KEYWORDS.high)).toBe(true);
      expect(CRISIS_KEYWORDS.high.length).toBeGreaterThan(0);

      // Should include self-harm terms
      const hasSelfHarm = CRISIS_KEYWORDS.high.some(
        (k) => k.includes("harm") || k.includes("hurt"),
      );
      expect(hasSelfHarm).toBe(true);
    });

    it("should have moderate severity keywords", () => {
      expect(Array.isArray(CRISIS_KEYWORDS.moderate)).toBe(true);
      expect(CRISIS_KEYWORDS.moderate.length).toBeGreaterThan(0);
    });

    it("should have urgency indicators", () => {
      expect(Array.isArray(CRISIS_KEYWORDS.urgency)).toBe(true);
      expect(CRISIS_KEYWORDS.urgency.length).toBeGreaterThan(0);

      // Should include time-based indicators
      const hasTimeIndicators = CRISIS_KEYWORDS.urgency.some((k) =>
        ["tonight", "today", "right now"].includes(k),
      );
      expect(hasTimeIndicators).toBe(true);
    });

    it("should not have duplicate keywords across categories", () => {
      const allKeywords = [
        ...CRISIS_KEYWORDS.critical,
        ...CRISIS_KEYWORDS.high,
        ...CRISIS_KEYWORDS.moderate,
        ...CRISIS_KEYWORDS.urgency,
      ];

      const uniqueKeywords = new Set(allKeywords);
      expect(uniqueKeywords.size).toBe(allKeywords.length);
    });

    it("should have lowercase keywords for consistent matching", () => {
      Object.values(CRISIS_KEYWORDS).forEach((keywords) => {
        keywords.forEach((keyword) => {
          expect(keyword).toBe(keyword.toLowerCase());
        });
      });
    });
  });

  describe("KEYWORD_WEIGHTS", () => {
    it("should have weights for all keyword categories", () => {
      expect(KEYWORD_WEIGHTS).toHaveProperty("critical");
      expect(KEYWORD_WEIGHTS).toHaveProperty("high");
      expect(KEYWORD_WEIGHTS).toHaveProperty("urgency");
      expect(KEYWORD_WEIGHTS).toHaveProperty("moderate");
    });

    it("should have descending weight values", () => {
      expect(KEYWORD_WEIGHTS.critical).toBeGreaterThan(KEYWORD_WEIGHTS.high);
      expect(KEYWORD_WEIGHTS.high).toBeGreaterThan(KEYWORD_WEIGHTS.urgency);
      expect(KEYWORD_WEIGHTS.urgency).toBeGreaterThan(KEYWORD_WEIGHTS.moderate);
    });

    it("should have positive numeric weights", () => {
      Object.values(KEYWORD_WEIGHTS).forEach((weight) => {
        expect(typeof weight).toBe("number");
        expect(weight).toBeGreaterThan(0);
      });
    });
  });

  describe("DANGEROUS_COMBINATIONS", () => {
    it("should be an array of combinations", () => {
      expect(Array.isArray(DANGEROUS_COMBINATIONS)).toBe(true);
      expect(DANGEROUS_COMBINATIONS.length).toBeGreaterThan(0);
    });

    it("should have valid combination format", () => {
      DANGEROUS_COMBINATIONS.forEach((combo) => {
        expect(Array.isArray(combo)).toBe(true);
        expect(combo.length).toBe(2);
        expect(typeof combo[0]).toBe("string");
        expect(typeof combo[1]).toBe("string");
      });
    });

    it("should include concerning combinations", () => {
      const combinations = DANGEROUS_COMBINATIONS.map((c) => c.join(" "));
      const hasPlanSuicide = combinations.some(
        (c) => c.includes("plan") && c.includes("suicide"),
      );
      expect(hasPlanSuicide).toBe(true);
    });
  });

  describe("COMBINATION_SCORE", () => {
    it("should be a positive number", () => {
      expect(typeof COMBINATION_SCORE).toBe("number");
      expect(COMBINATION_SCORE).toBeGreaterThan(0);
    });

    it("should be significant enough to indicate high risk", () => {
      expect(COMBINATION_SCORE).toBeGreaterThanOrEqual(KEYWORD_WEIGHTS.high);
    });
  });

  describe("RISK_THRESHOLDS", () => {
    it("should have all risk levels defined", () => {
      expect(RISK_THRESHOLDS).toHaveProperty("critical");
      expect(RISK_THRESHOLDS).toHaveProperty("high");
      expect(RISK_THRESHOLDS).toHaveProperty("moderate");
      expect(RISK_THRESHOLDS).toHaveProperty("low");
    });

    it("should have descending threshold values", () => {
      expect(RISK_THRESHOLDS.critical).toBeGreaterThan(RISK_THRESHOLDS.high);
      expect(RISK_THRESHOLDS.high).toBeGreaterThan(RISK_THRESHOLDS.moderate);
      expect(RISK_THRESHOLDS.moderate).toBeGreaterThan(RISK_THRESHOLDS.low);
    });

    it("should have positive numeric thresholds", () => {
      Object.values(RISK_THRESHOLDS).forEach((threshold) => {
        expect(typeof threshold).toBe("number");
        expect(threshold).toBeGreaterThan(0);
      });
    });
  });

  describe("EMERGENCY_RESOURCES", () => {
    it("should have resources by country", () => {
      expect(EMERGENCY_RESOURCES).toHaveProperty("US");
      expect(Array.isArray(EMERGENCY_RESOURCES.US)).toBe(true);
    });

    it("should include 988 Crisis Lifeline", () => {
      const has988 = EMERGENCY_RESOURCES.US.some((r) => r.number === "988");
      expect(has988).toBe(true);
    });

    it("should include Crisis Text Line", () => {
      const hasTextLine = EMERGENCY_RESOURCES.US.some(
        (r) => r.number === "741741",
      );
      expect(hasTextLine).toBe(true);
    });

    it("should have properly formatted resources", () => {
      EMERGENCY_RESOURCES.US.forEach((resource) => {
        expect(resource).toHaveProperty("id");
        expect(resource).toHaveProperty("name");
        expect(resource).toHaveProperty("number");
        expect(resource).toHaveProperty("description");
        expect(resource).toHaveProperty("type");
        expect(resource).toHaveProperty("priority");
        expect(resource).toHaveProperty("country");

        expect(resource.country).toBe("US");
        expect(["voice", "text", "emergency"]).toContain(resource.type);
      });
    });

    it("should have priority ordering", () => {
      const priorities = EMERGENCY_RESOURCES.US.map((r) => r.priority);
      const sorted = [...priorities].sort((a, b) => a - b);
      expect(priorities).toEqual(sorted);
    });
  });

  describe("SUPPORT_RESOURCES", () => {
    it("should be an array of resources", () => {
      expect(Array.isArray(SUPPORT_RESOURCES)).toBe(true);
      expect(SUPPORT_RESOURCES.length).toBeGreaterThan(0);
    });

    it("should have properly formatted resources", () => {
      SUPPORT_RESOURCES.forEach((resource) => {
        expect(resource).toHaveProperty("id");
        expect(resource).toHaveProperty("name");
        expect(resource).toHaveProperty("description");
        expect(resource).toHaveProperty("type");
      });
    });
  });

  describe("SAFETY_PLAN_TEMPLATE", () => {
    it("should have all required sections", () => {
      expect(SAFETY_PLAN_TEMPLATE).toHaveProperty("warningSignsPersonal");
      expect(SAFETY_PLAN_TEMPLATE).toHaveProperty("warningSignsEnvironmental");
      expect(SAFETY_PLAN_TEMPLATE).toHaveProperty("copingStrategies");
      expect(SAFETY_PLAN_TEMPLATE).toHaveProperty("socialSupports");
      expect(SAFETY_PLAN_TEMPLATE).toHaveProperty("professionalContacts");
      expect(SAFETY_PLAN_TEMPLATE).toHaveProperty("safeEnvironment");
      expect(SAFETY_PLAN_TEMPLATE).toHaveProperty("emergencyContacts");
    });

    it("should initialize sections as empty arrays", () => {
      Object.values(SAFETY_PLAN_TEMPLATE).forEach((section) => {
        expect(Array.isArray(section)).toBe(true);
        expect(section.length).toBe(0);
      });
    });
  });

  describe("loadRemoteCrisisConfig", () => {
    let originalEnv;
    let originalFetch;

    beforeEach(() => {
      // Store original env and fetch
      originalEnv = process.env.EXPO_PUBLIC_API_URL;
      originalFetch = global.fetch;
      // Set up fresh fetch mock for this test suite
      global.fetch = jest.fn();
    });

    afterEach(() => {
      // Restore original env and fetch
      process.env.EXPO_PUBLIC_API_URL = originalEnv;
      global.fetch = originalFetch;
    });

    it("should return null when no API URL is configured", async () => {
      delete process.env.EXPO_PUBLIC_API_URL;

      const result = await loadRemoteCrisisConfig();

      expect(result).toBeNull();
    });

    it("should fetch from correct endpoint", async () => {
      const testApiUrl = "https://api.example.com";
      global.fetch.mockResolvedValue({
        ok: true,
        json: async () => ({ keywords: { critical: ["test"] } }),
      });

      await loadRemoteCrisisConfig(testApiUrl);

      expect(global.fetch).toHaveBeenCalledWith(
        "https://api.example.com/config/crisis-keywords",
        expect.objectContaining({
          method: "GET",
          headers: { "Content-Type": "application/json" },
        }),
      );
    });

    it("should return parsed config on success", async () => {
      const testApiUrl = "https://api.example.com";
      const mockConfig = { keywords: { critical: ["test"] } };
      global.fetch.mockResolvedValue({
        ok: true,
        json: async () => mockConfig,
      });

      const result = await loadRemoteCrisisConfig(testApiUrl);

      expect(result).toEqual(mockConfig);
    });

    it("should return null on fetch failure", async () => {
      process.env.EXPO_PUBLIC_API_URL = "https://api.example.com";
      global.fetch.mockRejectedValue(new Error("Network error"));

      const result = await loadRemoteCrisisConfig();

      expect(result).toBeNull();
    });

    it("should return null on non-OK response", async () => {
      process.env.EXPO_PUBLIC_API_URL = "https://api.example.com";
      global.fetch.mockResolvedValue({
        ok: false,
        status: 404,
      });

      const result = await loadRemoteCrisisConfig();

      expect(result).toBeNull();
    });
  });

  describe("mergeCrisisConfig", () => {
    it("should return defaults when no remote config", () => {
      const result = mergeCrisisConfig(null);

      expect(result.keywords).toEqual(CRISIS_KEYWORDS);
      expect(result.weights).toEqual(KEYWORD_WEIGHTS);
      expect(result.combinations).toEqual(DANGEROUS_COMBINATIONS);
      expect(result.thresholds).toEqual(RISK_THRESHOLDS);
      expect(result.resources).toEqual(EMERGENCY_RESOURCES);
    });

    it("should merge remote keywords with local defaults", () => {
      const remoteConfig = {
        keywords: {
          critical: ["new crisis term"],
        },
      };

      const result = mergeCrisisConfig(remoteConfig);

      expect(result.keywords.critical).toEqual(["new crisis term"]);
      expect(result.keywords.high).toEqual(CRISIS_KEYWORDS.high);
    });

    it("should merge remote weights with local defaults", () => {
      const remoteConfig = {
        weights: {
          critical: 20,
        },
      };

      const result = mergeCrisisConfig(remoteConfig);

      expect(result.weights.critical).toBe(20);
      expect(result.weights.high).toBe(KEYWORD_WEIGHTS.high);
    });

    it("should use remote combinations if provided", () => {
      const remoteCombinations = [["new", "combination"]];
      const remoteConfig = {
        combinations: remoteCombinations,
      };

      const result = mergeCrisisConfig(remoteConfig);

      expect(result.combinations).toEqual(remoteCombinations);
    });

    it("should merge remote thresholds", () => {
      const remoteConfig = {
        thresholds: {
          critical: 20,
        },
      };

      const result = mergeCrisisConfig(remoteConfig);

      expect(result.thresholds.critical).toBe(20);
      expect(result.thresholds.high).toBe(RISK_THRESHOLDS.high);
    });

    it("should merge remote resources", () => {
      const remoteConfig = {
        resources: {
          UK: [{ id: "uk-crisis", name: "UK Crisis Line" }],
        },
      };

      const result = mergeCrisisConfig(remoteConfig);

      expect(result.resources.UK).toBeDefined();
      expect(result.resources.US).toEqual(EMERGENCY_RESOURCES.US);
    });

    it("should preserve all config sections", () => {
      const result = mergeCrisisConfig({});

      expect(result).toHaveProperty("keywords");
      expect(result).toHaveProperty("weights");
      expect(result).toHaveProperty("combinations");
      expect(result).toHaveProperty("thresholds");
      expect(result).toHaveProperty("resources");
    });
  });

  describe("Configuration Consistency", () => {
    it("should have consistent keyword categories and weights", () => {
      const keywordCategories = Object.keys(CRISIS_KEYWORDS);
      const weightCategories = Object.keys(KEYWORD_WEIGHTS);

      keywordCategories.forEach((category) => {
        expect(weightCategories).toContain(category);
      });
    });

    it("should have appropriate weights for risk assessment", () => {
      // Critical keywords should trigger high scores
      const maxKeywordScore = KEYWORD_WEIGHTS.critical * 3; // 3 critical keywords
      expect(maxKeywordScore).toBeGreaterThanOrEqual(RISK_THRESHOLDS.critical);
    });

    it("should have meaningful resource priorities", () => {
      const prioritySet = new Set(
        EMERGENCY_RESOURCES.US.map((r) => r.priority),
      );
      expect(prioritySet.size).toBe(EMERGENCY_RESOURCES.US.length);
    });
  });
});
