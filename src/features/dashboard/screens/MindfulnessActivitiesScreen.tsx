/**
 * MindfulnessActivitiesScreen Component
 * @description Mindfulness activities detail screen with resources
 * @task Task 3.5.6: Mindfulness Activities Screen (Screen 45)
 * @phase Phase 3C: Refactored to use theme tokens
 */

import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Image,
} from "react-native";
import { palette } from "../../../shared/theme";

interface Activity {
  id: string;
  name: string;
  icon: string;
}

interface VideoResource {
  id: string;
  title: string;
  thumbnail: string;
  duration: string;
}

interface ArticleResource {
  id: string;
  title: string;
  description: string;
  benefits: string[];
}

interface Resources {
  video: VideoResource;
  article: ArticleResource;
}

interface MindfulnessActivitiesScreenProps {
  title: string;
  suggestedActivities: Activity[];
  resources: Resources;
  isMarking: boolean;
  onBack: () => void;
  onSeeAllActivities: () => void;
  onSeeAllResources: () => void;
  onActivityPress: (id: string) => void;
  onVideoPlay: (id: string) => void;
  onMarkCompleted: () => void;
}

const getActivityEmoji = (icon: string): string => {
  switch (icon) {
    case "meditation":
      return "🧘";
    case "journal":
      return "📔";
    case "affirmation":
      return "💪";
    default:
      return "✨";
  }
};

