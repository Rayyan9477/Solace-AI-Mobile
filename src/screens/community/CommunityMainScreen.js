import { LinearGradient } from "expo-linear-gradient";
import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Animated,
  Dimensions,
  SafeAreaView,
  FlatList,
  RefreshControl,
} from "react-native";

import { MentalHealthIcon, NavigationIcon } from "../../components/icons";
import { useTheme } from "../../shared/theme/ThemeContext";

const { width } = Dimensions.get("window");

const CommunityMainScreen = ({ navigation }) => {
  const { theme, isDarkMode } = useTheme();
  const [selectedTab, setSelectedTab] = useState("feed"); // feed, discover, support
  const [isRefreshing, setIsRefreshing] = useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  // Mock community data matching the design
  const communityStats = {
    totalMembers: 2847,
    activeSessions: 156,
    postsToday: 89,
    supportGiven: 1243,
  };

  const communityPosts = [
    {
      id: 1,
      author: {
        name: "Rebecca Smith",
        avatar: "👩‍🦰",
        verified: true,
        supportBadge: "Mental Health Advocate",
      },
      content:
        "I just wanted to share that today marks 3 months of my mindfulness journey. The small daily practices really do add up! 🌱",
      timestamp: "2h ago",
      category: "Progress",
      likes: 24,
      comments: 8,
      supportReactions: ["💚", "🙏", "✨"],
      hasImage: true,
      imageDescription: "Peaceful nature scene",
    },
    {
      id: 2,
      author: {
        name: "Anonymous User",
        avatar: "🙎‍♂️",
        verified: false,
        supportBadge: "Community Member",
      },
      content:
        "Having a tough day with anxiety. Any tips for grounding techniques that work for you?",
      timestamp: "4h ago",
      category: "Support Request",
      likes: 18,
      comments: 15,
      supportReactions: ["🤗", "💙", "🫶"],
      urgent: true,
    },
    {
      id: 3,
      author: {
        name: "Discovery Higgins",
        avatar: "👨‍⚕️",
        verified: true,
        supportBadge: "Licensed Therapist",
      },
      content:
        "Reminder: It's okay to not be okay. Your feelings are valid, and seeking support is a sign of strength, not weakness. 💪",
      timestamp: "1d ago",
      category: "Daily Wisdom",
      likes: 156,
      comments: 45,
      supportReactions: ["❤️", "🙏", "💪"],
      pinned: true,
    },
    {
      id: 4,
      author: {
        name: "Journy Smith",
        avatar: "👩‍🎓",
        verified: true,
        supportBadge: "Peer Support Specialist",
      },
      content:
        "Group meditation session starting in 30 minutes! Join us for some peaceful moments together. Link in comments 🧘‍♀️",
      timestamp: "6h ago",
      category: "Events",
      likes: 67,
      comments: 23,
      supportReactions: ["🧘‍♀️", "☮️", "✨"],
      isLive: true,
    },
  ];

  const discoveryUsers = [
    {
      id: 1,
      name: "Discovery Higgins",
      bio: "Licensed therapist helping people find peace",
      avatar: "👨‍⚕️",
      followers: 1243,
      mutual: 12,
      verified: true,
    },
    {
      id: 2,
      name: "Journy Smith",
      bio: "Peer support and mindfulness advocate",
      avatar: "👩‍🎓",
      followers: 856,
      mutual: 8,
      verified: true,
    },
  ];

  const tabs = [
    { id: "feed", label: "Feed", icon: "Heart" },
    { id: "discover", label: "Discover", icon: "Brain" },
    { id: "support", label: "Support", icon: "Therapy" },
  ];

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();
  }, []);

  const handleRefresh = () => {
    setIsRefreshing(true);
    // Simulate refresh
    setTimeout(() => {
      setIsRefreshing(false);
    }, 2000);
  };

  const backgroundColors = isDarkMode
    ? [
        theme.colors.dark.background.primary,
        theme.colors.dark.background.secondary,
      ]
    : [
        theme.colors.therapeutic.calming[50],
        theme.colors.therapeutic.peaceful[50],
      ];

  return (
    <SafeAreaView
      style={[
        styles.container,
        { backgroundColor: theme.colors.background.primary },
      ]}
    >
      <LinearGradient
        colors={backgroundColors}
        style={styles.gradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <NavigationIcon
              name="Home"
              size={24}
              color={theme.colors.text.primary}
              variant="outline"
            />
          </TouchableOpacity>

          <Text
            style={[styles.headerTitle, { color: theme.colors.text.primary }]}
          >
            Community Support
          </Text>

          <TouchableOpacity
            style={styles.notificationButton}
            onPress={() => navigation.navigate("CommunityNotifications")}
          >
            <MentalHealthIcon
              name="Brain"
              size={24}
              color={theme.colors.text.primary}
              variant="outline"
            />
          </TouchableOpacity>
        </View>

        {/* Stats Bar */}
        <View
          style={[
            styles.statsContainer,
            { backgroundColor: theme.colors.background.primary },
          ]}
        >
          <StatsItem
            number={communityStats.totalMembers}
            label="Members"
            theme={theme}
          />
          <StatsItem
            number={communityStats.activeSessions}
            label="Active Now"
            theme={theme}
          />
          <StatsItem
            number={communityStats.postsToday}
            label="Posts Today"
            theme={theme}
          />
          <StatsItem
            number={communityStats.supportGiven}
            label="Support Given"
            theme={theme}
          />
        </View>

        {/* Tab Navigation */}
        <View style={styles.tabContainer}>
          {tabs.map((tab) => (
            <TouchableOpacity
              key={tab.id}
              style={[
                styles.tab,
                {
                  backgroundColor:
                    selectedTab === tab.id
                      ? theme.colors.primary[500]
                      : "transparent",
                },
              ]}
              onPress={() => setSelectedTab(tab.id)}
            >
              <MentalHealthIcon
                name={tab.icon}
                size={18}
                color={
                  selectedTab === tab.id
                    ? theme.colors.text.inverse
                    : theme.colors.text.secondary
                }
                variant={selectedTab === tab.id ? "filled" : "outline"}
              />
              <Text
                style={[
                  styles.tabText,
                  {
                    color:
                      selectedTab === tab.id
                        ? theme.colors.text.inverse
                        : theme.colors.text.secondary,
                  },
                ]}
              >
                {tab.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Content */}
        <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
          {selectedTab === "feed" && (
            <FlatList
              data={communityPosts}
              keyExtractor={(item) => item.id.toString()}
              showsVerticalScrollIndicator={false}
              refreshControl={
                <RefreshControl
                  refreshing={isRefreshing}
                  onRefresh={handleRefresh}
                  tintColor={theme.colors.primary[500]}
                />
              }
              contentContainerStyle={styles.feedContent}
              renderItem={({ item, index }) => (
                <CommunityPostCard
                  post={item}
                  theme={theme}
                  isDarkMode={isDarkMode}
                  onPress={() =>
                    navigation.navigate("PostDetail", { post: item })
                  }
                  onLike={() => {}}
                  onComment={() =>
                    navigation.navigate("PostDetail", { post: item })
                  }
                  onSupport={() => {}}
                  delay={index * 100}
                />
              )}
              ListFooterComponent={
                <TouchableOpacity
                  style={[
                    styles.loadMoreButton,
                    { backgroundColor: theme.colors.background.secondary },
                  ]}
                >
                  <Text
                    style={[
                      styles.loadMoreText,
                      { color: theme.colors.text.primary },
                    ]}
                  >
                    Load More Posts
                  </Text>
                </TouchableOpacity>
              }
            />
          )}

          {selectedTab === "discover" && (
            <ScrollView showsVerticalScrollIndicator={false}>
              <View style={styles.discoverSection}>
                <Text
                  style={[
                    styles.sectionTitle,
                    { color: theme.colors.text.primary },
                  ]}
                >
                  Suggested People
                </Text>
                {discoveryUsers.map((user, index) => (
                  <DiscoveryUserCard
                    key={user.id}
                    user={user}
                    theme={theme}
                    onFollow={() => {}}
                    onViewProfile={() =>
                      navigation.navigate("UserProfile", { user })
                    }
                    delay={index * 150}
                  />
                ))}
              </View>

              <View style={styles.discoverSection}>
                <Text
                  style={[
                    styles.sectionTitle,
                    { color: theme.colors.text.primary },
                  ]}
                >
                  Trending Topics
                </Text>
                <TrendingTopicsCard theme={theme} />
              </View>
            </ScrollView>
          )}

          {selectedTab === "support" && (
            <ScrollView showsVerticalScrollIndicator={false}>
              <SupportResourcesCard theme={theme} navigation={navigation} />
            </ScrollView>
          )}
        </Animated.View>

        {/* Floating Action Button */}
        <TouchableOpacity
          style={[styles.fab, { backgroundColor: theme.colors.primary[500] }]}
          onPress={() => navigation.navigate("NewPost")}
        >
          <MentalHealthIcon
            name="Journal"
            size={24}
            color={theme.colors.text.inverse}
            variant="filled"
          />
        </TouchableOpacity>
      </LinearGradient>
    </SafeAreaView>
  );
};

const StatsItem = ({ number, label, theme }) => (
  <View style={styles.statsItem}>
    <Text style={[styles.statsNumber, { color: theme.colors.primary[500] }]}>
      {number.toLocaleString()}
    </Text>
    <Text style={[styles.statsLabel, { color: theme.colors.text.secondary }]}>
      {label}
    </Text>
  </View>
);

const CommunityPostCard = ({
  post,
  theme,
  isDarkMode,
  onPress,
  onLike,
  onComment,
  onSupport,
  delay,
}) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        delay,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        delay,
        useNativeDriver: true,
      }),
    ]).start();
  }, [delay]);

  const getCategoryColor = (category) => {
    switch (category) {
      case "Progress":
        return theme.colors.success[500];
      case "Support Request":
        return theme.colors.warning[500];
      case "Daily Wisdom":
        return theme.colors.primary[500];
      case "Events":
        return theme.colors.info[500];
      default:
        return theme.colors.text.secondary;
    }
  };

  return (
    <Animated.View
      style={[
        styles.postCard,
        {
          backgroundColor: theme.colors.background.primary,
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }],
        },
      ]}
    >
      <TouchableOpacity onPress={onPress}>
        {/* Post Header */}
        <View style={styles.postHeader}>
          <View style={styles.postAuthor}>
            <Text style={styles.authorAvatar}>{post.author.avatar}</Text>
            <View style={styles.authorInfo}>
              <View style={styles.authorNameRow}>
                <Text
                  style={[
                    styles.authorName,
                    { color: theme.colors.text.primary },
                  ]}
                >
                  {post.author.name}
                </Text>
                {post.author.verified && (
                  <View
                    style={[
                      styles.verifiedBadge,
                      { backgroundColor: theme.colors.success[500] },
                    ]}
                  >
                    <Text style={styles.verifiedText}>✓</Text>
                  </View>
                )}
                {post.pinned && (
                  <View
                    style={[
                      styles.pinnedBadge,
                      { backgroundColor: theme.colors.warning[500] },
                    ]}
                  >
                    <Text style={styles.pinnedText}>📌</Text>
                  </View>
                )}
              </View>
              <Text
                style={[
                  styles.supportBadge,
                  { color: theme.colors.text.secondary },
                ]}
              >
                {post.author.supportBadge}
              </Text>
              <Text
                style={[
                  styles.timestamp,
                  { color: theme.colors.text.quaternary },
                ]}
              >
                {post.timestamp}
              </Text>
            </View>
          </View>

          <View style={styles.postMeta}>
            <View
              style={[
                styles.categoryTag,
                { backgroundColor: getCategoryColor(post.category) },
              ]}
            >
              <Text
                style={[
                  styles.categoryText,
                  { color: theme.colors.text.inverse },
                ]}
              >
                {post.category}
              </Text>
            </View>
            {post.urgent && (
              <View
                style={[
                  styles.urgentTag,
                  { backgroundColor: theme.colors.error[500] },
                ]}
              >
                <Text
                  style={[
                    styles.urgentText,
                    { color: theme.colors.text.inverse },
                  ]}
                >
                  🚨 Urgent
                </Text>
              </View>
            )}
            {post.isLive && (
              <View
                style={[
                  styles.liveTag,
                  { backgroundColor: theme.colors.error[500] },
                ]}
              >
                <Text
                  style={[
                    styles.liveText,
                    { color: theme.colors.text.inverse },
                  ]}
                >
                  🔴 Live
                </Text>
              </View>
            )}
          </View>
        </View>

        {/* Post Content */}
        <Text
          style={[styles.postContent, { color: theme.colors.text.primary }]}
        >
          {post.content}
        </Text>

        {/* Post Image Placeholder */}
        {post.hasImage && (
          <View
            style={[
              styles.postImage,
              { backgroundColor: theme.colors.background.secondary },
            ]}
          >
            <Text
              style={[
                styles.imageDescription,
                { color: theme.colors.text.secondary },
              ]}
            >
              📷 {post.imageDescription}
            </Text>
          </View>
        )}

        {/* Support Reactions */}
        <View style={styles.supportReactions}>
          {post.supportReactions.map((reaction, index) => (
            <TouchableOpacity key={index} style={styles.reactionButton}>
              <Text style={styles.reactionEmoji}>{reaction}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Post Actions */}
        <View style={styles.postActions}>
          <TouchableOpacity style={styles.actionButton} onPress={onLike}>
            <MentalHealthIcon
              name="Heart"
              size={18}
              color={theme.colors.text.secondary}
              variant="outline"
            />
            <Text
              style={[
                styles.actionText,
                { color: theme.colors.text.secondary },
              ]}
            >
              {post.likes}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionButton} onPress={onComment}>
            <MentalHealthIcon
              name="Brain"
              size={18}
              color={theme.colors.text.secondary}
              variant="outline"
            />
            <Text
              style={[
                styles.actionText,
                { color: theme.colors.text.secondary },
              ]}
            >
              {post.comments}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionButton} onPress={onSupport}>
            <MentalHealthIcon
              name="Therapy"
              size={18}
              color={theme.colors.text.secondary}
              variant="outline"
            />
            <Text
              style={[
                styles.actionText,
                { color: theme.colors.text.secondary },
              ]}
            >
              Support
            </Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};

