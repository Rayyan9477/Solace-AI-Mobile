import React from 'react';
import { TouchableOpacity, Text } from 'react-native';

const Button = ({ title = 'Button', onPress = () => {}, testID = 'common-button', ...props }) => (
  <TouchableOpacity accessibilityRole="button" accessibilityLabel={title} onPress={onPress} testID={testID} {...props}>
    <Text>{title}</Text>
  </TouchableOpacity>
);

export default Button;
