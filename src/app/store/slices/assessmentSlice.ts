import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
// Mock assessment API service
const mockAssessmentAPI = {
  async submitAssessment(data) {
    console.log('Mock assessment submission:', data);
    throw new Error('API not available'); // Force fallback to local calculation
  },
  async getAssessmentQuestions(assessmentType) {
    console.log('Mock assessment questions fetch for:', assessmentType);
    throw new Error('API not available'); // Force fallback to local mock data
  },
  async getAssessmentHistory() {
    console.log('Mock assessment history fetch');
    return [];
  },
};

const assessmentAPI = mockAssessmentAPI;

// Async thunk for starting an assessment
export const startAssessment = createAsyncThunk(
  "assessment/startAssessment",
  async (assessmentType, { rejectWithValue }) => {
    try {
      // Try to fetch from API first
      try {
        const assessment = await assessmentAPI.getAssessmentQuestions(assessmentType);
        return assessment;
      } catch (apiError) {
        // Fallback to mock data if API fails
        console.warn('[Assessment] API unavailable, using mock data');
      }

      // Mock assessment data (fallback for offline use)
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Mock assessment data
      const mockAssessments = {
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
      return rejectWithValue(error.message);
    }
  },
);

// Async thunk for submitting assessment
export const submitAssessment = createAsyncThunk(
  "assessment/submitAssessment",
  async ({ assessmentId, responses }, { rejectWithValue }) => {
    try {
      // Try to submit to API first
      try {
        const result = await assessmentAPI.submitAssessment(assessmentId, responses);
        return result;
      } catch (apiError) {
        // Fallback to local calculation if API fails
        console.warn('[Assessment] API unavailable, calculating locally');
      }

      // Local calculation (fallback for offline use)
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Calculate score based on responses
      const totalScore = Object.values(responses).reduce(
        (sum, value) => sum + value,
        0,
      );

      let severity;
      if (totalScore < 5) {
        severity = "Minimal";
      } else if (totalScore < 10) {
        severity = "Mild";
      } else if (totalScore < 15) {
        severity = "Moderate";
      } else {
        severity = "Severe";
      }

      const result = {
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
      return rejectWithValue(error.message);
    }
  },
);

// Helper function to generate recommendations based on score
const generateRecommendations = (score, assessmentType) => {
  const recommendations = [];

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

const initialState = {
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
