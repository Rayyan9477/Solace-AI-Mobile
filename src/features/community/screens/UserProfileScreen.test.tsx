/**
 * UserProfileScreen Tests
 * @task Task 3.14.8: User Profile Screen (Screen 126)
 */

import { render, fireEvent } from "@testing-library/react-native";
import React from "react";

import { UserProfileScreen } from "./UserProfileScreen";

const defaultProps = {
  username: "Sarah K.",
  postCount: "25 Total Posts",
  followingCount: "819 Following",
  followerCount: "71K Followers",
  location: "New York, USA",
  bio: "I'm a health enthusiast based in New York. DM me if you want to connect.",
  tabs: [
    { id: "video", label: "Video" },
    { id: "audio", label: "Audio" },
    { id: "bookmarks", label: "Bookmarks" },
  ],
  selectedTabId: "video",
  isFollowing: false,
  onBack: jest.fn(),
  onFollow: jest.fn(),
  onMessage: jest.fn(),
  onTabSelect: jest.fn(),
};

describe("UserProfileScreen", () => {
  beforeEach(() => jest.clearAllMocks());

  it("renders the screen container", () => {
    const { getByTestId } = render(<UserProfileScreen {...defaultProps} />);
    expect(getByTestId("user-profile-screen")).toBeTruthy();
  });

  it("renders as a full-screen flex container", () => {
    const { getByTestId } = render(<UserProfileScreen {...defaultProps} />);
    const flat = Object.assign(
      {},
      ...[].concat(getByTestId("user-profile-screen").props.style),
    );
    expect(flat.flex).toBe(1);
  });

  it("renders the back button", () => {
    const { getByTestId } = render(<UserProfileScreen {...defaultProps} />);
    expect(getByTestId("back-button")).toBeTruthy();
  });

  it("calls onBack when back button is pressed", () => {
    const { getByTestId } = render(<UserProfileScreen {...defaultProps} />);
    fireEvent.press(getByTestId("back-button"));
    expect(defaultProps.onBack).toHaveBeenCalledTimes(1);
  });

  it("back button meets minimum touch target size", () => {
    const { getByTestId } = render(<UserProfileScreen {...defaultProps} />);
    const flat = Object.assign(
      {},
      ...[].concat(getByTestId("back-button").props.style),
    );
    expect(flat.minHeight).toBeGreaterThanOrEqual(44);
    expect(flat.minWidth).toBeGreaterThanOrEqual(44);
  });

  it("renders the profile avatar", () => {
    const { getByTestId } = render(<UserProfileScreen {...defaultProps} />);
    expect(getByTestId("profile-avatar")).toBeTruthy();
  });

  it("displays the username", () => {
    const { getByText } = render(<UserProfileScreen {...defaultProps} />);
    expect(getByText("Sarah K.")).toBeTruthy();
  });

  it("renders the Follow button", () => {
    const { getByTestId } = render(<UserProfileScreen {...defaultProps} />);
    expect(getByTestId("follow-button")).toBeTruthy();
  });

  it("calls onFollow when Follow is pressed", () => {
    const { getByTestId } = render(<UserProfileScreen {...defaultProps} />);
    fireEvent.press(getByTestId("follow-button"));
    expect(defaultProps.onFollow).toHaveBeenCalledTimes(1);
  });

  it("displays 'Following' when isFollowing is true", () => {
    const { getByText } = render(
      <UserProfileScreen {...defaultProps} isFollowing />,
    );
    expect(getByText("Following")).toBeTruthy();
  });

  it("renders the Message button", () => {
    const { getByTestId } = render(<UserProfileScreen {...defaultProps} />);
    expect(getByTestId("message-button")).toBeTruthy();
  });

  it("calls onMessage when Message is pressed", () => {
    const { getByTestId } = render(<UserProfileScreen {...defaultProps} />);
    fireEvent.press(getByTestId("message-button"));
    expect(defaultProps.onMessage).toHaveBeenCalledTimes(1);
  });

  it("displays post count", () => {
    const { getByText } = render(<UserProfileScreen {...defaultProps} />);
    expect(getByText("25 Total Posts")).toBeTruthy();
  });

  it("displays following count", () => {
    const { getByText } = render(<UserProfileScreen {...defaultProps} />);
    expect(getByText("819 Following")).toBeTruthy();
  });

  it("displays follower count", () => {
    const { getByText } = render(<UserProfileScreen {...defaultProps} />);
    expect(getByText("71K Followers")).toBeTruthy();
  });

  it("displays the location", () => {
    const { getByText } = render(<UserProfileScreen {...defaultProps} />);
    expect(getByText(/New York, USA/)).toBeTruthy();
  });

  it("displays the bio", () => {
    const { getByText } = render(<UserProfileScreen {...defaultProps} />);
    expect(getByText(defaultProps.bio)).toBeTruthy();
  });

  it("renders content tabs", () => {
    const { getByTestId } = render(<UserProfileScreen {...defaultProps} />);
    expect(getByTestId("tab-video")).toBeTruthy();
    expect(getByTestId("tab-audio")).toBeTruthy();
    expect(getByTestId("tab-bookmarks")).toBeTruthy();
  });

  it("calls onTabSelect when tab is pressed", () => {
    const { getByTestId } = render(<UserProfileScreen {...defaultProps} />);
    fireEvent.press(getByTestId("tab-audio"));
    expect(defaultProps.onTabSelect).toHaveBeenCalledWith("audio");
  });

  it("does not contain any Freud branding", () => {
    const { queryByText } = render(<UserProfileScreen {...defaultProps} />);
    expect(queryByText(/freud/i)).toBeNull();
  });

  it("does not contain anime character names", () => {
    const { queryByText } = render(<UserProfileScreen {...defaultProps} />);
    expect(queryByText(/shinomiya/i)).toBeNull();
    expect(queryByText(/kaguya/i)).toBeNull();
  });
});
