/**
 * HomeDashboardScreen tests — prototype v4.2 #20 Home v2 (Sprint 6).
 * Covers ≥18 scenarios per spec.
 */

import React from "react";
import { render, fireEvent } from "@testing-library/react-native";

import {
  HomeDashboardScreen,
  DEFAULT_ARTICLES,
  computeGreeting,
  type HomeDashboardScreenProps,
} from "./HomeDashboardScreen";
import type { MoodLevel } from "@/shared/components/primitives";

// ---------------------------------------------------------------------------
// Fixtures
// ---------------------------------------------------------------------------

const onMoodChange = jest.fn();
const onArticlePress = jest.fn();
const onAllPracticesPress = jest.fn();
const onNotificationsPress = jest.fn();
const onContinuePress = jest.fn();

const baseProps: HomeDashboardScreenProps = {
  userName: "Rayyan",
  todayMood: null,
  onMoodChange,
  solaceScore: 72,
  solaceDelta: 5,
  streakDays: 23,
  continueCard: null,
  articles: DEFAULT_ARTICLES,
  onArticlePress,
  onAllPracticesPress,
  onNotificationsPress,
  testID: "home-dashboard-screen",
  dateLabel: "Tuesday · April 9",
  greeting: "Good morning",
};

beforeEach(() => {
  jest.clearAllMocks();
});

// ---------------------------------------------------------------------------
// 1. Render
// ---------------------------------------------------------------------------
it("1. renders the screen container", () => {
  const { getByTestId } = render(<HomeDashboardScreen {...baseProps} />);
  expect(getByTestId("home-dashboard-screen")).toBeTruthy();
});

// ---------------------------------------------------------------------------
// 2. Snapshot
// ---------------------------------------------------------------------------
it("2. matches snapshot", () => {
  const { toJSON } = render(<HomeDashboardScreen {...baseProps} />);
  expect(toJSON()).toMatchSnapshot();
});

// ---------------------------------------------------------------------------
// 3. Greeting + name displayed: "Good morning, Rayyan."
// ---------------------------------------------------------------------------
it("3. displays greeting and name", () => {
  const { getByTestId } = render(<HomeDashboardScreen {...baseProps} />);
  const greetingEl = getByTestId("greeting-text");
  // The text node tree contains both the greeting and the name
  const fullText = greetingEl.props.children?.toString?.() ?? "";
  expect(fullText).toContain("Good morning");
  // Name appears as a nested Text child
  const { getAllByText } = render(<HomeDashboardScreen {...baseProps} />);
  // "Rayyan." — the dot is in the child span
  expect(getAllByText(/Rayyan\./)).toBeTruthy();
});

// ---------------------------------------------------------------------------
// 4. Date bracket displayed
// ---------------------------------------------------------------------------
it("4. displays date bracket label", () => {
  const { getByText } = render(<HomeDashboardScreen {...baseProps} />);
  // BracketLabel uppercases: "[ TUESDAY · APRIL 9 ]"
  expect(getByText("[ TUESDAY · APRIL 9 ]")).toBeTruthy();
});

// ---------------------------------------------------------------------------
// 5. Notification button renders + calls onNotificationsPress when pressed
// ---------------------------------------------------------------------------
it("5. notification button renders and triggers callback", () => {
  const { getByTestId } = render(<HomeDashboardScreen {...baseProps} />);
  const btn = getByTestId("notifications-button");
  expect(btn).toBeTruthy();
  fireEvent.press(btn);
  expect(onNotificationsPress).toHaveBeenCalledTimes(1);
});

// ---------------------------------------------------------------------------
// 6. Check-in card renders all 5 MoodFace circles
// ---------------------------------------------------------------------------
it("6. check-in card renders all 5 mood faces", () => {
  const { getByTestId } = render(<HomeDashboardScreen {...baseProps} />);
  [1, 2, 3, 4, 5].forEach((level) => {
    expect(getByTestId(`mood-face-${level}`)).toBeTruthy();
  });
});

// ---------------------------------------------------------------------------
// 7. Tapping a MoodFace calls onMoodChange with the level
// ---------------------------------------------------------------------------
it("7. tapping mood face calls onMoodChange with correct level", () => {
  const { getByTestId } = render(<HomeDashboardScreen {...baseProps} />);
  fireEvent.press(getByTestId("mood-face-3"));
  expect(onMoodChange).toHaveBeenCalledWith(3 as MoodLevel);
});

// ---------------------------------------------------------------------------
// 8. Selected MoodFace shows accessibilityState.selected = true
// ---------------------------------------------------------------------------
it("8. selected mood face has accessibilityState.selected true", () => {
  const { getByTestId } = render(
    <HomeDashboardScreen {...baseProps} todayMood={4} />,
  );
  const selectedBtn = getByTestId("mood-face-4");
  expect(selectedBtn.props.accessibilityState?.selected).toBe(true);

  // Non-selected should not be selected
  const otherBtn = getByTestId("mood-face-2");
  expect(otherBtn.props.accessibilityState?.selected).toBe(false);
});

// ---------------------------------------------------------------------------
// 9. Solace score tile shows "72/100"
// ---------------------------------------------------------------------------
it("9. solace score tile shows score value", () => {
  const { getByTestId } = render(<HomeDashboardScreen {...baseProps} />);
  const scoreEl = getByTestId("solace-score-value");
  expect(scoreEl).toBeTruthy();
  // The Text tree includes "72" plus child "/100" — check via testID children text
  const scoreText = scoreEl.props.children;
  // children[0] is "72", children[1] is the /100 nested Text
  expect(String(scoreText[0])).toBe("72");
});

