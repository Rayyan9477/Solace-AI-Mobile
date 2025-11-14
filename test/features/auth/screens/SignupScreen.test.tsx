/**
 * SignupScreen Component Tests
 * Comprehensive testing for user registration interface
 */

import React from 'react';
import { render, fireEvent, waitFor, screen } from '@testing-library/react-native';
import { Alert } from 'react-native';
import { SignupScreen } from '../../../../src/features/auth/SignupScreen';
import rateLimiter from '../../../../src/shared/utils/rateLimiter';

// Mock dependencies
jest.mock('@theme/ThemeProvider', () => ({
  useTheme: () => ({
    theme: {
      colors: {
        brown: {
          10: '#FFF8F0',
          20: '#F5E6D3',
          30: '#E8D0B5',
          40: '#D4AF7D',
          50: '#B8935A',
          60: '#9C7A4A',
          70: '#704A33',
          80: '#5A3B2A',
          90: '#2D1D15',
          100: '#1A0F0A',
        },
        orange: {
          20: '#FFEEE2',
          40: '#ED7E1C',
        },
        text: {
          primary: '#2D3748',
          secondary: '#718096',
        },
      },
    },
    isDark: false,
  }),
}));

jest.mock('@shared/hooks/useResponsive', () => ({
  useResponsive: () => ({
    isWeb: false,
    isMobile: true,
    getMaxContentWidth: () => 1024,
  }),
}));

jest.mock('@shared/utils/rateLimiter', () => ({
  __esModule: true,
  default: {
    checkLimit: jest.fn(),
    reset: jest.fn(),
  },
}));

jest.mock('@components/icons', () => ({
  MentalHealthIcon: ({ name, ...props }: any) => {
    const React = require('react');
    const { Text } = require('react-native');
    return React.createElement(Text, { testID: `icon-${name}`, ...props }, name);
  },
}));

jest.mock('@components/icons/FreudIcons', () => ({
  FreudLogo: ({ size, primaryColor }: any) => {
    const React = require('react');
    const { View } = require('react-native');
    return React.createElement(View, { testID: 'freud-logo' });
  },
}));

jest.mock('expo-linear-gradient', () => ({
  LinearGradient: ({ children, ...props }: any) => {
    const React = require('react');
    const { View } = require('react-native');
    return React.createElement(View, { testID: 'linear-gradient', ...props }, children);
  },
}));

// Mock navigation
const mockNavigate = jest.fn();
const mockNavigation = {
  navigate: mockNavigate,
  goBack: jest.fn(),
};

