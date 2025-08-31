import * as Haptics from "expo-haptics";
import { useState, useCallback, useMemo, useRef, useEffect } from "react";
import { Platform, Alert } from "react-native";
import { useDispatch, useSelector } from "react-redux";

import {
  startTherapySession,
  endTherapySession,
  addSessionMessage,
  updateSessionProgress,
} from "../store/slices/therapySlice";

/**
 * Advanced Therapy Session Hook
 * Handles comprehensive therapy session management with AI responses
 */
export const useTherapySession = (sessionType = "general") => {
  const dispatch = useDispatch();
  const { currentSession, sessionHistory, preferences, loading, error } =
    useSelector((state) => state.therapy);

  // Local session state
  const [messages, setMessages] = useState([]);
  const [currentExercise, setCurrentExercise] = useState(null);
  const [sessionDuration, setSessionDuration] = useState(0);
  const [isAIResponding, setIsAIResponding] = useState(false);
  const [interactionMode, setInteractionMode] = useState("text"); // text, voice, guided
  const [sessionId] = useState(() => `therapy_${Date.now()}`);

  const sessionTimer = useRef(null);
  const messageQueue = useRef([]);

  // Comprehensive therapy exercises database
  const therapyExercises = useMemo(
    () => ({
      grounding: {
        id: "grounding_5_4_3_2_1",
        title: "5-4-3-2-1 Grounding",
        description: "A mindfulness technique to help you feel present",
        category: "anxiety",
        duration: "5-10 minutes",
        icon: "Mindfulness",
        color: "#60A5FA",
        steps: [
          {
            instruction:
              "Let's try the 5-4-3-2-1 grounding technique. First, name 5 things you can see around you.",
            type: "visual",
            timeout: 60000,
          },
          {
            instruction: "Now, tell me 4 things you can touch or feel.",
            type: "tactile",
            timeout: 45000,
          },
          {
            instruction: "What are 3 things you can hear right now?",
            type: "auditory",
            timeout: 45000,
          },
          {
            instruction: "Can you identify 2 things you can smell?",
            type: "olfactory",
            timeout: 45000,
          },
          {
            instruction: "Finally, name 1 thing you can taste.",
            type: "gustatory",
            timeout: 30000,
          },
        ],
        completion:
          "Excellent work! How do you feel now compared to when we started?",
      },
      breathing: {
        id: "breathing_4_7_8",
        title: "4-7-8 Breathing",
        description:
          "Deep breathing technique to reduce anxiety and promote calm",
        category: "anxiety",
        duration: "3-5 minutes",
        icon: "Heart",
        color: "#10B981",
        steps: [
          {
            instruction:
              "Let's practice 4-7-8 breathing together. First, exhale completely through your mouth.",
            type: "preparation",
            timeout: 15000,
          },
          {
            instruction:
              "Now, inhale quietly through your nose for 4 counts. 1... 2... 3... 4...",
            type: "inhale",
            timeout: 20000,
          },
          {
            instruction:
              "Hold your breath for 7 counts. 1... 2... 3... 4... 5... 6... 7...",
            type: "hold",
            timeout: 25000,
          },
          {
            instruction:
              "Exhale completely through your mouth for 8 counts. 1... 2... 3... 4... 5... 6... 7... 8...",
            type: "exhale",
            timeout: 30000,
          },
          {
            instruction: "Perfect! Let's do that cycle 3 more times. Ready?",
            type: "repeat",
            timeout: 60000,
          },
        ],
        completion: "Wonderful breathing work! Notice how your body feels now.",
      },
      thoughtChallenging: {
        id: "thought_challenging",
        title: "Thought Challenging",
        description: "CBT technique to examine and reframe negative thoughts",
        category: "cognitive",
        duration: "10-15 minutes",
        icon: "Brain",
        color: "#8B5CF6",
        steps: [
          {
            instruction:
              "What's a specific thought that's been bothering you lately? Share it with me.",
            type: "identification",
            timeout: 120000,
          },
          {
            instruction:
              "Thank you for sharing that. What evidence do you have that this thought is absolutely true?",
            type: "evidence_for",
            timeout: 90000,
          },
          {
            instruction:
              "Now, what evidence contradicts this thought? What might suggest it's not entirely accurate?",
            type: "evidence_against",
            timeout: 90000,
          },
          {
            instruction:
              "If your best friend had this exact thought, what would you tell them?",
            type: "friend_perspective",
            timeout: 90000,
          },
          {
            instruction:
              "Based on what we've explored, how could we reframe this thought in a more balanced way?",
            type: "reframing",
            timeout: 120000,
          },
        ],
        completion:
          "Excellent work challenging that thought. You've shown great insight!",
      },
      moodExploration: {
        id: "mood_exploration",
        title: "Mood Check-In & Exploration",
        description: "Deep dive into current emotions and their context",
        category: "emotional",
        duration: "10-20 minutes",
        icon: "Heart",
        color: "#F59E0B",
        steps: [
          {
            instruction:
              "How are you feeling right now, on a scale of 1-10? Please tell me the number and the main emotion.",
            type: "mood_rating",
            timeout: 60000,
          },
          {
            instruction:
              "Thank you. Can you name 2-3 specific emotions you're experiencing? Sometimes we feel multiple things at once.",
            type: "emotion_identification",
            timeout: 90000,
          },
          {
            instruction:
              "Where do you feel these emotions in your body? Are there any physical sensations?",
            type: "body_awareness",
            timeout: 90000,
          },
          {
            instruction:
              "What do you think might have contributed to feeling this way today? Any specific events or thoughts?",
            type: "trigger_exploration",
            timeout: 120000,
          },
          {
            instruction:
              "What would help you feel even just 10% better right now? What small step could we take together?",
            type: "coping_planning",
            timeout: 120000,
          },
        ],
        completion:
          "Thank you for being so open about your feelings. Your emotional awareness is a real strength.",
      },
      progressiveRelaxation: {
        id: "progressive_relaxation",
        title: "Progressive Muscle Relaxation",
        description: "Systematic relaxation technique for stress and tension",
        category: "relaxation",
        duration: "15-20 minutes",
        icon: "Mindfulness",
        color: "#EC4899",
        steps: [
          {
            instruction:
              "Let's do progressive muscle relaxation. First, find a comfortable position and close your eyes if that feels safe.",
            type: "preparation",
            timeout: 30000,
          },
          {
            instruction:
              "Start with your toes. Tense them tightly for 5 seconds... hold it... and now release. Notice the contrast.",
            type: "feet",
            timeout: 45000,
          },
          {
            instruction:
              "Now your calves and legs. Tense them up... hold for 5 seconds... and release. Feel the relaxation.",
            type: "legs",
            timeout: 45000,
          },
          {
            instruction:
              "Move to your abdomen and chest. Tense these muscles... hold... and let go. Breathe naturally.",
            type: "core",
            timeout: 45000,
          },
          {
            instruction:
              "Now your hands and arms. Make fists and tense your arms... hold it... and release completely.",
            type: "arms",
            timeout: 45000,
          },
          {
            instruction:
              "Finally, your shoulders, neck, and face. Scrunch everything up... hold... and let it all go.",
            type: "head",
            timeout: 45000,
          },
          {
            instruction:
              "Take a moment to notice your whole body. How does this relaxed state feel different from when we started?",
            type: "integration",
            timeout: 60000,
          },
        ],
        completion:
          "Beautiful work with the relaxation. You can return to this technique anytime you need it.",
      },
    }),
    [],
  );

  // AI Response Generation System
  const generateAIResponse = useCallback(
    (userInput, context = {}) => {
      const input = userInput.toLowerCase();

      // Crisis Detection with Immediate Response
      const crisisKeywords = [
        "harm",
        "suicide",
        "kill",
        "end it",
        "die",
        "hurt myself",
        "not worth",
        "give up",
      ];
      if (crisisKeywords.some((keyword) => input.includes(keyword))) {
        return {
          text: "I'm very concerned about what you're sharing with me. You matter, and your life has value. If you're having thoughts of hurting yourself, please reach out for immediate help:\n\n• National Suicide Prevention Lifeline: Call or text 988\n• Crisis Text Line: Text HOME to 741741\n• Emergency Services: Call 911\n\nYou don't have to go through this alone. There are people who want to help you.",
          urgent: true,
          type: "crisis",
          suggestions: [
            "I need immediate help",
            "I'm safe for now",
            "Tell me about other resources",
          ],
        };
      }

      // Exercise-specific responses
      if (currentExercise && context.exerciseStep !== undefined) {
        const exercise =
          therapyExercises[
            Object.keys(therapyExercises).find(
              (key) => therapyExercises[key].id === currentExercise,
            )
          ];

        if (exercise && context.exerciseStep < exercise.steps.length - 1) {
          const nextStep = exercise.steps[context.exerciseStep + 1];
          return {
            text: nextStep.instruction,
            type: "exercise_step",
            exerciseStep: context.exerciseStep + 1,
            stepType: nextStep.type,
            timeout: nextStep.timeout,
          };
        } else if (exercise) {
          return {
            text: exercise.completion,
            type: "exercise_complete",
            suggestions: [
              "That was helpful",
              "I'd like to try another exercise",
              "Let's talk about something else",
            ],
          };
        }
      }

      // Contextual therapeutic responses based on emotions and keywords
      const responses = {
        anxiety: {
          keywords: [
            "anxious",
            "anxiety",
            "worried",
            "nervous",
            "panic",
            "scared",
            "fear",
          ],
          responses: [
            "I hear that you're feeling anxious. That's a completely valid response to what you're experiencing. Anxiety often signals that something important to us feels uncertain or threatened. Would you like to explore what might be contributing to these feelings, or would you prefer to try a grounding technique that can help in this moment?",
            "Thank you for sharing that you're feeling anxious. Your feelings are important and deserve attention. Sometimes anxiety can feel overwhelming, but there are ways to work with it. What would feel most helpful right now - talking through what's causing the anxiety, or trying a breathing exercise together?",
            "Anxiety can be really challenging to deal with, and I appreciate you being open about it. Sometimes our minds try to protect us by worrying about things, but it can become exhausting. What's been the hardest part about the anxiety you're experiencing?",
          ],
          suggestions: [
            "Let's try a grounding exercise",
            "I want to talk about what's causing it",
            "What helps with anxiety?",
          ],
        },
        depression: {
          keywords: [
            "sad",
            "depressed",
            "down",
            "hopeless",
            "empty",
            "numb",
            "worthless",
          ],
          responses: [
            "I hear the pain in what you're sharing, and I want you to know that your feelings are completely valid. Depression can make everything feel heavy and difficult, but you're not alone in this. It takes real courage to reach out and share these feelings. What has this been like for you lately?",
            "Thank you for trusting me with these difficult feelings. When we're feeling down, it can sometimes feel like things will never get better, but that's the depression talking, not reality. You matter, and these feelings, while painful, are temporary. What's been weighing on you most heavily?",
            "Sadness and depression can feel so isolating, but by sharing with me, you're already taking a step toward connection. These feelings are real and important, and they deserve attention and care. What would feel most supportive for you right now?",
          ],
          suggestions: [
            "I feel hopeless",
            "Nothing seems to help",
            "I want to feel better",
          ],
        },
        stress: {
          keywords: [
            "stressed",
            "overwhelmed",
            "pressure",
            "too much",
            "exhausted",
            "burnt out",
          ],
          responses: [
            "It sounds like you're carrying a lot right now. Feeling overwhelmed is our mind's way of telling us that there's more on our plate than feels manageable. That's a very human response. What's been contributing most to this feeling of being overwhelmed?",
            "Stress can feel so consuming, especially when it feels like everything is hitting at once. Your nervous system is responding to what it perceives as demands, and that's actually a normal protective response. Let's see if we can break down what's feeling most overwhelming right now.",
            "When we're stressed, sometimes it can feel like we're spinning our wheels without making progress. That feeling of 'too much' is exhausting. What if we looked at this together and see what feels most urgent versus what might be able to wait?",
          ],
          suggestions: [
            "Everything feels urgent",
            "I can't keep up",
            "Help me prioritize",
          ],
        },
        anger: {
          keywords: [
            "angry",
            "mad",
            "furious",
            "irritated",
            "frustrated",
            "rage",
          ],
          responses: [
            "Anger is a valid emotion that often signals something important to us has been hurt, threatened, or violated. It's okay to feel angry - the question is what we do with that anger. What's been triggering these feelings for you?",
            "I can hear the frustration and anger in what you're sharing. Sometimes anger is easier to feel than other emotions like hurt or disappointment that might be underneath. What do you think your anger might be trying to tell you?",
            "Feeling angry can be really intense and sometimes overwhelming. It's one of our most natural emotions, often arising when we feel something unfair has happened or our boundaries have been crossed. What's been making you feel this way?",
          ],
          suggestions: [
            "Someone hurt me",
            "Things aren't fair",
            "I can't control my anger",
          ],
        },
      };

      // Find matching response category
      for (const [category, data] of Object.entries(responses)) {
        if (data.keywords.some((keyword) => input.includes(keyword))) {
          const randomResponse =
            data.responses[Math.floor(Math.random() * data.responses.length)];
          return {
            text: randomResponse,
            type: "therapeutic_response",
            category,
            suggestions: data.suggestions,
          };
        }
      }

      // General supportive responses
      const generalResponses = [
        "Thank you for sharing that with me. I can hear that this is important to you. Can you tell me more about how this is affecting you day to day?",
        "I appreciate you opening up. It's not always easy to put our feelings into words, but you're doing important work here. What feels most significant about what you just shared?",
        "What you're describing sounds really meaningful. I'm here to listen and support you through this. How long have you been experiencing this?",
        "I hear what you're saying, and I want you to know that your feelings and experiences matter. What's been the most challenging part of this for you?",
      ];

      const randomGeneral =
        generalResponses[Math.floor(Math.random() * generalResponses.length)];

      return {
        text: randomGeneral,
        type: "general_support",
        suggestions: [
          "Tell me more",
          "I need coping strategies",
          "How can I feel better?",
        ],
      };
    },
    [currentExercise, therapyExercises],
  );

  // Send message with AI response
  const sendMessage = useCallback(
    async (messageText, messageType = "text") => {
      if (!messageText.trim() || isAIResponding) return;

      const userMessage = {
        id: Date.now().toString(),
        text: messageText.trim(),
        sender: "user",
        timestamp: new Date(),
        type: messageType,
      };

      setMessages((prev) => [...prev, userMessage]);
      setIsAIResponding(true);

      // Haptic feedback
      if (Platform.OS === "ios") {
        await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      }

      // Simulate AI processing time
      const processingTime = 1500 + Math.random() * 1000;

      setTimeout(() => {
        const context = currentExercise
          ? {
              exerciseStep: messages.filter((m) => m.type === "exercise_step")
                .length,
            }
          : {};

        const aiResponse = generateAIResponse(messageText, context);

        const aiMessage = {
          id: (Date.now() + 1).toString(),
          text: aiResponse.text,
          sender: "ai",
          timestamp: new Date(),
          suggestions: aiResponse.suggestions,
          urgent: aiResponse.urgent,
          type: aiResponse.type,
          category: aiResponse.category,
        };

        setMessages((prev) => [...prev, aiMessage]);
        setIsAIResponding(false);

        // Update exercise state
        if (aiResponse.type === "exercise_complete") {
          setCurrentExercise(null);
        }

        // Store message in Redux
        dispatch(addSessionMessage({ sessionId, message: userMessage }));
        dispatch(addSessionMessage({ sessionId, message: aiMessage }));
      }, processingTime);
    },
    [
      isAIResponding,
      currentExercise,
      messages,
      generateAIResponse,
      dispatch,
      sessionId,
    ],
  );

  // Start guided exercise
  const startExercise = useCallback(
    (exerciseKey) => {
      const exercise = therapyExercises[exerciseKey];
      if (!exercise) return;

      setCurrentExercise(exercise.id);

      const exerciseMessage = {
        id: Date.now().toString(),
        text: `Let's begin the ${exercise.title}. ${exercise.steps[0].instruction}`,
        sender: "ai",
        timestamp: new Date(),
        type: "exercise_start",
        exerciseId: exercise.id,
        exerciseStep: 0,
      };

      setMessages((prev) => [...prev, exerciseMessage]);
      dispatch(addSessionMessage({ sessionId, message: exerciseMessage }));
    },
    [therapyExercises, dispatch, sessionId],
  );

  // Start therapy session
  const startSession = useCallback(async () => {
    const sessionData = {
      id: sessionId,
      type: sessionType,
      startTime: new Date().toISOString(),
      messages: [],
    };

    dispatch(startTherapySession(sessionData));

    // Add initial welcome messages
    const welcomeMessages = [
      {
        id: "1",
        text: "Welcome to your personal therapy space. I'm here to provide a safe, judgment-free environment where you can explore your thoughts and feelings.",
        sender: "ai",
        timestamp: new Date(),
        type: "welcome",
      },
      {
        id: "2",
        text: "You can interact with me through text or voice, and I can guide you through specific therapeutic exercises. How would you like to begin today?",
        sender: "ai",
        timestamp: new Date(),
        type: "prompt",
      },
    ];

    setMessages(welcomeMessages);

    // Start session timer
    sessionTimer.current = setInterval(() => {
      setSessionDuration((prev) => prev + 1);
    }, 1000);

    return sessionId;
  }, [sessionId, sessionType, dispatch]);

  // End therapy session
  const endSession = useCallback(async () => {
    if (sessionTimer.current) {
      clearInterval(sessionTimer.current);
    }

    const sessionSummary = {
      sessionId,
      endTime: new Date().toISOString(),
      duration: sessionDuration,
      messageCount: messages.length,
      exercisesCompleted: messages.filter((m) => m.type === "exercise_complete")
        .length,
      crisisDetected: messages.some((m) => m.urgent),
    };

    await dispatch(endTherapySession(sessionSummary));

    // Reset local state
    setMessages([]);
    setCurrentExercise(null);
    setSessionDuration(0);
    setIsAIResponding(false);
  }, [sessionId, sessionDuration, messages, dispatch]);

  // Format session duration
  const formatDuration = useCallback((seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (sessionTimer.current) {
        clearInterval(sessionTimer.current);
      }
    };
  }, []);

  return {
    // Session state
    sessionId,
    messages,
    currentExercise,
    sessionDuration: formatDuration(sessionDuration),
    isAIResponding,
    interactionMode,

    // Global state
    currentSession,
    sessionHistory,
    preferences,
    loading,
    error,

    // Exercises
    therapyExercises,

    // Actions
    startSession,
    endSession,
    sendMessage,
    startExercise,
    setInteractionMode,

    // Utilities
    generateAIResponse,
  };
};
