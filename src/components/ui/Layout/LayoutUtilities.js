import React from 'react';
import PropTypes from 'prop-types';
import { View, ScrollView, StyleSheet, Dimensions, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../../../contexts/ThemeContext';
import { BaseDesignTokens } from '../../../design-system/DesignTokens';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

// Spacing Component - Provides consistent spacing
const Spacing = ({ 
  size = 'md', 
  direction = 'vertical',
  therapeuticTheme,
  customSize,
  style,
}) => {
  const tokens = BaseDesignTokens;
  
  const getSpacing = () => {
    if (customSize) return customSize;
    
    switch (size) {
      case 'xs': return tokens.spacing[1];
      case 'sm': return tokens.spacing[2];
      case 'md': return tokens.spacing[4];
      case 'lg': return tokens.spacing[6];
      case 'xl': return tokens.spacing[8];
      case '2xl': return tokens.spacing[12];
      case '3xl': return tokens.spacing[16];
      default: return tokens.spacing[4];
    }
  };

  const spacing = getSpacing();
  
  const spacingStyle = [
    direction === 'vertical' 
      ? { height: spacing } 
      : { width: spacing },
    style,
  ];

  return <View style={spacingStyle} />;
};

// Container Component - Provides consistent padding and max widths
const Container = ({
  children,
  size = 'default',
  padding = 'md',
  margin,
  backgroundColor,
  therapeuticTheme,
  fullHeight = false,
  centered = false,
  style,
  contentContainerStyle,
  scrollable = false,
  safeArea = false,
  ...props
}) => {
  const { theme } = useTheme();
  const tokens = BaseDesignTokens;

  const getPadding = () => {
    switch (padding) {
      case 'none': return 0;
      case 'xs': return tokens.spacing[1];
      case 'sm': return tokens.spacing[2];
      case 'md': return tokens.spacing[4];
      case 'lg': return tokens.spacing[6];
      case 'xl': return tokens.spacing[8];
      default: return tokens.spacing[4];
    }
  };

  const getMaxWidth = () => {
    switch (size) {
      case 'sm': return tokens.breakpoints.sm;
      case 'md': return tokens.breakpoints.md;
      case 'lg': return tokens.breakpoints.lg;
      case 'xl': return tokens.breakpoints.xl;
      case 'full': return '100%';
      default: return '100%';
    }
  };

  const getBackgroundColor = () => {
    if (backgroundColor) return backgroundColor;
    
    if (therapeuticTheme) {
      const therapeuticColors = tokens.colors.therapeutic[therapeuticTheme];
      return therapeuticColors?.[50] || tokens.colors.background.primary;
    }
    
    return tokens.colors.background.primary;
  };

  const paddingValue = getPadding();
  const maxWidth = getMaxWidth();
  const bgColor = getBackgroundColor();

  const containerStyle = [
    styles.container,
    {
      padding: paddingValue,
      maxWidth,
      backgroundColor: bgColor,
      minHeight: fullHeight ? screenHeight : 'auto',
      alignItems: centered ? 'center' : 'stretch',
      justifyContent: centered ? 'center' : 'flex-start',
    },
    margin && { margin },
    style,
  ];

  const WrapperComponent = safeArea ? SafeAreaView : View;
  const ContentComponent = scrollable ? ScrollView : View;

  return (
    <WrapperComponent style={safeArea ? { flex: 1, backgroundColor: bgColor } : {}}>
      <ContentComponent
        style={scrollable ? {} : containerStyle}
        contentContainerStyle={scrollable ? [containerStyle, contentContainerStyle] : undefined}
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
        {...props}
      >
        {children}
      </ContentComponent>
    </WrapperComponent>
  );
};

// Grid Component - Provides flexible grid layouts
const Grid = ({
  children,
  columns = 2,
  spacing = 'md',
  aspectRatio,
  therapeuticTheme,
  style,
}) => {
  const tokens = BaseDesignTokens;

  const getSpacing = () => {
    switch (spacing) {
      case 'none': return 0;
      case 'xs': return tokens.spacing[1];
      case 'sm': return tokens.spacing[2];
      case 'md': return tokens.spacing[4];
      case 'lg': return tokens.spacing[6];
      case 'xl': return tokens.spacing[8];
      default: return tokens.spacing[4];
    }
  };

  const spacingValue = getSpacing();
  const itemWidth = (screenWidth - spacingValue * (columns + 1)) / columns;

  const gridStyle = [
    styles.grid,
    {
      gap: spacingValue,
      paddingHorizontal: spacingValue / 2,
    },
    style,
  ];

  const renderGridItems = () => {
    return React.Children.map(children, (child, index) => (
      <View
        key={index}
        style={[
          styles.gridItem,
          {
            width: itemWidth,
            aspectRatio: aspectRatio,
          },
        ]}
      >
        {child}
      </View>
    ));
  };

  return (
    <View style={gridStyle}>
      {renderGridItems()}
    </View>
  );
};

// Stack Component - Provides vertical or horizontal stacking
const Stack = ({
  children,
  direction = 'vertical',
  spacing = 'md',
  align = 'stretch',
  justify = 'flex-start',
  wrap = false,
  divider,
  therapeuticTheme,
  style,
}) => {
  const tokens = BaseDesignTokens;

  const getSpacing = () => {
    switch (spacing) {
      case 'none': return 0;
      case 'xs': return tokens.spacing[1];
      case 'sm': return tokens.spacing[2];
      case 'md': return tokens.spacing[4];
      case 'lg': return tokens.spacing[6];
      case 'xl': return tokens.spacing[8];
      default: return tokens.spacing[4];
    }
  };

  const spacingValue = getSpacing();

  const stackStyle = [
    styles.stack,
    {
      flexDirection: direction === 'horizontal' ? 'row' : 'column',
      alignItems: align,
      justifyContent: justify,
      flexWrap: wrap ? 'wrap' : 'nowrap',
      gap: spacingValue,
    },
    style,
  ];

  const renderChildren = () => {
    if (!divider) return children;

    const childArray = React.Children.toArray(children);
    const childrenWithDividers = [];

    childArray.forEach((child, index) => {
      childrenWithDividers.push(child);
      
      if (index < childArray.length - 1) {
        childrenWithDividers.push(
          <View key={`divider-${index}`}>
            {divider}
          </View>
        );
      }
    });

    return childrenWithDividers;
  };

  return (
    <View style={stackStyle}>
      {renderChildren()}
    </View>
  );
};

// Flex Component - Provides flexible layouts
const Flex = ({
  children,
  direction = 'row',
  align = 'stretch',
  justify = 'flex-start',
  wrap = false,
  grow = 0,
  shrink = 1,
  basis = 'auto',
  gap,
  therapeuticTheme,
  style,
}) => {
  const tokens = BaseDesignTokens;

  const getGap = () => {
    if (!gap) return 0;
    
    switch (gap) {
      case 'xs': return tokens.spacing[1];
      case 'sm': return tokens.spacing[2];
      case 'md': return tokens.spacing[4];
      case 'lg': return tokens.spacing[6];
      case 'xl': return tokens.spacing[8];
      default: return typeof gap === 'number' ? gap : tokens.spacing[4];
    }
  };

  const flexStyle = [
    styles.flex,
    {
      flexDirection: direction,
      alignItems: align,
      justifyContent: justify,
      flexWrap: wrap ? 'wrap' : 'nowrap',
      flexGrow: grow,
      flexShrink: shrink,
      flexBasis: basis,
      gap: getGap(),
    },
    style,
  ];

  return (
    <View style={flexStyle}>
      {children}
    </View>
  );
};

// Divider Component - Visual separator
const Divider = ({
  orientation = 'horizontal',
  color,
  thickness = 1,
  length = '100%',
  spacing = 'md',
  therapeuticTheme,
  style,
}) => {
  const { theme } = useTheme();
  const tokens = BaseDesignTokens;

  const getColor = () => {
    if (color) return color;
    
    if (therapeuticTheme) {
      const therapeuticColors = tokens.colors.therapeutic[therapeuticTheme];
      return therapeuticColors?.[200] || tokens.colors.border.primary;
    }
    
    return tokens.colors.border.primary;
  };

  const getSpacing = () => {
    switch (spacing) {
      case 'none': return 0;
      case 'xs': return tokens.spacing[1];
      case 'sm': return tokens.spacing[2];
      case 'md': return tokens.spacing[4];
      case 'lg': return tokens.spacing[6];
      case 'xl': return tokens.spacing[8];
      default: return tokens.spacing[4];
    }
  };

  const dividerColor = getColor();
  const spacingValue = getSpacing();

  const dividerStyle = [
    styles.divider,
    orientation === 'horizontal' ? {
      width: length,
      height: thickness,
      marginVertical: spacingValue,
    } : {
      height: length,
      width: thickness,
      marginHorizontal: spacingValue,
    },
    {
      backgroundColor: dividerColor,
    },
    style,
  ];

  return <View style={dividerStyle} />;
};

// Center Component - Centers content both horizontally and vertically
const Center = ({
  children,
  fullHeight = false,
  therapeuticTheme,
  style,
}) => {
  const centerStyle = [
    styles.center,
    fullHeight && { minHeight: screenHeight },
    style,
  ];

  return (
    <View style={centerStyle}>
      {children}
    </View>
  );
};

// Responsive Component - Renders different content based on screen size
const Responsive = ({
  children,
  small,
  medium,
  large,
  xlarge,
}) => {
  const tokens = BaseDesignTokens;

  const getContent = () => {
    if (screenWidth >= tokens.breakpoints['2xl'] && xlarge) return xlarge;
    if (screenWidth >= tokens.breakpoints.xl && large) return large;
    if (screenWidth >= tokens.breakpoints.lg && medium) return medium;
    if (screenWidth >= tokens.breakpoints.md && small) return small;
    return children;
  };

  return <>{getContent()}</>;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'flex-start',
  },
  gridItem: {
    marginBottom: 8,
  },
  stack: {
    // Styles are applied dynamically
  },
  flex: {
    // Styles are applied dynamically
  },
  divider: {
    // Styles are applied dynamically
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

// PropTypes
Spacing.propTypes = {
  size: PropTypes.oneOf(['xs', 'sm', 'md', 'lg', 'xl', '2xl', '3xl']),
  direction: PropTypes.oneOf(['vertical', 'horizontal']),
  therapeuticTheme: PropTypes.oneOf([
    'calming', 'nurturing', 'peaceful', 'grounding', 
    'energizing', 'focus', 'mindful', 'balance'
  ]),
  customSize: PropTypes.number,
  style: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
};

Container.propTypes = {
  children: PropTypes.node.isRequired,
  size: PropTypes.oneOf(['sm', 'md', 'lg', 'xl', 'full', 'default']),
  padding: PropTypes.oneOf(['none', 'xs', 'sm', 'md', 'lg', 'xl']),
  margin: PropTypes.number,
  backgroundColor: PropTypes.string,
  therapeuticTheme: PropTypes.oneOf([
    'calming', 'nurturing', 'peaceful', 'grounding', 
    'energizing', 'focus', 'mindful', 'balance'
  ]),
  fullHeight: PropTypes.bool,
  centered: PropTypes.bool,
  style: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  contentContainerStyle: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  scrollable: PropTypes.bool,
  safeArea: PropTypes.bool,
};

Grid.propTypes = {
  children: PropTypes.node.isRequired,
  columns: PropTypes.number,
  spacing: PropTypes.oneOf(['none', 'xs', 'sm', 'md', 'lg', 'xl']),
  aspectRatio: PropTypes.number,
  therapeuticTheme: PropTypes.oneOf([
    'calming', 'nurturing', 'peaceful', 'grounding', 
    'energizing', 'focus', 'mindful', 'balance'
  ]),
  style: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
};

Stack.propTypes = {
  children: PropTypes.node.isRequired,
  direction: PropTypes.oneOf(['vertical', 'horizontal']),
  spacing: PropTypes.oneOf(['none', 'xs', 'sm', 'md', 'lg', 'xl']),
  align: PropTypes.oneOf(['flex-start', 'flex-end', 'center', 'stretch', 'baseline']),
  justify: PropTypes.oneOf(['flex-start', 'flex-end', 'center', 'space-between', 'space-around', 'space-evenly']),
  wrap: PropTypes.bool,
  divider: PropTypes.node,
  therapeuticTheme: PropTypes.oneOf([
    'calming', 'nurturing', 'peaceful', 'grounding', 
    'energizing', 'focus', 'mindful', 'balance'
  ]),
  style: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
};

Flex.propTypes = {
  children: PropTypes.node.isRequired,
  direction: PropTypes.oneOf(['row', 'column', 'row-reverse', 'column-reverse']),
  align: PropTypes.oneOf(['flex-start', 'flex-end', 'center', 'stretch', 'baseline']),
  justify: PropTypes.oneOf(['flex-start', 'flex-end', 'center', 'space-between', 'space-around', 'space-evenly']),
  wrap: PropTypes.bool,
  grow: PropTypes.number,
  shrink: PropTypes.number,
  basis: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  gap: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.oneOf(['xs', 'sm', 'md', 'lg', 'xl'])
  ]),
  therapeuticTheme: PropTypes.oneOf([
    'calming', 'nurturing', 'peaceful', 'grounding', 
    'energizing', 'focus', 'mindful', 'balance'
  ]),
  style: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
};

Divider.propTypes = {
  orientation: PropTypes.oneOf(['horizontal', 'vertical']),
  color: PropTypes.string,
  thickness: PropTypes.number,
  length: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  spacing: PropTypes.oneOf(['none', 'xs', 'sm', 'md', 'lg', 'xl']),
  therapeuticTheme: PropTypes.oneOf([
    'calming', 'nurturing', 'peaceful', 'grounding', 
    'energizing', 'focus', 'mindful', 'balance'
  ]),
  style: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
};

Center.propTypes = {
  children: PropTypes.node.isRequired,
  fullHeight: PropTypes.bool,
  therapeuticTheme: PropTypes.oneOf([
    'calming', 'nurturing', 'peaceful', 'grounding', 
    'energizing', 'focus', 'mindful', 'balance'
  ]),
  style: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
};

Responsive.propTypes = {
  children: PropTypes.node.isRequired,
  small: PropTypes.node,
  medium: PropTypes.node,
  large: PropTypes.node,
  xlarge: PropTypes.node,
};

export {
  Spacing,
  Container,
  Grid,
  Stack,
  Flex,
  Divider,
  Center,
  Responsive,
};

export default Container;