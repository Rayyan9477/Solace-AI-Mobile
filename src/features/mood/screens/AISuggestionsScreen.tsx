/**
 * AISuggestionsScreen Component
 * @description Step-by-step AI mood improvement suggestions with expandable cards
 * @task Task 3.8.6: AI Suggestions Screen (Screen 76)
 */

import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from "react-native";

interface Activity {
  id: string;
  label: string;
  selected: boolean;
}

interface SuggestionStep {
  id: string;
  stepNumber: number;
  title: string;
  description: string;
  expanded: boolean;
  activities: Activity[];
}

interface AISuggestionsScreenProps {
  activeTab: "history" | "suggestions";
  steps: SuggestionStep[];
  onBack: () => void;
  onTabChange: (tab: "history" | "suggestions") => void;
  onStepToggle: (stepId: string) => void;
  onActivitySelect: (stepId: string, activityId: string) => void;
  onMarkResolved: () => void;
}

export function AISuggestionsScreen({
  activeTab,
  steps,
  onBack,
  onTabChange,
  onStepToggle,
  onActivitySelect,
  onMarkResolved,
}: AISuggestionsScreenProps): React.ReactElement {
  return (
    <View testID="ai-suggestions-screen" style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          testID="back-button"
          style={styles.backButton}
          onPress={onBack}
          accessibilityRole="button"
          accessibilityLabel="Go back"
        >
          <Text style={styles.backButtonIcon}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Mood History</Text>
        <View style={styles.headerSpacer} />
      </View>

      {/* Segmented Control */}
      <View testID="segmented-control" style={styles.segmentedControl}>
        <TouchableOpacity
          testID="tab-history"
          style={[
            styles.segmentTab,
            activeTab === "history" && styles.segmentTabActive,
          ]}
          onPress={() => onTabChange("history")}
          accessibilityRole="button"
          accessibilityLabel="View history"
        >
          <Text
            style={[
              styles.segmentText,
              activeTab === "history" && styles.segmentTextActive,
            ]}
          >
            History
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          testID="tab-suggestions"
          style={[
            styles.segmentTab,
            activeTab === "suggestions" && styles.segmentTabActive,
          ]}
          onPress={() => onTabChange("suggestions")}
          accessibilityRole="button"
          accessibilityLabel="View AI suggestions"
        >
          <Text
            style={[
              styles.segmentText,
              activeTab === "suggestions" && styles.segmentTextActive,
            ]}
          >
            AI Suggestions
          </Text>
        </TouchableOpacity>
      </View>

      {/* Step Cards */}
      <ScrollView
        style={styles.stepsContainer}
        showsVerticalScrollIndicator={false}
      >
        {steps.map((step) => (
          <View
            key={step.id}
            testID={`step-card-${step.id}`}
            style={styles.stepCard}
          >
            {/* Step Header */}
            <TouchableOpacity
              testID={`step-header-${step.id}`}
              style={styles.stepHeader}
              onPress={() => onStepToggle(step.id)}
              accessibilityRole="button"
              accessibilityLabel={`${step.expanded ? "Collapse" : "Expand"} ${step.title}`}
            >
              <View style={styles.stepBadge}>
                <Text style={styles.stepBadgeText}>
                  Step {step.stepNumber}
                </Text>
              </View>
              <Text style={styles.stepTitle}>{step.title}</Text>
              <Text style={styles.expandIcon}>
                {step.expanded ? "▲" : "▼"}
              </Text>
            </TouchableOpacity>

            {/* Expanded Content */}
            {step.expanded && (
              <View style={styles.stepContent}>
                <Text style={styles.stepDescription}>{step.description}</Text>

                {/* Activity Chips */}
                {step.activities.length > 0 && (
                  <View style={styles.activitiesContainer}>
                    {step.activities.map((activity) => (
                      <TouchableOpacity
                        key={activity.id}
                        testID={`activity-chip-${activity.id}`}
                        style={[
                          styles.activityChip,
                          activity.selected && styles.activityChipSelected,
                        ]}
                        onPress={() =>
                          onActivitySelect(step.id, activity.id)
                        }
                        accessibilityRole="button"
                        accessibilityLabel={`${activity.selected ? "Deselect" : "Select"} ${activity.label}`}
                      >
                        {activity.selected && (
                          <Text style={styles.checkmark}>✓</Text>
                        )}
                        <Text
                          style={[
                            styles.activityLabel,
                            activity.selected &&
                              styles.activityLabelSelected,
                          ]}
                        >
                          {activity.label}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                )}
              </View>
            )}
          </View>
        ))}

        {/* Mark As Resolved Button */}
        <TouchableOpacity
          testID="mark-resolved-button"
          style={styles.resolvedButton}
          onPress={onMarkResolved}
          accessibilityRole="button"
          accessibilityLabel="Mark suggestion as resolved"
        >
          <Text style={styles.resolvedButtonText}>Mark As Resolved</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  activitiesContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 12,
  },
  activityChip: {
    backgroundColor: "#2A1F19",
    borderColor: "#3D2E23",
    borderRadius: 20,
    borderWidth: 1,
    flexDirection: "row",
    marginBottom: 8,
    marginRight: 8,
    minHeight: 44,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  activityChipSelected: {
    backgroundColor: "#9AAD5C",
    borderColor: "#9AAD5C",
  },
  activityLabel: {
    color: "#94A3B8",
    fontSize: 14,
  },
  activityLabelSelected: {
    color: "#FFFFFF",
    fontWeight: "600",
  },
  backButton: {
    alignItems: "center",
    borderColor: "#3D2E23",
    borderRadius: 20,
    borderWidth: 1,
    height: 40,
    justifyContent: "center",
    minHeight: 44,
    minWidth: 44,
    width: 40,
  },
  backButtonIcon: {
    color: "#FFFFFF",
    fontSize: 20,
    fontWeight: "600",
  },
  checkmark: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "700",
    marginRight: 6,
  },
  container: {
    backgroundColor: "#1C1410",
    flex: 1,
    paddingTop: 60,
  },
  expandIcon: {
    color: "#94A3B8",
    fontSize: 12,
  },
  header: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    paddingBottom: 16,
    paddingHorizontal: 24,
  },
  headerSpacer: {
    width: 40,
  },
  headerTitle: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "700",
  },
  resolvedButton: {
    alignItems: "center",
    backgroundColor: "#E8853A",
    borderRadius: 12,
    marginBottom: 40,
    marginHorizontal: 24,
    marginTop: 24,
    minHeight: 44,
    paddingVertical: 14,
  },
  resolvedButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
  },
  segmentTab: {
    alignItems: "center",
    backgroundColor: "#2A1F19",
    borderRadius: 20,
    flex: 1,
    minHeight: 44,
    paddingVertical: 10,
  },
  segmentTabActive: {
    backgroundColor: "#E8853A",
  },
  segmentText: {
    color: "#94A3B8",
    fontSize: 14,
    fontWeight: "600",
  },
  segmentTextActive: {
    color: "#FFFFFF",
  },
  segmentedControl: {
    backgroundColor: "#2A1F19",
    borderRadius: 24,
    flexDirection: "row",
    marginHorizontal: 24,
    padding: 4,
  },
  stepBadge: {
    backgroundColor: "#E8853A",
    borderRadius: 12,
    marginRight: 12,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  stepBadgeText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "700",
  },
  stepCard: {
    backgroundColor: "#2A1F19",
    borderRadius: 16,
    marginBottom: 12,
    marginHorizontal: 24,
    overflow: "hidden",
  },
  stepContent: {
    paddingBottom: 16,
    paddingHorizontal: 16,
  },
  stepDescription: {
    color: "#94A3B8",
    fontSize: 14,
    lineHeight: 22,
  },
  stepHeader: {
    alignItems: "center",
    flexDirection: "row",
    minHeight: 44,
    padding: 16,
  },
  stepTitle: {
    color: "#FFFFFF",
    flex: 1,
    fontSize: 16,
    fontWeight: "600",
  },
  stepsContainer: {
    flex: 1,
    paddingTop: 16,
  },
});

export default AISuggestionsScreen;
