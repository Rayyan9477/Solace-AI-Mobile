/**
 * Mental Health Assessment Scoring Algorithm
 * Evidence-based scoring system for comprehensive mental health evaluation
 *
 * This algorithm calculates scores across four key dimensions:
 * - Anxiety (0-100)
 * - Depression (0-100)
 * - Stress (0-100)
 * - Sleep Quality (0-100)
 *
 * Overall score is a weighted average of these dimensions
 */

export interface AssessmentAnswers {
  [questionId: number]: any;
}

export interface CategoryScore {
  score: number; // 0-100
  severity: 'excellent' | 'good' | 'fair' | 'needs-attention';
  color: string;
}

export interface AssessmentResult {
  overallScore: number; // 0-100
  severity: 'excellent' | 'good' | 'fair' | 'needs-attention';
  categories: {
    mentalClarity: CategoryScore;
    emotionalBalance: CategoryScore;
    stressManagement: CategoryScore;
    sleepQuality: CategoryScore;
  };
  recommendations: string[];
  insights: string[];
}

/**
 * Calculate overall mental health score from assessment answers
 */
export const calculateAssessmentScore = (answers: AssessmentAnswers): AssessmentResult => {
  // Calculate individual category scores
  const mentalClarity = calculateMentalClarityScore(answers);
  const emotionalBalance = calculateEmotionalBalanceScore(answers);
  const stressManagement = calculateStressManagementScore(answers);
  const sleepQuality = calculateSleepQualityScore(answers);

  // Weighted average for overall score
  // Mental clarity and emotional balance are weighted more heavily
  const overallScore = Math.round(
    mentalClarity.score * 0.30 +
    emotionalBalance.score * 0.30 +
    stressManagement.score * 0.25 +
    sleepQuality.score * 0.15
  );

  const severity = getScoreSeverity(overallScore);

  // Generate personalized recommendations
  const recommendations = generateRecommendations(answers, {
    mentalClarity,
    emotionalBalance,
    stressManagement,
    sleepQuality,
  });

  // Generate insights
  const insights = generateInsights(answers, overallScore);

  return {
    overallScore,
    severity,
    categories: {
      mentalClarity,
      emotionalBalance,
      stressManagement,
      sleepQuality,
    },
    recommendations,
    insights,
  };
};

/**
 * Calculate Mental Clarity Score (0-100)
 * Based on: current mood, mental health symptoms, physical distress
 */
const calculateMentalClarityScore = (answers: AssessmentAnswers): CategoryScore => {
  let score = 100; // Start at perfect score

  // Q5: Current mood (Very sad=20, Sad=40, Okay=60, Good=80, Happy=100)
  const moodAnswer = answers[5];
  if (moodAnswer) {
    const moodScores: Record<string, number> = {
      'Very sad': 20,
      'Sad': 40,
      'Okay': 60,
      'Good': 80,
      'Happy': 100,
    };
    score = moodScores[moodAnswer] || 60;
  }

  // Q8: Physical distress (reduces mental clarity)
  const physicalDistress = answers[8] || [];
  if (Array.isArray(physicalDistress)) {
    if (physicalDistress.includes('Yes, quite a lot')) {
      score -= 20;
    } else if (physicalDistress.includes('Yes, but not much')) {
      score -= 10;
    }
  }

  // Q12: Mental health symptoms
  const symptoms = answers[12] || [];
  if (Array.isArray(symptoms)) {
    // Each symptom reduces score
    const symptomPenalty = symptoms.length * 8;
    score -= symptomPenalty;
  }

  // Ensure score is between 0-100
  score = Math.max(0, Math.min(100, score));

  return {
    score: Math.round(score),
    severity: getScoreSeverity(score),
    color: getScoreColor(score),
  };
};

/**
 * Calculate Emotional Balance Score (0-100)
 * Based on: primary concerns, stress triggers, therapist support
 */
