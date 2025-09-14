module.exports = function (api) {
  api.cache(true);

  return {
    presets: [
      'babel-preset-expo',
      ['@babel/preset-react', { runtime: 'automatic' }],
      ['@babel/preset-typescript', { allowNamespaces: true }]
    ],
    plugins: [
      // React Native Reanimated plugin (must be last)
      'react-native-reanimated/plugin',

      // Path mapping for enterprise structure
      [
        'module-resolver',
        {
          root: ['./src'],
          alias: {
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
          },
          extensions: ['.js', '.jsx', '.ts', '.tsx', '.json']
        }
      ],

      // Performance optimizations
      ['@babel/plugin-proposal-class-properties', { loose: true }],
      ['@babel/plugin-proposal-private-methods', { loose: true }],
      ['@babel/plugin-proposal-private-property-in-object', { loose: true }],

      // React optimization plugins
      ['@babel/plugin-transform-react-jsx', { runtime: 'automatic' }],

      // Enterprise-specific optimizations
      process.env.NODE_ENV === 'production' && [
        'transform-remove-console',
        {
          exclude: ['error', 'warn', 'info']
        }
      ],

      // Framer Motion optimization for React Native
      [
        'module:react-native-dotenv',
        {
          moduleName: '@env',
          path: '.env',
          blacklist: null,
          whitelist: null,
          safe: false,
          allowUndefined: true
        }
      ],

      // Import/export optimizations
      ['@babel/plugin-proposal-export-default-from'],
      ['@babel/plugin-proposal-export-namespace-from'],

      // Async/await optimizations
      ['@babel/plugin-transform-async-to-generator'],

      // Object spread optimizations
      ['@babel/plugin-proposal-object-rest-spread', { useBuiltIns: true }],

      // Optional chaining and nullish coalescing
      ['@babel/plugin-proposal-optional-chaining'],
      ['@babel/plugin-proposal-nullish-coalescing-operator'],

      // React Native Paper optimization
      [
        'react-native-paper/babel',
        {
          env: process.env.NODE_ENV || 'development'
        }
      ],

      // Styled components optimization (if used)
      [
        'babel-plugin-styled-components',
        {
          ssr: false,
          displayName: process.env.NODE_ENV === 'development',
          minify: process.env.NODE_ENV === 'production'
        }
      ]
    ].filter(Boolean),

    env: {
      production: {
        plugins: [
          // Production-only optimizations
          ['transform-remove-console', { exclude: ['error', 'warn'] }],
          ['@babel/plugin-transform-react-inline-elements'],
          ['@babel/plugin-transform-react-constant-elements'],

          // Dead code elimination
          ['babel-plugin-transform-react-remove-prop-types', { removeImport: true }],

          // Bundle size optimizations
          ['babel-plugin-dev-expression']
        ]
      },
      development: {
        plugins: [
          // Development-only plugins
          ['@babel/plugin-transform-react-jsx-source'],
          ['@babel/plugin-transform-react-jsx-self']
        ]
      },
      test: {
        plugins: [
          // Test environment plugins
          ['@babel/plugin-transform-react-jsx', { runtime: 'automatic' }]
        ]
      }
    },

    // Optimization settings
    compact: process.env.NODE_ENV === 'production',
    minified: process.env.NODE_ENV === 'production',
    comments: process.env.NODE_ENV !== 'production',

    // Source map settings for better debugging
    sourceMaps: true,
    retainLines: process.env.NODE_ENV !== 'production'
  };
};