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
      console.log("Mock assessment submission:", data);
    }
    throw new Error("API not available"); // Force fallback to local calculation
  },
  async getAssessmentQuestions(assessmentType: string): Promise<Assessment> {
    if (__DEV__) {
      console.log("Mock assessment questions fetch for:", assessmentType);
    }
    throw new Error("API not available"); // Force fallback to local mock data
  },
  async getAssessmentHistory(): Promise<AssessmentResult[]> {
    if (__DEV__) {
      console.log("Mock assessment history fetch");
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
          console.warn("[Assessment] API unavailable, using mock data");
        }
      }

      // Mock assessment data (fallback for offline use)
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Mock assessment data
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
              scale: {
                min: 0,
                max: 3,
                labels: [
                  "Not at all",
                  "Several days",
                  "More than half the days",
                  "Nearly every day",
                ],
              },
            },
            {
              id: "q2",
              text: "Feeling down, depressed, or hopeless",
              type: "scale",
              scale: {
                min: 0,
                max: 3,
                labels: [
                  "Not at all",
                  "Several days",
                  "More than half the days",
                  "Nearly every day",
                ],
              },
            },
            {
              id: "q3",
              text: "Trouble falling or staying asleep, or sleeping too much",
              type: "scale",
              scale: {
                min: 0,
                max: 3,
                labels: [
                  "Not at all",
                  "Several days",
                  "More than half the days",
                  "Nearly every day",
                ],
              },
            },
            {
              id: "q4",
              text: "Feeling tired or having little energy",
              type: "scale",
              scale: {
                min: 0,
                max: 3,
                labels: [
                  "Not at all",
                  "Several days",
                  "More than half the days",
                  "Nearly every day",
                ],
              },
            },
            {
              id: "q5",
              text: "Poor appetite or overeating",
              type: "scale",
              scale: {
                min: 0,
                max: 3,
                labels: [
                  "Not at all",
                  "Several days",
                  "More than half the days",
                  "Nearly every day",
                ],
              },
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
              scale: {
                min: 0,
                max: 3,
                labels: [
                  "Not at all",
                  "Several days",
                  "More than half the days",
                  "Nearly every day",
                ],
              },
            },
            {
              id: "q2",
              text: "Not being able to stop or control worrying",
              type: "scale",
              scale: {
                min: 0,
                max: 3,
                labels: [
                  "Not at all",
                  "Several days",
                  "More than half the days",
                  "Nearly every day",
                ],
              },
            },
            {
              id: "q3",
              text: "Worrying too much about different things",
              type: "scale",
              scale: {
                min: 0,
                max: 3,
                labels: [
                  "Not at all",
                  "Several days",
                  "More than half the days",
                  "Nearly every day",
                ],
              },
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
        console.warn("[Assessment] API unavailable, calculating locally");
      }

      // Local calculation (fallback for offline use)
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Calculate score based on responses
      const totalScore = Object.values(responses).reduce(
        (sum: number, value: number) => sum + value,
        0,
      );

      let severity: string;
      if (totalScore < 5) {
        severity = "Minimal";
      } else if (totalScore < 10) {
        severity = "Mild";
      } else if (totalScore < 15) {
        severity = "Moderate";
      } else {
        severity = "Severe";
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

// Helper function to generate recommendations based on score
const generateRecommendations = (
  score: number,
  assessmentType: string,
): string[] => {
  const recommendations: string[] = [];

  if (assessmentType === "phq9") {
    if (score < 5) {
      recommendations.push(
        "Your responses suggest minimal depressive symptoms. Continue with your current self-care routine.",
      );
    } else if (score < 10) {
      recommendations.push(
        "Your responses suggest mild depressive symptoms. Consider incorporating mood-boosting activities.",
      );
      recommendations.push(
        "Regular exercise and social connection can be helpful.",
      );
    } else if (score < 15) {
      recommendations.push(
        "Your responses suggest moderate depressive symptoms. Consider speaking with a healthcare provider.",
      );
      recommendations.push(
        "Cognitive behavioral therapy (CBT) may be beneficial.",
      );
    } else {
      recommendations.push(
        "Your responses suggest severe depressive symptoms. Please consider contacting a mental health professional.",
      );
      recommendations.push(
        "If you are having thoughts of self-harm, please reach out for immediate help.",
      );
    }
  } else if (assessmentType === "gad7") {
    if (score < 5) {
      recommendations.push(
        "Your responses suggest minimal anxiety symptoms. Great job managing your anxiety!",
      );
    } else if (score < 10) {
      recommendations.push(
        "Your responses suggest mild anxiety symptoms. Try relaxation techniques like deep breathing.",
      );
    } else if (score < 15) {
      recommendations.push(
        "Your responses suggest moderate anxiety symptoms. Consider speaking with a healthcare provider.",
      );
      recommendations.push(
        "Mindfulness and stress management techniques may help.",
      );
    } else {
      recommendations.push(
        "Your responses suggest severe anxiety symptoms. Please consider contacting a mental health professional.",
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