const DiscoveryUserCard = ({ user, theme, onFollow, onViewProfile, delay }) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 600,
      delay,
      useNativeDriver: true,
    }).start();
  }, [delay]);

  return (
    <Animated.View
      style={[
        styles.discoveryCard,
        {
          backgroundColor: theme.colors.background.primary,
          opacity: fadeAnim,
        },
      ]}
    >
      <TouchableOpacity onPress={onViewProfile}>
        <View style={styles.discoveryHeader}>
          <Text style={styles.discoveryAvatar}>{user.avatar}</Text>
          <View style={styles.discoveryInfo}>
            <View style={styles.discoveryNameRow}>
              <Text
                style={[
                  styles.discoveryName,
                  { color: theme.colors.text.primary },
                ]}
              >
                {user.name}
              </Text>
              {user.verified && (
                <View
                  style={[
                    styles.verifiedBadge,
                    { backgroundColor: theme.colors.success[500] },
                  ]}
                >
                  <Text style={styles.verifiedText}>✓</Text>
                </View>
              )}
            </View>
            <Text
              style={[
                styles.discoveryBio,
                { color: theme.colors.text.secondary },
              ]}
            >
              {user.bio}
            </Text>
            <Text
              style={[
                styles.discoveryStats,
                { color: theme.colors.text.quaternary },
              ]}
            >
              {user.followers} followers • {user.mutual} mutual
            </Text>
          </View>
        </View>
      </TouchableOpacity>

      <TouchableOpacity
        style={[
          styles.followButton,
          { backgroundColor: theme.colors.primary[500] },
        ]}
        onPress={onFollow}
      >
        <Text
          style={[
            styles.followButtonText,
            { color: theme.colors.text.inverse },
          ]}
        >
          Follow
        </Text>
      </TouchableOpacity>
    </Animated.View>
  );
};

