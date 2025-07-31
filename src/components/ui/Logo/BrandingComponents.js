import React, { useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { 
  Circle, 
  Path, 
  Defs, 
  LinearGradient as SvgLinearGradient, 
  Stop,
  G,
} from 'react-native-svg';
import { useTheme } from '../../../contexts/ThemeContext';
import { BaseDesignTokens } from '../../../design-system/DesignTokens';

const { width: screenWidth } = Dimensions.get('window');

// Animated SVG Logo Component
const SolaceLogo = ({ 
  size = 64, 
  color, 
  therapeuticTheme = 'calming',
  animated = true,
  animationType = 'pulse',
  variant = 'default'
}) => {
  const { theme } = useTheme();
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const breatheAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (animated) {
      switch (animationType) {
        case 'pulse':
          const pulseAnimation = Animated.loop(
            Animated.sequence([
              Animated.timing(pulseAnim, {
                toValue: 1.1,
                duration: 2000,
                useNativeDriver: true,
              }),
              Animated.timing(pulseAnim, {
                toValue: 1,
                duration: 2000,
                useNativeDriver: true,
              }),
            ])
          );
          pulseAnimation.start();
          return () => pulseAnimation.stop();
          
        case 'rotate':
          const rotateAnimation = Animated.loop(
            Animated.timing(rotateAnim, {
              toValue: 1,
              duration: 4000,
              useNativeDriver: true,
            })
          );
          rotateAnimation.start();
          return () => rotateAnimation.stop();
          
        case 'breathe':
          const breatheAnimation = Animated.loop(
            Animated.sequence([
              Animated.timing(breatheAnim, {
                toValue: 1.05,
                duration: 3000,
                useNativeDriver: true,
              }),
              Animated.timing(breatheAnim, {
                toValue: 0.95,
                duration: 3000,
                useNativeDriver: true,
              }),
            ])
          );
          breatheAnimation.start();
          return () => breatheAnimation.stop();
      }
    }
  }, [animated, animationType]);

  const getColors = () => {
    const tokens = BaseDesignTokens;
    
    if (color) {
      return { primary: color, secondary: color };
    }
    
    if (therapeuticTheme) {
      const therapeuticColors = tokens.colors.therapeutic[therapeuticTheme];
      return {
        primary: therapeuticColors?.[500] || tokens.colors.primary[500],
        secondary: therapeuticColors?.[300] || tokens.colors.primary[300],
      };
    }
    
    return {
      primary: tokens.colors.primary[500],
      secondary: tokens.colors.primary[300],
    };
  };

  const colors = getColors();
  
  const animatedStyle = {
    transform: [
      { scale: animationType === 'pulse' ? pulseAnim : breatheAnim },
      { 
        rotate: rotateAnim.interpolate({
          inputRange: [0, 1],
          outputRange: ['0deg', '360deg'],
        })
      },
    ],
  };

  const renderMinimalLogo = () => (
    <Svg width={size} height={size} viewBox="0 0 100 100">
      <Defs>
        <SvgLinearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <Stop offset="0%" stopColor={colors.primary} stopOpacity="1" />
          <Stop offset="100%" stopColor={colors.secondary} stopOpacity="1" />
        </SvgLinearGradient>
      </Defs>
      
      {/* Brain-like curved path representing mental wellness */}
      <Path
        d="M20 50 Q30 20, 50 30 Q70 20, 80 50 Q70 80, 50 70 Q30 80, 20 50 Z"
        fill="url(#logoGradient)"
        stroke={colors.primary}
        strokeWidth="2"
      />
      
      {/* Inner peaceful circle */}
      <Circle
        cx="50"
        cy="50"
        r="15"
        fill="none"
        stroke={colors.secondary}
        strokeWidth="1.5"
        strokeDasharray="3,2"
      />
      
      {/* Center dot representing focus/mindfulness */}
      <Circle
        cx="50"
        cy="50"
        r="4"
        fill={colors.primary}
      />
    </Svg>
  );

  const renderDetailedLogo = () => (
    <Svg width={size} height={size} viewBox="0 0 100 100">
      <Defs>
        <SvgLinearGradient id="detailedGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <Stop offset="0%" stopColor={colors.primary} stopOpacity="1" />
          <Stop offset="50%" stopColor={colors.secondary} stopOpacity="0.8" />
          <Stop offset="100%" stopColor={colors.primary} stopOpacity="1" />
        </SvgLinearGradient>
      </Defs>
      
      {/* Outer protective circle */}
      <Circle
        cx="50"
        cy="50"
        r="45"
        fill="none"
        stroke={colors.secondary}
        strokeWidth="1"
        strokeOpacity="0.3"
      />
      
      {/* Main brain/heart hybrid shape */}
      <Path
        d="M25 45 Q35 15, 50 25 Q65 15, 75 45 Q75 60, 65 70 Q50 85, 35 70 Q25 60, 25 45 Z"
        fill="url(#detailedGradient)"
        stroke={colors.primary}
        strokeWidth="2"
      />
      
      {/* Neural pathway lines */}
      <Path
        d="M35 40 Q45 35, 50 40 Q55 35, 65 40"
        fill="none"
        stroke={colors.secondary}
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      
      <Path
        d="M35 50 Q45 55, 50 50 Q55 55, 65 50"
        fill="none"
        stroke={colors.secondary}
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      
      {/* Central mindfulness dot */}
      <Circle
        cx="50"
        cy="50"
        r="6"
        fill={colors.primary}
        fillOpacity="0.8"
      />
      
      {/* Inner peace circle */}
      <Circle
        cx="50"
        cy="50"
        r="12"
        fill="none"
        stroke={colors.secondary}
        strokeWidth="1"
        strokeDasharray="2,3"
        strokeOpacity="0.6"
      />
    </Svg>
  );

  return (
    <Animated.View style={[styles.logoContainer, animatedStyle]}>
      {variant === 'minimal' ? renderMinimalLogo() : renderDetailedLogo()}
    </Animated.View>
  );
};

