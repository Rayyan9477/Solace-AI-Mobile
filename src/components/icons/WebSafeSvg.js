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

console.log('🔧 WebSafeSvg: Initializing SVG components for platform:', Platform.OS);

if (Platform.OS === 'web') {
  try {
    // Try to import react-native-svg components
    const svgComponents = require('react-native-svg');
    console.log('🔧 WebSafeSvg: react-native-svg loaded successfully', !!svgComponents);
    
    Svg = svgComponents.default || svgComponents.Svg;
    Path = svgComponents.Path;
    Circle = svgComponents.Circle;
    Rect = svgComponents.Rect;
    Line = svgComponents.Line;
    Polyline = svgComponents.Polyline;
    Polygon = svgComponents.Polygon;
    G = svgComponents.G;
    
    console.log('🔧 WebSafeSvg: SVG components set up successfully');
  } catch (error) {
    console.warn('🔧 WebSafeSvg: react-native-svg not available on web, using HTML fallbacks:', error);
    
    // Enhanced HTML fallback components for web when SVG fails
    const FallbackSvg = ({ width, height, viewBox, style, children, fill = 'none', stroke, strokeWidth = 2, ...props }) => {
      const svgElement = React.createElement(
        'svg',
        {
          width: width || 24,
          height: height || 24,
          viewBox: viewBox || '0 0 24 24',
          fill,
          stroke: stroke || 'currentColor',
          strokeWidth,
          style: {
            display: 'inline-block',
            verticalAlign: 'middle',
            ...style
          },
          ...props
        },
        children
      );
      
      return svgElement;
    };
    
    // HTML SVG element fallbacks
    const FallbackPath = ({ d, stroke, strokeWidth, fill, ...props }) =>
      React.createElement('path', { d, stroke, strokeWidth, fill, ...props });
    
    const FallbackCircle = ({ cx, cy, r, stroke, strokeWidth, fill, ...props }) =>
      React.createElement('circle', { cx, cy, r, stroke, strokeWidth, fill, ...props });
    
    const FallbackRect = ({ x, y, width, height, stroke, strokeWidth, fill, ...props }) =>
      React.createElement('rect', { x, y, width, height, stroke, strokeWidth, fill, ...props });
    
    const FallbackLine = ({ x1, y1, x2, y2, stroke, strokeWidth, ...props }) =>
      React.createElement('line', { x1, y1, x2, y2, stroke, strokeWidth, ...props });
    
    const FallbackPolyline = ({ points, stroke, strokeWidth, fill, ...props }) =>
      React.createElement('polyline', { points, stroke, strokeWidth, fill, ...props });
    
    const FallbackPolygon = ({ points, stroke, strokeWidth, fill, ...props }) =>
      React.createElement('polygon', { points, stroke, strokeWidth, fill, ...props });
    
    const FallbackG = ({ children, ...props }) =>
      React.createElement('g', props, children);
    
    Svg = FallbackSvg;
    Path = FallbackPath;
    Circle = FallbackCircle;
    Rect = FallbackRect;
    Line = FallbackLine;
    Polyline = FallbackPolyline;
    Polygon = FallbackPolygon;
    G = FallbackG;
    
    console.log('🔧 WebSafeSvg: HTML fallback components set up successfully');
  }
} else {
  // Use regular react-native-svg for native platforms
  try {
    const svgComponents = require('react-native-svg');
    Svg = svgComponents.default || svgComponents.Svg;
    Path = svgComponents.Path;
    Circle = svgComponents.Circle;
    Rect = svgComponents.Rect;
    Line = svgComponents.Line;
    Polyline = svgComponents.Polyline;
    Polygon = svgComponents.Polygon;
    G = svgComponents.G;
    
    console.log('🔧 WebSafeSvg: Native SVG components loaded successfully');
  } catch (error) {
    console.error('🔧 WebSafeSvg: Failed to load native SVG components:', error);
    throw error;
  }
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