/**
 * Static wellness tips data for mental health app
 * Separated from components for better performance and maintainability
 */

export const WELLNESS_TIPS = [
  {
    id: 'mindful-moment',
    icon: '🌱',
    title: 'Mindful Moment',
    tip: 'Take 3 deep breaths and notice your surroundings',
    category: 'mindfulness',
    timeOfDay: ['morning', 'afternoon', 'evening'],
    duration: '2 minutes',
  },
  {
    id: 'stay-hydrated',
    icon: '💧',
    title: 'Stay Hydrated',
    tip: 'Drink a glass of water to refresh your mind',
    category: 'wellness',
    timeOfDay: ['morning', 'afternoon'],
    duration: '1 minute',
  },
  {
    id: 'move-gently',
    icon: '🚶',
    title: 'Move Gently',
    tip: 'Take a short walk or do light stretching',
    category: 'physical',
    timeOfDay: ['morning', 'afternoon', 'evening'],
    duration: '5-10 minutes',
  },
  {
    id: 'gratitude',
    icon: '📖',
    title: 'Gratitude Practice',
    tip: 'Think of one thing you\'re grateful for today',
    category: 'mindfulness',
    timeOfDay: ['morning', 'evening'],
    duration: '2 minutes',
  },
  {
    id: 'pause-reset',
    icon: '⏸️',
    title: 'Pause & Reset',
    tip: 'Take a moment to pause and reset your intentions',
    category: 'mindfulness',
    timeOfDay: ['afternoon', 'evening'],
    duration: '3 minutes',
  },
  {
    id: 'progressive-relaxation',
    icon: '🌊',
    title: 'Progressive Relaxation',
    tip: 'Tense and relax your muscles from head to toe',
    category: 'relaxation',
    timeOfDay: ['evening'],
    duration: '10 minutes',
  },
  {
    id: 'positive-affirmation',
    icon: '✨',
    title: 'Positive Affirmation',
    tip: 'Repeat a kind affirmation to yourself',
    category: 'mindfulness',
    timeOfDay: ['morning'],
    duration: '1 minute',
  },
  {
    id: 'nature-connection',
    icon: '🌿',
    title: 'Nature Connection',
    tip: 'Look outside or step into fresh air for a moment',
    category: 'wellness',
    timeOfDay: ['morning', 'afternoon'],
    duration: '3 minutes',
  },
  {
    id: 'journal-moment',
    icon: '📝',
    title: 'Quick Journal',
    tip: 'Write down one feeling or thought you\'re experiencing',
    category: 'reflection',
    timeOfDay: ['morning', 'evening'],
    duration: '5 minutes',
  },
  {
    id: 'body-scan',
    icon: '🧘',
    title: 'Body Scan',
    tip: 'Mentally scan your body for areas of tension',
    category: 'mindfulness',
    timeOfDay: ['afternoon', 'evening'],
    duration: '5 minutes',
  },
];

/**
 * Get wellness tip based on current time of day
 */
export const getTimeBasedWellnessTip = () => {
  const hour = new Date().getHours();
  let timeOfDay;
  
  if (hour < 12) {
    timeOfDay = 'morning';
  } else if (hour < 17) {
    timeOfDay = 'afternoon';
  } else {
    timeOfDay = 'evening';
  }
  
  const applicableTips = WELLNESS_TIPS.filter(tip => 
    tip.timeOfDay.includes(timeOfDay)
  );
  
  return applicableTips[Math.floor(Math.random() * applicableTips.length)];
};

/**
 * Get random wellness tip from specific category
 */
export const getWellnessTipByCategory = (category) => {
  const categoryTips = WELLNESS_TIPS.filter(tip => tip.category === category);
  return categoryTips[Math.floor(Math.random() * categoryTips.length)];
};

/**
 * Get all available categories
 */
export const getWellnessCategories = () => {
  return [...new Set(WELLNESS_TIPS.map(tip => tip.category))];
};

export default {
  WELLNESS_TIPS,
  getTimeBasedWellnessTip,
  getWellnessTipByCategory,
  getWellnessCategories,
};