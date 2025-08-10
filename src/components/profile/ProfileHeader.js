import React, { useMemo, useCallback } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { useTheme } from '../../contexts/ThemeContext';
import { colors, typography, spacing, borderRadius, shadows } from '../../styles/theme';

const ProfileHeader = ({ name, email, avatar, onEdit }) => {
  const { theme } = useTheme();
  

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background.secondary }]}>
      <View style={styles.avatarContainer}>
        {avatar ? (
          <Image source={{ uri: avatar }} style={styles.avatar} resizeMode="cover" />
        ) : (
          <View style={[styles.avatarPlaceholder, { backgroundColor: theme.colors.primary[500] }]}>
            <Text style={styles.avatarText}>
              {name.charAt(0).toUpperCase()}
            </Text>
          </View>
        )}
        <TouchableOpacity 
          style={[styles.editAvatarButton, { backgroundColor: theme.colors.primary[500], minWidth: 44, minHeight: 44 }]}
          onPress={onEdit}
          accessible={true}
          accessibilityRole="button"
          accessibilityLabel="✏️"
          accessibilityHint="Double tap to activate"
        >
          <Text style={styles.editAvatarIcon}>✏️</Text>
        </TouchableOpacity>
      </View>
      
      <View style={styles.infoContainer}>
        <Text style={[styles.name, { color: theme.colors.text.primary }]}>
          {name}
        </Text>
        <Text style={[styles.email, { color: theme.colors.text.secondary }]}>
          {email}
        </Text>
      </View>
      
      <TouchableOpacity 
        style={[styles.editButton, { backgroundColor: theme.colors.primary[500], minWidth: 44, minHeight: 44 }]}
        onPress={onEdit}
        accessible={true}
        accessibilityRole="button"
        accessibilityLabel="Edit Profile"
        accessibilityHint="Double tap to edit"
      >
        <Text style={styles.editButtonText}>Edit Profile</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingVertical: spacing[8],
    paddingHorizontal: spacing[4],
    marginBottom: spacing[4],
    ...shadows.base,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: spacing[4],
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: borderRadius.full,
  },
  avatarPlaceholder: {
    width: 80,
    height: 80,
    borderRadius: borderRadius.full,
    justifyContent: 'center',
    alignItems: 'center',
    ...shadows.base,
  },
  avatarText: {
    color: '#FFFFFF', // Default white text for avatar
    fontSize: typography.sizes['3xl'],
    fontWeight: '700',
  },
  editAvatarButton: {
    position: 'absolute',
    bottom: -4,
    right: -4,
    width: 44, height: 44,
    borderRadius: borderRadius.full,
    justifyContent: 'center',
    alignItems: 'center',
    ...shadows.sm,
  },
  editAvatarIcon: {
    fontSize: typography.sizes.sm,
  },
  infoContainer: {
    alignItems: 'center',
    marginBottom: spacing[4],
  },
  name: {
    fontSize: typography.sizes['2xl'],
    fontWeight: '700',
    lineHeight: typography.lineHeights['2xl'],
    marginBottom: spacing[1],
  },
  email: {
    fontSize: typography.sizes.base,
    fontWeight: '400',
    lineHeight: typography.lineHeights.base,
  },
  editButton: {
    paddingVertical: spacing[3],
    paddingHorizontal: spacing[6],
    borderRadius: borderRadius.md,
    ...shadows.sm,
  },
  editButtonText: {
    color: '#FFFFFF', // Default white text for edit button
    fontSize: typography.sizes.base,
    fontWeight: '600',
  },
});

export default ProfileHeader;
