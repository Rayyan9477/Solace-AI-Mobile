/**
 * App Validation Utilities
 * Validates app configuration and dependencies
 */

import { Platform } from 'react-native';
import { APP_CONFIG } from '../constants';
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

  // Check critical dependencies
  const criticalDeps = [
    '@react-navigation/native',
    'react-redux',
    'expo-linear-gradient',
  ];

  // Note: Dynamic require() calls are not supported in Metro bundler
  // These dependencies should be checked at build time instead
  warnings.push('Dependency validation skipped in runtime');

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

  // Validate APP_CONFIG
  if (!APP_CONFIG.version) {
    errors.push('App version not configured');
  }

  // Note: API URL is now in API_CONFIG, not APP_CONFIG

  // Validate environment variables
  if (APP_CONFIG.features?.analytics && !process.env.ANALYTICS_KEY) {
    warnings.push('Analytics enabled but key not configured');
  }

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

  // Check React Native version compatibility
  if (Platform.OS === 'web') {
    // Web-specific validations
    if (globalThis.window === undefined) {
      errors.push('Window object not available in web environment');
    }
  } else {
    // Native-specific validations - no specific check needed
  }

  // Check React Native - simplified check
  try {
    require('react-native');
  } catch {
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
