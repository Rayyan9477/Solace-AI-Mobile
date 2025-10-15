import { createSlice } from "@reduxjs/toolkit";

// Simple enhanced mood slice for testing
const initialState = {
  currentStep: 1,
  selectedMood: null,
  intensity: 5,
  activities: [],
  notes: "",
  triggers: [],
  moodHistory: [],
};

const enhancedMoodSlice = createSlice({
  name: "enhancedMood",
  initialState,
  reducers: {
    setCurrentStep: (state, action) => {
      state.currentStep = action.payload;
    },
    setSelectedMood: (state, action) => {
      state.selectedMood = action.payload;
    },
    setIntensity: (state, action) => {
      state.intensity = action.payload;
    },
    toggleActivity: (state, action) => {
      const id = action.payload;
      if (state.activities.includes(id)) {
        state.activities = state.activities.filter((a) => a !== id);
      } else {
        state.activities.push(id);
      }
    },
    setNotes: (state, action) => {
      state.notes = action.payload;
    },
    toggleTrigger: (state, action) => {
      const id = action.payload;
      if (state.triggers.includes(id)) {
        state.triggers = state.triggers.filter((t) => t !== id);
      } else {
        state.triggers.push(id);
      }
    },
  },
});

export const { 
  setCurrentStep, 
  setSelectedMood, 
  setIntensity, 
  toggleActivity, 
  setNotes, 
  toggleTrigger 
} = enhancedMoodSlice.actions;

export default enhancedMoodSlice.reducer;

// Export the slice object for bridge imports
export { enhancedMoodSlice };
