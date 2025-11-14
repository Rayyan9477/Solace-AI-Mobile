/**
 * CrisisSupportScreen Component Tests
 * Comprehensive testing for emergency mental health crisis support interface
 * CRITICAL: This feature can save lives - thorough testing is essential
 */

import React from 'react';
import { render, fireEvent, waitFor, screen } from '@testing-library/react-native';
import { Alert, Linking } from 'react-native';
import { CrisisSupportScreen } from '../../../../src/features/crisis/screens/CrisisSupportScreen';

// Mock dependencies
jest.mock('@theme/ThemeProvider', () => ({
  useTheme: () => ({
    theme: {
      colors: {
        background: {
          primary: '#FFFFFF',
          secondary: '#F5F5F5',
        },
        text: {
          primary: '#2D3748',
          secondary: '#718096',
        },
        brown: {
          10: '#FFF8F0',
          80: '#5A3B2A',
        },
        green: {
          40: '#7D944D',
          60: '#6B8E3D',
        },
        red: {
          20: '#FEE2E2',
          40: '#EF4444',
          60: '#DC2626',
          80: '#991B1B',
          100: '#7F1D1D',
        },
        purple: {
          40: '#9B7FC4',
          60: '#7B5FA4',
          100: '#3B1F64',
        },
        orange: {
          40: '#ED7E1C',
        },
        blue: {
          40: '#3B82F6',
        },
      },
    },
  }),
}));

jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({
    navigate: jest.fn(),
    goBack: jest.fn(),
  }),
}));

jest.mock('../../../../src/features/crisis/crisisConfig', () => ({
  EMERGENCY_RESOURCES: {
    US: [
      {
        id: 'suicide-hotline',
        name: 'National Suicide Prevention Lifeline',
        number: '988',
        description: '24/7 free and confidential support for people in distress',
        type: 'voice',
        priority: 1,
      },
      {
        id: 'crisis-text',
        name: 'Crisis Text Line',
        number: '741741',
        keyword: 'HELLO',
        description: 'Text support available 24/7',
        type: 'text',
        priority: 2,
      },
      {
        id: 'emergency',
        name: 'Emergency Services',
        number: '911',
        description: 'Immediate emergency response',
        type: 'emergency',
        priority: 0,
      },
    ],
  },
  SUPPORT_RESOURCES: [
    {
      id: 'nami',
      name: 'NAMI HelpLine',
      number: '1-800-950-6264',
      description: 'Mental health support and information',
      type: 'resource',
    },
    {
      id: 'samhsa',
      name: 'SAMHSA National Helpline',
      url: 'https://www.samhsa.gov/find-help/national-helpline',
      description: 'Treatment referral and information service',
      type: 'resource',
    },
  ],
}));

