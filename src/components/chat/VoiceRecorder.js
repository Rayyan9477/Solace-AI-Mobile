import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated } from 'react-native';
import { useTheme } from '../../contexts/ThemeContext';

const VoiceRecorder = ({
  isRecording = false,
  onStartRecording,
  onStopRecording,
  onCancelRecording,
  disabled = false,
  duration = 0,
  maxDuration = 60,
  style,
}) => {
  const { theme, isReducedMotionEnabled } = useTheme();
  const [animatedValue] = useState(new Animated.Value(1));

  useEffect(() => {
    if (isRecording && !isReducedMotionEnabled) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(animatedValue, {
            toValue: 1.2,
            duration: 500,
            useNativeDriver: true,
          }),
          Animated.timing(animatedValue, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true,
          }),
        ])
      ).start();
    } else {
      animatedValue.stopAnimation();
      animatedValue.setValue(1);
    }
  }, [isRecording, animatedValue]);

  const formatDuration = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handlePress = () => {
    if (disabled) return;
    
    if (isRecording) {
      onStopRecording?.();
    } else {
      onStartRecording?.();
    }
  };

  const progressPercentage = Math.min((duration / maxDuration) * 100, 100);

  return (
    <View style={[styles.container, style]}>
      {isRecording && (
        <View style={styles.recordingControls}>
          <TouchableOpacity
            style={[[
              styles.cancelButton,
              { backgroundColor: theme.colors.error.main , { minWidth: 44, minHeight: 44 }]}
            ]}
            onPress={onCancelRecording}
            accessibilityLabel="Cancel recording"
            accessibilityRole="button"
          >
            <Text style={[styles.buttonText, { color: theme.colors.text.onPrimary }]}>
              ✕
            </Text>
          </TouchableOpacity>

          <View style={styles.durationContainer}>
            <Text style={[styles.durationText, { color: theme.colors.text.primary }]}>
              {formatDuration(duration)}
            </Text>
            <View style={[styles.progressBar, { backgroundColor: theme.colors.border.main }]}>
              <View
                style={[
                  styles.progressFill,
                  {
                    width: `${progressPercentage}%`,
                    backgroundColor: theme.colors.primary.main,
                  }
                ]}
              />
            </View>
          </View>
        </View>
      )}

      <Animated.View style={{ transform: [{ scale: animatedValue }] }}>
        <TouchableOpacity
          style={[[
            styles.recordButton,
            {
              backgroundColor: isRecording
                ? theme.colors.error.main
                : theme.colors.primary.main,
            , { minWidth: 44, minHeight: 44 }]},
            disabled && styles.disabled,
          ]}
          onPress={handlePress}
          disabled={disabled}
          accessibilityLabel={isRecording ? "Stop recording" : "Start voice recording"}
          accessibilityRole="button"
          accessibilityState={{
            disabled,
            selected: isRecording,
          }}
        >
          <Text style={[styles.recordIcon, { color: theme.colors.text.onPrimary }]}>
            {isRecording ? '⏹️' : '🎤'}
          </Text>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  recordingControls: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    paddingHorizontal: 16,
  },
  cancelButton: {
    width: 44, height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  buttonText: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  durationContainer: {
    flex: 1,
    alignItems: 'center',
  },
  durationText: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  progressBar: {
    width: '100%',
    height: 44,
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 2,
  },
  recordButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: theme.colors.icon.primary,
    shadowOffset: { width: 44, height: 44 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  recordIcon: {
    fontSize: 24,
  },
  disabled: {
    opacity: 0.6,
  },
});

export default VoiceRecorder;
