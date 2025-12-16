import { logger } from "@shared/utils/logger";

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// TypeScript type declarations
declare const __DEV__: boolean;

interface AssessmentQuestion {
  id: string;
  text: string;
  type: string;
  scale: {
    min: number;
    max: number;
    labels: string[];
  };
}

interface Assessment {
  id: string;
  title: string;
  description: string;
  questions: AssessmentQuestion[];
}

interface AssessmentResponses {
  [questionId: string]: number;
}

interface AssessmentResult {
  id: string;
  assessmentId: string;
  responses: AssessmentResponses;
  totalScore: number;
  completedAt: string;
  severity: string;
  recommendations: string[];
  _offline?: boolean;
}

// Mock assessment API service
const mockAssessmentAPI = {
  async submitAssessment(data: any): Promise<AssessmentResult> {
    if (__DEV__) {
      logger.debug("Mock assessment submission:", data);
    }
    throw new Error("API not available"); // Force fallback to local calculation
  },
  async getAssessmentQuestions(assessmentType: string): Promise<Assessment> {
    if (__DEV__) {
      logger.debug("Mock assessment questions fetch for:", assessmentType);
    }
    throw new Error("API not available"); // Force fallback to local mock data
  },
  async getAssessmentHistory(): Promise<AssessmentResult[]> {
    if (__DEV__) {
      logger.debug("Mock assessment history fetch");
    }
    return [];
  },
};

const assessmentAPI = mockAssessmentAPI;

// Async thunk for starting an assessment
export const startAssessment = createAsyncThunk<
  Assessment,
  string,
  { rejectValue: string }
>(
  "assessment/startAssessment",
  async (assessmentType: string, { rejectWithValue }) => {
    try {
      // Try to fetch from API first
      try {
        const assessment =
          await assessmentAPI.getAssessmentQuestions(assessmentType);
        return assessment;
      } catch (apiError) {
        // Fallback to mock data if API fails
        if (__DEV__) {
          logger.warn("[Assessment] API unavailable, using mock data");
        }
      }

      // Mock assessment data (fallback for offline use)
      await new Promise((resolve) => setTimeout(resolve, 500));

      // HIGH-003 FIX: Complete mock assessment data with all clinical questions
      // PHQ-9 requires 9 questions, GAD-7 requires 7 questions
      const PHQ9_SCALE = {
        min: 0,
        max: 3,
        labels: [
          "Not at all",
          "Several days",
          "More than half the days",
          "Nearly every day",
        ],
      };

      const GAD7_SCALE = {
        min: 0,
        max: 3,
        labels: [
          "Not at all",
          "Several days",
          "More than half the days",
          "Nearly every day",
        ],
      };

      const mockAssessments: Record<string, Assessment> = {
        phq9: {
          id: "phq9",
          title: "PHQ-9 Depression Assessment",
          description:
            "Patient Health Questionnaire-9 for depression screening",
          questions: [
            {
              id: "q1",
              text: "Little interest or pleasure in doing things",
              type: "scale",
              scale: PHQ9_SCALE,
            },
            {
              id: "q2",
              text: "Feeling down, depressed, or hopeless",
              type: "scale",
              scale: PHQ9_SCALE,
            },
            {
              id: "q3",
              text: "Trouble falling or staying asleep, or sleeping too much",
              type: "scale",
              scale: PHQ9_SCALE,
            },
            {
              id: "q4",
              text: "Feeling tired or having little energy",
              type: "scale",
              scale: PHQ9_SCALE,
            },
            {
              id: "q5",
              text: "Poor appetite or overeating",
              type: "scale",
              scale: PHQ9_SCALE,
            },
            // HIGH-003 FIX: Added missing questions 6-9 for complete PHQ-9
            {
              id: "q6",
              text: "Feeling bad about yourself — or that you are a failure or have let yourself or your family down",
              type: "scale",
              scale: PHQ9_SCALE,
            },
            {
              id: "q7",
              text: "Trouble concentrating on things, such as reading the newspaper or watching television",
              type: "scale",
              scale: PHQ9_SCALE,
            },
            {
              id: "q8",
              text: "Moving or speaking so slowly that other people could have noticed? Or the opposite — being so fidgety or restless that you have been moving around a lot more than usual",
              type: "scale",
              scale: PHQ9_SCALE,
            },
            {
              id: "q9",
              text: "Thoughts that you would be better off dead or of hurting yourself in some way",
              type: "scale",
              scale: PHQ9_SCALE,
            },
          ],
        },
        gad7: {
          id: "gad7",
          title: "GAD-7 Anxiety Assessment",
          description: "Generalized Anxiety Disorder-7 screening tool",
          questions: [
            {
              id: "q1",
              text: "Feeling nervous, anxious, or on edge",
              type: "scale",
              scale: GAD7_SCALE,
            },
            {
              id: "q2",
              text: "Not being able to stop or control worrying",
              type: "scale",
              scale: GAD7_SCALE,
            },
            {
              id: "q3",
              text: "Worrying too much about different things",
              type: "scale",
              scale: GAD7_SCALE,
            },
            // HIGH-003 FIX: Added missing questions 4-7 for complete GAD-7
            {
              id: "q4",
              text: "Trouble relaxing",
              type: "scale",
              scale: GAD7_SCALE,
            },
            {
              id: "q5",
              text: "Being so restless that it's hard to sit still",
              type: "scale",
              scale: GAD7_SCALE,
            },
            {
              id: "q6",
              text: "Becoming easily annoyed or irritable",
              type: "scale",
              scale: GAD7_SCALE,
            },
            {
              id: "q7",
              text: "Feeling afraid as if something awful might happen",
              type: "scale",
              scale: GAD7_SCALE,
            },
          ],
        },
      };

      return mockAssessments[assessmentType];
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error occurred";
      return rejectWithValue(errorMessage);
    }
  },
);