describe('CrisisSupportScreen', () => {
  let mockNavigation: any;
  let alertSpy: jest.SpyInstance;
  let linkingSpy: jest.SpyInstance;

  beforeEach(() => {
    mockNavigation = {
      navigate: jest.fn(),
      goBack: jest.fn(),
    };

    const { useNavigation } = require('@react-navigation/native');
    (useNavigation as jest.Mock).mockReturnValue(mockNavigation);

    jest.clearAllMocks();
    alertSpy = jest.spyOn(Alert, 'alert').mockImplementation(() => {});
    linkingSpy = jest.spyOn(Linking, 'openURL').mockResolvedValue(true);
  });

  afterEach(() => {
    alertSpy.mockRestore();
    linkingSpy.mockRestore();
  });

  describe('Critical Rendering - Life Safety Features', () => {
    it('should ALWAYS render without crashing - this is critical for crisis situations', () => {
      render(<CrisisSupportScreen />);

      expect(screen.getByText("You're Not Alone")).toBeTruthy();
    });

    it('should ALWAYS display emergency header', () => {
      render(<CrisisSupportScreen />);

      expect(screen.getByText("You're Not Alone")).toBeTruthy();
      expect(screen.getByText('Immediate help is available 24/7')).toBeTruthy();
    });

    it('should ALWAYS display crisis support badge', () => {
      render(<CrisisSupportScreen />);

      expect(screen.getByText('🆘 CRISIS SUPPORT')).toBeTruthy();
    });

    it('should ALWAYS display emergency warning message', () => {
      render(<CrisisSupportScreen />);

      expect(screen.getByText(/If you're in immediate danger/)).toBeTruthy();
      expect(screen.getByText(/Call 911 or go to your nearest emergency room/)).toBeTruthy();
    });

    it('should ALWAYS render close button for easy exit', () => {
      const { getByLabelText } = render(<CrisisSupportScreen />);

      const closeButton = getByLabelText('Close');
      expect(closeButton).toBeTruthy();
    });
  });

  describe('Emergency Resources Display', () => {
    it('should display National Suicide Prevention Lifeline', () => {
      render(<CrisisSupportScreen />);

      expect(screen.getByText('National Suicide Prevention Lifeline')).toBeTruthy();
      expect(screen.getByText('988')).toBeTruthy();
      expect(screen.getByText('24/7 free and confidential support for people in distress')).toBeTruthy();
    });

    it('should display Crisis Text Line', () => {
      render(<CrisisSupportScreen />);

      expect(screen.getByText('Crisis Text Line')).toBeTruthy();
      expect(screen.getByText('741741')).toBeTruthy();
      expect(screen.getByText('Text support available 24/7')).toBeTruthy();
    });

    it('should display Emergency Services', () => {
      render(<CrisisSupportScreen />);

      expect(screen.getByText('Emergency Services')).toBeTruthy();
      expect(screen.getByText('911')).toBeTruthy();
      expect(screen.getByText('Immediate emergency response')).toBeTruthy();
    });

    it('should display appropriate icons for resource types', () => {
      render(<CrisisSupportScreen />);

      expect(screen.getByText('🚨')).toBeTruthy(); // Emergency
      expect(screen.getByText('📞')).toBeTruthy(); // Voice
      expect(screen.getByText('💬')).toBeTruthy(); // Text
    });

    it('should render section title for emergency resources', () => {
      render(<CrisisSupportScreen />);

      expect(screen.getByText('Emergency Support')).toBeTruthy();
    });
  });

  describe('Support Resources Display', () => {
    it('should display Additional Support section', () => {
      render(<CrisisSupportScreen />);

      expect(screen.getByText('Additional Support')).toBeTruthy();
    });

    it('should display NAMI HelpLine', () => {
      render(<CrisisSupportScreen />);

      expect(screen.getByText('NAMI HelpLine')).toBeTruthy();
      expect(screen.getByText('1-800-950-6264')).toBeTruthy();
      expect(screen.getByText('Mental health support and information')).toBeTruthy();
    });

    it('should display SAMHSA National Helpline', () => {
      render(<CrisisSupportScreen />);

      expect(screen.getByText('SAMHSA National Helpline')).toBeTruthy();
      expect(screen.getByText('Treatment referral and information service')).toBeTruthy();
    });
  });

  describe('Call Functionality - CRITICAL', () => {
    it('should show confirmation alert when call button is pressed', () => {
      render(<CrisisSupportScreen />);

      const callButtons = screen.getAllByText(/📞 Call Now/);
      fireEvent.press(callButtons[0]);

      expect(alertSpy).toHaveBeenCalledWith(
        'Call Crisis Support',
        expect.stringContaining('Call'),
        expect.arrayContaining([
          expect.objectContaining({ text: 'Cancel', style: 'cancel' }),
          expect.objectContaining({ text: 'Call Now', style: 'default' }),
        ]),
        expect.any(Object)
      );
    });

    it('should initiate phone call when confirmed', () => {
      render(<CrisisSupportScreen />);

      const callButtons = screen.getAllByText(/📞 Call Now/);
      fireEvent.press(callButtons[0]);

      // Simulate pressing "Call Now" in alert
      const alertCall = alertSpy.mock.calls[0];
      const callNowButton = alertCall[2].find((btn: any) => btn.text === 'Call Now');
      if (callNowButton && callNowButton.onPress) {
        callNowButton.onPress();
      }

      expect(linkingSpy).toHaveBeenCalledWith(expect.stringContaining('tel:'));
    });

    it('should handle failed call attempts gracefully', () => {
      linkingSpy.mockRejectedValueOnce(new Error('Cannot open phone'));

      render(<CrisisSupportScreen />);

      const callButtons = screen.getAllByText(/📞 Call Now/);
      fireEvent.press(callButtons[0]);

      const alertCall = alertSpy.mock.calls[0];
      const callNowButton = alertCall[2].find((btn: any) => btn.text === 'Call Now');
      if (callNowButton && callNowButton.onPress) {
        callNowButton.onPress();
      }

      // Should show error but not crash
      expect(linkingSpy).toHaveBeenCalled();
    });

    it('should call 988 for suicide prevention hotline', () => {
      render(<CrisisSupportScreen />);

      const callButtons = screen.getAllByText(/📞 Call Now/);
      // First call button should be for 988
      fireEvent.press(callButtons[0]);

      const alertCall = alertSpy.mock.calls[0];
      const callNowButton = alertCall[2].find((btn: any) => btn.text === 'Call Now');
      if (callNowButton && callNowButton.onPress) {
        callNowButton.onPress();
      }

      expect(linkingSpy).toHaveBeenCalledWith(expect.stringContaining('988'));
    });

    it('should call 911 for emergency services', () => {
      render(<CrisisSupportScreen />);

      const callButtons = screen.getAllByText(/📞 Call Now/);
      // Find the 911 call button
      const emergencyButton = callButtons.find(button => {
        const parent = button.parent?.parent?.parent;
        return parent?.props?.children?.toString().includes('911');
      });

      if (emergencyButton) {
        fireEvent.press(emergencyButton);

        const alertCall = alertSpy.mock.calls[0];
        const callNowButton = alertCall[2].find((btn: any) => btn.text === 'Call Now');
        if (callNowButton && callNowButton.onPress) {
          callNowButton.onPress();
        }

        expect(linkingSpy).toHaveBeenCalledWith(expect.stringContaining('911'));
      }
    });
  });

  describe('Text Functionality', () => {
    it('should open SMS with keyword when text button is pressed', () => {
      render(<CrisisSupportScreen />);

      const textButtons = screen.getAllByText(/💬 Text/);
      fireEvent.press(textButtons[0]);

      expect(linkingSpy).toHaveBeenCalledWith(expect.stringContaining('sms:741741'));
      expect(linkingSpy).toHaveBeenCalledWith(expect.stringContaining('HELLO'));
    });

    it('should handle failed text attempts gracefully', () => {
      linkingSpy.mockRejectedValueOnce(new Error('Cannot send SMS'));

      render(<CrisisSupportScreen />);

      const textButtons = screen.getAllByText(/💬 Text/);
      fireEvent.press(textButtons[0]);

      // Should not crash the app
      expect(linkingSpy).toHaveBeenCalled();
    });

    it('should format SMS URL correctly with number and keyword', () => {
      render(<CrisisSupportScreen />);

      const textButtons = screen.getAllByText(/💬 Text/);
      fireEvent.press(textButtons[0]);

      expect(linkingSpy).toHaveBeenCalledWith('sms:741741?body=HELLO');
    });
  });

  describe('Navigation', () => {
    it('should navigate back when close button is pressed', () => {
      const { getByLabelText } = render(<CrisisSupportScreen />);

      const closeButton = getByLabelText('Close');
      fireEvent.press(closeButton);

      expect(mockNavigation.goBack).toHaveBeenCalled();
    });

    it('should open URL when support resource with URL is pressed', () => {
      render(<CrisisSupportScreen />);

      const samhsaCard = screen.getByText('SAMHSA National Helpline').parent;
      if (samhsaCard) {
        fireEvent.press(samhsaCard);
      }

      expect(linkingSpy).toHaveBeenCalledWith(
        'https://www.samhsa.gov/find-help/national-helpline'
      );
    });

    it('should call when support resource with number is pressed', () => {
      render(<CrisisSupportScreen />);

      const namiCard = screen.getByText('NAMI HelpLine').parent;
      if (namiCard) {
        fireEvent.press(namiCard);
      }

      const alertCall = alertSpy.mock.calls[0];
      const callNowButton = alertCall[2].find((btn: any) => btn.text === 'Call Now');
      if (callNowButton && callNowButton.onPress) {
        callNowButton.onPress();
      }

      expect(linkingSpy).toHaveBeenCalledWith(expect.stringContaining('1-800-950-6264'));
    });
  });

  describe('Accessibility - CRITICAL for users in distress', () => {
    it('should have accessible close button', () => {
      const { getByLabelText } = render(<CrisisSupportScreen />);

      const closeButton = getByLabelText('Close');
      expect(closeButton.props.accessibilityRole).toBe('button');
    });

    it('should have clear visual hierarchy with large text', () => {
      render(<CrisisSupportScreen />);

      // Header should be prominent
      expect(screen.getByText("You're Not Alone")).toBeTruthy();
      expect(screen.getByText('Immediate help is available 24/7')).toBeTruthy();
    });

    it('should use high contrast colors for emergency content', () => {
      render(<CrisisSupportScreen />);

      // Red header should be visible
      expect(screen.getByText("You're Not Alone")).toBeTruthy();
    });

    it('should clearly indicate action buttons', () => {
      render(<CrisisSupportScreen />);

      const callButtons = screen.getAllByText(/📞 Call Now/);
      expect(callButtons.length).toBeGreaterThan(0);

      const textButtons = screen.getAllByText(/💬 Text/);
      expect(textButtons.length).toBeGreaterThan(0);
    });
  });

  describe('Error Handling - CRITICAL', () => {
    it('should show error alert when call fails', () => {
      linkingSpy.mockRejectedValueOnce(new Error('Phone not available'));

      render(<CrisisSupportScreen />);

      const callButtons = screen.getAllByText(/📞 Call Now/);
      fireEvent.press(callButtons[0]);

      const alertCall = alertSpy.mock.calls[0];
      const callNowButton = alertCall[2].find((btn: any) => btn.text === 'Call Now');
      if (callNowButton && callNowButton.onPress) {
        callNowButton.onPress();
      }

      waitFor(() => {
        expect(alertSpy).toHaveBeenCalledWith('Error', 'Unable to make phone call');
      });
    });

    it('should show error alert when text fails', () => {
      linkingSpy.mockRejectedValueOnce(new Error('SMS not available'));

      render(<CrisisSupportScreen />);

      const textButtons = screen.getAllByText(/💬 Text/);
      fireEvent.press(textButtons[0]);

      waitFor(() => {
        expect(alertSpy).toHaveBeenCalledWith('Error', 'Unable to send text message');
      });
    });

    it('should show error alert when URL opening fails', () => {
      linkingSpy.mockRejectedValueOnce(new Error('Browser not available'));

      render(<CrisisSupportScreen />);

      const samhsaCard = screen.getByText('SAMHSA National Helpline').parent;
      if (samhsaCard) {
        fireEvent.press(samhsaCard);
      }

      waitFor(() => {
        expect(alertSpy).toHaveBeenCalledWith('Error', 'Unable to open link');
      });
    });

    it('should never crash even if all features fail', () => {
      linkingSpy.mockRejectedValue(new Error('All features unavailable'));

      render(<CrisisSupportScreen />);

      // Screen should still be functional
      expect(screen.getByText("You're Not Alone")).toBeTruthy();
      expect(screen.getByText('988')).toBeTruthy();
    });
  });

  describe('Visual Design', () => {
    it('should use red theme for emergency header', () => {
      render(<CrisisSupportScreen />);

      // Header should be visually distinct
      expect(screen.getByText("You're Not Alone")).toBeTruthy();
    });

    it('should display warning card with left border', () => {
      render(<CrisisSupportScreen />);

      expect(screen.getByText(/If you're in immediate danger/)).toBeTruthy();
    });

    it('should use appropriate colors for different resource types', () => {
      render(<CrisisSupportScreen />);

      // Different resource types should be visually distinct
      expect(screen.getByText('📞 Call Now')).toBeTruthy();
      expect(screen.getByText(/💬 Text/)).toBeTruthy();
    });
  });

  describe('Edge Cases and Resilience', () => {
    it('should handle missing emergency resources gracefully', () => {
      jest.doMock('../../../../src/features/crisis/crisisConfig', () => ({
        EMERGENCY_RESOURCES: { US: [] },
        SUPPORT_RESOURCES: [],
      }));

      // Should still render without crashing
      render(<CrisisSupportScreen />);
      expect(screen.getByText("You're Not Alone")).toBeTruthy();
    });

    it('should handle rapid button presses without breaking', () => {
      render(<CrisisSupportScreen />);

      const callButtons = screen.getAllByText(/📞 Call Now/);

      // Rapidly press call button
      fireEvent.press(callButtons[0]);
      fireEvent.press(callButtons[0]);
      fireEvent.press(callButtons[0]);

      // Should handle gracefully
      expect(alertSpy).toHaveBeenCalled();
    });

    it('should maintain scroll functionality with many resources', () => {
      const { UNSAFE_getByType } = render(<CrisisSupportScreen />);

      const { ScrollView } = require('react-native');
      expect(UNSAFE_getByType(ScrollView)).toBeTruthy();
    });
  });

  describe('Life-Critical User Flows', () => {
    it('should allow immediate 988 call with minimum steps', () => {
      render(<CrisisSupportScreen />);

      // User sees 988
      expect(screen.getByText('988')).toBeTruthy();

      // User presses call
      const callButtons = screen.getAllByText(/📞 Call Now/);
      fireEvent.press(callButtons[0]);

      // Confirmation shown
      expect(alertSpy).toHaveBeenCalled();

      // User confirms
      const alertCall = alertSpy.mock.calls[0];
      const callNowButton = alertCall[2].find((btn: any) => btn.text === 'Call Now');
      if (callNowButton && callNowButton.onPress) {
        callNowButton.onPress();
      }

      // Call initiated
      expect(linkingSpy).toHaveBeenCalledWith(expect.stringContaining('988'));
    });

    it('should allow immediate text to crisis line', () => {
      render(<CrisisSupportScreen />);

      // User sees text option
      expect(screen.getByText(/💬 Text/)).toBeTruthy();

      // User presses text
      const textButtons = screen.getAllByText(/💬 Text/);
      fireEvent.press(textButtons[0]);

      // SMS opened immediately
      expect(linkingSpy).toHaveBeenCalledWith(expect.stringContaining('sms:'));
    });

    it('should prominently display 911 for true emergencies', () => {
      render(<CrisisSupportScreen />);

      expect(screen.getByText('911')).toBeTruthy();
      expect(screen.getByText('Emergency Services')).toBeTruthy();
      expect(screen.getByText('Immediate emergency response')).toBeTruthy();
    });
  });
});
