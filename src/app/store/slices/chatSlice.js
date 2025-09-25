import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  conversations: [],
  currentConversation: null,
  messages: [],
  isTyping: false,
  isLoading: false,
  error: null,
  voiceEnabled: false,
  emotionDetection: true,
};

const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    startNewConversation: (state, action) => {
      const newConversation = {
        id: Date.now().toString(),
        title: action.payload.title || "New Conversation",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        messageCount: 0,
      };
      state.conversations.unshift(newConversation);
      state.currentConversation = newConversation.id;
      state.messages = [];
    },

    addMessage: (state, action) => {
      const message = {
        id: Date.now().toString() + Math.random(),
        ...action.payload,
        timestamp: new Date().toISOString(),
      };
      state.messages.push(message);

      // Update conversation
      const conversation = state.conversations.find(
        (c) => c.id === state.currentConversation,
      );
      if (conversation) {
        conversation.messageCount = state.messages.length;
        conversation.updatedAt = new Date().toISOString();
        if (!conversation.title || conversation.title === "New Conversation") {
          conversation.title =
            action.payload.text?.substring(0, 30) + "..." || "Conversation";
        }
      }
    },

    setTyping: (state, action) => {
      state.isTyping = action.payload;
    },

    setLoading: (state, action) => {
      state.isLoading = action.payload;
    },

    setError: (state, action) => {
      state.error = action.payload;
    },

    clearError: (state) => {
      state.error = null;
    },

    toggleVoice: (state) => {
      state.voiceEnabled = !state.voiceEnabled;
    },

    toggleEmotionDetection: (state) => {
      state.emotionDetection = !state.emotionDetection;
    },

    loadConversation: (state, action) => {
      state.currentConversation = action.payload.conversationId;
      state.messages = action.payload.messages || [];
    },

    deleteConversation: (state, action) => {
      state.conversations = state.conversations.filter(
        (c) => c.id !== action.payload,
      );
      if (state.currentConversation === action.payload) {
        state.currentConversation = null;
        state.messages = [];
      }
    },

    clearMessages: (state) => {
      state.messages = [];
    },
  },
});

export const {
  startNewConversation,
  addMessage,
  setTyping,
  setLoading,
  setError,
  clearError,
  toggleVoice,
  toggleEmotionDetection,
  loadConversation,
  deleteConversation,
  clearMessages,
} = chatSlice.actions;

export default chatSlice.reducer;
