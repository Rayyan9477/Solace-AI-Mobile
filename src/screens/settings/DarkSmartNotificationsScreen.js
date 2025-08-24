import { LinearGradient } from "expo-linear-gradient";
import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Animated,
  SafeAreaView,
  Dimensions,
  FlatList,
} from "react-native";

import { MentalHealthIcon, NavigationIcon } from "../../components/icons";
import { useTheme } from "../../shared/theme/ThemeContext";

const { width, height } = Dimensions.get("window");

const DarkSmartNotificationsScreen = ({ navigation }) => {
  const { theme } = useTheme();
  const [selectedTab, setSelectedTab] = useState("notifications");
  const [todayNotifications, setTodayNotifications] = useState([]);
  
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;

  const tabs = [
    { id: "notifications", title: "Notifications", icon: "Brain" },
    { id: "history", title: "History", icon: "Heart" },
    { id: "settings", title: "Settings", icon: "Therapy" }
  ];

  const notificationTypes = [
    {
      id: "message_freud",
      title: "Message from Dr. Freud AI",
      subtitle: "15 Total Unread Message",
      time: "2m ago",
      icon: "therapy",
      color: "#10B981",
      character: "🧠",
      isUnread: true,
      gradient: ['#10B981', '#059669']
    },
    {
      id: "journal_incomplete", 
      title: "Journal Incomplete!",
      subtitle: "It's Reflection Time 😊",
      time: "5m ago",
      icon: "journal",
      color: "#8B5CF6",
      character: "📝",
      isUnread: true,
      gradient: ['#8B5CF6', '#7C3AED']
    },
    {
      id: "exercise_complete",
      title: "Exercise Complete!",
      subtitle: "Let's Breathing Done 🌱",
      time: "10m ago",
      icon: "mindfulness",
      color: "#059669",
      character: "🌱",
      isUnread: false,
      gradient: ['#059669', '#047857']
    },
    {
      id: "mental_health",
      title: "Mental Health Data is Here. 💚",
      subtitle: "Your Monthly Mental Analysis is Here.",
      time: "1h ago",
      icon: "insights",
      color: "#F59E0B",
      character: "💚",
      isUnread: false,
      gradient: ['#F59E0B', '#D97706']
    },
    {
      id: "mood_improved",
      title: "Mood Improved!",
      subtitle: "day 3 -> Happy",
      time: "2h ago",
      icon: "mood",
      color: "#10B981",
      character: "😊",
      isUnread: false,
      gradient: ['#10B981', '#059669']
    },
    {
      id: "stress_decreased",
      title: "Stress Decreased!",
      subtitle: "Stress Level is now 3.",
      time: "3h ago",
      icon: "brain",
      color: "#F97316",
      character: "😌",
      isUnread: false,
      gradient: ['#F97316', '#EA580C']
    },
    {
      id: "freud_recommendations",
      title: "Dr. Freud Recommendations 📍",
      subtitle: "Dr. AI Health Recommendations.",
      time: "1 day ago",
      icon: "therapy",
      color: "#EF4444",
      character: "📍",
      isUnread: false,
      gradient: ['#EF4444', '#DC2626']
    }
  ];

  const illustrativeNotifications = [
    {
      id: "freud_score_increase",
      title: "+8 Freud Score Increased",
      subtitle: "You're 24% happier compared to last month. Congratulations!",
      action: "See Score",
      character: "🎉",
      time: "now",
      gradient: ['#10B981', '#34D399'],
      illustration: "celebration"
    },
    {
      id: "journal_completed",
      title: "21/30 Journal Completed",
      subtitle: "You still need to complete 9 more journals this month. Keep it up!",
      action: "See Journal",
      character: "📖",
      time: "2h",
      gradient: ['#F59E0B', '#FCD34D'],
      illustration: "journal"
    },
    {
      id: "therapy_session",
      title: "05:25AM Therapy with Dr. Freud AI",
      subtitle: "You have a therapy session with Dr. Freud AI in 2h 2m from now.",
      action: "See Schedule",
      character: "🧠",
      time: "2h 2m",
      gradient: ['#EF4444', '#F87171'],
      illustration: "therapy"
    },
    {
      id: "stress_neutral",
      title: "Neutral Stress Decreased!",
      subtitle: "You are now Neutral. Congrats!",
      action: "See Stress Level",
      character: "🧘‍♀️",
      time: "45m",
      gradient: ['#8B5CF6', '#A78BFA'],
      illustration: "meditation"
    },
    {
      id: "meditation_time",
      title: "It's Time! Time for meditation session",
      subtitle: "Dr Freud AI said you need to do it Today Have 30 36m session",
      action: "Let's Meditate",
      character: "🕯️",
      time: "now",
      gradient: ['#F97316', '#FB923C'],
      illustration: "meditation_timer"
    },
    {
      id: "sleep_quality",
      title: "7h 50m Sleep Quality Increased",
      subtitle: "Your sleep quality is 53% compared to last month",
      action: "See Sleep Quality",
      character: "😴",
      time: "8h",
      gradient: ['#8B5CF6', '#C4B5FD'],
      illustration: "sleep"
    }
  ];

  useEffect(() => {
    setTodayNotifications(notificationTypes);
    
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
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

  const renderNotificationsList = () => {
    const notificationAnims = useRef(
      todayNotifications.map(() => new Animated.Value(0))
    ).current;

    useEffect(() => {
      const animations = notificationAnims.map((anim, index) =>
        Animated.timing(anim, {
          toValue: 1,
          duration: 500,
          delay: index * 100,
          useNativeDriver: true,
        })
      );
      
      Animated.stagger(100, animations).start();
    }, []);

    return (
      <ScrollView style={styles.notificationsList} showsVerticalScrollIndicator={false}>
        {/* Today's Notifications Header */}
        <Animated.View 
          style={[
            styles.sectionHeader,
            { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }
          ]}
        >
          <View style={styles.sectionTitleContainer}>
            <MentalHealthIcon
              name="Brain"
              size={20}
              color={theme.colors.therapeutic.calming[500]}
              variant="filled"
            />
            <Text style={[styles.sectionTitle, { color: theme.colors.text.primary }]}>
              Earlier This Day
            </Text>
          </View>
          <LinearGradient
            colors={['#EF4444', '#DC2626']}
            style={styles.unreadBadge}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <Text style={styles.unreadCount}>36</Text>
          </LinearGradient>
        </Animated.View>

        {/* Notification Items */}
        {todayNotifications.map((notification, index) => (
          <Animated.View
            key={notification.id}
            style={[
              styles.notificationItem,
              {
                backgroundColor: theme.colors.background.secondary,
                opacity: notificationAnims[index],
                transform: [
                  { 
                    translateY: notificationAnims[index].interpolate({
                      inputRange: [0, 1],
                      outputRange: [30, 0],
                    })
                  }
                ]
              }
            ]}
          >
            <TouchableOpacity 
              style={styles.notificationContent}
              onPress={() => {/* Handle notification press */}}
            >
              <View style={styles.notificationLeft}>
                <LinearGradient
                  colors={notification.gradient}
                  style={styles.notificationIcon}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                >
                  <Text style={styles.notificationCharacter}>
                    {notification.character}
                  </Text>
                  {notification.isUnread && (
                    <View style={styles.unreadIndicator}>
                      <View style={styles.unreadDot} />
                    </View>
                  )}
                </LinearGradient>
                
                <View style={styles.notificationText}>
                  <Text style={[styles.notificationTitle, { color: theme.colors.text.primary }]}>
                    {notification.title}
                  </Text>
                  <Text style={[styles.notificationSubtitle, { color: theme.colors.text.secondary }]}>
                    {notification.subtitle}
                  </Text>
                  <View style={styles.notificationMeta}>
                    <View style={[styles.priorityDot, { backgroundColor: notification.color }]} />
                    <Text style={[styles.notificationCategory, { color: theme.colors.text.tertiary }]}>
                      {notification.icon.toUpperCase()}
                    </Text>
                  </View>
                </View>
              </View>
              
              <View style={styles.notificationRight}>
                <Text style={[styles.notificationTime, { color: theme.colors.text.tertiary }]}>
                  {notification.time}
                </Text>
                <NavigationIcon
                  name="Home"
                  size={14}
                  color={theme.colors.text.tertiary}
                  variant="outline"
                  style={{ transform: [{ rotate: '180deg' }] }}
                />
              </View>
            </TouchableOpacity>
            
            {notification.isUnread && (
              <View style={styles.unreadHighlight} />
            )}
          </Animated.View>
        ))}

        {/* Last Week Section */}
        <View style={styles.sectionHeader}>
          <View style={styles.sectionTitleContainer}>
            <MentalHealthIcon
              name="Heart"
              size={18}
              color={theme.colors.therapeutic.nurturing[400]}
              variant="outline"
            />
            <Text style={[styles.sectionTitle, { color: theme.colors.text.primary }]}>
              Last Week
            </Text>
          </View>
        </View>

        <View style={[styles.notificationItem, { backgroundColor: theme.colors.background.secondary }]}>
          <TouchableOpacity style={styles.notificationContent}>
            <View style={styles.notificationLeft}>
              <LinearGradient
                colors={['#EF4444', '#DC2626']}
                style={styles.notificationIcon}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <Text style={styles.notificationCharacter}>💤</Text>
              </LinearGradient>
              <View style={styles.notificationText}>
                <Text style={[styles.notificationTitle, { color: theme.colors.text.primary }]}>
                  Stress Decreased!
                </Text>
                <Text style={[styles.notificationSubtitle, { color: theme.colors.text.secondary }]}>
                  Stress Level is now 3.
                </Text>
              </View>
            </View>
            <View style={styles.notificationRight}>
              <Text style={[styles.notificationTime, { color: theme.colors.text.tertiary }]}>
                5 days ago
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      </ScrollView>
    );
  };

  const renderIllustrativeNotifications = () => {
    const cardAnimations = useRef(
      illustrativeNotifications.map(() => new Animated.Value(0))
    ).current;

    useEffect(() => {
      const animations = cardAnimations.map((anim, index) =>
        Animated.timing(anim, {
          toValue: 1,
          duration: 600,
          delay: index * 150,
          useNativeDriver: true,
        })
      );
      
      Animated.stagger(150, animations).start();
    }, []);

    const renderIllustrationBackground = (type, gradient) => {
      switch (type) {
        case 'celebration':
          return (
            <View style={styles.illustrationBackground}>
              <View style={[styles.celebrationCircle, { backgroundColor: 'rgba(255,255,255,0.1)' }]} />
              <View style={[styles.celebrationCircle, { backgroundColor: 'rgba(255,255,255,0.05)', transform: [{ scale: 1.5 }] }]} />
              <Text style={[styles.decorativeEmoji, { top: 15, right: 20, fontSize: 24 }]}>✨</Text>
              <Text style={[styles.decorativeEmoji, { top: 45, right: 50, fontSize: 20 }]}>🎉</Text>
              <Text style={[styles.decorativeEmoji, { bottom: 25, right: 25, fontSize: 18 }]}>⭐</Text>
              <Text style={[styles.decorativeEmoji, { bottom: 50, left: 30, fontSize: 16 }]}>🎊</Text>
            </View>
          );
        case 'journal':
          return (
            <View style={styles.illustrationBackground}>
              <View style={[styles.journalLines, { backgroundColor: 'rgba(255,255,255,0.1)' }]} />
              <View style={[styles.journalLines, { backgroundColor: 'rgba(255,255,255,0.05)', top: 35 }]} />
              <Text style={[styles.decorativeEmoji, { top: 20, right: 25, fontSize: 22 }]}>📖</Text>
              <Text style={[styles.decorativeEmoji, { bottom: 30, right: 20, fontSize: 18 }]}>✍️</Text>
            </View>
          );
        case 'therapy':
          return (
            <View style={styles.illustrationBackground}>
              <View style={[styles.therapyBubble, { backgroundColor: 'rgba(255,255,255,0.1)' }]} />
              <Text style={[styles.decorativeEmoji, { top: 20, right: 30, fontSize: 22 }]}>🧠</Text>
              <Text style={[styles.decorativeEmoji, { bottom: 25, right: 15, fontSize: 18 }]}>💭</Text>
            </View>
          );
        case 'meditation':
          return (
            <View style={styles.illustrationBackground}>
              <View style={[styles.meditationAura, { backgroundColor: 'rgba(255,255,255,0.08)' }]} />
              <Text style={[styles.decorativeEmoji, { top: 15, right: 25, fontSize: 24 }]}>🧘‍♀️</Text>
              <Text style={[styles.decorativeEmoji, { bottom: 20, right: 15, fontSize: 18 }]}>🕯️</Text>
              <Text style={[styles.decorativeEmoji, { top: 40, left: 20, fontSize: 16 }]}>🌸</Text>
            </View>
          );
        case 'meditation_timer':
          return (
            <View style={styles.illustrationBackground}>
              <View style={[styles.timerCircle, { backgroundColor: 'rgba(255,255,255,0.1)' }]} />
              <Text style={[styles.decorativeEmoji, { top: 25, right: 30, fontSize: 20 }]}>🕯️</Text>
              <Text style={[styles.decorativeEmoji, { bottom: 30, right: 20, fontSize: 18 }]}>⏰</Text>
            </View>
          );
        case 'sleep':
          return (
            <View style={styles.illustrationBackground}>
              <View style={[styles.sleepCloud, { backgroundColor: 'rgba(255,255,255,0.08)' }]} />
              <Text style={[styles.decorativeEmoji, { top: 20, right: 20, fontSize: 22 }]}>💤</Text>
              <Text style={[styles.decorativeEmoji, { bottom: 25, right: 35, fontSize: 20 }]}>🌙</Text>
              <Text style={[styles.decorativeEmoji, { top: 30, left: 25, fontSize: 14 }]}>⭐</Text>
            </View>
          );
        default:
          return null;
      }
    };
    
    return (
      <ScrollView style={styles.illustrativeList} showsVerticalScrollIndicator={false}>
        {illustrativeNotifications.map((notification, index) => (
          <Animated.View
            key={notification.id}
            style={[
              styles.illustrativeCard,
              {
                opacity: cardAnimations[index],
                transform: [
                  { 
                    translateY: cardAnimations[index].interpolate({
                      inputRange: [0, 1],
                      outputRange: [50, 0],
                    })
                  },
                  { 
                    scale: cardAnimations[index].interpolate({
                      inputRange: [0, 1],
                      outputRange: [0.95, 1],
                    })
                  }
                ]
              }
            ]}
          >
            <LinearGradient
              colors={notification.gradient}
              style={styles.illustrativeGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              {renderIllustrationBackground(notification.illustration, notification.gradient)}
              
              <View style={styles.illustrativeContent}>
                <View style={styles.illustrativeHeader}>
                  <LinearGradient
                    colors={['rgba(255,255,255,0.25)', 'rgba(255,255,255,0.15)']}
                    style={styles.illustrativeIcon}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                  >
                    <Text style={styles.illustrativeCharacter}>
                      {notification.character}
                    </Text>
                  </LinearGradient>
                  
                  <View style={styles.illustrativeText}>
                    <Text style={[styles.illustrativeTitle, { color: theme.colors.text.inverse }]}>
                      {notification.title}
                    </Text>
                    <Text style={[styles.illustrativeSubtitle, { color: 'rgba(255,255,255,0.9)' }]}>
                      {notification.subtitle}
                    </Text>
                  </View>
                  
                  <View style={styles.timeContainer}>
                    <Text style={[styles.illustrativeTime, { color: 'rgba(255,255,255,0.8)' }]}>
                      {notification.time}
                    </Text>
                    <View style={[styles.timeDot, { backgroundColor: 'rgba(255,255,255,0.6)' }]} />
                  </View>
                </View>

                <TouchableOpacity 
                  style={[
                    styles.illustrativeAction,
                    { 
                      backgroundColor: 'rgba(255,255,255,0.2)',
                      borderWidth: 1,
                      borderColor: 'rgba(255,255,255,0.3)'
                    }
                  ]}
                  onPress={() => {/* Handle action */}}
                >
                  <Text style={[styles.illustrativeActionText, { color: theme.colors.text.inverse }]}>
                    {notification.action}
                  </Text>
                  <NavigationIcon
                    name="Home"
                    size={16}
                    color={theme.colors.text.inverse}
                    variant="outline"
                  />
                </TouchableOpacity>
              </View>
            </LinearGradient>
          </Animated.View>
        ))}
      </ScrollView>
    );
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background.primary }]}>
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
            style={{ transform: [{ rotate: '180deg' }] }}
          />
        </TouchableOpacity>

        <Text style={[styles.headerTitle, { color: theme.colors.text.primary }]}>
          Notifications
        </Text>

        <TouchableOpacity style={styles.menuButton}>
          <MentalHealthIcon
            name="Brain"
            size={24}
            color={theme.colors.text.primary}
            variant="outline"
          />
        </TouchableOpacity>
      </View>

      {/* Tab Navigation */}
      <View style={styles.tabNavigation}>
        {tabs.map((tab) => (
          <TouchableOpacity
            key={tab.id}
            style={[
              styles.tabItem,
              {
                backgroundColor: selectedTab === tab.id
                  ? theme.colors.therapeutic.calming[600]
                  : 'transparent'
              }
            ]}
            onPress={() => setSelectedTab(tab.id)}
          >
            <MentalHealthIcon
              name={tab.icon}
              size={20}
              color={selectedTab === tab.id
                ? theme.colors.text.inverse
                : theme.colors.text.secondary}
              variant={selectedTab === tab.id ? "filled" : "outline"}
            />
            <Text
              style={[
                styles.tabItemText,
                {
                  color: selectedTab === tab.id
                    ? theme.colors.text.inverse
                    : theme.colors.text.secondary
                }
              ]}
            >
              {tab.title}
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
            transform: [{ translateY: slideAnim }]
          }
        ]}
      >
        {selectedTab === "notifications" && renderNotificationsList()}
        {selectedTab === "history" && renderIllustrativeNotifications()}
        {selectedTab === "settings" && renderNotificationsList()} {/* Using list for now */}
      </Animated.View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  menuButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tabNavigation: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 16,
    gap: 8,
  },
  tabItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    gap: 8,
  },
  tabItemText: {
    fontSize: 14,
    fontWeight: '500',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  notificationsList: {
    flex: 1,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    marginTop: 8,
    paddingHorizontal: 4,
  },
  sectionTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  unreadBadge: {
    backgroundColor: '#EF4444',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    minWidth: 24,
    alignItems: 'center',
  },
  unreadCount: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  notificationItem: {
    borderRadius: 16,
    marginBottom: 10,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 3,
    position: 'relative',
  },
  notificationContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
  },
  notificationLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  notificationIcon: {
    width: 52,
    height: 52,
    borderRadius: 26,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
    position: 'relative',
  },
  notificationCharacter: {
    fontSize: 20,
  },
  notificationText: {
    flex: 1,
  },
  notificationTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  notificationSubtitle: {
    fontSize: 14,
    lineHeight: 20,
  },
  notificationRight: {
    alignItems: 'flex-end',
    gap: 8,
  },
  notificationTime: {
    fontSize: 12,
  },
  unreadDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#FFFFFF',
  },
  unreadIndicator: {
    position: 'absolute',
    top: 2,
    right: 2,
    backgroundColor: '#EF4444',
    borderRadius: 8,
    width: 16,
    height: 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  unreadHighlight: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 4,
    backgroundColor: '#10B981',
    borderTopLeftRadius: 16,
    borderBottomLeftRadius: 16,
  },
  notificationMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 4,
  },
  priorityDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  notificationCategory: {
    fontSize: 10,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  illustrativeList: {
    flex: 1,
  },
  illustrativeCard: {
    borderRadius: 16,
    marginBottom: 16,
    overflow: 'hidden',
  },
  illustrativeGradient: {
    padding: 20,
    minHeight: 120,
    position: 'relative',
  },
  illustrativeContent: {
    flex: 1,
    zIndex: 2,
  },
  illustrativeHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  illustrativeIcon: {
    width: 40,
    height: 40,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  illustrativeCharacter: {
    fontSize: 18,
  },
  illustrativeText: {
    flex: 1,
    marginRight: 12,
  },
  illustrativeTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
    lineHeight: 20,
  },
  illustrativeSubtitle: {
    fontSize: 14,
    lineHeight: 18,
  },
  illustrativeTime: {
    fontSize: 12,
    fontWeight: '500',
  },
  illustrativeAction: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    gap: 8,
    alignSelf: 'flex-start',
  },
  illustrativeActionText: {
    fontSize: 14,
    fontWeight: '600',
  },
  decorativeElements: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1,
  },
  decorativeEmoji: {
    position: 'absolute',
    fontSize: 20,
    opacity: 0.6,
  },
  illustrationBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 0,
  },
  celebrationCircle: {
    position: 'absolute',
    width: 80,
    height: 80,
    borderRadius: 40,
    top: 20,
    left: 20,
  },
  journalLines: {
    position: 'absolute',
    height: 2,
    left: 20,
    right: 60,
    top: 25,
  },
  therapyBubble: {
    position: 'absolute',
    width: 60,
    height: 40,
    borderRadius: 20,
    top: 25,
    right: 60,
  },
  meditationAura: {
    position: 'absolute',
    width: 100,
    height: 100,
    borderRadius: 50,
    top: 10,
    right: 10,
  },
  timerCircle: {
    position: 'absolute',
    width: 60,
    height: 60,
    borderRadius: 30,
    top: 30,
    right: 30,
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  sleepCloud: {
    position: 'absolute',
    width: 80,
    height: 40,
    borderRadius: 20,
    top: 15,
    right: 40,
  },
  timeContainer: {
    alignItems: 'center',
    gap: 4,
  },
  timeDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
  },
});

export default DarkSmartNotificationsScreen;