// ---------------------------------------------------------------------------
// 10. Score delta "+5" shown when solaceDelta=5
// ---------------------------------------------------------------------------
it("10. shows delta label when solaceDelta provided", () => {
  const { getByTestId } = render(
    <HomeDashboardScreen {...baseProps} solaceDelta={5} />,
  );
  const deltaEl = getByTestId("solace-delta");
  expect(deltaEl.props.children).toBe("+5 this week");
});

// ---------------------------------------------------------------------------
// 11. Streak tile shows "23d"
// ---------------------------------------------------------------------------
it("11. streak tile shows streak days", () => {
  const { getByTestId } = render(
    <HomeDashboardScreen {...baseProps} streakDays={23} />,
  );
  expect(getByTestId("streak-tile")).toBeTruthy();
  const streakEl = getByTestId("streak-value");
  // children[0] is "23", children[1] is nested "d" Text
  expect(String(streakEl.props.children[0])).toBe("23");
});

// ---------------------------------------------------------------------------
// 12. ContinueCard renders when continueCard prop provided
// ---------------------------------------------------------------------------
it("12. renders ContinueCard when continueCard is provided", () => {
  const { getByTestId } = render(
    <HomeDashboardScreen
      {...baseProps}
      continueCard={{
        title: "Let's talk about that meeting...",
        subtitle: "3 min ago · 12 messages",
        onPress: onContinuePress,
      }}
    />,
  );
  expect(getByTestId("continue-card")).toBeTruthy();
});

// ---------------------------------------------------------------------------
// 13. ContinueCard hidden when continueCard=null
// ---------------------------------------------------------------------------
it("13. does not render ContinueCard when continueCard is null", () => {
  const { queryByTestId } = render(
    <HomeDashboardScreen {...baseProps} continueCard={null} />,
  );
  expect(queryByTestId("continue-card")).toBeNull();
});

// ---------------------------------------------------------------------------
// 14. ContinueCard onPress called when pressed
// ---------------------------------------------------------------------------
it("14. ContinueCard onPress fires when pressed", () => {
  const { getByTestId } = render(
    <HomeDashboardScreen
      {...baseProps}
      continueCard={{
        title: "Meditation session",
        subtitle: "10 min ago",
        onPress: onContinuePress,
      }}
    />,
  );
  // ContinueCard wraps its own TouchableOpacity
  const card = getByTestId("continue-card");
  // Find the inner pressable by traversing; use fireEvent on the container
  fireEvent.press(card);
  expect(onContinuePress).toHaveBeenCalledTimes(1);
});

// ---------------------------------------------------------------------------
// 15. 3 article cards render (DEFAULT_ARTICLES)
// ---------------------------------------------------------------------------
it("15. renders 3 article cards from DEFAULT_ARTICLES", () => {
  const { getByTestId } = render(<HomeDashboardScreen {...baseProps} />);
  DEFAULT_ARTICLES.forEach((article) => {
    expect(getByTestId(`article-card-${article.id}`)).toBeTruthy();
  });
});

// ---------------------------------------------------------------------------
// 16. Tapping an article card calls onArticlePress with its id
// ---------------------------------------------------------------------------
it("16. tapping article card calls onArticlePress with the article id", () => {
  const { getByTestId } = render(<HomeDashboardScreen {...baseProps} />);
  const firstId = DEFAULT_ARTICLES[0].id;
  fireEvent.press(getByTestId(`article-card-${firstId}`));
  expect(onArticlePress).toHaveBeenCalledWith(firstId);
});

// ---------------------------------------------------------------------------
// 17. "All practices" link calls onAllPracticesPress
// ---------------------------------------------------------------------------
it("17. all practices link calls onAllPracticesPress", () => {
  const { getByTestId } = render(<HomeDashboardScreen {...baseProps} />);
  fireEvent.press(getByTestId("all-practices-link"));
  expect(onAllPracticesPress).toHaveBeenCalledTimes(1);
});

// ---------------------------------------------------------------------------
// 18. Greeting changes by hour (via greeting prop override)
// ---------------------------------------------------------------------------
it("18. greeting prop overrides computed greeting", () => {
  const { getByText, rerender } = render(
    <HomeDashboardScreen {...baseProps} greeting="Good evening" />,
  );
  expect(getByText(/Good evening/)).toBeTruthy();

  rerender(<HomeDashboardScreen {...baseProps} greeting="Good afternoon" />);
  expect(getByText(/Good afternoon/)).toBeTruthy();
});

it("18b. computeGreeting returns correct value by hour", () => {
  const morning = new Date("2025-04-09T09:00:00");
  expect(computeGreeting(morning)).toBe("Good morning");

  const afternoon = new Date("2025-04-09T14:00:00");
  expect(computeGreeting(afternoon)).toBe("Good afternoon");

  const evening = new Date("2025-04-09T20:00:00");
  expect(computeGreeting(evening)).toBe("Good evening");
});

// ---------------------------------------------------------------------------
// 19. Custom articles prop replaces defaults
// ---------------------------------------------------------------------------
it("19. custom articles prop replaces DEFAULT_ARTICLES", () => {
  const customArticles = [
    {
      id: "custom-1",
      title: "Custom practice one",
      category: "CBT",
      readMinutes: 5,
      thumbnailGradient: "aurora" as const,
    },
    {
      id: "custom-2",
      title: "Custom practice two",
      category: "Breathing",
      readMinutes: 3,
      thumbnailGradient: "sage" as const,
    },
  ];

  const { getByTestId, queryByTestId } = render(
    <HomeDashboardScreen {...baseProps} articles={customArticles} />,
  );

  expect(getByTestId("article-card-custom-1")).toBeTruthy();
  expect(getByTestId("article-card-custom-2")).toBeTruthy();
  // Default articles should not be present
  expect(queryByTestId(`article-card-${DEFAULT_ARTICLES[0].id}`)).toBeNull();
});
