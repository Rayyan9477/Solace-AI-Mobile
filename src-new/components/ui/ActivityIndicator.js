import React from 'react';
import PropTypes from 'prop-types';
import { View, ActivityIndicator as RNActivityIndicator, StyleSheet } from 'react-native';
import { useTheme } from '../../shared/hooks/ThemeContext';

const ActivityIndicator = ({
  size = 'large',
  color,
  style,
  accessibilityLabel = 'Loading',
}) => {
  const { theme } = useTheme();

  return (
    <View
      style={[styles.container, style]}
      accessibilityLabel={accessibilityLabel}
      accessibilityRole="progressbar"
    >
      <RNActivityIndicator
        size={size}
        color={color || theme.colors.primary.main}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

ActivityIndicator.propTypes = {
  size: PropTypes.oneOf(['small', 'large']),
  color: PropTypes.string,
  style: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  accessibilityLabel: PropTypes.string,
};

ActivityIndicator.defaultProps = {
  size: 'large',
  accessibilityLabel: 'Loading',
};

export default ActivityIndicator;
