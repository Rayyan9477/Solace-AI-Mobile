import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Animated,
  Dimensions,
  SafeAreaView,
  Platform,
} from "react-native";

import { useTheme } from "../../shared/theme/ThemeContext";
import {
  spacing,
  typography,
  borderRadius,
  shadows,
} from "../../shared/theme/theme";
import { WebSafeLinearGradient as LinearGradient } from "../common/WebSafeLinearGradient";
import { MentalHealthIcon } from "../icons";

const { width, height } = Dimensions.get("window");
const SIDEBAR_WIDTH = width * 0.75;

// Sample mental health conversation topics
const sampleTopics = [
  {
    id: "1",
    title: "Mental Health",
    subtitle: "Depression, anxiety support",
    icon: "brain",
    timestamp: "2 min ago",
    category: "current",
    unread: true,
  },
  {
    id: "2",
    title: "Stress & Anxiety Exercise",
    subtitle: "Coping strategies discussion",
    icon: "heart",
    timestamp: "1 hour ago",
    category: "current",
    unread: false,
  },
  {
    id: "3",
    title: "Becoming Happy Focused",
    subtitle: "Building positive habits",
    icon: "therapy",
    timestamp: "3 hours ago",
    category: "bookmark",
    unread: false,
  },
  {
    id: "4",
    title: "Not Having Enough Sleep",
    subtitle: "Sleep hygiene tips",
    icon: "mindfulness",
    timestamp: "1 day ago",
    category: "bookmark",
    unread: false,
  },
  {
    id: "5",
    title: "Status Anxiety",
    subtitle: "Social pressure management",
    icon: "insights",
    timestamp: "2 days ago",
    category: "favorites",
    unread: false,
  },
  {
    id: "6",
    title: "Finding Purpose",
    subtitle: "Life meaning exploration",
    icon: "journal",
    timestamp: "3 days ago",
    category: "favorites",
    unread: false,
  },
  {
    id: "7",
    title: "Alan Watts Philosophy",
    subtitle: "Mindfulness discussions",
    icon: "meditation",
    timestamp: "1 week ago",
    category: "favorites",
    unread: false,
  },
  {
    id: "8",
    title: "Best Meditation Apps",
    subtitle: "App recommendations",
    icon: "mindfulness",
    timestamp: "2 weeks ago",
    category: "unassigned",
    unread: false,
  },
];

