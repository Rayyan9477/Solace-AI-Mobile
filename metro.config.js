const { getDefaultConfig } = require('expo/metro-config');

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname, {
  // Enable CSS support for React Native Web
  isCSSEnabled: true,
});

// Enhance resolver configuration for hot reload stability
config.resolver = {
  ...config.resolver,
  platforms: ['ios', 'android', 'native', 'web'],
  alias: {
    // Ensure consistent module resolution for hot reload
    'react-native$': 'react-native-web',
    // Add web-specific aliases for better compatibility
    'react-native-svg$': 'react-native-svg/lib/commonjs/ReactNativeSVG.web.js',
  },
  resolverMainFields: ['react-native', 'browser', 'main'],
  extensions: [
    '.web.tsx',
    '.web.ts',
    '.web.jsx',
    '.web.js',
    '.tsx',
    '.ts',
    '.jsx',
    '.js',
    '.json',
  ],
  // Prevent resolver issues that can break hot reload
  unstable_enableSymlinks: false,
  unstable_enablePackageExports: false,
};

// Configure transformer for better hot reload compatibility
config.transformer = {
  ...config.transformer,
  // Enable Fast Refresh for better development experience
  unstable_allowRequireContext: true,
  // Configure for React Fast Refresh
  getTransformOptions: async () => ({
    transform: {
      experimentalImportSupport: false,
      inlineRequires: false,
    },
  }),
};

// Optimize watchman configuration for hot reload
config.watchFolders = [
  // Watch these folders for changes to trigger hot reload
  __dirname,
];

// Configure server for development
config.server = {
  ...config.server,
  // Enhance hot reload speed
  enhanceMiddleware: (middleware) => {
    return (req, res, next) => {
      // Add CORS headers for web development
      if (req.url && req.url.includes('hot-update')) {
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
      }
      return middleware(req, res, next);
    };
  },
};

module.exports = config;