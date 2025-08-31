import { LinearGradient } from "expo-linear-gradient";
import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  ScrollView,
  TouchableOpacity,
  Animated,
  Dimensions,
  Modal,
  FlatList,
  Image,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { freudDarkTheme } from "../../shared/theme/freudDarkTheme";

const { width: screenWidth, height: screenHeight } = Dimensions.get("window");

// Resource data
const RESOURCE_CATEGORIES = [
  {
    id: "resources",
    title: "Our Resources",
    color: [
      freudDarkTheme.colors.background.secondary,
      freudDarkTheme.colors.background.tertiary,
    ],
    icon: "📚",
    count: "12 Resources",
  },
  {
    id: "articles",
    title: "Our Articles",
    color: ["#22C55E", "#16A34A"],
    icon: "📰",
    count: "24 Articles",
  },
  {
    id: "courses",
    title: "Our Courses",
    color: ["#F97316", "#EA580C"],
    icon: "🎓",
    count: "8 Courses",
  },
  {
    id: "meditation",
    title: "Meditation",
    color: ["#8B5CF6", "#7C3AED"],
    icon: "🧘",
    count: "5 min session",
  },
];

const ARTICLES = [
  {
    id: 1,
    title: "The Only Big Day Today Mental Health: Celebrate!",
    author: "Dr. Sarah Johnson",
    readTime: "5 min read",
    category: "Mental Health",
    thumbnail: "🌟",
    isLocked: false,
  },
  {
    id: 2,
    title: "Learning to Reconnect: A Journey of Self-Discovery",
    author: "Marcus Thompson",
    readTime: "8 min read",
    category: "Self-Care",
    thumbnail: "🌱",
    isLocked: false,
  },
  {
    id: 3,
    title: "Mindfulness in Daily Life: Small Steps, Big Changes",
    author: "Dr. Emily Chen",
    readTime: "6 min read",
    category: "Mindfulness",
    thumbnail: "🧘‍♀️",
    isLocked: true,
  },
];

const COURSES = [
  {
    id: 1,
    title: "What is Life? Why?",
    subtitle: "A philosophical journey",
    instructor: "Dr. Alan Watts",
    duration: "2 hours 45 min",
    lessons: 12,
    thumbnail: "🤔",
    progress: 0,
    isLocked: false,
  },
  {
    id: 2,
    title: "Mindfulness 101",
    subtitle: "Basic mindfulness practices",
    instructor: "Sarah Kim",
    duration: "1 hour 30 min",
    lessons: 8,
    thumbnail: "🌸",
    progress: 0,
    isLocked: true,
  },
];

const MEDITATION_SESSIONS = [
  {
    id: 1,
    title: "Morning Meditation",
    duration: "05:55",
    type: "Guided",
    instructor: "Lisa Johnson",
    thumbnail: "🌅",
    isPlaying: false,
  },
  {
    id: 2,
    title: "Stress Relief Session",
    duration: "10:30",
    type: "Breathing",
    instructor: "Michael Chen",
    thumbnail: "💙",
    isPlaying: false,
  },
  {
    id: 3,
    title: "Evening Relaxation",
    duration: "15:45",
    type: "Sleep",
    instructor: "Emma Davis",
    thumbnail: "🌙",
    isPlaying: false,
  },
];

const FEATURED_RESOURCES = [
  {
    id: 1,
    title: "Mindfulness 101",
    author: "Dr. Sarah Wilson",
    type: "Course",
    thumbnail: "🧘‍♀️",
    rating: 4.8,
    students: 2400,
  },
  {
    id: 2,
    title: "Deep Meditation",
    author: "Marcus Johnson",
    type: "Audio",
    thumbnail: "🎵",
    rating: 4.9,
    students: 1800,
  },
  {
    id: 3,
    title: "Stress Management",
    author: "Dr. Emily Chen",
    type: "Article",
    thumbnail: "📖",
    rating: 4.7,
    students: 3200,
  },
];

