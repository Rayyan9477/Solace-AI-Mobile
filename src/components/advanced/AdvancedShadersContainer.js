import React from "react";
import { View } from "react-native";

// DEPRECATED: AdvancedShadersContainer has been disabled for professional UI
// This component now renders a simple View for production-ready mental health app design
const AdvancedShadersContainer = ({ children, style, ...props }) => {
  // Show deprecation warning in development
  if (__DEV__) {
    console.warn(
      "AdvancedShadersContainer is deprecated and disabled for professional UI. " +
        "Amateur shader effects are inappropriate for healthcare applications. " +
        "Use simple View components for production-ready design.",
    );
  }

  // Return simple View without any shader effects
  return (
    <View style={style} {...props}>
      {children}
    </View>
  );
};

export default AdvancedShadersContainer;
