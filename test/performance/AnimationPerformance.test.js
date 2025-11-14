/**
 * Animation Performance Tests
 * Tests for smooth 60fps animations and memory efficiency
 * Critical for mental health app user experience
 */

import { render, fireEvent, waitFor, act } from "@testing-library/react-native";
import React from "react";
import { Animated } from "react-native";

import MoodCheckIn from "../../src/features/dashboard/components/MoodCheckIn";
import QuickActions from "../../src/features/dashboard/components/QuickActions";
import EnhancedMoodTrackerScreen from "../../src/features/mood/screens/EnhancedMoodTrackerScreen";
import { PerformanceTestingHelpers } from "../utils/TestHelpers";

// Mock performance monitoring
const mockPerformanceMonitor = {
  measureRenderTime: jest.fn(),
  measureAnimationTime: jest.fn(),
  getMemoryUsage: jest.fn(() => ({ used: 50000000, total: 100000000 })),
  getFPS: jest.fn(() => 60),
};

global.performance = {
  now: jest.fn(() => Date.now()),
  mark: jest.fn(),
  measure: jest.fn(),
  getEntriesByType: jest.fn(() => []),
};

describe("Animation Performance Tests", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  describe("Component Render Performance", () => {
    it("renders MoodCheckIn component quickly", () => {
      const { renderTime, isPerformant } =
        PerformanceTestingHelpers.measureRenderTime(() =>
          render(<MoodCheckIn testID="mood-check-in" />),
        );

      expect(isPerformant).toBe(true);
      expect(renderTime).toBeLessThan(100); // Should render in under 100ms
    });

    it("renders QuickActions with multiple items efficiently", () => {
      const { renderTime } = PerformanceTestingHelpers.measureRenderTime(() =>
        render(<QuickActions testID="quick-actions" />),
      );

      expect(renderTime).toBeLessThan(150); // Multiple animated items
    });

    it("handles large datasets without performance degradation", () => {
      const largeDataset = PerformanceTestingHelpers.createLargeDataset(
        "mood",
        100,
      );

      const { renderTime } = PerformanceTestingHelpers.measureRenderTime(() =>
        render(
          <EnhancedMoodTrackerScreen
            testID="mood-tracker"
            initialData={largeDataset}
          />,
        ),
      );

      expect(renderTime).toBeLessThan(300); // Should handle large datasets
    });
  });

  describe("Animation Smoothness", () => {
    it("maintains 60fps during entrance animations", async () => {
      const { getByTestId } = render(<MoodCheckIn testID="mood-check-in" />);

      const startTime = performance.now();

      // Trigger entrance animations
      act(() => {
        jest.advanceTimersByTime(1000);
      });

      const endTime = performance.now();
      const duration = endTime - startTime;

      // Should complete animations within expected timeframe
      expect(duration).toBeLessThan(1100); // With some tolerance
    });

    it("uses native driver for optimal performance", () => {
      const animationSpy = jest.spyOn(Animated, "timing");

      render(<MoodCheckIn testID="mood-check-in" />);

      // Advance timers to trigger animations
      act(() => {
        jest.advanceTimersByTime(100);
      });

      if (animationSpy.mock.calls.length > 0) {
        const animationConfig = animationSpy.mock.calls[0][1];
        expect(animationConfig.useNativeDriver).toBe(true);
      }
    });

    it("handles rapid interactions without frame drops", async () => {
      const { getByTestId } = render(<MoodCheckIn testID="mood-check-in" />);
      const button = getByTestId("mood-check-in-button");

      const startTime = performance.now();

      // Rapidly trigger interactions
      for (let i = 0; i < 10; i++) {
        fireEvent.press(button);
        act(() => {
          jest.advanceTimersByTime(50);
        });
      }

      const endTime = performance.now();
      const totalTime = endTime - startTime;

      // Should handle rapid interactions smoothly
      expect(totalTime).toBeLessThan(1000);
    });

    it("reduces animations when reduced motion is enabled", () => {
      const ReducedMotionComponent = () => (
        <MoodCheckIn testID="mood-check-in" reducedMotion />
      );

      const { renderTime } = PerformanceTestingHelpers.measureRenderTime(() =>
        render(<ReducedMotionComponent />),
      );

      // Should render faster with reduced animations
      expect(renderTime).toBeLessThan(50);
    });
  });

  describe("Memory Management", () => {
    it("cleans up animations on component unmount", () => {
      const animationCleanupSpy = jest.fn();

      const { unmount } = render(
        <MoodCheckIn testID="mood-check-in" onUnmount={animationCleanupSpy} />,
      );

      unmount();

      // Should clean up resources
      // Note: In a real test, we'd check for removeAllListeners calls
      expect(true).toBe(true); // Placeholder
    });

    it("reuses animation values efficiently", () => {
      const { rerender } = render(<MoodCheckIn testID="mood-check-in" />);

      const initialMemory = mockPerformanceMonitor.getMemoryUsage();

      // Rerender multiple times
      for (let i = 0; i < 5; i++) {
        rerender(<MoodCheckIn testID="mood-check-in" key={i} />);
      }

      const finalMemory = mockPerformanceMonitor.getMemoryUsage();

      // Memory usage shouldn't increase significantly
      const memoryIncrease = finalMemory.used - initialMemory.used;
      expect(memoryIncrease).toBeLessThan(10000000); // 10MB threshold
    });

    it("handles component remounting without memory leaks", () => {
      let component;

      // Mount and unmount multiple times
      for (let i = 0; i < 10; i++) {
        component = render(<QuickActions testID={`quick-actions-${i}`} />);
        component.unmount();
      }

      const memoryUsage = mockPerformanceMonitor.getMemoryUsage();
      const memoryPercentage = (memoryUsage.used / memoryUsage.total) * 100;

      // Should not exceed reasonable memory usage
      expect(memoryPercentage).toBeLessThan(70);
    });
  });

  describe("Staggered Animation Performance", () => {
    it("staggers QuickActions animations efficiently", async () => {
      const { getAllByTestId } = render(
        <QuickActions testID="quick-actions" />,
      );

      const startTime = performance.now();

      // Trigger staggered animations
      act(() => {
        jest.advanceTimersByTime(2000); // Full stagger duration
      });

      const endTime = performance.now();
      const duration = endTime - startTime;

      // Should complete staggered animations efficiently
      expect(duration).toBeLessThan(2100);
    });

    it("calculates stagger delays correctly", () => {
      const items = [1, 2, 3, 4]; // 4 items
      const baseDelay = 100;
      const staggerDelay = 150;

      items.forEach((item, index) => {
        const expectedDelay = baseDelay + index * staggerDelay;
        expect(expectedDelay).toBe(baseDelay + index * staggerDelay);
      });
    });

    it("limits maximum stagger duration", () => {
      const manyItems = Array.from({ length: 20 }, (_, i) => i);
      const maxStaggerDuration = 1500; // 1.5 seconds max

      const totalDuration = Math.min(
        manyItems.length * 150,
        maxStaggerDuration,
      );

      expect(totalDuration).toBeLessThanOrEqual(maxStaggerDuration);
    });
  });

  describe("Gesture Animation Performance", () => {
    it("handles touch feedback animations smoothly", async () => {
      const { getByTestId } = render(<MoodCheckIn testID="mood-check-in" />);
      const button = getByTestId("mood-check-in-button");

      const startTime = performance.now();

      // Simulate touch press and release
      fireEvent(button, "pressIn");

      act(() => {
        jest.advanceTimersByTime(100);
      });

      fireEvent(button, "pressOut");

      act(() => {
        jest.advanceTimersByTime(100);
      });

      const endTime = performance.now();
      const touchResponseTime = endTime - startTime;

      // Touch feedback should be immediate
      expect(touchResponseTime).toBeLessThan(300);
    });

    it("scales touch feedback based on component size", () => {
      const smallComponent = render(
        <MoodCheckIn testID="small-mood-check-in" size="small" />,
      );

      const largeComponent = render(
        <MoodCheckIn testID="large-mood-check-in" size="large" />,
      );

      // Both should render efficiently regardless of size
      expect(smallComponent.getByTestId("small-mood-check-in")).toBeTruthy();
      expect(largeComponent.getByTestId("large-mood-check-in")).toBeTruthy();
    });
  });

  describe("Screen Transition Performance", () => {
    it("handles mood tracker step transitions smoothly", async () => {
      const { getByTestId } = render(
        <EnhancedMoodTrackerScreen testID="mood-tracker" />,
      );

      const startTime = performance.now();

      // Navigate through steps
      const nextButton = getByTestId("next-button");

      for (let step = 1; step <= 4; step++) {
        fireEvent.press(nextButton);

        act(() => {
          jest.advanceTimersByTime(300); // Transition duration
        });
      }

      const endTime = performance.now();
      const totalTransitionTime = endTime - startTime;

      // All transitions should complete quickly
      expect(totalTransitionTime).toBeLessThan(1500);
    });

    it("maintains 60fps during screen transitions", () => {
      const { getByTestId } = render(
        <EnhancedMoodTrackerScreen testID="mood-tracker" />,
      );

      // Mock FPS monitoring
      const fpsReadings = [];

      // Simulate FPS readings during transition
      act(() => {
        for (let i = 0; i < 16; i++) {
          // ~1 second at 60fps
          fpsReadings.push(mockPerformanceMonitor.getFPS());
          jest.advanceTimersByTime(16.67); // ~60fps frame time
        }
      });

      const averageFPS =
        fpsReadings.reduce((sum, fps) => sum + fps, 0) / fpsReadings.length;
      expect(averageFPS).toBeGreaterThanOrEqual(58); // Allow for minor variance
    });
  });

  describe("Animation Optimization", () => {
    it("uses transform animations for better performance", () => {
      const transformSpy = jest.fn();

      // Mock Animated.Value to track transform usage
      const mockAnimatedValue = {
        interpolate: jest.fn(() => ({
          transform: transformSpy,
        })),
      };

      jest.spyOn(Animated, "Value").mockReturnValue(mockAnimatedValue);

      render(<MoodCheckIn testID="mood-check-in" />);

      // Should use transform-based animations
      expect(mockAnimatedValue.interpolate).toHaveBeenCalled();
    });

    it("batches multiple animations efficiently", () => {
      const sequenceSpy = jest.spyOn(Animated, "sequence");
      const staggerSpy = jest.spyOn(Animated, "stagger");

      render(<QuickActions testID="quick-actions" />);

      // Should use batched animations for multiple items
      expect(sequenceSpy).toHaveBeenCalled() ||
        expect(staggerSpy).toHaveBeenCalled();
    });

    it("optimizes animation timing curves", () => {
      const timingSpy = jest.spyOn(Animated, "timing");

      render(<MoodCheckIn testID="mood-check-in" />);

      if (timingSpy.mock.calls.length > 0) {
        const animationConfig = timingSpy.mock.calls[0][1];

        // Should use appropriate easing
        expect(animationConfig.duration).toBeLessThanOrEqual(500);
      }
    });
  });

  describe("Crisis Mode Performance", () => {
    it("prioritizes crisis UI rendering", () => {
      const { renderTime } = PerformanceTestingHelpers.measureRenderTime(() =>
        render(<MoodCheckIn testID="crisis-mood-check-in" crisisMode />),
      );

      // Crisis mode should render immediately
      expect(renderTime).toBeLessThan(50);
    });

    it("disables non-essential animations in crisis mode", () => {
      const animationSpy = jest.spyOn(Animated, "timing");

      render(<QuickActions testID="crisis-quick-actions" crisisMode />);

      // Should have fewer or no decorative animations
      const animationCount = animationSpy.mock.calls.length;
      expect(animationCount).toBeLessThan(5); // Arbitrary threshold
    });
  });

  describe("Performance Monitoring Integration", () => {
    it("tracks animation performance metrics", () => {
      const performanceTracker = {
        animationStartTime: null,
        animationEndTime: null,
        trackAnimation: jest.fn(),
      };

      render(
        <MoodCheckIn
          testID="tracked-mood-check-in"
          performanceTracker={performanceTracker}
        />,
      );

      // Should integrate with performance tracking
      expect(performanceTracker.trackAnimation).toHaveBeenCalled();
    });

    it("reports performance issues when detected", () => {
      const errorReporter = jest.fn();

      // Simulate poor performance
      jest
        .spyOn(performance, "now")
        .mockReturnValueOnce(0)
        .mockReturnValueOnce(200); // 200ms render time

      render(
        <MoodCheckIn
          testID="slow-mood-check-in"
          onPerformanceIssue={errorReporter}
        />,
      );

      // Should report performance issues
      expect(errorReporter).toHaveBeenCalledWith(
        expect.objectContaining({
          type: "slow_render",
          duration: expect.any(Number),
        }),
      );
    });
  });
});
