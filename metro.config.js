/**
 * Metro Configuration for Expo
 * Optimized for cross-platform development with proper module resolution
 */

const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Add support for TypeScript files
config.resolver.sourceExts.push('ts', 'tsx');

// Add support for platform-specific files
config.resolver.platforms = ['native', 'ios', 'android', 'web'];

// Ensure proper module resolution for shared components
// NOTE: @expo alias removed to avoid conflicts with @expo/* packages from node_modules
config.resolver.alias = {
  '@': './src',
  '@shared': './src/shared',
  '@features': './src/features',
  '@components': './src/shared/ui',
  '@utils': './src/shared/utils',
  '@theme': './src/shared/theme',
  '@app': './src/app',
  '@ui': './src/ui',
};

// Add transformer for framer-motion and other animations
config.transformer.babelTransformerPath = require.resolve(
  'metro-react-native-babel-transformer'
);

// Enable experimental features for better performance
config.transformer.experimentalImportSupport = false;
config.transformer.inlineRequires = true;

// Optimize bundle size
config.transformer.minifierConfig = {
  mangle: {
    keep_fnames: true, // Important for React components
  },
};

// Web-specific optimizations
if (process.env.EXPO_PLATFORM === 'web') {
  config.resolver.alias['react-native$'] = 'react-native-web';
  config.resolver.alias['react-native-svg'] = 'react-native-svg-web';
}

module.exports = config;