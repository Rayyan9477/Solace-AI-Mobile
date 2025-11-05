import { configureStore } from "@reduxjs/toolkit";

import assessmentSlice, {
  startAssessment,
  submitAssessment,
  setCurrentQuestion,
  setResponse,
  nextQuestion,
  previousQuestion,
  resetAssessment,
  clearAssessmentError,
} from "../../../../src/app/store/slices/assessmentSlice";

describe("Assessment Slice", () => {
  let store;

  beforeEach(() => {
    store = configureStore({
      reducer: {
        assessment: assessmentSlice,
      },
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("Initial State", () => {
    test("should return the initial state", () => {
      const state = store.getState().assessment;
      expect(state).toEqual({
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
      });
    });
  });

  describe("Reducers", () => {
    describe("setCurrentQuestion", () => {
      test("should set current question index", () => {
        store.dispatch(setCurrentQuestion(2));

        const state = store.getState().assessment;
        expect(state.currentQuestion).toBe(2);
      });
    });

    describe("setResponse", () => {
      test("should set response for a question", () => {
        store.dispatch(
          setResponse({
            questionId: "q1",
            response: 2,
          }),
        );

        const state = store.getState().assessment;
        expect(state.responses.q1).toBe(2);
      });

      test("should update existing response", () => {
        store.dispatch(
          setResponse({
            questionId: "q1",
            response: 1,
          }),
        );
        store.dispatch(
          setResponse({
            questionId: "q1",
            response: 3,
          }),
        );

        const state = store.getState().assessment;
        expect(state.responses.q1).toBe(3);
      });
    });

    describe("nextQuestion", () => {
      test("should move to next question when assessment is loaded", () => {
        // First start an assessment to set currentAssessment
        store.dispatch({
          type: "assessment/startAssessment/fulfilled",
          payload: {
            id: "phq9",
            questions: [
              {
                id: "q1",
                text: "Question 1",
                type: "scale",
                scale: { min: 0, max: 3, labels: [] },
              },
              {
                id: "q2",
                text: "Question 2",
                type: "scale",
                scale: { min: 0, max: 3, labels: [] },
              },
              {
                id: "q3",
                text: "Question 3",
                type: "scale",
                scale: { min: 0, max: 3, labels: [] },
              },
            ],
          },
        });

        store.dispatch(nextQuestion());

        const state = store.getState().assessment;
        expect(state.currentQuestion).toBe(1);
      });

      test("should not exceed last question", () => {
        store.dispatch({
          type: "assessment/startAssessment/fulfilled",
          payload: {
            id: "phq9",
            questions: [
              {
                id: "q1",
                text: "Question 1",
                type: "scale",
                scale: { min: 0, max: 3, labels: [] },
              },
              {
                id: "q2",
                text: "Question 2",
                type: "scale",
                scale: { min: 0, max: 3, labels: [] },
              },
            ],
          },
        });

        // Move to last question
        store.dispatch(setCurrentQuestion(1));
        store.dispatch(nextQuestion());

        const state = store.getState().assessment;
        expect(state.currentQuestion).toBe(1); // Should stay at last question
      });

      test("should not move if no assessment loaded", () => {
        store.dispatch(nextQuestion());

        const state = store.getState().assessment;
        expect(state.currentQuestion).toBe(0);
      });
    });

    describe("previousQuestion", () => {
      test("should move to previous question", () => {
        store.dispatch(setCurrentQuestion(2));
        store.dispatch(previousQuestion());

        const state = store.getState().assessment;
        expect(state.currentQuestion).toBe(1);
      });

      test("should not go below first question", () => {
        store.dispatch(setCurrentQuestion(0));
        store.dispatch(previousQuestion());

        const state = store.getState().assessment;
        expect(state.currentQuestion).toBe(0);
      });
    });

    describe("resetAssessment", () => {
      test("should reset all assessment state", () => {
        // Set up some state
        store.dispatch({
          type: "assessment/startAssessment/fulfilled",
          payload: { id: "phq9", questions: [] },
        });
        store.dispatch(setCurrentQuestion(2));
        store.dispatch(setResponse({ questionId: "q1", response: 2 }));

        // Reset
        store.dispatch(resetAssessment());

        const state = store.getState().assessment;
        expect(state.currentAssessment).toBeNull();
        expect(state.currentQuestion).toBe(0);
        expect(state.responses).toEqual({});
      });
    });

    describe("clearAssessmentError", () => {
      test("should clear error state", () => {
        // Set an error
        store.dispatch({
          type: "assessment/startAssessment/rejected",
          payload: "Test error",
        });

        let state = store.getState().assessment;
        expect(state.error).toBe("Test error");

        store.dispatch(clearAssessmentError());
        state = store.getState().assessment;
        expect(state.error).toBeNull();
      });
    });
  });

  describe("Async Thunks", () => {
    describe("startAssessment", () => {
      test("should handle successful assessment start", async () => {
        const mockAssessment = {
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
        };

        // Mock the API call
        global.fetch = jest.fn(() =>
          Promise.resolve({
            ok: true,
            json: () => Promise.resolve(mockAssessment),
          }),
        );

        await store.dispatch(startAssessment("phq9"));

        const state = store.getState().assessment;
        expect(state.loading).toBe(false);
        expect(state.error).toBeNull();
        expect(state.currentAssessment).toEqual(mockAssessment);
        expect(state.currentQuestion).toBe(0);
        expect(state.responses).toEqual({});
      });

      test("should fallback to mock data when API fails", async () => {
        // Mock API failure
        global.fetch = jest.fn(() => Promise.reject(new Error("API Error")));

        await store.dispatch(startAssessment("phq9"));

        const state = store.getState().assessment;
        expect(state.loading).toBe(false);
        expect(state.error).toBeNull(); // Should succeed with mock data
        expect(state.currentAssessment).toBeTruthy();
        expect(state.currentAssessment.id).toBe("phq9");
        expect(state.currentAssessment.questions).toBeTruthy();
      });

      test("should handle assessment start failure", async () => {
        // Mock complete failure - this should still succeed with mock data
        global.fetch = jest.fn(() =>
          Promise.reject(new Error("Network Error")),
        );

        await store.dispatch(startAssessment("phq9"));

        const state = store.getState().assessment;
        expect(state.loading).toBe(false);
        expect(state.error).toBeNull(); // Should succeed with fallback data
        expect(state.currentAssessment).toBeTruthy();
        expect(state.currentAssessment.id).toBe("phq9");
      });

      test("should set loading state during assessment start", () => {
        store.dispatch(startAssessment.pending());

        const state = store.getState().assessment;
        expect(state.loading).toBe(true);
        expect(state.error).toBeNull();
      });
    });

    describe("submitAssessment", () => {
      test("should handle successful assessment submission", async () => {
        const mockResponses = { q1: 1, q2: 2, q3: 0 };

        // Mock API failure to trigger local calculation
        global.fetch = jest.fn().mockRejectedValue(new Error("API Error"));

        await store.dispatch(
          submitAssessment({
            assessmentId: "phq9",
            responses: mockResponses,
          }),
        );

        const state = store.getState().assessment;
        expect(state.loading).toBe(false);
        expect(state.error).toBeNull();
        expect(state.assessmentHistory).toHaveLength(1);
        expect(state.assessmentHistory[0]).toMatchObject({
          assessmentId: "phq9",
          responses: mockResponses,
          totalScore: 3,
          severity: "Minimal",
          recommendations: expect.any(Array),
          _offline: true,
        });
        expect(state.assessmentHistory[0]).toHaveProperty("id");
        expect(state.assessmentHistory[0]).toHaveProperty("completedAt");
        expect(state.currentAssessment).toBeNull();
        expect(state.currentQuestion).toBe(0);
        expect(state.responses).toEqual({});
      });

      test("should calculate correct severity levels", async () => {
        const testCases = [
          {
            responses: { q1: 0, q2: 0, q3: 0 },
            expectedSeverity: "Minimal",
            totalScore: 0,
          },
          {
            responses: { q1: 1, q2: 1, q3: 1 },
            expectedSeverity: "Minimal",
            totalScore: 3,
          },
          {
            responses: { q1: 2, q2: 2, q3: 2 },
            expectedSeverity: "Mild",
            totalScore: 6,
          },
          {
            responses: { q1: 3, q2: 3, q3: 3 },
            expectedSeverity: "Mild",
            totalScore: 9,
          },
        ];

        for (const { responses, expectedSeverity, totalScore } of testCases) {
          // Reset store for each test
          store = configureStore({
            reducer: {
              assessment: assessmentSlice,
            },
          });

          global.fetch = jest.fn().mockRejectedValue(new Error("API Error"));

          await store.dispatch(
            submitAssessment({
              assessmentId: "phq9",
              responses,
            }),
          );

          const state = store.getState().assessment;
          expect(state.assessmentHistory[0].severity).toBe(expectedSeverity);
          expect(state.assessmentHistory[0].totalScore).toBe(totalScore);
        }
      });

      test("should generate appropriate recommendations for PHQ-9", async () => {
        global.fetch = jest.fn().mockRejectedValue(new Error("API Error"));

        await store.dispatch(
          submitAssessment({
            assessmentId: "phq9",
            responses: { q1: 3, q2: 3, q3: 3 }, // Moderate score = 9
          }),
        );

        const state = store.getState().assessment;
        const recommendations = state.assessmentHistory[0].recommendations;
        expect(recommendations).toContain(
          "Your responses suggest mild depressive symptoms. Consider incorporating mood-boosting activities.",
        );
        expect(recommendations).toContain(
          "Regular exercise and social connection can be helpful.",
        );
      });

      test("should generate appropriate recommendations for GAD-7", async () => {
        global.fetch = jest.fn().mockRejectedValue(new Error("API Error"));

        await store.dispatch(
          submitAssessment({
            assessmentId: "gad7",
            responses: { q1: 3, q2: 3, q3: 3 }, // Moderate score = 9
          }),
        );

        const state = store.getState().assessment;
        const recommendations = state.assessmentHistory[0].recommendations;
        expect(recommendations).toContain(
          "Your responses suggest mild anxiety symptoms. Try relaxation techniques like deep breathing.",
        );
      });

      test("should handle submission failure gracefully", async () => {
        // Even with API failure, local calculation should work
        global.fetch = jest.fn().mockRejectedValue(new Error("Network Error"));

        await store.dispatch(
          submitAssessment({
            assessmentId: "phq9",
            responses: { q1: 1 },
          }),
        );

        const state = store.getState().assessment;
        expect(state.loading).toBe(false);
        expect(state.error).toBeNull(); // Should succeed with local calculation
        expect(state.assessmentHistory).toHaveLength(1);
        expect(state.assessmentHistory[0]._offline).toBe(true);
      });

      test("should set loading state during submission", () => {
        store.dispatch(submitAssessment.pending());

        const state = store.getState().assessment;
        expect(state.loading).toBe(true);
        expect(state.error).toBeNull();
      });
    });
  });

  describe("Integration Tests", () => {
    test("should maintain state consistency across assessment flow", async () => {
      // Start assessment
      global.fetch = jest.fn().mockRejectedValue(new Error("API Error"));
      await store.dispatch(startAssessment("phq9"));

      let state = store.getState().assessment;
      expect(state.currentAssessment).toBeTruthy();
      expect(state.currentQuestion).toBe(0);

      // Answer questions
      store.dispatch(setResponse({ questionId: "q1", response: 2 }));
      store.dispatch(setResponse({ questionId: "q2", response: 1 }));
      store.dispatch(nextQuestion());

      state = store.getState().assessment;
      expect(state.currentQuestion).toBe(1);
      expect(state.responses).toEqual({ q1: 2, q2: 1 });

      // Submit assessment
      await store.dispatch(
        submitAssessment({
          assessmentId: "phq9",
          responses: state.responses,
        }),
      );

      state = store.getState().assessment;
      expect(state.currentAssessment).toBeNull();
      expect(state.currentQuestion).toBe(0);
      expect(state.responses).toEqual({});
      expect(state.assessmentHistory).toHaveLength(1);
    });

    test("should handle assessment reset mid-flow", async () => {
      // Start assessment
      global.fetch = jest.fn().mockRejectedValue(new Error("API Error"));
      await store.dispatch(startAssessment("phq9"));

      // Answer some questions
      store.dispatch(setResponse({ questionId: "q1", response: 2 }));
      store.dispatch(setCurrentQuestion(2));

      // Reset
      store.dispatch(resetAssessment());

      const state = store.getState().assessment;
      expect(state.currentAssessment).toBeNull();
      expect(state.currentQuestion).toBe(0);
      expect(state.responses).toEqual({});
    });

    test("should track multiple completed assessments", async () => {
      global.fetch = jest.fn().mockRejectedValue(new Error("API Error"));

      // Complete first assessment
      await store.dispatch(startAssessment("phq9"));
      await store.dispatch(
        submitAssessment({
          assessmentId: "phq9",
          responses: { q1: 1, q2: 1 },
        }),
      );

      // Complete second assessment
      await store.dispatch(startAssessment("gad7"));
      await store.dispatch(
        submitAssessment({
          assessmentId: "gad7",
          responses: { q1: 2, q2: 2 },
        }),
      );

      const state = store.getState().assessment;
      expect(state.assessmentHistory).toHaveLength(2);
      expect(state.assessmentHistory[0].assessmentId).toBe("gad7");
      expect(state.assessmentHistory[1].assessmentId).toBe("phq9");
    });
  });

  describe("Available Assessments", () => {
    test("should include all predefined assessments", () => {
      const state = store.getState().assessment;

      expect(state.availableAssessments).toHaveLength(2);
      expect(state.availableAssessments).toContainEqual({
        id: "phq9",
        title: "PHQ-9 Depression Assessment",
        description: "Screen for depression symptoms",
        duration: "5-10 minutes",
        icon: "🧠",
      });
      expect(state.availableAssessments).toContainEqual({
        id: "gad7",
        title: "GAD-7 Anxiety Assessment",
        description: "Screen for anxiety symptoms",
        duration: "3-5 minutes",
        icon: "😰",
      });
    });
  });
});
