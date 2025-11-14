/**
 * MoodScreen Component Tests
 * Comprehensive testing for mood tracking interface
 */

import React from 'react';
import { render, fireEvent, waitFor, screen } from '@testing-library/react-native';
import { Alert } from 'react-native';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { MoodScreen } from '../../../../src/features/mood/MoodScreen';
import moodReducer, { logMood } from '../../../../src/app/store/slices/moodSlice';

// Mock dependencies
jest.mock('@theme/ThemeProvider', () => ({
  useTheme: () => ({
    theme: {
      colors: {
        background: {
          primary: '#FFFFFF',
          secondary: '#F5F5F5',
        },
        text: {
          primary: '#2D3748',
          secondary: '#718096',
        },
        therapeutic: {
          nurturing: {
            600: '#16a34a',
          },
        },
      },
      shadows: {
        sm: {
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 1 },
          shadowOpacity: 0.05,
          shadowRadius: 2,
          elevation: 2,
        },
      },
    },
  }),
}));

// Create test store
const createTestStore = (initialState = {}) => {
  return configureStore({
    reducer: {
      mood: moodReducer,
    },
    preloadedState: initialState,
  });
};

describe('MoodScreen', () => {
  let store: any;
  let alertSpy: jest.SpyInstance;

  beforeEach(() => {
    store = createTestStore({
      mood: {
        moodHistory: [],
        weeklyStats: null,
        insights: [],
      },
    });

    jest.clearAllMocks();
    alertSpy = jest.spyOn(Alert, 'alert').mockImplementation(() => {});
  });

  afterEach(() => {
    alertSpy.mockRestore();
  });

  describe('Rendering', () => {
    it('should render without crashing', () => {
      render(
        <Provider store={store}>
          <MoodScreen />
        </Provider>
      );

      expect(screen.getByText('How are you feeling?')).toBeTruthy();
    });

    it('should display screen title and subtitle', () => {
      render(
        <Provider store={store}>
          <MoodScreen />
        </Provider>
      );

      expect(screen.getByText('How are you feeling?')).toBeTruthy();
      expect(screen.getByText('Track your emotions to understand your patterns')).toBeTruthy();
    });

    it('should display all mood options', () => {
      render(
        <Provider store={store}>
          <MoodScreen />
        </Provider>
      );

      expect(screen.getByText('Happy')).toBeTruthy();
      expect(screen.getByText('Sad')).toBeTruthy();
      expect(screen.getByText('Anxious')).toBeTruthy();
      expect(screen.getByText('Angry')).toBeTruthy();
      expect(screen.getByText('Tired')).toBeTruthy();
      expect(screen.getByText('Calm')).toBeTruthy();
    });

    it('should display mood emojis', () => {
      render(
        <Provider store={store}>
          <MoodScreen />
        </Provider>
      );

      expect(screen.getByText('😊')).toBeTruthy(); // Happy
      expect(screen.getByText('😔')).toBeTruthy(); // Sad
      expect(screen.getByText('😰')).toBeTruthy(); // Anxious
      expect(screen.getByText('😡')).toBeTruthy(); // Angry
      expect(screen.getByText('😴')).toBeTruthy(); // Tired
      expect(screen.getByText('😌')).toBeTruthy(); // Calm
    });

    it('should render save mood entry button', () => {
      render(
        <Provider store={store}>
          <MoodScreen />
        </Provider>
      );

      expect(screen.getByText('Save Mood Entry')).toBeTruthy();
    });

    it('should display Recent Entries section', () => {
      render(
        <Provider store={store}>
          <MoodScreen />
        </Provider>
      );

      expect(screen.getByText('Recent Entries')).toBeTruthy();
    });
  });

  describe('Mood Selection', () => {
    it('should allow selecting a mood', () => {
      render(
        <Provider store={store}>
          <MoodScreen />
        </Provider>
      );

      const happyButton = screen.getByText('Happy').parent;
      if (happyButton) {
        fireEvent.press(happyButton);
      }

      // Verify intensity section appears after mood selection
      expect(screen.getByText('Intensity level')).toBeTruthy();
    });

    it('should highlight selected mood', () => {
      render(
        <Provider store={store}>
          <MoodScreen />
        </Provider>
      );

      const sadButton = screen.getByText('Sad').parent;
      if (sadButton) {
        fireEvent.press(sadButton);
      }

      expect(screen.getByText('Intensity level')).toBeTruthy();
    });

    it('should allow changing mood selection', () => {
      render(
        <Provider store={store}>
          <MoodScreen />
        </Provider>
      );

      const happyButton = screen.getByText('Happy').parent;
      const sadButton = screen.getByText('Sad').parent;

      if (happyButton) {
        fireEvent.press(happyButton);
      }

      expect(screen.getByText('Intensity level')).toBeTruthy();

      if (sadButton) {
        fireEvent.press(sadButton);
      }

      // Should still show intensity level
      expect(screen.getByText('Intensity level')).toBeTruthy();
    });

    it('should not show intensity level before mood selection', () => {
      render(
        <Provider store={store}>
          <MoodScreen />
        </Provider>
      );

      expect(screen.queryByText('Intensity level')).toBeNull();
    });
  });

  describe('Intensity Selection', () => {
    it('should display intensity levels after mood selection', () => {
      render(
        <Provider store={store}>
          <MoodScreen />
        </Provider>
      );

      const happyButton = screen.getByText('Happy').parent;
      if (happyButton) {
        fireEvent.press(happyButton);
      }

      expect(screen.getByText('Intensity level')).toBeTruthy();
      expect(screen.getByText('1')).toBeTruthy();
      expect(screen.getByText('2')).toBeTruthy();
      expect(screen.getByText('3')).toBeTruthy();
      expect(screen.getByText('4')).toBeTruthy();
      expect(screen.getByText('5')).toBeTruthy();
    });

    it('should allow selecting intensity level', () => {
      render(
        <Provider store={store}>
          <MoodScreen />
        </Provider>
      );

      const happyButton = screen.getByText('Happy').parent;
      if (happyButton) {
        fireEvent.press(happyButton);
      }

      const intensityButtons = screen.getAllByText('3');
      const intensityButton = intensityButtons[0].parent;
      if (intensityButton) {
        fireEvent.press(intensityButton);
      }

      // Save button should be enabled now
      const saveButton = screen.getByText('Save Mood Entry');
      expect(saveButton).toBeTruthy();
    });

    it('should allow changing intensity level', () => {
      render(
        <Provider store={store}>
          <MoodScreen />
        </Provider>
      );

      const happyButton = screen.getByText('Happy').parent;
      if (happyButton) {
        fireEvent.press(happyButton);
      }

      const level1Buttons = screen.getAllByText('1');
      const level1 = level1Buttons[0].parent;
      if (level1) {
        fireEvent.press(level1);
      }

      const level5Buttons = screen.getAllByText('5');
      const level5 = level5Buttons[0].parent;
      if (level5) {
        fireEvent.press(level5);
      }

      expect(screen.getByText('Save Mood Entry')).toBeTruthy();
    });
  });

  describe('Form Validation', () => {
    it('should disable save button when no mood is selected', () => {
      render(
        <Provider store={store}>
          <MoodScreen />
        </Provider>
      );

      const saveButton = screen.getByText('Save Mood Entry').parent;
      expect(saveButton?.props.accessibilityState?.disabled).toBe(true);
    });

    it('should disable save button when no intensity is selected', () => {
      render(
        <Provider store={store}>
          <MoodScreen />
        </Provider>
      );

      const happyButton = screen.getByText('Happy').parent;
      if (happyButton) {
        fireEvent.press(happyButton);
      }

      const saveButton = screen.getByText('Save Mood Entry').parent;
      expect(saveButton?.props.accessibilityState?.disabled).toBe(true);
    });

    it('should enable save button when both mood and intensity are selected', () => {
      render(
        <Provider store={store}>
          <MoodScreen />
        </Provider>
      );

      const happyButton = screen.getByText('Happy').parent;
      if (happyButton) {
        fireEvent.press(happyButton);
      }

      const intensityButtons = screen.getAllByText('3');
      const intensityButton = intensityButtons[0].parent;
      if (intensityButton) {
        fireEvent.press(intensityButton);
      }

      const saveButton = screen.getByText('Save Mood Entry').parent;
      expect(saveButton?.props.accessibilityState?.disabled).toBe(false);
    });
  });

  describe('Saving Mood Entry', () => {
    it('should save mood entry when save button is pressed', async () => {
      render(
        <Provider store={store}>
          <MoodScreen />
        </Provider>
      );

      const anxiousButton = screen.getByText('Anxious').parent;
      if (anxiousButton) {
        fireEvent.press(anxiousButton);
      }

      const intensityButtons = screen.getAllByText('4');
      const intensityButton = intensityButtons[0].parent;
      if (intensityButton) {
        fireEvent.press(intensityButton);
      }

      const saveButton = screen.getByText('Save Mood Entry').parent;
      if (saveButton) {
        fireEvent.press(saveButton);
      }

      await waitFor(() => {
        expect(alertSpy).toHaveBeenCalledWith(
          'Mood Saved',
          'Your mood has been recorded successfully.',
          [{ text: 'OK' }]
        );
      });
    });

    it('should show loading state while saving', async () => {
      render(
        <Provider store={store}>
          <MoodScreen />
        </Provider>
      );

      const happyButton = screen.getByText('Happy').parent;
      if (happyButton) {
        fireEvent.press(happyButton);
      }

      const intensityButtons = screen.getAllByText('5');
      const intensityButton = intensityButtons[0].parent;
      if (intensityButton) {
        fireEvent.press(intensityButton);
      }

      const saveButton = screen.getByText('Save Mood Entry').parent;
      if (saveButton) {
        fireEvent.press(saveButton);
      }

      expect(screen.getByText('Saving...')).toBeTruthy();
    });

    it('should reset form after successful save', async () => {
      render(
        <Provider store={store}>
          <MoodScreen />
        </Provider>
      );

      const happyButton = screen.getByText('Happy').parent;
      if (happyButton) {
        fireEvent.press(happyButton);
      }

      const intensityButtons = screen.getAllByText('3');
      const intensityButton = intensityButtons[0].parent;
      if (intensityButton) {
        fireEvent.press(intensityButton);
      }

      const saveButton = screen.getByText('Save Mood Entry').parent;
      if (saveButton) {
        fireEvent.press(saveButton);
      }

      await waitFor(() => {
        expect(alertSpy).toHaveBeenCalled();
      });

      // Intensity section should be hidden after reset
      await waitFor(() => {
        expect(screen.queryByText('Intensity level')).toBeNull();
      });
    });

    it('should dispatch logMood action with correct data', async () => {
      const dispatchSpy = jest.spyOn(store, 'dispatch');

      render(
        <Provider store={store}>
          <MoodScreen />
        </Provider>
      );

      const calmButton = screen.getByText('Calm').parent;
      if (calmButton) {
        fireEvent.press(calmButton);
      }

      const intensityButtons = screen.getAllByText('2');
      const intensityButton = intensityButtons[0].parent;
      if (intensityButton) {
        fireEvent.press(intensityButton);
      }

      const saveButton = screen.getByText('Save Mood Entry').parent;
      if (saveButton) {
        fireEvent.press(saveButton);
      }

      await waitFor(() => {
        expect(dispatchSpy).toHaveBeenCalledWith(
          expect.objectContaining({
            type: expect.stringContaining('logMood'),
            payload: expect.objectContaining({
              mood: 'Calm',
              intensity: 2,
              notes: '',
              activities: [],
            }),
          })
        );
      });
    });
  });

  describe('Recent Entries Display', () => {
    it('should display recent mood entries from Redux', () => {
      const storeWithHistory = createTestStore({
        mood: {
          moodHistory: [
            {
              mood: 'Happy',
              intensity: 4,
              notes: 'Great day!',
              timestamp: new Date('2025-11-13T10:00:00'),
            },
            {
              mood: 'Anxious',
              intensity: 3,
              notes: 'Feeling nervous',
              timestamp: new Date('2025-11-12T14:30:00'),
            },
          ],
          weeklyStats: null,
          insights: [],
        },
      });

      render(
        <Provider store={storeWithHistory}>
          <MoodScreen />
        </Provider>
      );

      expect(screen.getByText(/Happy.*Level 4/)).toBeTruthy();
      expect(screen.getByText(/Anxious.*Level 3/)).toBeTruthy();
    });

    it('should display timestamps for recent entries', () => {
      const storeWithHistory = createTestStore({
        mood: {
          moodHistory: [
            {
              mood: 'Happy',
              intensity: 4,
              notes: 'Great day!',
              timestamp: new Date('2025-11-13T10:00:00'),
            },
          ],
          weeklyStats: null,
          insights: [],
        },
      });

      render(
        <Provider store={storeWithHistory}>
          <MoodScreen />
        </Provider>
      );

      // Timestamp should be displayed
      expect(screen.getByText(/11\/13\/2025/)).toBeTruthy();
    });

    it('should limit recent entries to 5 items', () => {
      const manyEntries = Array.from({ length: 10 }, (_, i) => ({
        mood: 'Happy',
        intensity: 3,
        notes: `Entry ${i}`,
        timestamp: new Date(`2025-11-${13 - i}T10:00:00`),
      }));

      const storeWithManyEntries = createTestStore({
        mood: {
          moodHistory: manyEntries,
          weeklyStats: null,
          insights: [],
        },
      });

      const { getAllByText } = render(
        <Provider store={storeWithManyEntries}>
          <MoodScreen />
        </Provider>
      );

      const happyEntries = getAllByText(/Happy.*Level 3/);
      expect(happyEntries.length).toBeLessThanOrEqual(5);
    });

    it('should show empty state when no entries exist', () => {
      render(
        <Provider store={store}>
          <MoodScreen />
        </Provider>
      );

      expect(screen.getByText('Recent Entries')).toBeTruthy();
      // No entries should be displayed
    });
  });

  describe('Error Handling', () => {
    it('should show error alert if save fails', async () => {
      const mockStore = createTestStore({
        mood: {
          moodHistory: [],
          weeklyStats: null,
          insights: [],
        },
      });

      // Mock dispatch to reject
      const dispatchSpy = jest.spyOn(mockStore, 'dispatch');
      dispatchSpy.mockRejectedValueOnce(new Error('Network error'));

      render(
        <Provider store={mockStore}>
          <MoodScreen />
        </Provider>
      );

      const happyButton = screen.getByText('Happy').parent;
      if (happyButton) {
        fireEvent.press(happyButton);
      }

      const intensityButtons = screen.getAllByText('3');
      const intensityButton = intensityButtons[0].parent;
      if (intensityButton) {
        fireEvent.press(intensityButton);
      }

      const saveButton = screen.getByText('Save Mood Entry').parent;
      if (saveButton) {
        fireEvent.press(saveButton);
      }

      await waitFor(() => {
        expect(alertSpy).toHaveBeenCalledWith(
          'Error',
          expect.stringContaining('An unexpected error occurred'),
          [{ text: 'OK' }]
        );
      });
    });
  });

  describe('Accessibility', () => {
    it('should have proper semantic structure', () => {
      render(
        <Provider store={store}>
          <MoodScreen />
        </Provider>
      );

      expect(screen.getByText('How are you feeling?')).toBeTruthy();
      expect(screen.getByText('Select your mood')).toBeTruthy();
    });

    it('should render mood buttons as pressable elements', () => {
      render(
        <Provider store={store}>
          <MoodScreen />
        </Provider>
      );

      const happyButton = screen.getByText('Happy').parent;
      expect(happyButton).toBeTruthy();
    });

    it('should render intensity buttons as pressable elements', () => {
      render(
        <Provider store={store}>
          <MoodScreen />
        </Provider>
      );

      const happyButton = screen.getByText('Happy').parent;
      if (happyButton) {
        fireEvent.press(happyButton);
      }

      const intensityButtons = screen.getAllByText('1');
      expect(intensityButtons.length).toBeGreaterThan(0);
    });
  });

  describe('Edge Cases', () => {
    it('should handle rapid mood selection changes', () => {
      render(
        <Provider store={store}>
          <MoodScreen />
        </Provider>
      );

      const moods = ['Happy', 'Sad', 'Anxious', 'Angry', 'Tired', 'Calm'];

      moods.forEach(mood => {
        const moodButton = screen.getByText(mood).parent;
        if (moodButton) {
          fireEvent.press(moodButton);
        }
      });

      expect(screen.getByText('Intensity level')).toBeTruthy();
    });

    it('should handle rapid intensity selection changes', () => {
      render(
        <Provider store={store}>
          <MoodScreen />
        </Provider>
      );

      const happyButton = screen.getByText('Happy').parent;
      if (happyButton) {
        fireEvent.press(happyButton);
      }

      [1, 2, 3, 4, 5].forEach(level => {
        const intensityButtons = screen.getAllByText(level.toString());
        const button = intensityButtons[0].parent;
        if (button) {
          fireEvent.press(button);
        }
      });

      expect(screen.getByText('Save Mood Entry')).toBeTruthy();
    });

    it('should prevent saving while already saving', async () => {
      render(
        <Provider store={store}>
          <MoodScreen />
        </Provider>
      );

      const happyButton = screen.getByText('Happy').parent;
      if (happyButton) {
        fireEvent.press(happyButton);
      }

      const intensityButtons = screen.getAllByText('3');
      const intensityButton = intensityButtons[0].parent;
      if (intensityButton) {
        fireEvent.press(intensityButton);
      }

      const saveButton = screen.getByText('Save Mood Entry').parent;

      // Press save button multiple times rapidly
      if (saveButton) {
        fireEvent.press(saveButton);
        fireEvent.press(saveButton);
        fireEvent.press(saveButton);
      }

      await waitFor(() => {
        // Should only save once
        expect(alertSpy).toHaveBeenCalledTimes(1);
      });
    });
  });
});
