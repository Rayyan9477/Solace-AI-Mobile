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
  TextInput,
  Image,
} from "react-native";

import { MentalHealthIcon, NavigationIcon } from "../../components/icons";
import { useTheme } from "../../contexts/ThemeContext";

const { width } = Dimensions.get("window");

const MindfulResourcesScreen = ({ navigation }) => {
  const { theme } = useTheme();
  const [selectedTab, setSelectedTab] = useState("resources");
  const [searchQuery, setSearchQuery] = useState("");
  const [favoriteResources, setFavoriteResources] = useState(new Set());
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;

  const resourceCategories = [
    {
      id: "meditation",
      title: "Meditation Guides",
      description: "Step-by-step meditation practices for all levels",
      icon: "Mindfulness",
      color: theme.colors.therapeutic.calming[500],
      count: 12,
    },
    {
      id: "breathing",
      title: "Breathing Exercises",
      description: "Proven techniques to calm your mind and body",
      icon: "Heart",
      color: theme.colors.therapeutic.nurturing[500],
      count: 8,
    },
    {
      id: "stress",
      title: "Stress Relief",
      description: "Tools and strategies for managing stress",
      icon: "Therapy",
      color: theme.colors.therapeutic.peaceful[500],
      count: 15,
    },
    {
      id: "sleep",
      title: "Better Sleep",
      description: "Resources to improve your sleep quality",
      icon: "Brain",
      color: theme.colors.therapeutic.grounding[500],
      count: 10,
    },
  ];

  const articles = [
    {
      id: "1",
      title: "The Science Behind Mindfulness",
      author: "Dr. Sarah Johnson",
      readTime: "5 min read",
      category: "meditation",
      image: "https://picsum.photos/300/200?random=1",
      excerpt:
        "Discover how mindfulness meditation changes your brain and improves mental health.",
      difficulty: "Beginner",
      isPremium: false,
    },
    {
      id: "2",
      title: "Breathing Your Way to Calm",
      author: "Michael Chen",
      readTime: "3 min read",
      category: "breathing",
      image: "https://picsum.photos/300/200?random=2",
      excerpt:
        "Learn powerful breathing techniques used by therapists worldwide.",
      difficulty: "Beginner",
      isPremium: false,
    },
    {
      id: "3",
      title: "Advanced Stress Management",
      author: "Dr. Emily Rodriguez",
      readTime: "8 min read",
      category: "stress",
      image: "https://picsum.photos/300/200?random=3",
      excerpt:
        "Professional strategies for managing chronic stress and anxiety.",
      difficulty: "Advanced",
      isPremium: true,
    },
    {
      id: "4",
      title: "Sleep Hygiene Mastery",
      author: "Prof. David Lee",
      readTime: "6 min read",
      category: "sleep",
      image: "https://picsum.photos/300/200?random=4",
      excerpt: "Evidence-based approaches to getting better sleep naturally.",
      difficulty: "Intermediate",
      isPremium: false,
    },
  ];

  const courses = [
    {
      id: "1",
      title: "Mindfulness 101: Getting Started",
      instructor: "Sarah Johnson",
      duration: "4 weeks",
      modules: 12,
      level: "Beginner",
      rating: 4.8,
      students: 2534,
      image: "https://picsum.photos/300/200?random=5",
      description:
        "A comprehensive introduction to mindfulness meditation and its benefits.",
      isPremium: false,
      progress: 0,
    },
    {
      id: "2",
      title: "Advanced Meditation Techniques",
      instructor: "Michael Chen",
      duration: "6 weeks",
      modules: 18,
      level: "Advanced",
      rating: 4.9,
      students: 1287,
      image: "https://picsum.photos/300/200?random=6",
      description:
        "Deep dive into advanced meditation practices and spiritual growth.",
      isPremium: true,
      progress: 25,
    },
    {
      id: "3",
      title: "Stress-Free Living Program",
      instructor: "Dr. Emily Rodriguez",
      duration: "8 weeks",
      modules: 24,
      level: "Intermediate",
      rating: 4.7,
      students: 3421,
      image: "https://picsum.photos/300/200?random=7",
      description:
        "Complete program for managing stress and building resilience.",
      isPremium: true,
      progress: 60,
    },
  ];

  const featuredResources = [
    {
      id: "1",
      title: "Daily Mindfulness Challenge",
      type: "Challenge",
      duration: "21 days",
      participants: 15842,
      color: theme.colors.therapeutic.energizing[500],
      icon: "Brain",
    },
    {
      id: "2",
      title: "Guided Body Scan Collection",
      type: "Audio Series",
      duration: "30 sessions",
      participants: 8392,
      color: theme.colors.therapeutic.calming[500],
      icon: "Mindfulness",
    },
    {
      id: "3",
      title: "Anxiety Relief Toolkit",
      type: "Resource Kit",
      duration: "Self-paced",
      participants: 12043,
      color: theme.colors.therapeutic.nurturing[500],
      icon: "Heart",
    },
  ];

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 50,
        friction: 8,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const toggleFavorite = (resourceId) => {
    setFavoriteResources((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(resourceId)) {
        newSet.delete(resourceId);
      } else {
        newSet.add(resourceId);
      }
      return newSet;
    });
  };

  const filterContent = (content) => {
    if (!searchQuery) return content;
    return content.filter(
      (item) =>
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.author?.toLowerCase().includes(searchQuery.toLowerCase()),
    );
  };

  const renderResourcesTab = () => (
    <ScrollView style={styles.tabContent} showsVerticalScrollIndicator={false}>
      {/* Featured Resources */}
      <View
        style={[
          styles.section,
          { backgroundColor: theme.colors.background.primary },
        ]}
      >
        <Text
          style={[styles.sectionTitle, { color: theme.colors.text.primary }]}
        >
          Featured Resources
        </Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.featuredScroll}
        >
          {featuredResources.map((resource, index) => (
            <FeaturedResourceCard
              key={resource.id}
              resource={resource}
              theme={theme}
              onPress={() =>
                navigation.navigate("ResourceDetail", { resource })
              }
              delay={index * 100}
            />
          ))}
        </ScrollView>
      </View>

      {/* Categories */}
      <View
        style={[
          styles.section,
          { backgroundColor: theme.colors.background.primary },
        ]}
      >
        <Text
          style={[styles.sectionTitle, { color: theme.colors.text.primary }]}
        >
          Browse by Category
        </Text>
        <View style={styles.categoriesGrid}>
          {resourceCategories.map((category, index) => (
            <CategoryCard
              key={category.id}
              category={category}
              theme={theme}
              onPress={() =>
                navigation.navigate("CategoryResources", { category })
              }
              delay={index * 100}
            />
          ))}
        </View>
      </View>
    </ScrollView>
  );

  const renderArticlesTab = () => (
    <ScrollView style={styles.tabContent} showsVerticalScrollIndicator={false}>
      <View
        style={[
          styles.section,
          { backgroundColor: theme.colors.background.primary },
        ]}
      >
        <Text
          style={[styles.sectionTitle, { color: theme.colors.text.primary }]}
        >
          Latest Articles
        </Text>
        {filterContent(articles).map((article, index) => (
          <ArticleCard
            key={article.id}
            article={article}
            theme={theme}
            onPress={() => navigation.navigate("ArticleReader", { article })}
            onToggleFavorite={() => toggleFavorite(article.id)}
            isFavorite={favoriteResources.has(article.id)}
            delay={index * 100}
          />
        ))}
      </View>
    </ScrollView>
  );

  const renderCoursesTab = () => (
    <ScrollView style={styles.tabContent} showsVerticalScrollIndicator={false}>
      <View
        style={[
          styles.section,
          { backgroundColor: theme.colors.background.primary },
        ]}
      >
        <Text
          style={[styles.sectionTitle, { color: theme.colors.text.primary }]}
        >
          Learning Courses
        </Text>
        {filterContent(courses).map((course, index) => (
          <CourseCard
            key={course.id}
            course={course}
            theme={theme}
            onPress={() => navigation.navigate("CourseDetail", { course })}
            delay={index * 100}
          />
        ))}
      </View>
    </ScrollView>
  );

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={[
          theme.colors.therapeutic.peaceful[50],
          theme.colors.therapeutic.calming[50],
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
            Mindful Resources
          </Text>

          <TouchableOpacity
            style={styles.searchButton}
            onPress={() => {
              /* Open search modal */
            }}
          >
            <MentalHealthIcon
              name="Brain"
              size={24}
              color={theme.colors.text.primary}
              variant="outline"
            />
          </TouchableOpacity>
        </View>

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <View
            style={[
              styles.searchBar,
              { backgroundColor: theme.colors.background.primary },
            ]}
          >
            <MentalHealthIcon
              name="Brain"
              size={20}
              color={theme.colors.text.secondary}
              variant="outline"
            />
            <TextInput
              style={[styles.searchInput, { color: theme.colors.text.primary }]}
              placeholder="Search resources, articles, courses..."
              placeholderTextColor={theme.colors.text.placeholder}
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity onPress={() => setSearchQuery("")}>
                <MentalHealthIcon
                  name="Heart"
                  size={20}
                  color={theme.colors.text.secondary}
                  variant="outline"
                />
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* Tab Selector */}
        <View style={styles.tabSelector}>
          {[
            { id: "resources", label: "Resources" },
            { id: "articles", label: "Articles" },
            { id: "courses", label: "Courses" },
          ].map((tab) => (
            <TouchableOpacity
              key={tab.id}
              style={[
                styles.tabButton,
                {
                  backgroundColor:
                    selectedTab === tab.id
                      ? theme.colors.therapeutic.peaceful[500]
                      : theme.colors.background.secondary,
                },
              ]}
              onPress={() => setSelectedTab(tab.id)}
            >
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
        <Animated.View
          style={[
            styles.content,
            {
              opacity: fadeAnim,
              transform: [{ scale: scaleAnim }],
            },
          ]}
        >
          {selectedTab === "resources" && renderResourcesTab()}
          {selectedTab === "articles" && renderArticlesTab()}
          {selectedTab === "courses" && renderCoursesTab()}
        </Animated.View>
      </LinearGradient>
    </SafeAreaView>
  );
};

const FeaturedResourceCard = ({ resource, theme, onPress, delay }) => {
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
    <Animated.View style={{ opacity: fadeAnim }}>
      <TouchableOpacity
        style={[styles.featuredCard, { backgroundColor: resource.color }]}
        onPress={onPress}
        activeOpacity={0.8}
      >
        <View style={styles.featuredIcon}>
          <MentalHealthIcon
            name={resource.icon}
            size={32}
            color={theme.colors.text.inverse}
            variant="filled"
          />
        </View>
        <Text
          style={[styles.featuredTitle, { color: theme.colors.text.inverse }]}
        >
          {resource.title}
        </Text>
        <Text
          style={[styles.featuredType, { color: theme.colors.text.inverse }]}
        >
          {resource.type}
        </Text>
        <Text
          style={[
            styles.featuredDuration,
            { color: theme.colors.text.inverse },
          ]}
        >
          {resource.duration}
        </Text>
        <Text
          style={[
            styles.featuredParticipants,
            { color: theme.colors.text.inverse },
          ]}
        >
          {resource.participants.toLocaleString()} joined
        </Text>
      </TouchableOpacity>
    </Animated.View>
  );
};

const CategoryCard = ({ category, theme, onPress, delay }) => {
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
    <Animated.View style={{ opacity: fadeAnim }}>
      <TouchableOpacity
        style={[
          styles.categoryCard,
          { backgroundColor: theme.colors.background.secondary },
        ]}
        onPress={onPress}
        activeOpacity={0.8}
      >
        <View
          style={[styles.categoryIcon, { backgroundColor: category.color }]}
        >
          <MentalHealthIcon
            name={category.icon}
            size={24}
            color={theme.colors.text.inverse}
            variant="filled"
          />
        </View>
        <Text
          style={[styles.categoryTitle, { color: theme.colors.text.primary }]}
        >
          {category.title}
        </Text>
        <Text
          style={[
            styles.categoryDescription,
            { color: theme.colors.text.secondary },
          ]}
        >
          {category.description}
        </Text>
        <Text style={[styles.categoryCount, { color: category.color }]}>
          {category.count} resources
        </Text>
      </TouchableOpacity>
    </Animated.View>
  );
};

