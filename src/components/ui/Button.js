import React, { useState } from 'react';
import { 
  TouchableOpacity, 
  Text, 
  StyleSheet, 
  Animated, 
  ActivityIndicator,
  View
} from 'react-native';
import { BlurView } from '@react-native-community/blur';
import { useTheme } from '../../shared/theme/ThemeContext';
import FreudDesignSystem, { FreudColors, FreudComponents, FreudShadows, FreudBorderRadius, FreudSpacing, FreudTypography } from '../../shared/theme/FreudDesignSystem';
import { MentalHealthIcon } from '../icons';

const Button = ({
  title = '',
  onPress = () => {},
  variant = 'primary',
  size = 'medium',
  therapeuticColor = 'calming',
  disabled = false,
  loading = false,
  icon = null,
  iconPosition = 'left',
  fullWidth = false,
  style = {},
  textStyle = {},
  accessibilityLabel,
  accessibilityHint,
  children,
  ...props
}) => {
  const { theme, isDarkMode } = useTheme();
  const [isPressed, setIsPressed] = useState(false);
  const [scaleAnim] = useState(new Animated.Value(1));

  const handlePressIn = () => {
    setIsPressed(true);
    Animated.spring(scaleAnim, {
      toValue: 0.98,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    setIsPressed(false);
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
    }).start();
  };

  const getButtonStyles = () => {
    const baseStyle = {
      ...getVariantStyles(),
      ...getSizeStyles(),
      ...styles.button,
    };

    if (fullWidth) {
      baseStyle.width = '100%';
    }

    if (disabled || loading) {
      baseStyle.opacity = 0.6;
    }

    return [baseStyle, style];
  };

  const getVariantStyles = () => {
    const currentTheme = isDarkMode ? FreudDesignSystem.themes.dark : FreudDesignSystem.themes.light;
    
    switch (variant) {
      case 'primary':
        return {
          ...FreudComponents.button.primary,
          backgroundColor: FreudColors.mindfulBrown[90],
        };
      
      case 'secondary':
        return {
          ...FreudComponents.button.secondary,
          backgroundColor: FreudColors.serenityGreen[40],
        };
      
      case 'outline':
        return {
          ...FreudComponents.button.outline,
          borderColor: FreudColors.mindfulBrown[50],
        };
      
      case 'ghost':
        return {
          ...FreudComponents.button.ghost,
        };
      
      case 'link':
        return {
          backgroundColor: 'transparent',
          borderWidth: 0,
          paddingVertical: 0,
          paddingHorizontal: 0,
          borderRadius: FreudBorderRadius.md,
        };
      
      case 'destructive':
        return {
          ...FreudComponents.button.primary,
          backgroundColor: FreudColors.empathyOrange[60],
        };
      
      case 'glassmorphism':
        return {
          backgroundColor: 'rgba(255, 255, 255, 0.25)',
          borderWidth: 1,
          borderColor: 'rgba(255, 255, 255, 0.3)',
          borderRadius: FreudBorderRadius['2xl'],
          paddingVertical: FreudSpacing[3],
          paddingHorizontal: FreudSpacing[6],
          minHeight: 44,
          backdropFilter: 'blur(10px)',
        };
      
      default:
        return {
          ...FreudComponents.button.primary,
          backgroundColor: FreudColors.mindfulBrown[90],
        };
    }
  };

  const getSizeStyles = () => {
    switch (size) {
      case 'small':
        return {
          paddingVertical: FreudSpacing[2],
          paddingHorizontal: FreudSpacing[4],
          borderRadius: FreudBorderRadius.lg,
          minHeight: 36,
        };
      
      case 'large':
        return {
          paddingVertical: FreudSpacing[4],
          paddingHorizontal: FreudSpacing[6],
          borderRadius: FreudBorderRadius.xl,
          minHeight: 56,
        };
      
      case 'xl':
        return {
          paddingVertical: FreudSpacing[5],
          paddingHorizontal: FreudSpacing[8],
          borderRadius: FreudBorderRadius['2xl'],
          minHeight: 64,
        };
      
      default: // medium
        return {
          paddingVertical: FreudSpacing[3],
          paddingHorizontal: FreudSpacing[5],
          borderRadius: FreudBorderRadius.xl,
          minHeight: 44, // WCAG minimum touch target
        };
    }
  };

  const getTextStyles = () => {
    const currentTheme = isDarkMode ? FreudDesignSystem.themes.dark : FreudDesignSystem.themes.light;
    const baseTextStyle = {
      ...getTextSizeStyles(),
      fontWeight: FreudTypography.weights.semiBold,
      textAlign: 'center',
      fontFamily: FreudTypography.fontFamily.primary,
    };

    switch (variant) {
      case 'primary':
        baseTextStyle.color = '#FFFFFF';
        break;
      
      case 'secondary':
        baseTextStyle.color = '#FFFFFF';
        break;
      
      case 'outline':
        baseTextStyle.color = FreudColors.mindfulBrown[90];
        break;
      
      case 'ghost':
        baseTextStyle.color = currentTheme.colors.text.primary;
        break;
      
      case 'link':
        baseTextStyle.color = FreudColors.serenityGreen[60];
        baseTextStyle.textDecorationLine = 'underline';
        break;
      
      case 'destructive':
        baseTextStyle.color = '#FFFFFF';
        break;
      
      case 'glassmorphism':
        baseTextStyle.color = '#FFFFFF';
        baseTextStyle.fontWeight = FreudTypography.weights.bold;
        break;
      
      default:
        baseTextStyle.color = '#FFFFFF';
    }

    return [baseTextStyle, textStyle];
  };

  const getTextSizeStyles = () => {
    switch (size) {
      case 'small':
        return { 
          fontSize: FreudTypography.sizes.sm, 
          lineHeight: FreudTypography.sizes.sm * FreudTypography.lineHeights.normal 
        };
      case 'large':
        return { 
          fontSize: FreudTypography.sizes.lg, 
          lineHeight: FreudTypography.sizes.lg * FreudTypography.lineHeights.normal 
        };
      case 'xl':
        return { 
          fontSize: FreudTypography.sizes.xl, 
          lineHeight: FreudTypography.sizes.xl * FreudTypography.lineHeights.normal 
        };
      default:
        return { 
          fontSize: FreudTypography.sizes.base, 
          lineHeight: FreudTypography.sizes.base * FreudTypography.lineHeights.normal 
        };
    }
  };

  const renderIcon = () => {
    if (!icon || loading) return null;
    
    const iconSize = size === 'small' ? 16 : size === 'large' ? 20 : size === 'xl' ? 24 : 18;
    const iconColor = getTextStyles()[0].color;
    
    if (typeof icon === 'string') {
      return (
        <MentalHealthIcon
          name={icon}
          size={iconSize}
          color={iconColor}
          style={iconPosition === 'right' ? { marginLeft: 8 } : { marginRight: 8 }}
        />
      );
    }
    
    return React.cloneElement(icon, {
      size: iconSize,
      color: iconColor,
      style: [
        icon.props.style,
        iconPosition === 'right' ? { marginLeft: 8 } : { marginRight: 8 }
      ]
    });
  };

  const renderLoading = () => {
    if (!loading) return null;
    
    const spinnerSize = size === 'small' ? 16 : size === 'large' ? 20 : 18;
    const spinnerColor = getTextStyles()[0].color;
    
    return (
      <ActivityIndicator
        size={spinnerSize}
        color={spinnerColor}
        style={{ marginRight: title ? 8 : 0 }}
      />
    );
  };

  const buttonContent = () => {
    if (children) {
      return children;
    }

    return (
      <View style={styles.content}>
        {iconPosition === 'left' && renderIcon()}
        {renderLoading()}
        {title && (
          <Text style={getTextStyles()} numberOfLines={1}>
            {title}
          </Text>
        )}
        {iconPosition === 'right' && renderIcon()}
      </View>
    );
  };

  const ButtonWrapper = ({ children }) => {
    if (variant === 'glassmorphism') {
      return (
        <BlurView
          style={getButtonStyles()}
          blurType="light"
          blurAmount={10}
          reducedTransparencyFallbackColor="rgba(255, 255, 255, 0.8)"
        >
          {children}
        </BlurView>
      );
    }
    return (
      <View style={getButtonStyles()}>
        {children}
      </View>
    );
  };

  return (
    <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
      <TouchableOpacity
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        disabled={disabled || loading}
        activeOpacity={0.8}
        accessibilityRole="button"
        accessibilityLabel={accessibilityLabel || title}
        accessibilityHint={accessibilityHint}
        accessibilityState={{
          disabled: disabled || loading,
          busy: loading
        }}
        {...props}
      >
        <ButtonWrapper>
          {buttonContent()}
        </ButtonWrapper>
      </TouchableOpacity>
    </Animated.View>
  );
};

// Button Group Component for related actions
export const ButtonGroup = ({
  children,
  orientation = 'horizontal',
  spacing = 8,
  style = {},
}) => {
  return (
    <View
      style={[
        styles.buttonGroup,
        {
          flexDirection: orientation === 'horizontal' ? 'row' : 'column',
          gap: spacing,
        },
        style,
      ]}
    >
      {children}
    </View>
  );
};

// Therapeutic Button Variants
export const TherapeuticButton = (props) => (
  <Button {...props} therapeuticColor={props.therapeuticColor || 'calming'} />
);

export const CalmingButton = (props) => (
  <Button {...props} therapeuticColor="calming" />
);

export const NurturingButton = (props) => (
  <Button {...props} therapeuticColor="nurturing" />
);

export const PeacefulButton = (props) => (
  <Button {...props} therapeuticColor="peaceful" />
);

export const GroundingButton = (props) => (
  <Button {...props} therapeuticColor="grounding" />
);

export const EnergizingButton = (props) => (
  <Button {...props} therapeuticColor="energizing" />
);

const styles = StyleSheet.create({
  button: {
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    overflow: 'hidden', // For glassmorphism effects
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonGroup: {
    alignItems: 'center',
  },
});

export default Button;