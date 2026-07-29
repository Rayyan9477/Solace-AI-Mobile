/**
 * Tests for the write-failure toast.
 *
 * The adapter tests prove each write path reaches this hook. This file pins
 * what the hook then puts on screen — in particular the accessibility
 * contract, which no adapter test looks at and which a screen-reader user
 * depends on entirely: an error that queues politely behind a long screen
 * description is an error the user never hears.
 */

import React from "react";
import { fireEvent, render } from "@testing-library/react-native";
import { Pressable, Text } from "react-native";

import { setSilentFailureReporter } from "./logSilentFailure";
import {
  useWriteFailureToast,
  WRITE_FAILURE_TOAST_TEST_ID,
} from "./useWriteFailureToast";

/** Harness: a "save" button that always fails, plus a manual dismiss. */
function Harness(): React.ReactElement {
  const { reportWriteFailure, dismissWriteFailure, failureToast } =
    useWriteFailureToast();
  return (
    <>
      <Pressable
        testID="fail"
        accessibilityRole="button"
        accessibilityLabel="Trigger a failing save"
        onPress={() =>
          reportWriteFailure({
            operation: "mood.create",
            error: new Error("database is locked"),
            message: "We couldn't save this check-in.",
          })
        }
      >
        <Text>fail</Text>
      </Pressable>
      <Pressable
        testID="dismiss"
        accessibilityRole="button"
        accessibilityLabel="Dismiss the failure"
        onPress={dismissWriteFailure}
      >
        <Text>dismiss</Text>
      </Pressable>
      {failureToast}
    </>
  );
}

describe("useWriteFailureToast", () => {
  let warnSpy: jest.SpyInstance;

  beforeEach(() => {
    warnSpy = jest.spyOn(console, "warn").mockImplementation(() => undefined);
  });

  afterEach(() => {
    warnSpy.mockRestore();
    setSilentFailureReporter(null);
  });

  it("renders nothing until something fails", () => {
    const { queryByTestId } = render(<Harness />);
    expect(queryByTestId(WRITE_FAILURE_TOAST_TEST_ID)).toBeNull();
  });

  it("shows the caller's message once a failure is reported", () => {
    const { getByTestId, getByText } = render(<Harness />);

    fireEvent.press(getByTestId("fail"));

    expect(getByTestId(WRITE_FAILURE_TOAST_TEST_ID)).toBeTruthy();
    expect(getByText("We couldn't save this check-in.")).toBeTruthy();
  });

  it("announces assertively, as an alert", () => {
    const { getByTestId } = render(<Harness />);

    fireEvent.press(getByTestId("fail"));

    const toast = getByTestId(WRITE_FAILURE_TOAST_TEST_ID);
    expect(toast.props.accessibilityRole).toBe("alert");
    expect(toast.props.accessibilityLiveRegion).toBe("assertive");
  });

  it("can be dismissed by hand rather than only on a timer", () => {
    const { getByTestId, queryByTestId } = render(<Harness />);
    fireEvent.press(getByTestId("fail"));

    fireEvent.press(getByTestId(`${WRITE_FAILURE_TOAST_TEST_ID}-close-button`));

    expect(queryByTestId(WRITE_FAILURE_TOAST_TEST_ID)).toBeNull();
  });

  it("clears when the caller dismisses it", () => {
    const { getByTestId, queryByTestId } = render(<Harness />);
    fireEvent.press(getByTestId("fail"));

    fireEvent.press(getByTestId("dismiss"));

    expect(queryByTestId(WRITE_FAILURE_TOAST_TEST_ID)).toBeNull();
  });

  it("reports through logSilentFailure so telemetry and UI cannot diverge", () => {
    const reports: string[] = [];
    setSilentFailureReporter((report) => reports.push(report.operation));
    const { getByTestId } = render(<Harness />);

    fireEvent.press(getByTestId("fail"));

    expect(reports).toEqual(["mood.create"]);
  });
});
