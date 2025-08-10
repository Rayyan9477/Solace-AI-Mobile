/**
 * Therapy exercises and prompts for mental health app
 * Separated from components for better performance and maintainability
 */

export const THERAPY_EXERCISES = [
  {
    id: 'grounding_5_4_3_2_1',
    title: '5-4-3-2-1 Grounding',
    description: 'A mindfulness technique to help you feel present',
    icon: 'Mindfulness',
    category: 'grounding',
    duration: '5-10 minutes',
    difficulty: 'beginner',
    tags: ['anxiety', 'panic', 'mindfulness'],
    prompts: [
      "Let's try the 5-4-3-2-1 grounding technique. Name 5 things you can see around you.",
      "Now, tell me 4 things you can touch or feel.",
      "What are 3 things you can hear right now?",
      "Can you identify 2 things you can smell?",
      "Finally, name 1 thing you can taste."
    ],
    completionMessage: "Great job! This grounding technique helps anchor you to the present moment. How do you feel now?"
  },
  {
    id: 'breathing_exercise',
    title: 'Mindful Breathing',
    description: 'Guided breathing to reduce stress and anxiety',
    icon: 'Heart',
    category: 'breathing',
    duration: '3-5 minutes',
    difficulty: 'beginner',
    tags: ['anxiety', 'stress', 'relaxation'],
    prompts: [
      "Let's practice mindful breathing together. Take a slow, deep breath in through your nose for 4 counts.",
      "Hold that breath for 4 counts.",
      "Now slowly exhale through your mouth for 6 counts.",
      "How do you feel after that breath? Let's do a few more cycles together."
    ],
    completionMessage: "Excellent breathing work! This technique activates your body's relaxation response. Notice any changes in how you feel?"
  },
  {
    id: 'thought_challenging',
    title: 'Thought Challenging',
    description: 'Examine and reframe negative thoughts',
    icon: 'Brain',
    category: 'cognitive',
    duration: '10-15 minutes',
    difficulty: 'intermediate',
    tags: ['depression', 'anxiety', 'negative thoughts'],
    prompts: [
      "What's a thought that's been bothering you lately?",
      "What evidence do you have that this thought is true?",
      "What evidence contradicts this thought?",
      "What would you tell a good friend if they had this thought?",
      "How can we reframe this thought in a more balanced way?"
    ],
    completionMessage: "That was thoughtful work challenging those automatic thoughts. Remember, thoughts are not facts - they're just mental events that pass through our minds."
  },
  {
    id: 'mood_exploration',
    title: 'Mood Check-In',
    description: 'Explore and understand your current emotions',
    icon: 'Heart',
    category: 'emotional',
    duration: '7-10 minutes',
    difficulty: 'beginner',
    tags: ['mood', 'emotions', 'self-awareness'],
    prompts: [
      "How are you feeling right now, on a scale of 1-10?",
      "What emotions are you experiencing? Can you name them specifically?",
      "Where do you feel these emotions in your body?",
      "What might have contributed to feeling this way today?",
      "What would help you feel a little better right now?"
    ],
    completionMessage: "Thank you for taking the time to check in with your emotions. Emotional awareness is the first step toward emotional wellness."
  },
  {
    id: 'progressive_muscle_relaxation',
    title: 'Progressive Muscle Relaxation',
    description: 'Release tension by systematically relaxing muscle groups',
    icon: 'Heart',
    category: 'relaxation',
    duration: '15-20 minutes',
    difficulty: 'beginner',
    tags: ['stress', 'tension', 'relaxation', 'body'],
    prompts: [
      "Find a comfortable position and close your eyes if you feel comfortable doing so.",
      "Start by tensing the muscles in your feet for 5 seconds, then release and notice the relaxation.",
      "Now tense your calf muscles for 5 seconds, then release and feel the tension melting away.",
      "Continue with your thighs - tense for 5 seconds, then release.",
      "Work your way up through your body - abdomen, hands, arms, shoulders, neck, and face.",
      "Take a moment to notice how your whole body feels now."
    ],
    completionMessage: "Wonderful relaxation work! This technique helps your body remember what relaxation feels like and can be used anytime you notice tension."
  },
  {
    id: 'gratitude_practice',
    title: 'Gratitude Reflection',
    description: 'Cultivate positive emotions through gratitude',
    icon: 'Heart',
    category: 'positive psychology',
    duration: '5-10 minutes',
    difficulty: 'beginner',
    tags: ['gratitude', 'positive emotions', 'mood'],
    prompts: [
      "Think of three things you're grateful for today, no matter how small.",
      "For the first thing you're grateful for, why does it matter to you?",
      "How did the second thing you're grateful for impact your day?",
      "What feelings come up when you think about the third thing?",
      "How might you express gratitude for one of these things?"
    ],
    completionMessage: "Gratitude practice is a powerful way to shift our focus toward the positive aspects of our lives. Consider keeping a daily gratitude journal."
  },
  {
    id: 'values_clarification',
    title: 'Values Exploration',
    description: 'Identify and connect with your core values',
    icon: 'Brain',
    category: 'values',
    duration: '15-20 minutes',
    difficulty: 'intermediate',
    tags: ['values', 'meaning', 'purpose', 'identity'],
    prompts: [
      "What matters most to you in life? Think about your core values.",
      "How do these values show up in your daily life?",
      "When do you feel most aligned with your values?",
      "Are there areas where you'd like to live more in line with your values?",
      "What's one small step you could take this week to honor your values?"
    ],
    completionMessage: "Understanding your values is like having a compass for life decisions. When we live in alignment with our values, we often feel more fulfilled and authentic."
  },
  {
    id: 'self_compassion',
    title: 'Self-Compassion Practice',
    description: 'Learn to treat yourself with kindness and understanding',
    icon: 'Heart',
    category: 'self compassion',
    duration: '10-15 minutes',
    difficulty: 'intermediate',
    tags: ['self-compassion', 'self-criticism', 'kindness'],
    prompts: [
      "Think of a recent time when you were hard on yourself. What happened?",
      "What would you say to a good friend going through the same situation?",
      "Can you offer yourself the same kindness you'd give to a friend?",
      "Remember that struggling and making mistakes is part of the human experience.",
      "What words of comfort and encouragement can you offer yourself right now?"
    ],
    completionMessage: "Self-compassion isn't about being easy on yourself - it's about being kind to yourself. This practice can help reduce self-criticism and increase emotional resilience."
  }
];

