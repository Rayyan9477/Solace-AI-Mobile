/**
 * Icon Component
 * Unified icon system using Ionicons
 */

import React from 'react';
import { Ionicons } from '@expo/vector-icons';

interface IconProps {
  name: keyof typeof Ionicons.glyphMap;
  size?: number;
  color?: string;
}

export const Icon = ({ name, size = 24, color = '#000000' }: IconProps) => {
  return <Ionicons name={name} size={size} color={color} />;
};

export default Icon;
