import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import { ArticleCardV2 } from "./ArticleCardV2";
import type { ArticleThumbnailGradient } from "./ArticleCardV2";

describe("ArticleCardV2", () => {
  const onPress = jest.fn();

  const defaultProps = {
    title: "The Science of Mindfulness",
    category: "MINDFULNESS",
    readMinutes: 5,
    onPress,
    testID: "article-card",
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders without crashing", () => {
    const { getByTestId } = render(<ArticleCardV2 {...defaultProps} />);
    expect(getByTestId("article-card")).toBeTruthy();
  });

  it("renders snapshot", () => {
    const tree = render(<ArticleCardV2 {...defaultProps} />).toJSON();
    expect(tree).toMatchSnapshot();
  });

  it("displays article title", () => {
    const { getByText } = render(<ArticleCardV2 {...defaultProps} />);
    expect(getByText("The Science of Mindfulness")).toBeTruthy();
  });

  it("displays bracket category chip", () => {
    const { getByText } = render(<ArticleCardV2 {...defaultProps} />);
    expect(getByText("[ MINDFULNESS ]")).toBeTruthy();
  });

  it("does not render category when not provided", () => {
    const { queryByText } = render(
      <ArticleCardV2
        title="Article"
        readMinutes={3}
        onPress={onPress}
      />
    );
    expect(queryByText(/MINDFULNESS/)).toBeNull();
  });

  it("displays read time", () => {
    const { getByText } = render(<ArticleCardV2 {...defaultProps} />);
    expect(getByText("5 min read")).toBeTruthy();
  });

  it("renders thumbnail", () => {
    const { getByTestId } = render(<ArticleCardV2 {...defaultProps} />);
    expect(getByTestId("article-card-thumbnail")).toBeTruthy();
  });

  it("renders meta row", () => {
    const { getByTestId } = render(<ArticleCardV2 {...defaultProps} />);
    expect(getByTestId("article-card-meta")).toBeTruthy();
  });

  it("calls onPress when tapped", () => {
    const { getByTestId } = render(<ArticleCardV2 {...defaultProps} />);
    fireEvent.press(getByTestId("article-card"));
    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it("has accessibilityRole link", () => {
    const { getByTestId } = render(<ArticleCardV2 {...defaultProps} />);
    expect(getByTestId("article-card").props.accessibilityRole).toBe("link");
  });

  it("has accessibilityLabel with title and read time", () => {
    const { getByTestId } = render(<ArticleCardV2 {...defaultProps} />);
    const el = getByTestId("article-card");
    expect(el.props.accessibilityLabel).toContain("The Science of Mindfulness");
    expect(el.props.accessibilityLabel).toContain("5 minute read");
  });

  it.each<ArticleThumbnailGradient>(["sage", "peach", "lavender", "aurora"])(
    "renders thumbnail gradient variant: %s",
    (variant) => {
      const { getByTestId } = render(
        <ArticleCardV2
          {...defaultProps}
          thumbnailGradient={variant}
          testID={`article-${variant}`}
        />
      );
      expect(getByTestId(`article-${variant}-thumbnail`)).toBeTruthy();
    }
  );

  it("applies custom style", () => {
    const { getByTestId } = render(
      <ArticleCardV2 {...defaultProps} style={{ opacity: 0.9 }} />
    );
    const el = getByTestId("article-card");
    const styleObj = Array.isArray(el.props.style)
      ? Object.assign({}, ...el.props.style.filter(Boolean))
      : el.props.style;
    expect(styleObj).toMatchObject({ opacity: 0.9 });
  });
});
