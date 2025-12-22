/**
 * Mental Health Assessment Scoring Algorithm
 * Evidence-based scoring system for comprehensive mental health evaluation
 *
 * CRIT-005 FIX: Updated to align with clinical PHQ-9 and GAD-7 standards
 *
 * This algorithm supports:
 * - PHQ-9 (Patient Health Questionnaire-9): Depression screening (0-27 scale)
 * - GAD-7 (Generalized Anxiety Disorder-7): Anxiety screening (0-21 scale)
 * - Custom wellness assessment with four key dimensions
 *
 * Clinical Severity Thresholds (PHQ-9):
 * - 0-4: Minimal/None
 * - 5-9: Mild
 * - 10-14: Moderate
 * - 15-19: Moderately Severe
 * - 20-27: Severe
 *
 * Clinical Severity Thresholds (GAD-7):
 * - 0-4: Minimal
 * - 5-9: Mild
 * - 10-14: Moderate
 * - 15-21: Severe
 */

export type AssessmentAnswer = string | string[] | number | boolean | undefined;

export interface AssessmentAnswers {
  [questionId: number]: AssessmentAnswer;
}

// CRIT-005 FIX: Added clinical severity levels including 'moderately-severe'
export type ClinicalSeverity = 'minimal' | 'mild' | 'moderate' | 'moderately-severe' | 'severe';
export type WellnessSeverity = 'excellent' | 'good' | 'fair' | 'needs-attention';

export interface CategoryScore {
  score: number; // 0-100 for wellness, raw score for clinical
  severity: WellnessSeverity;
  color: string;
}

// CRIT-005 FIX: PHQ-9 Clinical Score Interface
export interface PHQ9Result {
  totalScore: number; // 0-27
  severity: ClinicalSeverity;
  severityLabel: string;
  requiresFollowUp: boolean;
  suicidalIdeation: boolean; // Question 9 positive
  recommendations: string[];
  color: string;
}

