import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, StatusBar, Platform } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../../contexts/ThemeContext';
import { hapticUtils, styleUtils, screenUtils } from '../../utils/platformOptimizations';
import Icon from '../common/Icon';

const SafeNavigationHeader = ({
  title,
  subtitle,
  showBack = true,
  showEmergency = true,
  onBackPress,
  onEmergencyPress,
  backgroundColor,
  emergencyText = "Need Help Now?",
  backText = "Back",
  style,
}) => {
  const navigation = useNavigation();
  const { theme } = useTheme();

  const handleBackPress = () => {
    hapticUtils.impact('light');
    
    if (onBackPress) {
      onBackPress();
    } else if (navigation.canGoBack()) {
      navigation.goBack();
    } else {
      // Navigate to a safe screen if can't go back
      navigation.navigate('Dashboard');
    }
  };

  const handleEmergencyPress = () => {
    hapticUtils.notification('warning');
    
    if (onEmergencyPress) {
      onEmergencyPress();
    } else {
      // Default emergency action - navigate to crisis support
      navigation.navigate('CrisisSupport');
    }
  };

  const getHeaderStyle = () => {
    const safeAreaInsets = screenUtils.getSafeAreaInsets();
    
    return {
      backgroundColor: backgroundColor || theme.colors.background.primary,
      paddingTop: Platform.select({
        ios: safeAreaInsets.top || 44,
        android: safeAreaInsets.top || StatusBar.currentHeight || 24,
        web: 0,
      }),
      minHeight: Platform.select({
        ios: 88 + (safeAreaInsets.top || 44),
        android: 56 + (safeAreaInsets.top || 24),
        web: 64,
      }),
      ...styleUtils.createShadow(1),
    };
  };

  return (
    <View style={[styles.container, { borderBottomColor: theme.colors.border.primary }, getHeaderStyle(), style]}>
      <View style={styles.headerContent}>
        {/* Back Button */}
        {showBack && (
          <TouchableOpacity
            style={[
              styles.navigationButton,
              styles.backButton,
              { backgroundColor: theme.colors.background.secondary }
            ]}
            onPress={handleBackPress}
            accessible={true}
            accessibilityRole="button"
            accessibilityLabel={`${backText} button`}
            accessibilityHint="Double tap to go back to the previous screen"
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Icon 
              name="arrow-left" 
              size={20} 
              color={theme.colors.text.primary} 
            />
            <Text style={[styles.buttonText, { color: theme.colors.text.primary }]}>
              {backText}
            </Text>
          </TouchableOpacity>
        )}

        {/* Title Section */}
        <View style={styles.titleContainer}>
          {title && (
            <Text 
              style={[styles.title, { color: theme.colors.text.primary }]}
              numberOfLines={1}
              ellipsizeMode="tail"
            >
              {title}
            </Text>
          )}
          {subtitle && (
            <Text 
              style={[styles.subtitle, { color: theme.colors.text.secondary }]}
              numberOfLines={1}
              ellipsizeMode="tail"
            >
              {subtitle}
            </Text>
          )}
        </View>

        {/* Emergency Button */}
        {showEmergency && (
          <TouchableOpacity
            style={[
              styles.navigationButton,
              styles.emergencyButton,
              { 
                backgroundColor: theme.colors.therapeutic.nurturing[50],
                borderColor: theme.colors.therapeutic.nurturing[300],
              }
            ]}
            onPress={handleEmergencyPress}
            accessible={true}
            accessibilityRole="button"
            accessibilityLabel="Emergency help button"
            accessibilityHint="Double tap to access immediate crisis support and emergency resources"
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Text style={styles.emergencyIcon}>🆘</Text>
            <Text style={[
              styles.buttonText, 
              styles.emergencyText,
              { color: theme.colors.therapeutic.nurturing[700] }
            ]}>
              {emergencyText}
            </Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Progress Indicator (if needed) */}
      <ProgressBreadcrumb />
    </View>
  );
};

// Optional breadcrumb component for multi-step processes
const ProgressBreadcrumb = ({ steps, currentStep, visible = false }) => {
  const { theme } = useTheme();
  
  if (!visible || !steps || steps.length <= 1) return null;

  return (
    <View style={styles.breadcrumbContainer}>
      {steps.map((step, index) => {
        const isActive = index === currentStep;
        const isCompleted = index < currentStep;
        
        return (
          <View key={index} style={styles.breadcrumbItem}>
            <View style={[
              styles.breadcrumbDot,
              {
                backgroundColor: isCompleted 
                  ? theme.colors.therapeutic.calming[500]
                  : isActive 
                    ? theme.colors.primary[500]
                    : theme.colors.gray[300]
              }
            ]} />
            <Text style={[
              styles.breadcrumbText,
              {
                color: isActive 
                  ? theme.colors.text.primary 
                  : theme.colors.text.secondary
              }
            ]}>
              {step}
            </Text>
            {index < steps.length - 1 && (
              <View style={[
                styles.breadcrumbConnector,
                { backgroundColor: theme.colors.gray[300] }
              ]} />
            )}
          </View>
        );
      })}
    </View>
  );
};

// Specialized headers for different contexts
const CrisisAwareHeader = (props) => (
  <SafeNavigationHeader
    {...props}
    showEmergency={true}
    emergencyText="Crisis Help"
    backgroundColor={props.theme?.colors.therapeutic.calming[50]}
  />
);

const TherapeuticHeader = (props) => (
  <SafeNavigationHeader
    {...props}
    showEmergency={true}
    emergencyText="Support"
    backgroundColor={props.theme?.colors.background.primary}
  />
);

const AssessmentHeader = ({ currentQuestion, totalQuestions, ...props }) => (
  <SafeNavigationHeader
    {...props}
    title={`Question ${currentQuestion} of ${totalQuestions}`}
    showEmergency={true}
    emergencyText="Skip to End"
  />
);

const styles = StyleSheet.create({
  container: {
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    minHeight: 44,
  },
  navigationButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    minWidth: 48,
    minHeight: 36,
  },
  backButton: {
    flex: 0,
  },
  emergencyButton: {
    borderWidth: 1,
    flex: 0,
  },
  buttonText: {
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 6,
  },
  emergencyText: {
    fontWeight: '600',
  },
  emergencyIcon: {
    fontSize: 16,
    marginRight: 4,
  },
  titleContainer: {
    flex: 1,
    alignItems: 'center',
    marginHorizontal: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
    lineHeight: 24,
  },
  subtitle: {
    fontSize: 14,
    textAlign: 'center',
    marginTop: 2,
    lineHeight: 18,
  },
  breadcrumbContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
    paddingBottom: 12,
  },
  breadcrumbItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  breadcrumbDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  breadcrumbText: {
    fontSize: 12,
    fontWeight: '500',
  },
  breadcrumbConnector: {
    width: 20,
    height: 1,
    marginHorizontal: 8,
  },
});

export default SafeNavigationHeader;
export { CrisisAwareHeader, TherapeuticHeader, AssessmentHeader, ProgressBreadcrumb };