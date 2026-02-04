/**
 * StartSleepingScreen Component
 * @description Sleep initiation screen with concentric circles, play button, and schedule option
 * @task Task 3.10.4: Start Sleeping Screen (Screen 90)
 * @phase Phase 3C: Refactored to use theme tokens
 */

import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { palette } from "../../../shared/theme";

interface StartSleepingScreenProps {
  onStartSleep: () => void;
  onScheduleSleep: () => void;
}

export function StartSleepingScreen({
  onStartSleep,
  onScheduleSleep,
}: StartSleepingScreenProps): React.ReactElement {
  return (
    <View testID="start-sleeping-screen" style={styles.container}>
      {/* Concentric Circles + Play Button */}
      <View style={styles.centerArea}>
        <View testID="concentric-circles" style={styles.concentricCircles}>
          {/* Outer Ring */}
          <View testID="concentric-outer" style={styles.concentricOuter}>
            {/* Middle Ring */}
            <View testID="concentric-mid" style={styles.concentricMid}>
              {/* Inner Ring */}
              <View testID="concentric-inner" style={styles.concentricInner}>
                {/* Play Button */}
                <TouchableOpacity
                  testID="play-button"
                  style={styles.playButton}
                  onPress={onStartSleep}
                  accessibilityRole="button"
                  accessibilityLabel="Start sleeping"
                >
                  <Text testID="play-icon" style={styles.playIcon}>
                    {"\u25B6"}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>

        {/* Start Sleeping Label */}
        <Text testID="start-sleeping-label" style={styles.startSleepingLabel}>
          Start Sleeping
        </Text>
      </View>

      {/* Bottom: Schedule Sleep Button */}
      <View style={styles.footer}>
        <TouchableOpacity
          testID="schedule-sleep-button"
          style={styles.scheduleSleepButton}
          onPress={onScheduleSleep}
          accessibilityRole="button"
          accessibilityLabel="Schedule sleep"
        >
          <Text testID="schedule-bed-icon" style={styles.scheduleBedIcon}>
            {"\uD83D\uDECF\uFE0F"}
          </Text>
          <Text style={styles.scheduleText}>Or Schedule Sleep</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  centerArea: {
    alignItems: "center",
    flex: 1,
    justifyContent: "center",
  },
  concentricCircles: {
    alignItems: "center",
    justifyContent: "center",
  },
  concentricInner: {
    alignItems: "center",
    backgroundColor: palette.tan[600],
    borderRadius: 80,
    height: 160,
    justifyContent: "center",
    width: 160,
  },
  concentricMid: {
    alignItems: "center",
    backgroundColor: palette.brown[600],
    borderRadius: 120,
    height: 240,
    justifyContent: "center",
    width: 240,
  },
  concentricOuter: {
    alignItems: "center",
    backgroundColor: palette.brown[700],
    borderRadius: 160,
    height: 320,
    justifyContent: "center",
    width: 320,
  },
  container: {
    backgroundColor: palette.brown[900],
    flex: 1,
  },
  footer: {
    alignItems: "center",
    paddingBottom: 48,
    paddingHorizontal: 24,
  },
  playButton: {
    alignItems: "center",
    backgroundColor: palette.tan[600],
    borderRadius: 44,
    elevation: 4,
    height: 88,
    justifyContent: "center",
    minHeight: 44,
    minWidth: 44,
    shadowColor: palette.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    width: 88,
  },
  playIcon: {
    color: palette.white,
    fontSize: 32,
    marginLeft: 4,
  },
  scheduleBedIcon: {
    fontSize: 18,
    marginRight: 8,
  },
  scheduleSleepButton: {
    alignItems: "center",
    borderColor: `${palette.white}${palette.alpha[30]}`,
    borderRadius: 28,
    borderWidth: 1,
    flexDirection: "row",
    justifyContent: "center",
    minHeight: 44,
    paddingHorizontal: 24,
    paddingVertical: 14,
    width: "100%",
  },
  scheduleText: {
    color: palette.white,
    fontSize: 16,
    fontWeight: "600",
  },
  startSleepingLabel: {
    color: palette.white,
    fontSize: 28,
    fontWeight: "800",
    marginTop: 32,
    textAlign: "center",
  },
});

export default StartSleepingScreen;
