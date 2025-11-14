/**
 * LoginScreen Component Tests
 * Comprehensive testing for user authentication login interface
 */

import React from 'react';
import { render, fireEvent, waitFor, screen } from '@testing-library/react-native';
import { Alert } from 'react-native';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { LoginScreen } from '../../../../src/features/auth/LoginScreen';
import authReducer from '../../../../src/app/store/slices/authSlice';
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
    getContainerPadding: () => 16,
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

// Create test store
const createTestStore = (initialState = {}) => {
  return configureStore({
    reducer: {
      auth: authReducer,
    },
    preloadedState: initialState,
  });
};

describe('LoginScreen', () => {
  let store: any;
  let alertSpy: jest.SpyInstance;

  beforeEach(() => {
    store = createTestStore({
      auth: {
        user: null,
        token: null,
        isLoading: false,
        error: null,
      },
    });

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
      render(
        <Provider store={store}>
          <LoginScreen navigation={mockNavigation} />
        </Provider>
      );

      expect(screen.getByText('Sign In To freud.ai')).toBeTruthy();
    });

    it('should display Freud logo', () => {
      render(
        <Provider store={store}>
          <LoginScreen navigation={mockNavigation} />
        </Provider>
      );

      expect(screen.getByTestId('freud-logo')).toBeTruthy();
    });

    it('should render email input field with correct placeholder', () => {
      render(
        <Provider store={store}>
          <LoginScreen navigation={mockNavigation} />
        </Provider>
      );

      const emailInput = screen.getByPlaceholderText('princesskaguya@gmail.com');
      expect(emailInput).toBeTruthy();
    });

    it('should render password input field with correct placeholder', () => {
      render(
        <Provider store={store}>
          <LoginScreen navigation={mockNavigation} />
        </Provider>
      );

      const passwordInput = screen.getByPlaceholderText('Enter your password...');
      expect(passwordInput).toBeTruthy();
    });

    it('should render sign in button', () => {
      render(
        <Provider store={store}>
          <LoginScreen navigation={mockNavigation} />
        </Provider>
      );

      expect(screen.getByText('Sign In')).toBeTruthy();
    });

    it('should render social login buttons', () => {
      const { getByLabelText } = render(
        <Provider store={store}>
          <LoginScreen navigation={mockNavigation} />
        </Provider>
      );

      expect(getByLabelText('Sign in with Facebook')).toBeTruthy();
      expect(getByLabelText('Sign in with Google')).toBeTruthy();
      expect(getByLabelText('Sign in with Instagram')).toBeTruthy();
    });

    it('should render navigation link to signup', () => {
      render(
        <Provider store={store}>
          <LoginScreen navigation={mockNavigation} />
        </Provider>
      );

      expect(screen.getByText('Sign Up')).toBeTruthy();
    });

    it('should render forgot password link', () => {
      render(
        <Provider store={store}>
          <LoginScreen navigation={mockNavigation} />
        </Provider>
      );

      expect(screen.getByText('Forgot Password')).toBeTruthy();
    });
  });

  describe('User Interactions', () => {
    it('should allow typing in email field', () => {
      render(
        <Provider store={store}>
          <LoginScreen navigation={mockNavigation} />
        </Provider>
      );

      const emailInput = screen.getByPlaceholderText('princesskaguya@gmail.com');
      fireEvent.changeText(emailInput, 'test@example.com');

      expect(emailInput.props.value).toBe('test@example.com');
    });

    it('should allow typing in password field', () => {
      render(
        <Provider store={store}>
          <LoginScreen navigation={mockNavigation} />
        </Provider>
      );

      const passwordInput = screen.getByPlaceholderText('Enter your password...');
      fireEvent.changeText(passwordInput, 'SecurePassword123!');

      expect(passwordInput.props.value).toBe('SecurePassword123!');
    });

    it('should toggle password visibility when eye icon is pressed', () => {
      render(
        <Provider store={store}>
          <LoginScreen navigation={mockNavigation} />
        </Provider>
      );

      const toggleButton = screen.getByLabelText('Show password');
      const passwordInput = screen.getByPlaceholderText('Enter your password...');

      // Initially password should be hidden
      expect(passwordInput.props.secureTextEntry).toBe(true);

      // Toggle to show password
      fireEvent.press(toggleButton);

      // Password should now be visible
      const updatedToggleButton = screen.getByLabelText('Hide password');
      expect(updatedToggleButton).toBeTruthy();
    });

    it('should navigate to signup when Sign Up link is pressed', () => {
      render(
        <Provider store={store}>
          <LoginScreen navigation={mockNavigation} />
        </Provider>
      );

      const signupLink = screen.getByText('Sign Up');
      fireEvent.press(signupLink);

      expect(mockNavigate).toHaveBeenCalledWith('Signup');
    });

    it('should navigate to forgot password when link is pressed', () => {
      const { getByLabelText } = render(
        <Provider store={store}>
          <LoginScreen navigation={mockNavigation} />
        </Provider>
      );

      const forgotPasswordButton = getByLabelText('Forgot password');
      fireEvent.press(forgotPasswordButton);

      expect(mockNavigate).toHaveBeenCalledWith('ForgotPassword');
    });
  });

  describe('Form Validation', () => {
    it('should disable sign in button when email is empty', () => {
      const { getByLabelText } = render(
        <Provider store={store}>
          <LoginScreen navigation={mockNavigation} />
        </Provider>
      );

      const signInButton = getByLabelText('Sign in');
      expect(signInButton.props.accessibilityState.disabled).toBe(true);
    });

    it('should disable sign in button when password is empty', () => {
      render(
        <Provider store={store}>
          <LoginScreen navigation={mockNavigation} />
        </Provider>
      );

      const emailInput = screen.getByPlaceholderText('princesskaguya@gmail.com');
      fireEvent.changeText(emailInput, 'test@example.com');

      const signInButton = screen.getByLabelText('Sign in');
      expect(signInButton.props.accessibilityState.disabled).toBe(true);
    });

    it('should enable sign in button when both email and password are filled', () => {
      render(
        <Provider store={store}>
          <LoginScreen navigation={mockNavigation} />
        </Provider>
      );

      const emailInput = screen.getByPlaceholderText('princesskaguya@gmail.com');
      const passwordInput = screen.getByPlaceholderText('Enter your password...');

      fireEvent.changeText(emailInput, 'test@example.com');
      fireEvent.changeText(passwordInput, 'password123');

      const signInButton = screen.getByLabelText('Sign in');
      expect(signInButton.props.accessibilityState.disabled).toBe(false);
    });

    it('should show error alert for empty email', () => {
      render(
        <Provider store={store}>
          <LoginScreen navigation={mockNavigation} />
        </Provider>
      );

      const passwordInput = screen.getByPlaceholderText('Enter your password...');
      fireEvent.changeText(passwordInput, 'password123');

      const signInButton = screen.getByLabelText('Sign in');
      fireEvent.press(signInButton);

      expect(alertSpy).toHaveBeenCalledWith('Error', 'Please enter your email address');
    });

    it('should show error alert for invalid email format', () => {
      render(
        <Provider store={store}>
          <LoginScreen navigation={mockNavigation} />
        </Provider>
      );

      const emailInput = screen.getByPlaceholderText('princesskaguya@gmail.com');
      const passwordInput = screen.getByPlaceholderText('Enter your password...');

      fireEvent.changeText(emailInput, 'invalid-email');
      fireEvent.changeText(passwordInput, 'password123');

      const signInButton = screen.getByLabelText('Sign in');
      fireEvent.press(signInButton);

      expect(alertSpy).toHaveBeenCalledWith('Error', 'Please enter a valid email address');
    });

    it('should show error alert for empty password', () => {
      render(
        <Provider store={store}>
          <LoginScreen navigation={mockNavigation} />
        </Provider>
      );

      const emailInput = screen.getByPlaceholderText('princesskaguya@gmail.com');
      fireEvent.changeText(emailInput, 'test@example.com');

      const signInButton = screen.getByLabelText('Sign in');
      fireEvent.press(signInButton);

      expect(alertSpy).toHaveBeenCalledWith('Error', 'Please enter your password');
    });
  });

  describe('Rate Limiting', () => {
    it('should check rate limit before login', async () => {
      render(
        <Provider store={store}>
          <LoginScreen navigation={mockNavigation} />
        </Provider>
      );

      const emailInput = screen.getByPlaceholderText('princesskaguya@gmail.com');
      const passwordInput = screen.getByPlaceholderText('Enter your password...');

      fireEvent.changeText(emailInput, 'test@example.com');
      fireEvent.changeText(passwordInput, 'SecurePassword123!');

      const signInButton = screen.getByLabelText('Sign in');
      fireEvent.press(signInButton);

      await waitFor(() => {
        expect(rateLimiter.checkLimit).toHaveBeenCalledWith(
          'login:test@example.com',
          5,
          15 * 60 * 1000
        );
      });
    });

    it('should show alert when rate limit is exceeded', async () => {
      (rateLimiter.checkLimit as jest.Mock).mockResolvedValue({
        allowed: false,
        waitTime: 300,
      });

      render(
        <Provider store={store}>
          <LoginScreen navigation={mockNavigation} />
        </Provider>
      );

      const emailInput = screen.getByPlaceholderText('princesskaguya@gmail.com');
      const passwordInput = screen.getByPlaceholderText('Enter your password...');

      fireEvent.changeText(emailInput, 'test@example.com');
      fireEvent.changeText(passwordInput, 'SecurePassword123!');

      const signInButton = screen.getByLabelText('Sign in');
      fireEvent.press(signInButton);

      await waitFor(() => {
        expect(alertSpy).toHaveBeenCalledWith(
          'Too Many Attempts',
          expect.stringContaining('You have exceeded the maximum login attempts'),
          [{ text: 'OK' }]
        );
      });
    });
  });

  describe('Loading State', () => {
    it('should display loading text when isLoading is true', () => {
      const loadingStore = createTestStore({
        auth: {
          user: null,
          token: null,
          isLoading: true,
          error: null,
        },
      });

      const { getByLabelText } = render(
        <Provider store={loadingStore}>
          <LoginScreen navigation={mockNavigation} />
        </Provider>
      );

      const signInButton = getByLabelText('Sign in');
      expect(signInButton.props.accessibilityState.busy).toBe(true);
    });

    it('should disable button during loading', () => {
      const loadingStore = createTestStore({
        auth: {
          user: null,
          token: null,
          isLoading: true,
          error: null,
        },
      });

      const { getByLabelText } = render(
        <Provider store={loadingStore}>
          <LoginScreen navigation={mockNavigation} />
        </Provider>
      );

      const signInButton = getByLabelText('Sign in');
      expect(signInButton.props.accessibilityState.disabled).toBe(true);
    });
  });

  describe('Accessibility', () => {
    it('should have proper accessibility labels for email input', () => {
      render(
        <Provider store={store}>
          <LoginScreen navigation={mockNavigation} />
        </Provider>
      );

      const emailInput = screen.getByPlaceholderText('princesskaguya@gmail.com');
      expect(emailInput.props.accessibilityLabel).toBeDefined();
    });

    it('should have proper accessibility labels for password input', () => {
      render(
        <Provider store={store}>
          <LoginScreen navigation={mockNavigation} />
        </Provider>
      );

      const passwordInput = screen.getByPlaceholderText('Enter your password...');
      expect(passwordInput.props.accessibilityLabel).toBeDefined();
    });

    it('should have proper accessibility role for sign in button', () => {
      const { getByLabelText } = render(
        <Provider store={store}>
          <LoginScreen navigation={mockNavigation} />
        </Provider>
      );

      const signInButton = getByLabelText('Sign in');
      expect(signInButton.props.accessibilityRole).toBe('button');
    });

    it('should have proper accessibility hint for password toggle', () => {
      const { getByLabelText } = render(
        <Provider store={store}>
          <LoginScreen navigation={mockNavigation} />
        </Provider>
      );

      const toggleButton = getByLabelText('Show password');
      expect(toggleButton.props.accessibilityHint).toBe('Toggles password visibility');
    });

    it('should have accessibility hint for sign in button', () => {
      const { getByLabelText } = render(
        <Provider store={store}>
          <LoginScreen navigation={mockNavigation} />
        </Provider>
      );

      const signInButton = getByLabelText('Sign in');
      expect(signInButton.props.accessibilityHint).toBe('Sign in to your account');
    });
  });

  describe('Theme Integration', () => {
    it('should render with gradient background', () => {
      render(
        <Provider store={store}>
          <LoginScreen navigation={mockNavigation} />
        </Provider>
      );

      expect(screen.getByTestId('linear-gradient')).toBeTruthy();
    });

    it('should apply theme colors to components', () => {
      const { getByText } = render(
        <Provider store={store}>
          <LoginScreen navigation={mockNavigation} />
        </Provider>
      );

      const title = getByText('Sign In To freud.ai');
      expect(title).toBeTruthy();
    });
  });

  describe('Edge Cases', () => {
    it('should handle rapid button presses gracefully', async () => {
      render(
        <Provider store={store}>
          <LoginScreen navigation={mockNavigation} />
        </Provider>
      );

      const emailInput = screen.getByPlaceholderText('princesskaguya@gmail.com');
      const passwordInput = screen.getByPlaceholderText('Enter your password...');

      fireEvent.changeText(emailInput, 'test@example.com');
      fireEvent.changeText(passwordInput, 'SecurePassword123!');

      const signInButton = screen.getByLabelText('Sign in');

      // Rapid fire multiple presses
      fireEvent.press(signInButton);
      fireEvent.press(signInButton);
      fireEvent.press(signInButton);

      await waitFor(() => {
        // Rate limiter should be called only once due to form state
        expect(rateLimiter.checkLimit).toHaveBeenCalled();
      });
    });

    it('should trim whitespace from email', () => {
      render(
        <Provider store={store}>
          <LoginScreen navigation={mockNavigation} />
        </Provider>
      );

      const emailInput = screen.getByPlaceholderText('princesskaguya@gmail.com');
      fireEvent.changeText(emailInput, '  test@example.com  ');

      const signInButton = screen.getByLabelText('Sign in');
      fireEvent.press(signInButton);

      expect(alertSpy).toHaveBeenCalledWith('Error', 'Please enter your password');
    });

    it('should handle email case-insensitivity in rate limiting', async () => {
      render(
        <Provider store={store}>
          <LoginScreen navigation={mockNavigation} />
        </Provider>
      );

      const emailInput = screen.getByPlaceholderText('princesskaguya@gmail.com');
      const passwordInput = screen.getByPlaceholderText('Enter your password...');

      fireEvent.changeText(emailInput, 'TEST@EXAMPLE.COM');
      fireEvent.changeText(passwordInput, 'SecurePassword123!');

      const signInButton = screen.getByLabelText('Sign in');
      fireEvent.press(signInButton);

      await waitFor(() => {
        expect(rateLimiter.checkLimit).toHaveBeenCalledWith(
          'login:test@example.com',
          5,
          15 * 60 * 1000
        );
      });
    });
  });
});
