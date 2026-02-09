/**
 * Metro Configuration for Expo SDK 54
 * Optimized for bundle size, tree shaking, and cross-platform development
 */

const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Enable inline requires for better tree shaking and faster startup
config.transformer.getTransformOptions = async () => ({
  transform: {
    experimentalImportSupport: false,
    inlineRequires: true,
  },
});

config.transformer.minifierConfig = {
  compress: {
    drop_console: true,      // Remove console.log in production
    dead_code: true,          // Remove dead code
    reduce_vars: true,        // Optimize variable references
  },
  mangle: {
    keep_fnames: true, // Important for React components
  },
};

// Web-specific optimizations
if (process.env.EXPO_PLATFORM === 'web') {
  config.resolver.alias = config.resolver.alias || {};
  config.resolver.alias['react-native$'] = 'react-native-web';
}

module.exports = config;