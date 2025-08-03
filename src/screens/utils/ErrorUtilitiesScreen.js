import { LinearGradient } from "expo-linear-gradient";
import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Animated,
  SafeAreaView,
  Share,
} from "react-native";

import { MentalHealthIcon, NavigationIcon } from "../../components/icons";
import { useTheme } from "../../contexts/ThemeContext";

const ErrorUtilitiesScreen = ({ navigation }) => {
  const { theme } = useTheme();
  const [selectedTab, setSelectedTab] = useState("help");
  const [appInfo, setAppInfo] = useState({
    version: "1.0.0",
    buildNumber: "1001",
    lastUpdate: new Date("2024-01-15"),
  });
  const fadeAnim = useRef(new Animated.Value(0)).current;

  const helpCategories = [
    {
      id: "getting-started",
      title: "Getting Started",
      description: "Learn the basics of using Solace AI",
      icon: "Brain",
      color: theme.colors.therapeutic.calming[500],
      articles: [
        "How to set up your profile",
        "Understanding your mental health score",
        "Using the mood tracker effectively",
        "Connecting with AI therapy",
      ],
    },
    {
      id: "features",
      title: "App Features",
      description: "Detailed guides for all features",
      icon: "Heart",
      color: theme.colors.therapeutic.nurturing[500],
      articles: [
        "Journaling for mental health",
        "Mindfulness sessions guide",
        "Community support features",
        "Sleep tracking and tips",
      ],
    },
    {
      id: "privacy",
      title: "Privacy & Security",
      description: "Your data protection and privacy",
      icon: "Therapy",
      color: theme.colors.therapeutic.grounding[500],
      articles: [
        "How we protect your data",
        "Privacy settings explained",
        "Data sharing policies",
        "Account security tips",
      ],
    },
    {
      id: "troubleshooting",
      title: "Troubleshooting",
      description: "Fix common issues and problems",
      icon: "Mindfulness",
      color: theme.colors.therapeutic.peaceful[500],
      articles: [
        "App crashes or freezes",
        "Login and account issues",
        "Notification problems",
        "Sync and backup issues",
      ],
    },
  ];

  const crisisResources = [
    {
      name: "National Suicide Prevention Lifeline",
      number: "988",
      description: "24/7 crisis support",
      type: "Crisis",
    },
    {
      name: "Crisis Text Line",
      number: "Text HOME to 741741",
      description: "Text-based crisis support",
      type: "Crisis",
    },
    {
      name: "NAMI HelpLine",
      number: "1-800-950-NAMI",
      description: "Mental health information and support",
      type: "Support",
    },
    {
      name: "Emergency Services",
      number: "911",
      description: "For immediate medical emergencies",
      type: "Emergency",
    },
  ];

  const commonErrors = [
    {
      id: "sync-failed",
      title: "Data Sync Failed",
      description: "Your data couldn't sync with the cloud",
      solution:
        "Check your internet connection and try again. If the problem persists, restart the app.",
      severity: "warning",
    },
    {
      id: "login-error",
      title: "Login Failed",
      description: "Unable to sign in to your account",
      solution:
        "Verify your credentials and internet connection. Reset your password if needed.",
      severity: "error",
    },
    {
      id: "feature-unavailable",
      title: "Feature Temporarily Unavailable",
      description: "This feature is under maintenance",
      solution: "This feature will be restored shortly. Try again later.",
      severity: "info",
    },
  ];

  const diagnosticInfo = {
    deviceInfo: "iPhone 14 Pro, iOS 17.2",
    appVersion: "1.0.0 (1001)",
    lastSync: new Date(Date.now() - 3600000), // 1 hour ago
    storageUsed: "45.2 MB",
    activeFeatures: ["Mood Tracking", "AI Therapy", "Community"],
  };

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();
  }, []);

  const handleContactSupport = () => {
    Alert.alert(
      "Contact Support",
      "Choose how you'd like to contact our support team:",
      [
        {
          text: "Email",
          onPress: () => Alert.alert("Email", "Opening email client..."),
        },
        {
          text: "In-App Chat",
          onPress: () => navigation.navigate("SupportChat"),
        },
        { text: "Cancel", style: "cancel" },
      ],
    );
  };

  const handleSendFeedback = () => {
    navigation.navigate("FeedbackForm");
  };

  const handleReportBug = () => {
    navigation.navigate("BugReport");
  };

  const handleShareDiagnostics = async () => {
    const diagnostics = `
Solace AI Diagnostics Report
Generated: ${new Date().toLocaleString()}

Device: ${diagnosticInfo.deviceInfo}
App Version: ${diagnosticInfo.appVersion}
Last Sync: ${diagnosticInfo.lastSync.toLocaleString()}
Storage Used: ${diagnosticInfo.storageUsed}
Active Features: ${diagnosticInfo.activeFeatures.join(", ")}
    `;

    try {
      await Share.share({
        message: diagnostics,
        title: "Solace AI Diagnostics",
      });
    } catch (error) {
      Alert.alert("Error", "Failed to share diagnostics");
    }
  };

  const getSeverityColor = (severity) => {
    switch (severity) {
      case "error":
        return theme.colors.error[500];
      case "warning":
        return theme.colors.warning[500];
      case "info":
        return theme.colors.therapeutic.calming[500];
      default:
        return theme.colors.gray[500];
    }
  };

  const renderHelpTab = () => (
    <ScrollView
      style={styles.helpContainer}
      showsVerticalScrollIndicator={false}
    >
      <Text style={[styles.helpIntro, { color: theme.colors.text.primary }]}>
        Find answers to common questions and learn how to make the most of
        Solace AI.
      </Text>

      {helpCategories.map((category, index) => (
        <HelpCategoryCard
          key={category.id}
          category={category}
          theme={theme}
          onPress={() => navigation.navigate("HelpCategory", { category })}
          delay={index * 100}
        />
      ))}

      <View
        style={[
          styles.quickActions,
          { backgroundColor: theme.colors.background.primary },
        ]}
      >
        <Text
          style={[
            styles.quickActionsTitle,
            { color: theme.colors.text.primary },
          ]}
        >
          Need More Help?
        </Text>

        <TouchableOpacity
          style={[
            styles.actionButton,
            { backgroundColor: theme.colors.therapeutic.calming[500] },
          ]}
          onPress={handleContactSupport}
        >
          <MentalHealthIcon
            name="Heart"
            size={20}
            color={theme.colors.text.inverse}
            variant="filled"
          />
          <Text
            style={[
              styles.actionButtonText,
              { color: theme.colors.text.inverse },
            ]}
          >
            Contact Support
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.actionButton,
            { backgroundColor: theme.colors.therapeutic.nurturing[500] },
          ]}
          onPress={handleSendFeedback}
        >
          <MentalHealthIcon
            name="Journal"
            size={20}
            color={theme.colors.text.inverse}
            variant="filled"
          />
          <Text
            style={[
              styles.actionButtonText,
              { color: theme.colors.text.inverse },
            ]}
          >
            Send Feedback
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );

  const renderErrorsTab = () => (
    <ScrollView
      style={styles.errorsContainer}
      showsVerticalScrollIndicator={false}
    >
      <Text style={[styles.errorsIntro, { color: theme.colors.text.primary }]}>
        Common errors and their solutions. If you're experiencing an issue not
        listed here, please contact support.
      </Text>

      {commonErrors.map((error, index) => (
        <ErrorCard
          key={error.id}
          error={error}
          theme={theme}
          delay={index * 100}
        />
      ))}

      <View
        style={[
          styles.errorActions,
          { backgroundColor: theme.colors.background.primary },
        ]}
      >
        <Text
          style={[
            styles.errorActionsTitle,
            { color: theme.colors.text.primary },
          ]}
        >
          Still Having Issues?
        </Text>

        <TouchableOpacity
          style={[
            styles.actionButton,
            { backgroundColor: theme.colors.error[500] },
          ]}
          onPress={handleReportBug}
        >
          <MentalHealthIcon
            name="Brain"
            size={20}
            color={theme.colors.text.inverse}
            variant="filled"
          />
          <Text
            style={[
              styles.actionButtonText,
              { color: theme.colors.text.inverse },
            ]}
          >
            Report a Bug
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.actionButton,
            { backgroundColor: theme.colors.therapeutic.peaceful[500] },
          ]}
          onPress={handleShareDiagnostics}
        >
          <MentalHealthIcon
            name="Therapy"
            size={20}
            color={theme.colors.text.inverse}
            variant="filled"
          />
          <Text
            style={[
              styles.actionButtonText,
              { color: theme.colors.text.inverse },
            ]}
          >
            Share Diagnostics
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );

  const renderCrisisTab = () => (
    <ScrollView
      style={styles.crisisContainer}
      showsVerticalScrollIndicator={false}
    >
      <View
        style={[
          styles.crisisWarning,
          { backgroundColor: theme.colors.error[50] },
        ]}
      >
        <MentalHealthIcon
          name="Heart"
          size={24}
          color={theme.colors.error[600]}
          variant="filled"
        />
        <Text
          style={[styles.crisisWarningText, { color: theme.colors.error[700] }]}
        >
          If you're having thoughts of harming yourself or others, please reach
          out for immediate help.
        </Text>
      </View>

      <Text style={[styles.crisisIntro, { color: theme.colors.text.primary }]}>
        Crisis resources are available 24/7. Don't hesitate to reach out -
        you're not alone.
      </Text>

      {crisisResources.map((resource, index) => (
        <CrisisResourceCard
          key={index}
          resource={resource}
          theme={theme}
          delay={index * 100}
        />
      ))}

      <View
        style={[
          styles.crisisInfo,
          { backgroundColor: theme.colors.therapeutic.calming[50] },
        ]}
      >
        <Text
          style={[
            styles.crisisInfoTitle,
            { color: theme.colors.therapeutic.calming[700] },
          ]}
        >
          Remember
        </Text>
        <Text
          style={[
            styles.crisisInfoText,
            { color: theme.colors.therapeutic.calming[600] },
          ]}
        >
          • You matter and your life has value{"\n"}• Crisis feelings are
          temporary{"\n"}• Professional help is available{"\n"}• You don't have
          to face this alone{"\n"}• Recovery and healing are possible
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
            Help & Support
          </Text>

          <View style={styles.placeholder} />
        </View>

        {/* Tab Selector */}
        <View style={styles.tabSelector}>
          {[
            { id: "help", label: "Help Center", icon: "Brain" },
            { id: "errors", label: "Troubleshoot", icon: "Therapy" },
            { id: "crisis", label: "Crisis Resources", icon: "Heart" },
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
          {selectedTab === "help" && renderHelpTab()}
          {selectedTab === "errors" && renderErrorsTab()}
          {selectedTab === "crisis" && renderCrisisTab()}
        </Animated.View>
      </LinearGradient>
    </SafeAreaView>
  );
};

const HelpCategoryCard = ({ category, theme, onPress, delay }) => {
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
          styles.helpCard,
          { backgroundColor: theme.colors.background.primary },
        ]}
        onPress={onPress}
      >
        <View
          style={[styles.helpCardIcon, { backgroundColor: category.color }]}
        >
          <MentalHealthIcon
            name={category.icon}
            size={24}
            color={theme.colors.text.inverse}
            variant="filled"
          />
        </View>

        <View style={styles.helpCardContent}>
          <Text
            style={[styles.helpCardTitle, { color: theme.colors.text.primary }]}
          >
            {category.title}
          </Text>
          <Text
            style={[
              styles.helpCardDescription,
              { color: theme.colors.text.secondary },
            ]}
          >
            {category.description}
          </Text>
          <Text
            style={[
              styles.helpCardArticles,
              { color: theme.colors.text.tertiary },
            ]}
          >
            {category.articles.length} articles
          </Text>
        </View>

        <NavigationIcon
          name="Home"
          size={20}
          color={theme.colors.text.secondary}
          variant="outline"
        />
      </TouchableOpacity>
    </Animated.View>
  );
};

