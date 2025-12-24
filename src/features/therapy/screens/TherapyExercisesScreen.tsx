/**
 * TherapyExercisesScreen - Available therapy exercises
 * Lists therapeutic exercises and techniques
 */

import {
  startExercise,
  completeExercise,
} from "@app/store/slices/therapySlice";
import { useNavigation } from "@react-navigation/native";
import { useTheme } from "@theme/ThemeProvider";
import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { useDispatch } from "react-redux";

interface Exercise {
  id: string;
  title: string;
  description: string;
  duration: string;
  category: string;
  difficulty: string;
  benefits: string[];
}

const EXERCISES: Exercise[] = [
  {
    id: "cognitive-reframe",
    title: "Cognitive Reframing",
    description: "Learn to identify and challenge negative thought patterns",
    duration: "10-15 min",
    category: "CBT",
    difficulty: "Beginner",
    benefits: ["Reduces anxiety", "Improves mood", "Builds resilience"],
  },
  {
    id: "mindful-breathing",
    title: "Mindful Breathing",
    description: "Practice deep breathing to calm your mind and body",
    duration: "5-10 min",
    category: "Mindfulness",
    difficulty: "Beginner",
    benefits: ["Reduces stress", "Improves focus", "Lowers heart rate"],
  },
  {
    id: "gratitude-journal",
    title: "Gratitude Journaling",
    description: "Write down things you're grateful for to shift perspective",
    duration: "10 min",
    category: "Positive Psychology",
    difficulty: "Beginner",
    benefits: ["Increases happiness", "Improves sleep", "Boosts self-esteem"],
  },
  {
    id: "progressive-relaxation",
    title: "Progressive Muscle Relaxation",
    description: "Systematically tense and relax muscle groups",
    duration: "15-20 min",
    category: "Relaxation",
    difficulty: "Intermediate",
    benefits: ["Reduces tension", "Improves sleep", "Manages pain"],
  },
  {
    id: "thought-diary",
    title: "Thought Diary",
    description: "Track and analyze your thoughts and emotions",
    duration: "15 min",
    category: "CBT",
    difficulty: "Intermediate",
    benefits: [
      "Increases self-awareness",
      "Identifies patterns",
      "Aids therapy",
    ],
  },
  {
    id: "values-clarification",
    title: "Values Clarification",
    description: "Explore and define your core personal values",
    duration: "20-30 min",
    category: "ACT",
    difficulty: "Advanced",
    benefits: ["Guides decisions", "Increases meaning", "Improves goals"],
  },
];

/**
 * TherapyExercisesScreen Component
 * Displays available therapy exercises
 */
