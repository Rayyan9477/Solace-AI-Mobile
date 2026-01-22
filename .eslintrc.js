module.exports = {
  extends: [
    "universe/native",
    "universe/web",
    "plugin:prettier/recommended",
    "plugin:react-native/all",
    "plugin:react-native-a11y/all",
  ],
  plugins: ["prettier", "react-native", "react-native-a11y"],
  rules: {
    "prettier/prettier": "warn",
    // React Native specific
    "react-hooks/rules-of-hooks": "error",
    "react-hooks/exhaustive-deps": "warn",
    // React Native plugin rules
    "react-native/no-unused-styles": "warn",
    "react-native/split-platform-components": "warn",
    "react-native/no-inline-styles": "warn",
    "react-native/no-color-literals": "warn",
    "react-native/no-raw-text": "off", // Can be strict, enable later
    // Accessibility rules (WCAG 2.1 AA compliance)
    "react-native-a11y/has-accessibility-hint": "warn",
    "react-native-a11y/has-accessibility-props": "warn",
    "react-native-a11y/has-valid-accessibility-actions": "error",
    "react-native-a11y/has-valid-accessibility-role": "error",
    "react-native-a11y/has-valid-accessibility-state": "error",
    "react-native-a11y/has-valid-accessibility-states": "error",
    "react-native-a11y/has-valid-accessibility-component-type": "error",
    "react-native-a11y/has-valid-accessibility-traits": "error",
    "react-native-a11y/has-valid-accessibility-value": "error",
    "react-native-a11y/no-nested-touchables": "error",
    // Code quality
    "no-console": ["warn", { allow: ["warn", "error"] }],
    "no-unused-vars": ["warn", { argsIgnorePattern: "^_" }],
    "no-debugger": "warn",
    // TypeScript support
    "@typescript-eslint/no-unused-vars": ["warn", { argsIgnorePattern: "^_" }],
    "@typescript-eslint/explicit-module-boundary-types": "off",
  },
  env: {
    es6: true,
    node: true,
    jest: true,
  },
  parserOptions: {
    ecmaVersion: 2021,
    sourceType: "module",
    ecmaFeatures: {
      jsx: true,
    },
  },
  settings: {
    react: {
      version: "detect",
    },
  },
  overrides: [
    {
      files: ["**/*.ts", "**/*.tsx"],
      parser: "@typescript-eslint/parser",
      parserOptions: {
        project: "./tsconfig.json",
      },
    },
    {
      files: [
        "**/__tests__/**",
        "**/*.test.js",
        "**/*.test.jsx",
        "**/*.test.ts",
        "**/*.test.tsx",
      ],
      env: {
        jest: true,
      },
    },
  ],
  ignorePatterns: [
    "node_modules/",
    "dist/",
    "build/",
    "coverage/",
    ".expo/",
    ".expo-shared/",
    "android/",
    "ios/",
    "web-build/",
    "*.config.js",
    "babel.config.js",
    "metro.config.js",
  ],
};
