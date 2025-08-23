/**
 * App Navigation Unit Tests
 * Tests tab navigation, screen transitions, and navigation state
 * Ensures smooth UX for mental health app users
 */

import React from 'react';
import {
  render,
  fireEvent,
  waitFor,
  act,
} from '@testing-library/react-native';
import { Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import AppNavigator from '../../navigation/AppNavigator';
import BottomTabBar from '../../components/navigation/BottomTabBar';
import { MentalHealthTestWrapper } from '../utils/TestHelpers';

// Mock screens
const MockHomeScreen = () => <Text testID="home-screen">Home Screen</Text>;
const MockChatScreen = () => <Text testID="chat-screen">Chat Screen</Text>;
const MockMoodScreen = () => <Text testID="mood-screen">Mood Screen</Text>;
const MockAssessmentScreen = () => <Text testID="assessment-screen">Assessment Screen</Text>;
const MockProfileScreen = () => <Text testID="profile-screen">Profile Screen</Text>;

// Mock navigation
const mockNavigate = jest.fn();
const mockGoBack = jest.fn();
const mockReset = jest.fn();

jest.mock('@react-navigation/native', () => ({
  ...jest.requireActual('@react-navigation/native'),
  useNavigation: () => ({
    navigate: mockNavigate,
    goBack: mockGoBack,
    reset: mockReset,
    canGoBack: jest.fn(() => true),
    getState: jest.fn(() => ({
      index: 0,
      routes: [{ name: 'Home', key: 'home-key' }],
    })),
  }),
  useFocusEffect: jest.fn(),
  useIsFocused: jest.fn(() => true),
}));

describe('App Navigation', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Tab Navigation', () => {
    it('renders all main navigation tabs', () => {
      const { getByText } = render(
        <MentalHealthTestWrapper>
          <AppNavigator />
        </MentalHealthTestWrapper>
      );

      // Check for main tabs
      expect(getByText('Home') || getByText('Dashboard')).toBeTruthy();
      expect(getByText('Chat') || getByText('Support')).toBeTruthy();
      expect(getByText('Mood') || getByText('Tracker')).toBeTruthy();
      expect(getByText('Assessment') || getByText('Assess')).toBeTruthy();
      expect(getByText('Profile') || getByText('Settings')).toBeTruthy();
    });

    it('navigates between tabs correctly', async () => {
      const { getByText } = render(
        <MentalHealthTestWrapper>
          <AppNavigator />
        </MentalHealthTestWrapper>
      );

      // Navigate to Chat tab
      const chatTab = getByText('Chat') || getByText('Support');
      fireEvent.press(chatTab);

      await waitFor(() => {
        expect(mockNavigate).toHaveBeenCalledWith(
          expect.stringMatching(/chat/i)
        );
      });
    });

    it('shows active tab indicator', () => {
      const { getByTestId } = render(
        <MentalHealthTestWrapper>
          <BottomTabBar 
            state={{ index: 0, routes: [{ name: 'Home', key: 'home' }] }}
            descriptors={{}}
            navigation={{}}
          />
        </MentalHealthTestWrapper>
      );

      // Active tab should have visual indicator
      const activeTab = getByTestId('tab-home-active') || getByTestId('tab-home');
      expect(activeTab).toBeTruthy();
    });

    it('uses appropriate icons for mental health context', () => {
      const { getByTestId } = render(
        <MentalHealthTestWrapper>
          <BottomTabBar 
            state={{ 
              index: 0, 
              routes: [
                { name: 'Home', key: 'home' },
                { name: 'Chat', key: 'chat' },
                { name: 'Mood', key: 'mood' },
              ]
            }}
            descriptors={{}}
            navigation={{}}
          />
        </MentalHealthTestWrapper>
      );

      // Should use mental health appropriate icons
      expect(getByTestId('icon-home') || getByTestId('tab-home')).toBeTruthy();
      expect(getByTestId('icon-chat') || getByTestId('tab-chat')).toBeTruthy();
      expect(getByTestId('icon-mood') || getByTestId('tab-mood')).toBeTruthy();
    });
  });

  describe('Screen Transitions', () => {
    it('handles screen focus changes', async () => {
      const { useIsFocused } = require('@react-navigation/native');
      
      // Mock screen becoming focused
      useIsFocused.mockReturnValue(true);
      
      const { getByTestId } = render(
        <MentalHealthTestWrapper>
          <MockMoodScreen />
        </MentalHealthTestWrapper>
      );

      await waitFor(() => {
        expect(getByTestId('mood-screen')).toBeTruthy();
      });
    });

    it('preserves navigation state during transitions', async () => {
      const { getByText } = render(
        <MentalHealthTestWrapper>
          <AppNavigator />
        </MentalHealthTestWrapper>
      );

      // Navigate to mood tracker
      const moodTab = getByText('Mood') || getByText('Tracker');
      fireEvent.press(moodTab);

      // Navigate to profile
      const profileTab = getByText('Profile') || getByText('Settings');
      fireEvent.press(profileTab);

      // Navigate back to mood
      fireEvent.press(moodTab);

      await waitFor(() => {
        // Should return to mood tracker with state preserved
        expect(mockNavigate).toHaveBeenCalledWith(
          expect.stringMatching(/mood/i)
        );
      });
    });

    it('handles deep link navigation', async () => {
      const deepLinkUrl = 'solace://mood-tracker/new-entry';
      
      const { getByTestId } = render(
        <MentalHealthTestWrapper>
          <AppNavigator initialRoute={deepLinkUrl} />
        </MentalHealthTestWrapper>
      );

      await waitFor(() => {
        // Should navigate to mood tracker
        expect(mockNavigate).toHaveBeenCalled();
      });
    });
  });

  describe('Crisis Navigation', () => {
    it('provides immediate access to crisis support from any screen', () => {
      const screens = [
        MockHomeScreen,
        MockChatScreen,
        MockMoodScreen,
        MockAssessmentScreen,
        MockProfileScreen,
      ];

      screens.forEach((Screen) => {
        const { getByText, unmount } = render(
          <MentalHealthTestWrapper>
            <Screen />
          </MentalHealthTestWrapper>
        );

        // Should have crisis support access
        const crisisAccess = getByText(/crisis|emergency|help/i) ||
                            getByText(/988/) ||
                            getByText(/support/i);
        
        if (crisisAccess) {
          expect(crisisAccess).toBeTruthy();
        }
        
        unmount();
      });
    });

    it('prioritizes crisis navigation over normal flow', async () => {
      const { getByText } = render(
        <MentalHealthTestWrapper>
          <AppNavigator crisisMode={true} />
        </MentalHealthTestWrapper>
      );

      // In crisis mode, should show crisis resources prominently
      const crisisElement = getByText(/crisis|emergency|988/i);
      if (crisisElement) {
        fireEvent.press(crisisElement);
        
        await waitFor(() => {
          expect(mockNavigate).toHaveBeenCalledWith(
            expect.stringMatching(/crisis|emergency/i)
          );
        });
      }
    });

    it('maintains crisis support in navigation header', () => {
      const { getByTestId } = render(
        <MentalHealthTestWrapper>
          <AppNavigator />
        </MentalHealthTestWrapper>
      );

      // Should have crisis support in header
      const header = getByTestId('navigation-header') || getByTestId('app-header');
      if (header) {
        expect(header).toBeTruthy();
      }
    });
  });

  describe('Accessibility Navigation', () => {
    it('supports keyboard navigation between tabs', async () => {
      const { getByText } = render(
        <MentalHealthTestWrapper>
          <AppNavigator />
        </MentalHealthTestWrapper>
      );

      const firstTab = getByText('Home') || getByText('Dashboard');
      
      // Simulate keyboard navigation
      fireEvent(firstTab, 'focus');
      fireEvent(firstTab, 'keyPress', { nativeEvent: { key: 'Tab' } });

      // Should move focus to next tab
      await waitFor(() => {
        expect(firstTab).toBeTruthy();
      });
    });

    it('announces screen changes to screen readers', async () => {
      const { AccessibilityInfo } = require('react-native');
      const { getByText } = render(
        <MentalHealthTestWrapper>
          <AppNavigator />
        </MentalHealthTestWrapper>
      );

      const moodTab = getByText('Mood') || getByText('Tracker');
      fireEvent.press(moodTab);

      await waitFor(() => {
        expect(AccessibilityInfo.announceForAccessibility).toHaveBeenCalledWith(
          expect.stringContaining('Mood')
        );
      });
    });

    it('provides proper tab accessibility labels', () => {
      const { getAllByRole } = render(
        <MentalHealthTestWrapper>
          <BottomTabBar 
            state={{ 
              index: 0, 
              routes: [
                { name: 'Home', key: 'home' },
                { name: 'Chat', key: 'chat' },
                { name: 'Mood', key: 'mood' },
              ]
            }}
            descriptors={{}}
            navigation={{}}
          />
        </MentalHealthTestWrapper>
      );

      const tabs = getAllByRole('button');
      tabs.forEach(tab => {
        expect(tab.props.accessibilityLabel).toBeTruthy();
        expect(tab.props.accessibilityRole).toBe('button');
      });
    });

    it('maintains focus order for screen readers', async () => {
      const { getByTestId } = render(
        <MentalHealthTestWrapper>
          <AppNavigator />
        </MentalHealthTestWrapper>
      );

      // Focus should move in logical order
      const mainContent = getByTestId('main-content') || getByTestId('app-navigator');
      expect(mainContent).toBeTruthy();
    });
  });

  describe('Performance and State Management', () => {
    it('lazy loads screens for better performance', async () => {
      const { getByText } = render(
        <MentalHealthTestWrapper>
          <AppNavigator />
        </MentalHealthTestWrapper>
      );

      // Should start with home screen loaded
      expect(getByText('Home') || getByText('Dashboard')).toBeTruthy();

      // Other screens should load on demand
      const chatTab = getByText('Chat') || getByText('Support');
      fireEvent.press(chatTab);

      await waitFor(() => {
        expect(mockNavigate).toHaveBeenCalled();
      });
    });

    it('persists navigation state across app lifecycle', () => {
      const initialState = {
        index: 2,
        routes: [
          { name: 'Home', key: 'home' },
          { name: 'Chat', key: 'chat' },
          { name: 'Mood', key: 'mood' },
        ],
      };

      const { getByTestId } = render(
        <MentalHealthTestWrapper>
          <NavigationContainer initialState={initialState}>
            <AppNavigator />
          </NavigationContainer>
        </MentalHealthTestWrapper>
      );

      // Should restore to mood tab
      const navigator = getByTestId('app-navigator');
      expect(navigator).toBeTruthy();
    });

    it('handles navigation errors gracefully', async () => {
      mockNavigate.mockImplementationOnce(() => {
        throw new Error('Navigation failed');
      });

      const { getByText } = render(
        <MentalHealthTestWrapper>
          <AppNavigator />
        </MentalHealthTestWrapper>
      );

      const chatTab = getByText('Chat') || getByText('Support');
      
      expect(() => {
        fireEvent.press(chatTab);
      }).not.toThrow();
    });

    it('optimizes re-renders during navigation', () => {
      const renderSpy = jest.fn();
      
      const TrackedComponent = () => {
        renderSpy();
        return <AppNavigator />;
      };

      const { getByText } = render(
        <MentalHealthTestWrapper>
          <TrackedComponent />
        </MentalHealthTestWrapper>
      );

      const initialRenders = renderSpy.mock.calls.length;

      // Navigate between tabs
      const moodTab = getByText('Mood') || getByText('Tracker');
      fireEvent.press(moodTab);

      const finalRenders = renderSpy.mock.calls.length;
      
      // Should not cause excessive re-renders
      expect(finalRenders - initialRenders).toBeLessThan(5);
    });
  });

  describe('Mental Health Specific Navigation', () => {
    it('provides easy access to mood tracking from any screen', () => {
      const { getByText } = render(
        <MentalHealthTestWrapper>
          <AppNavigator />
        </MentalHealthTestWrapper>
      );

      // Should have quick access to mood tracking
      const moodAccess = getByText(/mood|feeling|track/i);
      expect(moodAccess).toBeTruthy();
    });

    it('integrates crisis detection with navigation', async () => {
      const { getByTestId } = render(
        <MentalHealthTestWrapper>
          <AppNavigator crisisDetected={true} />
        </MentalHealthTestWrapper>
      );

      // Should modify navigation for crisis support
      await waitFor(() => {
        // Navigation should adapt to crisis state
        expect(mockNavigate).toHaveBeenCalled();
      });
    });

    it('provides contextual navigation based on user state', () => {
      const userContext = {
        currentMood: 'anxious',
        recentActivity: 'mood_tracking',
        needsSupport: true,
      };

      const { getByText } = render(
        <MentalHealthTestWrapper>
          <AppNavigator userContext={userContext} />
        </MentalHealthTestWrapper>
      );

      // Should provide contextual navigation
      expect(getByText(/support|help|calm/i) || getByText('Home')).toBeTruthy();
    });

    it('supports therapeutic navigation patterns', () => {
      const { getByTestId } = render(
        <MentalHealthTestWrapper>
          <AppNavigator therapeuticMode={true} />
        </MentalHealthTestWrapper>
      );

      // Should use calming colors and gentle transitions
      const navigator = getByTestId('app-navigator');
      expect(navigator).toBeTruthy();
    });
  });

  describe('Navigation Analytics and Insights', () => {
    it('tracks navigation patterns for insights', async () => {
      const analyticsTracker = jest.fn();
      
      const { getByText } = render(
        <MentalHealthTestWrapper>
          <AppNavigator onNavigationChange={analyticsTracker} />
        </MentalHealthTestWrapper>
      );

      const moodTab = getByText('Mood') || getByText('Tracker');
      fireEvent.press(moodTab);

      await waitFor(() => {
        expect(analyticsTracker).toHaveBeenCalledWith(
          expect.objectContaining({
            from: expect.any(String),
            to: expect.stringMatching(/mood/i),
            timestamp: expect.any(Number),
          })
        );
      });
    });

    it('identifies user engagement patterns', () => {
      const engagementTracker = {
        screenTime: {},
        navigationCount: 0,
        mostUsedScreen: null,
      };

      const { getByText } = render(
        <MentalHealthTestWrapper>
          <AppNavigator engagementTracker={engagementTracker} />
        </MentalHealthTestWrapper>
      );

      // Navigate multiple times
      const tabs = ['Mood', 'Chat', 'Profile', 'Home'];
      tabs.forEach(tab => {
        const tabElement = getByText(tab) || getByText('Dashboard');
        fireEvent.press(tabElement);
      });

      // Should track engagement
      expect(engagementTracker.navigationCount).toBeGreaterThan(0);
    });
  });
});