const ErrorCard = ({ error, theme, delay }) => {
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
      <View
        style={[
          styles.errorCard,
          { backgroundColor: theme.colors.background.primary },
        ]}
      >
        <View style={styles.errorHeader}>
          <View
            style={[
              styles.errorSeverity,
              { backgroundColor: getSeverityColor(error.severity) },
            ]}
          >
            <Text
              style={[
                styles.errorSeverityText,
                { color: theme.colors.text.inverse },
              ]}
            >
              {error.severity.toUpperCase()}
            </Text>
          </View>
          <Text
            style={[styles.errorTitle, { color: theme.colors.text.primary }]}
          >
            {error.title}
          </Text>
        </View>

        <Text
          style={[
            styles.errorDescription,
            { color: theme.colors.text.secondary },
          ]}
        >
          {error.description}
        </Text>

        <View
          style={[
            styles.errorSolution,
            { backgroundColor: theme.colors.therapeutic.calming[50] },
          ]}
        >
          <Text
            style={[
              styles.errorSolutionTitle,
              { color: theme.colors.therapeutic.calming[700] },
            ]}
          >
            Solution:
          </Text>
          <Text
            style={[
              styles.errorSolutionText,
              { color: theme.colors.therapeutic.calming[600] },
            ]}
          >
            {error.solution}
          </Text>
        </View>
      </View>
    </Animated.View>
  );
};