const calculateEmotionalBalanceScore = (answers: AssessmentAnswers): CategoryScore => {
  let score = 80; // Start at good baseline

  // Q1: Primary mental health concerns
  const concerns = answers[1] || [];
  if (Array.isArray(concerns)) {
    // Each concern slightly reduces emotional balance
    if (concerns.includes('Depression')) score -= 15;
    if (concerns.includes('Anxiety')) score -= 12;
    if (concerns.includes('Relationship issues')) score -= 8;
  }

  // Q6: Stress triggers
  const triggers = answers[6] || [];
  if (Array.isArray(triggers)) {
    // Multiple triggers indicate emotional strain
    score -= triggers.length * 5;
  }

  // Q7: Has therapist (positive factor)
  if (answers[7] === 'Yes') {
    score += 10; // Professional support helps
  }

  // Q10: Taking medications (indicates management)
  if (answers[10] === 'Yes') {
    score += 5; // Medication shows active management
  }

  score = Math.max(0, Math.min(100, score));

  return {
    score: Math.round(score),
    severity: getScoreSeverity(score),
    color: getScoreColor(score),
  };
};

/**
 * Calculate Stress Management Score (0-100)
 * Based on: stress level, stress triggers, physical symptoms
 */
const calculateStressManagementScore = (answers: AssessmentAnswers): CategoryScore => {
  let score = 75; // Start at moderate baseline

  // Q13: Stress level (1-5 scale)
  const stressLevel = answers[13] || 3;
  if (typeof stressLevel === 'number') {
    // Convert 1-5 scale to score reduction
    // 1 = minimal stress (-0), 5 = severe stress (-50)
    score -= (stressLevel - 1) * 12.5;
  }

  // Q1: Stress as primary concern
  const concerns = answers[1] || [];
  if (Array.isArray(concerns) && concerns.includes('Stress')) {
    score -= 15;
  }

  // Q6: Number of stress triggers
  const triggers = answers[6] || [];
  if (Array.isArray(triggers)) {
    score -= triggers.length * 7;
  }

  // Q8: Physical manifestations of stress
  const physicalDistress = answers[8] || [];
  if (Array.isArray(physicalDistress)) {
    if (physicalDistress.includes('Yes, quite a lot')) {
      score -= 15;
    } else if (physicalDistress.includes('Yes, but not much')) {
      score -= 8;
    }
  }

  score = Math.max(0, Math.min(100, score));

  return {
    score: Math.round(score),
    severity: getScoreSeverity(score),
    color: getScoreColor(score),
  };
};

/**
 * Calculate Sleep Quality Score (0-100)
 * Based on: sleep rating, insomnia symptoms
 */
const calculateSleepQualityScore = (answers: AssessmentAnswers): CategoryScore => {
  let score = 70; // Start at moderate baseline

  // Q9: Sleep quality rating (1-10 scale)
  const sleepRating = answers[9] || 5;
  if (typeof sleepRating === 'number') {
    // Convert 1-10 scale to 0-100 score
    score = sleepRating * 10;
  }

  // Q12: Insomnia symptom
  const symptoms = answers[12] || [];
  if (Array.isArray(symptoms) && symptoms.includes('Insomnia')) {
    score -= 20;
  }

  score = Math.max(0, Math.min(100, score));

  return {
    score: Math.round(score),
    severity: getScoreSeverity(score),
    color: getScoreColor(score),
  };
};

/**
 * Determine severity level based on score
 */
const getScoreSeverity = (score: number): 'excellent' | 'good' | 'fair' | 'needs-attention' => {
  if (score >= 85) return 'excellent';
  if (score >= 70) return 'good';
  if (score >= 50) return 'fair';
  return 'needs-attention';
};

/**
 * Get color for score visualization
 */
const getScoreColor = (score: number): string => {
  if (score >= 85) return '#8FBC8F'; // Green
  if (score >= 70) return '#B8976B'; // Yellow-brown
  if (score >= 50) return '#E8A872'; // Orange
  return '#D97F52'; // Red-orange
};

/**
 * Generate personalized recommendations based on answers
 */
