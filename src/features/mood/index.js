/**
 * Mood Feature Index
 * Centralized exports for mood tracking functionality
 */

// Components
export * from './components';

// Screens
export * from './screens';

// Store
export { default as moodSlice } from './store/moodSlice';
export * from './store/moodSlice';

// Hooks (if any)
// export * from './hooks';

// Utils (if any)
// export * from './utils';

// Types (if any)
// export * from './types';

// Default export for the entire mood feature
export default {
  // Re-export key items for convenience
  moodSlice,
};
