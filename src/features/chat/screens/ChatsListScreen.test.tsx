/**
 * ChatsListScreen Tests — prototype v4.2 #24 (Sprint 8 reskin).
 *
 * Behavior-focused: render, header, filter pills, conversation rows, FAB,
 * search button, accessibility roles, filter switching.
 */

jest.unmock("@/shared/theme/useTheme");
jest.mock("@/shared/theme/useTheme", () =>
  jest.requireActual("@/shared/theme/useTheme"),
);

import React from "react";
import { fireEvent, render } from "@testing-library/react-native";

import { ThemeProvider } from "@/shared/theme/useTheme";
import {
  ChatsListScreen,
  ConversationsListScreen,
  DEFAULT_CONVERSATIONS,
  type ChatsListScreenProps,
  type Conversation,
} from "./ChatsListScreen";

function renderWithTheme(ui: React.ReactElement) {
  return render(<ThemeProvider>{ui}</ThemeProvider>);
}

const baseProps: ChatsListScreenProps = {
  onSearch: jest.fn(),
  onNewConversation: jest.fn(),
  onConversationPress: jest.fn(),
  onFilterChange: jest.fn(),
};

describe("ChatsListScreen (v4.2 #24)", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders the screen container", () => {
    const { getByTestId } = renderWithTheme(<ChatsListScreen {...baseProps} />);
    expect(getByTestId("chats-list-screen")).toBeTruthy();
  });

  it("renders the editorial title 'Your sessions'", () => {
    const { getByText } = renderWithTheme(<ChatsListScreen {...baseProps} />);
    expect(getByText("Your sessions")).toBeTruthy();
  });

  it("renders the bracket kicker 'Conversations'", () => {
    const { getByText } = renderWithTheme(<ChatsListScreen {...baseProps} />);
    // BracketLabel uppercases visually; we assert the rendered text.
    expect(getByText(/CONVERSATIONS/)).toBeTruthy();
  });

  it("renders the search button with proper a11y", () => {
    const { getByTestId } = renderWithTheme(<ChatsListScreen {...baseProps} />);
    const btn = getByTestId("search-button");
    expect(btn.props.accessibilityRole).toBe("button");
    expect(btn.props.accessibilityLabel).toBe("Search conversations");
  });

  it("invokes onSearch when search button is pressed", () => {
    const onSearch = jest.fn();
    const { getByTestId } = renderWithTheme(
      <ChatsListScreen {...baseProps} onSearch={onSearch} />,
    );
    fireEvent.press(getByTestId("search-button"));
    expect(onSearch).toHaveBeenCalledTimes(1);
  });

  it("renders the FAB with proper a11y", () => {
    const { getByTestId } = renderWithTheme(<ChatsListScreen {...baseProps} />);
    const fab = getByTestId("new-conversation-fab");
    expect(fab.props.accessibilityRole).toBe("button");
    expect(fab.props.accessibilityLabel).toBe("Start a new conversation");
  });

  it("invokes onNewConversation when FAB pressed", () => {
    const onNewConversation = jest.fn();
    const { getByTestId } = renderWithTheme(
      <ChatsListScreen {...baseProps} onNewConversation={onNewConversation} />,
    );
    fireEvent.press(getByTestId("new-conversation-fab"));
    expect(onNewConversation).toHaveBeenCalledTimes(1);
  });

  it("renders the FilterPills row", () => {
    const { getByTestId } = renderWithTheme(<ChatsListScreen {...baseProps} />);
    expect(getByTestId("filter-pills")).toBeTruthy();
  });

  it("renders all 5 default conversations on filter=all", () => {
    const { getByTestId } = renderWithTheme(<ChatsListScreen {...baseProps} />);
    DEFAULT_CONVERSATIONS.forEach((c) => {
      expect(getByTestId(`conversation-row-${c.id}`)).toBeTruthy();
    });
  });

  it("filters to active conversations only on filter=active", () => {
    const { queryByTestId } = renderWithTheme(
      <ChatsListScreen {...baseProps} selectedFilter="active" />,
    );
    expect(queryByTestId("conversation-row-work-stress")).toBeTruthy();
    expect(queryByTestId("conversation-row-sleep-routine")).toBeNull();
    expect(queryByTestId("conversation-row-interview-prep")).toBeNull();
  });

  it("filters to archived only on filter=archived", () => {
    const { queryByTestId } = renderWithTheme(
      <ChatsListScreen {...baseProps} selectedFilter="archived" />,
    );
    expect(queryByTestId("conversation-row-sleep-routine")).toBeTruthy();
    expect(queryByTestId("conversation-row-interview-prep")).toBeTruthy();
    expect(queryByTestId("conversation-row-work-stress")).toBeNull();
  });

  it("invokes onConversationPress with id when a row is pressed", () => {
    const onConversationPress = jest.fn();
    const { getByTestId } = renderWithTheme(
      <ChatsListScreen
        {...baseProps}
        onConversationPress={onConversationPress}
      />,
    );
    fireEvent.press(getByTestId("conversation-row-work-stress"));
    expect(onConversationPress).toHaveBeenCalledWith("work-stress");
  });

  it("renders an unread dot only on unread items", () => {
    const { getByTestId, queryByTestId } = renderWithTheme(
      <ChatsListScreen {...baseProps} />,
    );
    expect(getByTestId("unread-dot-work-stress")).toBeTruthy();
    expect(queryByTestId("unread-dot-morning-anxiety")).toBeNull();
  });

  it("renders the conversation title in the row", () => {
    const { getByText } = renderWithTheme(<ChatsListScreen {...baseProps} />);
    expect(getByText("Work stress & boundaries")).toBeTruthy();
  });

  it("renders the bracket tag for each conversation", () => {
    const { getByTestId } = renderWithTheme(<ChatsListScreen {...baseProps} />);
    expect(getByTestId("conversation-tag-work-stress").props.children).toBe(
      "[ CBT ]",
    );
  });

  it("renders message count and time-ago in mono", () => {
    const { getByText } = renderWithTheme(<ChatsListScreen {...baseProps} />);
    expect(getByText("12 msgs")).toBeTruthy();
    expect(getByText("3m ago")).toBeTruthy();
  });

  it("conversation row has button role for screen readers", () => {
    const { getByTestId } = renderWithTheme(<ChatsListScreen {...baseProps} />);
    const row = getByTestId("conversation-row-work-stress");
    expect(row.props.accessibilityRole).toBe("button");
  });

  it("invokes onFilterChange when a pill is pressed", () => {
    const onFilterChange = jest.fn();
    const { getAllByRole } = renderWithTheme(
      <ChatsListScreen {...baseProps} onFilterChange={onFilterChange} />,
    );
    const tabs = getAllByRole("tab");
    // Press the second pill ("Active")
    fireEvent.press(tabs[1]);
    expect(onFilterChange).toHaveBeenCalledWith("active");
  });

  it("renders empty-state text when no conversations match filter", () => {
    const onlyActive: Conversation[] = [
      { ...DEFAULT_CONVERSATIONS[0], archived: false, id: "k1" },
    ];
    const { getByTestId } = renderWithTheme(
      <ChatsListScreen
        {...baseProps}
        conversations={onlyActive}
        selectedFilter="archived"
      />,
    );
    expect(getByTestId("empty-state-text")).toBeTruthy();
  });

  it("does not render legacy chat-item testIDs", () => {
    const { queryByTestId } = renderWithTheme(
      <ChatsListScreen {...baseProps} />,
    );
    expect(queryByTestId("chat-item-1")).toBeNull();
    expect(queryByTestId("segmented-control")).toBeNull();
    expect(queryByTestId("see-all-recent")).toBeNull();
  });

  it("does not render the legacy 'My AI Chats' title", () => {
    const { queryByText } = renderWithTheme(<ChatsListScreen {...baseProps} />);
    expect(queryByText("My AI Chats")).toBeNull();
  });

  it("FAB meets minimum 44pt touch target", () => {
    const { getByTestId } = renderWithTheme(<ChatsListScreen {...baseProps} />);
    const fab = getByTestId("new-conversation-fab");
    const styles = Array.isArray(fab.props.style)
      ? fab.props.style.flat()
      : [fab.props.style];
    const merged = styles.reduce(
      (acc: Record<string, unknown>, s: Record<string, unknown> | undefined) => ({
        ...acc,
        ...(s ?? {}),
      }),
      {},
    );
    expect(merged.height).toBeGreaterThanOrEqual(44);
    expect(merged.width).toBeGreaterThanOrEqual(44);
  });

  it("exports a ConversationsListScreen alias pointing at the same component", () => {
    expect(ConversationsListScreen).toBe(ChatsListScreen);
  });
});
