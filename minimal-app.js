/**
 * Minimal test app to isolate the compact error
 */

import React from 'react';
import { View, Text } from 'react-native';

// Global polyfills
if (typeof global !== 'undefined' && typeof global.compact === 'undefined') {
  global.compact = function(arr) {
    return arr ? arr.filter(item => item != null) : [];
  };
}

if (typeof window !== 'undefined' && typeof window.compact === 'undefined') {
  window.compact = function(arr) {
    return arr ? arr.filter(item => item != null) : [];
  };
}

if (typeof Array !== 'undefined' && !Array.prototype.compact) {
  Array.prototype.compact = function() {
    return this.filter(item => item != null);
  };
}

const MinimalApp = () => {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Minimal App Loaded Successfully</Text>
      <Text>Compact polyfill: {typeof window.compact}</Text>
    </View>
  );
};

export default MinimalApp;
