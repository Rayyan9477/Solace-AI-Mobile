import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Switch,
  TouchableOpacity,
  Alert,
  Slider,
} from 'react-native';
import { useTheme } from '../../contexts/ThemeContext';
import { createFormInputAccessibility, createCardAccessibility } from '../../utils/accessibility';

const AccessibilitySettingsScreen = ({

  // Handle hardware back button on Android
  React.useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      () => {
        if (navigation.canGoBack()) {
          navigation.goBack();
          return true;
        }
        return false;
      }
    );

    return () => backHandler.remove();
  }, [navigation]);
 navigation }) => {
  const { 
    theme, 
    isReducedMotionEnabled,
    isHighContrastEnabled,
    fontSize,
    setFontSize,
    fontScale,
    setFontScale,
    isScreenReaderEnabled,
    accessibilitySettings,
    updateAccessibilitySettings,
  } = useTheme();

  const [localSettings, setLocalSettings] = useState({
    announceChanges: true,
    hapticFeedback: true,
    voiceOver: false,
    largeCursor: false,
    ...accessibilitySettings,
  });

  useEffect(() => {
    setLocalSettings(prev => ({ ...prev, ...accessibilitySettings }));
  }, [accessibilitySettings]);

  const handleSettingChange = (setting, value) => {
    const newSettings = { ...localSettings, [setting]: value };
    setLocalSettings(newSettings);
    updateAccessibilitySettings({ [setting]: value });
  };

  const handleFontSizeChange = (newSize) => {
    setFontSize(newSize);
    // TODO: Implement actual font scaling
    Alert.alert('Font Size Changed', `Font size set to ${newSize}`);
  };

  const handleFontScaleChange = (scale) => {
    setFontScale(scale);
  };

  const resetToDefaults = () => {
    Alert.alert(
      'Reset Accessibility Settings',
      'Are you sure you want to reset all accessibility settings to default values?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reset',
          style: 'destructive',
          onPress: () => {
            const defaultSettings = {
              announceChanges: true,
              hapticFeedback: true,
              voiceOver: false,
              largeCursor: false,
            };
            setLocalSettings(defaultSettings);
            updateAccessibilitySettings(defaultSettings);
            setFontSize('normal');
            setFontScale(1);
          },
        },
      ]
    );
  };

  const getFontSizeLabel = (size) => {
    const labels = {
      small: 'Small',
      normal: 'Normal',
      large: 'Large',
      extraLarge: 'Extra Large',
    };
    return labels[size] || 'Normal';
  };

  const SettingCard = ({ title, description, children, accessibilityLabel }) => (
    <View 
      style={[styles.settingCard, { 
        backgroundColor: theme.colors.background.secondary,
        borderColor: theme.colors.gray[200],
      }]}
      {...createCardAccessibility(title, description)}
    >
      <View style={styles.settingHeader}>
        <Text style={[styles.settingTitle, { color: theme.colors.text.primary }]}>
          {title}
        </Text>
        {description && (
          <Text style={[styles.settingDescription, { color: theme.colors.text.secondary }]}>
            {description}
          </Text>
        )}
      </View>
      {children}
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background.primary }]}>
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        accessibilityRole="scrollbar"
        accessibilityLabel="Accessibility settings"
      >
        <Text 
          style={[styles.screenTitle, { color: theme.colors.text.primary }]}
          accessibilityRole="header"
          accessibilityLevel={1}
        >
          Accessibility Settings
        </Text>

        <Text 
          style={[styles.subtitle, { color: theme.colors.text.secondary }]}
          accessibilityRole="text"
        >
          Customize the app to meet your accessibility needs
        </Text>

        {/* System Information */}
        <SettingCard
          title="System Status"
          description="Current accessibility features detected by the system"
        >
          <View style={styles.statusContainer}>
            <View style={styles.statusItem}>
              <Text style={[styles.statusLabel, { color: theme.colors.text.secondary }]}>
                Screen Reader:
              </Text>
              <Text style={[styles.statusValue, { 
                color: isScreenReaderEnabled ? theme.colors.success[500] : theme.colors.text.secondary 
              }]}>
                {isScreenReaderEnabled ? 'Enabled' : 'Disabled'}
              </Text>
            </View>
            <View style={styles.statusItem}>
              <Text style={[styles.statusLabel, { color: theme.colors.text.secondary }]}>
                Reduced Motion:
              </Text>
              <Text style={[styles.statusValue, { 
                color: isReducedMotionEnabled ? theme.colors.success[500] : theme.colors.text.secondary 
              }]}>
                {isReducedMotionEnabled ? 'Enabled' : 'Disabled'}
              </Text>
            </View>
            <View style={styles.statusItem}>
              <Text style={[styles.statusLabel, { color: theme.colors.text.secondary }]}>
                High Contrast:
              </Text>
              <Text style={[styles.statusValue, { 
                color: isHighContrastEnabled ? theme.colors.success[500] : theme.colors.text.secondary 
              }]}>
                {isHighContrastEnabled ? 'Enabled' : 'Disabled'}
              </Text>
            </View>
          </View>
        </SettingCard>

        {/* Font Settings */}
        <SettingCard
          title="Text & Display"
          description="Adjust font size and text display settings"
        >
          <View style={styles.settingRow}>
            <Text style={[styles.settingLabel, { color: theme.colors.text.primary }]}>Font Size Control</Text>
            <View style={styles.fontSizeButtons}>
              {['small', 'normal', 'large', 'extraLarge'].map((size) => (
                <TouchableOpacity
                  key={size}
                  style={[[
                    styles.fontSizeButton,
                    {
                      backgroundColor: fontSize === size 
                        ? theme.colors.primary[500] 
                        : theme.colors.background.primary,
                      borderColor: theme.colors.primary[500],
                    , { minWidth: 44, minHeight: 44 }]}
                  ]}
                  onPress={() =
        accessible={true}
        accessibilityRole="button"
        accessibilityLabel="{getFontSizeLabel(size)}"
        accessibilityHint="Double tap to activate"
      > handleFontSizeChange(size)}
                  accessibilityRole="radio"
                  accessibilityLabel={`Font size ${getFontSizeLabel(size)}`}
                  accessibilityState={{ checked: fontSize === size }}
                  accessibilityHint="Double tap to select this font size"
                >
                  <Text style={[
                    styles.fontSizeButtonText,
                    {
                      color: fontSize === size 
                        ? theme.colors.text.inverse 
                        : theme.colors.primary[500],
                      fontSize: size === 'small' ? 12 : size === 'large' ? 18 : size === 'extraLarge' ? 20 : 14,
                    }
                  ]}>
                    {getFontSizeLabel(size)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={styles.settingRow}>
            <Text style={[styles.settingLabel, { color: theme.colors.text.primary }]}>
              Font Scale Control: {fontScale.toFixed(1)}x
            </Text>
            <Slider
              style={styles.slider}
              minimumValue={0.8}
              maximumValue={2.0}
              step={0.1}
              value={fontScale}
              onValueChange={handleFontScaleChange}
              minimumTrackTintColor={theme.colors.primary[500]}
              maximumTrackTintColor={theme.colors.gray[300]}
              thumbStyle={{ backgroundColor: theme.colors.primary[500] }}
              accessibilityRole="adjustable"
              accessibilityLabel="Font scale slider"
              accessibilityHint="Swipe left or right to adjust font scaling"
              accessibilityValue={{
                min: 0.8,
                max: 2.0,
                now: fontScale,
                text: `${fontScale.toFixed(1)} times normal size`
              }}
            />
          </View>
        </SettingCard>

        {/* App Behavior Settings */}
        <SettingCard
          title="App Behavior"
          description="Control how the app responds and provides feedback"
        >
          <View style={styles.settingRow}>
            <View style={styles.settingInfo}>
              <Text style={[styles.settingLabel, { color: theme.colors.text.primary }]}>
                Announce Changes
              </Text>
              <Text style={[styles.settingDescription, { color: theme.colors.text.secondary }]}>
                Announce important changes for screen readers
              </Text>
            </View>
            <Switch
              value={localSettings.announceChanges}
              onValueChange={(value) => handleSettingChange('announceChanges', value)}
              trackColor={{
                false: theme.colors.gray[300],
                true: theme.colors.primary[200],
              }}
              thumbColor={localSettings.announceChanges ? theme.colors.primary[500] : theme.colors.gray[500]}
              accessibilityRole="switch"
              accessibilityLabel="Announce changes"
              accessibilityHint="Toggle to enable or disable change announcements"
            />
          </View>

          <View style={styles.settingRow}>
            <View style={styles.settingInfo}>
              <Text style={[styles.settingLabel, { color: theme.colors.text.primary }]}>
                Haptic Feedback Toggle
              </Text>
              <Text style={[styles.settingDescription, { color: theme.colors.text.secondary }]}>
                Provide tactile feedback for interactions
              </Text>
            </View>
            <Switch
              value={localSettings.hapticFeedback}
              onValueChange={(value) => handleSettingChange('hapticFeedback', value)}
              trackColor={{
                false: theme.colors.gray[300],
                true: theme.colors.primary[200],
              }}
              thumbColor={localSettings.hapticFeedback ? theme.colors.primary[500] : theme.colors.gray[500]}
              accessibilityRole="switch"
              accessibilityLabel="Haptic feedback toggle"
              accessibilityHint="Toggle to enable or disable haptic feedback"
            />
          </View>

          <View style={styles.settingRow}>
            <View style={styles.settingInfo}>
              <Text style={[styles.settingLabel, { color: theme.colors.text.primary }]}>
                Screen Reader Support
              </Text>
              <Text style={[styles.settingDescription, { color: theme.colors.text.secondary }]}>
                Enhanced voice navigation support
              </Text>
            </View>
            <Switch
              value={localSettings.voiceOver}
              onValueChange={(value) => handleSettingChange('voiceOver', value)}
              trackColor={{
                false: theme.colors.gray[300],
                true: theme.colors.primary[200],
              }}
              thumbColor={localSettings.voiceOver ? theme.colors.primary[500] : theme.colors.gray[500]}
              accessibilityRole="switch"
              accessibilityLabel="Screen reader support"
              accessibilityHint="Toggle to enable or disable voice control features"
            />
          </View>

          <View style={styles.settingRow}>
            <View style={styles.settingInfo}>
              <Text style={[styles.settingLabel, { color: theme.colors.text.primary }]}>
                High Contrast Mode
              </Text>
              <Text style={[styles.settingDescription, { color: theme.colors.text.secondary }]}>
                Increase color contrast for better visibility
              </Text>
            </View>
            <Switch
              value={isHighContrastEnabled}
              onValueChange={(value) => handleSettingChange('highContrast', value)}
              trackColor={{
                false: theme.colors.gray[300],
                true: theme.colors.primary[200],
              }}
              thumbColor={isHighContrastEnabled ? theme.colors.primary[500] : theme.colors.gray[500]}
              accessibilityRole="switch"
              accessibilityLabel="High contrast mode"
              accessibilityHint="Toggle to enable or disable high contrast colors"
            />
          </View>
        </SettingCard>

        {/* Mental Health Specific Settings */}
        <SettingCard
          title="Mental Health Features"
          description="Accessibility features specific to mental health support"
        >
          <TouchableOpacity
            style={[[styles.actionButton, { 
              backgroundColor: theme.colors.therapeutic.calming,
              borderColor: theme.colors.therapeutic.calming,
            , { minWidth: 44, minHeight: 44 }]}]}
            onPress={() =
        accessible={true}
        accessibilityRole="button"
        accessibilityLabel="Emergency Resources"
        accessibilityHint="Double tap to get help"
      > navigation.navigate('CrisisResources')}
            accessibilityRole="button"
            accessibilityLabel="Crisis resources"
            accessibilityHint="Double tap to view emergency mental health resources"
          >
            <Text style={[styles.actionButtonText, { color: theme.colors.text.inverse }]}>
              Emergency Resources
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[[styles.actionButton, { 
              backgroundColor: theme.colors.background.primary,
              borderColor: theme.colors.primary[500],
            , { minWidth: 44, minHeight: 44 }]}]}
            onPress={() =
        accessible={true}
        accessibilityRole="button"
        accessibilityLabel="Accessibility Guide"
        accessibilityHint="Double tap to activate"
      > navigation.navigate('AccessibilityGuide')}
            accessibilityRole="button"
            accessibilityLabel="Accessibility guide"
            accessibilityHint="Double tap to view app accessibility features guide"
          >
            <Text style={[styles.actionButtonText, { color: theme.colors.primary[500] }]}>
              Accessibility Guide
            </Text>
          </TouchableOpacity>
        </SettingCard>

        {/* Reset Settings */}
        <TouchableOpacity
          style={[[styles.resetButton, { 
            backgroundColor: theme.colors.error[500],
            borderColor: theme.colors.error[500],
          , { minWidth: 44, minHeight: 44 }]}]}
          onPress={resetToDefaults}
          accessibilityRole="button"
          accessibilityLabel="Reset accessibility settings"
          accessibilityHint="Double tap to reset all accessibility settings to default values"
        >
          <Text style={[styles.resetButtonText, { color: theme.colors.text.inverse }]}>
            Reset to Defaults
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
  },
  screenTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 24,
  },
  settingCard: {
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
  },
  settingHeader: {
    marginBottom: 16,
  },
  settingTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
  },
  settingDescription: {
    fontSize: 14,
    lineHeight: 20,
  },
  settingRow: {
    marginBottom: 16,
  },
  settingInfo: {
    flex: 1,
    marginBottom: 8,
  },
  settingLabel: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 4,
  },
  statusContainer: {
    gap: 12,
  },
  statusItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statusLabel: {
    fontSize: 14,
    fontWeight: '500',
  },
  statusValue: {
    fontSize: 14,
    fontWeight: '600',
  },
  fontSizeButtons: {
    flexDirection: 'row',
    gap: 8,
    flexWrap: 'wrap',
  },
  fontSizeButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 22,
    borderWidth: 1,
  },
  fontSizeButtonText: {
    fontWeight: '500',
  },
  slider: {
    width: '100%',
    height: 44,
    marginTop: 8,
  },
  actionButton: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    marginBottom: 12,
    alignItems: 'center',
  },
  actionButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  resetButton: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: 'center',
    marginTop: 16,
  },
  resetButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
});

export default AccessibilitySettingsScreen;
