/**
 * Freud UI Showcase Component
 * Demonstrates the complete enhanced UI system integration
 * Shows all components working together with Freud UI Kit design
 */

import React, { useState } from "react";
import { View, ScrollView, StyleSheet, SafeAreaView } from "react-native";

import {
  FreudThemeProvider,
  EnhancedDashboard,
  EnhancedMoodTracker,
  EnhancedMoodCard,
  EnhancedDashboardCard,
  MoodCardGrid,
  DashboardCardGrid,
  PageShaderBackground,
  TimeBasedShaderBackground,
  MoodBasedShaderBackground,
  TherapeuticText,
  TherapeuticButton,
  FreudContainer,
  getTherapeuticThemeForMood,
  MentalHealthDashboard,
  MoodTrackingFlow,
  QuickMoodCheck,
} from "./index";
import { spacing, borderRadius } from "../../shared/theme/theme";

/**
 * Main Showcase Component
 */
export const FreudUIShowcase = () => {
  const [currentView, setCurrentView] = useState("dashboard");
  const [selectedMood, setSelectedMood] = useState(null);
  const [therapeuticTheme, setTherapeuticTheme] = useState("mindful");

  const handleMoodSelect = (mood) => {
    setSelectedMood(mood);
    setTherapeuticTheme(getTherapeuticThemeForMood(mood));
  };

  const handleNavigation = (view) => {
    setCurrentView(view);
  };

  const renderCurrentView = () => {
    switch (currentView) {
      case "dashboard":
        return (
          <DashboardShowcase
            onNavigate={handleNavigation}
            selectedMood={selectedMood}
            onMoodSelect={handleMoodSelect}
          />
        );
      case "moodTracker":
        return (
          <MoodTrackerShowcase
            onComplete={(data) => {
              console.log("Mood tracking completed:", data);
              setCurrentView("dashboard");
            }}
            onCancel={() => setCurrentView("dashboard")}
          />
        );
      case "quickMood":
        return (
          <QuickMoodShowcase
            selectedMood={selectedMood}
            onMoodSelect={handleMoodSelect}
            onBack={() => setCurrentView("dashboard")}
          />
        );
      case "components":
        return (
          <ComponentsShowcase
            therapeuticTheme={therapeuticTheme}
            onBack={() => setCurrentView("dashboard")}
          />
        );
      default:
        return <DashboardShowcase onNavigate={handleNavigation} />;
    }
  };

  return (
    <FreudThemeProvider
      initialTheme={{
        therapeutic: therapeuticTheme,
        animations: true,
        preferences: {
          cardStyle: "gradient",
          backgroundStyle: "shader",
          animationIntensity: "medium",
        },
      }}
      autoTimeAdjust
      autoMoodAdjust
    >
      <SafeAreaView style={styles.container}>
        {renderCurrentView()}
      </SafeAreaView>
    </FreudThemeProvider>
  );
};

/**
 * Dashboard Showcase
 */
const DashboardShowcase = ({ onNavigate, selectedMood, onMoodSelect }) => {
  const sampleUser = {
    name: "Alex",
    avatar: null,
  };

  const sampleMoodHistory = [
    { id: "1", mood: "happy", timestamp: new Date(Date.now() - 86400000) },
    { id: "2", mood: "calm", timestamp: new Date(Date.now() - 172800000) },
    { id: "3", mood: "stressed", timestamp: new Date(Date.now() - 259200000) },
  ];

  return (
    <EnhancedDashboard
      user={sampleUser}
      moodHistory={sampleMoodHistory}
      onNavigate={onNavigate}
      onMoodTrack={onMoodSelect}
      onEmergencyContact={() => console.log("Emergency contact pressed")}
      refreshing={false}
      onRefresh={() => console.log("Dashboard refreshed")}
    />
  );
};

/**
 * Mood Tracker Showcase
 */
const MoodTrackerShowcase = ({ onComplete, onCancel }) => {
  return (
    <EnhancedMoodTracker
      onComplete={onComplete}
      onCancel={onCancel}
      initialStep="mood"
      showProgress
      animated
      therapeutic
    />
  );
};

/**
 * Quick Mood Check Showcase
 */
