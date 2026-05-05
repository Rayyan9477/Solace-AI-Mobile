/**
 * SearchResultsScreen sidecar styles — split out so the screen body stays
 * under the S9 600 LoC cap.
 */

import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  clearButton: {
    alignItems: "center",
    borderRadius: 16,
    height: 32,
    justifyContent: "center",
    minHeight: 44,
    minWidth: 44,
    width: 32,
  },
  countLine: {
    marginBottom: 12,
    marginTop: 18,
  },
  filterRow: {
    marginBottom: 16,
  },
  iconButton: {
    alignItems: "center",
    borderRadius: 22,
    borderWidth: 1,
    height: 44,
    justifyContent: "center",
    width: 44,
  },
  list: {
    gap: 8,
  },
  scroll: {
    paddingBottom: 80,
    paddingHorizontal: 24,
    paddingTop: 16,
  },
  searchField: {
    alignItems: "center",
    borderRadius: 999,
    borderWidth: 1,
    flex: 1,
    flexDirection: "row",
    gap: 12,
    minHeight: 48,
    paddingHorizontal: 16,
  },
  searchInput: {
    flex: 1,
    fontSize: 13,
    paddingVertical: 0,
  },
  searchRow: {
    alignItems: "center",
    flexDirection: "row",
    gap: 12,
  },
  section: {
    marginBottom: 4,
    marginTop: 8,
  },
});

export const sectionStyles = StyleSheet.create({
  accentBar: {
    borderBottomRightRadius: 4,
    borderTopRightRadius: 4,
    bottom: 8,
    left: 0,
    opacity: 0.65,
    position: "absolute",
    top: 8,
    width: 3,
  },
  header: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  journalBody: {
    flex: 1,
    paddingLeft: 12,
  },
  journalDot: {
    fontFamily: "Inter_400Regular",
    fontSize: 9,
    opacity: 0.5,
  },
  journalHeader: {
    alignItems: "center",
    flexDirection: "row",
    gap: 6,
    marginBottom: 4,
  },
  journalInner: {
    flexDirection: "row",
    minHeight: 64,
    position: "relative",
  },
  journalMood: {
    fontSize: 9,
  },
  link: {
    alignItems: "center",
    height: 28,
    justifyContent: "center",
    minHeight: 28,
    paddingHorizontal: 4,
  },
  linkText: {
    fontSize: 10,
  },
  rowBody: {
    flex: 1,
    minWidth: 0,
  },
  rowCaption: {
    fontFamily: "Inter_400Regular",
    fontSize: 10,
    lineHeight: 14,
    marginTop: 2,
  },
  rowCard: {
    minHeight: 56,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  rowIcon: {
    flexShrink: 0,
    marginRight: 12,
  },
  rowInner: {
    alignItems: "center",
    flexDirection: "row",
  },
  rowTitle: {
    fontSize: 12,
    lineHeight: 16,
  },
  rowTouchable: {
    width: "100%",
  },
});
