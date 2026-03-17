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

// Note: minifierConfig removed - it was Terser-specific but Metro SDK 54 uses
// esbuild by default. Console removal is handled by babel-plugin-transform-remove-console
// in the production env of babel.config.js.

// Web-specific optimizations
if (process.env.EXPO_PLATFORM === 'web') {
  config.resolver.alias = config.resolver.alias || {};
  config.resolver.alias['react-native$'] = 'react-native-web';
}

module.exports = config;