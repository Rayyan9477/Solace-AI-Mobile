module.exports = function (api) {
  api.cache(true);
  return {
    presets: ["babel-preset-expo", "@babel/preset-react"],
    plugins: [
      "react-native-reanimated/plugin",
      // Add transform runtime for better compatibility
      ["@babel/plugin-transform-runtime", {
        "helpers": true,
        "regenerator": true
      }],
      // Add web-specific transformations
      ...(process.env.EXPO_PLATFORM === "web"
        ? [
            ["@babel/plugin-proposal-class-properties", { loose: true }],
            ["@babel/plugin-transform-react-jsx", { runtime: "automatic" }],
            // Add additional web polyfills
            ["@babel/plugin-proposal-optional-chaining"],
            ["@babel/plugin-proposal-nullish-coalescing-operator"],
          ]
        : []),
    ],
  };
};
