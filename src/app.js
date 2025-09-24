/**
 * App Module - Core app exports
 * This module provides the main app component exports
 */

// Re-export App from the root
export { default as App } from '../App';

// Export app configuration
export * from './shared/constants';
export * from './shared/utils/platform';

// Export core providers
export { ThemeProvider } from './design-system/theme/ThemeProvider';

// Export store
export { store, persistor } from './store/store';

// Export navigation
export { default as AppNavigator } from './navigation/AppNavigator';

// Default export (main App component)
export { default } from '../App';


