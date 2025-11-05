import chatReducer, {
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
} from "../../../../src/app/store/slices/chatSlice";

describe("chatSlice", () => {
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

  it("should return the initial state", () => {
    expect(chatReducer(undefined, { type: undefined })).toEqual(initialState);
  });

  describe("startNewConversation", () => {
    it("should start a new conversation with default title", () => {
      const action = startNewConversation({});
      const result = chatReducer(initialState, action);

      expect(result.conversations).toHaveLength(1);
      expect(result.conversations[0]).toMatchObject({
        title: "New Conversation",
        messageCount: 0,
      });
      expect(result.currentConversation).toBe(result.conversations[0].id);
      expect(result.messages).toEqual([]);
    });

    it("should start a new conversation with custom title", () => {
      const action = startNewConversation({ title: "Test Conversation" });
      const result = chatReducer(initialState, action);

      expect(result.conversations[0].title).toBe("Test Conversation");
    });

    it("should add new conversation to the beginning of the list", () => {
      const stateWithConversation = {
        ...initialState,
        conversations: [
          {
            id: "1",
            title: "Existing",
            messageCount: 0,
            createdAt: "",
            updatedAt: "",
          },
        ],
      };

      const action = startNewConversation({ title: "New" });
      const result = chatReducer(stateWithConversation, action);

      expect(result.conversations).toHaveLength(2);
      expect(result.conversations[0].title).toBe("New");
      expect(result.conversations[1].title).toBe("Existing");
    });
  });

  describe("addMessage", () => {
    it("should add a message to the current conversation", () => {
      const stateWithConversation = {
        ...initialState,
        conversations: [
          {
            id: "1",
            title: "Test",
            messageCount: 0,
            createdAt: "",
            updatedAt: "",
          },
        ],
        currentConversation: "1",
      };

      const action = addMessage({ text: "Hello", isUser: true });
      const result = chatReducer(stateWithConversation, action);

      expect(result.messages).toHaveLength(1);
      expect(result.messages[0]).toMatchObject({
        text: "Hello",
        isUser: true,
      });
      expect(result.conversations[0].messageCount).toBe(1);
    });

    it("should update conversation title from first message", () => {
      const stateWithConversation = {
        ...initialState,
        conversations: [
          {
            id: "1",
            title: "New Conversation",
            messageCount: 0,
            createdAt: "",
            updatedAt: "",
          },
        ],
        currentConversation: "1",
      };

      const action = addMessage({
        text: "This is a very long message that should be truncated",
        isUser: true,
      });
      const result = chatReducer(stateWithConversation, action);

      expect(result.conversations[0].title).toBe(
        "This is a very long message th...",
      );
    });

    it("should not update conversation title if already customized", () => {
      const stateWithConversation = {
        ...initialState,
        conversations: [
          {
            id: "1",
            title: "Custom Title",
            messageCount: 0,
            createdAt: "",
            updatedAt: "",
          },
        ],
        currentConversation: "1",
      };

      const action = addMessage({ text: "Hello", isUser: true });
      const result = chatReducer(stateWithConversation, action);

      expect(result.conversations[0].title).toBe("Custom Title");
    });
  });

  describe("setTyping", () => {
    it("should set typing status", () => {
      const action = setTyping(true);
      const result = chatReducer(initialState, action);

      expect(result.isTyping).toBe(true);
    });
  });

  describe("setLoading", () => {
    it("should set loading status", () => {
      const action = setLoading(true);
      const result = chatReducer(initialState, action);

      expect(result.isLoading).toBe(true);
    });
  });

  describe("setError", () => {
    it("should set error message", () => {
      const action = setError("Network error");
      const result = chatReducer(initialState, action);

      expect(result.error).toBe("Network error");
    });
  });

  describe("clearError", () => {
    it("should clear error message", () => {
      const stateWithError = {
        ...initialState,
        error: "Some error",
      };

      const action = clearError();
      const result = chatReducer(stateWithError, action);

      expect(result.error).toBe(null);
    });
  });

  describe("toggleVoice", () => {
    it("should toggle voice enabled from false to true", () => {
      const action = toggleVoice();
      const result = chatReducer(initialState, action);

      expect(result.voiceEnabled).toBe(true);
    });

    it("should toggle voice enabled from true to false", () => {
      const stateWithVoice = {
        ...initialState,
        voiceEnabled: true,
      };

      const action = toggleVoice();
      const result = chatReducer(stateWithVoice, action);

      expect(result.voiceEnabled).toBe(false);
    });
  });

  describe("toggleEmotionDetection", () => {
    it("should toggle emotion detection from true to false", () => {
      const action = toggleEmotionDetection();
      const result = chatReducer(initialState, action);

      expect(result.emotionDetection).toBe(false);
    });

    it("should toggle emotion detection from false to true", () => {
      const stateWithEmotionDetection = {
        ...initialState,
        emotionDetection: false,
      };

      const action = toggleEmotionDetection();
      const result = chatReducer(stateWithEmotionDetection, action);

      expect(result.emotionDetection).toBe(true);
    });
  });

  describe("loadConversation", () => {
    it("should load a conversation with messages", () => {
      const messages = [
        {
          id: "1",
          text: "Hello",
          isUser: true,
          timestamp: "2023-01-01T00:00:00.000Z",
        },
        {
          id: "2",
          text: "Hi there",
          isUser: false,
          timestamp: "2023-01-01T00:00:01.000Z",
        },
      ];

      const action = loadConversation({ conversationId: "123", messages });
      const result = chatReducer(initialState, action);

      expect(result.currentConversation).toBe("123");
      expect(result.messages).toEqual(messages);
    });

    it("should load a conversation without messages", () => {
      const action = loadConversation({ conversationId: "123", messages: [] });
      const result = chatReducer(initialState, action);

      expect(result.currentConversation).toBe("123");
      expect(result.messages).toEqual([]);
    });
  });

  describe("deleteConversation", () => {
    it("should delete a conversation that is not current", () => {
      const stateWithConversations = {
        ...initialState,
        conversations: [
          {
            id: "1",
            title: "Conversation 1",
            messageCount: 0,
            createdAt: "",
            updatedAt: "",
          },
          {
            id: "2",
            title: "Conversation 2",
            messageCount: 0,
            createdAt: "",
            updatedAt: "",
          },
        ],
        currentConversation: "1",
      };

      const action = deleteConversation("2");
      const result = chatReducer(stateWithConversations, action);

      expect(result.conversations).toHaveLength(1);
      expect(result.conversations[0].id).toBe("1");
      expect(result.currentConversation).toBe("1");
    });

    it("should delete current conversation and clear state", () => {
      const stateWithConversations = {
        ...initialState,
        conversations: [
          {
            id: "1",
            title: "Conversation 1",
            messageCount: 0,
            createdAt: "",
            updatedAt: "",
          },
          {
            id: "2",
            title: "Conversation 2",
            messageCount: 0,
            createdAt: "",
            updatedAt: "",
          },
        ],
        currentConversation: "1",
        messages: [{ id: "1", text: "Hello", isUser: true, timestamp: "" }],
      };

      const action = deleteConversation("1");
      const result = chatReducer(stateWithConversations, action);

      expect(result.conversations).toHaveLength(1);
      expect(result.conversations[0].id).toBe("2");
      expect(result.currentConversation).toBe(null);
      expect(result.messages).toEqual([]);
    });
  });

  describe("clearMessages", () => {
    it("should clear all messages", () => {
      const stateWithMessages = {
        ...initialState,
        messages: [
          { id: "1", text: "Hello", isUser: true, timestamp: "" },
          { id: "2", text: "Hi", isUser: false, timestamp: "" },
        ],
      };

      const action = clearMessages();
      const result = chatReducer(stateWithMessages, action);

      expect(result.messages).toEqual([]);
    });
  });

  describe("integration tests", () => {
    it("should handle a complete conversation flow", () => {
      let state = initialState;

      // Start new conversation
      state = chatReducer(state, startNewConversation({ title: "Test Chat" }));
      expect(state.conversations).toHaveLength(1);
      expect(state.currentConversation).toBe(state.conversations[0].id);

      // Add messages
      state = chatReducer(
        state,
        addMessage({ text: "Hello AI", isUser: true }),
      );
      state = chatReducer(
        state,
        addMessage({ text: "Hello human", isUser: false }),
      );
      expect(state.messages).toHaveLength(2);
      expect(state.conversations[0].messageCount).toBe(2);

      // Set typing and loading states
      state = chatReducer(state, setTyping(true));
      state = chatReducer(state, setLoading(true));
      expect(state.isTyping).toBe(true);
      expect(state.isLoading).toBe(true);

      // Clear states
      state = chatReducer(state, setTyping(false));
      state = chatReducer(state, setLoading(false));
      expect(state.isTyping).toBe(false);
      expect(state.isLoading).toBe(false);

      // Toggle features
      state = chatReducer(state, toggleVoice());
      state = chatReducer(state, toggleEmotionDetection());
      expect(state.voiceEnabled).toBe(true);
      expect(state.emotionDetection).toBe(false);

      // Set and clear error
      state = chatReducer(state, setError("Connection failed"));
      expect(state.error).toBe("Connection failed");
      state = chatReducer(state, clearError());
      expect(state.error).toBe(null);
    });

    it("should handle multiple conversations", () => {
      let state = initialState;

      // Create first conversation
      state = chatReducer(state, startNewConversation({ title: "First Chat" }));
      const firstConversationId = state.currentConversation;
      state = chatReducer(
        state,
        addMessage({ text: "First message", isUser: true }),
      );

      // Create second conversation
      state = chatReducer(
        state,
        startNewConversation({ title: "Second Chat" }),
      );
      const secondConversationId = state.currentConversation;
      state = chatReducer(
        state,
        addMessage({ text: "Second message", isUser: true }),
      );

      expect(state.conversations).toHaveLength(2);
      expect(state.conversations[0].id).toBe(secondConversationId);
      expect(state.conversations[1].id).toBe(firstConversationId);
      expect(state.messages).toHaveLength(1); // Only current conversation messages
      expect(state.messages[0].text).toBe("Second message");
    });
  });
});
