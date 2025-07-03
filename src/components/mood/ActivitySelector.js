import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useTheme } from '../../contexts/ThemeContext';
import { createListItemAccessibility, announceForAccessibility } from '../../utils/accessibility';
import { colors, typography, spacing, borderRadius, shadows } from '../../styles/theme';

const ActivitySelector = ({ selectedActivities, onActivityToggle }) => {
  const { theme, isScreenReaderEnabled } = useTheme();

  const handleActivityToggle = (activityId) => {
    const activity = activities.find(a => a.id === activityId);
    const isSelected = selectedActivities.includes(activityId);
    
    onActivityToggle(activityId);
    
    // Announce changes for screen reader users
    if (isScreenReaderEnabled && activity) {
      const action = isSelected ? 'removed' : 'added';
      announceForAccessibility(`${activity.label} ${action}`);
    }
  };
  

  const activities = [
    { id: 'work', label: 'Work', emoji: '💼' },
    { id: 'exercise', label: 'Exercise', emoji: '🏃' },
    { id: 'meditation', label: 'Meditation', emoji: '🧘' },
    { id: 'reading', label: 'Reading', emoji: '📚' },
    { id: 'socializing', label: 'Socializing', emoji: '👥' },
    { id: 'family', label: 'Family Time', emoji: '👨‍👩‍👧‍👦' },
    { id: 'hobby', label: 'Hobby', emoji: '🎨' },
    { id: 'music', label: 'Music', emoji: '🎵' },
    { id: 'cooking', label: 'Cooking', emoji: '🍳' },
    { id: 'gaming', label: 'Gaming', emoji: '🎮' },
    { id: 'tv', label: 'TV/Movies', emoji: '📺' },
    { id: 'sleep', label: 'Sleep', emoji: '😴' },
    { id: 'therapy', label: 'Therapy', emoji: '🗣️' },
    { id: 'shopping', label: 'Shopping', emoji: '🛍️' },
    { id: 'travel', label: 'Travel', emoji: '✈️' },
    { id: 'nature', label: 'Nature', emoji: '🌳' },
  ];

  return (
    <View style={styles.container}>
      <Text 
        style={[styles.subtitle, { color: theme.colors.text.secondary }]}
        accessibilityRole="text"
        accessibilityLabel="Select all activities that apply to your current mood"
      >
        Select all that apply
      </Text>
      
      <View 
        style={styles.activitiesGrid}
        accessibilityRole="list"
        accessibilityLabel={`Activity selector with ${activities.length} options`}
      >
        {activities.map((activity, index) => {
          const isSelected = selectedActivities.includes(activity.id);
          return (
            <TouchableOpacity
              key={activity.id}
              style={[
                styles.activityItem,
                {
                  backgroundColor: isSelected 
                    ? theme.colors.primary[500] 
                    : theme.colors.background.primary,
                  borderColor: isSelected 
                    ? theme.colors.primary[500] 
                    : theme.colors.gray[300],
                }
              ]}
              onPress={() => handleActivityToggle(activity.id)}
              activeOpacity={0.7}
              accessibilityRole="checkbox"
              accessibilityLabel={`${activity.label} activity`}
              accessibilityHint={isSelected 
                ? `Currently selected. Double tap to deselect ${activity.label}` 
                : `Double tap to select ${activity.label} activity`}
              accessibilityState={{
                checked: isSelected,
              }}
              {...createListItemAccessibility(
                activity.label,
                index + 1,
                activities.length,
                isSelected ? 'Tap to deselect' : 'Tap to select'
              )}
            >
              <Text 
                style={styles.activityEmoji}
                accessibilityElementsHidden={true}
              >
                {activity.emoji}
              </Text>
              <Text style={[
                styles.activityLabel,
                {
                  color: isSelected 
                    ? theme.colors.text.inverse 
                    : theme.colors.text.primary,
                }
              ]}>
                {activity.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
            ]}>
              {activity.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      
      {selectedActivities.length > 0 && (
        <View style={styles.selectedContainer}>
          <Text style={[styles.selectedTitle, { color: theme.colors.text.primary }]}>
            Selected Activities: {selectedActivities.length}
          </Text>
          <View style={styles.selectedList}>
            {selectedActivities.map((activityId) => {
              const activity = activities.find(a => a.id === activityId);
              return (
                <View key={activityId} style={styles.selectedItem}>
                  <Text style={styles.selectedEmoji}>{activity.emoji}</Text>
                  <Text style={[styles.selectedLabel, { color: theme.colors.text.secondary }]}>
                    {activity.label}
                  </Text>
                </View>
              );
            })}
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  subtitle: {
    fontSize: theme.typography.sizes.sm,
    fontWeight: '400',
    lineHeight: theme.typography.lineHeights.sm,
    marginBottom: theme.spacing[4],
  },
  activitiesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: theme.spacing[2],
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: theme.spacing[3],
    paddingVertical: theme.spacing[2],
    borderRadius: theme.borderRadius.full,
    borderWidth: 1,
    marginBottom: theme.spacing[2],
    ...theme.shadows.sm,
  },
  activityEmoji: {
    fontSize: theme.typography.sizes.base,
    marginRight: theme.spacing[2],
  },
  activityLabel: {
    fontSize: theme.typography.sizes.sm,
    fontWeight: '500',
    lineHeight: theme.typography.lineHeights.sm,
  },
  selectedContainer: {
    marginTop: theme.spacing[4],
    width: '100%',
    alignItems: 'center',
  },
  selectedTitle: {
    fontSize: theme.typography.sizes.base,
    fontWeight: '600',
    lineHeight: theme.typography.lineHeights.base,
    marginBottom: theme.spacing[3],
  },
  selectedList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: theme.spacing[2],
  },
  selectedItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: theme.spacing[2],
    paddingVertical: theme.spacing[1],
    backgroundColor: theme.colors.gray[100],
    borderRadius: theme.borderRadius.sm,
  },
  selectedEmoji: {
    fontSize: theme.typography.sizes.sm,
    marginRight: theme.spacing[1],
  },
  selectedLabel: {
    fontSize: theme.typography.sizes.xs,
    fontWeight: '400',
    lineHeight: theme.typography.lineHeights.xs,
  },
});

export default ActivitySelector;
