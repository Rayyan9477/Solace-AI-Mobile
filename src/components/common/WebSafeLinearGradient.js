/**
 * Web-Safe Linear Gradient Component
 * 
 * Provides cross-platform linear gradient support with web fallbacks
 */

import React from 'react';
import { Platform, View } from 'react-native';
import { createWebGradientFallback } from '../../utils/webPolyfills';

// Web-safe LinearGradient import
let LinearGradient;

if (Platform.OS === 'web') {
  try {
    // Try to import expo-linear-gradient
    const gradientModule = require('expo-linear-gradient');
    LinearGradient = gradientModule.LinearGradient;
  } catch (error) {
    console.warn('expo-linear-gradient not available on web, using CSS fallback:', error);
    
    // CSS-based gradient fallback for web
    LinearGradient = ({ colors, start, end, style, children, ...props }) => {
      const webGradientStyle = createWebGradientFallback(colors, start, end);
      
      return (
        <View
          style={[
            style,
            webGradientStyle,
          ]}
          {...props}
        >
          {children}
        </View>
      );
    };
  }
} else {
  // Use regular expo-linear-gradient for native platforms
  const gradientModule = require('expo-linear-gradient');
  LinearGradient = gradientModule.LinearGradient;
}

// Web-safe LinearGradient wrapper
export const WebSafeLinearGradient = ({ 
  colors = ['#ffffff', '#f0f0f0'], 
  start = { x: 0, y: 0 }, 
  end = { x: 1, y: 1 }, 
  style, 
  children, 
  ...props 
}) => {
  // Additional web safety for older browsers
  if (Platform.OS === 'web' && typeof window !== 'undefined') {
    const isOldBrowser = !window.CSS || !window.CSS.supports || 
                        !window.CSS.supports('background', 'linear-gradient(45deg, red, blue)');
    
    if (isOldBrowser) {
      // Fallback to solid color for very old browsers
      return (
        <View
          style={[
            {
              backgroundColor: colors[0] || '#ffffff',
            },
            style,
          ]}
          {...props}
        >
          {children}
        </View>
      );
    }
  }

  return (
    <LinearGradient
      colors={colors}
      start={start}
      end={end}
      style={style}
      {...props}
    >
      {children}
    </LinearGradient>
  );
};

export default WebSafeLinearGradient;