const generateRecommendations = (
  answers: AssessmentAnswers,
  categories: {
    mentalClarity: CategoryScore;
    emotionalBalance: CategoryScore;
    stressManagement: CategoryScore;
    sleepQuality: CategoryScore;
  }
): string[] => {
  const recommendations: string[] = [];

  // Stress management recommendations
  if (categories.stressManagement.score < 70) {
    const stressLevel = answers[13] || 3;
    if (stressLevel >= 4) {
      recommendations.push(
        'Practice daily stress-reduction techniques like deep breathing or progressive muscle relaxation'
      );
    }
    recommendations.push(
      'Identify and limit exposure to major stress triggers when possible'
    );
  }

  // Sleep recommendations
  if (categories.sleepQuality.score < 70) {
    recommendations.push(
      'Establish a consistent sleep schedule with 7-9 hours per night'
    );
    recommendations.push(
      'Create a calming bedtime routine and limit screen time before sleep'
    );
  }

  // Mental health support
  const hasTherapist = answers[7] === 'Yes';
  if (!hasTherapist && categories.emotionalBalance.score < 60) {
    recommendations.push(
      'Consider seeking professional support from a therapist or counselor'
    );
  }

  // Depression/Anxiety specific
  const symptoms = answers[12] || [];
  if (Array.isArray(symptoms)) {
    if (symptoms.includes('Depression') || symptoms.includes('Anxiety')) {
      recommendations.push(
        'Engage in regular physical activity - even 15-20 minutes daily can help'
      );
    }
    if (symptoms.includes('Panic attacks')) {
      recommendations.push(
        'Learn and practice grounding techniques for managing panic episodes'
      );
    }
  }

  // Mindfulness for overall wellbeing
  if (categories.mentalClarity.score < 75) {
    recommendations.push(
      'Practice mindfulness meditation for 10-15 minutes daily to improve mental clarity'
    );
  }

  // Social support
  const concerns = answers[1] || [];
  if (Array.isArray(concerns) && concerns.includes('Relationship issues')) {
    recommendations.push(
      'Consider joining support groups or engaging in social activities to build connections'
    );
  }

  // Limit to top 4-5 most relevant recommendations
  return recommendations.slice(0, 5);
};

/**
 * Generate insights about the assessment results
 */
const generateInsights = (answers: AssessmentAnswers, overallScore: number): string[] => {
  const insights: string[] = [];

  // Overall assessment
  if (overallScore >= 85) {
    insights.push(
      'Your mental health assessment shows excellent overall wellbeing. Continue your positive practices!'
    );
  } else if (overallScore >= 70) {
    insights.push(
      'Your mental health is generally good with some areas for improvement. Small changes can make a big difference.'
    );
  } else if (overallScore >= 50) {
    insights.push(
      'Your assessment indicates some mental health challenges. The recommendations below can help you improve.'
    );
  } else {
    insights.push(
      'Your assessment shows significant mental health concerns. Professional support is strongly recommended.'
    );
  }

  // Specific insights
  const symptoms = answers[12] || [];
  if (Array.isArray(symptoms) && symptoms.length > 2) {
    insights.push(
      `You indicated experiencing ${symptoms.length} mental health symptoms. Addressing these with professional help may be beneficial.`
    );
  }

  const triggers = answers[6] || [];
  if (Array.isArray(triggers) && triggers.length >= 3) {
    insights.push(
      'You have multiple stress triggers. Learning coping strategies for each trigger can improve your wellbeing.'
    );
  }

  const sleepRating = answers[9] || 5;
  if (sleepRating <= 4) {
    insights.push(
      'Your sleep quality may be affecting your mental health. Improving sleep should be a priority.'
    );
  }

  return insights;
};

/**
 * Helper to get user-friendly category names
 */
export const getCategoryLabel = (score: number): string => {
  if (score >= 85) return 'Excellent';
  if (score >= 70) return 'Good';
  if (score >= 50) return 'Fair';
  return 'Needs Attention';
};

/**
 * Helper to get category description
 */
export const getCategoryDescription = (score: number): string => {
  if (score >= 85) return 'You are doing great!';
  if (score >= 70) return 'Mentally stable with room for growth';
  if (score >= 50) return 'Some areas need attention';
  return 'Consider seeking support';
};
