/**
 * Icon Components
 * Simple icon components
 */

import React from 'react';
import { Text } from 'react-native';

export const MentalHealthIcon = ({ size = 24, color = '#007AFF' }) => (
  <Text style={{ fontSize: size, color }}>🧠</Text>
);

export const FreudLogo = ({ size = 24, primaryColor = '#007AFF' }) => (
  <Text style={{ fontSize: size, color: primaryColor }}>🧠</Text>
);

export const ThemedFreudIcon = ({ name, size = 24, color = '#007AFF' }) => {
  const iconMap = {
    'brain': '🧠',
    'heart': '❤️',
    'chevron-right': '→',
    'chevron-left': '←',
  };
  
  return (
    <Text style={{ fontSize: size, color }}>
      {iconMap[name] || '?'}
    </Text>
  );
};
