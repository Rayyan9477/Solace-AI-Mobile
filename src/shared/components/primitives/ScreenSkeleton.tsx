/**
 * ScreenSkeleton — full-viewport loading placeholder.
 *
 * @description Sprint 14 audit fix: every stack adapter previously rendered
 *   `<SkeletonShimmer width="100%" height={400} />` while `isReady === false`,
 *   leaving white space below the 400px shimmer on web. This wrapper fills the
 *   available viewport with the cosmic page background and centers the
 *   shimmer inside, so the page reads as "the cosmic app is loading", not
 *   "the cosmic app's hero is loading over a stark white page".
 *
 *   Use as the universal skeleton fallback from any stack adapter that gates
 *   on `useRepositories().isReady`.
 */

import React from "react";
import { StyleSheet, View } from "react-native";

import { palette } from "../../theme";
import { SkeletonShimmer } from "./SkeletonShimmer";

export interface ScreenSkeletonProps {
  /** Stable testID for adapter-level assertions. */
  readonly testID?: string;
  /** Optional fixed height of the inner shimmer (defaults to a tall hero). */
  readonly shimmerHeight?: number;
}

export function ScreenSkeleton({
  testID,
  shimmerHeight = 400,
}: ScreenSkeletonProps): React.ReactElement {
  return (
    <View testID={testID} style={styles.container}>
      <SkeletonShimmer
        testID={testID ? `${testID}-shimmer` : undefined}
        width="100%"
        height={shimmerHeight}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: palette.midnight[950],
    flex: 1,
  },
});
