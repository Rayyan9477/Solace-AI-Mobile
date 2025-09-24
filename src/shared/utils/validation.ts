/**
 * App Validation Utilities
 */

import { Platform } from 'react-native';
import { APP_CONFIG } from '../constants';

interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

interface AppValidationResult {
  overall: ValidationResult;
  platform: ValidationResult;
  dependencies: ValidationResult;
  configuration: ValidationResult;
}

/**
 * Validate platform compatibility
 */
function validatePlatform(): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  // Check React Native version compatibility
  if (Platform.OS === 'web') {
    // Web-specific validations
    if (typeof window === 'undefined') {
      errors.push('Window object not available in web environment');
    }
  } else {
    // Native-specific validations
    if (!Platform.Version) {
      warnings.push('Platform version not detected');
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
  };
}

/**
 * Validate app dependencies
 */
function validateDependencies(): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  // Check critical dependencies
  const criticalDeps = [
    '@react-navigation/native',
    'react-redux',
    'expo-linear-gradient',
  ];

  criticalDeps.forEach(dep => {
    try {
      require(dep);
    } catch (e) {
      warnings.push(`Optional dependency missing: ${dep}`);
    }
  });

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
  };
}

/**
 * Validate app configuration
 */
function validateConfiguration(): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  // Validate APP_CONFIG
  if (!APP_CONFIG.version) {
    errors.push('App version not configured');
  }

  if (!APP_CONFIG.apiUrl) {
    warnings.push('API URL not configured');
  }

  // Validate environment variables
  if (APP_CONFIG.features.analytics && !process.env.ANALYTICS_KEY) {
    warnings.push('Analytics enabled but key not configured');
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
  };
}

/**
 * Comprehensive app validation
 */
export function validateApp(): AppValidationResult {
  const platform = validatePlatform();
  const dependencies = validateDependencies();
  const configuration = validateConfiguration();

  const overall: ValidationResult = {
    isValid: platform.isValid && dependencies.isValid && configuration.isValid,
    errors: [
      ...platform.errors,
      ...dependencies.errors,
      ...configuration.errors,
    ],
    warnings: [
      ...platform.warnings,
      ...dependencies.warnings,
      ...configuration.warnings,
    ],
  };

  return {
    overall,
    platform,
    dependencies,
    configuration,
  };
}