/**
 * CommunityFeedScreen Tests
 * @task Task 3.14.2: Community Feed Screen (Screen 120)
 */

import { render, fireEvent } from "@testing-library/react-native";
import React from "react";

import { CommunityFeedScreen } from "./CommunityFeedScreen";

const defaultPosts = [
  {
    id: "p1",
    authorName: "Maya D. Smith",
    authorBadge: "Basic",
    timestamp: "1m ago",
    content: "Just finished a mindfulness session #mindfulness #selfcare",
    viewCount: "1.2M",
    likeCount: "241",
  },
  {
    id: "p2",
    authorName: "Alex Rivera",
    authorBadge: "Pro",
    timestamp: "5m ago",
    content: "This app has really helped me manage my stress levels.",
    viewCount: "700K",
    likeCount: "124",
  },
];

const defaultFilters = [
  { id: "trending", label: "Trending", emoji: "\uD83D\uDD25" },
  { id: "stress", label: "Stress" },
  { id: "support", label: "Support" },
  { id: "anxiety", label: "Anxiety" },
];

const defaultProps = {
  username: "Sarah K.",
  totalPosts: "25 Total Posts",
  rating: "87%",
  filters: defaultFilters,
  selectedFilterId: null as string | null,
  posts: defaultPosts,
  onBack: jest.fn(),
  onFilterSelect: jest.fn(),
  onPostPress: jest.fn(),
  onPostLike: jest.fn(),
  onPostShare: jest.fn(),
  onAddPost: jest.fn(),
  onProfilePress: jest.fn(),
};

