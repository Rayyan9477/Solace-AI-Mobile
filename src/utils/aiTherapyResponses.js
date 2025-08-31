/**
 * AI Therapy Response System
 * Intelligent response generation for mental health conversations
 * Separated from components for better performance and maintainability
 */

import {
  getExercisesForConcern,
  getExerciseById,
} from "../constants/therapyExercises";

// Crisis keywords that require immediate attention
const CRISIS_KEYWORDS = [
  "harm",
  "suicide",
  "kill",
  "end it",
  "hurt myself",
  "die",
  "death",
  "overdose",
  "pills",
  "knife",
  "gun",
  "bridge",
  "rope",
];

// Emotional state detection patterns
const EMOTION_PATTERNS = {
  anxiety: [
    "anxious",
    "anxiety",
    "worried",
    "panic",
    "scared",
    "nervous",
    "stressed",
  ],
  depression: [
    "sad",
    "depressed",
    "down",
    "hopeless",
    "empty",
    "numb",
    "lonely",
  ],
  anger: [
    "angry",
    "mad",
    "furious",
    "rage",
    "frustrated",
    "irritated",
    "pissed",
  ],
  stress: [
    "stress",
    "overwhelmed",
    "too much",
    "pressure",
    "burden",
    "exhausted",
  ],
  grief: ["loss", "died", "death", "grief", "mourning", "miss", "passed away"],
  trauma: ["trauma", "ptsd", "flashback", "nightmare", "triggered", "assault"],
  relationships: [
    "relationship",
    "partner",
    "family",
    "friend",
    "divorce",
    "breakup",
  ],
  work: ["job", "work", "career", "boss", "colleague", "unemployed", "fired"],
  sleep: ["sleep", "insomnia", "tired", "exhausted", "nightmare", "dream"],
  self_esteem: [
    "worthless",
    "failure",
    "stupid",
    "ugly",
    "useless",
    "hate myself",
  ],
};

// Therapeutic response templates
const RESPONSE_TEMPLATES = {
  validation: [
    "Thank you for sharing that with me. Your feelings are completely valid and important.",
    "I hear how difficult this is for you. It takes courage to open up about these feelings.",
    "What you're experiencing sounds really challenging. I'm here to support you through this.",
    "I can sense that this is weighing heavily on you. Your willingness to talk about it shows strength.",
  ],
  empathy: [
    "That sounds incredibly difficult. You're not alone in feeling this way.",
    "I can imagine how overwhelming this must feel for you right now.",
    "It's completely understandable that you would feel this way given what you're going through.",
    "Many people struggle with similar feelings, and it's okay to not be okay sometimes.",
  ],
  exploration: [
    "Can you tell me more about what's been contributing to these feelings?",
    "How long have you been experiencing this? Has anything changed recently?",
    "What does this feeling look like for you in your daily life?",
    "When do you notice these feelings are strongest? Are there any patterns?",
  ],
  coping: [
    "What usually helps you feel a little better when you're going through tough times?",
    "Have you found any strategies that provide even small moments of relief?",
    "What would feel most helpful for you right now - talking more, trying a coping technique, or something else?",
    "Sometimes when we're struggling, small steps can make a difference. What feels manageable for you today?",
  ],
  strengths: [
    "I notice that you're here talking about this - that shows real strength and self-awareness.",
    "You've been dealing with a lot, and yet you're still here seeking support. That's admirable.",
    "It sounds like you've been trying hard to manage this on your own. You don't have to do it alone.",
    "Your insight into your own experience is really valuable. That awareness is a strength.",
  ],
};

/**
 * Crisis detection and emergency response
 */
export const detectCrisis = (input) => {
  const lowercaseInput = input.toLowerCase();

  for (const keyword of CRISIS_KEYWORDS) {
    if (lowercaseInput.includes(keyword)) {
      return {
        isCrisis: true,
        urgency: "high",
        response: {
          text: "I'm very concerned about what you're sharing with me. If you're having thoughts of hurting yourself, please reach out for immediate help. You can contact the 988 Suicide & Crisis Lifeline (call or text 988) or go to your nearest emergency room. Your life has value, and there are people who want to help you.",
          urgent: true,
          suggestions: [
            "I need immediate help",
            "I'm safe for now",
            "Tell me about other resources",
          ],
          actions: ["call_crisis_line", "emergency_contact", "safety_plan"],
        },
      };
    }
  }

  return { isCrisis: false };
};

