import React from 'react';
import { View } from 'react-native';

export const MoodSelector = ({ testID = 'mood-selector', ...props }: any) => (
  <View testID={testID} accessibilityRole="combobox" {...props} />
);

export default MoodSelector;
