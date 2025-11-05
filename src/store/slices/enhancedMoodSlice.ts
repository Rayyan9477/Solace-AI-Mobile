// Minimal enhancedMood slice to support integration tests
// Listens to UI action types dispatched by EnhancedMoodTrackerScreen and mood slice actions

export interface EnhancedMoodState {
  currentStep: number;
  selectedMood: string | null;
  intensity: number;
  activities: string[];
  notes: string;
  triggers: string[];
  isSubmitting: boolean;
}

const initialState: EnhancedMoodState = {
  currentStep: 1,
  selectedMood: null,
  intensity: 5,
  activities: [],
  notes: "",
  triggers: [],
  isSubmitting: false,
};

function reducer(
  state: EnhancedMoodState = initialState,
  action: any,
): EnhancedMoodState {
  switch (action.type) {
    case "mood/UI_STEP":
      return { ...state, currentStep: Number(action.payload) || 1 };
    case "mood/UI_INTENSITY":
      return { ...state, intensity: Number(action.payload) || state.intensity };
    case "mood/UI_ACTIVITY": {
      const id = action.payload;
      const exists = state.activities.includes(id);
      return {
        ...state,
        activities: exists
          ? state.activities.filter((a) => a !== id)
          : [...state.activities, id],
      };
    }
    case "mood/UI_NOTES":
      return { ...state, notes: String(action.payload ?? "") };
    case "mood/UI_TRIGGER": {
      const id = action.payload;
      const exists = state.triggers.includes(id);
      return {
        ...state,
        triggers: exists
          ? state.triggers.filter((t) => t !== id)
          : [...state.triggers, id],
      };
    }
    case "mood/setCurrentMood":
      return { ...state, selectedMood: action.payload };
    default:
      return state;
  }
}

export default { reducer } as any;
