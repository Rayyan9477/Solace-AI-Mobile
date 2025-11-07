import AsyncStorage from "@react-native-async-storage/async-storage";

import therapyReducer, {
  startSession,
  endSession,
  addMessage,
  updateMessage,
  startExercise,
  completeExercise,
  setInteractionMode,
  addSessionTag,
  removeSessionTag,
  setSessionMood,
  updateSessionNotes,
  updatePreferences,
  addEmergencyContact,
  removeEmergencyContact,
  updateInsights,
  addProgressNote,
  addAchievement,
  clearError,
  setError,
  saveTherapySession,
  loadTherapySession,
  loadTherapyHistory,
  saveTherapyPreferences,
  loadTherapyPreferences,
} from "../../../../src/app/store/slices/therapySlice";

// Mock AsyncStorage
jest.mock("@react-native-async-storage/async-storage", () => ({
  setItem: jest.fn(),
  getItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
}));

describe("therapySlice", () => {
  const initialState = {
    currentSession: {
      sessionId: null,
      isActive: false,
      startTime: null,
      endTime: null,
      duration: 0,
      messages: [],
      exercisesCompleted: [],
      currentExercise: null,
      interactionMode: "text",
      mood: null,
      tags: [],
      notes: "",
      isPaused: false,
    },
    sessionHistory: [],
    preferences: {
      preferredInteractionMode: "text",
      enableVoiceRecording: true,
      sessionReminders: true,
      reminderTime: "19:00",
      emergencyContacts: [],
      crisisResources: [
        {
          name: "988 Suicide & Crisis Lifeline",
          number: "988",
          description: "24/7 suicide prevention and crisis support",
          type: "crisis",
        },
        {
          name: "Crisis Text Line",
          number: "741741",
          description: "Text HOME to 741741 for crisis support",
          type: "text",
        },
      ],
      dataRetention: 90,
      shareDataForResearch: false,
    },
    insights: {
      totalSessions: 0,
      totalDuration: 0,
      averageSessionLength: 0,
      mostUsedExercises: [],
      moodTrends: [],
      progressNotes: [],
      achievements: [],
    },
    loading: false,
    error: null,
    sessionSaving: false,
    preferencesLoading: false,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should return the initial state", () => {
    expect(therapyReducer(undefined, { type: undefined })).toEqual(
      initialState,
    );
  });

  describe("startSession", () => {
    it("should start a new session", () => {
      const action = startSession({
        sessionId: "session-123",
        startTime: "2023-01-01T10:00:00.000Z",
      });

      const result = therapyReducer(initialState, action);

      expect(result.currentSession).toEqual({
        sessionId: "session-123",
        isActive: true,
        startTime: "2023-01-01T10:00:00.000Z",
        endTime: null,
        duration: 0,
        messages: [],
        exercisesCompleted: [],
        currentExercise: null,
        interactionMode: "text",
        mood: null,
        tags: [],
        notes: "",
        isPaused: false,
      });
      expect(result.error).toBe(null);
    });
  });

  describe("endSession", () => {
    it("should end an active session", () => {
      const stateWithActiveSession = {
        ...initialState,
        currentSession: {
          ...initialState.currentSession,
          sessionId: "session-123",
          isActive: true,
          startTime: "2023-01-01T10:00:00.000Z",
        },
      };

      const action = endSession({
        endTime: "2023-01-01T10:30:00.000Z",
        mood: "better",
        notes: "Good session",
      });

      const result = therapyReducer(stateWithActiveSession, action);

      expect(result.currentSession.isActive).toBe(false);
      expect(result.currentSession.endTime).toBe("2023-01-01T10:30:00.000Z");
      expect(result.currentSession.duration).toBe(1800); // 30 minutes in seconds
      expect(result.currentSession.mood).toBe("better");
      expect(result.currentSession.notes).toBe("Good session");
    });

    it("should not end an inactive session", () => {
      const action = endSession({ mood: "good" });
      const result = therapyReducer(initialState, action);

      expect(result.currentSession.isActive).toBe(false);
    });
  });

  describe("addMessage", () => {
    it("should add a message to the current session", () => {
      const stateWithSession = {
        ...initialState,
        currentSession: {
          ...initialState.currentSession,
          sessionId: "session-123",
          isActive: true,
        },
      };

      const action = addMessage({
        id: "msg-1",
        text: "Hello",
        isUser: true,
      });

      const result = therapyReducer(stateWithSession, action);

      expect(result.currentSession.messages).toHaveLength(1);
      expect(result.currentSession.messages[0]).toMatchObject({
        id: "msg-1",
        text: "Hello",
        isUser: true,
      });
    });

    it("should add timestamp if not provided", () => {
      const stateWithSession = {
        ...initialState,
        currentSession: {
          ...initialState.currentSession,
          sessionId: "session-123",
          isActive: true,
        },
      };

      const action = addMessage({
        id: "msg-1",
        text: "Hello",
        isUser: true,
      });

      const result = therapyReducer(stateWithSession, action);

      expect(result.currentSession.messages[0].timestamp).toBeDefined();
    });
  });

  describe("updateMessage", () => {
    it("should update an existing message", () => {
      const stateWithMessages = {
        ...initialState,
        currentSession: {
          ...initialState.currentSession,
          messages: [
            {
              id: "msg-1",
              text: "Hello",
              isUser: true,
              timestamp: "2023-01-01T10:00:00.000Z",
            },
          ],
        },
      };

      const action = updateMessage({
        messageId: "msg-1",
        updates: { text: "Hello World" },
      });

      const result = therapyReducer(stateWithMessages, action);

      expect(result.currentSession.messages[0].text).toBe("Hello World");
    });
  });

  describe("exercise management", () => {
    it("should start an exercise", () => {
      const action = startExercise("breathing-exercise-1");
      const result = therapyReducer(initialState, action);

      expect(result.currentSession.currentExercise).toBe(
        "breathing-exercise-1",
      );
    });

    it("should complete an exercise", () => {
      const stateWithExercise = {
        ...initialState,
        currentSession: {
          ...initialState.currentSession,
          currentExercise: "breathing-exercise-1",
        },
      };

      const action = completeExercise({
        exerciseId: "breathing-exercise-1",
        reflection: "Very helpful",
      });

      const result = therapyReducer(stateWithExercise, action);

      expect(result.currentSession.exercisesCompleted).toHaveLength(1);
      expect(result.currentSession.exercisesCompleted[0]).toMatchObject({
        exerciseId: "breathing-exercise-1",
        reflection: "Very helpful",
      });
      expect(result.currentSession.currentExercise).toBe(null);
    });
  });

  describe("session metadata", () => {
    it("should set interaction mode", () => {
      const action = setInteractionMode("voice");
      const result = therapyReducer(initialState, action);

      expect(result.currentSession.interactionMode).toBe("voice");
    });

    it("should add session tag", () => {
      const action = addSessionTag("anxiety");
      const result = therapyReducer(initialState, action);

      expect(result.currentSession.tags).toContain("anxiety");
    });

    it("should not add duplicate tags", () => {
      const stateWithTag = {
        ...initialState,
        currentSession: {
          ...initialState.currentSession,
          tags: ["anxiety"],
        },
      };

      const action = addSessionTag("anxiety");
      const result = therapyReducer(stateWithTag, action);

      expect(result.currentSession.tags).toEqual(["anxiety"]);
    });

    it("should remove session tag", () => {
      const stateWithTags = {
        ...initialState,
        currentSession: {
          ...initialState.currentSession,
          tags: ["anxiety", "stress"],
        },
      };

      const action = removeSessionTag("anxiety");
      const result = therapyReducer(stateWithTags, action);

      expect(result.currentSession.tags).toEqual(["stress"]);
    });

    it("should set session mood", () => {
      const action = setSessionMood("improved");
      const result = therapyReducer(initialState, action);

      expect(result.currentSession.mood).toBe("improved");
    });

    it("should update session notes", () => {
      const action = updateSessionNotes("Great progress today");
      const result = therapyReducer(initialState, action);

      expect(result.currentSession.notes).toBe("Great progress today");
    });
  });

  describe("preferences", () => {
    it("should update preferences", () => {
      const action = updatePreferences({
        preferredInteractionMode: "voice",
        sessionReminders: false,
      });

      const result = therapyReducer(initialState, action);

      expect(result.preferences.preferredInteractionMode).toBe("voice");
      expect(result.preferences.sessionReminders).toBe(false);
    });

    it("should add emergency contact", () => {
      const contact = { id: "1", name: "John Doe", phone: "123-456-7890" };
      const action = addEmergencyContact(contact);

      const result = therapyReducer(initialState, action);

      expect(result.preferences.emergencyContacts).toContain(contact);
    });

    it("should remove emergency contact", () => {
      const stateWithContacts = {
        ...initialState,
        preferences: {
          ...initialState.preferences,
          emergencyContacts: [
            { id: "1", name: "John Doe", phone: "123-456-7890" },
            { id: "2", name: "Jane Smith", phone: "098-765-4321" },
          ],
        },
      };

      const action = removeEmergencyContact("1");
      const result = therapyReducer(stateWithContacts, action);

      expect(result.preferences.emergencyContacts).toHaveLength(1);
      expect(result.preferences.emergencyContacts[0].id).toBe("2");
    });
  });

  describe("insights and progress", () => {
    it("should update insights", () => {
      const action = updateInsights({
        totalSessions: 10,
        totalDuration: 300,
      });

      const result = therapyReducer(initialState, action);

      expect(result.insights.totalSessions).toBe(10);
      expect(result.insights.totalDuration).toBe(300);
    });

    it("should add progress note", () => {
      const action = addProgressNote({
        note: "Making good progress",
        type: "positive",
      });

      const result = therapyReducer(initialState, action);

      expect(result.insights.progressNotes).toHaveLength(1);
      expect(result.insights.progressNotes[0]).toMatchObject({
        note: "Making good progress",
        type: "positive",
      });
    });

    it("should add achievement", () => {
      const action = addAchievement({
        id: "first-session",
        title: "First Session Completed",
        description: "Completed your first therapy session",
      });

      const result = therapyReducer(initialState, action);

      expect(result.insights.achievements).toHaveLength(1);
      expect(result.insights.achievements[0]).toMatchObject({
        id: "first-session",
        title: "First Session Completed",
        description: "Completed your first therapy session",
      });
    });
  });

  describe("error handling", () => {
    it("should set error", () => {
      const action = setError("Network error");
      const result = therapyReducer(initialState, action);

      expect(result.error).toBe("Network error");
    });

    it("should clear error", () => {
      const stateWithError = {
        ...initialState,
        error: "Some error",
      };

      const action = clearError();
      const result = therapyReducer(stateWithError, action);

      expect(result.error).toBe(null);
    });
  });

  describe("async thunks", () => {
    describe("saveTherapySession", () => {
      it("should save session successfully", async () => {
        const mockSessionData = {
          sessionId: "session-123",
          startTime: "2023-01-01T10:00:00.000Z",
          endTime: "2023-01-01T10:30:00.000Z",
          duration: 1800,
          messages: [{ id: "1", text: "Hello", isUser: true }],
          exercisesCompleted: [],
          mood: "better",
          tags: ["anxiety"],
        };

        AsyncStorage.setItem.mockResolvedValue();

        const dispatch = jest.fn();
        const thunk = saveTherapySession(mockSessionData);

        await thunk(dispatch, () => ({}), undefined);

        expect(dispatch).toHaveBeenCalledWith(
          expect.objectContaining({
            type: "therapy/saveSession/pending",
          }),
        );
        expect(dispatch).toHaveBeenCalledWith(
          expect.objectContaining({
            type: "therapy/saveSession/fulfilled",
            payload: expect.objectContaining({
              sessionData: mockSessionData,
            }),
          }),
        );
      });

      it("should handle save session error", async () => {
        const mockError = new Error("Storage error");
        AsyncStorage.setItem.mockRejectedValue(mockError);

        const dispatch = jest.fn();
        const thunk = saveTherapySession({ sessionId: "session-123" });

        await thunk(dispatch, () => ({}), undefined);

        expect(dispatch).toHaveBeenCalledWith(
          expect.objectContaining({
            type: "therapy/saveSession/pending",
          }),
        );
        expect(dispatch).toHaveBeenCalledWith(
          expect.objectContaining({
            type: "therapy/saveSession/rejected",
            payload: "Storage error",
          }),
        );
      });
    });

    describe("loadTherapySession", () => {
      it("should load session successfully", async () => {
        const mockSessionData = { sessionId: "session-123", messages: [] };
        AsyncStorage.getItem.mockResolvedValue(JSON.stringify(mockSessionData));

        const dispatch = jest.fn();
        const thunk = loadTherapySession("session-123");

        await thunk(dispatch, () => ({}), undefined);

        expect(dispatch).toHaveBeenCalledWith(
          expect.objectContaining({
            type: "therapy/loadSession/pending",
          }),
        );
        expect(dispatch).toHaveBeenCalledWith(
          expect.objectContaining({
            type: "therapy/loadSession/fulfilled",
            payload: mockSessionData,
          }),
        );
      });

      it("should return null for non-existent session", async () => {
        AsyncStorage.getItem.mockResolvedValue(null);

        const dispatch = jest.fn();
        const thunk = loadTherapySession("non-existent");

        await thunk(dispatch, () => ({}), undefined);

        expect(dispatch).toHaveBeenCalledWith(
          expect.objectContaining({
            type: "therapy/loadSession/fulfilled",
            payload: null,
          }),
        );
      });
    });

    describe("loadTherapyHistory", () => {
      it("should load history successfully", async () => {
        const mockHistory = [
          { sessionId: "session-1" },
          { sessionId: "session-2" },
        ];
        AsyncStorage.getItem.mockResolvedValue(JSON.stringify(mockHistory));

        const dispatch = jest.fn();
        const thunk = loadTherapyHistory();

        await thunk(dispatch, () => ({}), undefined);

        expect(dispatch).toHaveBeenCalledWith(
          expect.objectContaining({
            type: "therapy/loadHistory/fulfilled",
            payload: mockHistory,
          }),
        );
      });

      it("should return empty array when no history exists", async () => {
        AsyncStorage.getItem.mockResolvedValue(null);

        const dispatch = jest.fn();
        const thunk = loadTherapyHistory();

        await thunk(dispatch, () => ({}), undefined);

        expect(dispatch).toHaveBeenCalledWith(
          expect.objectContaining({
            type: "therapy/loadHistory/fulfilled",
            payload: [],
          }),
        );
      });
    });

    describe("saveTherapyPreferences", () => {
      it("should save preferences successfully", async () => {
        const mockPreferences = { preferredInteractionMode: "voice" };
        AsyncStorage.setItem.mockResolvedValue();

        const dispatch = jest.fn();
        const thunk = saveTherapyPreferences(mockPreferences);

        await thunk(dispatch, () => ({}), undefined);

        expect(dispatch).toHaveBeenCalledWith(
          expect.objectContaining({
            type: "therapy/savePreferences/fulfilled",
            payload: mockPreferences,
          }),
        );
      });
    });

    describe("loadTherapyPreferences", () => {
      it("should load preferences successfully", async () => {
        const mockPreferences = { preferredInteractionMode: "voice" };
        AsyncStorage.getItem.mockResolvedValue(JSON.stringify(mockPreferences));

        const dispatch = jest.fn();
        const thunk = loadTherapyPreferences();

        await thunk(dispatch, () => ({}), undefined);

        expect(dispatch).toHaveBeenCalledWith(
          expect.objectContaining({
            type: "therapy/loadPreferences/fulfilled",
            payload: mockPreferences,
          }),
        );
      });
    });
  });

  describe("extra reducers", () => {
    it("should handle saveTherapySession fulfilled", () => {
      const action = {
        type: "therapy/saveSession/fulfilled",
        payload: {
          sessionData: { sessionId: "session-123" },
          sessionSummary: {
            sessionId: "session-123",
            duration: 1800,
            messageCount: 5,
          },
        },
      };

      const result = therapyReducer(initialState, action);

      expect(result.sessionSaving).toBe(false);
      expect(result.sessionHistory).toHaveLength(1);
      expect(result.sessionHistory[0].sessionId).toBe("session-123");
      expect(result.insights.totalSessions).toBe(1);
      expect(result.insights.totalDuration).toBe(1800);
      expect(result.insights.averageSessionLength).toBe(1800);
    });

    it("should handle loadTherapyHistory fulfilled", () => {
      const mockHistory = [
        { sessionId: "session-1", duration: 1800 },
        { sessionId: "session-2", duration: 2400 },
      ];

      const action = {
        type: "therapy/loadHistory/fulfilled",
        payload: mockHistory,
      };

      const result = therapyReducer(initialState, action);

      expect(result.loading).toBe(false);
      expect(result.sessionHistory).toEqual(mockHistory);
      expect(result.insights.totalSessions).toBe(2);
      expect(result.insights.totalDuration).toBe(4200);
      expect(result.insights.averageSessionLength).toBe(2100);
    });

    it("should handle loadTherapyPreferences fulfilled", () => {
      const mockPreferences = { preferredInteractionMode: "voice" };

      const action = {
        type: "therapy/loadPreferences/fulfilled",
        payload: mockPreferences,
      };

      const result = therapyReducer(initialState, action);

      expect(result.preferencesLoading).toBe(false);
      expect(result.preferences.preferredInteractionMode).toBe("voice");
    });
  });
});
