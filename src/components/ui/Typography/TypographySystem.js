import React from 'react';
import PropTypes from 'prop-types';
import { Text, StyleSheet } from 'react-native';
import { useTheme } from '../../../contexts/ThemeContext';
import { BaseDesignTokens } from '../../../design-system/DesignTokens';

// Typography Component with comprehensive styling options
const Typography = ({
  children,
  variant = 'body1',
  size,
  weight = 'normal',
  color,
  therapeuticTheme,
  align = 'left',
  lineHeight,
  letterSpacing,
  textTransform = 'none',
  fontFamily,
  numberOfLines,
  ellipsizeMode = 'tail',
  selectable = false,
  adjustsFontSizeToFit = false,
  minimumFontScale = 0.5,
  allowFontScaling = true,
  style,
  accessibilityLabel,
  accessibilityHint,
  accessibilityRole = 'text',
  testID,
  onPress,
  onLongPress,
}) => {
  const { theme } = useTheme();
  const tokens = BaseDesignTokens;

  const getVariantStyles = () => {
    switch (variant) {
      case 'h1':
        return {
          fontSize: tokens.typography.sizes['6xl'],
          lineHeight: tokens.typography.lineHeights['6xl'],
          fontWeight: '700',
          letterSpacing: -0.5,
        };
      case 'h2':
        return {
          fontSize: tokens.typography.sizes['5xl'],
          lineHeight: tokens.typography.lineHeights['5xl'],
          fontWeight: '700',
          letterSpacing: -0.25,
        };
      case 'h3':
        return {
          fontSize: tokens.typography.sizes['4xl'],
          lineHeight: tokens.typography.lineHeights['4xl'],
          fontWeight: '600',
          letterSpacing: 0,
        };
      case 'h4':
        return {
          fontSize: tokens.typography.sizes['3xl'],
          lineHeight: tokens.typography.lineHeights['3xl'],
          fontWeight: '600',
          letterSpacing: 0,
        };
      case 'h5':
        return {
          fontSize: tokens.typography.sizes['2xl'],
          lineHeight: tokens.typography.lineHeights['2xl'],
          fontWeight: '600',
          letterSpacing: 0,
        };
      case 'h6':
        return {
          fontSize: tokens.typography.sizes.xl,
          lineHeight: tokens.typography.lineHeights.xl,
          fontWeight: '600',
          letterSpacing: 0,
        };
      case 'subtitle1':
        return {
          fontSize: tokens.typography.sizes.lg,
          lineHeight: tokens.typography.lineHeights.lg,
          fontWeight: '500',
          letterSpacing: 0.15,
        };
      case 'subtitle2':
        return {
          fontSize: tokens.typography.sizes.base,
          lineHeight: tokens.typography.lineHeights.base,
          fontWeight: '500',
          letterSpacing: 0.1,
        };
      case 'body1':
        return {
          fontSize: tokens.typography.sizes.base,
          lineHeight: tokens.typography.lineHeights.base,
          fontWeight: '400',
          letterSpacing: 0.5,
        };
      case 'body2':
        return {
          fontSize: tokens.typography.sizes.sm,
          lineHeight: tokens.typography.lineHeights.sm,
          fontWeight: '400',
          letterSpacing: 0.25,
        };
      case 'caption':
        return {
          fontSize: tokens.typography.sizes.xs,
          lineHeight: tokens.typography.lineHeights.xs,
          fontWeight: '400',
          letterSpacing: 0.4,
        };
      case 'overline':
        return {
          fontSize: tokens.typography.sizes.xs,
          lineHeight: tokens.typography.lineHeights.xs,
          fontWeight: '500',
          letterSpacing: 1.5,
          textTransform: 'uppercase',
        };
      case 'button':
        return {
          fontSize: tokens.typography.sizes.base,
          lineHeight: tokens.typography.lineHeights.base,
          fontWeight: '500',
          letterSpacing: 1.25,
          textTransform: 'uppercase',
        };
      case 'therapeutic':
        return {
          fontSize: tokens.typography.sizes.lg,
          lineHeight: tokens.typography.lineHeights.lg,
          fontWeight: '400',
          letterSpacing: 0.5,
        };
      case 'mindful':
        return {
          fontSize: tokens.typography.sizes.xl,
          lineHeight: tokens.typography.lineHeights.xl,
          fontWeight: '300',
          letterSpacing: 1,
        };
      default:
        return {
          fontSize: tokens.typography.sizes.base,
          lineHeight: tokens.typography.lineHeights.base,
          fontWeight: '400',
          letterSpacing: 0.5,
        };
    }
  };

  const getColor = () => {
    if (color) return color;
    
    if (therapeuticTheme) {
      const therapeuticColors = tokens.colors.therapeutic[therapeuticTheme];
      
      switch (variant) {
        case 'h1':
        case 'h2':
        case 'h3':
        case 'h4':
        case 'h5':
        case 'h6':
          return therapeuticColors?.[800] || tokens.colors.text.primary;
        case 'subtitle1':
        case 'subtitle2':
          return therapeuticColors?.[700] || tokens.colors.text.secondary;
        case 'body1':
        case 'body2':
          return therapeuticColors?.[600] || tokens.colors.text.primary;
        case 'caption':
        case 'overline':
          return therapeuticColors?.[500] || tokens.colors.text.tertiary;
        case 'therapeutic':
          return therapeuticColors?.[600] || tokens.colors.text.primary;
        case 'mindful':
          return therapeuticColors?.[500] || tokens.colors.text.secondary;
        default:
          return therapeuticColors?.[600] || tokens.colors.text.primary;
      }
    }
    
    switch (variant) {
      case 'h1':
      case 'h2':
      case 'h3':
      case 'h4':
      case 'h5':
      case 'h6':
      case 'body1':
      case 'body2':
        return tokens.colors.text.primary;
      case 'subtitle1':
      case 'subtitle2':
        return tokens.colors.text.secondary;
      case 'caption':
      case 'overline':
        return tokens.colors.text.tertiary;
      default:
        return tokens.colors.text.primary;
    }
  };

  const getFontFamily = () => {
    if (fontFamily) return fontFamily;
    
    switch (variant) {
      case 'h1':
      case 'h2':
      case 'h3':
      case 'h4':
      case 'h5':
      case 'h6':
        return tokens.typography.fonts.heading;
      case 'overline':
      case 'button':
        return tokens.typography.fonts.medium;
      case 'therapeutic':
      case 'mindful':
        return tokens.typography.fonts.light;
      default:
        return tokens.typography.fonts.body;
    }
  };

  const getTextTransform = () => {
    if (textTransform !== 'none') return textTransform;
    
    switch (variant) {
      case 'overline':
      case 'button':
        return 'uppercase';
      default:
        return 'none';
    }
  };

  const variantStyles = getVariantStyles();
  const textColor = getColor();
  const textFontFamily = getFontFamily();
  const textTransformValue = getTextTransform();

  const textStyle = [
    styles.text,
    variantStyles,
    {
      color: textColor,
      fontFamily: textFontFamily,
      textAlign: align,
      textTransform: textTransformValue,
      fontSize: size || variantStyles.fontSize,
      fontWeight: tokens.typography.weights[weight] || weight || variantStyles.fontWeight,
      lineHeight: lineHeight || variantStyles.lineHeight,
      letterSpacing: letterSpacing !== undefined ? letterSpacing : variantStyles.letterSpacing,
    },
    style,
  ];

  return (
    <Text
      style={textStyle}
      numberOfLines={numberOfLines}
      ellipsizeMode={ellipsizeMode}
      selectable={selectable}
      adjustsFontSizeToFit={adjustsFontSizeToFit}
      minimumFontScale={minimumFontScale}
      allowFontScaling={allowFontScaling}
      accessible={true}
      accessibilityLabel={accessibilityLabel}
      accessibilityHint={accessibilityHint}
      accessibilityRole={accessibilityRole}
      testID={testID || `typography-${variant}`}
      onPress={onPress}
      onLongPress={onLongPress}
    >
      {children}
    </Text>
  );
};

