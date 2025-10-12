// Bridge: Provide a minimal Avatar component for tests if not present in UI
import React from 'react';
import { TouchableOpacity, View, Text } from 'react-native';

const getInitials = (name = '') => {
  if (!name) return '';
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
  return (parts[0].charAt(0) + parts[1].charAt(0)).toUpperCase();
};

const Avatar = ({ name = '', fallbackIcon = '👤', status, badge, onPress }) => {
  const content = name ? (
    <Text>{getInitials(name)}</Text>
  ) : (
    <Text>{fallbackIcon}</Text>
  );

  const Container = onPress ? TouchableOpacity : View;
  const accessibilityLabel = name
    ? `${name}'s avatar${status ? `, status: ${status}` : ''}`
    : 'Avatar';

  return (
    <Container accessibilityRole={onPress ? 'button' : 'image'} accessibilityLabel={accessibilityLabel} onPress={onPress}>
      <View>{content}</View>
      {status ? <View accessibilityLabel={`Status: ${status}`} /> : null}
      {badge ? <View accessibilityLabel={`Badge: ${badge.count}`} /> : null}
    </Container>
  );
};

export default Avatar;
