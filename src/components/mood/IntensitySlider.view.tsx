import React from "react";
import { View } from "react-native";

// Lightweight test-friendly stub that satisfies consumers expecting a testID and valueChange event
export const IntensitySlider = ({
  testID = "intensity-slider",
  onValueChange = () => {},
  ...props
}: any) => <View testID={testID} accessibilityRole="adjustable" {...props} />;

export default IntensitySlider;