const TherapyExercisesScreen = () => {
  const { theme } = useTheme();
  const dispatch = useDispatch();
  const navigation = useNavigation<any>();

  const [selectedCategory, setSelectedCategory] = useState<string>("All");

  const categories = [
    "All",
    "CBT",
    "Mindfulness",
    "Positive Psychology",
    "Relaxation",
    "ACT",
  ];

  const filteredExercises =
    selectedCategory === "All"
      ? EXERCISES
      : EXERCISES.filter((ex) => ex.category === selectedCategory);

  const handleStartExercise = (exercise: Exercise) => {
    dispatch(startExercise(exercise.id));
    navigation.navigate("ExerciseDetail", { exerciseId: exercise.id });
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Beginner":
        return theme.colors.green?.[60] || "#68B684";
      case "Intermediate":
        return theme.colors.orange?.[60] || "#E17B3A";
      case "Advanced":
        return theme.colors.purple?.[60] || "#7C6BA6";
      default:
        return theme.colors.gray?.[60] || "#718096";
    }
  };

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: theme.colors.background?.primary || "#F7FAFC" },
      ]}
    >
      {/* Header */}
      <View
        style={[
          styles.header,
          { backgroundColor: theme.colors.brown?.[70] || "#704A33" },
        ]}
      >
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
          accessible
          accessibilityLabel="Go back"
          accessibilityRole="button"
        >
          <Text
            style={[
              styles.backButtonText,
              { color: theme.colors.background?.primary || "#FFF" },
            ]}
          >
            ← Back
          </Text>
        </TouchableOpacity>
        <Text
          style={[
            styles.headerTitle,
            { color: theme.colors.background?.primary || "#FFF" },
          ]}
        >
          Therapy Exercises
        </Text>
        <View style={styles.headerSpacer} />
      </View>

      {/* Category Filter */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={[
          styles.categoryScrollView,
          { backgroundColor: theme.colors.background?.secondary || "#FFF" },
        ]}
        contentContainerStyle={styles.categoryContainer}
      >
        {categories.map((category) => (
          <TouchableOpacity
            key={category}
            style={[
              styles.categoryButton,
              { backgroundColor: theme.colors.brown?.[20] || "#F0EBE8" },
              selectedCategory === category && {
                backgroundColor: theme.colors.brown?.[70] || "#704A33",
              },
            ]}
            onPress={() => setSelectedCategory(category)}
            accessible
            accessibilityLabel={`Filter by ${category}`}
            accessibilityRole="button"
            accessibilityState={{ selected: selectedCategory === category }}
          >
            <Text
              style={[
                styles.categoryText,
                { color: theme.colors.text?.primary || "#2D3748" },
                selectedCategory === category && {
                  color: theme.colors.background?.primary || "#FFF",
                },
              ]}
            >
              {category}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Exercises List */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {filteredExercises.map((exercise) => (
          <View
            key={exercise.id}
            style={[
              styles.exerciseCard,
              {
                backgroundColor: theme.colors.background?.secondary || "#FFF",
                borderColor: theme.colors.border?.light || "#E2E8F0",
              },
            ]}
          >
            <View style={styles.exerciseHeader}>
              <Text
                style={[
                  styles.exerciseTitle,
                  { color: theme.colors.text?.primary || "#2D3748" },
                ]}
              >
                {exercise.title}
              </Text>
              <View
                style={[
                  styles.difficultyBadge,
                  {
                    backgroundColor:
                      getDifficultyColor(exercise.difficulty) + "20",
                  },
                ]}
              >
                <Text
                  style={[
                    styles.difficultyText,
                    { color: getDifficultyColor(exercise.difficulty) },
                  ]}
                >
                  {exercise.difficulty}
                </Text>
              </View>
            </View>

            <Text
              style={[
                styles.exerciseDescription,
                { color: theme.colors.text?.secondary || "#718096" },
              ]}
            >
              {exercise.description}
            </Text>

            <View style={styles.exerciseMeta}>
              <View
                style={[
                  styles.metaBadge,
                  { backgroundColor: theme.colors.brown?.[20] || "#F0EBE8" },
                ]}
              >
                <Text
                  style={[
                    styles.metaText,
                    { color: theme.colors.brown?.[80] || "#5C3D2E" },
                  ]}
                >
                  ⏱️ {exercise.duration}
                </Text>
              </View>
              <View
                style={[
                  styles.metaBadge,
                  { backgroundColor: theme.colors.brown?.[20] || "#F0EBE8" },
                ]}
              >
                <Text
                  style={[
                    styles.metaText,
                    { color: theme.colors.brown?.[80] || "#5C3D2E" },
                  ]}
                >
                  📚 {exercise.category}
                </Text>
              </View>
            </View>

            <View style={styles.benefitsContainer}>
              <Text
                style={[
                  styles.benefitsTitle,
                  { color: theme.colors.text?.primary || "#2D3748" },
                ]}
              >
                Benefits:
              </Text>
              {/* LOW-NEW-002 FIX: Use benefit text as stable key instead of index */}
              {exercise.benefits.map((benefit) => (
                <Text
                  key={`benefit-${exercise.id}-${benefit.substring(0, 20).replace(/\s/g, '-')}`}
                  style={[
                    styles.benefitText,
                    { color: theme.colors.text?.secondary || "#718096" },
                  ]}
                >
                  • {benefit}
                </Text>
              ))}
            </View>

            <TouchableOpacity
              style={[
                styles.startButton,
                { backgroundColor: theme.colors.brown?.[70] || "#704A33" },
              ]}
              onPress={() => handleStartExercise(exercise)}
              accessible
              accessibilityLabel={`Start ${exercise.title} exercise`}
              accessibilityRole="button"
            >
              <Text
                style={[
                  styles.startButtonText,
                  { color: theme.colors.background?.primary || "#FFF" },
                ]}
              >
                Start Exercise
              </Text>
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 16,
    paddingTop: 50,
  },
  backButton: {
    padding: 8,
  },
  backButtonText: {
    fontSize: 16,
    fontWeight: "600",
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "700",
  },
  headerSpacer: {
    width: 60,
  },
  categoryScrollView: {
    borderBottomWidth: 1,
  },
  categoryContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 8,
  },
  categoryButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 16,
  },
  categoryText: {
    fontSize: 14,
    fontWeight: "600",
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 16,
    gap: 16,
  },
  exerciseCard: {
    borderRadius: 12,
    borderWidth: 1,
    padding: 16,
  },
  exerciseHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 12,
  },
  exerciseTitle: {
    flex: 1,
    fontSize: 18,
    fontWeight: "700",
    marginRight: 12,
  },
  difficultyBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  difficultyText: {
    fontSize: 12,
    fontWeight: "600",
  },
  exerciseDescription: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 12,
  },
  exerciseMeta: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 12,
  },
  metaBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  metaText: {
    fontSize: 12,
    fontWeight: "600",
  },
  benefitsContainer: {
    marginBottom: 16,
  },
  benefitsTitle: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 8,
  },
  benefitText: {
    fontSize: 13,
    lineHeight: 20,
    marginLeft: 8,
  },
  startButton: {
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
  },
  startButtonText: {
    fontSize: 16,
    fontWeight: "600",
  },
});

// LOW-NEW-001 FIX: Add displayName for debugging
TherapyExercisesScreen.displayName = 'TherapyExercisesScreen';

export default TherapyExercisesScreen;
