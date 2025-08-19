/**
 * Web-Safe SVG Components
 * 
 * Provides web-compatible SVG components that fallback gracefully
 * when react-native-svg has compatibility issues on web.
 */

import React from 'react';
import { Platform, View } from 'react-native';

// Web-safe SVG imports with fallbacks
let Svg, Path, Circle, Rect, Line, Polyline, Polygon, G;

if (Platform.OS === 'web') {
  try {
    // Try to import react-native-svg components
    const svgComponents = require('react-native-svg');
    Svg = svgComponents.default || svgComponents.Svg;
    Path = svgComponents.Path;
    Circle = svgComponents.Circle;
    Rect = svgComponents.Rect;
    Line = svgComponents.Line;
    Polyline = svgComponents.Polyline;
    Polygon = svgComponents.Polygon;
    G = svgComponents.G;
  } catch (error) {
    console.warn('react-native-svg not available on web, using fallbacks:', error);
    
    // Fallback components for web when SVG fails
    const FallbackSvg = ({ width, height, viewBox, style, children, ...props }) => (
      <View
        style={[
          {
            width: width || 24,
            height: height || 24,
            backgroundColor: 'transparent',
          },
          style,
        ]}
        {...props}
      >
        {children}
      </View>
    );
    
    const FallbackShape = ({ children, ...props }) => (
      <View style={{ position: 'absolute' }} {...props}>
        {children}
      </View>
    );
    
    Svg = FallbackSvg;
    Path = FallbackShape;
    Circle = FallbackShape;
    Rect = FallbackShape;
    Line = FallbackShape;
    Polyline = FallbackShape;
    Polygon = FallbackShape;
    G = FallbackShape;
  }
} else {
  // Use regular react-native-svg for native platforms
  const svgComponents = require('react-native-svg');
  Svg = svgComponents.default || svgComponents.Svg;
  Path = svgComponents.Path;
  Circle = svgComponents.Circle;
  Rect = svgComponents.Rect;
  Line = svgComponents.Line;
  Polyline = svgComponents.Polyline;
  Polygon = svgComponents.Polygon;
  G = svgComponents.G;
}

// Web-safe SVG wrapper component
export const WebSafeSvg = ({ children, width = 24, height = 24, viewBox = "0 0 24 24", style, ...props }) => {
  // Additional web safety checks
  if (Platform.OS === 'web' && typeof window !== 'undefined' && !window.SVGElement) {
    // Browser doesn't support SVG, show a placeholder
    return (
      <View
        style={[
          {
            width,
            height,
            backgroundColor: '#f0f0f0',
            borderRadius: 4,
            justifyContent: 'center',
            alignItems: 'center',
          },
          style,
        ]}
        {...props}
      >
        {/* Could add a simple icon placeholder here */}
      </View>
    );
  }

  return (
    <Svg
      width={width}
      height={height}
      viewBox={viewBox}
      style={style}
      {...props}
    >
      {children}
    </Svg>
  );
};

// Export all SVG components with web safety
export {
  Svg,
  Path,
  Circle,
  Rect,
  Line,
  Polyline,
  Polygon,
  G,
};

// Helper function to create web-safe SVG props
export const getWebSafeSvgProps = (props = {}) => {
  if (Platform.OS === 'web') {
    return {
      ...props,
      // Ensure proper web rendering
      style: {
        display: 'block',
        ...props.style,
      },
    };
  }
  return props;
};

export default WebSafeSvg;