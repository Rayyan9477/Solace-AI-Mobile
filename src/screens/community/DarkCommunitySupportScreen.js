import React, { useState, useEffect, useRef } from 'react';
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
  TextInput,
  FlatList,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { freudDarkTheme } from '../../shared/theme/freudDarkTheme';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

// Community data
const COMMUNITY_POSTS = [
  {
    id: 1,
    author: 'Shameera Perera',
    username: '@shameera.perera',
    time: '2 hours ago',
    avatar: '👤',
    content: 'Hey there! I had my first successful session with the AI therapy bot today. The anxiety management techniques it suggested really helped me during my presentation. Has anyone else tried the breathing exercises?',
    likes: 24,
    comments: 8,
    category: 'Success Story',
    mood: 'happy',
    isLiked: false,
  },
  {
    id: 2,
    author: 'Marcus Thompson',
    username: '@marcus.t',
    time: '4 hours ago',
    avatar: '👨',
    content: 'Feeling overwhelmed with work stress lately. The meditation reminders have been helping, but some days are just harder than others. Any tips for managing work-life balance?',
    likes: 15,
    comments: 12,
    category: 'Support Needed',
    mood: 'neutral',
    isLiked: true,
  },
  {
    id: 3,
    author: 'Sarah Kim',
    username: '@sarah.mindful',
    time: '6 hours ago',
    avatar: '👩',
    content: 'Just completed my 30-day mindfulness streak! 🎉 The daily check-ins have become such a valuable part of my routine. Thank you to this amazing community for the support.',
    likes: 45,
    comments: 18,
    category: 'Milestone',
    mood: 'excited',
    isLiked: true,
  },
];

const COMMUNITY_CATEGORIES = [
  { id: 'all', name: 'All Posts', color: freudDarkTheme.colors.accent.primary, icon: '🌟' },
  { id: 'success', name: 'Success Stories', color: freudDarkTheme.colors.status.success, icon: '🎉' },
  { id: 'support', name: 'Support Needed', color: '#F59E0B', icon: '🤝' },
  { id: 'milestone', name: 'Milestones', color: '#8B5CF6', icon: '🏆' },
  { id: 'tips', name: 'Tips & Advice', color: '#06B6D4', icon: '💡' },
];

const NOTIFICATION_TYPES = [
  {
    id: 1,
    type: 'like',
    user: 'Marcus Thompson',
    action: 'liked your post',
    time: '5 minutes ago',
    avatar: '👨',
    isRead: false,
  },
  {
    id: 2,
    type: 'comment',
    user: 'Sarah Kim',
    action: 'commented on your post',
    time: '1 hour ago',
    avatar: '👩',
    isRead: false,
  },
  {
    id: 3,
    type: 'follow',
    user: 'Alex Rivera',
    action: 'started following you',
    time: '2 hours ago',
    avatar: '👥',
    isRead: true,
  },
];

