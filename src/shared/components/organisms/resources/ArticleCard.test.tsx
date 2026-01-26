import React from "react";
import { render } from "@testing-library/react-native";
import { ArticleCard } from "./ArticleCard";

describe("ArticleCard", () => {
  const defaultProps = {
    id: "1",
    title: "Test Article",
    category: "Mental Health",
    categoryColor: "#9AAD5C",
    imageUrl: "https://example.com/image.jpg",
    testID: "article-card",
  };

  it("renders the component", () => {
    const { getByTestId } = render(<ArticleCard {...defaultProps} />);
    expect(getByTestId("article-card")).toBeTruthy();
  });

  it("displays the title", () => {
    const { getByText } = render(<ArticleCard {...defaultProps} />);
    expect(getByText("Test Article")).toBeTruthy();
  });

  it("displays the category badge", () => {
    const { getByText } = render(<ArticleCard {...defaultProps} />);
    expect(getByText("Mental Health")).toBeTruthy();
  });
});
