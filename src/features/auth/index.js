/**
 * Auth Feature Index
 * Centralized exports for authentication functionality
 */

// Components
export * from './components';

// Screens
export * from './screens';

// Store
export { default as authSlice } from './store/authSlice';
export * from './store/authSlice';

// Hooks (if any)
// export * from './hooks';

// Utils (if any)
// export * from './utils';

// Types (if any)
// export * from './types';

// Default export for the entire auth feature
export default {
  // Re-export key items for convenience
  authSlice,
};
