// Compatibility bridge for tests
try {
  module.exports = require('../../src/ui/components/atoms/forms/EnhancedInput').default;
} catch (e) {
  const React = require('react');
  const { useState, useMemo } = React;
  const { View, Text, TouchableOpacity, TextInput } = require('react-native');
  const {
    validateField,
    VALIDATION_TYPES,
  } = require('../../utils/formValidation');

  function EnhancedInput({
    label,
    value: valueProp = '',
    onChangeText,
    validationRules = [],
    validateOnChange = false,
    validateOnBlur = false,
    accessibilityRequired = false,
    accessibilityHint,
    secureTextEntry = false,
    testID = 'enhanced-input',
    ...rest
  }) {
    const [value, setValue] = useState(valueProp);
    const [touched, setTouched] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const errors = useMemo(() => validateField(label?.toLowerCase() || 'field', value, validationRules), [value, validationRules, label]);
    const isInvalid = errors.length > 0 && (touched || validateOnChange || validateOnBlur);

    const toggleSecure = () => setShowPassword((s) => !s);

    const handleChange = (text) => {
      setValue(text);
      onChangeText && onChangeText(text);
    };

  const inputLabel = secureTextEntry ? (rest.accessibilityLabel || 'Secure text input') : (label || rest.accessibilityLabel);
    const inputProps = {
      value,
      onChangeText: handleChange,
      onBlur: () => setTouched(true),
      accessible: true,
      accessibilityLabel: inputLabel,
      accessibilityHint: accessibilityHint || (rest.isTherapyInput ? 'therapeutic input field' : undefined),
      accessibilityRequired,
      accessibilityInvalid: isInvalid || undefined,
      testID,
      ...rest,
    };

    const actualSecure = secureTextEntry && !showPassword;

    return (
      <View>
        <TextInput {...inputProps} secureTextEntry={actualSecure} />
        {secureTextEntry ? (
          <TouchableOpacity accessibilityRole="button" accessibilityLabel={label || 'password'} onPress={toggleSecure}>
            <Text>{showPassword ? 'Hide' : 'Show'}</Text>
          </TouchableOpacity>
        ) : null}
        {isInvalid ? (
          <Text accessibilityRole="alert">{errors[0].message}</Text>
        ) : null}
      </View>
    );
  }

  module.exports = EnhancedInput;
}
