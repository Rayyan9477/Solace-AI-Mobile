/**
 * Chat Feature Index
 * Centralized exports for AI chat functionality
 */

// Components
export * from './components';

// Screens
export * from './screens';

// Store
export { default as chatSlice } from './store/chatSlice';
export * from './store/chatSlice';

// Hooks (if any)
// export * from './hooks';

// Utils (if any)
// export * from './utils';

// Types (if any)
// export * from './types';

// Default export for the entire chat feature
export default {
  // Re-export key items for convenience
  chatSlice,
};