const CrisisResourceCard = ({ resource, theme, delay }) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 600,
      delay,
      useNativeDriver: true,
    }).start();
  }, [delay]);

  const getTypeColor = (type) => {
    switch (type) {
      case "Crisis":
        return theme.colors.error[500];
      case "Emergency":
        return theme.colors.error[600];
      case "Support":
        return theme.colors.therapeutic.nurturing[500];
      default:
        return theme.colors.gray[500];
    }
  };

  return (
    <Animated.View style={{ opacity: fadeAnim }}>
      <TouchableOpacity
        style={[
          styles.crisisCard,
          { backgroundColor: theme.colors.background.primary },
        ]}
        onPress={() =>
          Alert.alert("Call", `Call ${resource.number}?`, [
            { text: "Cancel", style: "cancel" },
            { text: "Call", onPress: () => Alert.alert("Calling...") },
          ])
        }
      >
        <View style={styles.crisisCardHeader}>
          <Text
            style={[
              styles.crisisCardTitle,
              { color: theme.colors.text.primary },
            ]}
          >
            {resource.name}
          </Text>
          <View
            style={[
              styles.crisisCardType,
              { backgroundColor: getTypeColor(resource.type) },
            ]}
          >
            <Text
              style={[
                styles.crisisCardTypeText,
                { color: theme.colors.text.inverse },
              ]}
            >
              {resource.type}
            </Text>
          </View>
        </View>

        <Text
          style={[
            styles.crisisCardNumber,
            { color: getTypeColor(resource.type) },
          ]}
        >
          {resource.number}
        </Text>

        <Text
          style={[
            styles.crisisCardDescription,
            { color: theme.colors.text.secondary },
          ]}
        >
          {resource.description}
        </Text>
      </TouchableOpacity>
    </Animated.View>
  );
};

