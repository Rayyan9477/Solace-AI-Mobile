module.exports = {
  preset: "jest-expo",
  setupFilesAfterEnv: ["@testing-library/jest-native/extend-expect"],
  transformIgnorePatterns: [
    "node_modules/(?!(jest-)?react-native|@react-native|react-redux|react-clone-referenced-element|@react-native-community|expo(nent)?|@expo(nent)?/.*|react-navigation|@react-navigation/.*|@unimodules/.*|native-base|@react-native-firebase/.*)",
  ],
  moduleNameMapper: {
    "\\.svg": "<rootDir>/__mocks__/svgMock.js",
  },
  setupFiles: ["./jest.setup.js"],
  collectCoverage: true,
  collectCoverageFrom: [
    "src/**/*.{js,jsx,ts,tsx}",
    "!src/**/*.d.ts",
    "!src/**/*.stories.{js,jsx,ts,tsx}",
    "!src/**/*.styles.{js,jsx,ts,tsx}",
    "!src/components/chat/MessageBubble.js",
    "!src/components/dashboard/WelcomeHeader.js",
    "!src/components/mood/ActivitySelector.js",
  ],
};
