import React from 'react';
import { View } from 'react-native';

export const IntensitySlider = ({ testID = 'intensity-slider', onValueChange = () => {}, ...props }: any) => (
  <View testID={testID} accessibilityRole="adjustable" {...props} />
);

export default IntensitySlider;
