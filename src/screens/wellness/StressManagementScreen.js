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
} from "react-native";

import { MentalHealthIcon, NavigationIcon } from "../../components/icons";
import { useTheme } from "../../contexts/ThemeContext";

const { width } = Dimensions.get("window");

const StressManagementScreen = ({ navigation }) => {
  const { theme } = useTheme();
  const [currentStressLevel, setCurrentStressLevel] = useState(5);
  const [selectedTechnique, setSelectedTechnique] = useState(null);
  const [isActive, setIsActive] = useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;

  const stressTechniques = [
    {
      id: "breathing",
      title: "4-7-8 Breathing",
      description:
        "Calm your nervous system with this powerful breathing technique",
      duration: "5 minutes",
      icon: "Mindfulness",
      difficulty: "Beginner",
      color: theme.colors.therapeutic.calming[500],
      instructions: [
        "Sit comfortably with your back straight",
        "Exhale completely through your mouth",
        "Inhale through your nose for 4 counts",
        "Hold your breath for 7 counts",
        "Exhale through your mouth for 8 counts",
        "Repeat 3-4 times",
      ],
    },
    {
      id: "progressive_muscle",
      title: "Progressive Muscle Relaxation",
      description: "Release tension by systematically relaxing muscle groups",
      duration: "10 minutes",
      icon: "Therapy",
      difficulty: "Intermediate",
      color: theme.colors.therapeutic.nurturing[500],
      instructions: [
        "Find a quiet, comfortable space",
        "Start with your feet and toes",
        "Tense muscles for 5 seconds",
        "Release and relax for 10 seconds",
        "Notice the contrast between tension and relaxation",
        "Move up through each muscle group",
      ],
    },
    {
      id: "mindfulness",
      title: "5-4-3-2-1 Grounding",
      description: "Use your senses to anchor yourself in the present moment",
      duration: "3 minutes",
      icon: "Brain",
      difficulty: "Beginner",
      color: theme.colors.therapeutic.peaceful[500],
      instructions: [
        "Notice 5 things you can see",
        "Notice 4 things you can touch",
        "Notice 3 things you can hear",
        "Notice 2 things you can smell",
        "Notice 1 thing you can taste",
        "Take deep breaths throughout",
      ],
    },
    {
      id: "visualization",
      title: "Safe Place Visualization",
      description: "Create a mental sanctuary to find peace and calm",
      duration: "8 minutes",
      icon: "Heart",
      difficulty: "Intermediate",
      color: theme.colors.therapeutic.grounding[500],
      instructions: [
        "Close your eyes and breathe deeply",
        "Imagine a place where you feel completely safe",
        "Notice the colors, sounds, and textures",
        "Feel the peace and security of this space",
        "Breathe in the calm energy",
        "Know you can return here anytime",
      ],
    },
  ];

  const stressLevels = [
    {
      level: 1,
      label: "Very Low",
      color: theme.colors.therapeutic.nurturing[300],
    },
    { level: 2, label: "Low", color: theme.colors.therapeutic.nurturing[400] },
    { level: 3, label: "Mild", color: theme.colors.therapeutic.calming[400] },
    {
      level: 4,
      label: "Moderate",
      color: theme.colors.therapeutic.calming[500],
    },
    { level: 5, label: "High", color: theme.colors.warning[400] },
    { level: 6, label: "Very High", color: theme.colors.warning[500] },
    { level: 7, label: "Severe", color: theme.colors.error[400] },
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

  const startTechnique = (technique) => {
    setSelectedTechnique(technique);
    setIsActive(true);
    navigation.navigate("StressTechniqueSession", { technique });
  };

  const getCurrentStressData = () => {
    return (
      stressLevels.find((s) => s.level === currentStressLevel) ||
      stressLevels[4]
    );
  };

  const getRecommendedTechniques = () => {
    if (currentStressLevel <= 2) {
      return stressTechniques.filter((t) => t.difficulty === "Beginner");
    } else if (currentStressLevel <= 4) {
      return stressTechniques;
    } else {
      return stressTechniques.filter((t) =>
        ["breathing", "mindfulness"].includes(t.id),
      );
    }
  };

  const currentStressData = getCurrentStressData();
  const recommendedTechniques = getRecommendedTechniques();

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
            Stress Management
          </Text>

          <TouchableOpacity
            style={styles.helpButton}
            onPress={() => {
              /* Open stress management guide */
            }}
          >
            <NavigationIcon
              name="Home"
              size={24}
              color={theme.colors.text.primary}
              variant="outline"
            />
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          <Animated.View
            style={[
              styles.animatedContainer,
              {
                opacity: fadeAnim,
                transform: [{ scale: scaleAnim }],
              },
            ]}
          >
            {/* Current Stress Level */}
            <View
              style={[
                styles.stressLevelCard,
                { backgroundColor: theme.colors.background.primary },
              ]}
            >
              <Text
                style={[styles.cardTitle, { color: theme.colors.text.primary }]}
              >
                How are you feeling right now?
              </Text>

              <View style={styles.stressLevelContainer}>
                <View style={styles.stressLevelRow}>
                  {stressLevels.map((stress) => (
                    <TouchableOpacity
                      key={stress.level}
                      style={[
                        styles.stressLevelButton,
                        {
                          backgroundColor:
                            currentStressLevel === stress.level
                              ? stress.color
                              : theme.colors.gray[200],
                        },
                      ]}
                      onPress={() => setCurrentStressLevel(stress.level)}
                    >
                      <Text
                        style={[
                          styles.stressLevelNumber,
                          {
                            color:
                              currentStressLevel === stress.level
                                ? theme.colors.text.inverse
                                : theme.colors.text.secondary,
                          },
                        ]}
                      >
                        {stress.level}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>

                <Text
                  style={[
                    styles.stressLevelLabel,
                    { color: currentStressData.color },
                  ]}
                >
                  {currentStressData.label} Stress
                </Text>
              </View>

              <Text
                style={[
                  styles.stressLevelDescription,
                  { color: theme.colors.text.secondary },
                ]}
              >
                {currentStressLevel <= 2
                  ? "You're feeling relatively calm. Great time for maintenance techniques!"
                  : currentStressLevel <= 4
                    ? "You're experiencing some stress. Let's work on bringing it down."
                    : "You're feeling quite stressed. Let's focus on immediate relief techniques."}
              </Text>
            </View>

            {/* Quick Relief Section */}
            <View
              style={[
                styles.section,
                { backgroundColor: theme.colors.background.primary },
              ]}
            >
              <Text
                style={[
                  styles.sectionTitle,
                  { color: theme.colors.text.primary },
                ]}
              >
                Quick Relief Techniques
              </Text>

              <View style={styles.quickTechniques}>
                {recommendedTechniques.slice(0, 2).map((technique, index) => (
                  <QuickTechniqueCard
                    key={technique.id}
                    technique={technique}
                    onPress={() => startTechnique(technique)}
                    theme={theme}
                    delay={index * 200}
                  />
                ))}
              </View>
            </View>

            {/* All Techniques */}
            <View
              style={[
                styles.section,
                { backgroundColor: theme.colors.background.primary },
              ]}
            >
              <Text
                style={[
                  styles.sectionTitle,
                  { color: theme.colors.text.primary },
                ]}
              >
                All Stress Management Techniques
              </Text>

              {stressTechniques.map((technique, index) => (
                <TechniqueCard
                  key={technique.id}
                  technique={technique}
                  onPress={() => startTechnique(technique)}
                  theme={theme}
                  delay={index * 100}
                />
              ))}
            </View>

            {/* Stress Insights */}
            <View
              style={[
                styles.section,
                { backgroundColor: theme.colors.background.primary },
              ]}
            >
              <Text
                style={[
                  styles.sectionTitle,
                  { color: theme.colors.text.primary },
                ]}
              >
                Understanding Your Stress
              </Text>

              <View
                style={[
                  styles.insightCard,
                  { backgroundColor: theme.colors.therapeutic.calming[50] },
                ]}
              >
                <MentalHealthIcon
                  name="Brain"
                  size={24}
                  color={theme.colors.therapeutic.calming[600]}
                  variant="filled"
                />
                <Text
                  style={[
                    styles.insightTitle,
                    { color: theme.colors.therapeutic.calming[700] },
                  ]}
                >
                  Stress is Normal
                </Text>
                <Text
                  style={[
                    styles.insightText,
                    { color: theme.colors.therapeutic.calming[600] },
                  ]}
                >
                  Stress is a natural response to challenges. The key is
                  learning healthy ways to manage it so it doesn't overwhelm
                  you.
                </Text>
              </View>

              <View
                style={[
                  styles.insightCard,
                  { backgroundColor: theme.colors.therapeutic.nurturing[50] },
                ]}
              >
                <MentalHealthIcon
                  name="Heart"
                  size={24}
                  color={theme.colors.therapeutic.nurturing[600]}
                  variant="filled"
                />
                <Text
                  style={[
                    styles.insightTitle,
                    { color: theme.colors.therapeutic.nurturing[700] },
                  ]}
                >
                  Practice Regularly
                </Text>
                <Text
                  style={[
                    styles.insightText,
                    { color: theme.colors.therapeutic.nurturing[600] },
                  ]}
                >
                  Regular practice of stress management techniques makes them
                  more effective when you really need them.
                </Text>
              </View>
            </View>
          </Animated.View>
        </ScrollView>
      </LinearGradient>
    </SafeAreaView>
  );
};

const QuickTechniqueCard = ({ technique, onPress, theme, delay }) => {
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
          styles.quickTechniqueCard,
          { backgroundColor: technique.color },
        ]}
        onPress={onPress}
        activeOpacity={0.8}
      >
        <MentalHealthIcon
          name={technique.icon}
          size={32}
          color={theme.colors.text.inverse}
          variant="filled"
        />
        <Text
          style={[
            styles.quickTechniqueTitle,
            { color: theme.colors.text.inverse },
          ]}
        >
          {technique.title}
        </Text>
        <Text
          style={[
            styles.quickTechniqueDuration,
            { color: theme.colors.text.inverse },
          ]}
        >
          {technique.duration}
        </Text>
      </TouchableOpacity>
    </Animated.View>
  );
};

