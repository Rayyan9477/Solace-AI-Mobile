const { getDefaultConfig } = require('expo/metro-config');
const { withNativeWind } = require('nativewind/metro');

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname, {
  // Enable CSS support for web
  isCSSEnabled: true,
});

// Enterprise-specific Metro configuration
config.resolver.alias = {
  '@': './src',
  '@components': './src/design-system/components',
  '@screens': './src/screens',
  '@navigation': './src/navigation',
  '@providers': './src/providers',
  '@theme': './src/design-system/theme',
  '@animations': './src/design-system/animations',
  '@backgrounds': './src/design-system/backgrounds',
  '@utils': './src/utils',
  '@store': './src/store',
  '@services': './src/services',
  '@hooks': './src/hooks',
  '@assets': './assets'
};

// Enhanced resolver configuration for enterprise
config.resolver.platforms = ['native', 'ios', 'android', 'web'];
config.resolver.sourceExts = [...config.resolver.sourceExts, 'jsx', 'ts', 'tsx'];

// Asset extensions for enterprise media
config.resolver.assetExts = [
  ...config.resolver.assetExts,
  'glb',
  'gltf',
  'png',
  'jpg',
  'jpeg',
  'gif',
  'webp',
  'svg',
  'mp4',
  'webm',
  'mp3',
  'wav',
  'aac',
  'pdf',
  'zip',
  'otf',
  'ttf',
  'woff',
  'woff2'
];

// Transformer configuration for better performance
config.transformer = {
  ...config.transformer,
  minifierConfig: {
    keep_fnames: true,
    mangle: {
      keep_fnames: true,
    },
  },
  // Enable hermetic modules for better caching
  unstable_allowRequireContext: true,
};

// Enterprise optimization settings
config.serializer = {
  ...config.serializer,
  // Better bundle splitting for enterprise
  getModulesRunBeforeMainModule: () => [
    require.resolve('react-native/Libraries/Core/InitializeCore'),
  ],
  // Custom serializer for better tree shaking
  createModuleIdFactory: () => (path) => {
    // Use shorter module IDs in production
    if (process.env.NODE_ENV === 'production') {
      return path.replace(__dirname, '').replace(/[^a-zA-Z0-9]/g, '');
    }
    return path;
  },
};

// Performance and caching optimizations
config.cacheStores = [
  {
    type: 'FileStore',
    root: './node_modules/.cache/metro',
  },
];

// Enterprise-specific webpack-style optimizations
if (process.env.NODE_ENV === 'production') {
  config.transformer.minifierConfig = {
    ...config.transformer.minifierConfig,
    // Advanced minification for production
    passes: 3,
    pure_funcs: ['console.log', 'console.info', 'console.debug'],
    drop_console: true,
    drop_debugger: true,
  };

  // Bundle analysis for enterprise monitoring
  config.serializer.experimentalSerializerHook = (graph, delta) => {
    // Custom bundle analysis hook
    if (process.env.ANALYZE_BUNDLE === 'true') {
      const bundleSize = JSON.stringify(delta).length;
      console.log(`📊 Bundle size: ${(bundleSize / 1024).toFixed(2)}KB`);
    }
  };
}

// Development optimizations
if (process.env.NODE_ENV === 'development') {
  // Fast refresh optimizations
  config.transformer.unstable_collectDependenciesPath = require.resolve(
    'metro/src/DeltaBundler/Serializers/helpers/js',
  );

  // Enhanced development server
  config.server = {
    ...config.server,
    port: 8081,
    enhanceMiddleware: (middleware, server) => {
      // Custom middleware for enterprise development
      return (req, res, next) => {
        // Add security headers for development
        res.setHeader('X-Frame-Options', 'DENY');
        res.setHeader('X-Content-Type-Options', 'nosniff');
        res.setHeader('X-XSS-Protection', '1; mode=block');

        return middleware(req, res, next);
      };
    },
  };
}

// Platform-specific configurations
const platformConfig = {
  web: {
    // Web-specific optimizations
    resolver: {
      ...config.resolver,
      alias: {
        ...config.resolver.alias,
        'react-native$': 'react-native-web',
        'react-native-vector-icons': 'react-native-vector-icons/dist',
      },
    },
  },
  native: {
    // Native-specific optimizations
    transformer: {
      ...config.transformer,
      babelTransformerPath: require.resolve('metro-react-native-babel-transformer'),
    },
  },
};

// Apply platform-specific config based on target
const targetPlatform = process.env.EXPO_PLATFORM || 'native';
if (platformConfig[targetPlatform]) {
  Object.assign(config, platformConfig[targetPlatform]);
}

// Export with NativeWind support (optional)
module.exports = withNativeWind(config, {
  input: './src/design-system/theme/global.css', // If using global CSS
  configPath: './tailwind.config.js', // If using Tailwind
});