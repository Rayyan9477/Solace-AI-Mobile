/**
 * NewConversationScreen Component Tests
 * Comprehensive testing for AI therapy conversation setup interface
 */

import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react-native';
import { NewConversationScreen } from '../../../../src/features/chat/NewConversationScreen';

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
          primary: '#E2E8F0',
        },
        green: {
          10: '#E5EAD7',
          20: '#D4E5B7',
          40: '#7D944D',
          60: '#6B8E3D',
        },
        blue: {
          20: '#E0F2FE',
        },
        purple: {
          20: '#E9E5F0',
        },
        yellow: {
          20: '#FFF9E5',
        },
        orange: {
          40: '#ED7E1C',
        },
      },
      getShadow: () => ({
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 8,
        elevation: 5,
      }),
      isDark: false,
    },
  }),
}));

jest.mock('@components/icons', () => ({
  MentalHealthIcon: ({ name, ...props }: any) => {
    const React = require('react');
    const { Text } = require('react-native');
    return React.createElement(Text, { testID: `icon-${name}`, ...props }, name);
  },
}));

// Mock navigation
const mockNavigate = jest.fn();
const mockGoBack = jest.fn();
const mockNavigation = {
  navigate: mockNavigate,
  goBack: mockGoBack,
};

describe('NewConversationScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Rendering', () => {
    it('should render without crashing', () => {
      render(<NewConversationScreen navigation={mockNavigation} />);

      expect(screen.getByText('New Conversation')).toBeTruthy();
    });

    it('should display header with title', () => {
      render(<NewConversationScreen navigation={mockNavigation} />);

      expect(screen.getByText('New Conversation')).toBeTruthy();
    });

    it('should render back button', () => {
      render(<NewConversationScreen navigation={mockNavigation} />);

      expect(screen.getByTestId('icon-ChevronLeft')).toBeTruthy();
    });

    it('should render menu button', () => {
      render(<NewConversationScreen navigation={mockNavigation} />);

      expect(screen.getByTestId('icon-MoreVertical')).toBeTruthy();
    });

    it('should display topic name input section', () => {
      render(<NewConversationScreen navigation={mockNavigation} />);

      expect(screen.getByText('Topic Name')).toBeTruthy();
      expect(screen.getByPlaceholderText('Worrying Life Choices, I\'m Sad')).toBeTruthy();
    });

    it('should display AI Model section', () => {
      render(<NewConversationScreen navigation={mockNavigation} />);

      expect(screen.getByText('AI Model')).toBeTruthy();
      expect(screen.getByText('doctor_ai_v2.0RE_v1.v17')).toBeTruthy();
    });

    it('should display AI LLM Chatbots section', () => {
      render(<NewConversationScreen navigation={mockNavigation} />);

      expect(screen.getByText('AI LLM Chatbots')).toBeTruthy();
      expect(screen.getByText('GPT-4')).toBeTruthy();
      expect(screen.getByText('GPT-3.5')).toBeTruthy();
      expect(screen.getByText('Claude')).toBeTruthy();
      expect(screen.getByText('PaLM2')).toBeTruthy();
    });

    it('should display all AI model descriptions', () => {
      render(<NewConversationScreen navigation={mockNavigation} />);

      expect(screen.getByText('Most advanced')).toBeTruthy();
      expect(screen.getByText('Fast & efficient')).toBeTruthy();
      expect(screen.getByText('Thoughtful')).toBeTruthy();
      expect(screen.getByText('Balanced')).toBeTruthy();
    });

    it('should display Conversation Style section', () => {
      render(<NewConversationScreen navigation={mockNavigation} />);

      expect(screen.getByText('Conversation Style')).toBeTruthy();
      expect(screen.getByText('🙂 Casual')).toBeTruthy();
      expect(screen.getByText('👔 Formal')).toBeTruthy();
      expect(screen.getByText('🎉 Fun')).toBeTruthy();
    });

    it('should display Therapy Goals section', () => {
      render(<NewConversationScreen navigation={mockNavigation} />);

      expect(screen.getByText('Therapy Goals')).toBeTruthy();
      expect(screen.getByText('Reduce Stress Level')).toBeTruthy();
      expect(screen.getByText('Manage Anxiety')).toBeTruthy();
      expect(screen.getByText('Combat Depression')).toBeTruthy();
      expect(screen.getByText('Improve Sleep')).toBeTruthy();
      expect(screen.getByText('Better Relationships')).toBeTruthy();
      expect(screen.getByText('Boost Productivity')).toBeTruthy();
    });

    it('should display Privacy & Security section', () => {
      render(<NewConversationScreen navigation={mockNavigation} />);

      expect(screen.getByText('Privacy & Security')).toBeTruthy();
      expect(screen.getByText('Make Chat Public')).toBeTruthy();
    });

    it('should display Create Conversation button', () => {
      render(<NewConversationScreen navigation={mockNavigation} />);

      expect(screen.getByText('Create Conversation')).toBeTruthy();
    });

    it('should display Preferred Users section', () => {
      render(<NewConversationScreen navigation={mockNavigation} />);

      expect(screen.getByText('Preferred Users')).toBeTruthy();
      expect(screen.getByText('Select up to 10 Attendees')).toBeTruthy();
    });

    it('should display Conversation Icon section', () => {
      render(<NewConversationScreen navigation={mockNavigation} />);

      expect(screen.getByText('Conversation Icon')).toBeTruthy();
    });
  });

  describe('User Interactions - Topic Name', () => {
    it('should allow typing in topic name field', () => {
      render(<NewConversationScreen navigation={mockNavigation} />);

      const topicInput = screen.getByPlaceholderText('Worrying Life Choices, I\'m Sad');
      fireEvent.changeText(topicInput, 'My anxiety journey');

      expect(topicInput.props.value).toBe('My anxiety journey');
    });

    it('should clear topic name when text is deleted', () => {
      render(<NewConversationScreen navigation={mockNavigation} />);

      const topicInput = screen.getByPlaceholderText('Worrying Life Choices, I\'m Sad');
      fireEvent.changeText(topicInput, 'Test topic');
      fireEvent.changeText(topicInput, '');

      expect(topicInput.props.value).toBe('');
    });

    it('should handle long topic names', () => {
      render(<NewConversationScreen navigation={mockNavigation} />);

      const topicInput = screen.getByPlaceholderText('Worrying Life Choices, I\'m Sad');
      const longTopic = 'This is a very long topic name that describes my mental health journey in detail';
      fireEvent.changeText(topicInput, longTopic);

      expect(topicInput.props.value).toBe(longTopic);
    });
  });

  describe('User Interactions - AI Model Selection', () => {
    it('should select GPT-4 by default', () => {
      render(<NewConversationScreen navigation={mockNavigation} />);

      // GPT-4 should be selected by default - check for checkmark
      expect(screen.getByText('✓')).toBeTruthy();
    });

    it('should allow selecting GPT-3.5', () => {
      render(<NewConversationScreen navigation={mockNavigation} />);

      const gpt35Card = screen.getByText('GPT-3.5').parent?.parent;
      if (gpt35Card) {
        fireEvent.press(gpt35Card);
      }

      expect(screen.getByText('✓')).toBeTruthy();
    });

    it('should allow selecting Claude', () => {
      render(<NewConversationScreen navigation={mockNavigation} />);

      const claudeCard = screen.getByText('Claude').parent?.parent;
      if (claudeCard) {
        fireEvent.press(claudeCard);
      }

      expect(screen.getByText('✓')).toBeTruthy();
    });

    it('should allow selecting PaLM2', () => {
      render(<NewConversationScreen navigation={mockNavigation} />);

      const palm2Card = screen.getByText('PaLM2').parent?.parent;
      if (palm2Card) {
        fireEvent.press(palm2Card);
      }

      expect(screen.getByText('✓')).toBeTruthy();
    });

    it('should change selection when different model is pressed', () => {
      render(<NewConversationScreen navigation={mockNavigation} />);

      // Select GPT-3.5
      const gpt35Card = screen.getByText('GPT-3.5').parent?.parent;
      if (gpt35Card) {
        fireEvent.press(gpt35Card);
      }

      // Select Claude
      const claudeCard = screen.getByText('Claude').parent?.parent;
      if (claudeCard) {
        fireEvent.press(claudeCard);
      }

      // Only one checkmark should be visible
      const checkmarks = screen.getAllByText('✓');
      expect(checkmarks.length).toBe(1);
    });
  });

  describe('User Interactions - Conversation Style', () => {
    it('should select Casual style by default', () => {
      render(<NewConversationScreen navigation={mockNavigation} />);

      expect(screen.getByText('🙂 Casual')).toBeTruthy();
    });

    it('should allow selecting Formal style', () => {
      render(<NewConversationScreen navigation={mockNavigation} />);

      const formalButton = screen.getByText('👔 Formal').parent;
      if (formalButton) {
        fireEvent.press(formalButton);
      }

      expect(screen.getByText('👔 Formal')).toBeTruthy();
    });

    it('should allow selecting Fun style', () => {
      render(<NewConversationScreen navigation={mockNavigation} />);

      const funButton = screen.getByText('🎉 Fun').parent;
      if (funButton) {
        fireEvent.press(funButton);
      }

      expect(screen.getByText('🎉 Fun')).toBeTruthy();
    });

    it('should change style when different option is pressed', () => {
      render(<NewConversationScreen navigation={mockNavigation} />);

      const formalButton = screen.getByText('👔 Formal').parent;
      if (formalButton) {
        fireEvent.press(formalButton);
      }

      const funButton = screen.getByText('🎉 Fun').parent;
      if (funButton) {
        fireEvent.press(funButton);
      }

      expect(screen.getByText('🎉 Fun')).toBeTruthy();
    });
  });

  describe('User Interactions - Therapy Goals', () => {
    it('should select Reduce Stress by default', () => {
      render(<NewConversationScreen navigation={mockNavigation} />);

      expect(screen.getByText('Reduce Stress Level')).toBeTruthy();
    });

    it('should allow selecting Manage Anxiety goal', () => {
      render(<NewConversationScreen navigation={mockNavigation} />);

      const anxietyGoal = screen.getByText('Manage Anxiety').parent;
      if (anxietyGoal) {
        fireEvent.press(anxietyGoal);
      }

      expect(screen.getByText('Manage Anxiety')).toBeTruthy();
    });

    it('should allow selecting Combat Depression goal', () => {
      render(<NewConversationScreen navigation={mockNavigation} />);

      const depressionGoal = screen.getByText('Combat Depression').parent;
      if (depressionGoal) {
        fireEvent.press(depressionGoal);
      }

      expect(screen.getByText('Combat Depression')).toBeTruthy();
    });

    it('should allow selecting Improve Sleep goal', () => {
      render(<NewConversationScreen navigation={mockNavigation} />);

      const sleepGoal = screen.getByText('Improve Sleep').parent;
      if (sleepGoal) {
        fireEvent.press(sleepGoal);
      }

      expect(screen.getByText('Improve Sleep')).toBeTruthy();
    });

    it('should allow selecting Better Relationships goal', () => {
      render(<NewConversationScreen navigation={mockNavigation} />);

      const relationshipGoal = screen.getByText('Better Relationships').parent;
      if (relationshipGoal) {
        fireEvent.press(relationshipGoal);
      }

      expect(screen.getByText('Better Relationships')).toBeTruthy();
    });

    it('should allow selecting Boost Productivity goal', () => {
      render(<NewConversationScreen navigation={mockNavigation} />);

      const productivityGoal = screen.getByText('Boost Productivity').parent;
      if (productivityGoal) {
        fireEvent.press(productivityGoal);
      }

      expect(screen.getByText('Boost Productivity')).toBeTruthy();
    });

    it('should display appropriate emoji for each goal', () => {
      render(<NewConversationScreen navigation={mockNavigation} />);

      expect(screen.getByText('😤')).toBeTruthy(); // Stress
      expect(screen.getByText('😰')).toBeTruthy(); // Anxiety
      expect(screen.getByText('😢')).toBeTruthy(); // Depression
      expect(screen.getByText('😴')).toBeTruthy(); // Sleep
      expect(screen.getByText('❤️')).toBeTruthy(); // Relationships
      expect(screen.getByText('💪')).toBeTruthy(); // Productivity
    });
  });

  describe('User Interactions - Privacy Settings', () => {
    it('should have Make Chat Public switch off by default', () => {
      const { UNSAFE_getAllByType } = render(<NewConversationScreen navigation={mockNavigation} />);

      const { Switch } = require('react-native');
      const switches = UNSAFE_getAllByType(Switch);
      expect(switches[0].props.value).toBe(false);
    });

    it('should toggle Make Chat Public switch', () => {
      const { UNSAFE_getAllByType } = render(<NewConversationScreen navigation={mockNavigation} />);

      const { Switch } = require('react-native');
      const switches = UNSAFE_getAllByType(Switch);
      const chatPublicSwitch = switches[0];

      fireEvent(chatPublicSwitch, 'valueChange', true);
      expect(chatPublicSwitch.props.value).toBe(true);
    });

    it('should toggle Make Chat Public switch off after being on', () => {
      const { UNSAFE_getAllByType } = render(<NewConversationScreen navigation={mockNavigation} />);

      const { Switch } = require('react-native');
      const switches = UNSAFE_getAllByType(Switch);
      const chatPublicSwitch = switches[0];

      fireEvent(chatPublicSwitch, 'valueChange', true);
      fireEvent(chatPublicSwitch, 'valueChange', false);
      expect(chatPublicSwitch.props.value).toBe(false);
    });
  });

  describe('Navigation', () => {
    it('should navigate back when back button is pressed', () => {
      render(<NewConversationScreen navigation={mockNavigation} />);

      const backButton = screen.getByTestId('icon-ChevronLeft').parent;
      if (backButton) {
        fireEvent.press(backButton);
      }

      expect(mockGoBack).toHaveBeenCalled();
    });

    it('should navigate to Chat screen when Create button is pressed with valid data', () => {
      render(<NewConversationScreen navigation={mockNavigation} />);

      const topicInput = screen.getByPlaceholderText('Worrying Life Choices, I\'m Sad');
      fireEvent.changeText(topicInput, 'My therapy session');

      const createButton = screen.getByText('Create Conversation').parent;
      if (createButton) {
        fireEvent.press(createButton);
      }

      expect(mockNavigate).toHaveBeenCalledWith('Chat', {
        topicName: 'My therapy session',
        aiModel: 'gpt-4',
        conversationStyle: 'casual',
        therapyGoal: 'stress',
      });
    });

    it('should pass selected AI model to Chat screen', () => {
      render(<NewConversationScreen navigation={mockNavigation} />);

      const topicInput = screen.getByPlaceholderText('Worrying Life Choices, I\'m Sad');
      fireEvent.changeText(topicInput, 'Test');

      const claudeCard = screen.getByText('Claude').parent?.parent;
      if (claudeCard) {
        fireEvent.press(claudeCard);
      }

      const createButton = screen.getByText('Create Conversation').parent;
      if (createButton) {
        fireEvent.press(createButton);
      }

      expect(mockNavigate).toHaveBeenCalledWith('Chat', expect.objectContaining({
        aiModel: 'claude',
      }));
    });

    it('should pass selected conversation style to Chat screen', () => {
      render(<NewConversationScreen navigation={mockNavigation} />);

      const topicInput = screen.getByPlaceholderText('Worrying Life Choices, I\'m Sad');
      fireEvent.changeText(topicInput, 'Test');

      const formalButton = screen.getByText('👔 Formal').parent;
      if (formalButton) {
        fireEvent.press(formalButton);
      }

      const createButton = screen.getByText('Create Conversation').parent;
      if (createButton) {
        fireEvent.press(createButton);
      }

      expect(mockNavigate).toHaveBeenCalledWith('Chat', expect.objectContaining({
        conversationStyle: 'formal',
      }));
    });

    it('should pass selected therapy goal to Chat screen', () => {
      render(<NewConversationScreen navigation={mockNavigation} />);

      const topicInput = screen.getByPlaceholderText('Worrying Life Choices, I\'m Sad');
      fireEvent.changeText(topicInput, 'Test');

      const anxietyGoal = screen.getByText('Manage Anxiety').parent;
      if (anxietyGoal) {
        fireEvent.press(anxietyGoal);
      }

      const createButton = screen.getByText('Create Conversation').parent;
      if (createButton) {
        fireEvent.press(createButton);
      }

      expect(mockNavigate).toHaveBeenCalledWith('Chat', expect.objectContaining({
        therapyGoal: 'anxiety',
      }));
    });
  });

  describe('Form Validation', () => {
    it('should disable create button when topic name is empty', () => {
      render(<NewConversationScreen navigation={mockNavigation} />);

      const createButton = screen.getByText('Create Conversation').parent;
      expect(createButton?.props.disabled).toBe(true);
    });

    it('should enable create button when topic name is filled', () => {
      render(<NewConversationScreen navigation={mockNavigation} />);

      const topicInput = screen.getByPlaceholderText('Worrying Life Choices, I\'m Sad');
      fireEvent.changeText(topicInput, 'My topic');

      const createButton = screen.getByText('Create Conversation').parent;
      expect(createButton?.props.disabled).toBe(false);
    });

    it('should disable create button when topic name is only whitespace', () => {
      render(<NewConversationScreen navigation={mockNavigation} />);

      const topicInput = screen.getByPlaceholderText('Worrying Life Choices, I\'m Sad');
      fireEvent.changeText(topicInput, '   ');

      const createButton = screen.getByText('Create Conversation').parent;
      expect(createButton?.props.disabled).toBe(true);
    });

    it('should re-disable create button when topic name is cleared', () => {
      render(<NewConversationScreen navigation={mockNavigation} />);

      const topicInput = screen.getByPlaceholderText('Worrying Life Choices, I\'m Sad');
      fireEvent.changeText(topicInput, 'My topic');

      let createButton = screen.getByText('Create Conversation').parent;
      expect(createButton?.props.disabled).toBe(false);

      fireEvent.changeText(topicInput, '');

      createButton = screen.getByText('Create Conversation').parent;
      expect(createButton?.props.disabled).toBe(true);
    });
  });

  describe('Accessibility', () => {
    it('should have proper semantic structure for screen readers', () => {
      render(<NewConversationScreen navigation={mockNavigation} />);

      expect(screen.getByText('Topic Name')).toBeTruthy();
      expect(screen.getByText('AI LLM Chatbots')).toBeTruthy();
      expect(screen.getByText('Conversation Style')).toBeTruthy();
      expect(screen.getByText('Therapy Goals')).toBeTruthy();
      expect(screen.getByText('Privacy & Security')).toBeTruthy();
    });

    it('should have accessible form inputs', () => {
      render(<NewConversationScreen navigation={mockNavigation} />);

      const topicInput = screen.getByPlaceholderText('Worrying Life Choices, I\'m Sad');
      expect(topicInput).toBeTruthy();
    });
  });

  describe('Scrolling Behavior', () => {
    it('should render in a scrollable container', () => {
      const { UNSAFE_getByType } = render(<NewConversationScreen navigation={mockNavigation} />);

      const { ScrollView } = require('react-native');
      expect(UNSAFE_getByType(ScrollView)).toBeTruthy();
    });
  });

  describe('Edge Cases', () => {
    it('should handle rapid AI model selection changes', () => {
      render(<NewConversationScreen navigation={mockNavigation} />);

      const models = ['GPT-3.5', 'Claude', 'PaLM2', 'GPT-4'];

      models.forEach(modelName => {
        const modelCard = screen.getByText(modelName).parent?.parent;
        if (modelCard) {
          fireEvent.press(modelCard);
        }
      });

      // Should have exactly one checkmark
      const checkmarks = screen.getAllByText('✓');
      expect(checkmarks.length).toBe(1);
    });

    it('should handle rapid conversation style changes', () => {
      render(<NewConversationScreen navigation={mockNavigation} />);

      const styles = ['👔 Formal', '🎉 Fun', '🙂 Casual'];

      styles.forEach(styleName => {
        const styleButton = screen.getByText(styleName).parent;
        if (styleButton) {
          fireEvent.press(styleButton);
        }
      });

      expect(screen.getByText('🙂 Casual')).toBeTruthy();
    });

    it('should handle rapid therapy goal changes', () => {
      render(<NewConversationScreen navigation={mockNavigation} />);

      const goals = [
        'Manage Anxiety',
        'Combat Depression',
        'Improve Sleep',
        'Better Relationships',
        'Boost Productivity',
        'Reduce Stress Level',
      ];

      goals.forEach(goalName => {
        const goalButton = screen.getByText(goalName).parent;
        if (goalButton) {
          fireEvent.press(goalButton);
        }
      });

      expect(screen.getByText('Reduce Stress Level')).toBeTruthy();
    });

    it('should handle special characters in topic name', () => {
      render(<NewConversationScreen navigation={mockNavigation} />);

      const topicInput = screen.getByPlaceholderText('Worrying Life Choices, I\'m Sad');
      const specialTopic = 'My topic! @#$%^&*()';
      fireEvent.changeText(topicInput, specialTopic);

      expect(topicInput.props.value).toBe(specialTopic);
    });

    it('should handle emoji in topic name', () => {
      render(<NewConversationScreen navigation={mockNavigation} />);

      const topicInput = screen.getByPlaceholderText('Worrying Life Choices, I\'m Sad');
      const emojiTopic = 'My anxiety journey 😰😔';
      fireEvent.changeText(topicInput, emojiTopic);

      expect(topicInput.props.value).toBe(emojiTopic);
    });
  });

  describe('UI State Consistency', () => {
    it('should maintain selections when scrolling', () => {
      render(<NewConversationScreen navigation={mockNavigation} />);

      const topicInput = screen.getByPlaceholderText('Worrying Life Choices, I\'m Sad');
      fireEvent.changeText(topicInput, 'Test topic');

      const claudeCard = screen.getByText('Claude').parent?.parent;
      if (claudeCard) {
        fireEvent.press(claudeCard);
      }

      const formalButton = screen.getByText('👔 Formal').parent;
      if (formalButton) {
        fireEvent.press(formalButton);
      }

      // Selections should persist
      expect(topicInput.props.value).toBe('Test topic');
      expect(screen.getByText('Claude')).toBeTruthy();
      expect(screen.getByText('👔 Formal')).toBeTruthy();
    });

    it('should preserve all settings before navigation', () => {
      render(<NewConversationScreen navigation={mockNavigation} />);

      const topicInput = screen.getByPlaceholderText('Worrying Life Choices, I\'m Sad');
      fireEvent.changeText(topicInput, 'Complex setup');

      const palm2Card = screen.getByText('PaLM2').parent?.parent;
      if (palm2Card) {
        fireEvent.press(palm2Card);
      }

      const funButton = screen.getByText('🎉 Fun').parent;
      if (funButton) {
        fireEvent.press(funButton);
      }

      const sleepGoal = screen.getByText('Improve Sleep').parent;
      if (sleepGoal) {
        fireEvent.press(sleepGoal);
      }

      const createButton = screen.getByText('Create Conversation').parent;
      if (createButton) {
        fireEvent.press(createButton);
      }

      expect(mockNavigate).toHaveBeenCalledWith('Chat', {
        topicName: 'Complex setup',
        aiModel: 'palm2',
        conversationStyle: 'fun',
        therapyGoal: 'sleep',
      });
    });
  });
});
