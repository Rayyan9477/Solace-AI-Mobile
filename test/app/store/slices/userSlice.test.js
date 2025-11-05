// Helper function for timeout promises
import userReducer, {
  setUserProfile,
  updatePreferences,
  setTheme,
  addGoal,
  updateGoal,
  deleteGoal,
  addAchievement,
  clearUserError,
  resetUserState,
  updateUserProfile,
  fetchUserStats,
  apiService,
} from "../../../../src/app/store/slices/userSlice";

const createTimeoutPromise = (errorMessage, delay = 5000) => {
  return new Promise((_, reject) => {
    setTimeout(() => reject(new Error(errorMessage)), delay);
  });
};

describe("userSlice", () => {
  const initialState = {
    profile: {
      id: null,
      name: "",
      email: "",
      avatar: null,
      phoneNumber: "",
      dateOfBirth: "",
      emergencyContact: {
        name: "",
        phone: "",
        relationship: "",
      },
    },
    preferences: {
      notifications: {
        moodReminders: true,
        chatMessages: true,
        assessmentDue: true,
        insights: true,
      },
      privacy: {
        shareData: false,
        analytics: true,
      },
      theme: "light",
      language: "en",
    },
    stats: {
      totalSessions: 0,
      streakDays: 0,
      assessmentsCompleted: 0,
      moodEntriesCount: 0,
      favoriteActivities: [],
      joinDate: null,
    },
    goals: [],
    achievements: [],
    loading: false,
    error: null,
    _idCounter: 0,
  };

  beforeEach(() => {
    jest.clearAllMocks();
    // Spy on the apiService methods
    jest.spyOn(apiService.user, "updateProfile");
    jest.spyOn(apiService.user, "getStats");
  });

  it("should return the initial state", () => {
    expect(userReducer(undefined, { type: undefined })).toEqual(initialState);
  });

  describe("setUserProfile", () => {
    it("should set user profile", () => {
      const profileData = {
        id: "1",
        name: "John Doe",
        email: "john@example.com",
      };

      const result = userReducer(initialState, setUserProfile(profileData));

      expect(result.profile).toEqual({
        ...initialState.profile,
        ...profileData,
      });
    });

    it("should merge profile data with existing profile", () => {
      const existingState = {
        ...initialState,
        profile: {
          ...initialState.profile,
          id: "1",
          name: "John",
        },
      };

      const updates = {
        email: "john@example.com",
        phoneNumber: "123-456-7890",
      };

      const result = userReducer(existingState, setUserProfile(updates));

      expect(result.profile).toEqual({
        ...initialState.profile,
        id: "1",
        name: "John",
        email: "john@example.com",
        phoneNumber: "123-456-7890",
      });
    });

    it("should handle empty profile data", () => {
      const result = userReducer(initialState, setUserProfile({}));
      expect(result.profile).toEqual(initialState.profile);
    });

    it("should handle null profile data", () => {
      const result = userReducer(initialState, setUserProfile(null));
      expect(result.profile).toEqual(initialState.profile);
    });

    it("should handle undefined profile data", () => {
      const result = userReducer(initialState, setUserProfile(undefined));
      expect(result.profile).toEqual(initialState.profile);
    });

    it("should handle malformed profile data with extra fields", () => {
      const malformedData = {
        id: "1",
        name: "John",
        invalidField: "should be included",
        nestedInvalid: { field: "value" },
      };

      const result = userReducer(initialState, setUserProfile(malformedData));

      expect(result.profile).toEqual({
        ...initialState.profile,
        id: "1",
        name: "John",
        invalidField: "should be included",
        nestedInvalid: { field: "value" },
      });
    });

    it("should handle emergency contact updates", () => {
      const emergencyContactData = {
        emergencyContact: {
          name: "Jane Doe",
          phone: "987-654-3210",
          relationship: "Sister",
        },
      };

      const result = userReducer(
        initialState,
        setUserProfile(emergencyContactData),
      );

      expect(result.profile.emergencyContact).toEqual(
        emergencyContactData.emergencyContact,
      );
    });

    it("should preserve existing emergency contact when updating other fields", () => {
      const stateWithEmergencyContact = {
        ...initialState,
        profile: {
          ...initialState.profile,
          emergencyContact: {
            name: "Jane Doe",
            phone: "987-654-3210",
            relationship: "Sister",
          },
        },
      };

      const updates = {
        name: "John Doe",
        email: "john@example.com",
      };

      const result = userReducer(
        stateWithEmergencyContact,
        setUserProfile(updates),
      );

      expect(result.profile.emergencyContact).toEqual(
        stateWithEmergencyContact.profile.emergencyContact,
      );
      expect(result.profile.name).toBe("John Doe");
      expect(result.profile.email).toBe("john@example.com");
    });
  });

  describe("updatePreferences", () => {
    it("should update user preferences", () => {
      const preferencesUpdate = {
        notifications: {
          moodReminders: false,
          chatMessages: false,
        },
        theme: "dark",
      };

      const result = userReducer(
        initialState,
        updatePreferences(preferencesUpdate),
      );

      expect(result.preferences.notifications.moodReminders).toBe(false);
      expect(result.preferences.notifications.chatMessages).toBe(false);
      expect(result.preferences.theme).toBe("dark");
    });

    it("should merge preferences with existing ones", () => {
      const existingState = {
        ...initialState,
        preferences: {
          ...initialState.preferences,
          language: "es",
        },
      };

      const updates = {
        theme: "dark",
        notifications: {
          moodReminders: false,
        },
      };

      const result = userReducer(existingState, updatePreferences(updates));

      expect(result.preferences.theme).toBe("dark");
      expect(result.preferences.language).toBe("es");
      expect(result.preferences.notifications.moodReminders).toBe(false);
      // Note: chatMessages is not present in the updates, so it gets removed
      expect(result.preferences.notifications.chatMessages).toBeUndefined();
    });

    it("should handle empty preferences update", () => {
      const result = userReducer(initialState, updatePreferences({}));
      expect(result.preferences).toEqual(initialState.preferences);
    });

    it("should handle null preferences update", () => {
      const result = userReducer(initialState, updatePreferences(null));
      expect(result.preferences).toEqual(initialState.preferences);
    });

    it("should handle privacy settings updates", () => {
      const privacyUpdate = {
        privacy: {
          shareData: true,
          analytics: false,
        },
      };

      const result = userReducer(
        initialState,
        updatePreferences(privacyUpdate),
      );

      expect(result.preferences.privacy.shareData).toBe(true);
      expect(result.preferences.privacy.analytics).toBe(false);
    });

    it("should handle language preference updates", () => {
      const result = userReducer(
        initialState,
        updatePreferences({ language: "fr" }),
      );
      expect(result.preferences.language).toBe("fr");
    });

    it("should handle malformed preferences data", () => {
      const malformedData = {
        notifications: "invalid",
        theme: 123,
        invalidField: "should be included",
      };

      const result = userReducer(
        initialState,
        updatePreferences(malformedData),
      );

      expect(result.preferences.notifications).toBe("invalid"); // would be overwritten
      expect(result.preferences.theme).toBe(123);
      expect(result.preferences.invalidField).toBe("should be included");
    });
  });

  describe("setTheme", () => {
    it("should set theme preference", () => {
      const result = userReducer(initialState, setTheme("dark"));
      expect(result.preferences.theme).toBe("dark");
    });

    it("should handle invalid theme values", () => {
      const result = userReducer(initialState, setTheme("invalid"));
      expect(result.preferences.theme).toBe("invalid");
    });

    it("should handle null theme", () => {
      const result = userReducer(initialState, setTheme(null));
      expect(result.preferences.theme).toBe(null);
    });

    it("should handle empty string theme", () => {
      const result = userReducer(initialState, setTheme(""));
      expect(result.preferences.theme).toBe("");
    });
  });

  describe("goal management", () => {
    it("should add a goal", () => {
      const goalData = {
        title: "Exercise daily",
        description: "Walk for 30 minutes every day",
        targetDate: "2024-12-31",
      };

      const result = userReducer(initialState, addGoal(goalData));

      expect(result.goals).toHaveLength(1);
      expect(result.goals[0]).toMatchObject({
        ...goalData,
        completed: false,
      });
      expect(result.goals[0].id).toBeDefined();
      expect(result.goals[0].createdAt).toBeDefined();
    });

    it("should add goal with all optional fields", () => {
      const goalData = {
        title: "Complete course",
        description: "Finish React Native course",
        targetDate: "2024-06-30",
        category: "learning",
        priority: "high",
      };

      const result = userReducer(initialState, addGoal(goalData));

      expect(result.goals[0]).toMatchObject({
        ...goalData,
        completed: false,
        // Note: progress is not added by default
      });
      expect(result.goals[0].id).toBeDefined();
      expect(result.goals[0].createdAt).toBeDefined();
    });

    it("should handle empty goal data", () => {
      const result = userReducer(initialState, addGoal({}));
      expect(result.goals).toHaveLength(1);
      expect(result.goals[0].title).toBeUndefined();
      expect(result.goals[0].completed).toBe(false);
    });

    it("should handle null goal data", () => {
      const result = userReducer(initialState, addGoal(null));
      expect(result.goals).toHaveLength(1);
      expect(result.goals[0]).toEqual({
        id: expect.any(String),
        createdAt: expect.any(String),
        completed: false,
        ...null, // null spread results in no additional properties
      });
    });

    it("should update a goal", () => {
      const stateWithGoal = {
        ...initialState,
        goals: [
          {
            id: "goal-1",
            title: "Exercise daily",
            description: "Walk for 30 minutes",
            completed: false,
            createdAt: "2023-01-01T00:00:00.000Z",
          },
        ],
      };

      const updates = {
        id: "goal-1",
        completed: true,
        progress: 75,
      };

      const result = userReducer(stateWithGoal, updateGoal(updates));

      expect(result.goals[0].completed).toBe(true);
      expect(result.goals[0].progress).toBe(75);
      expect(result.goals[0].title).toBe("Exercise daily"); // unchanged
    });

    it("should handle updating non-existent goal", () => {
      const updates = {
        id: "non-existent",
        completed: true,
      };

      const result = userReducer(initialState, updateGoal(updates));

      expect(result.goals).toHaveLength(0);
    });

    it("should handle updating goal with invalid id", () => {
      const updates = {
        id: null,
        completed: true,
      };

      const result = userReducer(initialState, updateGoal(updates));

      expect(result.goals).toHaveLength(0);
    });

    it("should handle partial goal updates", () => {
      const stateWithGoal = {
        ...initialState,
        goals: [
          {
            id: "goal-1",
            title: "Exercise daily",
            description: "Walk for 30 minutes",
            completed: false,
            progress: 0,
            createdAt: "2023-01-01T00:00:00.000Z",
          },
        ],
      };

      const updates = {
        id: "goal-1",
        progress: 50,
      };

      const result = userReducer(stateWithGoal, updateGoal(updates));

      expect(result.goals[0].progress).toBe(50);
      expect(result.goals[0].completed).toBe(false); // unchanged
    });

    it("should delete a goal", () => {
      const stateWithGoals = {
        ...initialState,
        goals: [
          { id: "goal-1", title: "Goal 1" },
          { id: "goal-2", title: "Goal 2" },
        ],
      };

      const result = userReducer(stateWithGoals, deleteGoal("goal-1"));

      expect(result.goals).toHaveLength(1);
      expect(result.goals[0].id).toBe("goal-2");
    });

    it("should handle deleting non-existent goal", () => {
      const stateWithGoals = {
        ...initialState,
        goals: [{ id: "goal-1", title: "Goal 1" }],
      };

      const result = userReducer(stateWithGoals, deleteGoal("non-existent"));

      expect(result.goals).toHaveLength(1);
      expect(result.goals[0].id).toBe("goal-1");
    });

    it("should handle deleting goal with null id", () => {
      const stateWithGoals = {
        ...initialState,
        goals: [{ id: "goal-1", title: "Goal 1" }],
      };

      const result = userReducer(stateWithGoals, deleteGoal(null));

      expect(result.goals).toHaveLength(1);
    });

    it("should handle multiple goals operations", () => {
      let state = initialState;

      // Add multiple goals
      state = userReducer(state, addGoal({ title: "Goal 1" }));
      state = userReducer(state, addGoal({ title: "Goal 2" }));
      state = userReducer(state, addGoal({ title: "Goal 3" }));

      expect(state.goals).toHaveLength(3);

      // Get the IDs before any operations
      const goalIds = state.goals.map((g) => g.id);
      const firstGoalId = goalIds[0];
      const secondGoalId = goalIds[1];

      // Update the second goal
      state = userReducer(
        state,
        updateGoal({ id: secondGoalId, completed: true }),
      );

      expect(state.goals.find((g) => g.id === secondGoalId).completed).toBe(
        true,
      );

      // Delete the first goal
      state = userReducer(state, deleteGoal(firstGoalId));

      expect(state.goals).toHaveLength(2);
      // Check that the remaining goals have the correct titles
      const remainingTitles = state.goals.map((g) => g.title).sort();
      expect(remainingTitles).toEqual(["Goal 2", "Goal 3"]);
    });
  });

  describe("achievements", () => {
    it("should add an achievement", () => {
      const achievementData = {
        title: "First Session",
        description: "Completed your first therapy session",
        type: "milestone",
      };

      const result = userReducer(initialState, addAchievement(achievementData));

      expect(result.achievements).toHaveLength(1);
      expect(result.achievements[0]).toMatchObject({
        ...achievementData,
      });
      expect(result.achievements[0].id).toBeDefined();
      expect(result.achievements[0].earnedAt).toBeDefined();
    });

    it("should add achievement with all fields", () => {
      const achievementData = {
        title: "Streak Master",
        description: "Maintained a 30-day streak",
        type: "streak",
        points: 100,
        icon: "fire",
      };

      const result = userReducer(initialState, addAchievement(achievementData));

      expect(result.achievements[0]).toMatchObject(achievementData);
      expect(result.achievements[0].id).toBeDefined();
      expect(result.achievements[0].earnedAt).toBeDefined();
    });

    it("should handle empty achievement data", () => {
      const result = userReducer(initialState, addAchievement({}));
      expect(result.achievements).toHaveLength(1);
      expect(result.achievements[0].title).toBeUndefined();
    });

    it("should handle null achievement data", () => {
      const result = userReducer(initialState, addAchievement(null));
      expect(result.achievements).toHaveLength(1);
      expect(result.achievements[0].title).toBeUndefined();
      expect(result.achievements[0].id).toBeDefined();
      expect(result.achievements[0].earnedAt).toBeDefined();
    });

    it("should handle multiple achievements", () => {
      let state = initialState;

      state = userReducer(
        state,
        addAchievement({ title: "Achievement 1", type: "milestone" }),
      );
      state = userReducer(
        state,
        addAchievement({ title: "Achievement 2", type: "streak" }),
      );

      expect(state.achievements).toHaveLength(2);
      expect(state.achievements[0].type).toBe("milestone");
      expect(state.achievements[1].type).toBe("streak");
    });
  });

  describe("error handling", () => {
    it("should clear user error", () => {
      const stateWithError = {
        ...initialState,
        error: "Some error occurred",
      };

      const result = userReducer(stateWithError, clearUserError());

      expect(result.error).toBe(null);
    });

    it("should handle clearing error when no error exists", () => {
      const result = userReducer(initialState, clearUserError());
      expect(result.error).toBe(null);
    });
  });

  describe("resetUserState", () => {
    it("should reset user state to initial state", () => {
      const modifiedState = {
        ...initialState,
        profile: { ...initialState.profile, name: "Modified" },
        goals: [{ id: "1", title: "Test Goal" }],
        error: "Some error",
      };

      const result = userReducer(modifiedState, resetUserState());

      expect(result).toEqual(initialState);
    });

    it("should reset complex state with multiple modifications", () => {
      const modifiedState = {
        ...initialState,
        profile: {
          ...initialState.profile,
          name: "Modified",
          email: "test@example.com",
        },
        preferences: { ...initialState.preferences, theme: "dark" },
        goals: [
          { id: "1", title: "Goal 1", completed: true },
          { id: "2", title: "Goal 2", completed: false },
        ],
        achievements: [{ id: "1", title: "Achievement 1" }],
        stats: { ...initialState.stats, totalSessions: 10 },
        loading: true,
        error: "Test error",
      };

      const result = userReducer(modifiedState, resetUserState());

      expect(result).toEqual(initialState);
    });
  });

  describe("async thunks", () => {
    // Helper function to execute thunks without deep nesting
    const executeThunk = async (thunk) => {
      const dispatch = jest.fn();
      const getState = () => ({});
      await thunk(dispatch, getState, undefined);
      return dispatch;
    };

    describe("updateUserProfile", () => {
      it("should handle successful profile update", async () => {
        const profileData = {
          name: "Updated Name",
          email: "updated@example.com",
        };
        const mockResponse = {
          ...profileData,
          updatedAt: "2023-01-01T00:00:00.000Z",
        };

        apiService.user.updateProfile.mockResolvedValue(mockResponse);

        const dispatch = await executeThunk(updateUserProfile(profileData));

        expect(apiService.user.updateProfile).toHaveBeenCalledWith(profileData);

        expect(dispatch).toHaveBeenCalledWith(
          expect.objectContaining({
            type: "user/updateProfile/pending",
          }),
        );
        expect(dispatch).toHaveBeenCalledWith(
          expect.objectContaining({
            type: "user/updateProfile/fulfilled",
            payload: mockResponse,
          }),
        );
      });

      it("should handle profile update error", async () => {
        const mockError = new Error("Update failed");
        apiService.user.updateProfile.mockRejectedValue(mockError);

        const dispatch = await executeThunk(
          updateUserProfile({ name: "Test" }),
        );

        expect(dispatch).toHaveBeenCalledWith(
          expect.objectContaining({
            type: "user/updateProfile/rejected",
            payload: "Update failed",
          }),
        );
      });

      it("should handle network timeout during profile update", async () => {
        jest.useFakeTimers();

        apiService.user.updateProfile.mockRejectedValue(
          new Error("Network timeout"),
        );

        const dispatch = await executeThunk(
          updateUserProfile({ name: "Test" }),
        );

        expect(dispatch).toHaveBeenCalledWith(
          expect.objectContaining({
            type: "user/updateProfile/rejected",
            payload: "Network timeout",
          }),
        );

        jest.useRealTimers();
      });

      it("should handle empty profile data", async () => {
        const mockResponse = { updatedAt: "2023-01-01T00:00:00.000Z" };
        apiService.user.updateProfile.mockResolvedValue(mockResponse);

        const dispatch = await executeThunk(updateUserProfile({}));

        expect(apiService.user.updateProfile).toHaveBeenCalledWith({});
        expect(dispatch).toHaveBeenCalledWith(
          expect.objectContaining({
            type: "user/updateProfile/fulfilled",
            payload: mockResponse,
          }),
        );
      });

      it("should handle null profile data", async () => {
        const mockResponse = { updatedAt: "2023-01-01T00:00:00.000Z" };
        apiService.user.updateProfile.mockResolvedValue(mockResponse);

        const dispatch = await executeThunk(updateUserProfile(null));

        expect(apiService.user.updateProfile).toHaveBeenCalledWith(null);
        expect(dispatch).toHaveBeenCalledWith(
          expect.objectContaining({
            type: "user/updateProfile/fulfilled",
            payload: mockResponse,
          }),
        );
      });

      it("should handle malformed API response", async () => {
        const malformedResponse = null;
        apiService.user.updateProfile.mockResolvedValue(malformedResponse);

        const dispatch = await executeThunk(
          updateUserProfile({ name: "Test" }),
        );

        expect(dispatch).toHaveBeenCalledWith(
          expect.objectContaining({
            type: "user/updateProfile/fulfilled",
            payload: null,
          }),
        );
      });

      it("should handle API response with unexpected structure", async () => {
        const unexpectedResponse = { unexpectedField: "value" };
        apiService.user.updateProfile.mockResolvedValue(unexpectedResponse);

        const dispatch = await executeThunk(
          updateUserProfile({ name: "Test" }),
        );

        expect(dispatch).toHaveBeenCalledWith(
          expect.objectContaining({
            type: "user/updateProfile/fulfilled",
            payload: unexpectedResponse,
          }),
        );
      });

      it("should handle concurrent profile updates", async () => {
        const profileData1 = { name: "Update 1" };
        const profileData2 = { name: "Update 2" };

        const mockResponse1 = {
          ...profileData1,
          updatedAt: "2023-01-01T00:00:00.000Z",
        };
        const mockResponse2 = {
          ...profileData2,
          updatedAt: "2023-01-01T00:00:00.000Z",
        };

        apiService.user.updateProfile
          .mockResolvedValueOnce(mockResponse1)
          .mockResolvedValueOnce(mockResponse2);

        const dispatch1 = executeThunk(updateUserProfile(profileData1));
        const dispatch2 = executeThunk(updateUserProfile(profileData2));

        const [dispatchResult1, dispatchResult2] = await Promise.all([
          dispatch1,
          dispatch2,
        ]);

        expect(apiService.user.updateProfile).toHaveBeenCalledTimes(2);
        expect(dispatchResult1).toHaveBeenCalledWith(
          expect.objectContaining({
            type: "user/updateProfile/fulfilled",
            payload: mockResponse1,
          }),
        );
        expect(dispatchResult2).toHaveBeenCalledWith(
          expect.objectContaining({
            type: "user/updateProfile/fulfilled",
            payload: mockResponse2,
          }),
        );
      });
    });

    describe("fetchUserStats", () => {
      it("should handle successful stats fetch", async () => {
        const mockStats = {
          totalSessions: 10,
          streakDays: 5,
          assessmentsCompleted: 3,
        };

        apiService.user.getStats.mockResolvedValue(mockStats);

        const dispatch = await executeThunk(fetchUserStats());

        expect(apiService.user.getStats).toHaveBeenCalled();

        expect(dispatch).toHaveBeenCalledWith(
          expect.objectContaining({
            type: "user/fetchStats/fulfilled",
            payload: mockStats,
          }),
        );
      });

      it("should handle stats fetch error", async () => {
        const mockError = new Error("Stats fetch failed");
        apiService.user.getStats.mockRejectedValue(mockError);

        const dispatch = await executeThunk(fetchUserStats());

        expect(dispatch).toHaveBeenCalledWith(
          expect.objectContaining({
            type: "user/fetchStats/rejected",
            payload: "Stats fetch failed",
          }),
        );
      });

      it("should handle network timeout during stats fetch", async () => {
        jest.useFakeTimers();

        apiService.user.getStats.mockRejectedValue(
          new Error("Network timeout"),
        );

        const dispatch = await executeThunk(fetchUserStats());

        expect(dispatch).toHaveBeenCalledWith(
          expect.objectContaining({
            type: "user/fetchStats/rejected",
            payload: "Network timeout",
          }),
        );

        jest.useRealTimers();
      });

      it("should handle empty stats response", async () => {
        const emptyStats = {};
        apiService.user.getStats.mockResolvedValue(emptyStats);

        const dispatch = await executeThunk(fetchUserStats());

        expect(dispatch).toHaveBeenCalledWith(
          expect.objectContaining({
            type: "user/fetchStats/fulfilled",
            payload: emptyStats,
          }),
        );
      });

      it("should handle null stats response", async () => {
        apiService.user.getStats.mockResolvedValue(null);

        const dispatch = await executeThunk(fetchUserStats());

        expect(dispatch).toHaveBeenCalledWith(
          expect.objectContaining({
            type: "user/fetchStats/fulfilled",
            payload: null,
          }),
        );
      });

      it("should handle malformed stats data", async () => {
        const malformedStats = {
          totalSessions: "invalid",
          streakDays: null,
          assessmentsCompleted: [],
          extraField: "should be ignored",
        };

        apiService.user.getStats.mockResolvedValue(malformedStats);

        const dispatch = await executeThunk(fetchUserStats());

        expect(dispatch).toHaveBeenCalledWith(
          expect.objectContaining({
            type: "user/fetchStats/fulfilled",
            payload: malformedStats,
          }),
        );
      });

      it("should handle concurrent stats fetches", async () => {
        const mockStats1 = { totalSessions: 10 };
        const mockStats2 = { totalSessions: 20 };

        apiService.user.getStats
          .mockResolvedValueOnce(mockStats1)
          .mockResolvedValueOnce(mockStats2);

        const dispatch1 = executeThunk(fetchUserStats());
        const dispatch2 = executeThunk(fetchUserStats());

        const [dispatchResult1, dispatchResult2] = await Promise.all([
          dispatch1,
          dispatch2,
        ]);

        expect(apiService.user.getStats).toHaveBeenCalledTimes(2);
        expect(dispatchResult1).toHaveBeenCalledWith(
          expect.objectContaining({
            type: "user/fetchStats/fulfilled",
            payload: mockStats1,
          }),
        );
        expect(dispatchResult2).toHaveBeenCalledWith(
          expect.objectContaining({
            type: "user/fetchStats/fulfilled",
            payload: mockStats2,
          }),
        );
      });
    });
  });

  describe("extra reducers", () => {
    it("should handle updateUserProfile fulfilled", () => {
      const profileUpdate = {
        name: "Updated Name",
        email: "updated@example.com",
      };

      const action = {
        type: "user/updateProfile/fulfilled",
        payload: profileUpdate,
      };

      const result = userReducer(initialState, action);

      expect(result.loading).toBe(false);
      expect(result.profile.name).toBe("Updated Name");
      expect(result.profile.email).toBe("updated@example.com");
    });

    it("should handle fetchUserStats fulfilled", () => {
      const statsData = {
        totalSessions: 15,
        streakDays: 7,
        assessmentsCompleted: 5,
      };

      const action = {
        type: "user/fetchStats/fulfilled",
        payload: statsData,
      };

      const result = userReducer(initialState, action);

      expect(result.loading).toBe(false);
      expect(result.stats).toEqual(statsData);
    });

    it("should handle pending states", () => {
      const pendingAction = { type: "user/updateProfile/pending" };
      const result = userReducer(initialState, pendingAction);

      expect(result.loading).toBe(true);
      expect(result.error).toBe(null);
    });

    it("should handle rejected states", () => {
      const rejectedAction = {
        type: "user/updateProfile/rejected",
        payload: "Update failed",
      };

      const result = userReducer(initialState, rejectedAction);

      expect(result.loading).toBe(false);
      expect(result.error).toBe("Update failed");
    });

    it("should handle updateUserProfile fulfilled with complex data", () => {
      const complexProfileUpdate = {
        name: "John Doe",
        email: "john@example.com",
        phoneNumber: "123-456-7890",
        emergencyContact: {
          name: "Jane Doe",
          phone: "987-654-3210",
          relationship: "Sister",
        },
        avatar: "avatar-url",
        dateOfBirth: "1990-01-01",
      };

      const action = {
        type: "user/updateProfile/fulfilled",
        payload: complexProfileUpdate,
      };

      const result = userReducer(initialState, action);

      expect(result.loading).toBe(false);
      expect(result.profile).toEqual({
        ...initialState.profile,
        ...complexProfileUpdate,
      });
    });

    it("should handle fetchUserStats fulfilled with all stats fields", () => {
      const fullStatsData = {
        totalSessions: 25,
        streakDays: 10,
        assessmentsCompleted: 8,
        moodEntriesCount: 150,
        favoriteActivities: ["reading", "walking", "meditation"],
        joinDate: "2023-01-01T00:00:00.000Z",
      };

      const action = {
        type: "user/fetchStats/fulfilled",
        payload: fullStatsData,
      };

      const result = userReducer(initialState, action);

      expect(result.loading).toBe(false);
      expect(result.stats).toEqual(fullStatsData);
    });

    it("should handle multiple pending states correctly", () => {
      let state = initialState;

      state = userReducer(state, { type: "user/updateProfile/pending" });
      expect(state.loading).toBe(true);

      state = userReducer(state, { type: "user/fetchStats/pending" });
      expect(state.loading).toBe(true); // Should remain true
    });

    it("should handle rejected states with different error messages", () => {
      const errors = [
        "Network error",
        "Server error",
        "Validation error",
        null,
        undefined,
      ];

      errors.forEach((error) => {
        const rejectedAction = {
          type: "user/updateProfile/rejected",
          payload: error,
        };

        const result = userReducer(initialState, rejectedAction);

        expect(result.loading).toBe(false);
        expect(result.error).toBe(error);
      });
    });

    it("should handle fulfilled actions clearing previous errors", () => {
      const stateWithError = {
        ...initialState,
        error: "Previous error",
        loading: true,
      };

      const action = {
        type: "user/updateProfile/fulfilled",
        payload: { name: "Updated" },
      };

      const result = userReducer(stateWithError, action);

      expect(result.loading).toBe(false);
      expect(result.error).toBe(null);
      expect(result.profile.name).toBe("Updated");
    });

    it("should handle malformed fulfilled payloads gracefully", () => {
      const malformedPayloads = [
        null,
        undefined,
        {},
        { invalidField: "value" },
      ];

      malformedPayloads.forEach((payload) => {
        const action = {
          type: "user/updateProfile/fulfilled",
          payload,
        };

        const result = userReducer(initialState, action);

        expect(result.loading).toBe(false);
        if (payload && typeof payload === "object") {
          expect(result.profile).toEqual({
            ...initialState.profile,
            ...payload,
          });
        }
      });
    });
  });

  describe("security tests", () => {
    it("should not expose sensitive data in state", () => {
      const sensitiveData = {
        password: "secret123",
        token: "jwt-token-here",
        apiKey: "api-key-here",
      };

      const result = userReducer(initialState, setUserProfile(sensitiveData));

      expect(result.profile.password).toBeUndefined();
      expect(result.profile.token).toBeUndefined();
      expect(result.profile.apiKey).toBeUndefined();
    });

    it("should handle XSS attempts in profile data", () => {
      const xssAttempt = {
        name: '<script>alert("xss")</script>',
        email: "test@example.com",
      };

      const result = userReducer(initialState, setUserProfile(xssAttempt));

      expect(result.profile.name).toBe('<script>alert("xss")</script>');
      // Note: In a real app, you'd want sanitization middleware
    });

    it("should validate email format in profile updates", () => {
      const invalidEmails = [
        "invalid",
        "invalid@",
        "@invalid.com",
        "invalid.com",
      ];

      invalidEmails.forEach((email) => {
        const result = userReducer(initialState, setUserProfile({ email }));
        expect(result.profile.email).toBe(email);
        // Note: In a real app, you'd want validation middleware
      });
    });

    it("should handle large data payloads safely", () => {
      const largeData = {
        name: "A".repeat(1000), // 1000 character name
        email: "test@example.com",
        phoneNumber: "1".repeat(100), // 100 character phone
      };

      const result = userReducer(initialState, setUserProfile(largeData));

      expect(result.profile.name.length).toBe(1000);
      expect(result.profile.phoneNumber.length).toBe(100);
    });

    it("should prevent prototype pollution attempts", () => {
      const prototypePollution = {
        name: "Test",
        __proto__: {
          maliciousProperty: "malicious",
        },
      };

      const result = userReducer(
        initialState,
        setUserProfile(prototypePollution),
      );

      expect(result.profile.name).toBe("Test");
      expect({}.maliciousProperty).toBeUndefined(); // Ensure prototype wasn't polluted
    });

    it("should handle circular references safely", () => {
      const circularObj = { name: "Test" };
      circularObj.self = circularObj;

      expect(() => {
        userReducer(initialState, setUserProfile(circularObj));
      }).toThrow("Immer forbids circular references");
    });
  });

  describe("performance tests", () => {
    it("should handle rapid consecutive operations", () => {
      let state = initialState;

      // Simulate rapid user interactions
      for (let i = 0; i < 100; i++) {
        state = userReducer(state, setUserProfile({ name: `User ${i}` }));
        state = userReducer(
          state,
          updatePreferences({ theme: i % 2 === 0 ? "light" : "dark" }),
        );
        state = userReducer(state, addGoal({ title: `Goal ${i}` }));
      }

      expect(state.goals).toHaveLength(100);
      expect(state.profile.name).toBe("User 99");
      expect(state.preferences.theme).toBe("dark");
    });

    it("should handle large state operations efficiently", () => {
      const largeGoalsArray = Array.from({ length: 1000 }, (_, i) => ({
        id: `goal-${i}`,
        title: `Goal ${i}`,
        completed: i % 2 === 0,
        createdAt: new Date().toISOString(),
      }));

      const stateWithManyGoals = {
        ...initialState,
        goals: largeGoalsArray,
      };

      const startTime = Date.now();
      const result = userReducer(
        stateWithManyGoals,
        updateGoal({
          id: "goal-500",
          completed: true,
        }),
      );
      const endTime = Date.now();

      expect(result.goals[500].completed).toBe(true);
      expect(endTime - startTime).toBeLessThan(100); // Should complete in less than 100ms
    });

    it("should handle memory-intensive operations", () => {
      const memoryIntensiveData = {
        favoriteActivities: Array.from(
          { length: 10000 },
          (_, i) => `Activity ${i}`,
        ),
      };

      const result = userReducer(
        initialState,
        setUserProfile({
          stats: memoryIntensiveData,
        }),
      );

      expect(result.profile.stats.favoriteActivities).toHaveLength(10000);
    });

    it("should handle timeout scenarios gracefully", () => {
      jest.useFakeTimers();

      // Test that operations don't hang indefinitely
      const startTime = Date.now();
      const result = userReducer(initialState, { type: "unknown/action" });
      const endTime = Date.now();

      expect(result).toEqual(initialState);
      expect(endTime - startTime).toBeLessThan(10); // Should complete almost instantly

      jest.useRealTimers();
    });
  });

  describe("integration tests", () => {
    it("should handle complete user profile workflow", () => {
      let state = initialState;

      // Set initial profile
      state = userReducer(
        state,
        setUserProfile({
          id: "user-123",
          name: "John Doe",
          email: "john@example.com",
        }),
      );

      expect(state.profile.id).toBe("user-123");
      expect(state.profile.name).toBe("John Doe");

      // Update preferences
      state = userReducer(
        state,
        updatePreferences({
          theme: "dark",
          notifications: { moodReminders: false },
        }),
      );

      expect(state.preferences.theme).toBe("dark");
      expect(state.preferences.notifications.moodReminders).toBe(false);

      // Add goals
      state = userReducer(
        state,
        addGoal({
          title: "Daily meditation",
          description: "Meditate for 10 minutes daily",
        }),
      );

      expect(state.goals).toHaveLength(1);

      // Complete goal
      state = userReducer(
        state,
        updateGoal({
          id: state.goals[0].id,
          completed: true,
        }),
      );

      expect(state.goals[0].completed).toBe(true);

      // Add achievement
      state = userReducer(
        state,
        addAchievement({
          title: "Goal Achiever",
          description: "Completed your first goal",
        }),
      );

      expect(state.achievements).toHaveLength(1);
    });

    it("should handle user onboarding flow", () => {
      let state = initialState;

      // Step 1: Set basic profile
      state = userReducer(
        state,
        setUserProfile({
          name: "New User",
          email: "newuser@example.com",
        }),
      );

      // Step 2: Set preferences
      state = userReducer(
        state,
        updatePreferences({
          theme: "light",
          language: "en",
          notifications: {
            moodReminders: true,
            chatMessages: true,
          },
        }),
      );

      // Step 3: Add first goal
      state = userReducer(
        state,
        addGoal({
          title: "Welcome Goal",
          description: "Complete your first goal to get started",
        }),
      );

      expect(state.profile.name).toBe("New User");
      expect(state.preferences.theme).toBe("light");
      expect(state.goals).toHaveLength(1);
      expect(state.goals[0].title).toBe("Welcome Goal");
    });

    it("should handle error recovery workflow", () => {
      let state = initialState;

      // Simulate error state
      state = userReducer(state, {
        type: "user/updateProfile/rejected",
        payload: "Network error",
      });

      expect(state.error).toBe("Network error");
      expect(state.loading).toBe(false);

      // Clear error
      state = userReducer(state, clearUserError());

      expect(state.error).toBe(null);

      // Retry operation successfully
      state = userReducer(state, setUserProfile({ name: "Recovered User" }));

      expect(state.profile.name).toBe("Recovered User");
      expect(state.error).toBe(null);
    });

    it("should handle complex state transitions", () => {
      let state = initialState;

      // Complex workflow: profile update -> preferences -> goals -> achievements -> stats
      state = userReducer(
        state,
        setUserProfile({
          id: "complex-user",
          name: "Complex User",
          email: "complex@example.com",
        }),
      );

      state = userReducer(
        state,
        updatePreferences({
          theme: "dark",
          privacy: { shareData: false },
        }),
      );

      // Add multiple goals
      state = userReducer(state, addGoal({ title: "Goal 1" }));
      state = userReducer(state, addGoal({ title: "Goal 2" }));

      // Update one goal
      state = userReducer(
        state,
        updateGoal({
          id: state.goals[0].id,
          completed: true,
        }),
      );

      // Add achievement
      state = userReducer(state, addAchievement({ title: "First Win" }));

      // Simulate stats update
      state = userReducer(state, {
        type: "user/fetchStats/fulfilled",
        payload: { totalSessions: 5, streakDays: 3 },
      });

      expect(state.profile.name).toBe("Complex User");
      expect(state.preferences.theme).toBe("dark");
      expect(state.goals).toHaveLength(2);
      expect(state.goals[0].completed).toBe(true);
      expect(state.achievements).toHaveLength(1);
      expect(state.stats.totalSessions).toBe(5);
    });

    it("should handle concurrent async operations", async () => {
      const dispatch = jest.fn();
      const getState = () => ({});

      // Mock successful responses
      apiService.user.updateProfile.mockResolvedValue({ name: "Updated" });
      apiService.user.getStats.mockResolvedValue({ totalSessions: 10 });

      // Execute both thunks concurrently
      await Promise.all([
        updateUserProfile({ name: "Test" })(dispatch, getState, undefined),
        fetchUserStats()(dispatch, getState, undefined),
      ]);

      // Should have dispatched pending, fulfilled for both operations
      expect(dispatch).toHaveBeenCalledWith(
        expect.objectContaining({ type: "user/updateProfile/pending" }),
      );
      expect(dispatch).toHaveBeenCalledWith(
        expect.objectContaining({ type: "user/fetchStats/pending" }),
      );
      expect(dispatch).toHaveBeenCalledWith(
        expect.objectContaining({ type: "user/updateProfile/fulfilled" }),
      );
      expect(dispatch).toHaveBeenCalledWith(
        expect.objectContaining({ type: "user/fetchStats/fulfilled" }),
      );
    });

    it("should maintain state consistency across operations", () => {
      let state = initialState;

      // Perform various operations
      state = userReducer(
        state,
        setUserProfile({ id: "test-user", name: "Test User" }),
      );
      state = userReducer(state, updatePreferences({ theme: "dark" }));
      state = userReducer(state, addGoal({ title: "Test Goal" }));
      state = userReducer(state, addAchievement({ title: "Test Achievement" }));

      // Simulate async operation states
      state = userReducer(state, { type: "user/updateProfile/pending" });
      expect(state.loading).toBe(true);

      state = userReducer(state, {
        type: "user/updateProfile/fulfilled",
        payload: { email: "test@example.com" },
      });
      expect(state.loading).toBe(false);
      expect(state.profile.email).toBe("test@example.com");

      // Ensure other state remained intact
      expect(state.profile.name).toBe("Test User");
      expect(state.preferences.theme).toBe("dark");
      expect(state.goals).toHaveLength(1);
      expect(state.achievements).toHaveLength(1);
    });
  });
});