const ArticleCard = ({
  article,
  theme,
  onPress,
  onToggleFavorite,
  isFavorite,
  delay,
}) => {
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
    <Animated.View style={{ opacity: fadeAnim }}>
      <TouchableOpacity
        style={[
          styles.articleCard,
          { backgroundColor: theme.colors.background.secondary },
        ]}
        onPress={onPress}
        activeOpacity={0.8}
      >
        <View style={styles.articleImage}>
          <LinearGradient
            colors={[
              theme.colors.therapeutic.calming[300],
              theme.colors.therapeutic.nurturing[300],
            ]}
            style={styles.articleImagePlaceholder}
          >
            <MentalHealthIcon
              name="Mindfulness"
              size={32}
              color={theme.colors.text.inverse}
              variant="filled"
            />
          </LinearGradient>
          {article.isPremium && (
            <View
              style={[
                styles.premiumBadge,
                { backgroundColor: theme.colors.warning[500] },
              ]}
            >
              <Text
                style={[
                  styles.premiumText,
                  { color: theme.colors.text.inverse },
                ]}
              >
                Pro
              </Text>
            </View>
          )}
        </View>

        <View style={styles.articleContent}>
          <Text
            style={[styles.articleTitle, { color: theme.colors.text.primary }]}
          >
            {article.title}
          </Text>
          <Text
            style={[
              styles.articleAuthor,
              { color: theme.colors.text.secondary },
            ]}
          >
            By {article.author}
          </Text>
          <Text
            style={[
              styles.articleExcerpt,
              { color: theme.colors.text.secondary },
            ]}
          >
            {article.excerpt}
          </Text>

          <View style={styles.articleFooter}>
            <View style={styles.articleMeta}>
              <Text
                style={[
                  styles.articleReadTime,
                  { color: theme.colors.text.tertiary },
                ]}
              >
                {article.readTime}
              </Text>
              <View
                style={[
                  styles.difficultyBadge,
                  { backgroundColor: theme.colors.gray[100] },
                ]}
              >
                <Text
                  style={[
                    styles.difficultyText,
                    { color: theme.colors.text.secondary },
                  ]}
                >
                  {article.difficulty}
                </Text>
              </View>
            </View>

            <TouchableOpacity onPress={onToggleFavorite}>
              <MentalHealthIcon
                name="Heart"
                size={20}
                color={
                  isFavorite
                    ? theme.colors.error[500]
                    : theme.colors.text.secondary
                }
                variant={isFavorite ? "filled" : "outline"}
              />
            </TouchableOpacity>
          </View>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};

