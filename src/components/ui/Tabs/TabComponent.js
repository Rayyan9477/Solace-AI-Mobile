import React, { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Animated,
  Dimensions,
  Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import { useTheme } from '../../../contexts/ThemeContext';
import { BaseDesignTokens } from '../../../design-system/DesignTokens';

const { width: screenWidth } = Dimensions.get('window');

const TabComponent = ({
  tabs = [],
  activeTabIndex = 0,
  onTabChange,
  variant = 'default',
  size = 'medium',
  fullWidth = true,
  scrollable = false,
  showIndicator = true,
  indicatorStyle = 'line',
  therapeuticTheme,
  withHaptics = true,
  animationDuration = 250,
  tabSpacing = 'default',
  backgroundColor,
  activeColor,
  inactiveColor,
  indicatorColor,
  style,
  tabStyle,
  labelStyle,
  testID,
}) => {
  const { theme, isReducedMotionEnabled } = useTheme();
  const [activeIndex, setActiveIndex] = useState(activeTabIndex);
  const [tabWidths, setTabWidths] = useState([]);
  const [containerWidth, setContainerWidth] = useState(0);
  const scrollViewRef = useRef(null);
  const indicatorAnim = useRef(new Animated.Value(0)).current;
  const scaleAnims = useRef(tabs.map(() => new Animated.Value(1))).current;

  // Update active index when prop changes
  useEffect(() => {
    if (activeTabIndex !== activeIndex) {
      handleTabPress(activeTabIndex, false);
    }
  }, [activeTabIndex]);

  // Animate indicator position
  useEffect(() => {
    if (showIndicator && tabWidths.length > 0 && !isReducedMotionEnabled) {
      const targetPosition = getIndicatorPosition(activeIndex);
      Animated.timing(indicatorAnim, {
        toValue: targetPosition,
        duration: animationDuration,
        useNativeDriver: false,
      }).start();
    }
  }, [activeIndex, tabWidths, isReducedMotionEnabled]);

  const getIndicatorPosition = (index) => {
    if (!tabWidths[index]) return 0;
    
    let position = 0;
    for (let i = 0; i < index; i++) {
      position += tabWidths[i] || 0;
    }
    
    const spacing = getTabSpacing();
    position += spacing * index;
    
    return position;
  };

  const getIndicatorWidth = () => {
    return tabWidths[activeIndex] || 0;
  };

  const getTabSpacing = () => {
    const tokens = BaseDesignTokens;
    switch (tabSpacing) {
      case 'tight':
        return tokens.spacing[2];
      case 'default':
        return tokens.spacing[4];
      case 'loose':
        return tokens.spacing[6];
      default:
        return tokens.spacing[4];
    }
  };

  const handleTabPress = (index, withAnimation = true) => {
    if (index === activeIndex) return;

    if (withHaptics) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }

    // Scale animation for active tab
    if (withAnimation && !isReducedMotionEnabled) {
      Animated.sequence([
        Animated.timing(scaleAnims[index], {
          toValue: 0.95,
          duration: 100,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnims[index], {
          toValue: 1,
          duration: 100,
          useNativeDriver: true,
        }),
      ]).start();
    }

    setActiveIndex(index);
    onTabChange?.(index, tabs[index]);

    // Scroll to active tab if scrollable
    if (scrollable && scrollViewRef.current) {
      const tabPosition = getIndicatorPosition(index);
      const tabWidth = tabWidths[index] || 0;
      const centerPosition = tabPosition + tabWidth / 2;
      const scrollPosition = Math.max(0, centerPosition - screenWidth / 2);
      
      scrollViewRef.current.scrollTo({
        x: scrollPosition,
        animated: !isReducedMotionEnabled,
      });
    }
  };

  const onTabLayout = (index, event) => {
    const { width } = event.nativeEvent.layout;
    setTabWidths(prev => {
      const newWidths = [...prev];
      newWidths[index] = width;
      return newWidths;
    });
  };

  const getVariantStyles = () => {
    const tokens = BaseDesignTokens;
    
    if (therapeuticTheme) {
      const therapeuticColors = tokens.colors.therapeutic[therapeuticTheme];
      return {
        backgroundColor: therapeuticColors?.[50] || tokens.colors.primary[50],
        borderColor: therapeuticColors?.[200] || tokens.colors.primary[200],
      };
    }

    switch (variant) {
      case 'pills':
        return {
          backgroundColor: tokens.colors.gray[100],
          borderRadius: tokens.borderRadius.full,
          padding: tokens.spacing[1],
        };
      case 'underlined':
        return {
          backgroundColor: 'transparent',
          borderBottomWidth: 1,
          borderBottomColor: tokens.colors.border.primary,
        };
      case 'cards':
        return {
          backgroundColor: 'transparent',
          gap: tokens.spacing[2],
        };
      case 'minimal':
        return {
          backgroundColor: 'transparent',
        };
      default:
        return {
          backgroundColor: backgroundColor || tokens.colors.background.secondary,
          borderRadius: tokens.borderRadius.lg,
          padding: tokens.spacing[1],
        };
    }
  };

  const getTabStyles = (index) => {
    const tokens = BaseDesignTokens;
    const isActive = index === activeIndex;
    
    let baseStyles = {
      paddingVertical: getSizeStyles().paddingVertical,
      paddingHorizontal: getSizeStyles().paddingHorizontal,
      borderRadius: tokens.borderRadius.base,
      minHeight: getSizeStyles().minHeight,
      justifyContent: 'center',
      alignItems: 'center',
    };

    if (therapeuticTheme) {
      const therapeuticColors = tokens.colors.therapeutic[therapeuticTheme];
      if (isActive) {
        baseStyles.backgroundColor = therapeuticColors?.[500] || tokens.colors.primary[500];
      } else {
        baseStyles.backgroundColor = 'transparent';
      }
    } else {
      switch (variant) {
        case 'pills':
          baseStyles.backgroundColor = isActive 
            ? activeColor || tokens.colors.primary[500]
            : 'transparent';
          baseStyles.borderRadius = tokens.borderRadius.full;
          break;
        case 'underlined':
          baseStyles.backgroundColor = 'transparent';
          baseStyles.borderRadius = 0;
          baseStyles.borderBottomWidth = isActive ? 2 : 0;
          baseStyles.borderBottomColor = activeColor || tokens.colors.primary[500];
          break;
        case 'cards':
          baseStyles.backgroundColor = isActive
            ? activeColor || tokens.colors.background.primary
            : tokens.colors.background.secondary;
          baseStyles.borderWidth = 1;
          baseStyles.borderColor = isActive
            ? tokens.colors.primary[200]
            : tokens.colors.border.primary;
          baseStyles.borderRadius = tokens.borderRadius.lg;
          break;
        case 'minimal':
          baseStyles.backgroundColor = 'transparent';
          break;
        default:
          baseStyles.backgroundColor = isActive
            ? activeColor || tokens.colors.primary[500]
            : 'transparent';
      }
    }

    return baseStyles;
  };

  const getTextStyles = (index) => {
    const tokens = BaseDesignTokens;
    const isActive = index === activeIndex;
    
    let textColor;
    if (therapeuticTheme) {
      textColor = isActive ? '#FFFFFF' : tokens.colors.therapeutic[therapeuticTheme]?.[700] || tokens.colors.primary[700];
    } else {
      switch (variant) {
        case 'pills':
        case 'default':
          textColor = isActive 
            ? '#FFFFFF' 
            : inactiveColor || tokens.colors.text.secondary;
          break;
        case 'underlined':
        case 'minimal':
          textColor = isActive
            ? activeColor || tokens.colors.primary[600]
            : inactiveColor || tokens.colors.text.secondary;
          break;
        case 'cards':
          textColor = isActive
            ? tokens.colors.primary[600]
            : tokens.colors.text.secondary;
          break;
        default:
          textColor = isActive ? '#FFFFFF' : tokens.colors.text.secondary;
      }
    }

    return {
      color: textColor,
      fontSize: getSizeStyles().fontSize,
      fontWeight: isActive ? '600' : '500',
      textAlign: 'center',
    };
  };

  const getSizeStyles = () => {
    const tokens = BaseDesignTokens;
    
    switch (size) {
      case 'small':
        return {
          paddingVertical: tokens.spacing[2],
          paddingHorizontal: tokens.spacing[3],
          fontSize: tokens.typography.sizes.sm,
          minHeight: 32,
        };
      case 'large':
        return {
          paddingVertical: tokens.spacing[4],
          paddingHorizontal: tokens.spacing[6],
          fontSize: tokens.typography.sizes.lg,
          minHeight: 48,
        };
      default:
        return {
          paddingVertical: tokens.spacing[3],
          paddingHorizontal: tokens.spacing[4],
          fontSize: tokens.typography.sizes.base,
          minHeight: 40,
        };
    }
  };

  const renderIndicator = () => {
    if (!showIndicator || variant === 'underlined') return null;

    const tokens = BaseDesignTokens;
    const indicatorWidth = getIndicatorWidth();
    
    if (indicatorStyle === 'line') {
      return (
        <Animated.View
          style={[
            styles.indicator,
            {
              width: indicatorWidth,
              backgroundColor: indicatorColor || tokens.colors.primary[500],
              transform: [{ translateX: indicatorAnim }],
            },
          ]}
        />
      );
    }

    return null;
  };

  const TabContent = ({ tab, index }) => (
    <View style={styles.tabContent}>
      {tab.icon && (
        <View style={styles.tabIcon}>
          {tab.icon}
        </View>
      )}
      <Text
        style={[getTextStyles(index), labelStyle]}
        numberOfLines={1}
        ellipsizeMode="tail"
      >
        {tab.label || tab.title || tab}
      </Text>
      {tab.badge && (
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{tab.badge}</Text>
        </View>
      )}
    </View>
  );

  const variantStyles = getVariantStyles();
  const spacing = getTabSpacing();

  return (
    <View
      style={[styles.container, style]}
      onLayout={(e) => setContainerWidth(e.nativeEvent.layout.width)}
      testID={testID || 'tab-component'}
    >
      <View style={[styles.tabsContainer, variantStyles]}>
        {scrollable ? (
          <ScrollView
            ref={scrollViewRef}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}
          >
            {tabs.map((tab, index) => (
              <Animated.View
                key={tab.key || index}
                style={{
                  transform: [{ scale: scaleAnims[index] }],
                  marginRight: index < tabs.length - 1 ? spacing : 0,
                }}
                onLayout={(e) => onTabLayout(index, e)}
              >
                <TouchableOpacity
                  style={[getTabStyles(index), tabStyle]}
                  onPress={() => handleTabPress(index)}
                  activeOpacity={0.7}
                  accessible={true}
                  accessibilityRole="tab"
                  accessibilityState={{ selected: index === activeIndex }}
                  accessibilityLabel={tab.accessibilityLabel || tab.label || tab.title || tab}
                  testID={`tab-${index}`}
                >
                  <TabContent tab={tab} index={index} />
                </TouchableOpacity>
              </Animated.View>
            ))}
          </ScrollView>
        ) : (
          <View style={[styles.tabsRow, { gap: spacing }]}>
            {tabs.map((tab, index) => (
              <Animated.View
                key={tab.key || index}
                style={[
                  { transform: [{ scale: scaleAnims[index] }] },
                  fullWidth && styles.fullWidthTab,
                ]}
                onLayout={(e) => onTabLayout(index, e)}
              >
                <TouchableOpacity
                  style={[getTabStyles(index), tabStyle]}
                  onPress={() => handleTabPress(index)}
                  activeOpacity={0.7}
                  accessible={true}
                  accessibilityRole="tab"
                  accessibilityState={{ selected: index === activeIndex }}
                  accessibilityLabel={tab.accessibilityLabel || tab.label || tab.title || tab}
                  testID={`tab-${index}`}
                >
                  <TabContent tab={tab} index={index} />
                </TouchableOpacity>
              </Animated.View>
            ))}
          </View>
        )}
        {renderIndicator()}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  tabsContainer: {
    position: 'relative',
  },
  tabsRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  fullWidthTab: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
  },
  tabContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabIcon: {
    marginRight: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badge: {
    marginLeft: 6,
    backgroundColor: '#FF4444',
    borderRadius: 10,
    minWidth: 18,
    height: 18,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '600',
    textAlign: 'center',
  },
  indicator: {
    position: 'absolute',
    bottom: 0,
    height: 3,
    borderRadius: 1.5,
  },
});

