// Web polyfills for React Native Web compatibility
if (typeof window !== 'undefined') {
  // Polyfill for compact if it's missing
  if (typeof window.compact === 'undefined') {
    window.compact = function(arr) {
      return arr ? arr.filter(item => item != null) : [];
    };
  }

  // Polyfill for other potential missing globals
  if (typeof window.Array === 'function' && !Array.prototype.compact) {
    Array.prototype.compact = function() {
      return this.filter(item => item != null);
    };
  }

  // Ensure console methods exist
  if (!window.console) {
    window.console = {
      log: () => {},
      error: () => {},
      warn: () => {},
      info: () => {}
    };
  }
}
