/**
 * LinkedDevicesScreen Tests
 * @description Tests for 2x2 device grid with battery levels, connect/disconnect
 * @task Task 3.17.7: Linked Devices Screen (Screen 146)
 */

import { render, fireEvent } from "@testing-library/react-native";
import React from "react";

import { LinkedDevicesScreen } from "./LinkedDevicesScreen";

const defaultProps = {
  devices: [
    {
      id: "watch",
      name: "Smart Watch",
      battery: 75,
      status: "inactive" as const,
    },
    {
      id: "patch",
      name: "Smart Patch",
      battery: 11,
      status: "connected" as const,
    },
    { id: "ecg", name: "Mini ECG", battery: 99, status: "connected" as const },
    { id: "bp", name: "BP Monitor", battery: 10, status: "inactive" as const },
  ],
  onBack: jest.fn(),
  onDeviceAction: jest.fn(),
  onSave: jest.fn(),
};

function renderScreen(overrides = {}) {
  return render(<LinkedDevicesScreen {...defaultProps} {...overrides} />);
}

beforeEach(() => jest.clearAllMocks());

describe("LinkedDevicesScreen", () => {
  // ── Rendering ──────────────────────────────────────────
  it("renders the screen container", () => {
    const { getByTestId } = renderScreen();
    expect(getByTestId("linked-devices-screen")).toBeTruthy();
  });

  it("renders the back button", () => {
    const { getByTestId } = renderScreen();
    expect(getByTestId("back-button")).toBeTruthy();
  });

  it("renders 'Linked Devices' title", () => {
    const { getByText } = renderScreen();
    expect(getByText("Linked Devices")).toBeTruthy();
  });

  it("renders all device cards", () => {
    const { getByTestId } = renderScreen();
    expect(getByTestId("device-card-watch")).toBeTruthy();
    expect(getByTestId("device-card-patch")).toBeTruthy();
    expect(getByTestId("device-card-ecg")).toBeTruthy();
    expect(getByTestId("device-card-bp")).toBeTruthy();
  });

  it("renders device names", () => {
    const { getByText } = renderScreen();
    expect(getByText("Smart Watch")).toBeTruthy();
    expect(getByText("Smart Patch")).toBeTruthy();
    expect(getByText("Mini ECG")).toBeTruthy();
    expect(getByText("BP Monitor")).toBeTruthy();
  });

  it("renders battery levels", () => {
    const { getByText } = renderScreen();
    expect(getByText("75%")).toBeTruthy();
    expect(getByText("11%")).toBeTruthy();
    expect(getByText("99%")).toBeTruthy();
    expect(getByText("10%")).toBeTruthy();
  });

  it("renders status labels", () => {
    const { getAllByText } = renderScreen();
    expect(getAllByText("Inactive").length).toBe(2);
    expect(getAllByText("Connected").length).toBe(2);
  });

  it("renders Connect buttons for inactive devices", () => {
    const { getAllByText } = renderScreen();
    expect(getAllByText("Connect").length).toBe(2);
  });

  it("renders Disconnect buttons for connected devices", () => {
    const { getAllByText } = renderScreen();
    expect(getAllByText("Disconnect").length).toBe(2);
  });

  it("renders save button", () => {
    const { getByTestId } = renderScreen();
    expect(getByTestId("save-button")).toBeTruthy();
  });

  // ── Callbacks ──────────────────────────────────────────
  it("calls onBack when back button is pressed", () => {
    const onBack = jest.fn();
    const { getByTestId } = renderScreen({ onBack });
    fireEvent.press(getByTestId("back-button"));
    expect(onBack).toHaveBeenCalledTimes(1);
  });

  it("calls onDeviceAction when connect button is pressed", () => {
    const onDeviceAction = jest.fn();
    const { getByTestId } = renderScreen({ onDeviceAction });
    fireEvent.press(getByTestId("action-watch"));
    expect(onDeviceAction).toHaveBeenCalledWith("watch");
  });

  it("calls onDeviceAction when disconnect button is pressed", () => {
    const onDeviceAction = jest.fn();
    const { getByTestId } = renderScreen({ onDeviceAction });
    fireEvent.press(getByTestId("action-patch"));
    expect(onDeviceAction).toHaveBeenCalledWith("patch");
  });

  it("calls onSave when save button is pressed", () => {
    const onSave = jest.fn();
    const { getByTestId } = renderScreen({ onSave });
    fireEvent.press(getByTestId("save-button"));
    expect(onSave).toHaveBeenCalledTimes(1);
  });

  // ── Accessibility ──────────────────────────────────────
  it("back button has accessibilityLabel 'Go back'", () => {
    const { getByTestId } = renderScreen();
    expect(getByTestId("back-button").props.accessibilityLabel).toBe("Go back");
  });

  it("back button meets 44×44 minimum touch target", () => {
    const { getByTestId } = renderScreen();
    const style = Object.assign(
      {},
      ...[].concat(getByTestId("back-button").props.style),
    );
    expect(style.minHeight).toBeGreaterThanOrEqual(44);
    expect(style.minWidth).toBeGreaterThanOrEqual(44);
  });

  it("device action buttons meet 44px minimum touch height", () => {
    const { getByTestId } = renderScreen();
    const style = Object.assign(
      {},
      ...[].concat(getByTestId("action-watch").props.style),
    );
    expect(style.minHeight).toBeGreaterThanOrEqual(44);
  });

  // ── Styling ────────────────────────────────────────────
  it("applies dark background to the container", () => {
    const { getByTestId } = renderScreen();
    const style = Object.assign(
      {},
      ...[].concat(getByTestId("linked-devices-screen").props.style),
    );
    expect(style.backgroundColor).toBe("#1C1410");
  });

  // ── Branding ───────────────────────────────────────────
  it("does not contain any Freud branding", () => {
    const { queryByText } = renderScreen();
    expect(queryByText(/freud/i)).toBeNull();
  });
});
