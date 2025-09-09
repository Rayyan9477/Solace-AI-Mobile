/**
 * Expo Router Layout - Bridge to Traditional App.js
 * This file exists to satisfy Expo Router requirements while using our traditional App.js structure
 */

import App from "../App.js";

// Export our traditional App component as the root layout for Expo Router
export default function RootLayout() {
  return App();
}
