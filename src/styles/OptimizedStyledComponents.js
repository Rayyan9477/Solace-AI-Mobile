import styled, { css } from 'styled-components/native';
import { Animated } from 'react-native';

/**
 * Optimized styled-components with performance best practices
 * - Reduced prop interpolation
 * - Memoized theme functions
 * - Cached style objects
 * - Minimal dynamic styling
 */

// Theme-based style generators (memoized)
const createThemeStyles = (theme) => ({
  // Primary colors
  primaryColors: {
    background: theme.colors.background.primary,
    text: theme.colors.text.primary,
    accent: theme.colors.primary[500],
  },
  
  // Therapeutic colors
  therapeuticColors: {
    calming: theme.colors.therapeutic.calming[500],
    nurturing: theme.colors.therapeutic.nurturing[500],
    peaceful: theme.colors.therapeutic.peaceful[500],
    grounding: theme.colors.therapeutic.grounding[500],
  },
  
  // Common spacings
  spacing: {
    xs: theme.spacing[1],
    sm: theme.spacing[2],
    md: theme.spacing[4],
    lg: theme.spacing[6],
    xl: theme.spacing[8],
  },
  
  // Common shadows
  shadows: {
    sm: theme.shadows.sm,
    md: theme.shadows.md,
    lg: theme.shadows.lg,
  },
});

// Cache for theme styles to prevent recalculation
const themeStylesCache = new WeakMap();

const getThemeStyles = (theme) => {
  if (themeStylesCache.has(theme)) {
    return themeStylesCache.get(theme);
  }
  
  const styles = createThemeStyles(theme);
  themeStylesCache.set(theme, styles);
  return styles;
};

// Base styled components with optimized props
export const Container = styled.View.attrs(({ theme }) => {
  const styles = getThemeStyles(theme);
  return {
    style: {
      backgroundColor: styles.primaryColors.background,
    },
  };
})`
  flex: 1;
`;

export const Card = styled.View.attrs(({ theme, variant = 'default' }) => {
  const styles = getThemeStyles(theme);
  
  const variants = {
    default: {
      backgroundColor: styles.primaryColors.background,
      ...styles.shadows.md,
    },
    therapeutic: {
      backgroundColor: styles.therapeuticColors.calming + '10',
      ...styles.shadows.sm,
    },
    elevated: {
      backgroundColor: styles.primaryColors.background,
      ...styles.shadows.lg,
    },
  };
  
  return {
    style: variants[variant] || variants.default,
  };
})`
  border-radius: 16px;
  padding: ${({ theme }) => getThemeStyles(theme).spacing.md}px;
  margin: ${({ theme }) => getThemeStyles(theme).spacing.sm}px;
`;

export const TherapeuticCard = styled(Card).attrs(({ theme }) => ({
  variant: 'therapeutic',
}))`
  border-width: 1px;
  border-color: ${({ theme }) => getThemeStyles(theme).therapeuticColors.calming}20;
`;

export const HeaderText = styled.Text.attrs(({ theme, size = 'lg' }) => {
  const styles = getThemeStyles(theme);
  
  const sizes = {
    sm: { fontSize: 14, lineHeight: 20 },
    md: { fontSize: 16, lineHeight: 24 },
    lg: { fontSize: 18, lineHeight: 26 },
    xl: { fontSize: 20, lineHeight: 28 },
    xxl: { fontSize: 24, lineHeight: 32 },
  };
  
  return {
    style: {
      color: styles.primaryColors.text,
      fontWeight: '600',
      ...sizes[size],
    },
  };
})``;

export const BodyText = styled.Text.attrs(({ theme, variant = 'primary' }) => {
  const styles = getThemeStyles(theme);
  
  const variants = {
    primary: styles.primaryColors.text,
    secondary: theme.colors.text.secondary,
    tertiary: theme.colors.text.tertiary,
    therapeutic: styles.therapeuticColors.calming,
  };
  
  return {
    style: {
      color: variants[variant] || variants.primary,
      fontSize: 14,
      lineHeight: 20,
    },
  };
})``;

export const Button = styled.TouchableOpacity.attrs(({ theme, variant = 'primary', disabled }) => {
  const styles = getThemeStyles(theme);
  
  const variants = {
    primary: {
      backgroundColor: disabled ? theme.colors.gray[300] : styles.therapeuticColors.calming,
    },
    secondary: {
      backgroundColor: 'transparent',
      borderWidth: 1,
      borderColor: disabled ? theme.colors.gray[300] : styles.therapeuticColors.calming,
    },
    therapeutic: {
      backgroundColor: disabled ? theme.colors.gray[300] : styles.therapeuticColors.nurturing,
    },
  };
  
  return {
    activeOpacity: disabled ? 1 : 0.8,
    style: {
      ...variants[variant],
      opacity: disabled ? 0.6 : 1,
    },
  };
})`
  padding: ${({ theme }) => getThemeStyles(theme).spacing.md}px ${({ theme }) => getThemeStyles(theme).spacing.lg}px;
  border-radius: 12px;
  align-items: center;
  justify-content: center;
  min-height: 48px;
`;

export const ButtonText = styled.Text.attrs(({ theme, variant = 'primary' }) => {
  const styles = getThemeStyles(theme);
  
  const variants = {
    primary: theme.colors.text.inverse,
    secondary: styles.therapeuticColors.calming,
    therapeutic: theme.colors.text.inverse,
  };
  
  return {
    style: {
      color: variants[variant] || variants.primary,
      fontSize: 16,
      fontWeight: '600',
    },
  };
})``;