// Async thunk for submitting assessment
export const submitAssessment = createAsyncThunk<
  AssessmentResult,
  { assessmentId: string; responses: AssessmentResponses },
  { rejectValue: string }
>(
  "assessment/submitAssessment",
  async (
    {
      assessmentId,
      responses,
    }: { assessmentId: string; responses: AssessmentResponses },
    { rejectWithValue },
  ) => {
    try {
      // Try to submit to API first
      try {
        const result = await assessmentAPI.submitAssessment({
          assessmentId,
          responses,
        });
        return result;
      } catch (apiError) {
        // Fallback to local calculation if API fails
        logger.warn("[Assessment] API unavailable, calculating locally");
      }

      // Local calculation (fallback for offline use)
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Calculate score based on responses
      const totalScore = Object.values(responses).reduce(
        (sum: number, value: number) => sum + value,
        0,
      );

      // HIGH-003 FIX: Use clinically accurate severity thresholds
      // PHQ-9 (0-27): 0-4 Minimal, 5-9 Mild, 10-14 Moderate, 15-19 Moderately Severe, 20-27 Severe
      // GAD-7 (0-21): 0-4 Minimal, 5-9 Mild, 10-14 Moderate, 15-21 Severe
      let severity: string;
      if (assessmentId === "phq9") {
        // PHQ-9 severity thresholds (max score 27)
        if (totalScore <= 4) {
          severity = "Minimal";
        } else if (totalScore <= 9) {
          severity = "Mild";
        } else if (totalScore <= 14) {
          severity = "Moderate";
        } else if (totalScore <= 19) {
          severity = "Moderately Severe"; // HIGH-003 FIX: Added missing category
        } else {
          severity = "Severe";
        }
      } else if (assessmentId === "gad7") {
        // GAD-7 severity thresholds (max score 21)
        if (totalScore <= 4) {
          severity = "Minimal";
        } else if (totalScore <= 9) {
          severity = "Mild";
        } else if (totalScore <= 14) {
          severity = "Moderate";
        } else {
          severity = "Severe";
        }
      } else {
        // Generic fallback for other assessments
        if (totalScore < 5) {
          severity = "Minimal";
        } else if (totalScore < 10) {
          severity = "Mild";
        } else if (totalScore < 15) {
          severity = "Moderate";
        } else {
          severity = "Severe";
        }
      }

      const result: AssessmentResult = {
        id: Date.now().toString(),
        assessmentId,
        responses,
        totalScore,
        completedAt: new Date().toISOString(),
        severity,
        recommendations: generateRecommendations(totalScore, assessmentId),
        _offline: true, // Mark as calculated offline
      };

      return result;
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error occurred";
      return rejectWithValue(errorMessage);
    }
  },
);

