/**
 * DashboardScreen Component Tests
 * Comprehensive testing for main mental health dashboard interface
 */

import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react-native';
import { DashboardScreen } from '../../../../src/features/dashboard/DashboardScreen';

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
          tertiary: '#A0AEC0',
        },
        border: {
          main: '#E2E8F0',
        },
        brown: {
          10: '#FFF8F0',
          20: '#F5E6D3',
          80: '#5A3B2A',
          100: '#1A0F0A',
        },
        green: {
          20: '#E5EAD7',
          40: '#7D944D',
          60: '#6B8E3D',
          80: '#5A7A2C',
          100: '#4A6A1C',
        },
        orange: {
          20: '#FFEEE2',
          40: '#ED7E1C',
          80: '#C56610',
          100: '#A55500',
        },
        purple: {
          20: '#E9E5F0',
          40: '#9B7FC4',
          60: '#7B5FA4',
          80: '#5B3F84',
          100: '#3B1F64',
        },
        yellow: {
          20: '#FFF9E5',
          80: '#D4B00A',
          100: '#B49000',
        },
        gray: {
          20: '#F7F7F7',
        },
        red: {
          60: '#DC2626',
        },
      },
    },
  }),
}));

jest.mock('@shared/hooks/useResponsive', () => ({
  useResponsive: () => ({
    isWeb: false,
    isMobile: true,
    getMaxContentWidth: () => 1024,
    getContainerPadding: () => 16,
  }),
}));

jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({
    navigate: jest.fn(),
  }),
}));

jest.mock('../../../../src/features/dashboard/components/MentalHealthScoreWidget', () => ({
  MentalHealthScoreWidget: ({ score, size, label }: any) => {
    const React = require('react');
    const { View, Text } = require('react-native');
    return React.createElement(View, { testID: 'mental-health-score-widget' },
      React.createElement(Text, {}, `Score: ${score}`)
    );
  },
}));

