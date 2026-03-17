export interface AssessmentAnswers {
  primaryConcern?: string;
  age?: number;
  gender?: string;
  moodLevel?: string;
  stressTriggers?: string[];
  mentalState?: string;
  sadnessFrequency?: string;
  hasMedications?: boolean;
  medicationDetails?: string;
  hasTherapist?: boolean;
  exerciseFrequency?: string;
  stressLevel?: number;
  otherSymptoms?: string[];
}

export interface ScoreResult {
  score: number;
  category: 'healthy' | 'unstable' | 'critical';
  breakdown: Array<{ label: string; score: number; color: string }>;
  recommendations: string[];
}

export function calculateSolaceScore(answers: AssessmentAnswers): ScoreResult {
  let totalScore = 50; // Base score

  // Mood adjustment
  const moodScores: Record<string, number> = {
    'overjoyed': 20, 'happy': 15, 'neutral': 0, 'sad': -15, 'depressed': -25
  };
  if (answers.moodLevel) totalScore += moodScores[answers.moodLevel] ?? 0;

  // Stress adjustment (1=low stress, 5=high stress)
  if (answers.stressLevel) totalScore -= (answers.stressLevel - 1) * 5;

  // Therapy positive factor
  if (answers.hasTherapist) totalScore += 5;

  // Exercise positive factor
  const exerciseScores: Record<string, number> = {
    'daily': 15, 'often': 10, 'sometimes': 5, 'rarely': -5, 'never': -10
  };
  if (answers.exerciseFrequency) totalScore += exerciseScores[answers.exerciseFrequency] ?? 0;

  // Sadness frequency
  const sadnessScores: Record<string, number> = {
    'never': 10, 'rarely': 5, 'sometimes': 0, 'often': -10, 'always': -20
  };
  if (answers.sadnessFrequency) totalScore += sadnessScores[answers.sadnessFrequency] ?? 0;

  // Symptoms penalty
  if (answers.otherSymptoms) totalScore -= answers.otherSymptoms.length * 3;

  // Clamp to 0-100
  totalScore = Math.max(0, Math.min(100, totalScore));

  // Determine category
  const category = totalScore >= 70 ? 'healthy' : totalScore >= 40 ? 'unstable' : 'critical';

  // Build breakdown
  const moodScore = Math.max(0, Math.min(100, 50 + (moodScores[answers.moodLevel ?? 'neutral'] ?? 0) * 2));
  const stressScore = Math.max(0, Math.min(100, 100 - ((answers.stressLevel ?? 3) - 1) * 20));
  const lifestyleScore = Math.max(0, Math.min(100, 50 + (exerciseScores[answers.exerciseFrequency ?? 'sometimes'] ?? 0) * 2 + (answers.hasTherapist ? 10 : 0)));

  const breakdown = [
    { label: 'Mood & Emotions', score: moodScore, color: moodScore >= 70 ? '#9AAD5C' : moodScore >= 40 ? '#E8853A' : '#EF4444' },
    { label: 'Stress Management', score: stressScore, color: stressScore >= 70 ? '#9AAD5C' : stressScore >= 40 ? '#E8853A' : '#EF4444' },
    { label: 'Lifestyle & Support', score: lifestyleScore, color: lifestyleScore >= 70 ? '#9AAD5C' : lifestyleScore >= 40 ? '#E8853A' : '#EF4444' },
  ];

  // Generate recommendations
  const recommendations: string[] = [];
  if (category === 'critical') {
    recommendations.push('Consider reaching out to a mental health professional');
    recommendations.push('Practice daily breathing exercises for stress relief');
    recommendations.push('Establish a consistent sleep routine');
  } else if (category === 'unstable') {
    recommendations.push('Try incorporating mindfulness into your daily routine');
    recommendations.push('Regular physical activity can improve your mood');
    recommendations.push('Consider journaling to track your emotional patterns');
  } else {
    recommendations.push('Keep up your great mental health habits');
    recommendations.push('Explore new mindfulness techniques to stay balanced');
    recommendations.push('Share your wellness strategies with the community');
  }

  return { score: totalScore, category, breakdown, recommendations };
}