// Brand Text Component
const BrandText = ({
  text = 'Solace',
  size = 'large',
  variant = 'default',
  therapeuticTheme = 'calming',
  withGradient = false,
  style,
}) => {
  const { theme } = useTheme();
  const tokens = BaseDesignTokens;

  const getSizeStyles = () => {
    switch (size) {
      case 'small':
        return {
          fontSize: tokens.typography.sizes.lg,
          letterSpacing: 0.5,
        };
      case 'medium':
        return {
          fontSize: tokens.typography.sizes['2xl'],
          letterSpacing: 1,
        };
      case 'large':
        return {
          fontSize: tokens.typography.sizes['4xl'],
          letterSpacing: 1.5,
        };
      case 'xlarge':
        return {
          fontSize: tokens.typography.sizes['6xl'],
          letterSpacing: 2,
        };
      default:
        return {
          fontSize: tokens.typography.sizes['3xl'],
          letterSpacing: 1,
        };
    }
  };

  const getColor = () => {
    if (therapeuticTheme) {
      const therapeuticColors = tokens.colors.therapeutic[therapeuticTheme];
      return therapeuticColors?.[700] || tokens.colors.text.primary;
    }
    return tokens.colors.text.primary;
  };

  const getGradientColors = () => {
    if (therapeuticTheme) {
      const therapeuticColors = tokens.colors.therapeutic[therapeuticTheme];
      return [
        therapeuticColors?.[600] || tokens.colors.primary[600],
        therapeuticColors?.[400] || tokens.colors.primary[400],
      ];
    }
    return [tokens.colors.primary[600], tokens.colors.primary[400]];
  };

  const sizeStyles = getSizeStyles();
  const textColor = getColor();

  const textStyle = [
    styles.brandText,
    {
      color: textColor,
      fontWeight: variant === 'bold' ? '700' : variant === 'light' ? '300' : '600',
      ...sizeStyles,
    },
    style,
  ];

  if (withGradient) {
    return (
      <LinearGradient
        colors={getGradientColors()}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradientText}
      >
        <Text style={[textStyle, { color: 'transparent' }]}>
          {text}
        </Text>
      </LinearGradient>
    );
  }

  return <Text style={textStyle}>{text}</Text>;
};

// Complete Brand Header Component
const BrandHeader = ({
  showLogo = true,
  showText = true,
  logoSize = 48,
  textSize = 'large',
  tagline = 'AI Mental Health Companion',
  orientation = 'horizontal',
  therapeuticTheme = 'calming',
  animated = true,
  variant = 'default',
  style,
}) => {
  const tokens = BaseDesignTokens;

  const getTaglineColor = () => {
    if (therapeuticTheme) {
      const therapeuticColors = tokens.colors.therapeutic[therapeuticTheme];
      return therapeuticColors?.[500] || tokens.colors.text.secondary;
    }
    return tokens.colors.text.secondary;
  };

  const containerStyle = [
    styles.brandHeader,
    orientation === 'vertical' ? styles.brandHeaderVertical : styles.brandHeaderHorizontal,
    style,
  ];

  return (
    <View style={containerStyle}>
      {showLogo && (
        <SolaceLogo 
          size={logoSize}
          therapeuticTheme={therapeuticTheme}
          animated={animated}
          variant={variant}
        />
      )}
      
      {showText && (
        <View style={styles.textContainer}>
          <BrandText
            size={textSize}
            therapeuticTheme={therapeuticTheme}
            variant={variant}
          />
          
          {tagline && (
            <Text
              style={[
                styles.tagline,
                {
                  color: getTaglineColor(),
                  fontSize: textSize === 'large' ? 14 : textSize === 'medium' ? 12 : 10,
                },
              ]}
            >
              {tagline}
            </Text>
          )}
        </View>
      )}
    </View>
  );
};

