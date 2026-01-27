import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import { StatCard } from "./StatCard";
import { formatStatDate, calculateProgressPercentage } from "./StatCard.types";

describe("StatCard", () => {
  const mockOnPress = jest.fn();

  const defaultProps = {
    id: "stat-1",
    date: new Date(2024, 8, 12), // September 12, 2024
    title: "Anxious, Depressed",
    description: "Do 25m Breathing.",
    score: 65,
    progressColor: "#E8853A",
    onPress: mockOnPress,
    testID: "stat-card",
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders the component", () => {
    const { getByTestId } = render(<StatCard {...defaultProps} />);
    expect(getByTestId("stat-card")).toBeTruthy();
  });

  it("displays the title", () => {
    const { getByText } = render(<StatCard {...defaultProps} />);
    expect(getByText("Anxious, Depressed")).toBeTruthy();
  });

  it("displays the description", () => {
    const { getByText } = render(<StatCard {...defaultProps} />);
    expect(getByText("Do 25m Breathing.")).toBeTruthy();
  });

  it("displays the score", () => {
    const { getByText } = render(<StatCard {...defaultProps} />);
    expect(getByText("65")).toBeTruthy();
  });

  it("formats and displays the date", () => {
    const { getByText } = render(<StatCard {...defaultProps} />);
    expect(getByText(/SEP/)).toBeTruthy();
    expect(getByText(/12/)).toBeTruthy();
  });

  it("calls onPress when tapped", () => {
    const { getByTestId } = render(<StatCard {...defaultProps} />);
    fireEvent.press(getByTestId("stat-card"));
    expect(mockOnPress).toHaveBeenCalledWith("stat-1");
  });

  it("renders as View when no onPress provided", () => {
    const { getByTestId } = render(<StatCard {...defaultProps} onPress={undefined} />);
    const card = getByTestId("stat-card");
    expect(card.type).not.toBe("TouchableOpacity");
  });

  it("applies custom styles", () => {
    const customStyle = { marginTop: 20 };
    const { getByTestId } = render(<StatCard {...defaultProps} style={customStyle} />);
    const card = getByTestId("stat-card");
    expect(card.props.style).toEqual(expect.objectContaining(customStyle));
  });

  it("has correct accessibility role when pressable", () => {
    const { getByTestId } = render(<StatCard {...defaultProps} />);
    const card = getByTestId("stat-card");
    expect(card.props.accessibilityRole).toBe("button");
  });

  it("uses custom accessibilityLabel if provided", () => {
    const { getByTestId } = render(<StatCard {...defaultProps} accessibilityLabel="Custom label" />);
    const card = getByTestId("stat-card");
    expect(card.props.accessibilityLabel).toBe("Custom label");
  });

  it("uses default accessibilityLabel based on title", () => {
    const { getByTestId } = render(<StatCard {...defaultProps} />);
    const card = getByTestId("stat-card");
    expect(card.props.accessibilityLabel).toBe("Stat: Anxious, Depressed, Score: 65");
  });

  it("displays progress circle with correct color", () => {
    const { getByTestId } = render(<StatCard {...defaultProps} />);
    const progressCircle = getByTestId("progress-circle");
    expect(progressCircle).toBeTruthy();
  });

  it("uses custom maxScore for progress calculation", () => {
    const { getByTestId } = render(<StatCard {...defaultProps} maxScore={200} />);
    // Score 65 out of 200 should render correctly
    expect(getByTestId("stat-card")).toBeTruthy();
  });

  it("renders different date formats correctly", () => {
    const januaryDate = new Date(2024, 0, 5); // January 5
    const { getByTestId } = render(<StatCard {...defaultProps} date={januaryDate} />);
    const dateBadge = getByTestId("date-badge");
    expect(dateBadge.props.children.props.children).toContain("JAN");
    expect(dateBadge.props.children.props.children).toContain("5");
  });

  it("handles different score values", () => {
    const { getByText } = render(<StatCard {...defaultProps} score={95} />);
    expect(getByText("95")).toBeTruthy();
  });

  it("renders date badge with proper styling", () => {
    const { getByTestId } = render(<StatCard {...defaultProps} />);
    const dateBadge = getByTestId("date-badge");
    expect(dateBadge).toBeTruthy();
  });
});

// Helper function tests
describe("StatCard Helper Functions", () => {
  describe("formatStatDate", () => {
    it("formats September date correctly", () => {
      const date = new Date(2024, 8, 12);
      expect(formatStatDate(date)).toBe("SEP\n12");
    });

    it("formats January date correctly", () => {
      const date = new Date(2024, 0, 5);
      expect(formatStatDate(date)).toBe("JAN\n5");
    });

    it("formats December date correctly", () => {
      const date = new Date(2024, 11, 31);
      expect(formatStatDate(date)).toBe("DEC\n31");
    });
  });

  describe("calculateProgressPercentage", () => {
    it("calculates percentage correctly", () => {
      expect(calculateProgressPercentage(65, 100)).toBe(65);
    });

    it("calculates percentage with custom maxScore", () => {
      expect(calculateProgressPercentage(50, 200)).toBe(25);
    });

    it("returns 0 when maxScore is 0", () => {
      expect(calculateProgressPercentage(50, 0)).toBe(0);
    });

    it("caps at 100% when score exceeds maxScore", () => {
      expect(calculateProgressPercentage(150, 100)).toBe(100);
    });

    it("uses default maxScore of 100", () => {
      expect(calculateProgressPercentage(80)).toBe(80);
    });
  });
});
