/**
 * Web React Global Setup
 * 
 * This file ensures that React is globally available for web builds,
 * which is required by some third-party components that expect React
 * to be available in the global scope.
 */

if (typeof window !== 'undefined' && typeof global === 'undefined') {
  // Make global available for Node.js-style modules
  window.global = window;
}

if (typeof global !== 'undefined' && typeof global.React === 'undefined') {
  const React = require('react');
  global.React = React;
}

// Ensure React is available globally for web components that expect it
if (typeof window !== 'undefined' && typeof window.React === 'undefined') {
  const React = require('react');
  window.React = React;
}

// Export a confirmation function for debugging
export const verifyReactGlobal = () => {
  const hasGlobalReact = typeof global !== 'undefined' && typeof global.React !== 'undefined';
  const hasWindowReact = typeof window !== 'undefined' && typeof window.React !== 'undefined';
  
  return {
    hasGlobalReact,
    hasWindowReact,
    isSetupComplete: hasGlobalReact || hasWindowReact
  };
};