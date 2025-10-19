/**
 * Babel Configuration for Expo
 * Configures module resolution, path aliases, and transforms
 */

module.exports = function (api) {
  api.cache(true);

  return {
    presets: ['babel-preset-expo'],
    plugins: [
      // Enable optional chaining and nullish coalescing
      '@babel/plugin-proposal-optional-chaining',
      '@babel/plugin-proposal-nullish-coalescing-operator',

      // React Native Reanimated plugin (must be last)
      'react-native-reanimated/plugin',

      // Module resolver for path aliases
      [
        'module-resolver',
        {
          root: ['./src'],
          alias: {
            '@': './src',
            '@shared': './src/shared',
            '@features': './src/features',
            '@components': './src/shared/components',
            '@utils': './src/shared/utils',
            '@theme': './src/shared/theme',
            '@expo': './src/shared/expo',
            '@app': './src/app',
            '@ui': './src/ui',
          },
          extensions: [
            '.ios.ts',
            '.android.ts',
            '.ts',
            '.ios.tsx',
            '.android.tsx',
            '.tsx',
            '.jsx',
            '.js',
            '.json',
          ],
        },
      ],
    ],
    env: {
      production: {
        plugins: [
          'transform-remove-console', // Remove console.log in production
        ],
      },
    },
  };
};
