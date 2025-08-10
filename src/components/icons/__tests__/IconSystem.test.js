/**
 * Icon System Test
 * Tests the comprehensive icon system for mental health app
 */

import React from 'react';
import { render } from '@testing-library/react-native';

// Test icon collections (updated import pattern to avoid conflicts)
import { IconCollections, AllIcons } from '../AllIcons';

// Import individual icon components directly from their files
import MentalHealthIcon from '../MentalHealthIcons';
import HealthTechIcon from '../HealthTechIcons'; 
import GeneralUIIcon from '../GeneralUIIcons';

describe('Icon System', () => {
  describe('Core Icon Components', () => {
    it('renders MentalHealthIcon without crashing', () => {
      const { getByTestId } = render(
        <MentalHealthIcon 
          name="mindfulness" 
          size={24} 
          testID="mindfulness-icon"
        />
      );
      
      expect(getByTestId('mindfulness-icon')).toBeTruthy();
    });

    it('renders HealthTechIcon without crashing', () => {
      const { getByTestId } = render(
        <HealthTechIcon 
          name="brain" 
          size={24} 
          testID="brain-icon"
        />
      );
      
      expect(getByTestId('brain-icon')).toBeTruthy();
    });

    it('renders GeneralUIIcon without crashing', () => {
      const { getByTestId } = render(
        <GeneralUIIcon 
          name="menu" 
          size={24} 
          testID="menu-icon"
        />
      );
      
      expect(getByTestId('menu-icon')).toBeTruthy();
    });
  });

  describe('Icon Collections', () => {
    it('exports IconCollections object', () => {
      expect(IconCollections).toBeDefined();
      expect(typeof IconCollections).toBe('object');
    });

    it('has all expected icon collections', () => {
      const expectedCollections = [
        'healthTech',
        'generalUI', 
        'arrowsDirections',
        'mentalHealth',
        'navigationInterface',
        'dataVisualization',
        'accessibilityCommunication',
        'notificationStatus'
      ];

      expectedCollections.forEach(collection => {
        expect(IconCollections[collection]).toBeDefined();
      });
    });

    it('exports AllIcons object', () => {
      expect(AllIcons).toBeDefined();
      expect(typeof AllIcons).toBe('object');
    });

    it('has mental health focused icons', () => {
      const mentalHealthIcons = [
        'mindfulness',
        'emotionalBalance',
        'moodTracker',
        'therapySession',
        'selfCare'
      ];

      // Check if icons exist in collections
      mentalHealthIcons.forEach(iconName => {
        const iconExists = Object.keys(AllIcons).includes(iconName) ||
                          Object.values(IconCollections).some(collection => 
                            Object.keys(collection).includes(iconName)
                          );
        expect(iconExists).toBe(true);
      });
    });
  });

  describe('Icon Props and Theming', () => {
    it('supports therapeutic themes', () => {
      const themes = ['calming', 'nurturing', 'peaceful', 'grounding', 'energizing'];
      
      themes.forEach(theme => {
        const { getByTestId } = render(
          <MentalHealthIcon 
            name="mindfulness" 
            therapeuticTheme={theme}
            testID={`icon-${theme}`}
          />
        );
        
        expect(getByTestId(`icon-${theme}`)).toBeTruthy();
      });
    });

    it('supports different variants', () => {
      const variants = ['outline', 'filled'];
      
      variants.forEach(variant => {
        const { getByTestId } = render(
          <HealthTechIcon 
            name="brain" 
            variant={variant}
            testID={`icon-${variant}`}
          />
        );
        
        expect(getByTestId(`icon-${variant}`)).toBeTruthy();
      });
    });

    it('supports custom sizes', () => {
      const sizes = [16, 24, 32, 48];
      
      sizes.forEach(size => {
        const { getByTestId } = render(
          <GeneralUIIcon 
            name="menu" 
            size={size}
            testID={`icon-${size}`}
          />
        );
        
        expect(getByTestId(`icon-${size}`)).toBeTruthy();
      });
    });
  });

  describe('Accessibility', () => {
    it('includes proper accessibility properties', () => {
      const { getByTestId } = render(
        <MentalHealthIcon 
          name="mindfulness"
          testID="accessible-icon"
          accessibilityLabel="Mindfulness meditation icon"
        />
      );
      
      const icon = getByTestId('accessible-icon');
      expect(icon).toBeTruthy();
    });
  });

  describe('Error Handling', () => {
    it('handles invalid icon names gracefully', () => {
      const { getByTestId } = render(
        <MentalHealthIcon 
          name="invalid-icon-name"
          testID="fallback-icon"
        />
      );
      
      // Should render default fallback icon
      expect(getByTestId('fallback-icon')).toBeTruthy();
    });
  });
});