export default function DarkCommunitySupportScreen() {
  const [currentView, setCurrentView] = useState('community'); // 'community', 'notifications', 'post'
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [posts, setPosts] = useState(COMMUNITY_POSTS);
  const [notifications, setNotifications] = useState(NOTIFICATION_TYPES);
  const [showNewPostModal, setShowNewPostModal] = useState(false);
  const [newPostContent, setNewPostContent] = useState('');
  const [newPostCategory, setNewPostCategory] = useState('support');
  const [showNotifications, setShowNotifications] = useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(screenHeight)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();
  }, [currentView]);

  const toggleLike = (postId) => {
    setPosts(prevPosts =>
      prevPosts.map(post =>
        post.id === postId
          ? {
              ...post,
              isLiked: !post.isLiked,
              likes: post.isLiked ? post.likes - 1 : post.likes + 1
            }
          : post
      )
    );
  };

  const openNewPostModal = () => {
    setShowNewPostModal(true);
    Animated.spring(slideAnim, {
      toValue: 0,
      tension: 50,
      friction: 8,
      useNativeDriver: true,
    }).start();
  };

  const closeNewPostModal = () => {
    Animated.spring(slideAnim, {
      toValue: screenHeight,
      tension: 50,
      friction: 8,
      useNativeDriver: true,
    }).start(() => {
      setShowNewPostModal(false);
      setNewPostContent('');
    });
  };

  const submitNewPost = () => {
    if (newPostContent.trim()) {
      const newPost = {
        id: posts.length + 1,
        author: 'You',
        username: '@your.username',
        time: 'Just now',
        avatar: '👤',
        content: newPostContent,
        likes: 0,
        comments: 0,
        category: newPostCategory,
        mood: 'neutral',
        isLiked: false,
      };
      setPosts(prevPosts => [newPost, ...prevPosts]);
      closeNewPostModal();
    }
  };

  const markNotificationAsRead = (notificationId) => {
    setNotifications(prevNotifications =>
      prevNotifications.map(notification =>
        notification.id === notificationId
          ? { ...notification, isRead: true }
          : notification
      )
    );
  };

  const renderWelcomeCard = () => (
    <View style={styles.welcomeCard}>
      <LinearGradient
        colors={[freudDarkTheme.colors.status.success, '#16A34A']}
        style={styles.welcomeGradient}
      >
        <View style={styles.welcomeContent}>
          <Text style={styles.welcomeEmoji}>💚</Text>
          <View style={styles.welcomeText}>
            <Text style={styles.welcomeTitle}>Welcome to Our Community!</Text>
            <Text style={styles.welcomeSubtitle}>
              Our community is a place of support and encouragement. Share your journey and connect with others.
            </Text>
          </View>
        </View>
        <TouchableOpacity style={styles.startButton} onPress={openNewPostModal}>
          <Text style={styles.startButtonText}>Start Posting</Text>
        </TouchableOpacity>
      </LinearGradient>
    </View>
  );

  const renderCategoryFilter = () => (
    <ScrollView 
      horizontal 
      showsHorizontalScrollIndicator={false}
      style={styles.categoryScroll}
      contentContainerStyle={styles.categoryScrollContent}
    >
      {COMMUNITY_CATEGORIES.map((category) => (
        <TouchableOpacity
          key={category.id}
          style={[
            styles.categoryChip,
            selectedCategory === category.id && styles.activeCategoryChip
          ]}
          onPress={() => setSelectedCategory(category.id)}
        >
          <Text style={styles.categoryEmoji}>{category.icon}</Text>
          <Text style={[
            styles.categoryText,
            selectedCategory === category.id && styles.activeCategoryText
          ]}>
            {category.name}
          </Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );

  const renderPostCard = (post) => (
    <View key={post.id} style={styles.postCard}>
      <LinearGradient
        colors={[freudDarkTheme.colors.background.secondary, freudDarkTheme.colors.background.tertiary]}
        style={styles.postGradient}
      >
        {/* Post Header */}
        <View style={styles.postHeader}>
          <View style={styles.postAuthorSection}>
            <View style={styles.avatarContainer}>
              <Text style={styles.avatarEmoji}>{post.avatar}</Text>
            </View>
            <View style={styles.authorInfo}>
              <Text style={styles.authorName}>{post.author}</Text>
              <Text style={styles.authorUsername}>{post.username}</Text>
            </View>
            <Text style={styles.postTime}>{post.time}</Text>
          </View>
          
          {/* Category Badge */}
          <View style={styles.categoryBadge}>
            <Text style={styles.categoryBadgeText}>{post.category}</Text>
          </View>
        </View>

        {/* Post Content */}
        <Text style={styles.postContent}>{post.content}</Text>

        {/* Post Actions */}
        <View style={styles.postActions}>
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={() => toggleLike(post.id)}
          >
            <Text style={[styles.actionIcon, post.isLiked && styles.likedIcon]}>
              {post.isLiked ? '❤️' : '🤍'}
            </Text>
            <Text style={styles.actionText}>{post.likes}</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionButton}>
            <Text style={styles.actionIcon}>💬</Text>
            <Text style={styles.actionText}>{post.comments}</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionButton}>
            <Text style={styles.actionIcon}>🔗</Text>
            <Text style={styles.actionText}>Share</Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>
    </View>
  );

  const renderCommunityView = () => (
    <Animated.ScrollView 
      style={[styles.container, { opacity: fadeAnim }]}
      showsVerticalScrollIndicator={false}
    >
      {renderWelcomeCard()}
      {renderCategoryFilter()}
      
      <View style={styles.postsContainer}>
        {posts
          .filter(post => selectedCategory === 'all' || post.category.toLowerCase().includes(selectedCategory))
          .map(renderPostCard)}
      </View>

      <View style={styles.bottomSpacer} />
    </Animated.ScrollView>
  );

  const renderNotificationItem = (notification) => (
    <TouchableOpacity
      key={notification.id}
      style={[
        styles.notificationItem,
        !notification.isRead && styles.unreadNotification
      ]}
      onPress={() => markNotificationAsRead(notification.id)}
    >
      <View style={styles.notificationLeft}>
        <Text style={styles.notificationAvatar}>{notification.avatar}</Text>
        <View style={styles.notificationContent}>
          <Text style={styles.notificationText}>
            <Text style={styles.notificationUser}>{notification.user}</Text>
            {' '}{notification.action}
          </Text>
          <Text style={styles.notificationTime}>{notification.time}</Text>
        </View>
      </View>
      {!notification.isRead && (
        <View style={styles.unreadIndicator} />
      )}
    </TouchableOpacity>
  );

  const renderNotificationsView = () => (
    <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
      <View style={styles.notificationsHeader}>
        <Text style={styles.notificationsTitle}>Community Notifications</Text>
        <TouchableOpacity style={styles.markAllReadButton}>
          <Text style={styles.markAllReadText}>Mark All Read</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.notificationsScroll} showsVerticalScrollIndicator={false}>
        {notifications.map(renderNotificationItem)}
      </ScrollView>
    </Animated.View>
  );

  const renderNewPostModal = () => (
    <Modal
      visible={showNewPostModal}
      transparent={true}
      animationType="none"
      onRequestClose={closeNewPostModal}
    >
      <View style={styles.modalOverlay}>
        <Animated.View 
          style={[
            styles.modalContainer,
            { transform: [{ translateY: slideAnim }] }
          ]}
        >
          <LinearGradient
            colors={[freudDarkTheme.colors.background.secondary, freudDarkTheme.colors.background.tertiary]}
            style={styles.modalGradient}
          >
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Add New Post</Text>
              <TouchableOpacity onPress={closeNewPostModal}>
                <Text style={styles.modalCloseText}>×</Text>
              </TouchableOpacity>
            </View>

            {/* Category Selection */}
            <View style={styles.categorySelection}>
              <Text style={styles.categorySelectionTitle}>Category:</Text>
              <ScrollView 
                horizontal 
                showsHorizontalScrollIndicator={false}
                style={styles.modalCategoryScroll}
              >
                {COMMUNITY_CATEGORIES.slice(1).map((category) => (
                  <TouchableOpacity
                    key={category.id}
                    style={[
                      styles.modalCategoryChip,
                      newPostCategory === category.id && styles.activeModalCategoryChip
                    ]}
                    onPress={() => setNewPostCategory(category.id)}
                  >
                    <Text style={styles.modalCategoryEmoji}>{category.icon}</Text>
                    <Text style={[
                      styles.modalCategoryText,
                      newPostCategory === category.id && styles.activeModalCategoryText
                    ]}>
                      {category.name}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>

            {/* Content Input */}
            <View style={styles.contentInput}>
              <Text style={styles.contentInputTitle}>Share your thoughts:</Text>
              <TextInput
                style={styles.textInput}
                multiline={true}
                numberOfLines={6}
                value={newPostContent}
                onChangeText={setNewPostContent}
                placeholder="What's on your mind? Share your experience, ask for support, or celebrate a milestone..."
                placeholderTextColor={freudDarkTheme.colors.text.secondary}
                textAlignVertical="top"
              />
            </View>

            {/* Action Buttons */}
            <View style={styles.modalActions}>
              <TouchableOpacity style={styles.cancelButton} onPress={closeNewPostModal}>
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.submitButton, !newPostContent.trim() && styles.disabledSubmitButton]} 
                onPress={submitNewPost}
                disabled={!newPostContent.trim()}
              >
                <LinearGradient
                  colors={newPostContent.trim() ? 
                    [freudDarkTheme.colors.accent.primary, '#F97316'] : 
                    ['#666', '#555']
                  }
                  style={styles.submitButtonGradient}
                >
                  <Text style={styles.submitButtonText}>Post Successfully</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </LinearGradient>
        </Animated.View>
      </View>
    </Modal>
  );

  return (
    <LinearGradient
      colors={[freudDarkTheme.colors.background.primary, freudDarkTheme.colors.background.secondary]}
      style={styles.screenContainer}
    >
      <StatusBar barStyle="light-content" backgroundColor={freudDarkTheme.colors.background.primary} />
      <SafeAreaView style={styles.safeArea}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Community Support</Text>
          <TouchableOpacity 
            style={styles.notificationButton}
            onPress={() => setShowNotifications(!showNotifications)}
          >
            <Text style={styles.notificationIcon}>🔔</Text>
            {notifications.some(n => !n.isRead) && (
              <View style={styles.notificationBadge}>
                <Text style={styles.notificationBadgeText}>
                  {notifications.filter(n => !n.isRead).length}
                </Text>
              </View>
            )}
          </TouchableOpacity>
        </View>

        {/* Content */}
        {showNotifications ? renderNotificationsView() : renderCommunityView()}

        {/* Floating Action Button */}
        {!showNotifications && (
          <TouchableOpacity style={styles.fab} onPress={openNewPostModal}>
            <LinearGradient
              colors={[freudDarkTheme.colors.accent.primary, '#F97316']}
              style={styles.fabGradient}
            >
              <Text style={styles.fabText}>+</Text>
            </LinearGradient>
          </TouchableOpacity>
        )}

        {renderNewPostModal()}
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: freudDarkTheme.colors.text.primary,
  },
  notificationButton: {
    position: 'relative',
    padding: 8,
  },
  notificationIcon: {
    fontSize: 24,
  },
  notificationBadge: {
    position: 'absolute',
    top: 4,
    right: 4,
    backgroundColor: '#DC2626',
    borderRadius: 8,
    minWidth: 16,
    height: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  notificationBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  welcomeCard: {
    marginBottom: 20,
    marginTop: 10,
  },
  welcomeGradient: {
    borderRadius: 20,
    padding: 20,
  },
  welcomeContent: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  welcomeEmoji: {
    fontSize: 40,
    marginRight: 15,
  },
  welcomeText: {
    flex: 1,
  },
  welcomeTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  welcomeSubtitle: {
    fontSize: 14,
    color: '#FFFFFF',
    opacity: 0.9,
    lineHeight: 20,
  },
  startButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignSelf: 'flex-start',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  startButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  categoryScroll: {
    marginBottom: 20,
  },
  categoryScrollContent: {
    paddingRight: 20,
  },
  categoryChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: freudDarkTheme.colors.background.tertiary,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    marginRight: 12,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  activeCategoryChip: {
    backgroundColor: freudDarkTheme.colors.accent.primary,
    borderColor: freudDarkTheme.colors.accent.primary,
  },
  categoryEmoji: {
    fontSize: 16,
    marginRight: 6,
  },
  categoryText: {
    fontSize: 14,
    fontWeight: '600',
    color: freudDarkTheme.colors.text.secondary,
  },
  activeCategoryText: {
    color: '#FFFFFF',
  },
  postsContainer: {
    flex: 1,
  },
  postCard: {
    marginBottom: 20,
  },
  postGradient: {
    borderRadius: 20,
    padding: 20,
  },
  postHeader: {
    marginBottom: 15,
  },
  postAuthorSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  avatarContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: freudDarkTheme.colors.accent.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  avatarEmoji: {
    fontSize: 20,
    color: '#FFFFFF',
  },
  authorInfo: {
    flex: 1,
  },
  authorName: {
    fontSize: 16,
    fontWeight: '700',
    color: freudDarkTheme.colors.text.primary,
    marginBottom: 2,
  },
  authorUsername: {
    fontSize: 12,
    color: freudDarkTheme.colors.text.secondary,
    opacity: 0.8,
  },
  postTime: {
    fontSize: 12,
    color: freudDarkTheme.colors.text.secondary,
    opacity: 0.7,
  },
  categoryBadge: {
    backgroundColor: freudDarkTheme.colors.accent.primary,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  categoryBadgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  postContent: {
    fontSize: 16,
    color: freudDarkTheme.colors.text.primary,
    lineHeight: 24,
    marginBottom: 20,
  },
  postActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 24,
  },
  actionIcon: {
    fontSize: 18,
    marginRight: 6,
  },
  likedIcon: {
    color: '#DC2626',
  },
  actionText: {
    fontSize: 14,
    fontWeight: '600',
    color: freudDarkTheme.colors.text.secondary,
  },
  fab: {
    position: 'absolute',
    bottom: 30,
    right: 30,
    width: 56,
    height: 56,
    borderRadius: 28,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  fabGradient: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  fabText: {
    fontSize: 24,
    fontWeight: '300',
    color: '#FFFFFF',
  },
  bottomSpacer: {
    height: 100,
  },
  
  // Notifications styles
  notificationsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
    marginTop: 10,
  },
  notificationsTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: freudDarkTheme.colors.text.primary,
  },
  markAllReadButton: {
    backgroundColor: freudDarkTheme.colors.accent.primary,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  markAllReadText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  notificationsScroll: {
    flex: 1,
  },
  notificationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: freudDarkTheme.colors.background.tertiary,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
  },
  unreadNotification: {
    borderLeftWidth: 4,
    borderLeftColor: freudDarkTheme.colors.accent.primary,
  },
  notificationLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  notificationAvatar: {
    fontSize: 20,
    marginRight: 12,
  },
  notificationContent: {
    flex: 1,
  },
  notificationText: {
    fontSize: 14,
    color: freudDarkTheme.colors.text.primary,
    marginBottom: 4,
  },
  notificationUser: {
    fontWeight: '700',
  },
  notificationTime: {
    fontSize: 12,
    color: freudDarkTheme.colors.text.secondary,
    opacity: 0.7,
  },
  unreadIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: freudDarkTheme.colors.accent.primary,
  },
  
  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'flex-end',
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 25,
    paddingTop: 10,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: freudDarkTheme.colors.text.primary,
  },
  modalCloseText: {
    fontSize: 24,
    color: freudDarkTheme.colors.text.secondary,
    fontWeight: '300',
    padding: 5,
  },
  categorySelection: {
    marginBottom: 25,
  },
  categorySelectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: freudDarkTheme.colors.text.primary,
    marginBottom: 12,
  },
  modalCategoryScroll: {
    flexDirection: 'row',
  },
  modalCategoryChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: freudDarkTheme.colors.background.primary,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 16,
    marginRight: 10,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  activeModalCategoryChip: {
    backgroundColor: freudDarkTheme.colors.accent.primary,
    borderColor: freudDarkTheme.colors.accent.primary,
  },
  modalCategoryEmoji: {
    fontSize: 14,
    marginRight: 6,
  },
  modalCategoryText: {
    fontSize: 12,
    fontWeight: '600',
    color: freudDarkTheme.colors.text.secondary,
  },
  activeModalCategoryText: {
    color: '#FFFFFF',
  },
  contentInput: {
    flex: 1,
    marginBottom: 25,
  },
  contentInputTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: freudDarkTheme.colors.text.primary,
    marginBottom: 12,
  },
  textInput: {
    backgroundColor: freudDarkTheme.colors.background.primary,
    borderRadius: 16,
    padding: 16,
    fontSize: 16,
    color: freudDarkTheme.colors.text.primary,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    minHeight: 120,
  },
  modalActions: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  cancelButton: {
    flex: 0.4,
    backgroundColor: freudDarkTheme.colors.background.primary,
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: freudDarkTheme.colors.text.secondary,
  },
  submitButton: {
    flex: 0.55,
    marginLeft: 12,
  },
  disabledSubmitButton: {
    opacity: 0.5,
  },
  submitButtonGradient: {
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: 'center',
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});