// Specialized Typography Components
const Heading = ({ level = 1, ...props }) => (
  <Typography variant={`h${level}`} {...props} />
);

const Subtitle = ({ level = 1, ...props }) => (
  <Typography variant={`subtitle${level}`} {...props} />
);

const Body = ({ level = 1, ...props }) => (
  <Typography variant={`body${level}`} {...props} />
);

const Caption = (props) => (
  <Typography variant="caption" {...props} />
);

const Overline = (props) => (
  <Typography variant="overline" {...props} />
);

const ButtonText = (props) => (
  <Typography variant="button" {...props} />
);

// Therapeutic Typography Components for Mental Health App
const TherapeuticText = ({ theme = 'calming', ...props }) => (
  <Typography 
    variant="therapeutic" 
    therapeuticTheme={theme}
    {...props} 
  />
);

const MindfulText = ({ theme = 'peaceful', ...props }) => (
  <Typography 
    variant="mindful" 
    therapeuticTheme={theme}
    {...props} 
  />
);

// Quote component for inspirational text
const Quote = ({ 
  children, 
  author, 
  therapeuticTheme = 'peaceful',
  style,
  authorStyle,
  ...props 
}) => {
  const tokens = BaseDesignTokens;
  
  return (
    <Typography
      variant="therapeutic"
      therapeuticTheme={therapeuticTheme}
      style={[
        {
          fontStyle: 'italic',
          textAlign: 'center',
          fontSize: tokens.typography.sizes.lg,
          lineHeight: tokens.typography.lineHeights.lg * 1.2,
        },
        style,
      ]}
      {...props}
    >
      "{children}"
      {author && (
        <Typography
          variant="caption"
          therapeuticTheme={therapeuticTheme}
          style={[
            {
              fontWeight: '500',
              marginTop: 8,
              textAlign: 'right',
            },
            authorStyle,
          ]}
        >
          {'\n'}— {author}
        </Typography>
      )}
    </Typography>
  );
};

