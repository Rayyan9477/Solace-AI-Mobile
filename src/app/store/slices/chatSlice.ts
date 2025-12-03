import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// HIGH-024 FIX: Secure ID generation to prevent collisions
let idCounter = 0;
function generateSecureId(prefix: string = ''): string {
  // Combine multiple entropy sources for collision resistance:
  // 1. Timestamp (ms precision)
  // 2. Monotonic counter (prevents collision in same ms)
  // 3. Random component (prevents collision across instances)
  const timestamp = Date.now().toString(36);
  const counter = (idCounter++).toString(36).padStart(4, '0');
  const random = Math.random().toString(36).substring(2, 10);
  return `${prefix}${timestamp}-${counter}-${random}`;
}

// TypeScript interfaces
interface Conversation {
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  messageCount: number;
}

interface Message {
  id: string;
  text?: string;
  timestamp: string;
  sender?: string;
  type?: string;
  [key: string]: any;
}

interface ChatState {
  conversations: Conversation[];
  currentConversation: string | null;
  messages: Message[];
  isTyping: boolean;
  isLoading: boolean;
  error: string | null;
  voiceEnabled: boolean;
  emotionDetection: boolean;
}

const initialState: ChatState = {
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
    startNewConversation: (
      state,
      action: PayloadAction<{ title?: string }>,
    ) => {
      const newConversation: Conversation = {
        // HIGH-024 FIX: Use secure ID generation
        id: generateSecureId('conv-'),
        title: action.payload.title || "New Conversation",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        messageCount: 0,
      };
      state.conversations.unshift(newConversation);
      state.currentConversation = newConversation.id;
      state.messages = [];
    },

    addMessage: (state, action: PayloadAction<Partial<Message>>) => {
      const message: Message = {
        // HIGH-024 FIX: Use secure ID generation
        id: generateSecureId('msg-'),
        timestamp: new Date().toISOString(),
        ...action.payload,
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

    setTyping: (state, action: PayloadAction<boolean>) => {
      state.isTyping = action.payload;
    },

    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },

    setError: (state, action: PayloadAction<string | null>) => {
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

    loadConversation: (
      state,
      action: PayloadAction<{ conversationId: string; messages?: Message[] }>,
    ) => {
      state.currentConversation = action.payload.conversationId;
      state.messages = action.payload.messages || [];
    },

    deleteConversation: (state, action: PayloadAction<string>) => {
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
