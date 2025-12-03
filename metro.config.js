/**
 * Metro Configuration for Expo
 * Optimized for cross-platform development with proper module resolution
 */

const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

config.transformer.minifierConfig = {
  mangle: {
    keep_fnames: true, // Important for React components
  },
};

// Web-specific optimizations
if (process.env.EXPO_PLATFORM === 'web') {
  config.resolver.alias['react-native$'] = 'react-native-web';
}

module.exports = config;