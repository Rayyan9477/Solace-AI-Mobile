module.exports = {
  extends: ["universe/native"],
  rules: {
    // Relax some rules for React Native development
    "no-unused-vars": "warn",
    "react/prop-types": "off",
    "react-hooks/exhaustive-deps": "warn",
  },
  settings: {
    react: {
      version: "detect",
    },
  },
  env: {
    es6: true,
    es2022: true,
    node: true,
    browser: true, // Enable browser globals for web platform code
    jest: true,
  },
  overrides: [
    // Web-specific files that need browser globals
    {
      files: ["src/utils/web*.js", "src/components/AppProvider.js"],
      env: {
        browser: true,
      },
    },
    // Test files that use DOM APIs (Playwright tests)
    {
      files: ["tests/**/*.spec.js", "**/*.test.js"],
      env: {
        browser: true,
        jest: true,
        node: true,
      },
    },
  ],
};
