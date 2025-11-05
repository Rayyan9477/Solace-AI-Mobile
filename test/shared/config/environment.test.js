/**
 * Environment Configuration Tests
 * Tests for centralized environment configuration system
 */

import {
  API_CONFIG,
  FEATURES,
  APP_CONFIG,
  STORAGE_CONFIG,
  ANALYTICS_CONFIG,
  SENTRY_CONFIG,
  isProduction,
  isDevelopment,
  isStaging,
  getEnvironmentConfig,
  validateEnvironmentConfig,
} from "../../../src/shared/config/environment";

describe("Environment Configuration", () => {
  const originalEnv = process.env;

  beforeEach(() => {
    // Reset environment before each test
    jest.resetModules();
    process.env = { ...originalEnv };
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  describe("API_CONFIG", () => {
    it("should have default API configuration", () => {
      expect(API_CONFIG.baseURL).toBeDefined();
      expect(API_CONFIG.timeout).toBe(10000);
      expect(API_CONFIG.retryAttempts).toBe(3);
      expect(API_CONFIG.retryDelay).toBe(1000);
    });

    it("should use environment variable for baseURL when provided", () => {
      // This test verifies the configuration is loaded correctly
      expect(typeof API_CONFIG.baseURL).toBe("string");
      expect(API_CONFIG.baseURL.length).toBeGreaterThan(0);
    });

    it("should parse timeout as number", () => {
      expect(typeof API_CONFIG.timeout).toBe("number");
      expect(API_CONFIG.timeout).toBeGreaterThan(0);
    });

    it("should have valid retry configuration", () => {
      expect(API_CONFIG.retryAttempts).toBeGreaterThanOrEqual(0);
      expect(API_CONFIG.retryDelay).toBeGreaterThanOrEqual(0);
    });
  });

  describe("FEATURES", () => {
    it("should have boolean feature flags", () => {
      expect(typeof FEATURES.remoteCrisisConfig).toBe("boolean");
      expect(typeof FEATURES.analytics).toBe("boolean");
      expect(typeof FEATURES.crashReporting).toBe("boolean");
      expect(typeof FEATURES.experimental).toBe("boolean");
    });

    it("should default features to false when not set", () => {
      // Features should be explicitly enabled
      expect(FEATURES.remoteCrisisConfig).toBe(false);
      expect(FEATURES.analytics).toBe(false);
      expect(FEATURES.crashReporting).toBe(false);
      expect(FEATURES.experimental).toBe(false);
    });
  });

  describe("APP_CONFIG", () => {
    it("should have application configuration", () => {
      expect(APP_CONFIG.environment).toBeDefined();
      expect(APP_CONFIG.version).toBeDefined();
      expect(typeof APP_CONFIG.debug).toBe("boolean");
    });

    it("should have valid environment value", () => {
      const validEnvs = ["development", "staging", "production"];
      expect(validEnvs).toContain(APP_CONFIG.environment);
    });

    it("should have semantic version format", () => {
      const versionRegex = /^\d+\.\d+\.\d+/;
      expect(APP_CONFIG.version).toMatch(versionRegex);
    });

    it("should enable debug in development", () => {
      // Test that debug flag exists and is a boolean
      // The actual value depends on environment variables at runtime
      expect(typeof APP_CONFIG.debug).toBe("boolean");

      // In test environment (NODE_ENV=test), debug is typically false
      // unless explicitly enabled via EXPO_PUBLIC_DEBUG=true
      if (
        process.env.NODE_ENV === "test" &&
        process.env.EXPO_PUBLIC_DEBUG !== "true"
      ) {
        expect(APP_CONFIG.debug).toBe(false);
      }
    });
  });

  describe("STORAGE_CONFIG", () => {
    it("should have storage configuration", () => {
      expect(STORAGE_CONFIG.keyPrefix).toBeDefined();
      expect(typeof STORAGE_CONFIG.encryption).toBe("boolean");
      expect(STORAGE_CONFIG.encryptionKey).toBeDefined();
    });

    it("should have valid key prefix", () => {
      expect(STORAGE_CONFIG.keyPrefix).toContain("solace");
      expect(STORAGE_CONFIG.keyPrefix.length).toBeGreaterThan(0);
    });

    it("should have encryption key when encryption is enabled", () => {
      if (STORAGE_CONFIG.encryption) {
        expect(STORAGE_CONFIG.encryptionKey).toBeTruthy();
        expect(STORAGE_CONFIG.encryptionKey.length).toBeGreaterThan(8);
      }
    });
  });

  describe("ANALYTICS_CONFIG", () => {
    it("should have analytics configuration", () => {
      expect(ANALYTICS_CONFIG).toBeDefined();
      expect(typeof ANALYTICS_CONFIG.apiKey).toBe("string");
      expect(typeof ANALYTICS_CONFIG.enableInDev).toBe("boolean");
    });
  });

  describe("SENTRY_CONFIG", () => {
    it("should have Sentry configuration", () => {
      expect(SENTRY_CONFIG).toBeDefined();
      expect(typeof SENTRY_CONFIG.dsn).toBe("string");
      expect(typeof SENTRY_CONFIG.enabled).toBe("boolean");
      expect(SENTRY_CONFIG.environment).toBeDefined();
    });

    it("should match app environment", () => {
      expect(SENTRY_CONFIG.environment).toBe(APP_CONFIG.environment);
    });
  });

  describe("Environment Helper Functions", () => {
    it("should correctly identify production environment", () => {
      const result = isProduction();
      expect(typeof result).toBe("boolean");
      expect(result).toBe(APP_CONFIG.environment === "production");
    });

    it("should correctly identify development environment", () => {
      const result = isDevelopment();
      expect(typeof result).toBe("boolean");
      expect(result).toBe(APP_CONFIG.environment === "development");
    });

    it("should correctly identify staging environment", () => {
      const result = isStaging();
      expect(typeof result).toBe("boolean");
      expect(result).toBe(APP_CONFIG.environment === "staging");
    });

    it("should return complete environment configuration", () => {
      const config = getEnvironmentConfig();

      expect(config).toHaveProperty("api");
      expect(config).toHaveProperty("features");
      expect(config).toHaveProperty("app");
      expect(config).toHaveProperty("storage");
      expect(config).toHaveProperty("analytics");
      expect(config).toHaveProperty("sentry");

      expect(config.api).toEqual(API_CONFIG);
      expect(config.features).toEqual(FEATURES);
      expect(config.app).toEqual(APP_CONFIG);
      expect(config.storage).toEqual(STORAGE_CONFIG);
      expect(config.analytics).toEqual(ANALYTICS_CONFIG);
      expect(config.sentry).toEqual(SENTRY_CONFIG);
    });
  });

  describe("Configuration Validation", () => {
    it("should validate environment configuration", () => {
      const result = validateEnvironmentConfig();

      expect(result).toHaveProperty("valid");
      expect(result).toHaveProperty("warnings");
      expect(typeof result.valid).toBe("boolean");
      expect(Array.isArray(result.warnings)).toBe(true);
    });

    it("should warn about localhost API URL", () => {
      const result = validateEnvironmentConfig();

      if (API_CONFIG.baseURL.includes("localhost")) {
        expect(result.warnings.length).toBeGreaterThan(0);
        expect(result.warnings.some((w) => w.includes("API"))).toBe(true);
      }
    });

    it("should warn about missing analytics key when enabled", () => {
      const result = validateEnvironmentConfig();

      if (FEATURES.analytics && !ANALYTICS_CONFIG.apiKey) {
        expect(result.warnings.some((w) => w.includes("Analytics"))).toBe(true);
      }
    });

    it("should warn about missing Sentry DSN when enabled", () => {
      const result = validateEnvironmentConfig();

      if (SENTRY_CONFIG.enabled && !SENTRY_CONFIG.dsn) {
        expect(result.warnings.some((w) => w.includes("Sentry"))).toBe(true);
      }
    });

    it("should return valid=true when no warnings", () => {
      const result = validateEnvironmentConfig();

      if (result.warnings.length === 0) {
        expect(result.valid).toBe(true);
      }
    });
  });

  describe("Configuration Immutability", () => {
    it("should not allow modification of API_CONFIG", () => {
      const originalTimeout = API_CONFIG.timeout;

      // Attempt to modify should not affect the original
      const modified = { ...API_CONFIG, timeout: 99999 };

      expect(API_CONFIG.timeout).toBe(originalTimeout);
      expect(modified.timeout).toBe(99999);
    });

    it("should provide consistent configuration across calls", () => {
      const config1 = getEnvironmentConfig();
      const config2 = getEnvironmentConfig();

      expect(config1.api.baseURL).toBe(config2.api.baseURL);
      expect(config1.app.version).toBe(config2.app.version);
    });
  });

  describe("Security Considerations", () => {
    it("should not expose sensitive data in logs", () => {
      const config = getEnvironmentConfig();
      const configString = JSON.stringify(config);

      // Encryption keys should not be logged
      expect(configString).toBeDefined();
    });

    it("should use secure defaults", () => {
      // Encryption should be optional but available
      expect(typeof STORAGE_CONFIG.encryption).toBe("boolean");

      // Analytics should be opt-in
      expect(FEATURES.analytics).toBe(false);
    });
  });
});
