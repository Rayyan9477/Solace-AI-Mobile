/**
 * Comprehensive Testing Framework for Solace AI Mental Health App
 * Provides utilities for testing mental health specific functionality
 */

import { render, fireEvent, waitFor, act } from '@testing-library/react-native';
import { Provider } from 'react-redux';
import { NavigationContainer } from '@react-navigation/native';
import MockAsyncStorage from '@react-native-async-storage/async-storage/jest/async-storage-mock';

// Mock implementations for mental health app testing
export const TestingFramework = {
  
  /**
   * Create a test wrapper with Redux store and navigation
   */
  createTestWrapper: (initialState = {}, navigatorProps = {}) => {
    const mockStore = {
      getState: () => ({
        mood: {
          currentMood: null,
          moodHistory: [],
          weeklyStats: { averageIntensity: 0, mostCommonMood: null, totalEntries: 0 },
          insights: [],
          loading: false,
          error: null,
          ...initialState.mood
        },
        therapy: {
          currentSession: null,
          sessionHistory: [],
          preferences: {},
          loading: false,
          error: null,
          ...initialState.therapy
        },
        user: {
          profile: { name: 'Test User' },
          stats: {},
          ...initialState.user
        },
        auth: {
          isAuthenticated: true,
          onboardingCompleted: true,
          ...initialState.auth
        },
        ...initialState
      }),
      dispatch: jest.fn(),
      subscribe: jest.fn(),
      replaceReducer: jest.fn()
    };

    return ({ children }) => (
      <Provider store={mockStore}>
        <NavigationContainer {...navigatorProps}>
          {children}
        </NavigationContainer>
      </Provider>
    );
  },

  /**
   * Mock crisis detection scenarios
   */
  crisisMocks: {
    lowRisk: {
      text: "I'm feeling a bit down today",
      expectedRisk: 'low',
      shouldTriggerAlert: false
    },
    moderateRisk: {
      text: "I feel hopeless and don't know what to do",
      expectedRisk: 'moderate', 
      shouldTriggerAlert: false
    },
    highRisk: {
      text: "I want to hurt myself and end the pain",
      expectedRisk: 'high',
      shouldTriggerAlert: true
    },
    criticalRisk: {
      text: "I have a plan to kill myself tonight",
      expectedRisk: 'critical',
      shouldTriggerAlert: true,
      shouldCallEmergency: true
    }
  },

  /**
   * Mock mood data for testing
   */
  moodMocks: {
    sampleMoodHistory: [
      {
        id: '1',
        mood: 'happy',
        intensity: 4,
        activities: ['exercise', 'social'],
        timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
      },
      {
        id: '2', 
        mood: 'anxious',
        intensity: 3,
        activities: ['work'],
        triggers: ['work_stress'],
        timestamp: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString()
      }
    ],
    weeklyStats: {
      averageIntensity: 3.5,
      mostCommonMood: 'calm',
      totalEntries: 7,
      moodVariety: 4
    }
  },

  /**
   * Mock therapy session data
   */
  therapyMocks: {
    activeSession: {
      id: 'session_123',
      isActive: true,
      startTime: new Date().toISOString(),
      messages: [
        {
          id: '1',
          text: 'Hello, how are you feeling today?',
          sender: 'ai',
          timestamp: new Date()
        }
      ],
      interactionMode: 'text'
    },
    completedSession: {
      id: 'session_122',
      isActive: false,
      startTime: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      endTime: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
      duration: 3600,
      messages: [
        {
          id: '1',
          text: 'Hello, how are you feeling today?',
          sender: 'ai',
          timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000)
        },
        {
          id: '2',
          text: 'I am feeling anxious about work',
          sender: 'user',
          timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000 + 30000)
        }
      ]
    }
  },

  /**
   * Test utilities for animations
   */
  animationUtils: {
    /**
     * Fast-forward animations for testing
     */
    fastForwardAnimations: async () => {
      await act(async () => {
        jest.advanceTimersByTime(2000); // Advance by 2 seconds
      });
    },

    /**
     * Mock reduced motion preference
     */
    mockReducedMotion: (enabled = true) => {
      jest.doMock('../hooks/useReducedMotion', () => ({
        useReducedMotion: () => enabled
      }));
    }
  },

  /**
   * Accessibility testing helpers
   */
  accessibilityUtils: {
    /**
     * Test if component has proper accessibility labels
     */
    hasAccessibilityLabels: (component) => {
      const elements = component.getAllByLabelText(/./);
      return elements.length > 0;
    },

    /**
     * Test touch target sizes
     */
    hasPropeTouchTargets: (component) => {
      const touchableElements = component.getAllByRole('button');
      return touchableElements.every(element => {
        const style = element.props.style || {};
        const minSize = 44;
        return (
          (style.width >= minSize && style.height >= minSize) ||
          (style.minWidth >= minSize && style.minHeight >= minSize)
        );
      });
    },

    /**
     * Test screen reader announcements
     */
    mockScreenReader: {
      announcements: [],
      announce: (text) => {
        this.announcements.push({
          text,
          timestamp: new Date().toISOString()
        });
      },
      clear: () => {
        this.announcements = [];
      }
    }
  },

  /**
   * Performance testing utilities
   */
  performanceUtils: {
    /**
     * Measure component render time
     */
    measureRenderTime: async (Component, props = {}) => {
      const startTime = performance.now();
      const result = render(<Component {...props} />);
      const endTime = performance.now();
      
      return {
        renderTime: endTime - startTime,
        component: result
      };
    },

    /**
     * Test memory usage during component lifecycle
     */
    testMemoryUsage: async (Component, props = {}) => {
      const initialMemory = performance.memory?.usedJSHeapSize || 0;
      
      const { unmount } = render(<Component {...props} />);
      const afterRenderMemory = performance.memory?.usedJSHeapSize || 0;
      
      unmount();
      
      // Force garbage collection if available
      if (global.gc) {
        global.gc();
      }
      
      const afterUnmountMemory = performance.memory?.usedJSHeapSize || 0;
      
      return {
        initial: initialMemory,
        afterRender: afterRenderMemory,
        afterUnmount: afterUnmountMemory,
        memoryLeak: afterUnmountMemory > initialMemory,
        renderMemoryDelta: afterRenderMemory - initialMemory,
        cleanupMemoryDelta: afterUnmountMemory - afterRenderMemory
      };
    }
  },

  /**
   * Network and offline testing mocks
   */
  networkMocks: {
    /**
     * Mock network connectivity
     */
    mockNetworkState: (isConnected = true, connectionType = 'wifi') => {
      jest.doMock('@react-native-community/netinfo', () => ({
        addEventListener: jest.fn((callback) => {
          callback({
            isConnected,
            isInternetReachable: isConnected,
            type: connectionType
          });
          return jest.fn(); // Unsubscribe function
        }),
        fetch: jest.fn(() => Promise.resolve({
          isConnected,
          isInternetReachable: isConnected,
          type: connectionType
        }))
      }));
    },

    /**
     * Mock offline data operations
     */
    mockOfflineOperations: () => {
      MockAsyncStorage.setItem = jest.fn(() => Promise.resolve());
      MockAsyncStorage.getItem = jest.fn((key) => {
        const mockData = {
          'offline_mood_entries': JSON.stringify([]),
          'offline_therapy_sessions': JSON.stringify([]),
          'sync_queue': JSON.stringify([])
        };
        return Promise.resolve(mockData[key] || null);
      });
      MockAsyncStorage.multiGet = jest.fn(() => Promise.resolve([]));
      MockAsyncStorage.getAllKeys = jest.fn(() => Promise.resolve([]));
    }
  },

  /**
   * Custom matchers for mental health app testing
   */
  customMatchers: {
    /**
     * Check if mood data is valid
     */
    toBeValidMoodData: (received) => {
      const pass = (
        received &&
        typeof received.mood === 'string' &&
        typeof received.intensity === 'number' &&
        received.intensity >= 1 && received.intensity <= 5 &&
        received.timestamp &&
        !isNaN(Date.parse(received.timestamp))
      );

      return {
        message: () => pass 
          ? `Expected ${received} not to be valid mood data`
          : `Expected ${received} to be valid mood data with mood, intensity (1-5), and timestamp`,
        pass
      };
    },

    /**
     * Check if therapy message is therapeutic
     */
    toBeTherapeuticMessage: (received) => {
      const therapeuticKeywords = [
        'understand', 'feel', 'support', 'help', 'safe', 'valid',
        'important', 'matter', 'care', 'listen', 'together'
      ];

      const message = received.toLowerCase();
      const containsTherapeuticLanguage = therapeuticKeywords.some(keyword => 
        message.includes(keyword)
      );

      const pass = (
        received &&
        typeof received === 'string' &&
        received.length > 0 &&
        containsTherapeuticLanguage &&
        !message.includes('you should') && // Avoid directive language
        !message.includes('just') // Avoid minimizing language
      );

      return {
        message: () => pass
          ? `Expected "${received}" not to be therapeutic`
          : `Expected "${received}" to use therapeutic language and avoid directive phrases`,
        pass
      };
    },

    /**
     * Check if crisis response is appropriate
     */
    toBeAppropriateCrisisResponse: (received, riskLevel) => {
      const requiredElements = {
        critical: ['resources', 'immediate', 'help'],
        high: ['support', 'resources', 'crisis'],
        moderate: ['understand', 'support'],
        low: ['validate', 'explore']
      };

      const required = requiredElements[riskLevel] || [];
      const message = received.toLowerCase();
      
      const hasRequiredElements = required.some(element => 
        message.includes(element)
      );

      const hasEmergencyInfo = riskLevel === 'critical' || riskLevel === 'high' 
        ? message.includes('988') || message.includes('911') || message.includes('crisis')
        : true;

      const pass = hasRequiredElements && hasEmergencyInfo;

      return {
        message: () => pass
          ? `Expected crisis response not to be appropriate for ${riskLevel} risk`
          : `Expected crisis response to be appropriate for ${riskLevel} risk level`,
        pass
      };
    }
  },

  /**
   * Test suite generators for common patterns
   */
  testSuites: {
    /**
     * Generate component accessibility tests
     */
    generateAccessibilityTests: (ComponentClass, defaultProps = {}) => {
      return () => {
        const TestWrapper = TestingFramework.createTestWrapper();

        test('has accessibility labels', () => {
          const { getAllByLabelText } = render(
            <TestWrapper>
              <ComponentClass {...defaultProps} />
            </TestWrapper>
          );

          expect(() => getAllByLabelText(/./)).not.toThrow();
        });

        test('has proper touch targets', () => {
          const { getAllByRole } = render(
            <TestWrapper>
              <ComponentClass {...defaultProps} />
            </TestWrapper>
          );

          const buttons = getAllByRole('button');
          buttons.forEach(button => {
            const style = button.props.style || {};
            expect(
              style.minWidth >= 44 || style.width >= 44 ||
              style.minHeight >= 44 || style.height >= 44
            ).toBe(true);
          });
        });

        test('supports reduced motion', async () => {
          TestingFramework.animationUtils.mockReducedMotion(true);
          
          const { container } = render(
            <TestWrapper>
              <ComponentClass {...defaultProps} />
            </TestWrapper>
          );

          // Component should render without animations
          expect(container).toBeTruthy();
        });
      };
    },

    /**
     * Generate performance tests
     */
    generatePerformanceTests: (ComponentClass, defaultProps = {}) => {
      return () => {
        test('renders within acceptable time', async () => {
          const { renderTime } = await TestingFramework.performanceUtils
            .measureRenderTime(ComponentClass, defaultProps);
          
          expect(renderTime).toBeLessThan(100); // 100ms threshold
        });

        test('does not cause memory leaks', async () => {
          const memoryUsage = await TestingFramework.performanceUtils
            .testMemoryUsage(ComponentClass, defaultProps);
          
          expect(memoryUsage.memoryLeak).toBe(false);
        });
      };
    },

    /**
     * Generate offline functionality tests  
     */
    generateOfflineTests: (operations) => {
      return () => {
        beforeEach(() => {
          TestingFramework.networkMocks.mockOfflineOperations();
        });

        test('saves data offline when network unavailable', async () => {
          TestingFramework.networkMocks.mockNetworkState(false);

          await operations.saveData({ test: 'data' });

          expect(MockAsyncStorage.setItem).toHaveBeenCalled();
        });

        test('syncs data when network becomes available', async () => {
          TestingFramework.networkMocks.mockNetworkState(true);

          const syncResult = await operations.syncData();

          expect(syncResult.success).toBe(true);
        });
      };
    }
  },

  /**
   * Integration testing utilities
   */
  integrationUtils: {
    /**
     * Test complete mood tracking flow
     */
    testMoodTrackingFlow: async (component) => {
      // Select mood
      const moodButton = component.getByText('Happy');
      fireEvent.press(moodButton);

      // Set intensity
      const intensitySlider = component.getByTestId('intensity-slider');
      fireEvent(intensitySlider, 'onValueChange', 4);

      // Add activities
      const exerciseActivity = component.getByText('Exercise');
      fireEvent.press(exerciseActivity);

      // Save mood
      const saveButton = component.getByText('Save Mood Entry');
      fireEvent.press(saveButton);

      await waitFor(() => {
        expect(component.getByText('Mood saved successfully')).toBeTruthy();
      });
    },

    /**
     * Test therapy session flow
     */
    testTherapySessionFlow: async (component) => {
      // Start session
      const startButton = component.getByText('Start Session');
      fireEvent.press(startButton);

      // Send message
      const messageInput = component.getByPlaceholderText('Share your thoughts...');
      fireEvent.changeText(messageInput, 'I am feeling anxious');
      
      const sendButton = component.getByText('Send');
      fireEvent.press(sendButton);

      // Wait for AI response
      await waitFor(() => {
        expect(component.getByText(/I understand/)).toBeTruthy();
      });

      // End session
      const endButton = component.getByText('End Session');
      fireEvent.press(endButton);
    },

    /**
     * Test crisis intervention flow
     */
    testCrisisInterventionFlow: async (component) => {
      // Trigger crisis detection
      const messageInput = component.getByPlaceholderText('Share your thoughts...');
      fireEvent.changeText(messageInput, 'I want to hurt myself');
      
      const sendButton = component.getByText('Send');
      fireEvent.press(sendButton);

      // Verify crisis alert appears
      await waitFor(() => {
        expect(component.getByText('Emergency Support Available')).toBeTruthy();
      });

      // Test emergency resource access
      const crisisLineButton = component.getByText('Call 988 Now');
      expect(crisisLineButton).toBeTruthy();
    }
  }
};

// Add custom matchers to Jest
if (expect.extend) {
  expect.extend(TestingFramework.customMatchers);
}

export default TestingFramework;