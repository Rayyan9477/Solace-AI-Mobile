/**
 * App Validation Utilities
 * Validates app configuration and dependencies
 */

import { Platform } from "react-native";

import { APP_CONFIG } from "../constants";
export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

export interface AppValidationResult {
  overall: ValidationResult;
  dependencies: ValidationResult;
  configuration: ValidationResult;
  platform: ValidationResult;
}

/**
 * Validate app dependencies
 */
export const validateDependencies = (): ValidationResult => {
  const warnings: string[] = [];

  warnings.push(
    "Dependency validation skipped in runtime - checked at build time",
  );

  return {
    isValid: true,
    errors: [],
    warnings,
  };
};

/**
 * Validate app configuration
 */
export const validateConfiguration = (): ValidationResult => {
  const errors: string[] = [];
  const warnings: string[] = [];

  // Validate APP_CONFIG
  if (!APP_CONFIG.version) {
    errors.push("App version not configured");
  }

  // Note: API URL is now in API_CONFIG, not APP_CONFIG

  // Validate environment variables
  if (APP_CONFIG.features?.analytics && !process.env.ANALYTICS_KEY) {
    warnings.push("Analytics enabled but key not configured");
  }

  // Check environment
  if (typeof __DEV__ === "undefined") {
    warnings.push("Development mode not properly configured");
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
  };
};

/**
 * Validate platform support
 */
export const validatePlatform = (): ValidationResult => {
  const errors: string[] = [];
  const warnings: string[] = [];

  if (Platform.OS === "web") {
    if (typeof globalThis.window === "undefined") {
      errors.push("Window object not available in web environment");
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
  };
};

/**
 * Comprehensive app validation
 */
export const validateApp = (): AppValidationResult => {
  const platform = validatePlatform();
  const dependencies = validateDependencies();
  const configuration = validateConfiguration();

  const allErrors = [
    ...platform.errors,
    ...dependencies.errors,
    ...configuration.errors,
  ];

  const allWarnings = [
    ...platform.warnings,
    ...dependencies.warnings,
    ...configuration.warnings,
  ];

  const overall: ValidationResult = {
    isValid: allErrors.length === 0,
    errors: allErrors,
    warnings: allWarnings,
  };

  return {
    overall,
    platform,
    dependencies,
    configuration,
  };
};
