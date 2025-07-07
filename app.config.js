export default {
  expo: {
    name: "Solace AI Mobile",
    slug: "solace-ai-mobile",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/icon.png",
    userInterfaceStyle: "automatic",
    splash: {
      image: "./assets/splash.png",
      resizeMode: "contain",
      backgroundColor: "#6366f1"
    },
    assetBundlePatterns: [
      "**/*"
    ],
    ios: {
      supportsTablet: true,
      bundleIdentifier: "com.solace.ai.mobile"
    },
    android: {
      adaptiveIcon: {
        foregroundImage: "./assets/adaptive-icon.png",
        backgroundColor: "#6366f1"
      },
      package: "com.solace.ai.mobile"
    },
    web: {
      favicon: "./assets/favicon.png"
    }
  }
};