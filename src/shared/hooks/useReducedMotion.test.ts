/**
 * useReducedMotion Hook Tests
 * @description Tests for the OS-level reduced motion accessibility hook
 */

import { renderHook, act } from "@testing-library/react-native";
import { AccessibilityInfo } from "react-native";
import { useReducedMotion } from "./useReducedMotion";

// Capture the listener callback registered via addEventListener so tests can
// trigger fake OS-level "reduceMotionChanged" events.
let capturedListener: ((value: boolean) => void) | null = null;
const mockSubscription = { remove: jest.fn() };

beforeEach(() => {
  capturedListener = null;
  mockSubscription.remove.mockClear();

  jest.spyOn(AccessibilityInfo, "isReduceMotionEnabled").mockResolvedValue(false);
  jest.spyOn(AccessibilityInfo, "addEventListener").mockImplementation(
    (_event: string, handler: (value: boolean) => void) => {
      capturedListener = handler;
      return mockSubscription as any;
    }
  );
});

afterEach(() => {
  jest.restoreAllMocks();
});

describe("useReducedMotion", () => {
  describe("Initial state", () => {
    it("returns false when reduced motion is disabled on mount", async () => {
      jest.spyOn(AccessibilityInfo, "isReduceMotionEnabled").mockResolvedValue(false);

      const { result } = renderHook(() => useReducedMotion());

      // Flush the resolved promise
      await act(async () => {});

      expect(result.current).toBe(false);
    });

    it("returns true when reduced motion is already enabled on mount", async () => {
      jest.spyOn(AccessibilityInfo, "isReduceMotionEnabled").mockResolvedValue(true);

      const { result } = renderHook(() => useReducedMotion());

      await act(async () => {});

      expect(result.current).toBe(true);
    });

    it("starts with false before the async check resolves", () => {
      // Before the promise resolves the initial state must be false (safe default)
      jest.spyOn(AccessibilityInfo, "isReduceMotionEnabled").mockReturnValue(
        new Promise(() => {}) // never resolves
      );

      const { result } = renderHook(() => useReducedMotion());

      expect(result.current).toBe(false);
    });
  });

  describe("Querying AccessibilityInfo", () => {
    it("calls AccessibilityInfo.isReduceMotionEnabled on mount", async () => {
      const spy = jest.spyOn(AccessibilityInfo, "isReduceMotionEnabled").mockResolvedValue(false);

      renderHook(() => useReducedMotion());
      await act(async () => {});

      // React 19 Strict Mode double-invokes effects; assert at least once
      expect(spy).toHaveBeenCalled();
    });

    it("subscribes to reduceMotionChanged events on mount", () => {
      const spy = jest.spyOn(AccessibilityInfo, "addEventListener").mockReturnValue(mockSubscription as any);

      renderHook(() => useReducedMotion());

      expect(spy).toHaveBeenCalledWith("reduceMotionChanged", expect.any(Function));
    });
  });

  describe("Reactive updates", () => {
    it("updates to true when OS enables reduced motion", async () => {
      jest.spyOn(AccessibilityInfo, "isReduceMotionEnabled").mockResolvedValue(false);

      const { result } = renderHook(() => useReducedMotion());
      await act(async () => {});

      expect(result.current).toBe(false);

      // Simulate the OS toggling "Reduce Motion" on
      await act(async () => {
        capturedListener?.(true);
      });

      expect(result.current).toBe(true);
    });

    it("updates back to false when OS disables reduced motion", async () => {
      jest.spyOn(AccessibilityInfo, "isReduceMotionEnabled").mockResolvedValue(true);

      const { result } = renderHook(() => useReducedMotion());
      await act(async () => {});

      expect(result.current).toBe(true);

      // Simulate the OS toggling "Reduce Motion" off
      await act(async () => {
        capturedListener?.(false);
      });

      expect(result.current).toBe(false);
    });

    it("handles multiple consecutive OS changes correctly", async () => {
      jest.spyOn(AccessibilityInfo, "isReduceMotionEnabled").mockResolvedValue(false);

      const { result } = renderHook(() => useReducedMotion());
      await act(async () => {});

      await act(async () => { capturedListener?.(true); });
      expect(result.current).toBe(true);

      await act(async () => { capturedListener?.(false); });
      expect(result.current).toBe(false);

      await act(async () => { capturedListener?.(true); });
      expect(result.current).toBe(true);
    });
  });

  describe("Cleanup", () => {
    it("removes the event subscription on unmount", async () => {
      const { unmount } = renderHook(() => useReducedMotion());
      await act(async () => {});

      unmount();

      expect(mockSubscription.remove).toHaveBeenCalledTimes(1);
    });

    it("does not call remove before unmount", async () => {
      renderHook(() => useReducedMotion());
      await act(async () => {});

      expect(mockSubscription.remove).not.toHaveBeenCalled();
    });
  });

  describe("Return type", () => {
    it("always returns a boolean", async () => {
      jest.spyOn(AccessibilityInfo, "isReduceMotionEnabled").mockResolvedValue(false);

      const { result } = renderHook(() => useReducedMotion());
      await act(async () => {});

      expect(typeof result.current).toBe("boolean");
    });
  });
});