describe("CommunityFeedScreen", () => {
  beforeEach(() => jest.clearAllMocks());

  // --- Container ---
  it("renders the screen container", () => {
    const { getByTestId } = render(<CommunityFeedScreen {...defaultProps} />);
    expect(getByTestId("community-feed-screen")).toBeTruthy();
  });

  it("renders as a full-screen flex container", () => {
    const { getByTestId } = render(<CommunityFeedScreen {...defaultProps} />);
    const flat = Object.assign(
      {},
      ...[].concat(getByTestId("community-feed-screen").props.style),
    );
    expect(flat.flex).toBe(1);
  });

  // --- Header / User Badge ---
  it("renders the back button", () => {
    const { getByTestId } = render(<CommunityFeedScreen {...defaultProps} />);
    expect(getByTestId("back-button")).toBeTruthy();
  });

  it("calls onBack when back button is pressed", () => {
    const { getByTestId } = render(<CommunityFeedScreen {...defaultProps} />);
    fireEvent.press(getByTestId("back-button"));
    expect(defaultProps.onBack).toHaveBeenCalledTimes(1);
  });

  it("back button has accessibilityRole button", () => {
    const { getByTestId } = render(<CommunityFeedScreen {...defaultProps} />);
    expect(getByTestId("back-button").props.accessibilityRole).toBe("button");
  });

  it("back button meets minimum touch target size", () => {
    const { getByTestId } = render(<CommunityFeedScreen {...defaultProps} />);
    const flat = Object.assign(
      {},
      ...[].concat(getByTestId("back-button").props.style),
    );
    expect(flat.minHeight).toBeGreaterThanOrEqual(44);
    expect(flat.minWidth).toBeGreaterThanOrEqual(44);
  });

  it("displays the username", () => {
    const { getByText } = render(<CommunityFeedScreen {...defaultProps} />);
    expect(getByText("Sarah K.")).toBeTruthy();
  });

  it("displays total posts", () => {
    const { getByText } = render(<CommunityFeedScreen {...defaultProps} />);
    expect(getByText("25 Total Posts")).toBeTruthy();
  });

  it("displays the rating", () => {
    const { getByText } = render(<CommunityFeedScreen {...defaultProps} />);
    expect(getByText(/87%/)).toBeTruthy();
  });

  // --- Browse By Filters ---
  it("displays 'Browse By' label", () => {
    const { getByText } = render(<CommunityFeedScreen {...defaultProps} />);
    expect(getByText("Browse By")).toBeTruthy();
  });

  it("renders all filter pills", () => {
    const { getByTestId } = render(<CommunityFeedScreen {...defaultProps} />);
    defaultFilters.forEach((f) => {
      expect(getByTestId(`filter-pill-${f.id}`)).toBeTruthy();
    });
  });

  it("calls onFilterSelect when filter pill is pressed", () => {
    const { getByTestId } = render(<CommunityFeedScreen {...defaultProps} />);
    fireEvent.press(getByTestId("filter-pill-stress"));
    expect(defaultProps.onFilterSelect).toHaveBeenCalledWith("stress");
  });

  // --- Post Cards ---
  it("renders all post cards", () => {
    const { getByTestId } = render(<CommunityFeedScreen {...defaultProps} />);
    defaultPosts.forEach((post) => {
      expect(getByTestId(`post-card-${post.id}`)).toBeTruthy();
    });
  });

  it("displays post author names", () => {
    const { getByText } = render(<CommunityFeedScreen {...defaultProps} />);
    expect(getByText("Maya D. Smith")).toBeTruthy();
    expect(getByText("Alex Rivera")).toBeTruthy();
  });

  it("displays post author badges", () => {
    const { getByText } = render(<CommunityFeedScreen {...defaultProps} />);
    expect(getByText("Basic")).toBeTruthy();
  });

  it("displays post timestamps", () => {
    const { getByText } = render(<CommunityFeedScreen {...defaultProps} />);
    expect(getByText("1m ago")).toBeTruthy();
  });

  it("displays post content", () => {
    const { getByText } = render(<CommunityFeedScreen {...defaultProps} />);
    expect(getByText(/mindfulness session/)).toBeTruthy();
  });

  it("displays post view counts", () => {
    const { getByText } = render(<CommunityFeedScreen {...defaultProps} />);
    expect(getByText(/1\.2M/)).toBeTruthy();
  });

  it("displays post like counts", () => {
    const { getByText } = render(<CommunityFeedScreen {...defaultProps} />);
    expect(getByText(/241/)).toBeTruthy();
  });

  it("calls onPostPress when post card is pressed", () => {
    const { getByTestId } = render(<CommunityFeedScreen {...defaultProps} />);
    fireEvent.press(getByTestId("post-card-p1"));
    expect(defaultProps.onPostPress).toHaveBeenCalledWith("p1");
  });

  // --- FAB ---
  it("renders the floating action button", () => {
    const { getByTestId } = render(<CommunityFeedScreen {...defaultProps} />);
    expect(getByTestId("add-post-fab")).toBeTruthy();
  });

  it("calls onAddPost when FAB is pressed", () => {
    const { getByTestId } = render(<CommunityFeedScreen {...defaultProps} />);
    fireEvent.press(getByTestId("add-post-fab"));
    expect(defaultProps.onAddPost).toHaveBeenCalledTimes(1);
  });

  it("FAB has accessibilityRole button", () => {
    const { getByTestId } = render(<CommunityFeedScreen {...defaultProps} />);
    expect(getByTestId("add-post-fab").props.accessibilityRole).toBe("button");
  });

  it("FAB meets minimum touch target size", () => {
    const { getByTestId } = render(<CommunityFeedScreen {...defaultProps} />);
    const flat = Object.assign(
      {},
      ...[].concat(getByTestId("add-post-fab").props.style),
    );
    expect(flat.minHeight).toBeGreaterThanOrEqual(44);
    expect(flat.minWidth).toBeGreaterThanOrEqual(44);
  });

  // --- Branding ---
  it("does not contain any Freud branding", () => {
    const { queryByText } = render(<CommunityFeedScreen {...defaultProps} />);
    expect(queryByText(/freud/i)).toBeNull();
  });

  it("does not contain inappropriate character names", () => {
    const { queryByText } = render(<CommunityFeedScreen {...defaultProps} />);
    expect(queryByText(/shinomiya/i)).toBeNull();
    expect(queryByText(/makima/i)).toBeNull();
    expect(queryByText(/kaguya/i)).toBeNull();
  });
});