const QuickMoodShowcase = ({ selectedMood, onMoodSelect, onBack }) => {
  return (
    <MoodBasedShaderBackground
      mood={selectedMood || "calm"}
      intensity={0.4}
      style={styles.quickMoodContainer}
    >
      <FreudContainer
        therapeutic="zen"
        variant="solid"
        style={styles.quickMoodContent}
      >
        <TherapeuticText
          variant="headline"
          weight="bold"
          align="center"
          style={styles.quickMoodTitle}
        >
          Quick Mood Check
        </TherapeuticText>

        <TherapeuticText
          variant="body"
          align="center"
          style={styles.quickMoodSubtitle}
        >
          How are you feeling right now?
        </TherapeuticText>

        <MoodCardGrid
          moods={[
            "happy",
            "sad",
            "calm",
            "stressed",
            "anxious",
            "neutral",
            "excited",
            "tired",
            "content",
          ]}
          selectedMood={selectedMood}
          onMoodSelect={onMoodSelect}
          columns={3}
          cardSize="small"
          variant="gradient"
          animated
          style={styles.moodGrid}
        />

        <TherapeuticButton
          therapeutic="kind"
          variant="outlined"
          onPress={onBack}
          style={styles.backButton}
        >
          Back to Dashboard
        </TherapeuticButton>
      </FreudContainer>
    </MoodBasedShaderBackground>
  );
};

/**
 * Components Showcase
 */
const ComponentsShowcase = ({ therapeuticTheme, onBack }) => {
  const [selectedCard, setSelectedCard] = useState(null);

  return (
    <PageShaderBackground
      shader="therapeutic"
      variant={therapeuticTheme}
      intensity={0.3}
      style={styles.componentsContainer}
    >
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <FreudContainer style={styles.showcaseContent}>
          {/* Header */}
          <TherapeuticText
            variant="headline"
            weight="bold"
            align="center"
            therapeutic={therapeuticTheme}
            style={styles.showcaseTitle}
          >
            Freud UI Components
          </TherapeuticText>

          {/* Mood Cards Section */}
          <View style={styles.section}>
            <TherapeuticText
              variant="title"
              weight="semiBold"
              therapeutic={therapeuticTheme}
              style={styles.sectionTitle}
            >
              Enhanced Mood Cards
            </TherapeuticText>
            <MoodCardGrid
              moods={["happy", "sad", "calm", "stressed"]}
              selectedMood={selectedCard}
              onMoodSelect={setSelectedCard}
              columns={2}
              cardSize="medium"
              variant="gradient"
              animated
            />
          </View>

          {/* Dashboard Cards Section */}
          <View style={styles.section}>
            <TherapeuticText
              variant="title"
              weight="semiBold"
              therapeutic={therapeuticTheme}
              style={styles.sectionTitle}
            >
              Enhanced Dashboard Cards
            </TherapeuticText>
            <DashboardCardGrid
              cards={["moodTracker", "journalEntry", "meditation", "insights"]}
              onCardPress={(cardType) => console.log(`Pressed: ${cardType}`)}
              columns={2}
              cardSize="medium"
              variant="gradient"
              animated
            />
          </View>

          {/* Therapeutic Buttons Section */}
          <View style={styles.section}>
            <TherapeuticText
              variant="title"
              weight="semiBold"
              therapeutic={therapeuticTheme}
              style={styles.sectionTitle}
            >
              Therapeutic Buttons
            </TherapeuticText>
            <View style={styles.buttonsRow}>
              <TherapeuticButton
                therapeutic="zen"
                variant="contained"
                size="medium"
                onPress={() => console.log("Zen button pressed")}
                style={styles.showcaseButton}
              >
                Zen
              </TherapeuticButton>
              <TherapeuticButton
                therapeutic="empathy"
                variant="outlined"
                size="medium"
                onPress={() => console.log("Empathy button pressed")}
                style={styles.showcaseButton}
              >
                Empathy
              </TherapeuticButton>
            </View>
            <View style={styles.buttonsRow}>
              <TherapeuticButton
                therapeutic="serenity"
                variant="text"
                size="medium"
                onPress={() => console.log("Serenity button pressed")}
                style={styles.showcaseButton}
              >
                Serenity
              </TherapeuticButton>
              <TherapeuticButton
                therapeutic="kind"
                variant="contained"
                size="medium"
                onPress={() => console.log("Kind button pressed")}
                style={styles.showcaseButton}
              >
                Kind
              </TherapeuticButton>
            </View>
          </View>

          {/* Back Button */}
          <TherapeuticButton
            therapeutic={therapeuticTheme}
            variant="outlined"
            size="large"
            onPress={onBack}
            style={styles.backButton}
          >
            Back to Dashboard
          </TherapeuticButton>
        </FreudContainer>
      </ScrollView>
    </PageShaderBackground>
  );
};

