import React, { useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  TouchableOpacity,
} from 'react-native';
import { WebSafeLinearGradient as LinearGradient } from '../common/WebSafeLinearGradient';
import EnhancedShadersContainer from '../enhanced/EnhancedShadersContainer';
import { useTheme } from '../../shared/theme/ThemeContext';
import {
  typography,
  spacing,
  borderRadius,
  shadows,
} from '../../shared/theme/theme';

// Enhanced Card component following shadcn/ui design principles
// Featuring modern glassmorphism, shader effects, and therapeutic design
const EnhancedCard = ({
  children,
  title,
  subtitle,
  description,
  variant = 'default', // 'default', 'therapeutic', 'glass', 'gradient', 'minimal'
  size = 'medium', // 'small', 'medium', 'large'
  interactive = false,
  animated = true,
  shaderVariant = 'glass',
  shaderIntensity = 0.3,
  onPress,
  style,
  headerStyle,
  contentStyle,
  footerActions,
  testID,
  ...props
}) => {
  const { theme } = useTheme();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.95)).current;
  const pressAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (animated) {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          tension: 50,
          friction: 8,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      fadeAnim.setValue(1);
      scaleAnim.setValue(1);
    }
  }, [animated, fadeAnim, scaleAnim]);

  const handlePressIn = () => {
    if (interactive || onPress) {
      Animated.spring(pressAnim, {
        toValue: 0.98,
        tension: 150,
        friction: 8,
        useNativeDriver: true,
      }).start();
    }
  };

  const handlePressOut = () => {
    if (interactive || onPress) {
      Animated.spring(pressAnim, {
        toValue: 1,
        tension: 150,
        friction: 8,
        useNativeDriver: true,
      }).start();
    }
  };

  // Get variant-specific styling
  const getVariantStyles = () => {
    switch (variant) {
      case 'therapeutic':
        return {
          gradientColors: [
            theme.colors.therapeutic.calming[100] + '90',
            theme.colors.therapeutic.peaceful[100] + '80',
            theme.colors.therapeutic.nurturing[100] + '70',
          ],
          borderColor: theme.colors.therapeutic.calming[200],
          shadowColor: theme.colors.therapeutic.calming[400],
          textColor: theme.colors.text.primary,
        };
      
      case 'glass':
        return {
          gradientColors: [
            'rgba(255, 255, 255, 0.1)',
            'rgba(255, 255, 255, 0.05)',
          ],
          borderColor: 'rgba(255, 255, 255, 0.2)',
          shadowColor: 'rgba(0, 0, 0, 0.1)',
          textColor: theme.colors.text.primary,
        };
      
      case 'gradient':
        return {
          gradientColors: [
            theme.colors.primary[400] + '20',
            theme.colors.secondary[400] + '15',
          ],
          borderColor: theme.colors.primary[300],
          shadowColor: theme.colors.primary[500],
          textColor: theme.colors.text.primary,
        };
      
      case 'minimal':
        return {
          gradientColors: [
            theme.colors.background.surface,
            theme.colors.background.surface,
          ],
          borderColor: theme.colors.border.light,
          shadowColor: 'rgba(0, 0, 0, 0.05)',
          textColor: theme.colors.text.primary,
        };
      
      default:
        return {
          gradientColors: [
            theme.colors.background.surface + '95',
            theme.colors.background.secondary + '90',
          ],
          borderColor: theme.colors.border.light,
          shadowColor: 'rgba(0, 0, 0, 0.1)',
          textColor: theme.colors.text.primary,
        };
    }
  };

  // Get size-specific styling
  const getSizeStyles = () => {
    switch (size) {
      case 'small':
        return {
          padding: spacing[3],
          borderRadius: borderRadius.md,
          titleSize: typography.sizes.base,
          subtitleSize: typography.sizes.sm,
        };
      
      case 'large':
        return {
          padding: spacing[6],
          borderRadius: borderRadius['2xl'],
          titleSize: typography.sizes['2xl'],
          subtitleSize: typography.sizes.base,
        };
      
      default: // medium
        return {
          padding: spacing[4],
          borderRadius: borderRadius.xl,
          titleSize: typography.sizes.lg,
          subtitleSize: typography.sizes.sm,
        };
    }
  };

  const variantStyles = getVariantStyles();
  const sizeStyles = getSizeStyles();
  const ComponentWrapper = interactive || onPress ? TouchableOpacity : View;

  return (
    <EnhancedShadersContainer
      variant={shaderVariant}
      intensity={shaderIntensity}
      animated={animated}
      interactive={interactive}
      style={[styles.cardWrapper, style]}
    >
      <Animated.View
        style={[
          styles.cardContainer,
          {
            opacity: fadeAnim,
            transform: [
              { scale: scaleAnim },
              { scale: pressAnim },
            ],
          },
        ]}
      >
        <ComponentWrapper
          style={styles.touchable}
          onPress={onPress}
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
          activeOpacity={0.9}
          disabled={!onPress && !interactive}
          accessible={!!onPress}
          accessibilityRole={onPress ? "button" : "group"}
          testID={testID}
          {...props}
        >
          <LinearGradient
            colors={variantStyles.gradientColors}
            style={[
              styles.cardGradient,
              {
                padding: sizeStyles.padding,
                borderRadius: sizeStyles.borderRadius,
                borderColor: variantStyles.borderColor,
                shadowColor: variantStyles.shadowColor,
              },
              variant === 'glass' && styles.glassEffect,
            ]}
          >
            {/* Header Section */}
            {(title || subtitle) && (
              <View style={[styles.header, headerStyle]}>
                {title && (
                  <Text
                    style={[
                      styles.title,
                      {
                        fontSize: sizeStyles.titleSize,
                        color: variantStyles.textColor,
                      },
                    ]}
                  >
                    {title}
                  </Text>
                )}
                {subtitle && (
                  <Text
                    style={[
                      styles.subtitle,
                      {
                        fontSize: sizeStyles.subtitleSize,
                        color: theme.colors.text.secondary,
                      },
                    ]}
                  >
                    {subtitle}
                  </Text>
                )}
              </View>
            )}

            {/* Description */}
            {description && (
              <Text
                style={[
                  styles.description,
                  {
                    color: theme.colors.text.tertiary,
                  },
                ]}
              >
                {description}
              </Text>
            )}

            {/* Content Section */}
            {children && (
              <View style={[styles.content, contentStyle]}>
                {children}
              </View>
            )}

            {/* Footer Actions */}
            {footerActions && (
              <View style={styles.footer}>
                {footerActions}
              </View>
            )}
          </LinearGradient>
        </ComponentWrapper>
      </Animated.View>
    </EnhancedShadersContainer>
  );
};

const styles = StyleSheet.create({
  cardWrapper: {
    marginVertical: spacing[2],
  },
  cardContainer: {
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
  },
  touchable: {
    borderRadius: borderRadius.xl,
  },
  cardGradient: {
    borderWidth: 1,
    ...shadows.lg,
  },
  glassEffect: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    backdropFilter: 'blur(10px)',
  },
  header: {
    marginBottom: spacing[3],
  },
  title: {
    fontWeight: typography.weights.semiBold,
    lineHeight: typography.lineHeights.lg,
    marginBottom: spacing[1],
  },
  subtitle: {
    fontWeight: typography.weights.normal,
    lineHeight: typography.lineHeights.sm,
    opacity: 0.8,
  },
  description: {
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.normal,
    lineHeight: typography.lineHeights.sm,
    marginBottom: spacing[3],
    opacity: 0.7,
  },
  content: {
    flex: 1,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginTop: spacing[4],
    paddingTop: spacing[3],
    borderTopWidth: 1,
    borderTopColor: 'rgba(0, 0, 0, 0.05)',
  },
});

export default EnhancedCard;