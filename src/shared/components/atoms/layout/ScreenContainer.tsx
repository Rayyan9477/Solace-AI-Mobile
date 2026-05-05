/**
 * ScreenContainer Component
 * @description Safe area wrapper for screen content with dynamic inset padding
 * @task Task 6.3: Create ScreenContainer with SafeAreaView
 */

import React from "react";
import { View, StyleSheet, type StyleProp, type ViewStyle } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { palette } from "../../../theme";

interface ScreenContainerProps {
  children: React.ReactNode;
  /** Accepts a single style or array (Sprint 6 retro carry-forward). */
  style?: StyleProp<ViewStyle>;
  backgroundColor?: string;
  testID?: string;
}

export const ScreenContainer: React.FC<ScreenContainerProps> = ({
  children,
  style,
  backgroundColor = palette.midnight[950],
  testID,
}) => {
  const insets = useSafeAreaInsets();

  return (
    <View
      testID={testID}
      style={[
        styles.container,
        {
          backgroundColor,
          paddingTop: insets.top,
          paddingBottom: insets.bottom,
        },
        style,
      ]}
    >
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