TabComponent.propTypes = {
  tabs: PropTypes.arrayOf(
    PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.shape({
        key: PropTypes.string,
        label: PropTypes.string,
        title: PropTypes.string,
        icon: PropTypes.node,
        badge: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        accessibilityLabel: PropTypes.string,
      }),
    ])
  ).isRequired,
  activeTabIndex: PropTypes.number,
  onTabChange: PropTypes.func,
  variant: PropTypes.oneOf(['default', 'pills', 'underlined', 'cards', 'minimal']),
  size: PropTypes.oneOf(['small', 'medium', 'large']),
  fullWidth: PropTypes.bool,
  scrollable: PropTypes.bool,
  showIndicator: PropTypes.bool,
  indicatorStyle: PropTypes.oneOf(['line', 'dot']),
  therapeuticTheme: PropTypes.oneOf([
    'calming', 'nurturing', 'peaceful', 'grounding', 
    'energizing', 'focus', 'mindful', 'balance'
  ]),
  withHaptics: PropTypes.bool,
  animationDuration: PropTypes.number,
  tabSpacing: PropTypes.oneOf(['tight', 'default', 'loose']),
  backgroundColor: PropTypes.string,
  activeColor: PropTypes.string,
  inactiveColor: PropTypes.string,
  indicatorColor: PropTypes.string,
  style: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  tabStyle: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  labelStyle: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  testID: PropTypes.string,
};

export default TabComponent;