// src/setupWebReactGlobal.js
// Ensure React is available on the global object for libraries/components
// that assume a global React in web runtime.
/* eslint-disable global-require */
(function ensureGlobalReact() {
  try {
    if (typeof globalThis !== 'undefined' && typeof globalThis.React === 'undefined') {
      // Dynamically require to avoid bundlers complaining in native
      // This file is only imported on web via App.js
      // eslint-disable-next-line import/no-extraneous-dependencies
      const React = require('react');
      if (React) {
        globalThis.React = React;
      }
    }
  } catch (e) {
    // no-op
  }
})();