const TrendingTopicsCard = ({ theme }) => (
  <View
    style={[
      styles.trendingCard,
      { backgroundColor: theme.colors.background.primary },
    ]}
  >
    <Text style={[styles.cardTitle, { color: theme.colors.text.primary }]}>
      Popular Topics This Week
    </Text>

    {[
      "#MindfulnessMoments",
      "#AnxietySupport",
      "#ProgressPosts",
      "#WeekendWellness",
      "#TherapyTips",
    ].map((topic, index) => (
      <TouchableOpacity key={index} style={styles.topicItem}>
        <Text style={[styles.topicText, { color: theme.colors.primary[500] }]}>
          {topic}
        </Text>
        <Text
          style={[styles.topicCount, { color: theme.colors.text.quaternary }]}
        >
          {Math.floor(Math.random() * 100 + 20)} posts
        </Text>
      </TouchableOpacity>
    ))}
  </View>
);

const SupportResourcesCard = ({ theme, navigation }) => (
  <View
    style={[
      styles.supportCard,
      { backgroundColor: theme.colors.background.primary },
    ]}
  >
    <Text style={[styles.cardTitle, { color: theme.colors.text.primary }]}>
      Community Guidelines & Support
    </Text>

    <View style={styles.supportSection}>
      <Text
        style={[
          styles.supportSectionTitle,
          { color: theme.colors.text.primary },
        ]}
      >
        Crisis Resources
      </Text>
      <TouchableOpacity
        style={[
          styles.crisisButton,
          { backgroundColor: theme.colors.error[500] },
        ]}
      >
        <Text
          style={[
            styles.crisisButtonText,
            { color: theme.colors.text.inverse },
          ]}
        >
          🆘 Get Immediate Help
        </Text>
      </TouchableOpacity>
    </View>

    <View style={styles.supportSection}>
      <Text
        style={[
          styles.supportSectionTitle,
          { color: theme.colors.text.primary },
        ]}
      >
        Community Guidelines
      </Text>
      <Text
        style={[styles.guidelinesText, { color: theme.colors.text.secondary }]}
      >
        • Be kind and respectful to all members{"\n"}• Share experiences, not
        medical advice{"\n"}• Respect privacy and confidentiality{"\n"}• Report
        harmful or inappropriate content
      </Text>
    </View>

    <View style={styles.supportSection}>
      <Text
        style={[
          styles.supportSectionTitle,
          { color: theme.colors.text.primary },
        ]}
      >
        Peer Support
      </Text>
      <TouchableOpacity
        style={[
          styles.supportButton,
          { backgroundColor: theme.colors.primary[500] },
        ]}
        onPress={() => navigation.navigate("PeerSupport")}
      >
        <Text
          style={[
            styles.supportButtonText,
            { color: theme.colors.text.inverse },
          ]}
        >
          Connect with Peer Supporters
        </Text>
      </TouchableOpacity>
    </View>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  backButton: {
    width: 44,
    height: 44,
    justifyContent: "center",
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
  },
  notificationButton: {
    width: 44,
    height: 44,
    justifyContent: "center",
    alignItems: "center",
  },
  statsContainer: {
    flexDirection: "row",
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 12,
    marginHorizontal: 20,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statsItem: {
    flex: 1,
    alignItems: "center",
  },
  statsNumber: {
    fontSize: 18,
    fontWeight: "bold",
  },
  statsLabel: {
    fontSize: 12,
    marginTop: 2,
  },
  tabContainer: {
    flexDirection: "row",
    paddingHorizontal: 20,
    marginBottom: 16,
    gap: 8,
  },
  tab: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    borderRadius: 20,
    gap: 6,
  },
  tabText: {
    fontSize: 14,
    fontWeight: "500",
  },
  content: {
    flex: 1,
  },
  feedContent: {
    paddingHorizontal: 20,
  },
  postCard: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  postHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  postAuthor: {
    flexDirection: "row",
    flex: 1,
  },
  authorAvatar: {
    fontSize: 32,
    marginRight: 12,
  },
  authorInfo: {
    flex: 1,
  },
  authorNameRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  authorName: {
    fontSize: 16,
    fontWeight: "600",
  },
  verifiedBadge: {
    width: 16,
    height: 16,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  verifiedText: {
    fontSize: 10,
    color: "#FFFFFF",
    fontWeight: "bold",
  },
  pinnedBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
  },
  pinnedText: {
    fontSize: 10,
  },
  supportBadge: {
    fontSize: 12,
    marginTop: 2,
  },
  timestamp: {
    fontSize: 11,
    marginTop: 2,
  },
  postMeta: {
    alignItems: "flex-end",
    gap: 4,
  },
  categoryTag: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  categoryText: {
    fontSize: 10,
    fontWeight: "500",
  },
  urgentTag: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  urgentText: {
    fontSize: 10,
    fontWeight: "600",
  },
  liveTag: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  liveText: {
    fontSize: 10,
    fontWeight: "600",
  },
  postContent: {
    fontSize: 16,
    lineHeight: 22,
    marginBottom: 12,
  },
  postImage: {
    height: 120,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  imageDescription: {
    fontSize: 14,
  },
  supportReactions: {
    flexDirection: "row",
    marginBottom: 12,
    gap: 8,
  },
  reactionButton: {
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  reactionEmoji: {
    fontSize: 16,
  },
  postActions: {
    flexDirection: "row",
    borderTopWidth: 1,
    borderTopColor: "rgba(0,0,0,0.1)",
    paddingTop: 12,
    gap: 20,
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  actionText: {
    fontSize: 14,
  },
  discoverSection: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 16,
  },
  discoveryCard: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    flexDirection: "row",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  discoveryHeader: {
    flexDirection: "row",
    flex: 1,
  },
  discoveryAvatar: {
    fontSize: 24,
    marginRight: 12,
  },
  discoveryInfo: {
    flex: 1,
  },
  discoveryNameRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  discoveryName: {
    fontSize: 16,
    fontWeight: "600",
  },
  discoveryBio: {
    fontSize: 14,
    marginTop: 2,
  },
  discoveryStats: {
    fontSize: 12,
    marginTop: 4,
  },
  followButton: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 16,
  },
  followButtonText: {
    fontSize: 14,
    fontWeight: "600",
  },
  trendingCard: {
    borderRadius: 16,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 12,
  },
  topicItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 8,
  },
  topicText: {
    fontSize: 14,
    fontWeight: "500",
  },
  topicCount: {
    fontSize: 12,
  },
  supportCard: {
    borderRadius: 16,
    padding: 20,
    margin: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  supportSection: {
    marginBottom: 20,
  },
  supportSectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 8,
  },
  crisisButton: {
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  crisisButtonText: {
    fontSize: 16,
    fontWeight: "600",
  },
  guidelinesText: {
    fontSize: 14,
    lineHeight: 20,
  },
  supportButton: {
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  supportButtonText: {
    fontSize: 14,
    fontWeight: "600",
  },
  loadMoreButton: {
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 16,
  },
  loadMoreText: {
    fontSize: 14,
    fontWeight: "500",
  },
  fab: {
    position: "absolute",
    bottom: 20,
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
});

export default CommunityMainScreen;
