jest.unmock("@/shared/theme/useTheme");
jest.mock("@/shared/theme/useTheme", () => jest.requireActual("@/shared/theme/useTheme"));

import React from "react";
import { Text, View } from "react-native";
import { render } from "@testing-library/react-native";

import { AvatarRing } from "./AvatarRing";
import { ThemeProvider } from "@/shared/theme/useTheme";

function renderWithTheme(ui: React.ReactElement) {
  return render(<ThemeProvider>{ui}</ThemeProvider>);
}

const ChildStub = () => (
  <View testID="avatar-child" style={{ width: 112, height: 112 }} />
);

describe("AvatarRing", () => {
  it("mounts without throwing", () => {
    expect(() =>
      renderWithTheme(
        <AvatarRing>
          <ChildStub />
        </AvatarRing>,
      ),
    ).not.toThrow();
  });

  it("renders a stable snapshot (default variant)", () => {
    const { toJSON } = renderWithTheme(
      <AvatarRing testID="avatar-ring">
        <ChildStub />
      </AvatarRing>,
    );
    expect(toJSON()).toMatchSnapshot();
  });

  it("renders a stable snapshot (lavender-aurora variant)", () => {
    const { toJSON } = renderWithTheme(
      <AvatarRing variant="lavender-aurora" testID="avatar-ring">
        <ChildStub />
      </AvatarRing>,
    );
    expect(toJSON()).toMatchSnapshot();
  });

  describe("dimensions", () => {
    it("defaults to size=120", () => {
      const { getByTestId } = renderWithTheme(
        <AvatarRing testID="avatar-ring">
          <ChildStub />
        </AvatarRing>,
      );
      const node = getByTestId("avatar-ring");
      const style = Array.isArray(node.props.style)
        ? Object.assign({}, ...node.props.style.filter(Boolean))
        : node.props.style;
      expect(style.width).toBe(120);
      expect(style.height).toBe(120);
    });

    it("applies custom size", () => {
      const { getByTestId } = renderWithTheme(
        <AvatarRing testID="avatar-ring" size={160}>
          <ChildStub />
        </AvatarRing>,
      );
      const node = getByTestId("avatar-ring");
      const style = Array.isArray(node.props.style)
        ? Object.assign({}, ...node.props.style.filter(Boolean))
        : node.props.style;
      expect(style.width).toBe(160);
    });
  });

  describe("variant prop", () => {
    it.each(["sage-aurora-peach", "lavender-aurora"] as const)(
      "renders variant=%s without throwing",
      (variant) => {
        const { toJSON } = renderWithTheme(
          <AvatarRing variant={variant}>
            <ChildStub />
          </AvatarRing>,
        );
        expect(toJSON()).toBeTruthy();
      },
    );
  });

  describe("glow prop", () => {
    it("renders with glow=false without throwing", () => {
      const { toJSON } = renderWithTheme(
        <AvatarRing glow={false}>
          <ChildStub />
        </AvatarRing>,
      );
      expect(toJSON()).toBeTruthy();
    });
  });

  describe("children", () => {
    it("renders children inside the ring", () => {
      const { getByTestId } = renderWithTheme(
        <AvatarRing>
          <ChildStub />
        </AvatarRing>,
      );
      expect(getByTestId("avatar-child")).toBeTruthy();
    });

    it("renders text children", () => {
      const { getByText } = renderWithTheme(
        <AvatarRing>
          <Text>JD</Text>
        </AvatarRing>,
      );
      expect(getByText("JD")).toBeTruthy();
    });
  });
});
