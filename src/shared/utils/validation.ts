/**
 * App Validation Utilities
 * Validates app configuration and dependencies
 */

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
  const errors: string[] = [];
  const warnings: string[] = [];

  // Check for React Navigation
  try {
    require('@react-navigation/native');
    require('@react-navigation/stack');
    require('@react-navigation/bottom-tabs');
  } catch (error) {
    errors.push('React Navigation dependencies missing');
  }

  // Check for Redux
  try {
    require('react-redux');
    require('@reduxjs/toolkit');
  } catch (error) {
    errors.push('Redux dependencies missing');
  }

  // Check for Expo
  try {
    require('expo-status-bar');
  } catch (error) {
    warnings.push('Some Expo modules may not be available');
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
  };
};

/**
 * Validate app configuration
 */
export const validateConfiguration = (): ValidationResult => {
  const errors: string[] = [];
  const warnings: string[] = [];

  // Check environment
  if (typeof __DEV__ === 'undefined') {
    warnings.push('Development mode not properly configured');
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

  // Check React Native
  try {
    require('react-native');
  } catch (error) {
    errors.push('React Native not available');
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
  const dependencies = validateDependencies();
  const configuration = validateConfiguration();
  const platform = validatePlatform();

  const allErrors = [
    ...dependencies.errors,
    ...configuration.errors,
    ...platform.errors,
  ];

  const allWarnings = [
    ...dependencies.warnings,
    ...configuration.warnings,
    ...platform.warnings,
  ];

  const overall: ValidationResult = {
    isValid: allErrors.length === 0,
    errors: allErrors,
    warnings: allWarnings,
  };

  return {
    overall,
    dependencies,
    configuration,
    platform,
  };
};