// HIGH-003 FIX: Helper function to generate recommendations based on clinical score thresholds
const generateRecommendations = (
  score: number,
  assessmentType: string,
): string[] => {
  const recommendations: string[] = [];

  if (assessmentType === "phq9") {
    // PHQ-9 uses 0-27 scale with clinical thresholds
    if (score <= 4) {
      recommendations.push(
        "Your responses suggest minimal depressive symptoms. Continue with your current self-care routine.",
      );
    } else if (score <= 9) {
      recommendations.push(
        "Your responses suggest mild depressive symptoms. Consider incorporating mood-boosting activities.",
      );
      recommendations.push(
        "Regular exercise and social connection can be helpful.",
      );
    } else if (score <= 14) {
      recommendations.push(
        "Your responses suggest moderate depressive symptoms. Consider speaking with a healthcare provider.",
      );
      recommendations.push(
        "Cognitive behavioral therapy (CBT) may be beneficial.",
      );
    } else if (score <= 19) {
      // HIGH-003 FIX: Added "Moderately Severe" category recommendations
      recommendations.push(
        "Your responses suggest moderately severe depressive symptoms. Active treatment is strongly recommended.",
      );
      recommendations.push(
        "Please schedule an appointment with a mental health professional as soon as possible.",
      );
      recommendations.push(
        "Combination of therapy and medication is often most effective at this level.",
      );
    } else {
      recommendations.push(
        "Your responses suggest severe depressive symptoms. Please seek professional help as soon as possible.",
      );
      recommendations.push(
        "If you are having thoughts of self-harm, please reach out for immediate help: call 988 (Suicide & Crisis Lifeline).",
      );
      recommendations.push(
        "Combination treatment (medication plus psychotherapy) is strongly recommended.",
      );
    }
  } else if (assessmentType === "gad7") {
    // GAD-7 uses 0-21 scale with clinical thresholds
    if (score <= 4) {
      recommendations.push(
        "Your responses suggest minimal anxiety symptoms. Great job managing your anxiety!",
      );
    } else if (score <= 9) {
      recommendations.push(
        "Your responses suggest mild anxiety symptoms. Try relaxation techniques like deep breathing.",
      );
      recommendations.push(
        "Consider monitoring symptoms and reassessing in 2-4 weeks.",
      );
    } else if (score <= 14) {
      recommendations.push(
        "Your responses suggest moderate anxiety symptoms. Consider speaking with a healthcare provider.",
      );
      recommendations.push(
        "Mindfulness and stress management techniques may help.",
      );
      recommendations.push(
        "Evidence-based treatments like CBT are effective for moderate anxiety.",
      );
    } else {
      recommendations.push(
        "Your responses suggest severe anxiety symptoms. Please consider contacting a mental health professional.",
      );
      recommendations.push(
        "Both psychotherapy (especially CBT) and medication are effective treatment options.",
      );
      recommendations.push(
        "If anxiety is severely impacting your daily life, seek help promptly.",
      );
    }
  }

  return recommendations;
};

interface AvailableAssessment {
  id: string;
  title: string;
  description: string;
  duration: string;
  icon: string;
}

interface AssessmentState {
  currentAssessment: Assessment | null;
  currentQuestion: number;
  responses: AssessmentResponses;
  assessmentHistory: AssessmentResult[];
  availableAssessments: AvailableAssessment[];
  loading: boolean;
  error: string | null | undefined;
}

const initialState: AssessmentState = {
  currentAssessment: null,
  currentQuestion: 0,
  responses: {},
  assessmentHistory: [],
  availableAssessments: [
    {
      id: "phq9",
      title: "PHQ-9 Depression Assessment",
      description: "Screen for depression symptoms",
      duration: "5-10 minutes",
      icon: "🧠",
    },
    {
      id: "gad7",
      title: "GAD-7 Anxiety Assessment",
      description: "Screen for anxiety symptoms",
      duration: "3-5 minutes",
      icon: "😰",
    },
  ],
  loading: false,
  error: null,
};

const assessmentSlice = createSlice({
  name: "assessment",
  initialState,
  reducers: {
    setCurrentQuestion: (state, action) => {
      state.currentQuestion = action.payload;
    },
    setResponse: (state, action) => {
      const { questionId, response } = action.payload;
      state.responses[questionId] = response;
    },
    nextQuestion: (state) => {
      if (
        state.currentAssessment &&
        state.currentQuestion < state.currentAssessment.questions.length - 1
      ) {
        state.currentQuestion += 1;
      }
    },
    previousQuestion: (state) => {
      if (state.currentQuestion > 0) {
        state.currentQuestion -= 1;
      }
    },
    resetAssessment: (state) => {
      state.currentAssessment = null;
      state.currentQuestion = 0;
      state.responses = {};
    },
    clearAssessmentError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(startAssessment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(startAssessment.fulfilled, (state, action) => {
        state.loading = false;
        state.currentAssessment = action.payload;
        state.currentQuestion = 0;
        state.responses = {};
      })
      .addCase(startAssessment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(submitAssessment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(submitAssessment.fulfilled, (state, action) => {
        state.loading = false;
        state.assessmentHistory.unshift(action.payload);
        state.currentAssessment = null;
        state.currentQuestion = 0;
        state.responses = {};
      })
      .addCase(submitAssessment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const {
  setCurrentQuestion,
  setResponse,
  nextQuestion,
  previousQuestion,
  resetAssessment,
  clearAssessmentError,
} = assessmentSlice.actions;

export default assessmentSlice.reducer;