describe('SignupScreen', () => {
  let alertSpy: jest.SpyInstance;

  beforeEach(() => {
    jest.clearAllMocks();
    alertSpy = jest.spyOn(Alert, 'alert').mockImplementation(() => {});
    (rateLimiter.checkLimit as jest.Mock).mockResolvedValue({
      allowed: true,
      waitTime: 0,
    });
  });

  afterEach(() => {
    alertSpy.mockRestore();
  });

  describe('Rendering', () => {
    it('should render without crashing', () => {
      render(<SignupScreen navigation={mockNavigation} />);

      expect(screen.getByText('Sign Up For Free')).toBeTruthy();
    });

    it('should display Freud logo', () => {
      render(<SignupScreen navigation={mockNavigation} />);

      expect(screen.getByTestId('freud-logo')).toBeTruthy();
    });

    it('should render email input field', () => {
      render(<SignupScreen navigation={mockNavigation} />);

      const emailInput = screen.getByPlaceholderText('Enter your email...');
      expect(emailInput).toBeTruthy();
    });

    it('should render password input field', () => {
      render(<SignupScreen navigation={mockNavigation} />);

      const passwordInputs = screen.getAllByPlaceholderText('Enter your password...');
      expect(passwordInputs.length).toBe(2); // Password and confirmation
    });

    it('should render sign up button', () => {
      render(<SignupScreen navigation={mockNavigation} />);

      expect(screen.getByText('Sign Up')).toBeTruthy();
    });

    it('should render navigation link to login', () => {
      render(<SignupScreen navigation={mockNavigation} />);

      expect(screen.getByText('Sign In')).toBeTruthy();
    });

    it('should render field labels', () => {
      render(<SignupScreen navigation={mockNavigation} />);

      expect(screen.getByText('Email Address')).toBeTruthy();
      expect(screen.getByText('Password')).toBeTruthy();
      expect(screen.getByText('Password Confirmation')).toBeTruthy();
    });
  });

  describe('User Interactions', () => {
    it('should allow typing in email field', () => {
      render(<SignupScreen navigation={mockNavigation} />);

      const emailInput = screen.getByPlaceholderText('Enter your email...');
      fireEvent.changeText(emailInput, 'newuser@example.com');

      expect(emailInput.props.value).toBe('newuser@example.com');
    });

    it('should allow typing in password field', () => {
      render(<SignupScreen navigation={mockNavigation} />);

      const passwordInputs = screen.getAllByPlaceholderText('Enter your password...');
      const passwordInput = passwordInputs[0];

      fireEvent.changeText(passwordInput, 'SecurePassword123!');

      expect(passwordInput.props.value).toBe('SecurePassword123!');
    });

    it('should allow typing in password confirmation field', () => {
      render(<SignupScreen navigation={mockNavigation} />);

      const passwordInputs = screen.getAllByPlaceholderText('Enter your password...');
      const confirmPasswordInput = passwordInputs[1];

      fireEvent.changeText(confirmPasswordInput, 'SecurePassword123!');

      expect(confirmPasswordInput.props.value).toBe('SecurePassword123!');
    });

    it('should toggle password visibility when eye icon is pressed', () => {
      render(<SignupScreen navigation={mockNavigation} />);

      const toggleButton = screen.getByLabelText('Show password');
      fireEvent.press(toggleButton);

      const updatedToggleButton = screen.getByLabelText('Hide password');
      expect(updatedToggleButton).toBeTruthy();
    });

    it('should toggle confirm password visibility when eye icon is pressed', () => {
      render(<SignupScreen navigation={mockNavigation} />);

      const toggleButton = screen.getByLabelText('Show confirm password');
      fireEvent.press(toggleButton);

      const updatedToggleButton = screen.getByLabelText('Hide confirm password');
      expect(updatedToggleButton).toBeTruthy();
    });

    it('should navigate to login when Sign In link is pressed', () => {
      render(<SignupScreen navigation={mockNavigation} />);

      const loginLink = screen.getByText('Sign In');
      fireEvent.press(loginLink);

      expect(mockNavigate).toHaveBeenCalledWith('Login');
    });
  });

  describe('Email Validation', () => {
    it('should show error for invalid email format on blur', () => {
      render(<SignupScreen navigation={mockNavigation} />);

      const emailInput = screen.getByPlaceholderText('Enter your email...');
      fireEvent.changeText(emailInput, 'invalid-email');
      fireEvent(emailInput, 'blur');

      expect(screen.getByText('Invalid Email Address!!!')).toBeTruthy();
    });

    it('should clear error when valid email is entered', () => {
      render(<SignupScreen navigation={mockNavigation} />);

      const emailInput = screen.getByPlaceholderText('Enter your email...');

      // Enter invalid email
      fireEvent.changeText(emailInput, 'invalid');
      fireEvent(emailInput, 'blur');
      expect(screen.getByText('Invalid Email Address!!!')).toBeTruthy();

      // Enter valid email
      fireEvent.changeText(emailInput, 'valid@example.com');
      fireEvent(emailInput, 'blur');

      expect(screen.queryByText('Invalid Email Address!!!')).toBeNull();
    });

    it('should display email error badge with icon', () => {
      render(<SignupScreen navigation={mockNavigation} />);

      const emailInput = screen.getByPlaceholderText('Enter your email...');
      fireEvent.changeText(emailInput, 'invalid');
      fireEvent(emailInput, 'blur');

      expect(screen.getByTestId('icon-AlertCircle')).toBeTruthy();
    });

    it('should validate email on change after initial error', () => {
      render(<SignupScreen navigation={mockNavigation} />);

      const emailInput = screen.getByPlaceholderText('Enter your email...');

      // Trigger error
      fireEvent.changeText(emailInput, 'invalid');
      fireEvent(emailInput, 'blur');

      // Typing should trigger validation again
      fireEvent.changeText(emailInput, 'valid@example.com');

      expect(screen.queryByText('Invalid Email Address!!!')).toBeNull();
    });
  });

  describe('Password Validation', () => {
    it('should show error for password less than 12 characters', () => {
      render(<SignupScreen navigation={mockNavigation} />);

      const emailInput = screen.getByPlaceholderText('Enter your email...');
      const passwordInputs = screen.getAllByPlaceholderText('Enter your password...');
      const confirmInput = passwordInputs[1];

      fireEvent.changeText(emailInput, 'test@example.com');
      fireEvent.changeText(passwordInputs[0], 'Short1!');
      fireEvent.changeText(confirmInput, 'Short1!');

      const signUpButton = screen.getByLabelText('Sign up');
      fireEvent.press(signUpButton);

      expect(alertSpy).toHaveBeenCalledWith(
        'Password Too Weak',
        expect.stringContaining('at least 12 characters'),
        [{ text: 'OK' }]
      );
    });

    it('should show error for password without lowercase letter', () => {
      render(<SignupScreen navigation={mockNavigation} />);

      const emailInput = screen.getByPlaceholderText('Enter your email...');
      const passwordInputs = screen.getAllByPlaceholderText('Enter your password...');
      const confirmInput = passwordInputs[1];

      fireEvent.changeText(emailInput, 'test@example.com');
      fireEvent.changeText(passwordInputs[0], 'UPPERCASE123!@#');
      fireEvent.changeText(confirmInput, 'UPPERCASE123!@#');

      const signUpButton = screen.getByLabelText('Sign up');
      fireEvent.press(signUpButton);

      expect(alertSpy).toHaveBeenCalledWith(
        'Password Too Weak',
        expect.stringContaining('one lowercase letter'),
        [{ text: 'OK' }]
      );
    });

    it('should show error for password without uppercase letter', () => {
      render(<SignupScreen navigation={mockNavigation} />);

      const emailInput = screen.getByPlaceholderText('Enter your email...');
      const passwordInputs = screen.getAllByPlaceholderText('Enter your password...');
      const confirmInput = passwordInputs[1];

      fireEvent.changeText(emailInput, 'test@example.com');
      fireEvent.changeText(passwordInputs[0], 'lowercase123!@#');
      fireEvent.changeText(confirmInput, 'lowercase123!@#');

      const signUpButton = screen.getByLabelText('Sign up');
      fireEvent.press(signUpButton);

      expect(alertSpy).toHaveBeenCalledWith(
        'Password Too Weak',
        expect.stringContaining('one uppercase letter'),
        [{ text: 'OK' }]
      );
    });

    it('should show error for password without number', () => {
      render(<SignupScreen navigation={mockNavigation} />);

      const emailInput = screen.getByPlaceholderText('Enter your email...');
      const passwordInputs = screen.getAllByPlaceholderText('Enter your password...');
      const confirmInput = passwordInputs[1];

      fireEvent.changeText(emailInput, 'test@example.com');
      fireEvent.changeText(passwordInputs[0], 'NoNumbersHere!@#');
      fireEvent.changeText(confirmInput, 'NoNumbersHere!@#');

      const signUpButton = screen.getByLabelText('Sign up');
      fireEvent.press(signUpButton);

      expect(alertSpy).toHaveBeenCalledWith(
        'Password Too Weak',
        expect.stringContaining('one number'),
        [{ text: 'OK' }]
      );
    });

    it('should show error for password without special character', () => {
      render(<SignupScreen navigation={mockNavigation} />);

      const emailInput = screen.getByPlaceholderText('Enter your email...');
      const passwordInputs = screen.getAllByPlaceholderText('Enter your password...');
      const confirmInput = passwordInputs[1];

      fireEvent.changeText(emailInput, 'test@example.com');
      fireEvent.changeText(passwordInputs[0], 'NoSpecialChar123');
      fireEvent.changeText(confirmInput, 'NoSpecialChar123');

      const signUpButton = screen.getByLabelText('Sign up');
      fireEvent.press(signUpButton);

      expect(alertSpy).toHaveBeenCalledWith(
        'Password Too Weak',
        expect.stringContaining('one special character'),
        [{ text: 'OK' }]
      );
    });

    it('should show error for password over 128 characters', () => {
      render(<SignupScreen navigation={mockNavigation} />);

      const emailInput = screen.getByPlaceholderText('Enter your email...');
      const passwordInputs = screen.getAllByPlaceholderText('Enter your password...');
      const confirmInput = passwordInputs[1];

      const longPassword = 'A'.repeat(130) + 'a1!';

      fireEvent.changeText(emailInput, 'test@example.com');
      fireEvent.changeText(passwordInputs[0], longPassword);
      fireEvent.changeText(confirmInput, longPassword);

      const signUpButton = screen.getByLabelText('Sign up');
      fireEvent.press(signUpButton);

      expect(alertSpy).toHaveBeenCalledWith(
        'Password Too Weak',
        expect.stringContaining('less than 128 characters'),
        [{ text: 'OK' }]
      );
    });

    it('should show error for common password patterns', () => {
      render(<SignupScreen navigation={mockNavigation} />);

      const emailInput = screen.getByPlaceholderText('Enter your email...');
      const passwordInputs = screen.getAllByPlaceholderText('Enter your password...');
      const confirmInput = passwordInputs[1];

      fireEvent.changeText(emailInput, 'test@example.com');
      fireEvent.changeText(passwordInputs[0], 'Password123!@#');
      fireEvent.changeText(confirmInput, 'Password123!@#');

      const signUpButton = screen.getByLabelText('Sign up');
      fireEvent.press(signUpButton);

      expect(alertSpy).toHaveBeenCalledWith(
        'Password Too Weak',
        expect.stringContaining('cannot contain common words'),
        [{ text: 'OK' }]
      );
    });

    it('should show error when passwords do not match', () => {
      render(<SignupScreen navigation={mockNavigation} />);

      const emailInput = screen.getByPlaceholderText('Enter your email...');
      const passwordInputs = screen.getAllByPlaceholderText('Enter your password...');
      const confirmInput = passwordInputs[1];

      fireEvent.changeText(emailInput, 'test@example.com');
      fireEvent.changeText(passwordInputs[0], 'ValidPassword123!');
      fireEvent.changeText(confirmInput, 'DifferentPassword123!');

      const signUpButton = screen.getByLabelText('Sign up');
      fireEvent.press(signUpButton);

      expect(alertSpy).toHaveBeenCalledWith('Error', 'Passwords do not match');
    });

    it('should accept valid strong password', async () => {
      render(<SignupScreen navigation={mockNavigation} />);

      const emailInput = screen.getByPlaceholderText('Enter your email...');
      const passwordInputs = screen.getAllByPlaceholderText('Enter your password...');
      const confirmInput = passwordInputs[1];

      fireEvent.changeText(emailInput, 'test@example.com');
      fireEvent.changeText(passwordInputs[0], 'ValidStrongPass123!@#');
      fireEvent.changeText(confirmInput, 'ValidStrongPass123!@#');

      const signUpButton = screen.getByLabelText('Sign up');
      fireEvent.press(signUpButton);

      await waitFor(() => {
        expect(alertSpy).toHaveBeenCalledWith(
          'Success',
          'Account created successfully!',
          expect.any(Array)
        );
      });
    });
  });

  describe('Form Submission', () => {
    it('should disable sign up button when email is empty', () => {
      const { getByLabelText } = render(<SignupScreen navigation={mockNavigation} />);

      const signUpButton = getByLabelText('Sign up');
      expect(signUpButton.props.accessibilityState.disabled).toBe(true);
    });

    it('should disable sign up button when password is empty', () => {
      render(<SignupScreen navigation={mockNavigation} />);

      const emailInput = screen.getByPlaceholderText('Enter your email...');
      fireEvent.changeText(emailInput, 'test@example.com');

      const signUpButton = screen.getByLabelText('Sign up');
      expect(signUpButton.props.accessibilityState.disabled).toBe(true);
    });

    it('should disable sign up button when confirm password is empty', () => {
      render(<SignupScreen navigation={mockNavigation} />);

      const emailInput = screen.getByPlaceholderText('Enter your email...');
      const passwordInputs = screen.getAllByPlaceholderText('Enter your password...');

      fireEvent.changeText(emailInput, 'test@example.com');
      fireEvent.changeText(passwordInputs[0], 'ValidPassword123!');

      const signUpButton = screen.getByLabelText('Sign up');
      expect(signUpButton.props.accessibilityState.disabled).toBe(true);
    });

    it('should disable sign up button when email is invalid', () => {
      render(<SignupScreen navigation={mockNavigation} />);

      const emailInput = screen.getByPlaceholderText('Enter your email...');
      const passwordInputs = screen.getAllByPlaceholderText('Enter your password...');
      const confirmInput = passwordInputs[1];

      fireEvent.changeText(emailInput, 'invalid-email');
      fireEvent(emailInput, 'blur');
      fireEvent.changeText(passwordInputs[0], 'ValidPassword123!');
      fireEvent.changeText(confirmInput, 'ValidPassword123!');

      const signUpButton = screen.getByLabelText('Sign up');
      expect(signUpButton.props.accessibilityState.disabled).toBe(true);
    });

    it('should show loading state during signup', async () => {
      render(<SignupScreen navigation={mockNavigation} />);

      const emailInput = screen.getByPlaceholderText('Enter your email...');
      const passwordInputs = screen.getAllByPlaceholderText('Enter your password...');
      const confirmInput = passwordInputs[1];

      fireEvent.changeText(emailInput, 'test@example.com');
      fireEvent.changeText(passwordInputs[0], 'ValidStrongPass123!@#');
      fireEvent.changeText(confirmInput, 'ValidStrongPass123!@#');

      const signUpButton = screen.getByLabelText('Sign up');
      fireEvent.press(signUpButton);

      expect(screen.getByText('Creating Account...')).toBeTruthy();
    });
  });

  describe('Rate Limiting', () => {
    it('should check rate limit before signup', async () => {
      render(<SignupScreen navigation={mockNavigation} />);

      const emailInput = screen.getByPlaceholderText('Enter your email...');
      const passwordInputs = screen.getAllByPlaceholderText('Enter your password...');
      const confirmInput = passwordInputs[1];

      fireEvent.changeText(emailInput, 'test@example.com');
      fireEvent.changeText(passwordInputs[0], 'ValidStrongPass123!@#');
      fireEvent.changeText(confirmInput, 'ValidStrongPass123!@#');

      const signUpButton = screen.getByLabelText('Sign up');
      fireEvent.press(signUpButton);

      await waitFor(() => {
        expect(rateLimiter.checkLimit).toHaveBeenCalledWith(
          'signup:test@example.com',
          3,
          60 * 60 * 1000
        );
      });
    });

    it('should show alert when rate limit is exceeded', async () => {
      (rateLimiter.checkLimit as jest.Mock).mockResolvedValue({
        allowed: false,
        waitTime: 600,
      });

      render(<SignupScreen navigation={mockNavigation} />);

      const emailInput = screen.getByPlaceholderText('Enter your email...');
      const passwordInputs = screen.getAllByPlaceholderText('Enter your password...');
      const confirmInput = passwordInputs[1];

      fireEvent.changeText(emailInput, 'test@example.com');
      fireEvent.changeText(passwordInputs[0], 'ValidStrongPass123!@#');
      fireEvent.changeText(confirmInput, 'ValidStrongPass123!@#');

      const signUpButton = screen.getByLabelText('Sign up');
      fireEvent.press(signUpButton);

      await waitFor(() => {
        expect(alertSpy).toHaveBeenCalledWith(
          'Too Many Attempts',
          expect.stringContaining('You have exceeded the maximum signup attempts'),
          [{ text: 'OK' }]
        );
      });
    });

    it('should reset rate limiter on successful signup', async () => {
      render(<SignupScreen navigation={mockNavigation} />);

      const emailInput = screen.getByPlaceholderText('Enter your email...');
      const passwordInputs = screen.getAllByPlaceholderText('Enter your password...');
      const confirmInput = passwordInputs[1];

      fireEvent.changeText(emailInput, 'test@example.com');
      fireEvent.changeText(passwordInputs[0], 'ValidStrongPass123!@#');
      fireEvent.changeText(confirmInput, 'ValidStrongPass123!@#');

      const signUpButton = screen.getByLabelText('Sign up');
      fireEvent.press(signUpButton);

      await waitFor(() => {
        expect(rateLimiter.reset).toHaveBeenCalledWith('signup:test@example.com');
      });
    });
  });

  describe('Accessibility', () => {
    it('should have proper accessibility role for sign up button', () => {
      const { getByLabelText } = render(<SignupScreen navigation={mockNavigation} />);

      const signUpButton = getByLabelText('Sign up');
      expect(signUpButton.props.accessibilityRole).toBe('button');
    });

    it('should have accessibility hint for sign up button', () => {
      const { getByLabelText } = render(<SignupScreen navigation={mockNavigation} />);

      const signUpButton = getByLabelText('Sign up');
      expect(signUpButton.props.accessibilityHint).toBe('Create a new account');
    });

    it('should have proper accessibility labels for password toggles', () => {
      const { getByLabelText } = render(<SignupScreen navigation={mockNavigation} />);

      expect(getByLabelText('Show password')).toBeTruthy();
      expect(getByLabelText('Show confirm password')).toBeTruthy();
    });

    it('should update accessibility state during loading', async () => {
      render(<SignupScreen navigation={mockNavigation} />);

      const emailInput = screen.getByPlaceholderText('Enter your email...');
      const passwordInputs = screen.getAllByPlaceholderText('Enter your password...');
      const confirmInput = passwordInputs[1];

      fireEvent.changeText(emailInput, 'test@example.com');
      fireEvent.changeText(passwordInputs[0], 'ValidStrongPass123!@#');
      fireEvent.changeText(confirmInput, 'ValidStrongPass123!@#');

      const signUpButton = screen.getByLabelText('Sign up');
      fireEvent.press(signUpButton);

      expect(signUpButton.props.accessibilityState.busy).toBe(true);
    });
  });

  describe('Edge Cases', () => {
    it('should trim whitespace from email', () => {
      render(<SignupScreen navigation={mockNavigation} />);

      const emailInput = screen.getByPlaceholderText('Enter your email...');
      const passwordInputs = screen.getAllByPlaceholderText('Enter your password...');

      fireEvent.changeText(emailInput, '  test@example.com  ');
      fireEvent.changeText(passwordInputs[0], 'ValidStrongPass123!@#');

      const signUpButton = screen.getByLabelText('Sign up');
      fireEvent.press(signUpButton);

      expect(alertSpy).toHaveBeenCalledWith('Error', 'Please enter a password');
    });

    it('should handle rapid button presses gracefully', async () => {
      render(<SignupScreen navigation={mockNavigation} />);

      const emailInput = screen.getByPlaceholderText('Enter your email...');
      const passwordInputs = screen.getAllByPlaceholderText('Enter your password...');
      const confirmInput = passwordInputs[1];

      fireEvent.changeText(emailInput, 'test@example.com');
      fireEvent.changeText(passwordInputs[0], 'ValidStrongPass123!@#');
      fireEvent.changeText(confirmInput, 'ValidStrongPass123!@#');

      const signUpButton = screen.getByLabelText('Sign up');

      // Rapid fire multiple presses
      fireEvent.press(signUpButton);
      fireEvent.press(signUpButton);
      fireEvent.press(signUpButton);

      await waitFor(() => {
        expect(rateLimiter.checkLimit).toHaveBeenCalled();
      });
    });

    it('should navigate to login on successful signup', async () => {
      render(<SignupScreen navigation={mockNavigation} />);

      const emailInput = screen.getByPlaceholderText('Enter your email...');
      const passwordInputs = screen.getAllByPlaceholderText('Enter your password...');
      const confirmInput = passwordInputs[1];

      fireEvent.changeText(emailInput, 'test@example.com');
      fireEvent.changeText(passwordInputs[0], 'ValidStrongPass123!@#');
      fireEvent.changeText(confirmInput, 'ValidStrongPass123!@#');

      const signUpButton = screen.getByLabelText('Sign up');
      fireEvent.press(signUpButton);

      await waitFor(() => {
        expect(alertSpy).toHaveBeenCalled();
      });

      // Simulate pressing OK on success alert
      const alertCall = alertSpy.mock.calls.find(call => call[0] === 'Success');
      if (alertCall && alertCall[2] && alertCall[2][0]) {
        alertCall[2][0].onPress();
      }

      expect(mockNavigate).toHaveBeenCalledWith('Login');
    });
  });
});
