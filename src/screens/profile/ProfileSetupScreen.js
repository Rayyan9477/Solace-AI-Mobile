import { LinearGradient } from "expo-linear-gradient";
import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Image,
  Alert,
  Animated,
  SafeAreaView,
  Platform,
} from "react-native";

// Platform-specific imports handled at runtime

import { MentalHealthIcon, NavigationIcon } from "../../components/icons";
import { useTheme } from "../../shared/theme/ThemeContext";

const ProfileSetupScreen = ({ navigation, route }) => {
  const { theme } = useTheme();
  const [currentStep, setCurrentStep] = useState(0);
  const [profileData, setProfileData] = useState({
    avatar: null,
    displayName: "",
    bio: "",
    goals: [],
    preferences: {
      communication: "balanced",
      sessionLength: "medium",
      reminderFrequency: "daily",
      privacyLevel: "moderate",
    },
    mentalHealthGoals: [],
    interests: [],
  });

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;

  const setupSteps = [
    {
      id: "basic_info",
      title: "Basic Information",
      description: "Tell us a bit about yourself",
      icon: "Brain",
    },
    {
      id: "goals",
      title: "Your Goals",
      description: "What would you like to achieve?",
      icon: "Heart",
    },
    {
      id: "preferences",
      title: "Preferences",
      description: "Customize your experience",
      icon: "Mindfulness",
    },
    {
      id: "interests",
      title: "Interests & Activities",
      description: "What activities help you feel better?",
      icon: "Therapy",
    },
  ];

  const mentalHealthGoals = [
    "Reduce anxiety",
    "Improve mood",
    "Better sleep",
    "Stress management",
    "Build confidence",
    "Improve relationships",
    "Develop coping skills",
    "Increase self-awareness",
    "Manage emotions",
    "Find life purpose",
  ];

  const interests = [
    "Meditation",
    "Exercise",
    "Reading",
    "Music",
    "Art & Creativity",
    "Nature walks",
    "Journaling",
    "Cooking",
    "Photography",
    "Learning new skills",
    "Volunteering",
    "Socializing",
  ];

  const currentStepData = setupSteps[currentStep];
  const progress = ((currentStep + 1) / setupSteps.length) * 100;

  useEffect(() => {
    // Animate in when component mounts or step changes
    fadeAnim.setValue(0);
    slideAnim.setValue(50);

    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.spring(slideAnim, {
        toValue: 0,
        tension: 50,
        friction: 8,
        useNativeDriver: true,
      }),
    ]).start();
  }, [currentStep]);

  const handleAvatarPick = async () => {
    if (Platform.OS === "web") {
      // Web fallback - use HTML file input
      const input = document.createElement("input");
      input.type = "file";
      input.accept = "image/*";
      input.onchange = (e) => {
        const file = e.target.files[0];
        if (file) {
          const reader = new FileReader();
          reader.onload = () => {
            setProfileData((prev) => ({
              ...prev,
              avatar: reader.result,
            }));
          };
          reader.readAsDataURL(file);
        }
      };
      input.click();
      return;
    }

    // Dynamic import for native platforms
    try {
      const ImagePicker = await import("expo-image-picker");
      
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (status !== "granted") {
        Alert.alert(
          "Permission needed",
          "We need camera roll permissions to set your profile picture.",
        );
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled) {
        setProfileData((prev) => ({
          ...prev,
          avatar: result.assets[0].uri,
        }));
      }
    } catch (error) {
      console.warn("Image picker not available:", error);
      Alert.alert("Error", "Image picker not available on this platform.");
    }
  };

  const handleGoalToggle = (goal) => {
    setProfileData((prev) => ({
      ...prev,
      mentalHealthGoals: prev.mentalHealthGoals.includes(goal)
        ? prev.mentalHealthGoals.filter((g) => g !== goal)
        : [...prev.mentalHealthGoals, goal],
    }));
  };

  const handleInterestToggle = (interest) => {
    setProfileData((prev) => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter((i) => i !== interest)
        : [...prev.interests, interest],
    }));
  };

  const handleNext = () => {
    if (currentStep < setupSteps.length - 1) {
      setCurrentStep((prev) => prev + 1);
    } else {
      handleComplete();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const handleComplete = () => {
    // Save profile data and navigate
    Alert.alert(
      "Profile Setup Complete!",
      "Your profile has been set up successfully. You can always update these settings later.",
      [
        {
          text: "Continue",
          onPress: () => navigation.navigate("Home"),
        },
      ],
    );
  };

  const isStepComplete = () => {
    switch (currentStepData.id) {
      case "basic_info":
        return profileData.displayName.trim().length > 0;
      case "goals":
        return profileData.mentalHealthGoals.length > 0;
      case "preferences":
        return true; // Preferences have defaults
      case "interests":
        return profileData.interests.length > 0;
      default:
        return false;
    }
  };

  const renderStepContent = () => {
    switch (currentStepData.id) {
      case "basic_info":
        return (
          <View style={styles.stepContent}>
            {/* Avatar Selection */}
            <TouchableOpacity
              style={styles.avatarContainer}
              onPress={handleAvatarPick}
            >
              {profileData.avatar ? (
                <Image
                  source={{ uri: profileData.avatar }}
                  style={styles.avatar}
                />
              ) : (
                <View
                  style={[
                    styles.avatarPlaceholder,
                    { backgroundColor: theme.colors.gray[200] },
                  ]}
                >
                  <MentalHealthIcon
                    name="Brain"
                    size={40}
                    color={theme.colors.gray[500]}
                    variant="outline"
                  />
                </View>
              )}
              <View
                style={[
                  styles.avatarBadge,
                  { backgroundColor: theme.colors.therapeutic.calming[500] },
                ]}
              >
                <NavigationIcon
                  name="Home"
                  size={16}
                  color={theme.colors.text.inverse}
                  variant="outline"
                />
              </View>
            </TouchableOpacity>

            <Text
              style={[
                styles.avatarLabel,
                { color: theme.colors.text.secondary },
              ]}
            >
              Tap to add profile picture (optional)
            </Text>

            {/* Display Name */}
            <View style={styles.inputContainer}>
              <Text
                style={[
                  styles.inputLabel,
                  { color: theme.colors.text.primary },
                ]}
              >
                Display Name *
              </Text>
              <TextInput
                style={[
                  styles.textInput,
                  {
                    backgroundColor: theme.colors.background.secondary,
                    borderColor: theme.colors.gray[300],
                    color: theme.colors.text.primary,
                  },
                ]}
                placeholder="How should we call you?"
                placeholderTextColor={theme.colors.text.tertiary}
                value={profileData.displayName}
                onChangeText={(text) =>
                  setProfileData((prev) => ({ ...prev, displayName: text }))
                }
              />
            </View>

            {/* Bio */}
            <View style={styles.inputContainer}>
              <Text
                style={[
                  styles.inputLabel,
                  { color: theme.colors.text.primary },
                ]}
              >
                About You (Optional)
              </Text>
              <TextInput
                style={[
                  styles.textInput,
                  styles.textArea,
                  {
                    backgroundColor: theme.colors.background.secondary,
                    borderColor: theme.colors.gray[300],
                    color: theme.colors.text.primary,
                  },
                ]}
                placeholder="Tell us a bit about yourself..."
                placeholderTextColor={theme.colors.text.tertiary}
                value={profileData.bio}
                onChangeText={(text) =>
                  setProfileData((prev) => ({ ...prev, bio: text }))
                }
                multiline
                numberOfLines={3}
                textAlignVertical="top"
              />
            </View>
          </View>
        );

      case "goals":
        return (
          <View style={styles.stepContent}>
            <Text
              style={[
                styles.stepDescription,
                { color: theme.colors.text.secondary },
              ]}
            >
              Select the areas you'd like to focus on (choose as many as you
              like):
            </Text>
            <View style={styles.goalsContainer}>
              {mentalHealthGoals.map((goal, index) => (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.goalItem,
                    {
                      backgroundColor: profileData.mentalHealthGoals.includes(
                        goal,
                      )
                        ? theme.colors.therapeutic.calming[100]
                        : theme.colors.background.secondary,
                      borderColor: profileData.mentalHealthGoals.includes(goal)
                        ? theme.colors.therapeutic.calming[500]
                        : theme.colors.gray[300],
                    },
                  ]}
                  onPress={() => handleGoalToggle(goal)}
                >
                  <Text
                    style={[
                      styles.goalText,
                      {
                        color: profileData.mentalHealthGoals.includes(goal)
                          ? theme.colors.therapeutic.calming[700]
                          : theme.colors.text.primary,
                      },
                    ]}
                  >
                    {goal}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        );

      case "preferences":
        return (
          <View style={styles.stepContent}>
            <PreferenceSection
              title="Communication Style"
              description="How would you like AI to communicate with you?"
              options={[
                { value: "gentle", label: "Gentle and supportive" },
                { value: "balanced", label: "Balanced approach" },
                { value: "direct", label: "Direct and actionable" },
              ]}
              selected={profileData.preferences.communication}
              onSelect={(value) =>
                setProfileData((prev) => ({
                  ...prev,
                  preferences: { ...prev.preferences, communication: value },
                }))
              }
              theme={theme}
            />

            <PreferenceSection
              title="Session Length"
              description="Preferred length for therapy sessions"
              options={[
                { value: "short", label: "10-15 minutes" },
                { value: "medium", label: "20-30 minutes" },
                { value: "long", label: "45+ minutes" },
              ]}
              selected={profileData.preferences.sessionLength}
              onSelect={(value) =>
                setProfileData((prev) => ({
                  ...prev,
                  preferences: { ...prev.preferences, sessionLength: value },
                }))
              }
              theme={theme}
            />

            <PreferenceSection
              title="Reminder Frequency"
              description="How often would you like check-in reminders?"
              options={[
                { value: "none", label: "No reminders" },
                { value: "weekly", label: "Weekly" },
                { value: "daily", label: "Daily" },
              ]}
              selected={profileData.preferences.reminderFrequency}
              onSelect={(value) =>
                setProfileData((prev) => ({
                  ...prev,
                  preferences: {
                    ...prev.preferences,
                    reminderFrequency: value,
                  },
                }))
              }
              theme={theme}
            />
          </View>
        );

      case "interests":
        return (
          <View style={styles.stepContent}>
            <Text
              style={[
                styles.stepDescription,
                { color: theme.colors.text.secondary },
              ]}
            >
              What activities help you feel better? (Select all that apply):
            </Text>
            <View style={styles.interestsContainer}>
              {interests.map((interest, index) => (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.interestItem,
                    {
                      backgroundColor: profileData.interests.includes(interest)
                        ? theme.colors.therapeutic.nurturing[100]
                        : theme.colors.background.secondary,
                      borderColor: profileData.interests.includes(interest)
                        ? theme.colors.therapeutic.nurturing[500]
                        : theme.colors.gray[300],
                    },
                  ]}
                  onPress={() => handleInterestToggle(interest)}
                >
                  <Text
                    style={[
                      styles.interestText,
                      {
                        color: profileData.interests.includes(interest)
                          ? theme.colors.therapeutic.nurturing[700]
                          : theme.colors.text.primary,
                      },
                    ]}
                  >
                    {interest}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        );

      default:
        return null;
    }
  };

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
            Profile Setup
          </Text>

          <View style={styles.placeholder} />
        </View>

        {/* Progress Bar */}
        <View style={styles.progressContainer}>
          <View
            style={[
              styles.progressBar,
              { backgroundColor: theme.colors.gray[200] },
            ]}
          >
            <View
              style={[
                styles.progressFill,
                {
                  width: `${progress}%`,
                  backgroundColor: theme.colors.therapeutic.calming[500],
                },
              ]}
            />
          </View>
          <Text
            style={[
              styles.progressText,
              { color: theme.colors.text.secondary },
            ]}
          >
            Step {currentStep + 1} of {setupSteps.length}
          </Text>
        </View>

        {/* Content */}
        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          <Animated.View
            style={[
              styles.stepContainer,
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }],
              },
            ]}
          >
            {/* Step Header */}
            <View style={styles.stepHeader}>
              <View
                style={[
                  styles.iconContainer,
                  { backgroundColor: theme.colors.therapeutic.calming[500] },
                ]}
              >
                <MentalHealthIcon
                  name={currentStepData.icon}
                  size={28}
                  color={theme.colors.text.inverse}
                  variant="filled"
                />
              </View>
              <Text
                style={[styles.stepTitle, { color: theme.colors.text.primary }]}
              >
                {currentStepData.title}
              </Text>
              <Text
                style={[
                  styles.stepSubtitle,
                  { color: theme.colors.text.secondary },
                ]}
              >
                {currentStepData.description}
              </Text>
            </View>

            {renderStepContent()}
          </Animated.View>
        </ScrollView>

        {/* Navigation Buttons */}
        <View style={styles.navigationContainer}>
          {currentStep > 0 && (
            <TouchableOpacity
              style={[
                styles.navButton,
                styles.previousButton,
                { borderColor: theme.colors.gray[300] },
              ]}
              onPress={handlePrevious}
            >
              <Text
                style={[
                  styles.navButtonText,
                  { color: theme.colors.text.primary },
                ]}
              >
                Previous
              </Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity
            style={[
              styles.navButton,
              styles.nextButton,
              {
                backgroundColor: isStepComplete()
                  ? theme.colors.therapeutic.calming[500]
                  : theme.colors.gray[300],
              },
            ]}
            onPress={handleNext}
            disabled={!isStepComplete()}
          >
            <Text
              style={[
                styles.navButtonText,
                { color: theme.colors.text.inverse },
              ]}
            >
              {currentStep === setupSteps.length - 1
                ? "Complete Setup"
                : "Continue"}
            </Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>
    </SafeAreaView>
  );
};

