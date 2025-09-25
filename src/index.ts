/**
 * Main src index - Central exports for the reorganized application
 * Following feature-based architecture and best practices
 */

// UI System - Main design system exports
export * from "./ui";

// App-level providers and configuration
export { default as AppProvider } from "./app/providers/AppProvider";
export { default as RefactoredAppProvider } from "./app/providers/RefactoredAppProvider";

// Navigation
export { default as AppNavigator } from "./app/navigation/AppNavigator";

// Store
export { store, persistor } from "./app/store/store";

// Core utilities
export { platform } from "./shared/utils/platform";
