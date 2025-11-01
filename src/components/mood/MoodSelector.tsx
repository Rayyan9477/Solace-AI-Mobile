import React from 'react';
import { View } from 'react-native';

export const MoodSelector = ({ testID = 'mood-selector', ...props }: any) => (
  <View testID={testID} accessibilityRole="button" {...props} />
);

export default MoodSelector;
