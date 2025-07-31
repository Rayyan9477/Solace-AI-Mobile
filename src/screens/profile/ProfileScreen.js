import React, { useState } from 'react';
import * as Haptics from 'expo-haptics';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  Alert,
  BackHandler,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../../contexts/ThemeContext';
import { colors, typography, spacing, borderRadius, shadows } from '../../styles/theme';
import { updatePreferences, setTheme } from '../../store/slices/userSlice';
import { logout } from '../../store/slices/authSlice';
import ProfileHeader from '../../components/profile/ProfileHeader';
import SettingsSection from '../../components/profile/SettingsSection';
import StatsCard from '../../components/profile/StatsCard';

const ProfileScreen = () => {
  const navigation = useNavigation();

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
  const dispatch = useDispatch();
  const { isDarkMode, toggleTheme } = useTheme();
  
  const { user, auth } = useSelector(state => ({
    user: state.user,
    auth: state.auth,
  }));

  

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: () => {
            dispatch(logout());
          },
        },
      ]
    );
  };

  const handleThemeToggle = (value) => {
    toggleTheme();
    dispatch(setTheme(value ? 'dark' : 'light'));
  };

  const handleNotificationToggle = (type, value) => {
    dispatch(updatePreferences({
      notifications: {
        ...user.preferences.notifications,
        [type]: value,
      },
    }));
  };

  const handlePrivacyToggle = (type, value) => {
    dispatch(updatePreferences({
      privacy: {
        ...user.preferences.privacy,
        [type]: value,
      },
    }));
  };

  const handleEditProfile = () => {
    navigation.navigate('EditProfile');
  };

  const handleEmergencyContacts = () => {
    navigation.navigate('EmergencyContacts');
  };

  const handleDataExport = () => {
    Alert.alert(
      'Export Data',
      'This will export all your data including mood entries, chat history, and assessments. This may take a few minutes.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Export', onPress: () => {/* TODO: Implement data export */} },
      ]
    );
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      'Delete Account',
      'This action cannot be undone. All your data will be permanently deleted.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete Account',
          style: 'destructive',
          onPress: () => {
            // TODO: Implement account deletion
            Alert.alert('Feature Coming Soon', 'Account deletion will be available in a future update.');
          },
        },
      ]
    );
  };

  const handleDesignSystem = () => {
    navigation.navigate('DesignSystem');
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background.primary }]}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Profile Header */}
        <ProfileHeader
          name={user.profile.name || 'User'}
          email={user.profile.email || auth.email}
          avatar={user.profile.avatar}
          onEdit={handleEditProfile}
        />

        {/* Stats Cards */}
        <View style={styles.statsContainer}>
          <StatsCard
            title="Total Sessions"
            value={user.stats.totalSessions}
            icon="💬"
            color={theme.colors.primary[500]}
          />
          <StatsCard
            title="Current Streak"
            value={user.stats.streakDays}
            subtitle="days"
            icon="🔥"
            color={theme.colors.secondary[500]}
          />
          <StatsCard
            title="Mood Entries"
            value={user.stats.moodEntriesCount}
            icon="📊"
            color={theme.colors.success[500]}
          />
          <StatsCard
            title="Assessments"
            value={user.stats.assessmentsCompleted}
            icon="📋"
            color={theme.colors.warning[500]}
          />
        </View>

        {/* Settings Sections */}
        <SettingsSection title="Notifications">
          <View style={styles.settingItem}>
            <Text style={[styles.settingLabel, { color: theme.colors.text.primary }]}>
              Mood Reminders
            </Text>
            <Switch
              value={user.preferences.notifications.moodReminders}
              onValueChange={(value) => handleNotificationToggle('moodReminders', value)}
              trackColor={{ false: theme.colors.gray[300], true: theme.colors.primary[500] }}
              thumbColor={theme.colors.text.inverse}
            />
          </View>

          <View style={styles.settingItem}>
            <Text style={[styles.settingLabel, { color: theme.colors.text.primary }]}>
              Chat Messages
            </Text>
            <Switch
              value={user.preferences.notifications.chatMessages}
              onValueChange={(value) => handleNotificationToggle('chatMessages', value)}
              trackColor={{ false: theme.colors.gray[300], true: theme.colors.primary[500] }}
              thumbColor={theme.colors.text.inverse}
            />
          </View>

          <View style={styles.settingItem}>
            <Text style={[styles.settingLabel, { color: theme.colors.text.primary }]}>
              Assessment Due
            </Text>
            <Switch
              value={user.preferences.notifications.assessmentDue}
              onValueChange={(value) => handleNotificationToggle('assessmentDue', value)}
              trackColor={{ false: theme.colors.gray[300], true: theme.colors.primary[500] }}
              thumbColor={theme.colors.text.inverse}
            />
          </View>

          <View style={styles.settingItem}>
            <Text style={[styles.settingLabel, { color: theme.colors.text.primary }]}>
              Insights
            </Text>
            <Switch
              value={user.preferences.notifications.insights}
              onValueChange={(value) => handleNotificationToggle('insights', value)}
              trackColor={{ false: theme.colors.gray[300], true: theme.colors.primary[500] }}
              thumbColor={theme.colors.text.inverse}
            />
          </View>
        </SettingsSection>

        <SettingsSection title="Appearance">
          <View style={styles.settingItem}>
            <Text style={[styles.settingLabel, { color: theme.colors.text.primary }]}>
              Dark Mode
            </Text>
            <Switch
              value={isDarkMode}
              onValueChange={handleThemeToggle}
              trackColor={{ false: theme.colors.gray[300], true: theme.colors.primary[500] }}
              thumbColor={theme.colors.text.inverse}
            />
          </View>

          <TouchableOpacity
            style={[styles.settingButton, { minWidth: 44, minHeight: 44 }]}
            onPress={handleDesignSystem}
            accessible={true}
            accessibilityRole="button"
            accessibilityLabel="Design System"
            accessibilityHint="Customize colors and components"
          >
            <Text style={[styles.settingButtonText, { color: theme.colors.text.primary }]}>
              Design System
            </Text>
            <Text style={styles.settingButtonIcon}>🎨</Text>
          </TouchableOpacity>
        </SettingsSection>

        <SettingsSection title="Privacy">
          <View style={styles.settingItem}>
            <Text style={[styles.settingLabel, { color: theme.colors.text.primary }]}>
              Share Data for Research
            </Text>
            <Switch
              value={user.preferences.privacy.shareData}
              onValueChange={(value) => handlePrivacyToggle('shareData', value)}
              trackColor={{ false: theme.colors.gray[300], true: theme.colors.primary[500] }}
              thumbColor={theme.colors.text.inverse}
            />
          </View>

          <View style={styles.settingItem}>
            <Text style={[styles.settingLabel, { color: theme.colors.text.primary }]}>
              Analytics
            </Text>
            <Switch
              value={user.preferences.privacy.analytics}
              onValueChange={(value) => handlePrivacyToggle('analytics', value)}
              trackColor={{ false: theme.colors.gray[300], true: theme.colors.primary[500] }}
              thumbColor={theme.colors.text.inverse}
            />
          </View>
        </SettingsSection>

        <SettingsSection title="Account">
          <TouchableOpacity
            style={[styles.settingButton, { minWidth: 44, minHeight: 44 }]}
            onPress={handleEmergencyContacts}
            accessible={true}
            accessibilityRole="button"
            accessibilityLabel="Emergency Contacts"
            accessibilityHint="Double tap to get help"
          >
            <Text style={[styles.settingButtonText, { color: theme.colors.text.primary }]}>
              Emergency Contacts
            </Text>
            <Text style={styles.settingButtonIcon}>➡️</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.settingButton, { minWidth: 44, minHeight: 44 }]}
            onPress={handleDataExport}
            accessible={true}
            accessibilityRole="button"
            accessibilityLabel="Export My Data"
            accessibilityHint="Double tap to activate"
          >
            <Text style={[styles.settingButtonText, { color: theme.colors.text.primary }]}>
              Export My Data
            </Text>
            <Text style={styles.settingButtonIcon}>⬇️</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.settingButton, { minWidth: 44, minHeight: 44 }]}
            onPress={() => {
              Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
              handleDeleteAccount();
            }}
            accessible={true}
            accessibilityRole="button"
            accessibilityLabel="Delete account"
            accessibilityHint="Permanently delete your account and all data"
          >
            <Text style={[styles.settingButtonText, { color: theme.colors.error[500] }]}>
              Delete Account
            </Text>
            <Text style={styles.settingButtonIcon}>🗑️</Text>
          </TouchableOpacity>
        </SettingsSection>

        <View style={styles.logoutContainer}>
          <TouchableOpacity
            style={[styles.logoutButton, { backgroundColor: theme.colors.error[500], minWidth: 44, minHeight: 44 }]}
            onPress={handleLogout}
            accessible={true}
            accessibilityRole="button"
            accessibilityLabel="Logout"
            accessibilityHint="Double tap to activate"
          >
            <Text style={styles.logoutButtonText}>Logout</Text>
          </TouchableOpacity>
        </View>
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
  statsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: spacing[4],
    gap: spacing[3],
    marginBottom: spacing[4],
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing[3],
    paddingHorizontal: spacing[4],
    borderBottomWidth: 1,
    borderBottomColor: colors.gray[200],
  },
  settingLabel: {
    fontSize: typography.sizes.base,
    fontWeight: '400',
    lineHeight: typography.lineHeights.base,
  },
  settingButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing[4],
    paddingHorizontal: spacing[4],
    borderBottomWidth: 1,
    borderBottomColor: colors.gray[200],
  },
  settingButtonText: {
    fontSize: typography.sizes.base,
    fontWeight: '400',
    lineHeight: typography.lineHeights.base,
  },
  settingButtonIcon: {
    fontSize: typography.sizes.sm,
  },
  logoutContainer: {
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[6],
  },
  logoutButton: {
    paddingVertical: spacing[4],
    paddingHorizontal: spacing[6],
    borderRadius: borderRadius.md,
    alignItems: 'center',
    ...shadows.base,
  },
  logoutButtonText: {
    color: colors.text.inverse,
    fontSize: typography.sizes.base,
    fontWeight: '600',
  },
});

export default ProfileScreen;
