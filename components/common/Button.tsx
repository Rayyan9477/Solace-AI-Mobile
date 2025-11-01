import React from 'react';
import { TouchableOpacity, Text } from 'react-native';

const Button = ({ title = 'Button', onPress = () => {}, accessibilityLabel, testID, style }: any) => (
  <TouchableOpacity accessibilityRole="button" accessibilityLabel={accessibilityLabel || title} onPress={onPress} testID={testID} style={style}>
    <Text>{title}</Text>
  </TouchableOpacity>
);

export default Button;