export default function DarkMindfulResourcesScreen() {
  const [currentView, setCurrentView] = useState("main"); // 'main', 'articles', 'courses', 'meditation'
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [playingSession, setPlayingSession] = useState(null);
  const [showFullContent, setShowFullContent] = useState(false);
  const [selectedContent, setSelectedContent] = useState(null);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(screenHeight)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();
  }, [currentView]);

  const openCategory = (category) => {
    setSelectedCategory(category);
    setCurrentView(category.id);
  };

  const openContent = (content) => {
    setSelectedContent(content);
    setShowFullContent(true);
    Animated.spring(slideAnim, {
      toValue: 0,
      tension: 50,
      friction: 8,
      useNativeDriver: true,
    }).start();
  };

  const closeContent = () => {
    Animated.spring(slideAnim, {
      toValue: screenHeight,
      tension: 50,
      friction: 8,
      useNativeDriver: true,
    }).start(() => {
      setShowFullContent(false);
      setSelectedContent(null);
    });
  };

  const togglePlaySession = (sessionId) => {
    setPlayingSession(playingSession === sessionId ? null : sessionId);
  };

  const renderCategoryCard = (category) => (
    <TouchableOpacity
      key={category.id}
      style={styles.categoryCard}
      onPress={() => openCategory(category)}
    >
      <LinearGradient colors={category.color} style={styles.categoryGradient}>
        <View style={styles.categoryHeader}>
          <Text style={styles.categoryIcon}>{category.icon}</Text>
          <Text style={styles.categoryCount}>{category.count}</Text>
        </View>
        <Text style={styles.categoryTitle}>{category.title}</Text>
      </LinearGradient>
    </TouchableOpacity>
  );

  const renderFeaturedResource = (resource) => (
    <TouchableOpacity
      key={resource.id}
      style={styles.featuredResourceCard}
      onPress={() => openContent(resource)}
    >
      <LinearGradient
        colors={[
          freudDarkTheme.colors.background.secondary,
          freudDarkTheme.colors.background.tertiary,
        ]}
        style={styles.featuredResourceGradient}
      >
        <View style={styles.resourceLeft}>
          <Text style={styles.resourceThumbnail}>{resource.thumbnail}</Text>
          <View style={styles.resourceInfo}>
            <Text style={styles.resourceTitle}>{resource.title}</Text>
            <Text style={styles.resourceAuthor}>{resource.author}</Text>
            <View style={styles.resourceStats}>
              <Text style={styles.resourceRating}>⭐ {resource.rating}</Text>
              <Text style={styles.resourceStudents}>
                {resource.students}+ students
              </Text>
            </View>
          </View>
        </View>
        <View style={styles.resourceType}>
          <Text style={styles.resourceTypeText}>{resource.type}</Text>
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );

  const renderMainView = () => (
    <Animated.ScrollView
      style={[styles.container, { opacity: fadeAnim }]}
      showsVerticalScrollIndicator={false}
    >
      {/* Categories Grid */}
      <View style={styles.categoriesGrid}>
        {RESOURCE_CATEGORIES.map(renderCategoryCard)}
      </View>

      {/* Featured Resources Section */}
      <View style={styles.featuredSection}>
        <Text style={styles.sectionTitle}>Featured Resources</Text>
        {FEATURED_RESOURCES.map(renderFeaturedResource)}
      </View>

      <View style={styles.bottomSpacer} />
    </Animated.ScrollView>
  );

  const renderArticlesView = () => (
    <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => setCurrentView("main")}>
          <Text style={styles.backButton}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Our Articles</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {ARTICLES.map((article) => (
          <TouchableOpacity
            key={article.id}
            style={styles.articleCard}
            onPress={() => !article.isLocked && openContent(article)}
          >
            <LinearGradient
              colors={[
                freudDarkTheme.colors.background.secondary,
                freudDarkTheme.colors.background.tertiary,
              ]}
              style={styles.articleGradient}
            >
              <View style={styles.articleHeader}>
                <Text style={styles.articleThumbnail}>{article.thumbnail}</Text>
                <View style={styles.articleInfo}>
                  <Text style={styles.articleCategory}>{article.category}</Text>
                  <Text style={styles.articleReadTime}>{article.readTime}</Text>
                </View>
                {article.isLocked && (
                  <View style={styles.lockIcon}>
                    <Text style={styles.lockText}>🔒</Text>
                  </View>
                )}
              </View>
              <Text style={styles.articleTitle}>{article.title}</Text>
              <Text style={styles.articleAuthor}>By {article.author}</Text>

              {article.isLocked ? (
                <TouchableOpacity style={styles.unlockButton}>
                  <Text style={styles.unlockButtonText}>
                    Unlock Full Article
                  </Text>
                </TouchableOpacity>
              ) : (
                <TouchableOpacity style={styles.readButton}>
                  <Text style={styles.readButtonText}>Read Now</Text>
                </TouchableOpacity>
              )}
            </LinearGradient>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </Animated.View>
  );

  const renderCoursesView = () => (
    <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => setCurrentView("main")}>
          <Text style={styles.backButton}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Our Courses</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {COURSES.map((course) => (
          <TouchableOpacity
            key={course.id}
            style={styles.courseCard}
            onPress={() => !course.isLocked && openContent(course)}
          >
            <LinearGradient
              colors={["#F97316", "#EA580C"]}
              style={styles.courseGradient}
            >
              <View style={styles.courseHeader}>
                <Text style={styles.courseThumbnail}>{course.thumbnail}</Text>
                {course.isLocked && (
                  <View style={styles.courseLockIcon}>
                    <Text style={styles.courseLockText}>🔒</Text>
                  </View>
                )}
              </View>
              <Text style={styles.courseTitle}>{course.title}</Text>
              <Text style={styles.courseSubtitle}>{course.subtitle}</Text>
              <Text style={styles.courseInstructor}>
                By {course.instructor}
              </Text>

              <View style={styles.courseStats}>
                <Text style={styles.courseDuration}>{course.duration}</Text>
                <Text style={styles.courseLessons}>
                  {course.lessons} lessons
                </Text>
              </View>

              {course.isLocked ? (
                <TouchableOpacity style={styles.unlockCourseButton}>
                  <Text style={styles.unlockCourseButtonText}>
                    Unlock Full Course
                  </Text>
                </TouchableOpacity>
              ) : (
                <TouchableOpacity style={styles.startCourseButton}>
                  <Text style={styles.startCourseButtonText}>Start Course</Text>
                </TouchableOpacity>
              )}
            </LinearGradient>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </Animated.View>
  );

  const renderMeditationView = () => (
    <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => setCurrentView("main")}>
          <Text style={styles.backButton}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Meditation</Text>
      </View>

      {/* Main Session Card */}
      <View style={styles.mainSessionCard}>
        <LinearGradient
          colors={["#22C55E", "#16A34A"]}
          style={styles.mainSessionGradient}
        >
          <View style={styles.sessionHeader}>
            <Text style={styles.sessionStatus}>Currently Playing</Text>
            <TouchableOpacity>
              <Text style={styles.sessionMore}>⋯</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.mainSessionTitle}>
            Mindfulness Meditation Intro
          </Text>
          <Text style={styles.mainSessionTime}>05:55</Text>

          <View style={styles.sessionControls}>
            <TouchableOpacity style={styles.controlButton}>
              <Text style={styles.controlIcon}>↻</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.playButton}>
              <Text style={styles.playIcon}>⏸️</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.controlButton}>
              <Text style={styles.controlIcon}>↻</Text>
            </TouchableOpacity>
          </View>
        </LinearGradient>
      </View>

      {/* Session List */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        style={styles.sessionsList}
      >
        <Text style={styles.sectionTitle}>More Sessions</Text>
        {MEDITATION_SESSIONS.map((session) => (
          <TouchableOpacity
            key={session.id}
            style={styles.sessionItem}
            onPress={() => togglePlaySession(session.id)}
          >
            <LinearGradient
              colors={[
                freudDarkTheme.colors.background.secondary,
                freudDarkTheme.colors.background.tertiary,
              ]}
              style={styles.sessionItemGradient}
            >
              <View style={styles.sessionLeft}>
                <Text style={styles.sessionThumbnail}>{session.thumbnail}</Text>
                <View style={styles.sessionInfo}>
                  <Text style={styles.sessionTitle}>{session.title}</Text>
                  <Text style={styles.sessionInstructor}>
                    By {session.instructor}
                  </Text>
                  <Text style={styles.sessionType}>
                    {session.type} • {session.duration}
                  </Text>
                </View>
              </View>
              <TouchableOpacity
                style={styles.sessionPlayButton}
                onPress={() => togglePlaySession(session.id)}
              >
                <Text style={styles.sessionPlayIcon}>
                  {playingSession === session.id ? "⏸️" : "▶️"}
                </Text>
              </TouchableOpacity>
            </LinearGradient>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </Animated.View>
  );

  const renderContentModal = () => (
    <Modal
      visible={showFullContent}
      transparent
      animationType="none"
      onRequestClose={closeContent}
    >
      <View style={styles.modalOverlay}>
        <Animated.View
          style={[
            styles.modalContainer,
            { transform: [{ translateY: slideAnim }] },
          ]}
        >
          <LinearGradient
            colors={[
              freudDarkTheme.colors.background.secondary,
              freudDarkTheme.colors.background.tertiary,
            ]}
            style={styles.modalGradient}
          >
            <View style={styles.modalHeader}>
              <TouchableOpacity onPress={closeContent}>
                <Text style={styles.modalCloseText}>×</Text>
              </TouchableOpacity>
            </View>

            {selectedContent && (
              <ScrollView
                style={styles.modalContent}
                showsVerticalScrollIndicator={false}
              >
                <Text style={styles.modalTitle}>{selectedContent.title}</Text>

                {selectedContent.author && (
                  <Text style={styles.modalAuthor}>
                    By {selectedContent.author}
                  </Text>
                )}

                {selectedContent.readTime && (
                  <Text style={styles.modalReadTime}>
                    {selectedContent.readTime}
                  </Text>
                )}

                {selectedContent.duration && (
                  <Text style={styles.modalDuration}>
                    {selectedContent.duration}
                  </Text>
                )}

                <Text style={styles.modalDescription}>
                  This is a comprehensive guide to mindfulness and mental
                  wellness. Learn practical techniques for managing stress,
                  improving focus, and developing emotional resilience through
                  proven methods.
                  {"\n\n"}
                  Our expert-crafted content provides step-by-step instructions
                  and real-world applications that you can implement immediately
                  in your daily life.
                </Text>

                <TouchableOpacity style={styles.modalActionButton}>
                  <LinearGradient
                    colors={[freudDarkTheme.colors.accent.primary, "#F97316"]}
                    style={styles.modalActionGradient}
                  >
                    <Text style={styles.modalActionText}>
                      {selectedContent.type === "Course"
                        ? "Start Course"
                        : selectedContent.type === "Article"
                          ? "Read Article"
                          : "Start Session"}
                    </Text>
                  </LinearGradient>
                </TouchableOpacity>
              </ScrollView>
            )}
          </LinearGradient>
        </Animated.View>
      </View>
    </Modal>
  );

  return (
    <LinearGradient
      colors={[
        freudDarkTheme.colors.background.primary,
        freudDarkTheme.colors.background.secondary,
      ]}
      style={styles.screenContainer}
    >
      <StatusBar
        barStyle="light-content"
        backgroundColor={freudDarkTheme.colors.background.primary}
      />
      <SafeAreaView style={styles.safeArea}>
        {/* Header */}
        <View style={styles.mainHeader}>
          <TouchableOpacity onPress={() => console.log("Go back")}>
            <Text style={styles.mainBackButton}>←</Text>
          </TouchableOpacity>
          <Text style={styles.mainHeaderTitle}>Mindful Resources</Text>
        </View>

        {currentView === "main" && renderMainView()}
        {currentView === "articles" && renderArticlesView()}
        {currentView === "courses" && renderCoursesView()}
        {currentView === "meditation" && renderMeditationView()}
        {renderContentModal()}
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
    paddingHorizontal: 20,
  },
  mainHeader: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
  },
  mainBackButton: {
    fontSize: 24,
    color: freudDarkTheme.colors.text.primary,
    fontWeight: "600",
    marginRight: 15,
  },
  mainHeaderTitle: {
    fontSize: 28,
    fontWeight: "700",
    color: freudDarkTheme.colors.text.primary,
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 20,
    marginBottom: 30,
  },
  backButton: {
    fontSize: 16,
    fontWeight: "600",
    color: freudDarkTheme.colors.accent.primary,
    marginRight: 20,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: freudDarkTheme.colors.text.primary,
    flex: 1,
  },
  categoriesGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginTop: 20,
    marginBottom: 30,
  },
  categoryCard: {
    width: "48%",
    aspectRatio: 1.2,
    marginBottom: 15,
  },
  categoryGradient: {
    flex: 1,
    borderRadius: 20,
    padding: 20,
    justifyContent: "space-between",
  },
  categoryHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  categoryIcon: {
    fontSize: 32,
  },
  categoryCount: {
    fontSize: 12,
    fontWeight: "600",
    color: "#FFFFFF",
    opacity: 0.8,
  },
  categoryTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#FFFFFF",
    marginTop: 10,
  },
  featuredSection: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: freudDarkTheme.colors.text.primary,
    marginBottom: 20,
  },
  featuredResourceCard: {
    marginBottom: 15,
  },
  featuredResourceGradient: {
    borderRadius: 16,
    padding: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  resourceLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  resourceThumbnail: {
    fontSize: 32,
    marginRight: 15,
  },
  resourceInfo: {
    flex: 1,
  },
  resourceTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: freudDarkTheme.colors.text.primary,
    marginBottom: 4,
  },
  resourceAuthor: {
    fontSize: 14,
    color: freudDarkTheme.colors.text.secondary,
    opacity: 0.8,
    marginBottom: 8,
  },
  resourceStats: {
    flexDirection: "row",
    alignItems: "center",
  },
  resourceRating: {
    fontSize: 12,
    fontWeight: "600",
    color: freudDarkTheme.colors.accent.primary,
    marginRight: 15,
  },
  resourceStudents: {
    fontSize: 12,
    color: freudDarkTheme.colors.text.secondary,
    opacity: 0.7,
  },
  resourceType: {
    backgroundColor: freudDarkTheme.colors.accent.primary,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  resourceTypeText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  bottomSpacer: {
    height: 30,
  },

  // Articles view styles
  articleCard: {
    marginBottom: 20,
  },
  articleGradient: {
    borderRadius: 20,
    padding: 20,
  },
  articleHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 15,
  },
  articleThumbnail: {
    fontSize: 40,
  },
  articleInfo: {
    flex: 1,
    alignItems: "flex-end",
  },
  articleCategory: {
    fontSize: 12,
    fontWeight: "600",
    color: freudDarkTheme.colors.accent.primary,
    marginBottom: 4,
  },
  articleReadTime: {
    fontSize: 12,
    color: freudDarkTheme.colors.text.secondary,
    opacity: 0.8,
  },
  lockIcon: {
    marginLeft: 15,
  },
  lockText: {
    fontSize: 20,
  },
  articleTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: freudDarkTheme.colors.text.primary,
    marginBottom: 10,
    lineHeight: 24,
  },
  articleAuthor: {
    fontSize: 14,
    color: freudDarkTheme.colors.text.secondary,
    opacity: 0.8,
    marginBottom: 20,
  },
  readButton: {
    backgroundColor: freudDarkTheme.colors.accent.primary,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignSelf: "flex-start",
  },
  readButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  unlockButton: {
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignSelf: "flex-start",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.2)",
  },
  unlockButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: freudDarkTheme.colors.text.secondary,
  },

  // Courses view styles
  courseCard: {
    marginBottom: 20,
  },
  courseGradient: {
    borderRadius: 20,
    padding: 20,
  },
  courseHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 15,
  },
  courseThumbnail: {
    fontSize: 40,
  },
  courseLockIcon: {
    backgroundColor: "rgba(0, 0, 0, 0.3)",
    borderRadius: 12,
    padding: 8,
  },
  courseLockText: {
    fontSize: 16,
  },
  courseTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#FFFFFF",
    marginBottom: 8,
  },
  courseSubtitle: {
    fontSize: 14,
    color: "#FFFFFF",
    opacity: 0.9,
    marginBottom: 10,
  },
  courseInstructor: {
    fontSize: 14,
    color: "#FFFFFF",
    opacity: 0.8,
    marginBottom: 15,
  },
  courseStats: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  courseDuration: {
    fontSize: 12,
    fontWeight: "600",
    color: "#FFFFFF",
    marginRight: 15,
  },
  courseLessons: {
    fontSize: 12,
    color: "#FFFFFF",
    opacity: 0.8,
  },
  startCourseButton: {
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignSelf: "flex-start",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.3)",
  },
  startCourseButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  unlockCourseButton: {
    backgroundColor: "rgba(0, 0, 0, 0.3)",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignSelf: "flex-start",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.2)",
  },
  unlockCourseButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: "rgba(255, 255, 255, 0.7)",
  },

  // Meditation view styles
  mainSessionCard: {
    marginBottom: 30,
  },
  mainSessionGradient: {
    borderRadius: 20,
    padding: 25,
    alignItems: "center",
  },
  sessionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
    marginBottom: 20,
  },
  sessionStatus: {
    fontSize: 12,
    fontWeight: "600",
    color: "#FFFFFF",
    opacity: 0.9,
  },
  sessionMore: {
    fontSize: 18,
    color: "#FFFFFF",
    fontWeight: "600",
  },
  mainSessionTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#FFFFFF",
    textAlign: "center",
    marginBottom: 15,
  },
  mainSessionTime: {
    fontSize: 32,
    fontWeight: "700",
    color: "#FFFFFF",
    marginBottom: 25,
  },
  sessionControls: {
    flexDirection: "row",
    alignItems: "center",
    gap: 30,
  },
  controlButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    alignItems: "center",
    justifyContent: "center",
  },
  controlIcon: {
    fontSize: 16,
    color: "#FFFFFF",
  },
  playButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "rgba(255, 255, 255, 0.3)",
    alignItems: "center",
    justifyContent: "center",
  },
  playIcon: {
    fontSize: 20,
    color: "#FFFFFF",
  },
  sessionsList: {
    flex: 1,
  },
  sessionItem: {
    marginBottom: 15,
  },
  sessionItemGradient: {
    borderRadius: 16,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  sessionLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  sessionThumbnail: {
    fontSize: 24,
    marginRight: 15,
  },
  sessionInfo: {
    flex: 1,
  },
  sessionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: freudDarkTheme.colors.text.primary,
    marginBottom: 4,
  },
  sessionInstructor: {
    fontSize: 12,
    color: freudDarkTheme.colors.text.secondary,
    opacity: 0.8,
    marginBottom: 4,
  },
  sessionType: {
    fontSize: 12,
    color: freudDarkTheme.colors.accent.primary,
    fontWeight: "600",
  },
  sessionPlayButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: freudDarkTheme.colors.accent.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  sessionPlayIcon: {
    fontSize: 16,
    color: "#FFFFFF",
  },

  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    justifyContent: "flex-end",
  },
  modalContainer: {
    height: screenHeight * 0.85,
  },
  modalGradient: {
    flex: 1,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    padding: 20,
    paddingTop: 10,
  },
  modalHeader: {
    alignItems: "flex-end",
    marginBottom: 20,
    paddingTop: 10,
  },
  modalCloseText: {
    fontSize: 24,
    color: freudDarkTheme.colors.text.secondary,
    fontWeight: "300",
    padding: 5,
  },
  modalContent: {
    flex: 1,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: freudDarkTheme.colors.text.primary,
    marginBottom: 15,
    lineHeight: 32,
  },
  modalAuthor: {
    fontSize: 16,
    color: freudDarkTheme.colors.text.secondary,
    marginBottom: 10,
  },
  modalReadTime: {
    fontSize: 14,
    color: freudDarkTheme.colors.accent.primary,
    fontWeight: "600",
    marginBottom: 20,
  },
  modalDuration: {
    fontSize: 14,
    color: freudDarkTheme.colors.accent.primary,
    fontWeight: "600",
    marginBottom: 20,
  },
  modalDescription: {
    fontSize: 16,
    color: freudDarkTheme.colors.text.primary,
    lineHeight: 24,
    marginBottom: 30,
  },
  modalActionButton: {
    marginBottom: 30,
  },
  modalActionGradient: {
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: "center",
  },
  modalActionText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFFFFF",
  },
});