/**
 * Pre-configured Components Showcase
 */
export const PreConfiguredShowcase = () => {
  const [currentDemo, setCurrentDemo] = useState("dashboard");
  const [selectedMood, setSelectedMood] = useState(null);

  const renderDemo = () => {
    switch (currentDemo) {
      case "dashboard":
        return (
          <MentalHealthDashboard
            user={{ name: "Demo User" }}
            moodHistory={[]}
            onNavigate={(screen) => console.log(`Navigate to: ${screen}`)}
            onMoodTrack={(mood) => setSelectedMood(mood)}
            onEmergencyContact={() => console.log("Emergency contact")}
          />
        );
      case "moodTracking":
        return (
          <MoodTrackingFlow
            onComplete={(data) => {
              console.log("Mood tracking completed:", data);
              setCurrentDemo("dashboard");
            }}
            onCancel={() => setCurrentDemo("dashboard")}
          />
        );
      case "quickMood":
        return (
          <QuickMoodCheck
            selectedMood={selectedMood}
            onMoodSelect={(mood) => {
              setSelectedMood(mood);
              console.log("Mood selected:", mood);
            }}
          />
        );
      default:
        return null;
    }
  };

  return (
    <View style={styles.container}>
      {renderDemo()}

      {/* Demo Navigation */}
      <View style={styles.demoNavigation}>
        <TherapeuticButton
          therapeutic="zen"
          variant={currentDemo === "dashboard" ? "contained" : "outlined"}
          size="small"
          onPress={() => setCurrentDemo("dashboard")}
          style={styles.demoButton}
        >
          Dashboard
        </TherapeuticButton>
        <TherapeuticButton
          therapeutic="kind"
          variant={currentDemo === "moodTracking" ? "contained" : "outlined"}
          size="small"
          onPress={() => setCurrentDemo("moodTracking")}
          style={styles.demoButton}
        >
          Mood Tracker
        </TherapeuticButton>
        <TherapeuticButton
          therapeutic="empathy"
          variant={currentDemo === "quickMood" ? "contained" : "outlined"}
          size="small"
          onPress={() => setCurrentDemo("quickMood")}
          style={styles.demoButton}
        >
          Quick Mood
        </TherapeuticButton>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  quickMoodContainer: {
    flex: 1,
  },
  quickMoodContent: {
    flex: 1,
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[6],
    justifyContent: "center",
  },
  quickMoodTitle: {
    marginBottom: spacing[2],
  },
  quickMoodSubtitle: {
    marginBottom: spacing[6],
    opacity: 0.8,
  },
  moodGrid: {
    marginBottom: spacing[6],
  },
  backButton: {
    marginTop: spacing[4],
  },
  componentsContainer: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: spacing[8],
  },
  showcaseContent: {
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[6],
  },
  showcaseTitle: {
    marginBottom: spacing[8],
  },
  section: {
    marginBottom: spacing[8],
  },
  sectionTitle: {
    marginBottom: spacing[4],
  },
  buttonsRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: spacing[3],
  },
  showcaseButton: {
    minWidth: 120,
  },
  demoNavigation: {
    position: "absolute",
    bottom: spacing[4],
    left: spacing[4],
    right: spacing[4],
    flexDirection: "row",
    justifyContent: "space-around",
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    borderRadius: borderRadius.lg,
    padding: spacing[2],
    ...shadows.md,
  },
  demoButton: {
    flex: 1,
    marginHorizontal: spacing[1],
  },
});

export default {
  FreudUIShowcase,
  PreConfiguredShowcase,
};