const PreferenceSection = ({
  title,
  description,
  options,
  selected,
  onSelect,
  theme,
}) => (
  <View style={styles.preferenceSection}>
    <Text
      style={[styles.preferenceTitle, { color: theme.colors.text.primary }]}
    >
      {title}
    </Text>
    <Text
      style={[
        styles.preferenceDescription,
        { color: theme.colors.text.secondary },
      ]}
    >
      {description}
    </Text>
    <View style={styles.preferenceOptions}>
      {options.map((option) => (
        <TouchableOpacity
          key={option.value}
          style={[
            styles.preferenceOption,
            {
              backgroundColor:
                selected === option.value
                  ? theme.colors.therapeutic.calming[100]
                  : theme.colors.background.secondary,
              borderColor:
                selected === option.value
                  ? theme.colors.therapeutic.calming[500]
                  : theme.colors.gray[300],
            },
          ]}
          onPress={() => onSelect(option.value)}
        >
          <Text
            style={[
              styles.preferenceOptionText,
              {
                color:
                  selected === option.value
                    ? theme.colors.therapeutic.calming[700]
                    : theme.colors.text.primary,
              },
            ]}
          >
            {option.label}
          </Text>
        </TouchableOpacity>
      ))}
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
  placeholder: {
    width: 44,
  },
  progressContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  progressBar: {
    height: 4,
    borderRadius: 2,
    marginBottom: 8,
  },
  progressFill: {
    height: "100%",
    borderRadius: 2,
  },
  progressText: {
    fontSize: 12,
    textAlign: "center",
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  stepContainer: {
    marginBottom: 20,
  },
  stepHeader: {
    alignItems: "center",
    marginBottom: 32,
  },
  iconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  stepTitle: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 8,
  },
  stepSubtitle: {
    fontSize: 16,
    textAlign: "center",
    lineHeight: 22,
  },
  stepContent: {
    marginBottom: 20,
  },
  stepDescription: {
    fontSize: 14,
    textAlign: "center",
    marginBottom: 20,
    lineHeight: 20,
  },
  avatarContainer: {
    alignItems: "center",
    marginBottom: 8,
    position: "relative",
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  avatarPlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
  },
  avatarBadge: {
    position: "absolute",
    bottom: 0,
    right: 10,
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  avatarLabel: {
    fontSize: 12,
    textAlign: "center",
    marginBottom: 24,
  },
  inputContainer: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 8,
  },
  textInput: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
  },
  textArea: {
    height: 80,
  },
  goalsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  goalItem: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 20,
    borderWidth: 1,
  },
  goalText: {
    fontSize: 14,
    fontWeight: "500",
  },
  preferenceSection: {
    marginBottom: 24,
  },
  preferenceTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 4,
  },
  preferenceDescription: {
    fontSize: 12,
    marginBottom: 12,
  },
  preferenceOptions: {
    gap: 8,
  },
  preferenceOption: {
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
  },
  preferenceOptionText: {
    fontSize: 14,
    fontWeight: "500",
    textAlign: "center",
  },
  interestsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  interestItem: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 20,
    borderWidth: 1,
  },
  interestText: {
    fontSize: 14,
    fontWeight: "500",
  },
  navigationContainer: {
    flexDirection: "row",
    paddingHorizontal: 20,
    paddingVertical: 16,
    gap: 12,
  },
  navButton: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  previousButton: {
    borderWidth: 1,
  },
  nextButton: {
    // backgroundColor set dynamically
  },
  navButtonText: {
    fontSize: 16,
    fontWeight: "600",
  },
});

export default ProfileSetupScreen;
