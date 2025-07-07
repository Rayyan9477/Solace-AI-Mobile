import React, { useState } from 'react';
import { View, TextInput, Text, StyleSheet, Pressable } from 'react-native';
import { useTheme } from '../../contexts/ThemeContext';

const Input = ({
  label,
  value,
  onChangeText,
  placeholder,
  error,
  secureTextEntry,
  keyboardType,
  multiline,
  numberOfLines,
  maxLength,
  autoCapitalize = 'none',
  autoCorrect = false,
  style,
  accessibilityLabel,
  accessibilityHint,
}) => {
  const { theme } = useTheme();
  const [isFocused, setIsFocused] = useState(false);
  const [isSecureVisible, setIsSecureVisible] = useState(!secureTextEntry);

  const borderColor = error
    ? theme.colors.error
    : isFocused
    ? theme.colors.primary.main
    : theme.colors.border.main;

  const inputAccessibilityLabel = accessibilityLabel || `${label} input field${error ? `. Error: ${error}` : ''}`;

  return (
    <View style={[styles.container, style]}>
      {label && (
        <Text
          style={[
            styles.label,
            {
              color: error
                ? theme.colors.error
                : theme.colors.text.primary,
            },
          ]}
        >
          {label}
        </Text>
      )}
      
      <View style={[
        styles.inputContainer,
        {
          borderColor,
          backgroundColor: theme.colors.background.surface,
        },
      ]}>
        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={theme.colors.text.placeholder}
          secureTextEntry={secureTextEntry && !isSecureVisible}
          keyboardType={keyboardType}
          multiline={multiline}
          numberOfLines={numberOfLines}
          maxLength={maxLength}
          autoCapitalize={autoCapitalize}
          autoCorrect={autoCorrect}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          style={[
            styles.input,
            {
              color: theme.colors.text.primary,
              height: multiline ? undefined : 48,
            },
          ]}
          accessibilityLabel={inputAccessibilityLabel}
          accessibilityHint={accessibilityHint}
        />
        
        {secureTextEntry && (
          <Pressable
            onPress={() => setIsSecureVisible(!isSecureVisible)}
            style={styles.visibilityToggle}
            accessibilityLabel={`${isSecureVisible ? 'Hide' : 'Show'} password`}
            accessibilityRole="button"
          >
            <Text style={{ color: theme.colors.primary.main }}>
              {isSecureVisible ? '👁️' : '👁️‍🗨️'}
            </Text>
          </Pressable>
        )}
      </View>

      {error && (
        <Text
          style={[styles.error, { color: theme.colors.error }]}
          accessibilityLabel={`Error: ${error}`}
          accessibilityRole="alert"
        >
          {error}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    marginBottom: 8,
    fontSize: 14,
    fontWeight: '500',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 8,
    overflow: 'hidden',
  },
  input: {
    flex: 1,
    paddingHorizontal: 16,
    fontSize: 16,
  },
  visibilityToggle: {
    padding: 12,
  },
  error: {
    marginTop: 4,
    fontSize: 12,
    fontWeight: '500',
  },
});

export default Input;
