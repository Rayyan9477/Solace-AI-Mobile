import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Slider from '@react-native-community/slider';
import { useTheme } from '../../contexts/ThemeContext';
import { createSliderAccessibility, announceForAccessibility } from '../../utils/accessibility';
import hapticFeedback from '../../utils/hapticFeedback';
import { colors, typography, spacing, borderRadius } from '../../styles/theme';

const IntensitySlider = ({ value, onValueChange }) => {
  const { theme, isScreenReaderEnabled, accessibilitySettings } = useTheme();

  const handleValueChange = (newValue) => {
    onValueChange(newValue);
    
    // Trigger haptic feedback for intensity changes
    if (accessibilitySettings.hapticFeedback !== false) {
      hapticFeedback.intensityChanged(newValue);
    }
    
    // Announce changes for screen reader users
    if (isScreenReaderEnabled) {
      const label = getIntensityLabel(newValue);
      announceForAccessibility(`Intensity changed to ${label}, ${newValue} out of 5`);
    }
  };
  

  const getIntensityLabel = (value) => {
    if (value <= 1) return 'Very Low';
    if (value <= 2) return 'Low';
    if (value <= 3) return 'Moderate';
    if (value <= 4) return 'High';
    return 'Very High';
  };

  const getIntensityColor = (value) => {
    if (value <= 1) return theme.colors.success[300];
    if (value <= 2) return theme.colors.success[500];
    if (value <= 3) return theme.colors.warning[400];
    if (value <= 4) return theme.colors.error[400];
    return theme.colors.error[600];
  };

  return (
    <View style={styles.container}>
      <View 
        style={styles.valueContainer}
        {...createSliderAccessibility(
          'Mood intensity level',
          value,
          1,
          5,
          1
        )}
      >
        <Text 
          style={[
            styles.valueText,
            { color: getIntensityColor(value) }
          ]}
          accessibilityRole="text"
          accessibilityLabel={`Current intensity: ${getIntensityLabel(value)}`}
        >
          {getIntensityLabel(value)}
        </Text>
        <Text 
          style={[
            styles.valueNumber,
            { color: getIntensityColor(value) }
          ]}
          accessibilityRole="text"
          accessibilityLabel={`${value} out of 5`}
        >
          {value}/5
        </Text>
      </View>
      
      <Slider
        style={styles.slider}
        minimumValue={1}
        maximumValue={5}
        step={1}
        value={value}
        onValueChange={handleValueChange}
        minimumTrackTintColor={getIntensityColor(value)}
        maximumTrackTintColor={theme.colors.gray[300]}
        thumbStyle={[styles.thumb, { backgroundColor: getIntensityColor(value) }]}
        trackStyle={styles.track}
        accessibilityLabel="Mood intensity slider"
        accessibilityHint="Swipe left or right to adjust intensity from 1 to 5"
        accessibilityRole="adjustable"
        accessibilityValue={{
          min: 1,
          max: 5,
          now: value,
          text: `${getIntensityLabel(value)}, ${value} out of 5`
        }}
      />
      
      <View style={styles.labelsContainer}>
        <Text 
          style={[styles.label, { color: theme.colors.text.secondary }]}
          accessibilityRole="text"
        >
          Very Low
        </Text>
        <Text 
          style={[styles.label, { color: theme.colors.text.secondary }]}
          accessibilityRole="text"
        >
          Very High
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  valueContainer: {
    alignItems: 'center',
    marginBottom: theme.spacing[4],
  },
  valueText: {
    fontSize: theme.typography.sizes.xl,
    fontWeight: '600',
    lineHeight: theme.typography.lineHeights.xl,
    marginBottom: theme.spacing[1],
  },
  valueNumber: {
    fontSize: theme.typography.sizes.lg,
    fontWeight: '500',
    lineHeight: theme.typography.lineHeights.lg,
  },
  slider: {
    width: '100%',
    height: 44,
    marginVertical: theme.spacing[3],
  },
  thumb: {
    width: 44, height: 44,
    borderRadius: 12,
  },
  track: {
    height: 44,
    borderRadius: 3,
  },
  labelsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: theme.spacing[2],
  },
  label: {
    fontSize: theme.typography.sizes.sm,
    fontWeight: '400',
    lineHeight: theme.typography.lineHeights.sm,
  },
});

export default IntensitySlider;