const ChatTopicSidebar = ({
  isVisible = false,
  onClose,
  onTopicSelect,
  currentTopicId,
  style,
  ...props
}) => {
  const { theme } = useTheme();
  const slideAnim = useRef(new Animated.Value(-SIDEBAR_WIDTH)).current;
  const overlayOpacity = useRef(new Animated.Value(0)).current;
  const [selectedTopic, setSelectedTopic] = useState(currentTopicId);

  useEffect(() => {
    if (isVisible) {
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(overlayOpacity, {
          toValue: 0.5,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: -SIDEBAR_WIDTH,
          duration: 250,
          useNativeDriver: true,
        }),
        Animated.timing(overlayOpacity, {
          toValue: 0,
          duration: 250,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [isVisible]);

  const handleTopicPress = (topic) => {
    setSelectedTopic(topic.id);
    onTopicSelect?.(topic);
    onClose?.();
  };

  const handleInviteFriends = () => {
    // Handle invite friends functionality
    console.log("Invite friends pressed");
    onClose?.();
  };

  const getCategoryTopics = (category) => {
    return sampleTopics.filter((topic) => topic.category === category);
  };

  const getCategoryCount = (category) => {
    return getCategoryTopics(category).length;
  };

  const CategorySection = ({
    title,
    category,
    icon,
    count,
    color = theme.colors.text.secondary,
  }) => {
    const topics = getCategoryTopics(category);

    return (
      <View style={styles.categorySection}>
        <View style={[styles.categoryHeader, { borderLeftColor: color }]}>
          <View style={styles.categoryTitleRow}>
            <MentalHealthIcon name={icon} size={16} color={color} />
            <Text
              style={[
                styles.categoryTitle,
                { color: theme.colors.text.primary },
              ]}
            >
              {title}
            </Text>
          </View>
          <View style={[styles.categoryBadge, { backgroundColor: color }]}>
            <Text style={styles.categoryCount}>{count}</Text>
          </View>
        </View>

        {topics.map((topic) => (
          <TouchableOpacity
            key={topic.id}
            style={[
              styles.topicItem,
              selectedTopic === topic.id && styles.selectedTopicItem,
            ]}
            onPress={() => handleTopicPress(topic)}
            accessibilityLabel={`${topic.title} conversation topic`}
            accessibilityHint="Double tap to open this conversation"
          >
            <View style={styles.topicIconContainer}>
              <MentalHealthIcon
                name={topic.icon}
                size={20}
                color={
                  selectedTopic === topic.id
                    ? theme.colors.therapeutic.empathy[500]
                    : theme.colors.text.secondary
                }
              />
              {topic.unread && <View style={styles.unreadIndicator} />}
            </View>

            <View style={styles.topicContent}>
              <Text
                style={[
                  styles.topicTitle,
                  {
                    color:
                      selectedTopic === topic.id
                        ? theme.colors.therapeutic.empathy[600]
                        : theme.colors.text.primary,
                  },
                ]}
                numberOfLines={1}
              >
                {topic.title}
              </Text>
              <Text
                style={[
                  styles.topicSubtitle,
                  { color: theme.colors.text.secondary },
                ]}
                numberOfLines={1}
              >
                {topic.subtitle}
              </Text>
              <Text
                style={[
                  styles.topicTimestamp,
                  { color: theme.colors.text.tertiary },
                ]}
              >
                {topic.timestamp}
              </Text>
            </View>

            {selectedTopic === topic.id && (
              <View style={styles.activeIndicator} />
            )}
          </TouchableOpacity>
        ))}
      </View>
    );
  };

  const InviteFriendsCard = () => (
    <TouchableOpacity
      style={styles.inviteCard}
      onPress={handleInviteFriends}
      accessibilityLabel="Invite friends to join"
      accessibilityHint="Double tap to invite friends to the app"
    >
      <LinearGradient
        colors={[
          theme.colors.therapeutic.empathy[400],
          theme.colors.therapeutic.empathy[600],
        ]}
        style={styles.inviteGradient}
      >
        <View style={styles.inviteIcon}>
          <MentalHealthIcon name="users" size={24} color="#FFFFFF" />
        </View>
        <Text style={styles.inviteTitle}>Invite your friends</Text>
        <Text style={styles.inviteSubtitle}>
          Share the journey of mental wellness together
        </Text>
        <View style={styles.inviteButton}>
          <MentalHealthIcon
            name="plus"
            size={16}
            color={theme.colors.therapeutic.empathy[500]}
          />
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );

  if (!isVisible) return null;

  return (
    <>
      {/* Overlay */}
      <Animated.View style={[styles.overlay, { opacity: overlayOpacity }]}>
        <TouchableOpacity
          style={styles.overlayTouchable}
          onPress={onClose}
          activeOpacity={1}
        />
      </Animated.View>

      {/* Sidebar */}
      <Animated.View
        style={[
          styles.sidebar,
          {
            transform: [{ translateX: slideAnim }],
            backgroundColor: theme.colors.background.primary,
          },
          style,
        ]}
        {...props}
      >
        <SafeAreaView style={styles.sidebarContent}>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.headerLeft}>
              <Text
                style={[
                  styles.headerTitle,
                  { color: theme.colors.text.primary },
                ]}
              >
                Chats
              </Text>
              <View
                style={[
                  styles.topicsBadge,
                  { backgroundColor: theme.colors.therapeutic.empathy[500] },
                ]}
              >
                <Text style={styles.topicsCount}>24</Text>
              </View>
            </View>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={onClose}
              accessibilityLabel="Close sidebar"
              accessibilityHint="Double tap to close the chat topics sidebar"
            >
              <MentalHealthIcon
                name="close"
                size={20}
                color={theme.colors.text.secondary}
              />
            </TouchableOpacity>
          </View>

          {/* Topics List */}
          <ScrollView
            style={styles.scrollView}
            showsVerticalScrollIndicator={false}
          >
            {/* Current Conversations */}
            <CategorySection
              title="Current"
              category="current"
              icon="folder"
              count={getCategoryCount("current")}
              color={theme.colors.therapeutic.empathy[500]}
            />

            {/* Bookmarked */}
            <CategorySection
              title="Bookmark"
              category="bookmark"
              icon="bookmark"
              count={getCategoryCount("bookmark")}
              color={theme.colors.therapeutic.kind[500]}
            />

            {/* Favorites */}
            <CategorySection
              title="Favorites"
              category="favorites"
              icon="heart"
              count={getCategoryCount("favorites")}
              color={theme.colors.therapeutic.nurturing[500]}
            />

            {/* Trash */}
            <CategorySection
              title="Trash"
              category="trash"
              icon="trash"
              count={0}
              color={theme.colors.text.tertiary}
            />

            {/* Unassigned */}
            <CategorySection
              title="Unassigned"
              category="unassigned"
              icon="grid"
              count={getCategoryCount("unassigned")}
              color={theme.colors.text.secondary}
            />

            {/* Invite Friends Card */}
            <View style={styles.inviteSection}>
              <InviteFriendsCard />
            </View>

            {/* Bottom spacing */}
            <View style={styles.bottomSpacing} />
          </ScrollView>
        </SafeAreaView>
      </Animated.View>
    </>
  );
};

const styles = StyleSheet.create({
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "#000000",
    zIndex: 999,
  },
  overlayTouchable: {
    flex: 1,
  },
  sidebar: {
    position: "absolute",
    top: 0,
    left: 0,
    bottom: 0,
    width: SIDEBAR_WIDTH,
    zIndex: 1000,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 2, height: 0 },
        shadowOpacity: 0.25,
        shadowRadius: 8,
      },
      android: {
        elevation: 16,
      },
    }),
  },
  sidebarContent: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[4],
    borderBottomWidth: 1,
    borderBottomColor: "rgba(0,0,0,0.05)",
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  headerTitle: {
    fontSize: typography.sizes.xl,
    fontWeight: typography.weights.bold,
    marginRight: spacing[2],
  },
  topicsBadge: {
    paddingHorizontal: spacing[2],
    paddingVertical: spacing[1],
    borderRadius: borderRadius.full,
  },
  topicsCount: {
    color: "#FFFFFF",
    fontSize: typography.sizes.xs,
    fontWeight: typography.weights.semiBold,
  },
  closeButton: {
    padding: spacing[2],
  },
  scrollView: {
    flex: 1,
  },
  categorySection: {
    marginTop: spacing[4],
  },
  categoryHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[2],
    borderLeftWidth: 3,
    marginLeft: spacing[4],
  },
  categoryTitleRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  categoryTitle: {
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.semiBold,
    marginLeft: spacing[2],
  },
  categoryBadge: {
    paddingHorizontal: spacing[2],
    paddingVertical: spacing[1],
    borderRadius: borderRadius.sm,
    minWidth: 24,
    alignItems: "center",
  },
  categoryCount: {
    color: "#FFFFFF",
    fontSize: typography.sizes.xs,
    fontWeight: typography.weights.bold,
  },
  topicItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[3],
    marginHorizontal: spacing[2],
    borderRadius: borderRadius.md,
    position: "relative",
  },
  selectedTopicItem: {
    backgroundColor: "rgba(255, 107, 53, 0.1)",
    borderLeftWidth: 3,
    borderLeftColor: "#FF6B35",
  },
  topicIconContainer: {
    position: "relative",
    marginRight: spacing[3],
    marginTop: spacing[1],
  },
  unreadIndicator: {
    position: "absolute",
    top: -2,
    right: -2,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#FF6B35",
  },
  topicContent: {
    flex: 1,
  },
  topicTitle: {
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.semiBold,
    lineHeight: typography.lineHeights.sm,
    marginBottom: spacing[1],
  },
  topicSubtitle: {
    fontSize: typography.sizes.xs,
    lineHeight: typography.lineHeights.xs,
    marginBottom: spacing[1],
  },
  topicTimestamp: {
    fontSize: typography.sizes.xs,
    fontWeight: typography.weights.medium,
  },
  activeIndicator: {
    position: "absolute",
    right: spacing[4],
    top: "50%",
    width: 4,
    height: 20,
    backgroundColor: "#FF6B35",
    borderRadius: 2,
    marginTop: -10,
  },
  inviteSection: {
    paddingHorizontal: spacing[4],
    paddingTop: spacing[6],
  },
  inviteCard: {
    borderRadius: borderRadius.lg,
    overflow: "hidden",
    ...shadows.md,
  },
  inviteGradient: {
    padding: spacing[4],
    alignItems: "center",
    position: "relative",
  },
  inviteIcon: {
    marginBottom: spacing[2],
  },
  inviteTitle: {
    color: "#FFFFFF",
    fontSize: typography.sizes.base,
    fontWeight: typography.weights.bold,
    marginBottom: spacing[1],
  },
  inviteSubtitle: {
    color: "rgba(255, 255, 255, 0.9)",
    fontSize: typography.sizes.xs,
    textAlign: "center",
    lineHeight: typography.lineHeights.sm,
    marginBottom: spacing[3],
  },
  inviteButton: {
    backgroundColor: "#FFFFFF",
    padding: spacing[2],
    borderRadius: borderRadius.full,
  },
  bottomSpacing: {
    height: spacing[8],
  },
});

export default ChatTopicSidebar;