export const IconContainer = styled.View.attrs(({ theme, size = 48, therapeutic = false }) => {
  const styles = getThemeStyles(theme);
  
  return {
    style: {
      width: size,
      height: size,
      borderRadius: size / 2,
      backgroundColor: therapeutic 
        ? styles.therapeuticColors.calming + '20'
        : styles.primaryColors.background,
    },
  };
})`
  align-items: center;
  justify-content: center;
`;

// Optimized animated components
export const AnimatedContainer = styled(Animated.View).attrs(() => ({
  // Pre-computed static styles to avoid prop interpolation
}))`
  flex: 1;
`;

export const AnimatedCard = styled(Animated.View).attrs(({ theme }) => {
  const styles = getThemeStyles(theme);
  return {
    style: {
      backgroundColor: styles.primaryColors.background,
      ...styles.shadows.md,
    },
  };
})`
  border-radius: 16px;
  padding: ${({ theme }) => getThemeStyles(theme).spacing.md}px;
  margin: ${({ theme }) => getThemeStyles(theme).spacing.sm}px;
`;

// Layout components with flexbox optimizations
export const Row = styled.View`
  flex-direction: row;
  align-items: center;
`;

export const Column = styled.View`
  flex-direction: column;
`;

export const Spacer = styled.View.attrs(({ size = 16 }) => ({
  style: { height: size, width: size },
}))``;

export const Divider = styled.View.attrs(({ theme }) => {
  const styles = getThemeStyles(theme);
  return {
    style: {
      backgroundColor: theme.colors.gray[200],
    },
  };
})`
  height: 1px;
  margin: ${({ theme }) => getThemeStyles(theme).spacing.md}px 0;
`;

// Optimized list components
export const ListContainer = styled.View`
  flex: 1;
`;

export const ListItem = styled.TouchableOpacity.attrs(({ theme }) => {
  const styles = getThemeStyles(theme);
  return {
    activeOpacity: 0.8,
    style: {
      backgroundColor: styles.primaryColors.background,
    },
  };
})`
  padding: ${({ theme }) => getThemeStyles(theme).spacing.md}px;
  border-bottom-width: 1px;
  border-bottom-color: ${({ theme }) => theme.colors.gray[100]};
  min-height: 60px;
  justify-content: center;
`;

// Form components
export const FormContainer = styled.View`
  padding: ${({ theme }) => getThemeStyles(theme).spacing.lg}px;
`;

export const InputContainer = styled.View`
  margin-bottom: ${({ theme }) => getThemeStyles(theme).spacing.md}px;
`;

export const Label = styled(BodyText).attrs({
  variant: 'primary',
})`
  font-weight: 500;
  margin-bottom: ${({ theme }) => getThemeStyles(theme).spacing.xs}px;
`;

export const TextInput = styled.TextInput.attrs(({ theme }) => {
  const styles = getThemeStyles(theme);
  return {
    placeholderTextColor: theme.colors.text.tertiary,
    style: {
      color: styles.primaryColors.text,
      backgroundColor: styles.primaryColors.background,
      borderColor: theme.colors.gray[300],
    },
  };
})`
  border-width: 1px;
  border-radius: 8px;
  padding: ${({ theme }) => getThemeStyles(theme).spacing.md}px;
  font-size: 16px;
  min-height: 48px;
`;

// Utility mixins for common patterns
export const cardShadow = css`
  elevation: 4;
  shadow-color: #000;
  shadow-offset: 0px 2px;
  shadow-opacity: 0.1;
  shadow-radius: 8px;
`;

export const therapeuticGradient = css`
  background: linear-gradient(
    135deg,
    ${({ theme }) => getThemeStyles(theme).therapeuticColors.calming}20 0%,
    ${({ theme }) => getThemeStyles(theme).therapeuticColors.peaceful}20 100%
  );
`;

// Performance optimization utilities
export const shouldForwardProp = (prop, defaultValidatorFn) => {
  // Don't forward style-related props that could cause re-renders
  const styleProps = ['variant', 'size', 'therapeutic', 'disabled'];
  return !styleProps.includes(prop) && defaultValidatorFn(prop);
};

// Factory function for creating optimized styled components
export const createOptimizedComponent = (component, baseStyles = {}) => {
  return styled(component).withConfig({ shouldForwardProp }).attrs(({ theme }) => {
    const styles = getThemeStyles(theme);
    return {
      style: {
        ...baseStyles,
        // Add computed styles here
      },
    };
  })`
    ${baseStyles}
  `;
};

// Theme provider optimization
export const optimizeThemeProvider = (theme) => {
  // Pre-compute commonly used values
  return {
    ...theme,
    computed: getThemeStyles(theme),
  };
};

export default {
  Container,
  Card,
  TherapeuticCard,
  HeaderText,
  BodyText,
  Button,
  ButtonText,
  IconContainer,
  AnimatedContainer,
  AnimatedCard,
  Row,
  Column,
  Spacer,
  Divider,
  ListContainer,
  ListItem,
  FormContainer,
  InputContainer,
  Label,
  TextInput,
  cardShadow,
  therapeuticGradient,
  createOptimizedComponent,
  optimizeThemeProvider,
};