const TechniqueCard = ({ technique, onPress, theme, delay }) => {
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
          styles.techniqueCard,
          { backgroundColor: theme.colors.background.secondary },
        ]}
        onPress={onPress}
        activeOpacity={0.8}
      >
        <View style={styles.techniqueCardHeader}>
          <View
            style={[styles.techniqueIcon, { backgroundColor: technique.color }]}
          >
            <MentalHealthIcon
              name={technique.icon}
              size={24}
              color={theme.colors.text.inverse}
              variant="filled"
            />
          </View>
          <View style={styles.techniqueInfo}>
            <Text
              style={[
                styles.techniqueTitle,
                { color: theme.colors.text.primary },
              ]}
            >
              {technique.title}
            </Text>
            <Text
              style={[
                styles.techniqueDescription,
                { color: theme.colors.text.secondary },
              ]}
            >
              {technique.description}
            </Text>
          </View>
        </View>

        <View style={styles.techniqueFooter}>
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
              {technique.difficulty}
            </Text>
          </View>
          <Text style={[styles.techniqueDuration, { color: technique.color }]}>
            {technique.duration}
          </Text>
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
  helpButton: {
    width: 44,
    height: 44,
    justifyContent: "center",
    alignItems: "center",
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  animatedContainer: {
    paddingBottom: 20,
  },
  stressLevelCard: {
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "600",
    textAlign: "center",
    marginBottom: 20,
  },
  stressLevelContainer: {
    alignItems: "center",
  },
  stressLevelRow: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 12,
  },
  stressLevelButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  stressLevelNumber: {
    fontSize: 16,
    fontWeight: "bold",
  },
  stressLevelLabel: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 8,
  },
  stressLevelDescription: {
    fontSize: 14,
    textAlign: "center",
    lineHeight: 20,
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
  quickTechniques: {
    flexDirection: "row",
    gap: 12,
  },
  quickTechniqueCard: {
    flex: 1,
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
    minHeight: 120,
    justifyContent: "center",
  },
  quickTechniqueTitle: {
    fontSize: 14,
    fontWeight: "600",
    textAlign: "center",
    marginTop: 8,
    marginBottom: 4,
  },
  quickTechniqueDuration: {
    fontSize: 12,
    opacity: 0.9,
  },
  techniqueCard: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  techniqueCardHeader: {
    flexDirection: "row",
    marginBottom: 12,
  },
  techniqueIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  techniqueInfo: {
    flex: 1,
  },
  techniqueTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 4,
  },
  techniqueDescription: {
    fontSize: 14,
    lineHeight: 20,
  },
  techniqueFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  difficultyBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  difficultyText: {
    fontSize: 12,
    fontWeight: "500",
  },
  techniqueDuration: {
    fontSize: 14,
    fontWeight: "600",
  },
  insightCard: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: "row",
    alignItems: "flex-start",
  },
  insightTitle: {
    fontSize: 14,
    fontWeight: "600",
    marginLeft: 12,
    marginBottom: 4,
    flex: 1,
  },
  insightText: {
    fontSize: 12,
    lineHeight: 16,
    marginLeft: 12,
    flex: 1,
  },
});

export default StressManagementScreen;
