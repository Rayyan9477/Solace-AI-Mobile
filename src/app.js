/**
 * App Module - Simplified version
 * Basic app exports without complex dependencies
 */

// Re-export App from the root
export { default as App } from '../App';

// Export app configuration
export * from './shared/constants';

// Export core providers
export { ThemeProvider } from './shared/theme/ThemeProvider';

// Export store
export { store, persistor } from './app/store/store';

// Export navigation
export { default as AppNavigator } from './app/navigation/AppNavigator';

// Default export (main App component)
export { default } from '../App';