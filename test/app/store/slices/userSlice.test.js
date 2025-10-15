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
} from '../../../../src/app/store/slices/userSlice';

// Import the slice to access its internal apiService
const userSlice = require('../../../../src/app/store/slices/userSlice');

describe('userSlice', () => {
  const initialState = {
    profile: {
      id: null,
      name: '',
      email: '',
      avatar: null,
      phoneNumber: '',
      dateOfBirth: '',
      emergencyContact: {
        name: '',
        phone: '',
        relationship: '',
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
      theme: 'light',
      language: 'en',
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
  };

  beforeEach(() => {
    jest.clearAllMocks();
    // Spy on the apiService methods
    jest.spyOn(apiService.user, 'updateProfile');
    jest.spyOn(apiService.user, 'getStats');
  });

  it('should return the initial state', () => {
    expect(userReducer(undefined, { type: undefined })).toEqual(initialState);
  });

  describe('setUserProfile', () => {
    it('should set user profile', () => {
      const profileData = {
        id: '1',
        name: 'John Doe',
        email: 'john@example.com',
      };

      const result = userReducer(initialState, setUserProfile(profileData));

      expect(result.profile).toEqual({
        ...initialState.profile,
        ...profileData,
      });
    });

    it('should merge profile data with existing profile', () => {
      const existingState = {
        ...initialState,
        profile: {
          ...initialState.profile,
          id: '1',
          name: 'John',
        },
      };

      const updates = {
        email: 'john@example.com',
        phoneNumber: '123-456-7890',
      };

      const result = userReducer(existingState, setUserProfile(updates));

      expect(result.profile).toEqual({
        ...initialState.profile,
        id: '1',
        name: 'John',
        email: 'john@example.com',
        phoneNumber: '123-456-7890',
      });
    });
  });

  describe('updatePreferences', () => {
    it('should update user preferences', () => {
      const preferencesUpdate = {
        notifications: {
          moodReminders: false,
          chatMessages: false,
        },
        theme: 'dark',
      };

      const result = userReducer(initialState, updatePreferences(preferencesUpdate));

      expect(result.preferences.notifications.moodReminders).toBe(false);
      expect(result.preferences.notifications.chatMessages).toBe(false);
      expect(result.preferences.theme).toBe('dark');
    });
  });

  describe('setTheme', () => {
    it('should set theme preference', () => {
      const result = userReducer(initialState, setTheme('dark'));

      expect(result.preferences.theme).toBe('dark');
    });
  });

  describe('goal management', () => {
    it('should add a goal', () => {
      const goalData = {
        title: 'Exercise daily',
        description: 'Walk for 30 minutes every day',
        targetDate: '2024-12-31',
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

    it('should update a goal', () => {
      const stateWithGoal = {
        ...initialState,
        goals: [
          {
            id: 'goal-1',
            title: 'Exercise daily',
            description: 'Walk for 30 minutes',
            completed: false,
            createdAt: '2023-01-01T00:00:00.000Z',
          },
        ],
      };

      const updates = {
        id: 'goal-1',
        completed: true,
        progress: 75,
      };

      const result = userReducer(stateWithGoal, updateGoal(updates));

      expect(result.goals[0].completed).toBe(true);
      expect(result.goals[0].progress).toBe(75);
      expect(result.goals[0].title).toBe('Exercise daily'); // unchanged
    });

    it('should delete a goal', () => {
      const stateWithGoals = {
        ...initialState,
        goals: [
          { id: 'goal-1', title: 'Goal 1' },
          { id: 'goal-2', title: 'Goal 2' },
        ],
      };

      const result = userReducer(stateWithGoals, deleteGoal('goal-1'));

      expect(result.goals).toHaveLength(1);
      expect(result.goals[0].id).toBe('goal-2');
    });
  });

  describe('achievements', () => {
    it('should add an achievement', () => {
      const achievementData = {
        title: 'First Session',
        description: 'Completed your first therapy session',
        type: 'milestone',
      };

      const result = userReducer(initialState, addAchievement(achievementData));

      expect(result.achievements).toHaveLength(1);
      expect(result.achievements[0]).toMatchObject({
        ...achievementData,
      });
      expect(result.achievements[0].id).toBeDefined();
      expect(result.achievements[0].earnedAt).toBeDefined();
    });
  });

  describe('error handling', () => {
    it('should clear user error', () => {
      const stateWithError = {
        ...initialState,
        error: 'Some error occurred',
      };

      const result = userReducer(stateWithError, clearUserError());

      expect(result.error).toBe(null);
    });
  });

  describe('resetUserState', () => {
    it('should reset user state to initial state', () => {
      const modifiedState = {
        ...initialState,
        profile: { ...initialState.profile, name: 'Modified' },
        goals: [{ id: '1', title: 'Test Goal' }],
        error: 'Some error',
      };

      const result = userReducer(modifiedState, resetUserState());

      expect(result).toEqual(initialState);
    });
  });

  describe('async thunks', () => {
    // Helper function to execute thunks without deep nesting
    const executeThunk = async (thunk) => {
      const dispatch = jest.fn();
      const getState = () => ({});
      await thunk(dispatch, getState, undefined);
      return dispatch;
    };

    describe('updateUserProfile', () => {
      it('should handle successful profile update', async () => {
        const profileData = { name: 'Updated Name', email: 'updated@example.com' };
        const mockResponse = { ...profileData, updatedAt: '2023-01-01T00:00:00.000Z' };

        apiService.user.updateProfile.mockResolvedValue(mockResponse);

        const dispatch = await executeThunk(updateUserProfile(profileData));

        expect(apiService.user.updateProfile).toHaveBeenCalledWith(profileData);

        expect(dispatch).toHaveBeenCalledWith(
          expect.objectContaining({
            type: 'user/updateProfile/pending',
          })
        );
        expect(dispatch).toHaveBeenCalledWith(
          expect.objectContaining({
            type: 'user/updateProfile/fulfilled',
            payload: mockResponse,
          })
        );
      });

      it('should handle profile update error', async () => {
        const mockError = new Error('Update failed');
        apiService.user.updateProfile.mockRejectedValue(mockError);

        const dispatch = await executeThunk(updateUserProfile({ name: 'Test' }));

        expect(dispatch).toHaveBeenCalledWith(
          expect.objectContaining({
            type: 'user/updateProfile/rejected',
            payload: 'Update failed',
          })
        );
      });
    });

    describe('fetchUserStats', () => {
      it('should handle successful stats fetch', async () => {
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
            type: 'user/fetchStats/fulfilled',
            payload: mockStats,
          })
        );
      });

      it('should handle stats fetch error', async () => {
        const mockError = new Error('Stats fetch failed');
        apiService.user.getStats.mockRejectedValue(mockError);

        const dispatch = await executeThunk(fetchUserStats());

        expect(dispatch).toHaveBeenCalledWith(
          expect.objectContaining({
            type: 'user/fetchStats/rejected',
            payload: 'Stats fetch failed',
          })
        );
      });
    });
  });

  describe('extra reducers', () => {
    it('should handle updateUserProfile fulfilled', () => {
      const profileUpdate = { name: 'Updated Name', email: 'updated@example.com' };

      const action = {
        type: 'user/updateProfile/fulfilled',
        payload: profileUpdate,
      };

      const result = userReducer(initialState, action);

      expect(result.loading).toBe(false);
      expect(result.profile.name).toBe('Updated Name');
      expect(result.profile.email).toBe('updated@example.com');
    });

    it('should handle fetchUserStats fulfilled', () => {
      const statsData = {
        totalSessions: 15,
        streakDays: 7,
        assessmentsCompleted: 5,
      };

      const action = {
        type: 'user/fetchStats/fulfilled',
        payload: statsData,
      };

      const result = userReducer(initialState, action);

      expect(result.loading).toBe(false);
      expect(result.stats).toEqual(statsData);
    });

    it('should handle pending states', () => {
      const pendingAction = { type: 'user/updateProfile/pending' };
      const result = userReducer(initialState, pendingAction);

      expect(result.loading).toBe(true);
      expect(result.error).toBe(null);
    });

    it('should handle rejected states', () => {
      const rejectedAction = {
        type: 'user/updateProfile/rejected',
        payload: 'Update failed',
      };

      const result = userReducer(initialState, rejectedAction);

      expect(result.loading).toBe(false);
      expect(result.error).toBe('Update failed');
    });
  });

  describe('integration tests', () => {
    it('should handle complete user profile workflow', () => {
      let state = initialState;

      // Set initial profile
      state = userReducer(state, setUserProfile({
        id: 'user-123',
        name: 'John Doe',
        email: 'john@example.com',
      }));

      expect(state.profile.id).toBe('user-123');
      expect(state.profile.name).toBe('John Doe');

      // Update preferences
      state = userReducer(state, updatePreferences({
        theme: 'dark',
        notifications: { moodReminders: false },
      }));

      expect(state.preferences.theme).toBe('dark');
      expect(state.preferences.notifications.moodReminders).toBe(false);

      // Add goals
      state = userReducer(state, addGoal({
        title: 'Daily meditation',
        description: 'Meditate for 10 minutes daily',
      }));

      expect(state.goals).toHaveLength(1);

      // Complete goal
      state = userReducer(state, updateGoal({
        id: state.goals[0].id,
        completed: true,
      }));

      expect(state.goals[0].completed).toBe(true);

      // Add achievement
      state = userReducer(state, addAchievement({
        title: 'Goal Achiever',
        description: 'Completed your first goal',
      }));

      expect(state.achievements).toHaveLength(1);
    });
  });
});