import { LinearGradient } from "expo-linear-gradient";
import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  Animated,
  SafeAreaView,
  FlatList,
} from "react-native";

import { MentalHealthIcon, NavigationIcon } from "../../components/icons";
import { useTheme } from "../../shared/theme/ThemeContext";

const CommunityScreen = ({ navigation }) => {
  const { theme } = useTheme();
  const [selectedTab, setSelectedTab] = useState("feed");
  const [posts, setPosts] = useState([]);
  const [groups, setGroups] = useState([]);
  const [newPostText, setNewPostText] = useState("");
  const [selectedGroup, setSelectedGroup] = useState(null);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  const communityGroups = [
    {
      id: "1",
      name: "Anxiety Support",
      description: "A safe space for those dealing with anxiety",
      memberCount: 1247,
      icon: "Mindfulness",
      color: theme.colors.therapeutic.calming[500],
      isJoined: true,
    },
    {
      id: "2",
      name: "Depression Recovery",
      description: "Supporting each other through depression",
      memberCount: 892,
      icon: "Heart",
      color: theme.colors.therapeutic.nurturing[500],
      isJoined: true,
    },
    {
      id: "3",
      name: "Sleep Better Together",
      description: "Tips and support for better sleep",
      memberCount: 634,
      icon: "Brain",
      color: theme.colors.therapeutic.peaceful[500],
      isJoined: false,
    },
    {
      id: "4",
      name: "Mindful Moments",
      description: "Daily mindfulness practice group",
      memberCount: 823,
      icon: "Therapy",
      color: theme.colors.therapeutic.grounding[500],
      isJoined: true,
    },
    {
      id: "5",
      name: "Work-Life Balance",
      description: "Managing stress and finding balance",
      memberCount: 756,
      icon: "Journal",
      color: theme.colors.therapeutic.energizing[500],
      isJoined: false,
    },
  ];

  const mockPosts = [
    {
      id: "1",
      author: "Sarah M.",
      authorInitials: "SM",
      group: "Anxiety Support",
      timestamp: "2h ago",
      content:
        "Had my first panic attack-free week in months! The breathing exercises we discussed really helped. Thank you all for the support. 💙",
      likes: 23,
      comments: 7,
      isLiked: false,
      isAnonymous: false,
      supportLevel: "encouraging",
    },
    {
      id: "2",
      author: "Anonymous",
      authorInitials: "A",
      group: "Depression Recovery",
      timestamp: "4h ago",
      content:
        "Today was really hard. Couldn't get out of bed until noon. But I managed to take a shower and eat something. Small wins, right?",
      likes: 45,
      comments: 12,
      isLiked: true,
      isAnonymous: true,
      supportLevel: "vulnerable",
    },
    {
      id: "3",
      author: "Mike T.",
      authorInitials: "MT",
      group: "Mindful Moments",
      timestamp: "6h ago",
      content:
        "Sharing my morning meditation spot. There's something magical about watching the sunrise while practicing mindfulness. Hope this brings peace to your day too. 🌅",
      likes: 31,
      comments: 5,
      isLiked: false,
      isAnonymous: false,
      supportLevel: "inspiring",
    },
    {
      id: "4",
      author: "Anonymous",
      authorInitials: "A",
      group: "Work-Life Balance",
      timestamp: "8h ago",
      content:
        "Burnout is real. Just submitted my resignation today. Scared but relieved. Taking time to focus on my mental health. Any advice for the transition?",
      likes: 67,
      comments: 18,
      isLiked: true,
      isAnonymous: true,
      supportLevel: "seeking",
    },
  ];

  useEffect(() => {
    setPosts(mockPosts);
    setGroups(communityGroups);

    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();
  }, []);

  const handleLikePost = (postId) => {
    setPosts((prev) =>
      prev.map((post) =>
        post.id === postId
          ? {
              ...post,
              isLiked: !post.isLiked,
              likes: post.isLiked ? post.likes - 1 : post.likes + 1,
            }
          : post,
      ),
    );
  };

  const handleJoinGroup = (groupId) => {
    setGroups((prev) =>
      prev.map((group) =>
        group.id === groupId ? { ...group, isJoined: !group.isJoined } : group,
      ),
    );
  };

  const handleCreatePost = () => {
    if (!newPostText.trim()) {
      Alert.alert("Post Required", "Please write something before posting.");
      return;
    }

    const newPost = {
      id: Date.now().toString(),
      author: "You",
      authorInitials: "YO",
      group: selectedGroup?.name || "General",
      timestamp: "now",
      content: newPostText,
      likes: 0,
      comments: 0,
      isLiked: false,
      isAnonymous: false,
      supportLevel: "sharing",
    };

    setPosts((prev) => [newPost, ...prev]);
    setNewPostText("");
    setSelectedTab("feed");

    Alert.alert(
      "Post Shared!",
      "Your post has been shared with the community.",
      [{ text: "OK" }],
    );
  };

  const getSupportLevelColor = (level) => {
    switch (level) {
      case "encouraging":
        return theme.colors.therapeutic.nurturing[500];
      case "vulnerable":
        return theme.colors.therapeutic.calming[500];
      case "inspiring":
        return theme.colors.therapeutic.energizing[500];
      case "seeking":
        return theme.colors.therapeutic.peaceful[500];
      default:
        return theme.colors.gray[500];
    }
  };

  const renderFeedTab = () => (
    <ScrollView
      style={styles.feedContainer}
      showsVerticalScrollIndicator={false}
    >
      {/* Welcome Card */}
      <View
        style={[
          styles.welcomeCard,
          { backgroundColor: theme.colors.background.primary },
        ]}
      >
        <LinearGradient
          colors={["#81C784", "#A5D6A7"]}
          style={styles.welcomeGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <Text style={styles.welcomeIcon}>💚</Text>
          <Text
            style={[styles.welcomeTitle, { color: theme.colors.text.inverse }]}
          >
            Welcome to Our Community!
          </Text>
          <Text
            style={[
              styles.welcomeSubtitle,
              { color: theme.colors.text.inverse },
            ]}
          >
            A safe space for support and sharing your mental health journey
          </Text>
          <TouchableOpacity
            style={[
              styles.welcomeButton,
              { backgroundColor: theme.colors.background.primary },
            ]}
            onPress={() => setSelectedTab("create")}
          >
            <Text
              style={[
                styles.welcomeButtonText,
                { color: theme.colors.therapeutic.nurturing[600] },
              ]}
            >
              Start Posting
            </Text>
          </TouchableOpacity>
        </LinearGradient>
      </View>

      {/* Community Stats */}
      <View
        style={[
          styles.statsCard,
          { backgroundColor: theme.colors.background.primary },
        ]}
      >
        <Text style={[styles.statsTitle, { color: theme.colors.text.primary }]}>
          Community Impact Today
        </Text>
        <View style={styles.statsGrid}>
          <View style={styles.statItem}>
            <Text style={styles.statIcon}>👥</Text>
            <Text
              style={[styles.statValue, { color: theme.colors.text.primary }]}
            >
              {communityGroups
                .reduce((sum, group) => sum + group.memberCount, 0)
                .toLocaleString()}
            </Text>
            <Text
              style={[styles.statLabel, { color: theme.colors.text.secondary }]}
            >
              Members
            </Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statIcon}>✍️</Text>
            <Text
              style={[styles.statValue, { color: theme.colors.text.primary }]}
            >
              {posts.length}
            </Text>
            <Text
              style={[styles.statLabel, { color: theme.colors.text.secondary }]}
            >
              Active Posts
            </Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statIcon}>💝</Text>
            <Text
              style={[styles.statValue, { color: theme.colors.text.primary }]}
            >
              {posts.reduce((sum, post) => sum + post.likes, 0)}
            </Text>
            <Text
              style={[styles.statLabel, { color: theme.colors.text.secondary }]}
            >
              Support Given
            </Text>
          </View>
        </View>
      </View>

      {posts.map((post) => (
        <PostCard
          key={post.id}
          post={post}
          theme={theme}
          onLike={() => handleLikePost(post.id)}
          onComment={() => navigation.navigate("PostDetails", { post })}
        />
      ))}
    </ScrollView>
  );

  const renderGroupsTab = () => (
    <ScrollView
      style={styles.groupsContainer}
      showsVerticalScrollIndicator={false}
    >
      <Text style={[styles.sectionTitle, { color: theme.colors.text.primary }]}>
        Your Groups
      </Text>

      {groups
        .filter((g) => g.isJoined)
        .map((group) => (
          <GroupCard
            key={group.id}
            group={group}
            theme={theme}
            onPress={() => navigation.navigate("GroupDetails", { group })}
            onJoin={() => handleJoinGroup(group.id)}
          />
        ))}

      <Text
        style={[
          styles.sectionTitle,
          { color: theme.colors.text.primary, marginTop: 24 },
        ]}
      >
        Discover Groups
      </Text>

      {groups
        .filter((g) => !g.isJoined)
        .map((group) => (
          <GroupCard
            key={group.id}
            group={group}
            theme={theme}
            onPress={() => navigation.navigate("GroupDetails", { group })}
            onJoin={() => handleJoinGroup(group.id)}
          />
        ))}
    </ScrollView>
  );

  const renderCreateTab = () => (
    <ScrollView
      style={styles.createContainer}
      showsVerticalScrollIndicator={false}
    >
      <View
        style={[
          styles.createCard,
          { backgroundColor: theme.colors.background.primary },
        ]}
      >
        <Text
          style={[styles.createTitle, { color: theme.colors.text.primary }]}
        >
          Share with the Community
        </Text>

        <Text
          style={[
            styles.createSubtitle,
            { color: theme.colors.text.secondary },
          ]}
        >
          Your voice matters. Share your journey, ask for support, or offer
          encouragement to others.
        </Text>

        {/* Group Selection */}
        <View style={styles.groupSelector}>
          <Text
            style={[
              styles.groupSelectorLabel,
              { color: theme.colors.text.primary },
            ]}
          >
            Choose a group:
          </Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.groupsScroll}
          >
            {groups
              .filter((g) => g.isJoined)
              .map((group) => (
                <TouchableOpacity
                  key={group.id}
                  style={[
                    styles.groupSelectButton,
                    {
                      backgroundColor:
                        selectedGroup?.id === group.id
                          ? group.color
                          : theme.colors.background.secondary,
                    },
                  ]}
                  onPress={() => setSelectedGroup(group)}
                >
                  <MentalHealthIcon
                    name={group.icon}
                    size={16}
                    color={
                      selectedGroup?.id === group.id
                        ? theme.colors.text.inverse
                        : group.color
                    }
                    variant="filled"
                  />
                  <Text
                    style={[
                      styles.groupSelectText,
                      {
                        color:
                          selectedGroup?.id === group.id
                            ? theme.colors.text.inverse
                            : theme.colors.text.primary,
                      },
                    ]}
                  >
                    {group.name}
                  </Text>
                </TouchableOpacity>
              ))}
          </ScrollView>
        </View>

        {/* Post Content */}
        <TextInput
          style={[
            styles.postInput,
            {
              backgroundColor: theme.colors.background.secondary,
              borderColor: theme.colors.gray[300],
              color: theme.colors.text.primary,
            },
          ]}
          placeholder="What's on your mind? Share your thoughts, feelings, or experiences..."
          placeholderTextColor={theme.colors.text.tertiary}
          value={newPostText}
          onChangeText={setNewPostText}
          multiline
          textAlignVertical="top"
        />

        {/* Post Options */}
        <View style={styles.postOptions}>
          <View style={styles.postOption}>
            <TouchableOpacity style={styles.optionToggle}>
              <MentalHealthIcon
                name="Heart"
                size={16}
                color={theme.colors.text.secondary}
                variant="outline"
              />
            </TouchableOpacity>
            <Text
              style={[
                styles.optionLabel,
                { color: theme.colors.text.secondary },
              ]}
            >
              Post anonymously
            </Text>
          </View>
        </View>

        {/* Create Button */}
        <TouchableOpacity
          style={[
            styles.createButton,
            {
              backgroundColor: newPostText.trim()
                ? theme.colors.therapeutic.calming[500]
                : theme.colors.gray[300],
            },
          ]}
          onPress={handleCreatePost}
          disabled={!newPostText.trim()}
        >
          <MentalHealthIcon
            name="Heart"
            size={20}
            color={theme.colors.text.inverse}
            variant="filled"
          />
          <Text
            style={[
              styles.createButtonText,
              { color: theme.colors.text.inverse },
            ]}
          >
            Share with Community
          </Text>
        </TouchableOpacity>
      </View>

      {/* Community Guidelines */}
      <View
        style={[
          styles.guidelinesCard,
          { backgroundColor: theme.colors.therapeutic.calming[50] },
        ]}
      >
        <Text
          style={[
            styles.guidelinesTitle,
            { color: theme.colors.therapeutic.calming[700] },
          ]}
        >
          Community Guidelines
        </Text>
        <Text
          style={[
            styles.guidelinesText,
            { color: theme.colors.therapeutic.calming[600] },
          ]}
        >
          • Be kind and supportive{"\n"}• Respect others' experiences{"\n"}• No
          medical advice{"\n"}• Keep personal information private{"\n"}• Report
          inappropriate content
        </Text>
      </View>
    </ScrollView>
  );

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={[
          theme.colors.therapeutic.calming[50],
          theme.colors.therapeutic.peaceful[50],
          theme.colors.therapeutic.nurturing[50],
        ]}
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
            style={styles.searchButton}
            onPress={() => navigation.navigate("CommunitySearch")}
          >
            <NavigationIcon
              name="Home"
              size={24}
              color={theme.colors.text.primary}
              variant="outline"
            />
          </TouchableOpacity>
        </View>

        {/* Tab Selector */}
        <View style={styles.tabSelector}>
          {[
            { id: "feed", label: "Feed", icon: "Heart" },
            { id: "groups", label: "Groups", icon: "Brain" },
            { id: "create", label: "Share", icon: "Journal" },
          ].map((tab) => (
            <TouchableOpacity
              key={tab.id}
              style={[
                styles.tabButton,
                {
                  backgroundColor:
                    selectedTab === tab.id
                      ? theme.colors.therapeutic.calming[500]
                      : theme.colors.background.secondary,
                },
              ]}
              onPress={() => setSelectedTab(tab.id)}
            >
              <MentalHealthIcon
                name={tab.icon}
                size={16}
                color={
                  selectedTab === tab.id
                    ? theme.colors.text.inverse
                    : theme.colors.text.secondary
                }
                variant={selectedTab === tab.id ? "filled" : "outline"}
              />
              <Text
                style={[
                  styles.tabButtonText,
                  {
                    color:
                      selectedTab === tab.id
                        ? theme.colors.text.inverse
                        : theme.colors.text.primary,
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
          {selectedTab === "feed" && renderFeedTab()}
          {selectedTab === "groups" && renderGroupsTab()}
          {selectedTab === "create" && renderCreateTab()}
        </Animated.View>
      </LinearGradient>
    </SafeAreaView>
  );
};

const PostCard = ({ post, theme, onLike, onComment }) => (
  <View
    style={[
      styles.postCard,
      { backgroundColor: theme.colors.background.primary },
    ]}
  >
    <View style={styles.postHeader}>
      <View style={styles.postAuthor}>
        <View
          style={[
            styles.authorAvatar,
            { backgroundColor: getSupportLevelColor(post.supportLevel) },
          ]}
        >
          <Text
            style={[
              styles.authorInitials,
              { color: theme.colors.text.inverse },
            ]}
          >
            {post.authorInitials}
          </Text>
        </View>
        <View style={styles.authorInfo}>
          <Text
            style={[styles.authorName, { color: theme.colors.text.primary }]}
          >
            {post.author}
          </Text>
          <Text
            style={[styles.postMeta, { color: theme.colors.text.secondary }]}
          >
            {post.group} • {post.timestamp}
          </Text>
        </View>
      </View>

      {post.isAnonymous && (
        <View
          style={[
            styles.anonymousBadge,
            { backgroundColor: theme.colors.gray[100] },
          ]}
        >
          <Text
            style={[
              styles.anonymousText,
              { color: theme.colors.text.secondary },
            ]}
          >
            Anonymous
          </Text>
        </View>
      )}
    </View>

    <Text style={[styles.postContent, { color: theme.colors.text.primary }]}>
      {post.content}
    </Text>

    <View style={styles.postActions}>
      <TouchableOpacity style={styles.actionButton} onPress={onLike}>
        <MentalHealthIcon
          name="Heart"
          size={20}
          color={
            post.isLiked
              ? theme.colors.therapeutic.nurturing[500]
              : theme.colors.text.secondary
          }
          variant={post.isLiked ? "filled" : "outline"}
        />
        <Text
          style={[styles.actionText, { color: theme.colors.text.secondary }]}
        >
          {post.likes}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.actionButton} onPress={onComment}>
        <MentalHealthIcon
          name="Brain"
          size={20}
          color={theme.colors.text.secondary}
          variant="outline"
        />
        <Text
          style={[styles.actionText, { color: theme.colors.text.secondary }]}
        >
          {post.comments}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.actionButton}>
        <MentalHealthIcon
          name="Therapy"
          size={20}
          color={theme.colors.text.secondary}
          variant="outline"
        />
      </TouchableOpacity>
    </View>
  </View>
);

const GroupCard = ({ group, theme, onPress, onJoin }) => (
  <TouchableOpacity
    style={[
      styles.groupCard,
      { backgroundColor: theme.colors.background.primary },
    ]}
    onPress={onPress}
  >
    <View style={styles.groupCardContent}>
      <View style={[styles.groupIcon, { backgroundColor: group.color }]}>
        <MentalHealthIcon
          name={group.icon}
          size={24}
          color={theme.colors.text.inverse}
          variant="filled"
        />
      </View>

      <View style={styles.groupInfo}>
        <Text style={[styles.groupName, { color: theme.colors.text.primary }]}>
          {group.name}
        </Text>
        <Text
          style={[
            styles.groupDescription,
            { color: theme.colors.text.secondary },
          ]}
        >
          {group.description}
        </Text>
        <Text
          style={[styles.groupMembers, { color: theme.colors.text.tertiary }]}
        >
          {group.memberCount.toLocaleString()} members
        </Text>
      </View>
    </View>

    <TouchableOpacity
      style={[
        styles.joinButton,
        {
          backgroundColor: group.isJoined
            ? theme.colors.therapeutic.nurturing[100]
            : group.color,
        },
      ]}
      onPress={onJoin}
    >
      <Text
        style={[
          styles.joinButtonText,
          {
            color: group.isJoined
              ? theme.colors.therapeutic.nurturing[700]
              : theme.colors.text.inverse,
          },
        ]}
      >
        {group.isJoined ? "Joined" : "Join"}
      </Text>
    </TouchableOpacity>
  </TouchableOpacity>
);

const getSupportLevelColor = (level) => {
  // This would normally come from theme, but defining here for simplicity
  const colors = {
    encouraging: "#22C55E",
    vulnerable: "#0EA5E9",
    inspiring: "#F97316",
    seeking: "#64748B",
    sharing: "#A855F7",
  };
  return colors[level] || "#6B7280";
};

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
  searchButton: {
    width: 44,
    height: 44,
    justifyContent: "center",
    alignItems: "center",
  },
  tabSelector: {
    flexDirection: "row",
    paddingHorizontal: 20,
    marginBottom: 20,
    gap: 8,
  },
  tabButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    borderRadius: 8,
    gap: 4,
  },
  tabButtonText: {
    fontSize: 14,
    fontWeight: "500",
  },
  content: {
    flex: 1,
  },
  feedContainer: {
    flex: 1,
    paddingHorizontal: 20,
  },
  welcomeCard: {
    borderRadius: 16,
    marginBottom: 20,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  welcomeGradient: {
    padding: 24,
    alignItems: "center",
  },
  welcomeIcon: {
    fontSize: 48,
    marginBottom: 12,
  },
  welcomeTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 8,
    textAlign: "center",
  },
  welcomeSubtitle: {
    fontSize: 14,
    textAlign: "center",
    marginBottom: 16,
    lineHeight: 20,
  },
  welcomeButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },
  welcomeButtonText: {
    fontSize: 14,
    fontWeight: "600",
  },
  statsCard: {
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statsTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 16,
    textAlign: "center",
  },
  statsGrid: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  statItem: {
    alignItems: "center",
  },
  statIcon: {
    fontSize: 24,
    marginBottom: 8,
  },
  statValue: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    textAlign: "center",
  },
  postCard: {
    borderRadius: 12,
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
    alignItems: "flex-start",
    marginBottom: 12,
  },
  postAuthor: {
    flexDirection: "row",
    alignItems: "center",
  },
  authorAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  authorInitials: {
    fontSize: 14,
    fontWeight: "bold",
  },
  authorInfo: {
    flex: 1,
  },
  authorName: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 2,
  },
  postMeta: {
    fontSize: 12,
  },
  anonymousBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  anonymousText: {
    fontSize: 10,
    fontWeight: "500",
  },
  postContent: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 16,
  },
  postActions: {
    flexDirection: "row",
    gap: 20,
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  actionText: {
    fontSize: 14,
    fontWeight: "500",
  },
  groupsContainer: {
    flex: 1,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 16,
  },
  groupCard: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  groupCardContent: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  groupIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  groupInfo: {
    flex: 1,
  },
  groupName: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 4,
  },
  groupDescription: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 4,
  },
  groupMembers: {
    fontSize: 12,
  },
  joinButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  joinButtonText: {
    fontSize: 14,
    fontWeight: "600",
  },
  createContainer: {
    flex: 1,
    paddingHorizontal: 20,
  },
  createCard: {
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  createTitle: {
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 8,
    textAlign: "center",
  },
  createSubtitle: {
    fontSize: 14,
    lineHeight: 20,
    textAlign: "center",
    marginBottom: 20,
  },
  groupSelector: {
    marginBottom: 20,
  },
  groupSelectorLabel: {
    fontSize: 14,
    fontWeight: "500",
    marginBottom: 8,
  },
  groupsScroll: {
    marginHorizontal: -4,
  },
  groupSelectButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
    marginHorizontal: 4,
    gap: 4,
  },
  groupSelectText: {
    fontSize: 12,
    fontWeight: "500",
  },
  postInput: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    height: 120,
    marginBottom: 16,
  },
  postOptions: {
    marginBottom: 20,
  },
  postOption: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  optionToggle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  optionLabel: {
    fontSize: 14,
  },
  createButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    borderRadius: 12,
    gap: 8,
  },
  createButtonText: {
    fontSize: 16,
    fontWeight: "600",
  },
  guidelinesCard: {
    borderRadius: 12,
    padding: 16,
  },
  guidelinesTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 8,
  },
  guidelinesText: {
    fontSize: 14,
    lineHeight: 20,
  },
});

export default CommunityScreen;
