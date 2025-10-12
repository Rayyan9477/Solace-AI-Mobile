import React from 'react';
import { ScrollView, TextInput } from 'react-native';

const KeyboardAwareScrollView = ({ children, ...props }) => (
  <ScrollView {...props}>{children}</ScrollView>
);

export const KeyboardAwareInput = (props) => <TextInput {...props} />;

export default KeyboardAwareScrollView;