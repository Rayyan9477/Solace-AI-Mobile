/**
 * Main src index - Central exports for the entire application
 * Following feature-based architecture and Expo conventions
 */

// App-level exports
export * from './app';

// Feature exports
export * from './features/auth';
export * from './features/chat';
export * from './features/mood';
export * from './features/dashboard';

// Shared exports
export * from './shared/ui';
export * from './shared/theme';
export * from './shared/utils';
export * from './shared/expo';

// Navigation
export { default as AppNavigator } from './navigation/AppNavigator';

// Store
export { store, persistor } from './store/store';