/**
 * Simple Icon System Test
 * Basic tests to verify icon components can be imported
 */

import React from 'react';
import { render } from '@testing-library/react-native';

// Import components from index file
import { MentalHealthIcon, getIconSize, getIconColor } from '../index';

// Mock theme context
jest.mock('../../../contexts/ThemeContext', () => ({
  useTheme: () => ({
    theme: {
      colors: {
        text: { primary: '#000000' },
        primary: { 500: '#0EA5E9' },
        therapeutic: {
          calming: { 500: '#BAE6FD' }
        }
      }
    }
  })
}));

describe('Icon System - Basic Tests', () => {
  describe('Utility Functions', () => {
    test('getIconSize returns correct size', () => {
      expect(getIconSize('md')).toBe(24);
      expect(getIconSize(32)).toBe(32);
      expect(getIconSize('invalid')).toBe(24); // fallback
    });

    test('getIconColor returns fallback for invalid theme', () => {
      const mockTheme = {
        colors: {
          text: { primary: '#000000' }
        }
      };
      expect(getIconColor(mockTheme, 'default')).toBe('#000000');
    });
  });

  describe('Component Imports', () => {
    test('MentalHealthIcon component exists', () => {
      expect(MentalHealthIcon).toBeDefined();
      expect(typeof MentalHealthIcon).toBe('function');
    });
  });
});