/**
 * Get exercises by category
 */
export const getExercisesByCategory = (category) => {
  return THERAPY_EXERCISES.filter(exercise => exercise.category === category);
};

/**
 * Get exercises by difficulty level
 */
export const getExercisesByDifficulty = (difficulty) => {
  return THERAPY_EXERCISES.filter(exercise => exercise.difficulty === difficulty);
};

/**
 * Get exercises by tag
 */
export const getExercisesByTag = (tag) => {
  return THERAPY_EXERCISES.filter(exercise => exercise.tags.includes(tag));
};

/**
 * Get random exercise
 */
export const getRandomExercise = () => {
  return THERAPY_EXERCISES[Math.floor(Math.random() * THERAPY_EXERCISES.length)];
};

/**
 * Get beginner-friendly exercises
 */
export const getBeginnerExercises = () => {
  return getExercisesByDifficulty('beginner');
};

/**
 * Get exercises for specific mental health concerns
 */
export const getExercisesForConcern = (concern) => {
  const concernMap = {
    anxiety: ['breathing', 'grounding', 'relaxation'],
    depression: ['cognitive', 'positive psychology', 'mood'],
    stress: ['breathing', 'relaxation', 'grounding'],
    'low-mood': ['positive psychology', 'mood', 'self compassion'],
    'negative-thoughts': ['cognitive', 'self compassion'],
  };
  
  const relevantCategories = concernMap[concern] || [];
  return THERAPY_EXERCISES.filter(exercise => 
    relevantCategories.includes(exercise.category) || 
    exercise.tags.includes(concern)
  );
};

/**
 * Get all available categories
 */
export const getExerciseCategories = () => {
  return [...new Set(THERAPY_EXERCISES.map(exercise => exercise.category))];
};

/**
 * Get exercise by ID
 */
export const getExerciseById = (id) => {
  return THERAPY_EXERCISES.find(exercise => exercise.id === id);
};

export default {
  THERAPY_EXERCISES,
  getExercisesByCategory,
  getExercisesByDifficulty,
  getExercisesByTag,
  getRandomExercise,
  getBeginnerExercises,
  getExercisesForConcern,
  getExerciseCategories,
  getExerciseById,
};