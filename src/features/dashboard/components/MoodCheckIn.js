/**
 * MoodCheckIn Component
 * Quick mood check-in for dashboard
 */

import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import PropTypes from 'prop-types';
import { useTheme } from "@theme/ThemeProvider";

const MoodCheckIn = ({
  currentMood,
  onCheckIn,
  accessibilityLabel = "Mood check-in component",
  accessibilityHint = "Select your current mood to track your emotional state",
  testID = "mood-check-in",
  disabled = false,
}) => {
  const { theme } = useTheme();

  const handlePress = () => {
    if (!disabled && onCheckIn) {
      onCheckIn(currentMood || 'happy'); // Default mood for demo
    }
  };

  return (
    <View
      style={styles.container}
      testID={testID}
      accessibilityLabel={accessibilityLabel}
      accessibilityHint={accessibilityHint}
      accessibilityRole="button"
      accessible={true}
      accessibilityState={{ disabled }}
    >
      <TouchableOpacity
        style={[
          styles.button,
          disabled && styles.disabledButton,
          {
            backgroundColor: theme.colors.therapeutic.nurturing[500] || '#10b981',
          },
        ]}
        onPress={handlePress}
        disabled={disabled}
        testID="mood-check-in-button"
        accessibilityLabel="Log your current mood"
        accessibilityHint="Press to record how you're feeling right now"
        accessibilityRole="button"
        accessibilityState={{ disabled }}
      >
        <Text style={styles.buttonText}>
          {currentMood ? `Feeling ${currentMood}` : 'How are you feeling?'}
        </Text>
        <Text style={styles.subText}>
          {currentMood ? 'Tap to update' : 'Tap to log mood'}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    margin: 16,
  },
  button: {
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 60,
    minWidth: 60,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  disabledButton: {
    opacity: 0.6,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
  },
  subText: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 14,
    marginTop: 4,
    textAlign: 'center',
  },
});

MoodCheckIn.propTypes = {
  currentMood: PropTypes.string,
  onCheckIn: PropTypes.func,
  accessibilityLabel: PropTypes.string,
  accessibilityHint: PropTypes.string,
  testID: PropTypes.string,
  disabled: PropTypes.bool,
};

export default MoodCheckIn;