/**
 * Detect emotional state from user input
 */
export const detectEmotions = (input) => {
  const lowercaseInput = input.toLowerCase();
  const detectedEmotions = [];

  for (const [emotion, patterns] of Object.entries(EMOTION_PATTERNS)) {
    for (const pattern of patterns) {
      if (lowercaseInput.includes(pattern)) {
        detectedEmotions.push(emotion);
        break;
      }
    }
  }

  return detectedEmotions;
};

/**
 * Generate contextual therapeutic response
 */
export const generateTherapeuticResponse = (input, context = {}) => {
  const lowercaseInput = input.toLowerCase();

  // Check for crisis first
  const crisisCheck = detectCrisis(input);
  if (crisisCheck.isCrisis) {
    return crisisCheck.response;
  }

  // Handle exercise completion
  if (context.currentExercise && context.exerciseStep !== undefined) {
    return handleExerciseProgress(context);
  }

  // Detect emotions
  const emotions = detectEmotions(input);

  // Generate response based on detected emotions
  if (emotions.length > 0) {
    return generateEmotionalResponse(emotions[0], input);
  }

  // Handle specific therapeutic topics
  if (
    lowercaseInput.includes("therapy") ||
    lowercaseInput.includes("counseling")
  ) {
    return {
      text: "I'm glad you're open to therapeutic support. Therapy can be a powerful tool for healing and growth. What draws you to therapy right now?",
      suggestions: [
        "I want to understand myself better",
        "I'm struggling with specific issues",
        "I want to develop coping skills",
      ],
    };
  }

  if (
    lowercaseInput.includes("medication") ||
    lowercaseInput.includes("pills")
  ) {
    return {
      text: "Medication can be an important part of mental health treatment for some people. While I can't provide medical advice, I'd encourage you to discuss this with a healthcare provider or psychiatrist who can properly evaluate your needs.",
      suggestions: [
        "Tell me about therapy options",
        "I want to try non-medication approaches",
        "How do I find a psychiatrist?",
      ],
    };
  }

  // Default supportive responses
  const responseType = getRandomResponseType();
  const template = getRandomTemplate(responseType);

  return {
    text: template,
    suggestions: generateContextualSuggestions(emotions),
    type: responseType,
  };
};

/**
 * Handle exercise progress
 */
const handleExerciseProgress = (context) => {
  const { currentExercise, exerciseStep } = context;
  const exercise = getExerciseById(currentExercise);

  if (!exercise) {
    return {
      text: "I'm sorry, there seems to be an issue with the exercise. Let's continue our conversation instead. How are you feeling right now?",
      type: "error",
    };
  }

  if (exerciseStep < exercise.prompts.length - 1) {
    return {
      text: exercise.prompts[exerciseStep + 1],
      type: "exercise_prompt",
      exerciseStep: exerciseStep + 1,
    };
  } else {
    return {
      text:
        exercise.completionMessage ||
        "That was wonderful work on this exercise. How are you feeling now? Would you like to continue our conversation or try another exercise?",
      type: "exercise_complete",
      suggestions: [
        "How do I feel now",
        "Try another exercise",
        "Continue talking",
      ],
    };
  }
};

/**
 * Generate emotional response
 */