// App Icon Component for different platforms
const AppIcon = ({
  size = 64,
  platform = 'default',
  therapeuticTheme = 'calming',
  variant = 'default',
}) => {
  const { theme } = useTheme();
  const tokens = BaseDesignTokens;

  const getColors = () => {
    if (therapeuticTheme) {
      const therapeuticColors = tokens.colors.therapeutic[therapeuticTheme];
      return {
        primary: therapeuticColors?.[500] || tokens.colors.primary[500],
        secondary: therapeuticColors?.[300] || tokens.colors.primary[300],
        background: therapeuticColors?.[50] || tokens.colors.background.primary,
      };
    }
    
    return {
      primary: tokens.colors.primary[500],
      secondary: tokens.colors.primary[300],
      background: tokens.colors.background.primary,
    };
  };

  const colors = getColors();
  const borderRadius = platform === 'ios' ? size * 0.22 : platform === 'android' ? 0 : size * 0.15;

  return (
    <View
      style={[
        styles.appIcon,
        {
          width: size,
          height: size,
          borderRadius,
          backgroundColor: colors.background,
        },
      ]}
    >
      <LinearGradient
        colors={[colors.primary, colors.secondary]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[
          styles.appIconGradient,
          {
            borderRadius,
          },
        ]}
      >
        <SolaceLogo 
          size={size * 0.6}
          color="#FFFFFF"
          animated={false}
          variant={variant}
        />
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  logoContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  brandText: {
    fontFamily: 'System',
    textAlign: 'center',
    includeFontPadding: false,
  },
  gradientText: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  brandHeader: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  brandHeaderHorizontal: {
    flexDirection: 'row',
  },
  brandHeaderVertical: {
    flexDirection: 'column',
  },
  textContainer: {
    alignItems: 'center',
    marginLeft: 12,
  },
  tagline: {
    textAlign: 'center',
    fontWeight: '400',
    marginTop: 4,
    opacity: 0.8,
  },
  appIcon: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 10,
  },
  appIconGradient: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

// PropTypes
SolaceLogo.propTypes = {
  size: PropTypes.number,
  color: PropTypes.string,
  therapeuticTheme: PropTypes.oneOf([
    'calming', 'nurturing', 'peaceful', 'grounding', 
    'energizing', 'focus', 'mindful', 'balance'
  ]),
  animated: PropTypes.bool,
  animationType: PropTypes.oneOf(['pulse', 'rotate', 'breathe']),
  variant: PropTypes.oneOf(['default', 'minimal']),
};

BrandText.propTypes = {
  text: PropTypes.string,
  size: PropTypes.oneOf(['small', 'medium', 'large', 'xlarge']),
  variant: PropTypes.oneOf(['default', 'bold', 'light']),
  therapeuticTheme: PropTypes.oneOf([
    'calming', 'nurturing', 'peaceful', 'grounding', 
    'energizing', 'focus', 'mindful', 'balance'
  ]),
  withGradient: PropTypes.bool,
  style: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
};

BrandHeader.propTypes = {
  showLogo: PropTypes.bool,
  showText: PropTypes.bool,
  logoSize: PropTypes.number,
  textSize: PropTypes.oneOf(['small', 'medium', 'large', 'xlarge']),
  tagline: PropTypes.string,
  orientation: PropTypes.oneOf(['horizontal', 'vertical']),
  therapeuticTheme: PropTypes.oneOf([
    'calming', 'nurturing', 'peaceful', 'grounding', 
    'energizing', 'focus', 'mindful', 'balance'
  ]),
  animated: PropTypes.bool,
  variant: PropTypes.oneOf(['default', 'minimal', 'bold', 'light']),
  style: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
};

AppIcon.propTypes = {
  size: PropTypes.number,
  platform: PropTypes.oneOf(['default', 'ios', 'android']),
  therapeuticTheme: PropTypes.oneOf([
    'calming', 'nurturing', 'peaceful', 'grounding', 
    'energizing', 'focus', 'mindful', 'balance'
  ]),
  variant: PropTypes.oneOf(['default', 'minimal']),
};

export { SolaceLogo, BrandText, BrandHeader, AppIcon };
export default BrandHeader;