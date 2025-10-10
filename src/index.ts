/**
 * Main src index - Simplified version
 * Basic exports without complex dependencies
 */

// App-level providers and configuration
export { default as AppProvider } from "./app/providers/AppProvider";
export { default as RefactoredAppProvider } from "./app/providers/RefactoredAppProvider";

// Navigation
export { default as AppNavigator } from "./app/navigation/AppNavigator";

// Store
export { store, persistor } from "./app/store/store";

// Core utilities
export { platform } from "./shared/utils/platform";