const generateEmotionalResponse = (emotion, input) => {
  const responses = {
    anxiety: {
      text: "I hear that you're feeling anxious. Anxiety can be really challenging to deal with, and your feelings are completely valid. Anxiety often tries to protect us, but sometimes it can become overwhelming. Would you like to try a grounding exercise that can help manage anxiety, or would you prefer to talk more about what's making you feel this way?",
      suggestions: [
        "Let's try grounding exercise",
        "I want to talk about it",
        "What helps with anxiety?",
      ],
      exercises: getExercisesForConcern("anxiety").slice(0, 2),
    },
    depression: {
      text: "Thank you for sharing that you're feeling down. It takes courage to reach out when we're struggling. These feelings are real and important, and you don't have to go through this alone. Sometimes when we're feeling this way, it can help to talk through what's contributing to these feelings. What's been weighing on you lately?",
      suggestions: [
        "Work/school stress",
        "Relationship issues",
        "I don't know why",
      ],
      exercises: getExercisesForConcern("depression").slice(0, 2),
    },
    anger: {
      text: "Anger and frustration are normal emotions, though they can feel overwhelming sometimes. It sounds like something has really upset you. Anger often signals that something important to us has been threatened or violated. What's been triggering these feelings for you?",
      suggestions: [
        "Someone hurt me",
        "Things aren't fair",
        "I can't control things",
      ],
      exercises: getExercisesForConcern("stress").slice(0, 2),
    },
    stress: {
      text: "Feeling overwhelmed is so common, especially when life feels like it's moving too fast or there's too much on your plate. Sometimes breaking things down into smaller, manageable pieces can help. What feels most overwhelming to you right now?",
      suggestions: [
        "Too many responsibilities",
        "Emotional stress",
        "Everything feels chaotic",
      ],
      exercises: getExercisesForConcern("stress").slice(0, 2),
    },
  };

  return responses[emotion] || generateGenericResponse();
};

/**
 * Generate generic supportive response
 */
const generateGenericResponse = () => {
  const supportiveResponses = [
    "Thank you for sharing that with me. I can hear that this is important to you. Can you tell me more about how this is affecting you?",
    "I appreciate you opening up. It's not always easy to put our feelings into words. What would feel most helpful for you right now?",
    "That sounds really significant. I'm here to listen and support you through this. How long have you been dealing with this?",
    "I hear what you're saying, and I want you to know that your feelings matter. What's been the hardest part about this for you?",
  ];

  return {
    text: supportiveResponses[
      Math.floor(Math.random() * supportiveResponses.length)
    ],
    suggestions: [
      "Tell me more",
      "I need coping strategies",
      "How can I feel better?",
    ],
  };
};

/**
 * Get random response type for variety
 */
const getRandomResponseType = () => {
  const types = ["validation", "empathy", "exploration", "coping", "strengths"];
  return types[Math.floor(Math.random() * types.length)];
};

/**
 * Get random template from response type
 */
const getRandomTemplate = (type) => {
  const templates = RESPONSE_TEMPLATES[type] || RESPONSE_TEMPLATES.validation;
  return templates[Math.floor(Math.random() * templates.length)];
};

/**
 * Generate contextual suggestions
 */
const generateContextualSuggestions = (emotions) => {
  if (emotions.includes("anxiety")) {
    return [
      "I'm feeling anxious",
      "I need grounding techniques",
      "What helps with worry?",
    ];
  }

  if (emotions.includes("depression")) {
    return ["I'm feeling sad", "I need motivation", "How do I feel better?"];
  }

  if (emotions.includes("stress")) {
    return ["I'm overwhelmed", "I need relaxation", "How do I manage stress?"];
  }

  return ["Tell me more", "I need support", "What should I do?"];
};

/**
 * Get follow-up questions for deeper exploration
 */
export const getFollowUpQuestions = (emotion, context) => {
  const questions = {
    anxiety: [
      "When did you first notice these anxious feelings?",
      "What situations tend to trigger your anxiety?",
      "How does anxiety show up in your body?",
      "What thoughts go through your mind when you're anxious?",
    ],
    depression: [
      "What does a typical day look like for you when you're feeling this way?",
      "Are there times when you feel a little better, even briefly?",
      "What activities used to bring you joy?",
      "How is this affecting your sleep and energy levels?",
    ],
    stress: [
      "What are the main sources of stress in your life right now?",
      "How do you usually try to manage stress?",
      "What would need to change for you to feel less overwhelmed?",
      "Are you taking care of your basic needs - sleep, food, movement?",
    ],
  };

  const emotionQuestions = questions[emotion] || [];
  return emotionQuestions[Math.floor(Math.random() * emotionQuestions.length)];
};

export default {
  generateTherapeuticResponse,
  detectCrisis,
  detectEmotions,
  getFollowUpQuestions,
};
