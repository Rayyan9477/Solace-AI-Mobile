
// Add web-specific transformer config
const { getDefaultConfig } = require('@expo/metro-config');

const config = getDefaultConfig(__dirname);

config.transformer.getTransformOptions = async () => ({
  transform: {
    experimentalImportSupport: false,
    inlineRequires: true,
    unstable_transformProfile: 'default',
  },
});

// Use standard transformer - but since the module is missing, we omit this and use Expo default
// babelTransformerPath: require.resolve('metro-react-native-babel-transformer'),

config.resolver.sourceExts = ['js', 'json', 'ts', 'tsx', 'jsx', 'cjs'];
config.resolver.assetExts = ['glb', 'gltf', 'png', 'jpg', 'svg', 'ttf', 'otf'];

module.exports = config;