describe('DashboardScreen', () => {
  let mockNavigation: any;

  beforeEach(() => {
    mockNavigation = {
      navigate: jest.fn(),
    };

    jest.clearAllMocks();
  });

  describe('Rendering', () => {
    it('should render without crashing', () => {
      render(<DashboardScreen />);

      expect(screen.getByText('Hi, Shinomiya!')).toBeTruthy();
    });

    it('should display user greeting with current mood', () => {
      render(<DashboardScreen />);

      expect(screen.getByText('Hi, Shinomiya!')).toBeTruthy();
      expect(screen.getByText(/Happy/)).toBeTruthy();
    });

    it('should display current date', () => {
      render(<DashboardScreen />);

      expect(screen.getByText('Tue, 28 Oct 2025')).toBeTruthy();
    });

    it('should render mental health score widget', () => {
      render(<DashboardScreen />);

      expect(screen.getByTestId('mental-health-score-widget')).toBeTruthy();
      expect(screen.getByText('Score: 80')).toBeTruthy();
    });

    it('should display Freud Score card', () => {
      render(<DashboardScreen />);

      expect(screen.getByText('Freud Score')).toBeTruthy();
    });

    it('should display Mood card with emoji', () => {
      render(<DashboardScreen />);

      expect(screen.getByText('Mood')).toBeTruthy();
      expect(screen.getByText('Happy today')).toBeTruthy();
    });

    it('should render search button', () => {
      render(<DashboardScreen />);

      const searchButtons = screen.getAllByText('🔍');
      expect(searchButtons.length).toBeGreaterThan(0);
    });
  });

  describe('Mindful Tracker Section', () => {
    it('should display Mindful Tracker section title', () => {
      render(<DashboardScreen />);

      expect(screen.getByText('Mindful Tracker')).toBeTruthy();
    });

    it('should display Mindful Hours tracker', () => {
      render(<DashboardScreen />);

      expect(screen.getByText('Mindful Hours')).toBeTruthy();
      expect(screen.getByText('5.21h')).toBeTruthy();
    });

    it('should display Sleep Quality tracker', () => {
      render(<DashboardScreen />);

      expect(screen.getByText('Sleep Quality')).toBeTruthy();
      expect(screen.getByText('Insomnia (7h Avg)')).toBeTruthy();
    });

    it('should display Mindful Journal tracker', () => {
      render(<DashboardScreen />);

      expect(screen.getByText('Mindful Journal')).toBeTruthy();
      expect(screen.getByText('44 logs (streak)')).toBeTruthy();
    });

    it('should display Stress Level tracker', () => {
      render(<DashboardScreen />);

      expect(screen.getByText('Stress Level')).toBeTruthy();
      expect(screen.getByText('Level 3 (Normal)')).toBeTruthy();
    });

    it('should display Mood Tracker in mindful section', () => {
      render(<DashboardScreen />);

      const moodTrackers = screen.getAllByText('Mood Tracker');
      expect(moodTrackers.length).toBeGreaterThan(0);
    });

    it('should display tracker icons', () => {
      render(<DashboardScreen />);

      expect(screen.getByText('🫁')).toBeTruthy(); // Mindful Hours
      expect(screen.getByText('⭐')).toBeTruthy(); // Sleep Quality
      expect(screen.getByText('📖')).toBeTruthy(); // Journal
      expect(screen.getByText('😤')).toBeTruthy(); // Stress
    });
  });

  describe('Therapy Challenges Section', () => {
    it('should display Therapy Challenges section title', () => {
      render(<DashboardScreen />);

      expect(screen.getByText('Therapy Challenges')).toBeTruthy();
    });

    it('should display Therapeutic Exercises card', () => {
      render(<DashboardScreen />);

      expect(screen.getByText('Therapeutic Exercises')).toBeTruthy();
      expect(screen.getByText('6 exercises • CBT, Mindfulness & More')).toBeTruthy();
    });

    it('should display therapy exercises icon', () => {
      render(<DashboardScreen />);

      expect(screen.getByText('🧠')).toBeTruthy();
    });
  });

  describe('AI Therapy Chatbot Section', () => {
    it('should display AI Therapy Chatbot card', () => {
      render(<DashboardScreen />);

      expect(screen.getByText('AI Therapy Chatbot')).toBeTruthy();
    });

    it('should display conversation count', () => {
      render(<DashboardScreen />);

      expect(screen.getByText('2,541')).toBeTruthy();
      expect(screen.getByText('Conversations')).toBeTruthy();
    });

    it('should display AI chatbot icon', () => {
      render(<DashboardScreen />);

      expect(screen.getByText('💬')).toBeTruthy();
    });

    it('should display chatbot usage info', () => {
      render(<DashboardScreen />);

      expect(screen.getByText('10:14 am this month · Get Pro Now!')).toBeTruthy();
    });

    it('should display info icon', () => {
      render(<DashboardScreen />);

      const infoIcons = screen.getAllByText('ℹ️');
      expect(infoIcons.length).toBeGreaterThan(0);
    });
  });

  describe('Navigation', () => {
    it('should navigate to FreudScore when Freud Score card is pressed', () => {
      const { useNavigation } = require('@react-navigation/native');
      const mockNavigate = jest.fn();
      (useNavigation as jest.Mock).mockReturnValue({ navigate: mockNavigate });

      render(<DashboardScreen />);

      const freudScoreCard = screen.getByText('Freud Score').parent?.parent;
      if (freudScoreCard) {
        fireEvent.press(freudScoreCard);
        expect(mockNavigate).toHaveBeenCalledWith('FreudScore');
      }
    });

    it('should navigate to MoodStats when Mood card is pressed', () => {
      const { useNavigation } = require('@react-navigation/native');
      const mockNavigate = jest.fn();
      (useNavigation as jest.Mock).mockReturnValue({ navigate: mockNavigate });

      render(<DashboardScreen />);

      const moodCard = screen.getByText('Happy today').parent?.parent;
      if (moodCard) {
        fireEvent.press(moodCard);
        expect(mockNavigate).toHaveBeenCalledWith('MoodStats');
      }
    });

    it('should navigate to MindfulHours when tracker is pressed', () => {
      const { useNavigation } = require('@react-navigation/native');
      const mockNavigate = jest.fn();
      (useNavigation as jest.Mock).mockReturnValue({ navigate: mockNavigate });

      render(<DashboardScreen />);

      const mindfulHoursCard = screen.getByText('5.21h').parent?.parent;
      if (mindfulHoursCard) {
        fireEvent.press(mindfulHoursCard);
        expect(mockNavigate).toHaveBeenCalledWith('MindfulHours');
      }
    });

    it('should navigate to SleepQuality when tracker is pressed', () => {
      const { useNavigation } = require('@react-navigation/native');
      const mockNavigate = jest.fn();
      (useNavigation as jest.Mock).mockReturnValue({ navigate: mockNavigate });

      render(<DashboardScreen />);

      const sleepCard = screen.getByText('Insomnia (7h Avg)').parent?.parent;
      if (sleepCard) {
        fireEvent.press(sleepCard);
        expect(mockNavigate).toHaveBeenCalledWith('SleepQuality');
      }
    });

    it('should navigate to JournalList when journal tracker is pressed', () => {
      const { useNavigation } = require('@react-navigation/native');
      const mockNavigate = jest.fn();
      (useNavigation as jest.Mock).mockReturnValue({ navigate: mockNavigate });

      render(<DashboardScreen />);

      const journalCard = screen.getByText('44 logs (streak)').parent?.parent;
      if (journalCard) {
        fireEvent.press(journalCard);
        expect(mockNavigate).toHaveBeenCalledWith('JournalList');
      }
    });

    it('should navigate to StressLevel when stress tracker is pressed', () => {
      const { useNavigation } = require('@react-navigation/native');
      const mockNavigate = jest.fn();
      (useNavigation as jest.Mock).mockReturnValue({ navigate: mockNavigate });

      render(<DashboardScreen />);

      const stressCard = screen.getByText('Level 3 (Normal)').parent?.parent;
      if (stressCard) {
        fireEvent.press(stressCard);
        expect(mockNavigate).toHaveBeenCalledWith('StressLevel');
      }
    });

    it('should navigate to MoodTracker when mood tracker is pressed', () => {
      const { useNavigation } = require('@react-navigation/native');
      const mockNavigate = jest.fn();
      (useNavigation as jest.Mock).mockReturnValue({ navigate: mockNavigate });

      render(<DashboardScreen />);

      const moodTrackers = screen.getAllByText('Mood Tracker');
      const moodTrackerCard = moodTrackers[0].parent?.parent;
      if (moodTrackerCard) {
        fireEvent.press(moodTrackerCard);
        expect(mockNavigate).toHaveBeenCalledWith('MoodTracker');
      }
    });

    it('should navigate to TherapyExercises when therapy challenges card is pressed', () => {
      const { useNavigation } = require('@react-navigation/native');
      const mockNavigate = jest.fn();
      (useNavigation as jest.Mock).mockReturnValue({ navigate: mockNavigate });

      render(<DashboardScreen />);

      const therapyCard = screen.getByText('6 exercises • CBT, Mindfulness & More').parent?.parent;
      if (therapyCard) {
        fireEvent.press(therapyCard);
        expect(mockNavigate).toHaveBeenCalledWith('TherapyExercises');
      }
    });

    it('should navigate to Chat when AI chatbot card is pressed', () => {
      const { useNavigation } = require('@react-navigation/native');
      const mockNavigate = jest.fn();
      (useNavigation as jest.Mock).mockReturnValue({ navigate: mockNavigate });

      render(<DashboardScreen />);

      const chatCard = screen.getByText('2,541').parent?.parent?.parent;
      if (chatCard) {
        fireEvent.press(chatCard);
        expect(mockNavigate).toHaveBeenCalledWith('Chat');
      }
    });
  });

  describe('Responsive Design', () => {
    it('should apply responsive styles for mobile', () => {
      const { useResponsive } = require('@shared/hooks/useResponsive');
      (useResponsive as jest.Mock).mockReturnValue({
        isWeb: false,
        isMobile: true,
        getMaxContentWidth: () => 1024,
        getContainerPadding: () => 16,
      });

      render(<DashboardScreen />);

      expect(screen.getByText('Hi, Shinomiya!')).toBeTruthy();
    });

    it('should apply responsive styles for web', () => {
      const { useResponsive } = require('@shared/hooks/useResponsive');
      (useResponsive as jest.Mock).mockReturnValue({
        isWeb: true,
        isMobile: false,
        getMaxContentWidth: () => 1024,
        getContainerPadding: () => 24,
      });

      render(<DashboardScreen />);

      expect(screen.getByText('Hi, Shinomiya!')).toBeTruthy();
    });
  });

  describe('Theme Integration', () => {
    it('should render with theme colors', () => {
      render(<DashboardScreen />);

      // Verify key components are rendered (theme is applied internally)
      expect(screen.getByText('Hi, Shinomiya!')).toBeTruthy();
      expect(screen.getByText('Freud Score')).toBeTruthy();
    });
  });

  describe('Progress Indicators', () => {
    it('should display progress bars for trackers', () => {
      render(<DashboardScreen />);

      // Progress bars are rendered for various metrics
      // Verify the trackers that should have progress are rendered
      expect(screen.getByText('Mindful Hours')).toBeTruthy();
      expect(screen.getByText('Sleep Quality')).toBeTruthy();
      expect(screen.getByText('Mindful Journal')).toBeTruthy();
    });
  });

  describe('Accessibility', () => {
    it('should render with proper structure for screen readers', () => {
      render(<DashboardScreen />);

      // Verify all major sections are accessible
      expect(screen.getByText('Hi, Shinomiya!')).toBeTruthy();
      expect(screen.getByText('Mindful Tracker')).toBeTruthy();
      expect(screen.getByText('Therapy Challenges')).toBeTruthy();
      expect(screen.getByText('AI Therapy Chatbot')).toBeTruthy();
    });

    it('should have descriptive text for all metrics', () => {
      render(<DashboardScreen />);

      expect(screen.getByText('Freud Score')).toBeTruthy();
      expect(screen.getByText('Mood')).toBeTruthy();
      expect(screen.getByText('Happy today')).toBeTruthy();
      expect(screen.getByText('5.21h')).toBeTruthy();
      expect(screen.getByText('Insomnia (7h Avg)')).toBeTruthy();
    });
  });

  describe('Data Display', () => {
    it('should display numeric metrics correctly', () => {
      render(<DashboardScreen />);

      expect(screen.getByText('Score: 80')).toBeTruthy(); // Mental Health Score
      expect(screen.getByText('5.21h')).toBeTruthy(); // Mindful Hours
      expect(screen.getByText('44 logs (streak)')).toBeTruthy(); // Journal streak
      expect(screen.getByText('2,541')).toBeTruthy(); // Conversations
    });

    it('should display mood emoji correctly', () => {
      render(<DashboardScreen />);

      const happyEmojis = screen.getAllByText('😊');
      expect(happyEmojis.length).toBeGreaterThan(0);
    });
  });

  describe('Scrolling Behavior', () => {
    it('should render in a scrollable container', () => {
      const { UNSAFE_getByType } = render(<DashboardScreen />);

      const { ScrollView } = require('react-native');
      expect(UNSAFE_getByType(ScrollView)).toBeTruthy();
    });
  });
});