const styles = StyleSheet.create({
  text: {
    includeFontPadding: false,
    textAlignVertical: 'center',
  },
});

// PropTypes
Typography.propTypes = {
  children: PropTypes.node.isRequired,
  variant: PropTypes.oneOf([
    'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
    'subtitle1', 'subtitle2',
    'body1', 'body2',
    'caption', 'overline', 'button',
    'therapeutic', 'mindful'
  ]),
  size: PropTypes.number,
  weight: PropTypes.oneOf([
    'thin', 'extraLight', 'light', 'normal', 'medium', 
    'semiBold', 'bold', 'extraBold', 'black'
  ]),
  color: PropTypes.string,
  therapeuticTheme: PropTypes.oneOf([
    'calming', 'nurturing', 'peaceful', 'grounding', 
    'energizing', 'focus', 'mindful', 'balance'
  ]),
  align: PropTypes.oneOf(['left', 'center', 'right', 'justify']),
  lineHeight: PropTypes.number,
  letterSpacing: PropTypes.number,
  textTransform: PropTypes.oneOf(['none', 'uppercase', 'lowercase', 'capitalize']),
  fontFamily: PropTypes.string,
  numberOfLines: PropTypes.number,
  ellipsizeMode: PropTypes.oneOf(['head', 'middle', 'tail', 'clip']),
  selectable: PropTypes.bool,
  adjustsFontSizeToFit: PropTypes.bool,
  minimumFontScale: PropTypes.number,
  allowFontScaling: PropTypes.bool,
  style: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  accessibilityLabel: PropTypes.string,
  accessibilityHint: PropTypes.string,
  accessibilityRole: PropTypes.string,
  testID: PropTypes.string,
  onPress: PropTypes.func,
  onLongPress: PropTypes.func,
};

Heading.propTypes = {
  level: PropTypes.oneOf([1, 2, 3, 4, 5, 6]),
};

Subtitle.propTypes = {
  level: PropTypes.oneOf([1, 2]),
};

Body.propTypes = {
  level: PropTypes.oneOf([1, 2]),
};

TherapeuticText.propTypes = {
  theme: PropTypes.oneOf([
    'calming', 'nurturing', 'peaceful', 'grounding', 
    'energizing', 'focus', 'mindful', 'balance'
  ]),
};

MindfulText.propTypes = {
  theme: PropTypes.oneOf([
    'calming', 'nurturing', 'peaceful', 'grounding', 
    'energizing', 'focus', 'mindful', 'balance'
  ]),
};

Quote.propTypes = {
  children: PropTypes.node.isRequired,
  author: PropTypes.string,
  therapeuticTheme: PropTypes.oneOf([
    'calming', 'nurturing', 'peaceful', 'grounding', 
    'energizing', 'focus', 'mindful', 'balance'
  ]),
  style: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  authorStyle: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
};

export {
  Typography,
  Heading,
  Subtitle,
  Body,
  Caption,
  Overline,
  ButtonText,
  TherapeuticText,
  MindfulText,
  Quote,
};

export default Typography;