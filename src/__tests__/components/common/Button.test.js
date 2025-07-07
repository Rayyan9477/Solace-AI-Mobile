import React from 'react';
import { render, fireEvent, act } from '@testing-library/react-native';
import * as Haptics from 'expo-haptics';
import Button from '../../../components/common/Button';
import { ThemeProvider } from '../../../contexts/ThemeContext';

jest.mock('expo-haptics');

describe('Button Component', () => {
  const mockOnPress = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders correctly with default props', async () => {
    const { getByText, getByTestId } = render(
      <ThemeProvider>
        <Button title="Test Button" onPress={mockOnPress} />
      </ThemeProvider>
    );

    await act(async () => {
      const button = getByTestId('button-Test Button');
      const buttonText = getByText('Test Button');

      expect(button).toBeTruthy();
      expect(buttonText).toBeTruthy();
      expect(button.props.accessibilityState.disabled).toBe(false);
    });
  });

  it('calls onPress and triggers haptics when pressed', async () => {
    const { getByTestId } = render(
      <ThemeProvider>
        <Button title="Test Button" onPress={mockOnPress} />
      </ThemeProvider>
    );

    await act(async () => {
      const button = getByTestId('button-Test Button');
      fireEvent.press(button);
    });

    expect(mockOnPress).toHaveBeenCalledTimes(1);
    expect(Haptics.impactAsync).toHaveBeenCalledWith(
      Haptics.ImpactFeedbackStyle.Medium
    );
  });

  it('disables the button when disabled prop is true', async () => {
    const { getByTestId } = render(
      <ThemeProvider>
        <Button title="Test Button" onPress={mockOnPress} disabled />
      </ThemeProvider>
    );

    await act(async () => {
      const button = getByTestId('button-Test Button');
      expect(button.props.accessibilityState.disabled).toBe(true);
      fireEvent.press(button);
    });

    expect(mockOnPress).not.toHaveBeenCalled();
    expect(Haptics.impactAsync).not.toHaveBeenCalled();
  });

  it('applies fullWidth style when fullWidth prop is true', async () => {
    const { getByTestId } = render(
      <ThemeProvider>
        <Button title="Test Button" onPress={mockOnPress} fullWidth />
      </ThemeProvider>
    );

    await act(async () => {
      const button = getByTestId('button-Test Button');
      const styles = button.props.style.filter(style => style !== false);
      const hasFullWidth = styles.some(style => style && style.width === '100%');
      expect(hasFullWidth).toBe(true);
    });
  });

  it('renders different variants correctly', async () => {
    const variants = ['primary', 'secondary', 'outline', 'text'];

    for (const variant of variants) {
      const { getByTestId } = render(
        <ThemeProvider>
          <Button
            title={`${variant} Button`}
            onPress={mockOnPress}
            variant={variant}
          />
        </ThemeProvider>
      );

      await act(async () => {
        const button = getByTestId(`button-${variant} Button`);
        expect(button).toBeTruthy();
      });
    }
  });

  it('renders different sizes correctly', async () => {
    const sizes = ['small', 'medium', 'large'];

    for (const size of sizes) {
      const { getByTestId } = render(
        <ThemeProvider>
          <Button
            title={`${size} Button`}
            onPress={mockOnPress}
            size={size}
          />
        </ThemeProvider>
      );

      await act(async () => {
        const button = getByTestId(`button-${size} Button`);
        expect(button).toBeTruthy();
      });
    }
  });

  it('sets correct accessibility props', async () => {
    const { getByTestId } = render(
      <ThemeProvider>
        <Button
          title="Accessible Button"
          onPress={mockOnPress}
          accessibilityLabel="Custom Label"
          accessibilityHint="Custom Hint"
        />
      </ThemeProvider>
    );

    await act(async () => {
      const button = getByTestId('button-Accessible Button');
      expect(button.props.accessibilityLabel).toBe('Custom Label');
      expect(button.props.accessibilityHint).toBe('Custom Hint');
    });
  });
});
