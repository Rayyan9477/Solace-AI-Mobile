// Add web-specific transformer config
const { getDefaultConfig } = require("@expo/metro-config");

const config = getDefaultConfig(__dirname);

// Configure resolver for better web support
config.resolver.sourceExts = ["js", "json", "ts", "tsx", "jsx", "cjs", "mjs"];
config.resolver.assetExts = ["glb", "gltf", "png", "jpg", "svg", "ttf", "otf"];

// Web-specific configuration
if (process.env.EXPO_PLATFORM === "web") {
  // Add extra node modules for web compatibility
  config.resolver.extraNodeModules = {
    ...config.resolver.extraNodeModules,
    // Ensure web-specific modules are available
    "react-native-web": require.resolve("react-native-web"),
  };

  // Configure transformer for web
  config.transformer = {
    ...config.transformer,
    babelTransformerPath: require.resolve(
      "metro-react-native-babel-transformer",
    ),
    getTransformOptions: async () => ({
      transform: {
        experimentalImportSupport: false,
        inlineRequires: false,
        unstable_transformProfile: "default",
      },
    }),
  };

  // Add web-specific resolver aliases
  config.resolver.alias = {
    ...config.resolver.alias,
    "react-native": "react-native-web",
  };
}

module.exports = config;