// CRIT-005 FIX: GAD-7 Clinical Score Interface
export interface GAD7Result {
  totalScore: number; // 0-21
  severity: ClinicalSeverity;
  severityLabel: string;
  requiresFollowUp: boolean;
  recommendations: string[];
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
 * CRIT-NEW-004 FIX: Validation result interface for route params
 */
export interface ValidationResult {
  valid: boolean;
  error?: string;
  sanitizedAnswers: AssessmentAnswers;
}

/**
 * CRIT-NEW-004 FIX: Validate and sanitize assessment answers from route params
 * Ensures data integrity and prevents app crashes from malformed data
 * @param params - The route params object (may be undefined or malformed)
 * @returns ValidationResult with sanitized answers and any validation errors
 */
export function validateAssessmentAnswers(params: unknown): ValidationResult {
  // Check if params exist
  if (!params || typeof params !== 'object') {
    return {
      valid: false,
      error: 'Missing route parameters',
      sanitizedAnswers: {},
    };
  }

  const paramsObj = params as Record<string, unknown>;
  const answers = paramsObj.answers;

  // Check if answers exist
  if (answers === undefined || answers === null) {
    return {
      valid: false,
      error: 'Missing assessment answers in route parameters',
      sanitizedAnswers: {},
    };
  }

  // Check if answers is an object
  if (typeof answers !== 'object' || Array.isArray(answers)) {
    return {
      valid: false,
      error: 'Invalid assessment answers format - expected object',
      sanitizedAnswers: {},
    };
  }

  const answersObj = answers as Record<string | number, unknown>;
  const sanitizedAnswers: AssessmentAnswers = {};

  // Validate and sanitize each answer
  for (const [key, value] of Object.entries(answersObj)) {
    const questionId = Number(key);

    // Skip non-numeric keys
    if (isNaN(questionId)) {
      continue;
    }

    // Validate answer type
    if (
      typeof value === 'string' ||
      typeof value === 'number' ||
      typeof value === 'boolean' ||
      value === undefined ||
      (Array.isArray(value) && value.every(v => typeof v === 'string'))
    ) {
      sanitizedAnswers[questionId] = value as AssessmentAnswer;
    }
    // Skip invalid answer types silently
  }

  // Check if we have at least some valid answers
  const answerCount = Object.keys(sanitizedAnswers).length;
  if (answerCount === 0) {
    return {
      valid: false,
      error: 'No valid assessment answers found',
      sanitizedAnswers: {},
    };
  }

  return {
    valid: true,
    sanitizedAnswers,
  };
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

// ============================================================================
// CRIT-005 FIX: PHQ-9 Clinical Depression Screening
// ============================================================================

/**
 * PHQ-9 Question Response Values
 * Each question is scored 0-3:
 * 0 = Not at all
 * 1 = Several days
 * 2 = More than half the days
 * 3 = Nearly every day
 */
export interface PHQ9Answers {
  q1_interest: number;      // Little interest or pleasure in doing things
  q2_depressed: number;     // Feeling down, depressed, or hopeless
  q3_sleep: number;         // Trouble falling/staying asleep or sleeping too much
  q4_energy: number;        // Feeling tired or having little energy
  q5_appetite: number;      // Poor appetite or overeating
  q6_failure: number;       // Feeling bad about yourself/feeling like a failure
  q7_concentration: number; // Trouble concentrating on things
  q8_movement: number;      // Moving/speaking slowly or being fidgety/restless
  q9_selfharm: number;      // Thoughts of being better off dead or hurting yourself
}

/**
 * Calculate PHQ-9 Depression Score
 * Based on Kroenke K, Spitzer RL, Williams JB. The PHQ-9: validity of a brief
 * depression severity measure. J Gen Intern Med. 2001;16(9):606-613.
 *
 * CRIT-005 FIX: Uses clinically validated thresholds
 */
export const calculatePHQ9Score = (answers: PHQ9Answers): PHQ9Result => {
  // Calculate total score (0-27)
  const totalScore =
    answers.q1_interest +
    answers.q2_depressed +
    answers.q3_sleep +
    answers.q4_energy +
    answers.q5_appetite +
    answers.q6_failure +
    answers.q7_concentration +
    answers.q8_movement +
    answers.q9_selfharm;

  // CRIT-005 FIX: Clinical severity thresholds per PHQ-9 validation study
  let severity: ClinicalSeverity;
  let severityLabel: string;
  let color: string;
  let requiresFollowUp = false;

  if (totalScore <= 4) {
    severity = 'minimal';
    severityLabel = 'Minimal or None';
    color = '#4CAF50'; // Green
  } else if (totalScore <= 9) {
    severity = 'mild';
    severityLabel = 'Mild Depression';
    color = '#8BC34A'; // Light green
  } else if (totalScore <= 14) {
    severity = 'moderate';
    severityLabel = 'Moderate Depression';
    color = '#FFC107'; // Amber
    requiresFollowUp = true;
  } else if (totalScore <= 19) {
    // CRIT-005 FIX: Added missing 'Moderately Severe' category
    severity = 'moderately-severe';
    severityLabel = 'Moderately Severe Depression';
    color = '#FF9800'; // Orange
    requiresFollowUp = true;
  } else {
    severity = 'severe';
    severityLabel = 'Severe Depression';
    color = '#F44336'; // Red
    requiresFollowUp = true;
  }

  // CRIT-005 FIX: Flag suicidal ideation for immediate attention
  const suicidalIdeation = answers.q9_selfharm > 0;
  if (suicidalIdeation) {
    requiresFollowUp = true;
  }

  // Generate clinical recommendations based on PHQ-9 treatment guidelines
  const recommendations = generatePHQ9Recommendations(totalScore, severity, suicidalIdeation);

  return {
    totalScore,
    severity,
    severityLabel,
    requiresFollowUp,
    suicidalIdeation,
    recommendations,
    color,
  };
};

/**
 * Generate PHQ-9 recommendations based on clinical guidelines
 */
const generatePHQ9Recommendations = (
  score: number,
  severity: ClinicalSeverity,
  suicidalIdeation: boolean
): string[] => {
  const recommendations: string[] = [];

  // CRITICAL: Suicidal ideation requires immediate intervention
  if (suicidalIdeation) {
    recommendations.push(
      'URGENT: You indicated thoughts of self-harm. Please contact a mental health professional or crisis line immediately.'
    );
    recommendations.push(
      'National Suicide Prevention Lifeline: 988 (US) or contact your local emergency services.'
    );
  }

  // Severity-based recommendations per PHQ-9 treatment guidelines
  switch (severity) {
    case 'minimal':
      recommendations.push('Continue monitoring your mental health with periodic self-assessments.');
      recommendations.push('Maintain healthy lifestyle habits including regular exercise and sleep.');
      break;

    case 'mild':
      recommendations.push('Consider watchful waiting with reassessment in 2-4 weeks.');
      recommendations.push('Lifestyle modifications such as exercise, sleep hygiene, and stress management may help.');
      recommendations.push('If symptoms persist, consult with a healthcare provider about treatment options.');
      break;

    case 'moderate':
      recommendations.push('Treatment is recommended. Consult with a mental health professional.');
      recommendations.push('Evidence-based treatments include cognitive behavioral therapy (CBT) or antidepressant medication.');
      recommendations.push('Regular follow-up assessments are important to monitor progress.');
      break;

    case 'moderately-severe':
      recommendations.push('Active treatment with pharmacotherapy and/or psychotherapy is strongly recommended.');
      recommendations.push('Please schedule an appointment with a mental health professional as soon as possible.');
      recommendations.push('Treatment should include regular monitoring and follow-up within 2-4 weeks.');
      break;

    case 'severe':
      recommendations.push('Immediate treatment initiation is recommended. Please seek professional help today.');
      recommendations.push('Combination treatment (medication plus psychotherapy) is often most effective for severe depression.');
      recommendations.push('If you cannot access care today, please call a crisis helpline or go to your nearest emergency room.');
      break;
  }

  return recommendations;
};

// ============================================================================
// CRIT-005 FIX: GAD-7 Clinical Anxiety Screening
// ============================================================================

/**
 * GAD-7 Question Response Values
 * Each question is scored 0-3:
 * 0 = Not at all
 * 1 = Several days
 * 2 = More than half the days
 * 3 = Nearly every day
 */
export interface GAD7Answers {
  q1_nervous: number;     // Feeling nervous, anxious, or on edge
  q2_worry: number;       // Not being able to stop or control worrying
  q3_toomuch: number;     // Worrying too much about different things
  q4_relax: number;       // Trouble relaxing
  q5_restless: number;    // Being so restless it's hard to sit still
  q6_annoyed: number;     // Becoming easily annoyed or irritable
  q7_afraid: number;      // Feeling afraid as if something awful might happen
}

/**
 * Calculate GAD-7 Anxiety Score
 * Based on Spitzer RL, Kroenke K, Williams JBW, Löwe B. A Brief Measure for
 * Assessing Generalized Anxiety Disorder. Arch Intern Med. 2006;166(10):1092-1097.
 *
 * CRIT-005 FIX: Uses clinically validated thresholds
 */
export const calculateGAD7Score = (answers: GAD7Answers): GAD7Result => {
  // Calculate total score (0-21)
  const totalScore =
    answers.q1_nervous +
    answers.q2_worry +
    answers.q3_toomuch +
    answers.q4_relax +
    answers.q5_restless +
    answers.q6_annoyed +
    answers.q7_afraid;

  // CRIT-005 FIX: Clinical severity thresholds per GAD-7 validation study
  let severity: ClinicalSeverity;
  let severityLabel: string;
  let color: string;
  let requiresFollowUp = false;

  if (totalScore <= 4) {
    severity = 'minimal';
    severityLabel = 'Minimal Anxiety';
    color = '#4CAF50'; // Green
  } else if (totalScore <= 9) {
    severity = 'mild';
    severityLabel = 'Mild Anxiety';
    color = '#8BC34A'; // Light green
  } else if (totalScore <= 14) {
    severity = 'moderate';
    severityLabel = 'Moderate Anxiety';
    color = '#FFC107'; // Amber
    requiresFollowUp = true;
  } else {
    severity = 'severe';
    severityLabel = 'Severe Anxiety';
    color = '#F44336'; // Red
    requiresFollowUp = true;
  }

  // Generate clinical recommendations based on GAD-7 treatment guidelines
  const recommendations = generateGAD7Recommendations(totalScore, severity);

  return {
    totalScore,
    severity,
    severityLabel,
    requiresFollowUp,
    recommendations,
    color,
  };
};

/**
 * Generate GAD-7 recommendations based on clinical guidelines
 */
const generateGAD7Recommendations = (
  score: number,
  severity: ClinicalSeverity
): string[] => {
  const recommendations: string[] = [];

  // Severity-based recommendations per GAD-7 treatment guidelines
  switch (severity) {
    case 'minimal':
      recommendations.push('Your anxiety levels are within normal range. Continue healthy coping practices.');
      recommendations.push('Regular mindfulness or relaxation exercises can help maintain low anxiety levels.');
      break;

    case 'mild':
      recommendations.push('Monitor your symptoms and consider self-management strategies.');
      recommendations.push('Techniques like deep breathing, progressive muscle relaxation, and regular exercise may help.');
      recommendations.push('If symptoms worsen or persist, consult with a healthcare provider.');
      break;

    case 'moderate':
      recommendations.push('Professional evaluation is recommended. Consult with a mental health provider.');
      recommendations.push('Evidence-based treatments include cognitive behavioral therapy (CBT) and/or medication.');
      recommendations.push('Self-management strategies should complement professional treatment.');
      break;

    case 'severe':
      recommendations.push('Active treatment is strongly recommended. Please seek professional help soon.');
      recommendations.push('Severe anxiety significantly impacts daily functioning and quality of life.');
      recommendations.push('Both psychotherapy (especially CBT) and pharmacotherapy are effective treatment options.');
      recommendations.push('If anxiety is causing panic attacks or severe distress, contact a crisis helpline or healthcare provider immediately.');
      break;

    default:
      recommendations.push('Please consult with a healthcare provider for proper evaluation.');
  }

  return recommendations;
};

// ============================================================================
// CRIT-005 FIX: Combined Clinical Assessment
// ============================================================================

export interface ClinicalAssessmentResult {
  phq9?: PHQ9Result;
  gad7?: GAD7Result;
  overallRiskLevel: 'low' | 'moderate' | 'high' | 'critical';
  requiresImmediateAttention: boolean;
  combinedRecommendations: string[];
}

/**
 * Calculate combined clinical assessment from PHQ-9 and GAD-7
 * CRIT-005 FIX: Provides comprehensive clinical picture with proper risk stratification
 */
export const calculateClinicalAssessment = (
  phq9Answers?: PHQ9Answers,
  gad7Answers?: GAD7Answers
): ClinicalAssessmentResult => {
  const phq9 = phq9Answers ? calculatePHQ9Score(phq9Answers) : undefined;
  const gad7 = gad7Answers ? calculateGAD7Score(gad7Answers) : undefined;

  // Determine overall risk level
  let overallRiskLevel: 'low' | 'moderate' | 'high' | 'critical' = 'low';
  let requiresImmediateAttention = false;

  // Check for suicidal ideation first (critical)
  if (phq9?.suicidalIdeation) {
    overallRiskLevel = 'critical';
    requiresImmediateAttention = true;
  }
  // Check for severe symptoms
  else if (phq9?.severity === 'severe' || gad7?.severity === 'severe') {
    overallRiskLevel = 'high';
  }
  // Check for moderately-severe or moderate symptoms
  else if (
    phq9?.severity === 'moderately-severe' ||
    phq9?.severity === 'moderate' ||
    gad7?.severity === 'moderate'
  ) {
    overallRiskLevel = 'moderate';
  }

  // Combine recommendations, prioritizing urgent ones
  const combinedRecommendations: string[] = [];

  if (phq9?.suicidalIdeation) {
    combinedRecommendations.push(
      'IMMEDIATE ACTION REQUIRED: Please contact a crisis helpline (988 in US) or go to your nearest emergency room.'
    );
  }

  // Add PHQ-9 recommendations
  if (phq9?.recommendations) {
    combinedRecommendations.push(...phq9.recommendations.filter(r => !r.includes('URGENT')));
  }

  // Add GAD-7 recommendations (avoid duplicates)
  if (gad7?.recommendations) {
    gad7.recommendations.forEach(rec => {
      if (!combinedRecommendations.some(existing => existing.includes(rec.substring(0, 30)))) {
        combinedRecommendations.push(rec);
      }
    });
  }

  return {
    phq9,
    gad7,
    overallRiskLevel,
    requiresImmediateAttention,
    combinedRecommendations: combinedRecommendations.slice(0, 8), // Limit to top recommendations
  };
};

/**
 * CRIT-005 FIX: Get clinical severity label for display
 */
export const getClinicalSeverityLabel = (severity: ClinicalSeverity): string => {
  const labels: Record<ClinicalSeverity, string> = {
    'minimal': 'Minimal',
    'mild': 'Mild',
    'moderate': 'Moderate',
    'moderately-severe': 'Moderately Severe',
    'severe': 'Severe',
  };
  return labels[severity] || 'Unknown';
};

/**
 * CRIT-005 FIX: Get clinical color for severity visualization
 */
export const getClinicalSeverityColor = (severity: ClinicalSeverity): string => {
  const colors: Record<ClinicalSeverity, string> = {
    'minimal': '#4CAF50',       // Green
    'mild': '#8BC34A',          // Light green
    'moderate': '#FFC107',      // Amber
    'moderately-severe': '#FF9800', // Orange
    'severe': '#F44336',        // Red
  };
  return colors[severity] || '#9E9E9E';
};
