import { useNavigation } from "@react-navigation/native";
import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  Alert,
  Linking,
} from "react-native";

import ChatTopicSidebar from "../../components/chat/ChatTopicSidebar";
import { WebSafeLinearGradient as LinearGradient } from "../../components/common/WebSafeLinearGradient";
import { MentalHealthIcon } from "../../components/icons";
import { useTheme } from "../../shared/theme/ThemeContext";
import {
  spacing,
  typography,
  borderRadius,
  shadows,
} from "../../shared/theme/theme";

const EnhancedChatScreen = () => {
  const { theme } = useTheme();
  const navigation = useNavigation();
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const [selectedTopic, setSelectedTopic] = useState(null);

  const handleMenuPress = () => {
    setSidebarVisible(true);
  };

  const handleSidebarClose = () => {
    setSidebarVisible(false);
  };

  const handleTopicSelect = (topic) => {
    setSelectedTopic(topic);
    console.log("Selected topic:", topic.title);
  };

  const handleEmergencyPress = useCallback(async () => {
    Alert.alert(
      "🚨 Emergency Crisis Support",
      "If you are experiencing a mental health crisis, please contact:\n\n• National Suicide Prevention Lifeline: 988\n• Crisis Text Line: Text HOME to 741741\n• Or call 911 for immediate assistance\n\nYou are not alone. Help is available 24/7.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Call 988 Now",
          style: "default",
          onPress: async () => {
            try {
              const supported = await Linking.canOpenURL("tel:988");
              if (supported) {
                await Linking.openURL("tel:988");
              } else {
                Alert.alert(
                  "Unable to call",
                  "Please dial 988 manually for immediate assistance.",
                );
              }
            } catch (error) {
              console.error("Error making emergency call:", error);
              Alert.alert(
                "Call Error",
                "Please dial 988 manually for immediate assistance.",
              );
            }
          },
        },
        {
          text: "Crisis Chat",
          onPress: async () => {
            try {
              const supported = await Linking.canOpenURL("sms:741741");
              if (supported) {
                await Linking.openURL("sms:741741?body=HOME");
              } else {
                Alert.alert(
                  "Unable to text",
                  "Please text HOME to 741741 manually.",
                );
              }
            } catch (error) {
              console.error("Error opening text messaging:", error);
              Alert.alert("Text Error", "Please text HOME to 741741 manually.");
            }
          },
        },
      ],
    );
  }, []);

  const ProfessionalHeader = () => (
    <View
      style={[
        styles.header,
        { backgroundColor: theme.colors.background.primary },
      ]}
    >
      {/* Top Section - Branding */}
      <View style={styles.headerTop}>
        <TouchableOpacity
          style={styles.menuButton}
          onPress={handleMenuPress}
          accessibilityLabel="Open chat topics menu"
          accessibilityHint="Double tap to view conversation topics and categories"
        >
          <MentalHealthIcon
            name="menu"
            size={24}
            color={theme.colors.text.primary}
          />
        </TouchableOpacity>

        <View style={styles.brandingSection}>
          <Text
            style={[styles.brandTitle, { color: theme.colors.text.primary }]}
          >
            Doctor Freud.AI
          </Text>
          <View style={styles.statusTags}>
            <View style={[styles.statusTag, styles.mobileTag]}>
              <Text style={styles.statusTagText}>GET 4 MOBILE</Text>
            </View>
            <View style={[styles.statusTag, styles.webTag]}>
              <Text style={styles.statusTagText}>GET LLB DAYS</Text>
            </View>
          </View>
        </View>

        <View style={styles.headerActions}>
          <View
            style={[
              styles.topicsBadge,
              { backgroundColor: theme.colors.therapeutic.empathy[500] },
            ]}
          >
            <Text style={styles.topicsCount}>Topics 24</Text>
          </View>

          <TouchableOpacity style={styles.headerButton}>
            <MentalHealthIcon
              name="search"
              size={20}
              color={theme.colors.text.secondary}
            />
          </TouchableOpacity>

          <TouchableOpacity style={styles.headerButton}>
            <MentalHealthIcon
              name="settings"
              size={20}
              color={theme.colors.text.secondary}
            />
          </TouchableOpacity>
        </View>
      </View>

      {/* AI Assistant Section */}
      <LinearGradient
        colors={[
          theme.colors.therapeutic.calming[100],
          theme.colors.therapeutic.nurturing[100],
        ]}
        style={styles.aiSection}
      >
        <View style={styles.aiIconContainer}>
          <MentalHealthIcon
            name="brain"
            size={24}
            color={theme.colors.therapeutic.empathy[600]}
          />
        </View>
        <View style={styles.aiInfo}>
          <Text style={[styles.aiTitle, { color: theme.colors.text.primary }]}>
            AI Mental Health Assistant
          </Text>
          <Text
            style={[styles.aiSubtitle, { color: theme.colors.text.secondary }]}
          >
            Ready to support your wellness journey
          </Text>
        </View>
        <TouchableOpacity
          style={[
            styles.emergencyButton,
            { backgroundColor: theme.colors.therapeutic.empathy[500] },
          ]}
          onPress={handleEmergencyPress}
          accessibilityLabel="Emergency support"
          accessibilityHint="Double tap for immediate crisis support resources"
        >
          <Text style={styles.emergencyText}>🆘</Text>
        </TouchableOpacity>
      </LinearGradient>

      {/* Selected Topic Indicator */}
      {selectedTopic && (
        <View style={styles.selectedTopicBar}>
          <MentalHealthIcon
            name={selectedTopic.icon}
            size={16}
            color={theme.colors.therapeutic.empathy[500]}
          />
          <Text
            style={[
              styles.selectedTopicText,
              { color: theme.colors.text.primary },
            ]}
          >
            {selectedTopic.title}
          </Text>
          <TouchableOpacity
            onPress={() => setSelectedTopic(null)}
            style={styles.clearTopicButton}
          >
            <MentalHealthIcon
              name="close"
              size={16}
              color={theme.colors.text.secondary}
            />
          </TouchableOpacity>
        </View>
      )}
    </View>
  );

  const ChatPlaceholder = () => (
    <View style={styles.chatContainer}>
      <View style={styles.welcomeMessage}>
        <Text
          style={[styles.welcomeTitle, { color: theme.colors.text.primary }]}
        >
          Welcome to Doctor Freud.AI
        </Text>
        <Text
          style={[
            styles.welcomeSubtitle,
            { color: theme.colors.text.secondary },
          ]}
        >
          Your AI-powered mental health companion is here to support you. Select
          a topic from the menu to begin a conversation.
        </Text>

        <TouchableOpacity
          style={[
            styles.startButton,
            { backgroundColor: theme.colors.therapeutic.empathy[500] },
          ]}
          onPress={handleMenuPress}
        >
          <Text style={styles.startButtonText}>Browse Topics</Text>
          <MentalHealthIcon name="chevron-right" size={16} color="#FFFFFF" />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView
      style={[
        styles.container,
        { backgroundColor: theme.colors.background.primary },
      ]}
    >
      <StatusBar
        backgroundColor="transparent"
        translucent
        barStyle={theme.isDark ? "light-content" : "dark-content"}
      />

      <ProfessionalHeader />
      <ChatPlaceholder />

      <ChatTopicSidebar
        isVisible={sidebarVisible}
        onClose={handleSidebarClose}
        onTopicSelect={handleTopicSelect}
        currentTopicId={selectedTopic?.id}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingTop: StatusBar.currentHeight || 0,
    ...shadows.sm,
  },
  headerTop: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[3],
  },
  menuButton: {
    padding: spacing[2],
    marginRight: spacing[3],
  },
  brandingSection: {
    flex: 1,
  },
  brandTitle: {
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.bold,
    marginBottom: spacing[1],
  },
  statusTags: {
    flexDirection: "row",
    gap: spacing[2],
  },
  statusTag: {
    paddingHorizontal: spacing[2],
    paddingVertical: spacing[1],
    borderRadius: borderRadius.sm,
  },
  mobileTag: {
    backgroundColor: "#E8F5E8",
  },
  webTag: {
    backgroundColor: "#E8F3FF",
  },
  statusTagText: {
    fontSize: typography.sizes.xs,
    fontWeight: typography.weights.medium,
    color: "#666666",
  },
  headerActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing[2],
  },
  topicsBadge: {
    paddingHorizontal: spacing[3],
    paddingVertical: spacing[1],
    borderRadius: borderRadius.full,
  },
  topicsCount: {
    color: "#FFFFFF",
    fontSize: typography.sizes.xs,
    fontWeight: typography.weights.semiBold,
  },
  headerButton: {
    padding: spacing[2],
  },
  aiSection: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[3],
    marginHorizontal: spacing[4],
    marginVertical: spacing[2],
    borderRadius: borderRadius.lg,
  },
  aiIconContainer: {
    marginRight: spacing[3],
  },
  aiInfo: {
    flex: 1,
  },
  aiTitle: {
    fontSize: typography.sizes.base,
    fontWeight: typography.weights.semiBold,
    marginBottom: spacing[1],
  },
  aiSubtitle: {
    fontSize: typography.sizes.sm,
  },
  emergencyButton: {
    padding: spacing[2],
    borderRadius: borderRadius.full,
  },
  emergencyText: {
    fontSize: typography.sizes.sm,
  },
  selectedTopicBar: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[2],
    borderTopWidth: 1,
    borderTopColor: "rgba(0,0,0,0.1)",
    backgroundColor: "rgba(255, 107, 53, 0.05)",
  },
  selectedTopicText: {
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.medium,
    marginLeft: spacing[2],
    flex: 1,
  },
  clearTopicButton: {
    padding: spacing[1],
  },
  chatContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: spacing[6],
  },
  welcomeMessage: {
    alignItems: "center",
    maxWidth: 300,
  },
  welcomeTitle: {
    fontSize: typography.sizes.xl,
    fontWeight: typography.weights.bold,
    textAlign: "center",
    marginBottom: spacing[3],
  },
  welcomeSubtitle: {
    fontSize: typography.sizes.base,
    textAlign: "center",
    lineHeight: typography.lineHeights.relaxed,
    marginBottom: spacing[6],
  },
  startButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: spacing[6],
    paddingVertical: spacing[3],
    borderRadius: borderRadius.full,
    gap: spacing[2],
  },
  startButtonText: {
    color: "#FFFFFF",
    fontSize: typography.sizes.base,
    fontWeight: typography.weights.semiBold,
  },
});

export default EnhancedChatScreen;
