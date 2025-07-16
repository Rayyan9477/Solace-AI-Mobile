import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useTheme } from '../../contexts/ThemeContext';

const WelcomeHeader = ({ greeting, userName, onProfilePress, onEmergencyPress }) => {
  const { theme } = useTheme();

  const getTimeBasedEmoji = () => {
    const hour = new Date().getHours();
    if (hour < 12) return '🌅';
    if (hour < 17) return '☀️';
    return '🌙';
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background.primary }]}>
      <View style={styles.mainContent}>
        <Text style={[styles.greeting, { color: theme.colors.text.secondary }]}>
          {greeting} {getTimeBasedEmoji()}
        </Text>
        <Text style={[styles.userName, { color: theme.colors.text.primary }]}>
          {userName}
        </Text>
        <Text style={[styles.subtitle, { color: theme.colors.text.tertiary }]}>
          How are you feeling today?
        </Text>
      </View>
      
      <View style={styles.headerActions}>
        <TouchableOpacity
          style={[[
            styles.avatarButton, 
            { backgroundColor: theme.colors.primary[100] , { minWidth: 44, minHeight: 44 }]}
          ]}
          onPress={onProfilePress}
          activeOpacity={0.8}
          accessible={true}
          accessibilityRole="button"
          accessibilityLabel="Profile"
          accessibilityHint="Double tap to view your profile"
        >
          <Text style={[styles.avatarText, { color: theme.colors.primary[700] }]}>
            {userName.charAt(0).toUpperCase()}
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[[
            styles.emergencyButton, 
            { backgroundColor: theme.colors.error[500] , { minWidth: 44, minHeight: 44 }]}
          ]}
          onPress={onEmergencyPress}
          activeOpacity={0.8}
          accessible={true}
          accessibilityRole="button"
          accessibilityLabel="Emergency Help"
          accessibilityHint="Double tap to access emergency support"
        >
          <Text style={styles.emergencyText}>⚠️</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingHorizontal: 16,
    paddingTop: 48,
    paddingBottom: 24,
  },
  mainContent: {
    flex: 1,
    paddingRight: 16,
  },
  greeting: {
    fontSize: 16,
    fontWeight: '400',
    lineHeight: 24,
    marginBottom: 4,
  },
  userName: {
    fontSize: 24,
    fontWeight: '700',
    lineHeight: 32,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    fontWeight: '400',
    lineHeight: 20,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  avatarButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: theme.colors.text.primary,
    shadowOffset: { width: 44, height: 44 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  avatarText: {
    fontSize: 16,
    fontWeight: '600',
  },
  emergencyButton: {
    width: 44, height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: theme.colors.text.primary,
    shadowOffset: { width: 44, height: 44 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  emergencyText: {
    fontSize: 12,
  },
});

export default WelcomeHeader;