const CourseCard = ({ course, theme, onPress, delay }) => {
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
    <Animated.View style={{ opacity: fadeAnim }}>
      <TouchableOpacity
        style={[
          styles.courseCard,
          { backgroundColor: theme.colors.background.secondary },
        ]}
        onPress={onPress}
        activeOpacity={0.8}
      >
        <View style={styles.courseImage}>
          <LinearGradient
            colors={[
              theme.colors.therapeutic.grounding[300],
              theme.colors.therapeutic.peaceful[300],
            ]}
            style={styles.courseImagePlaceholder}
          >
            <MentalHealthIcon
              name="Brain"
              size={32}
              color={theme.colors.text.inverse}
              variant="filled"
            />
          </LinearGradient>
          {course.isPremium && (
            <View
              style={[
                styles.premiumBadge,
                { backgroundColor: theme.colors.warning[500] },
              ]}
            >
              <Text
                style={[
                  styles.premiumText,
                  { color: theme.colors.text.inverse },
                ]}
              >
                Pro
              </Text>
            </View>
          )}
          {course.progress > 0 && (
            <View style={styles.progressOverlay}>
              <View
                style={[
                  styles.progressBar,
                  { backgroundColor: theme.colors.background.primary },
                ]}
              >
                <View
                  style={[
                    styles.progressFill,
                    {
                      backgroundColor: theme.colors.therapeutic.nurturing[500],
                      width: `${course.progress}%`,
                    },
                  ]}
                />
              </View>
              <Text
                style={[
                  styles.progressText,
                  { color: theme.colors.text.inverse },
                ]}
              >
                {course.progress}% complete
              </Text>
            </View>
          )}
        </View>

        <View style={styles.courseContent}>
          <Text
            style={[styles.courseTitle, { color: theme.colors.text.primary }]}
          >
            {course.title}
          </Text>
          <Text
            style={[
              styles.courseInstructor,
              { color: theme.colors.text.secondary },
            ]}
          >
            By {course.instructor}
          </Text>
          <Text
            style={[
              styles.courseDescription,
              { color: theme.colors.text.secondary },
            ]}
          >
            {course.description}
          </Text>

          <View style={styles.courseFooter}>
            <View style={styles.courseMeta}>
              <Text
                style={[
                  styles.courseDuration,
                  { color: theme.colors.text.tertiary },
                ]}
              >
                {course.duration} • {course.modules} modules
              </Text>
              <View style={styles.courseRating}>
                <Text
                  style={[
                    styles.ratingText,
                    { color: theme.colors.warning[500] },
                  ]}
                >
                  ★ {course.rating}
                </Text>
                <Text
                  style={[
                    styles.studentsText,
                    { color: theme.colors.text.tertiary },
                  ]}
                >
                  ({course.students.toLocaleString()})
                </Text>
              </View>
            </View>

            <View
              style={[
                styles.levelBadge,
                { backgroundColor: theme.colors.therapeutic.calming[100] },
              ]}
            >
              <Text
                style={[
                  styles.levelText,
                  { color: theme.colors.therapeutic.calming[700] },
                ]}
              >
                {course.level}
              </Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
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
  searchContainer: {
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    gap: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
  },
  tabSelector: {
    flexDirection: "row",
    paddingHorizontal: 20,
    marginBottom: 20,
    gap: 8,
  },
  tabButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  tabButtonText: {
    fontSize: 14,
    fontWeight: "500",
  },
  content: {
    flex: 1,
  },
  tabContent: {
    flex: 1,
    paddingHorizontal: 20,
  },
  section: {
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 16,
  },
  featuredScroll: {
    marginHorizontal: -20,
    paddingHorizontal: 20,
  },
  featuredCard: {
    width: 180,
    borderRadius: 12,
    padding: 16,
    marginRight: 12,
    alignItems: "center",
  },
  featuredIcon: {
    marginBottom: 12,
  },
  featuredTitle: {
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
    marginBottom: 4,
  },
  featuredType: {
    fontSize: 12,
    marginBottom: 8,
    opacity: 0.9,
  },
  featuredDuration: {
    fontSize: 12,
    marginBottom: 4,
    opacity: 0.8,
  },
  featuredParticipants: {
    fontSize: 10,
    opacity: 0.7,
  },
  categoriesGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  categoryCard: {
    width: (width - 64) / 2,
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
  },
  categoryIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  categoryTitle: {
    fontSize: 14,
    fontWeight: "600",
    textAlign: "center",
    marginBottom: 4,
  },
  categoryDescription: {
    fontSize: 12,
    textAlign: "center",
    lineHeight: 16,
    marginBottom: 8,
  },
  categoryCount: {
    fontSize: 12,
    fontWeight: "500",
  },
  articleCard: {
    borderRadius: 12,
    marginBottom: 16,
    overflow: "hidden",
  },
  articleImage: {
    height: 120,
    position: "relative",
  },
  articleImagePlaceholder: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  premiumBadge: {
    position: "absolute",
    top: 8,
    right: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  premiumText: {
    fontSize: 10,
    fontWeight: "bold",
  },
  articleContent: {
    padding: 16,
  },
  articleTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 4,
  },
  articleAuthor: {
    fontSize: 12,
    marginBottom: 8,
  },
  articleExcerpt: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 12,
  },
  articleFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  articleMeta: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  articleReadTime: {
    fontSize: 12,
  },
  difficultyBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  difficultyText: {
    fontSize: 10,
    fontWeight: "500",
  },
  courseCard: {
    borderRadius: 12,
    marginBottom: 16,
    overflow: "hidden",
  },
  courseImage: {
    height: 120,
    position: "relative",
  },
  courseImagePlaceholder: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  progressOverlay: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    padding: 8,
  },
  progressBar: {
    height: 4,
    borderRadius: 2,
    marginBottom: 4,
  },
  progressFill: {
    height: "100%",
    borderRadius: 2,
  },
  progressText: {
    fontSize: 10,
    fontWeight: "500",
  },
  courseContent: {
    padding: 16,
  },
  courseTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 4,
  },
  courseInstructor: {
    fontSize: 12,
    marginBottom: 8,
  },
  courseDescription: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 12,
  },
  courseFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
  },
  courseMeta: {
    flex: 1,
  },
  courseDuration: {
    fontSize: 12,
    marginBottom: 4,
  },
  courseRating: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  ratingText: {
    fontSize: 12,
    fontWeight: "600",
  },
  studentsText: {
    fontSize: 12,
  },
  levelBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  levelText: {
    fontSize: 10,
    fontWeight: "500",
  },
});

export default MindfulResourcesScreen;