export function MindfulnessActivitiesScreen({
  title,
  suggestedActivities,
  resources,
  isMarking,
  onBack,
  onSeeAllActivities,
  onSeeAllResources,
  onActivityPress,
  onVideoPlay,
  onMarkCompleted,
}: MindfulnessActivitiesScreenProps): React.ReactElement {
  return (
    <View testID="mindfulness-activities-screen" style={styles.container}>
      {/* Header Section - Green gradient */}
      <View testID="header-section" style={styles.headerSection}>
        <TouchableOpacity
          testID="back-button"
          style={styles.backButton}
          onPress={onBack}
          accessibilityRole="button"
          accessibilityLabel="Go back"
        >
          <Text style={styles.backButtonIcon}>{"<"}</Text>
        </TouchableOpacity>
        <Text style={styles.screenTitle}>{title}</Text>
      </View>

      {/* Content Section */}
      <ScrollView
        style={styles.contentSection}
        showsVerticalScrollIndicator={false}
      >
        {/* Suggested Activity Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Suggested Activity</Text>
            <TouchableOpacity
              testID="see-all-activities"
              onPress={onSeeAllActivities}
              accessibilityRole="button"
              accessibilityLabel="See all activities"
            >
              <Text style={styles.seeAllText}>See All</Text>
            </TouchableOpacity>
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.activitiesRow}
          >
            {suggestedActivities.map((activity) => (
              <TouchableOpacity
                key={activity.id}
                testID={`activity-card-${activity.id}`}
                style={styles.activityCard}
                onPress={() => onActivityPress(activity.id)}
                accessibilityRole="button"
                accessibilityLabel={activity.name}
              >
                <View style={styles.activityIconContainer}>
                  <Text style={styles.activityIcon}>
                    {getActivityEmoji(activity.icon)}
                  </Text>
                </View>
                <Text style={styles.activityLabel} numberOfLines={2}>
                  {activity.name}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Mindful Resources Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Mindful Resources</Text>
            <TouchableOpacity
              testID="see-all-resources"
              onPress={onSeeAllResources}
              accessibilityRole="button"
              accessibilityLabel="See all resources"
            >
              <Text style={styles.seeAllText}>See All</Text>
            </TouchableOpacity>
          </View>

          {/* Video Card */}
          <View testID="video-card" style={styles.videoCard}>
            <Image
              source={{ uri: resources.video.thumbnail }}
              style={styles.videoThumbnail}
              accessibilityIgnoresInvertColors
            />
            <TouchableOpacity
              testID="video-play-button"
              style={styles.playButton}
              onPress={() => onVideoPlay(resources.video.id)}
              accessibilityRole="button"
              accessibilityLabel={`Play video: ${resources.video.title}`}
            >
              <Text style={styles.playIcon}>▶</Text>
            </TouchableOpacity>
            <View style={styles.durationBadge}>
              <Text style={styles.durationText}>{resources.video.duration}</Text>
            </View>
          </View>

          {/* Article Content */}
          <Text style={styles.articleTitle}>{resources.article.title}</Text>
          <Text style={styles.articleDescription}>
            {resources.article.description}
          </Text>

          {/* Benefit Tags */}
          <View style={styles.benefitTags}>
            {resources.article.benefits.map((benefit, index) => (
              <View
                key={index}
                testID={`benefit-tag-${index}`}
                style={styles.benefitTag}
              >
                <Text style={styles.benefitCheckmark}>✓</Text>
                <Text style={styles.benefitText}>{benefit}</Text>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>

      {/* Footer - Mark As Completed Button */}
      <View style={styles.footer}>
        <TouchableOpacity
          testID="mark-completed-button"
          style={styles.markCompletedButton}
          onPress={onMarkCompleted}
          disabled={isMarking}
          accessibilityRole="button"
          accessibilityLabel="Mark as completed"
          accessibilityState={{ busy: isMarking }}
        >
          <Text style={styles.markCompletedText}>
            {isMarking ? "Marking..." : "Mark As Completed"}
          </Text>
          <Text style={styles.markCompletedIcon}>✓</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  activitiesRow: {
    flexDirection: "row",
  },
  activityCard: {
    alignItems: "center",
    marginRight: 16,
    width: 100,
  },
  activityIcon: {
    fontSize: 24,
  },
  activityIconContainer: {
    alignItems: "center",
    backgroundColor: palette.olive[500],
    borderRadius: 28,
    height: 56,
    justifyContent: "center",
    marginBottom: 8,
    width: 56,
  },
  activityLabel: {
    color: palette.white,
    fontSize: 12,
    textAlign: "center",
  },
  articleDescription: {
    color: palette.gray[400],
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 16,
  },
  articleTitle: {
    color: palette.white,
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 8,
    marginTop: 16,
  },
  backButton: {
    alignItems: "center",
    borderColor: `${palette.white}${palette.alpha[30]}`,
    borderRadius: 20,
    borderWidth: 1,
    height: 40,
    justifyContent: "center",
    minHeight: 44,
    minWidth: 44,
    width: 40,
  },
  backButtonIcon: {
    color: palette.white,
    fontSize: 18,
    fontWeight: "600",
  },
  benefitCheckmark: {
    color: palette.olive[500],
    fontSize: 14,
    fontWeight: "600",
    marginRight: 6,
  },
  benefitTag: {
    alignItems: "center",
    backgroundColor: palette.brown[800],
    borderRadius: 16,
    flexDirection: "row",
    marginRight: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  benefitTags: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  benefitText: {
    color: palette.white,
    fontSize: 12,
  },
  container: {
    backgroundColor: palette.brown[900],
    flex: 1,
  },
  contentSection: {
    flex: 1,
    paddingHorizontal: 24,
  },
  durationBadge: {
    backgroundColor: `${palette.black}${palette.alpha[70]}`,
    borderRadius: 8,
    bottom: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    position: "absolute",
    right: 12,
  },
  durationText: {
    color: palette.white,
    fontSize: 12,
    fontWeight: "600",
  },
  footer: {
    backgroundColor: palette.brown[900],
    paddingBottom: 32,
    paddingHorizontal: 24,
    paddingTop: 16,
  },
  headerSection: {
    backgroundColor: "#2E7D32",
    paddingBottom: 24,
    paddingHorizontal: 24,
    paddingTop: 60,
  },
  markCompletedButton: {
    alignItems: "center",
    backgroundColor: palette.tan[500],
    borderRadius: 28,
    flexDirection: "row",
    justifyContent: "center",
    minHeight: 56,
    paddingHorizontal: 24,
    paddingVertical: 16,
  },
  markCompletedIcon: {
    color: palette.brown[900],
    fontSize: 18,
    fontWeight: "600",
    marginLeft: 8,
  },
  markCompletedText: {
    color: palette.brown[900],
    fontSize: 16,
    fontWeight: "600",
  },
  playButton: {
    alignItems: "center",
    backgroundColor: palette.onboarding.step2,
    borderRadius: 24,
    height: 48,
    justifyContent: "center",
    left: "50%",
    marginLeft: -24,
    marginTop: -24,
    position: "absolute",
    top: "50%",
    width: 48,
  },
  playIcon: {
    color: palette.white,
    fontSize: 20,
  },
  screenTitle: {
    color: palette.white,
    fontSize: 28,
    fontWeight: "700",
    marginTop: 16,
  },
  section: {
    marginBottom: 24,
    marginTop: 24,
  },
  sectionHeader: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  sectionTitle: {
    color: palette.white,
    fontSize: 18,
    fontWeight: "600",
  },
  seeAllText: {
    color: palette.tan[500],
    fontSize: 14,
    fontWeight: "500",
  },
  videoCard: {
    borderRadius: 16,
    height: 180,
    overflow: "hidden",
    position: "relative",
  },
  videoThumbnail: {
    backgroundColor: palette.brown[800],
    height: "100%",
    width: "100%",
  },
});

export default MindfulnessActivitiesScreen;