const getSeverityColor = (severity) => {
  // Function would normally use theme, but defining here for simplicity
  const colors = {
    error: "#EF4444",
    warning: "#F59E0B",
    info: "#0EA5E9",
  };
  return colors[severity] || "#6B7280";
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
  placeholder: {
    width: 44,
  },
  tabSelector: {
    flexDirection: "row",
    paddingHorizontal: 20,
    marginBottom: 20,
    gap: 4,
  },
  tabButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 10,
    borderRadius: 8,
    gap: 4,
  },
  tabButtonText: {
    fontSize: 12,
    fontWeight: "500",
  },
  content: {
    flex: 1,
  },
  helpContainer: {
    flex: 1,
    paddingHorizontal: 20,
  },
  helpIntro: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 24,
    textAlign: "center",
  },
  helpCard: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  helpCardIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  helpCardContent: {
    flex: 1,
  },
  helpCardTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 4,
  },
  helpCardDescription: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 4,
  },
  helpCardArticles: {
    fontSize: 12,
  },
  quickActions: {
    borderRadius: 16,
    padding: 20,
    marginTop: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  quickActionsTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 16,
    textAlign: "center",
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    borderRadius: 8,
    marginBottom: 12,
    gap: 8,
  },
  actionButtonText: {
    fontSize: 14,
    fontWeight: "600",
  },
  errorsContainer: {
    flex: 1,
    paddingHorizontal: 20,
  },
  errorsIntro: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 24,
    textAlign: "center",
  },
  errorCard: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  errorHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
    gap: 12,
  },
  errorSeverity: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  errorSeverityText: {
    fontSize: 10,
    fontWeight: "bold",
  },
  errorTitle: {
    fontSize: 16,
    fontWeight: "600",
    flex: 1,
  },
  errorDescription: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 12,
  },
  errorSolution: {
    borderRadius: 8,
    padding: 12,
  },
  errorSolutionTitle: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 4,
  },
  errorSolutionText: {
    fontSize: 14,
    lineHeight: 20,
  },
  errorActions: {
    borderRadius: 16,
    padding: 20,
    marginTop: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  errorActionsTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 16,
    textAlign: "center",
  },
  crisisContainer: {
    flex: 1,
    paddingHorizontal: 20,
  },
  crisisWarning: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    gap: 12,
  },
  crisisWarningText: {
    fontSize: 14,
    fontWeight: "600",
    flex: 1,
    lineHeight: 20,
  },
  crisisIntro: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 24,
    textAlign: "center",
  },
  crisisCard: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  crisisCardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  crisisCardTitle: {
    fontSize: 16,
    fontWeight: "600",
    flex: 1,
  },
  crisisCardType: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  crisisCardTypeText: {
    fontSize: 10,
    fontWeight: "bold",
  },
  crisisCardNumber: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 4,
  },
  crisisCardDescription: {
    fontSize: 14,
    lineHeight: 20,
  },
  crisisInfo: {
    borderRadius: 12,
    padding: 16,
    marginTop: 20,
  },
  crisisInfoTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 8,
  },
  crisisInfoText: {
    fontSize: 14,
    lineHeight: 20,
  },
});

export default ErrorUtilitiesScreen;
