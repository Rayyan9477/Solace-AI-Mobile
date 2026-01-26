import React from "react";
import { render } from "@testing-library/react-native";
import { PostCard } from "./PostCard";

describe("PostCard", () => {
  const defaultProps = {
    id: "1",
    author: { username: "TestUser", avatar: "https://example.com/avatar.jpg", badge: "Basic", isVerified: true },
    content: "Test post content",
    timestamp: new Date(Date.now() - 60000),
    viewCount: 1200,
    likeCount: 241,
    testID: "post-card",
  };

  it("renders the component", () => {
    const { getByTestId } = render(<PostCard {...defaultProps} />);
    expect(getByTestId("post-card")).toBeTruthy();
  });

  it("displays author username", () => {
    const { getByText } = render(<PostCard {...defaultProps} />);
    expect(getByText("TestUser")).toBeTruthy();
  });

  it("displays post content", () => {
    const { getByText } = render(<PostCard {...defaultProps} />);
    expect(getByText("Test post content")).toBeTruthy();
  });
});
