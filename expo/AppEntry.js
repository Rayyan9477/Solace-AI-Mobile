// Global polyfills - must be defined before ANY other code
console.log('🔧 AppEntry: Installing global polyfills...');

try {
  // Define compact function with a different name to avoid conflicts with local variables
  var compactPolyfill = function(arr) {
    return arr ? arr.filter(function(item) { return item != null; }) : [];
  };

  // Only define globally if not already defined (to avoid conflicts)
  if (typeof global !== 'undefined' && typeof global.__compactPolyfill === 'undefined') {
    global.__compactPolyfill = compactPolyfill;
    // Don't override global.compact to avoid conflicts with local variables
    console.log('✅ AppEntry: global.__compactPolyfill polyfill installed');
  }

  if (typeof window !== 'undefined' && typeof window.__compactPolyfill === 'undefined') {
    window.__compactPolyfill = compactPolyfill;
    // Don't override window.compact to avoid conflicts with local variables
    console.log('✅ AppEntry: window.__compactPolyfill polyfill installed');
  }

  // For the specific use case, also define it as a module export
  if (typeof module !== 'undefined' && module.exports) {
    module.exports.compact = compactPolyfill;
  }

  // Additional safety polyfills
  if (typeof window !== 'undefined') {
    window.global = window.global || window;
    window.process = window.process || { env: {} };
    console.log('✅ AppEntry: Additional safety polyfills installed');
  }
} catch (error) {
  console.error('❌ AppEntry: Error installing polyfills:', error);
}

import { registerRootComponent } from "expo";

import App from "../App";

// Register the main component
registerRootComponent(App);
