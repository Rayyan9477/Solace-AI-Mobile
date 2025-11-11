/**
 * Chat Response Service
 * Provides intelligent, keyword-based responses for AI therapy chat
 * Simulates conversational AI with empathetic responses
 */

import { logger } from "@shared/utils/logger";

interface ResponseTemplate {
  keywords: string[];
  responses: string[];
  followUp?: string;
  priority: number;
}

interface ChatContext {
  previousMood?: string;
  emotionalState?: "positive" | "negative" | "neutral" | "crisis";
  conversationTopic?: string;
  responseCount: number;
}

// Response templates organized by emotional context and keywords
const responseTemplates: ResponseTemplate[] = [
  // Crisis responses (highest priority)
  {
    keywords: ["suicide", "kill myself", "end my life", "want to die"],
    responses: [
      "I'm deeply concerned about what you're sharing. Your life has value, and there are people who want to help. Would you like to talk to someone right now? The 988 Suicide & Crisis Lifeline is available 24/7 at 988.",
      "I hear that you're in tremendous pain right now. Please know that these feelings can change with support. Crisis counselors are available 24/7 at 988 or text 'HELLO' to 741741.",
    ],
    followUp: "In the meantime, let's focus on keeping you safe. Can you tell me where you are right now?",
    priority: 10,
  },
  {
    keywords: ["hurt myself", "self harm", "cutting"],
    responses: [
      "I'm concerned about your safety. Self-harm might feel like it helps temporarily, but there are healthier ways to cope with these intense feelings. Have you considered reaching out to a counselor?",
      "Thank you for trusting me with this. What you're feeling is valid, and there are safer ways to manage this pain. Would you like to explore some alternatives together?",
    ],
    followUp: "What usually triggers these feelings for you?",
    priority: 9,
  },

  // Anxiety responses
  {
    keywords: ["anxious", "anxiety", "worried", "nervous", "panic"],
    responses: [
      "Anxiety can be really overwhelming. Let's try to ground ourselves for a moment. Can you name 5 things you can see around you right now?",
      "I understand you're feeling anxious. Remember, this feeling will pass. Would you like to try a breathing exercise together?",
      "Anxiety is your body's way of trying to protect you, even when there's no real danger. What's making you feel most anxious right now?",
    ],
    followUp: "Have you noticed any patterns to when you feel most anxious?",
    priority: 7,
  },
  {
    keywords: ["overwhelmed", "too much", "can't handle", "stressed"],
    responses: [
      "It sounds like you're carrying a lot right now. Sometimes when everything feels like too much, it helps to focus on just one small thing. What's one thing you could do today to feel a tiny bit better?",
      "Feeling overwhelmed is completely understandable. Let's break this down together. What feels most urgent right now?",
      "When we're overwhelmed, our minds can spiral. Let's pause and take three deep breaths together. Ready?",
    ],
    followUp: "What usually helps you feel more grounded when things get intense?",
    priority: 7,
  },

  // Depression responses
  {
    keywords: ["depressed", "sad", "hopeless", "empty", "numb"],
    responses: [
      "Depression can make everything feel heavy and colorless. I'm here with you. Have you been able to do any small things for yourself today?",
      "I hear that you're struggling with depression. That takes real courage to share. What does depression feel like for you today?",
      "When depression visits, it can feel permanent, but it's not. You've survived every difficult day so far. What's helped you get through tough times before?",
    ],
    followUp: "How long have you been feeling this way?",
    priority: 7,
  },
  {
    keywords: ["tired", "exhausted", "no energy", "fatigue"],
    responses: [
      "Emotional exhaustion is real and valid. Sometimes our minds need rest just as much as our bodies do. Have you been able to rest lately?",
      "Fatigue can be both physical and emotional. What's been taking the most energy from you recently?",
      "Being tired all the time can be a sign that you're fighting battles others can't see. What would rest look like for you right now?",
    ],
    followUp: "How has your sleep been lately?",
    priority: 5,
  },

  // Anger responses
  {
    keywords: ["angry", "frustrated", "pissed", "rage", "mad"],
    responses: [
      "Anger is a valid emotion that often protects other feelings. What's underneath your anger right now?",
      "I can feel the intensity of your frustration. Anger often tells us that a boundary has been crossed. What boundary might that be for you?",
      "It's okay to feel angry. Let's channel this energy constructively. What would you like to see change?",
    ],
    followUp: "How do you usually express anger in healthy ways?",
    priority: 6,
  },

  // Relationship issues
  {
    keywords: ["relationship", "partner", "boyfriend", "girlfriend", "spouse", "marriage"],
    responses: [
      "Relationships can bring both joy and challenge. What's happening in your relationship right now?",
      "It sounds like your relationship is on your mind. Would you like to explore what you're feeling about it?",
      "Navigating relationships requires so much emotional energy. What do you need from this relationship that you're not getting?",
    ],
    followUp: "How do you typically handle conflict in relationships?",
    priority: 5,
  },
  {
    keywords: ["lonely", "alone", "isolated", "no friends"],
    responses: [
      "Loneliness can be one of the most painful human experiences. You're not alone in feeling alone. What does connection mean to you?",
      "Feeling isolated is especially hard. Sometimes we can be surrounded by people and still feel lonely. What kind of connection are you craving?",
      "I'm here with you right now. Loneliness often tells us we need something. What do you think you need most?",
    ],
    followUp: "What makes you feel most connected to others?",
    priority: 6,
  },

  // Work/School stress
  {
    keywords: ["work", "job", "boss", "career", "coworker"],
    responses: [
      "Work stress can really impact our entire life. What's the most challenging part of your work situation right now?",
      "It sounds like work is weighing on you. How is it affecting other areas of your life?",
      "Professional challenges can feel very personal. What would your ideal work situation look like?",
    ],
    followUp: "How do you usually separate work stress from your personal life?",
    priority: 4,
  },
  {
    keywords: ["school", "study", "exam", "homework", "grades", "college"],
    responses: [
      "Academic pressure can be intense. Remember, your worth isn't determined by your grades. What's feeling most difficult about school?",
      "School stress is so common, yet it feels so personal. What subject or situation is causing the most anxiety?",
      "Education is important, but so is your mental health. How can we find a balance that works for you?",
    ],
    followUp: "What does success mean to you beyond grades?",
    priority: 4,
  },

  // Positive emotions
  {
    keywords: ["happy", "good", "great", "excited", "joy"],
    responses: [
      "It's wonderful to hear you're feeling positive! What's contributing to these good feelings?",
      "That's fantastic! Celebrating good moments is important. What made today special?",
      "Your positive energy is infectious! How can we help maintain this feeling?",
    ],
    followUp: "What helps you return to this feeling when things get tough?",
    priority: 3,
  },
  {
    keywords: ["better", "improving", "progress", "hopeful"],
    responses: [
      "Progress isn't always linear, so celebrating improvement is important. What's feeling better?",
      "Hope is such a powerful force. What's giving you hope right now?",
      "It's great to hear things are improving. What changes have you noticed?",
    ],
    followUp: "What strategies have been working for you?",
    priority: 3,
  },

  // General/Uncertain
  {
    keywords: ["don't know", "confused", "unsure", "maybe"],
    responses: [
      "It's okay not to have all the answers. Sometimes sitting with uncertainty is the bravest thing we can do. What feels most unclear right now?",
      "Confusion often means we're processing something important. Take your time. What would help bring clarity?",
      "Not knowing can be uncomfortable. Let's explore this together. What are you trying to figure out?",
    ],
    followUp: "What would it feel like to have clarity on this?",
    priority: 2,
  },
  {
    keywords: ["help", "support", "need"],
    responses: [
      "I'm here to support you. What kind of help would be most useful right now?",
      "Asking for help takes courage. What do you need most in this moment?",
      "You don't have to go through this alone. What would support look like for you?",
    ],
    followUp: "Who else in your life can offer support?",
    priority: 5,
  },
];

// Default responses when no keywords match
const defaultResponses = [
  "Thank you for sharing that with me. Can you tell me more about what you're experiencing?",
  "I hear you. How does that make you feel?",
  "That sounds significant. What's that like for you?",
  "I'm listening. What else would you like to share?",
  "Your feelings are valid. How long have you been experiencing this?",
];

// Empathetic acknowledgments to prepend occasionally
const acknowledgments = [
  "I can sense this is really important to you.",
  "Thank you for trusting me with this.",
  "Your courage in sharing this is admirable.",
  "I appreciate your openness.",
  "This clearly matters a lot to you.",
];

class ChatResponseService {
  private context: ChatContext = {
    responseCount: 0,
    emotionalState: "neutral",
  };

  /**
   * Generate a response based on user input
   */
  generateResponse(userInput: string): { message: string; emotion?: string } {
    try {
      const input = userInput.toLowerCase();
      let selectedTemplate: ResponseTemplate | null = null;
      let highestPriority = -1;

      // Find the best matching template based on keywords and priority
      for (const template of responseTemplates) {
        const matchCount = template.keywords.filter((keyword) =>
          input.includes(keyword)
        ).length;

        if (matchCount > 0 && template.priority > highestPriority) {
          selectedTemplate = template;
          highestPriority = template.priority;
        }
      }

      // Update context based on detected emotion
      this.updateEmotionalContext(highestPriority);

      // Generate response
      let response: string;
      if (selectedTemplate) {
        // Select a random response from the template
        const responses = selectedTemplate.responses;
        response = responses[Math.floor(Math.random() * responses.length)];

        // Occasionally add follow-up question
        if (selectedTemplate.followUp && Math.random() > 0.5) {
          response += " " + selectedTemplate.followUp;
        }
      } else {
        // Use default response
        response =
          defaultResponses[Math.floor(Math.random() * defaultResponses.length)];
      }

      // Occasionally prepend acknowledgment (30% chance)
      if (this.context.responseCount > 0 && Math.random() < 0.3) {
        const acknowledgment =
          acknowledgments[Math.floor(Math.random() * acknowledgments.length)];
        response = acknowledgment + " " + response;
      }

      this.context.responseCount++;

      return {
        message: response,
        emotion: this.context.emotionalState,
      };
    } catch (error) {
      logger.error("Error generating chat response:", error);
      return {
        message:
          "I'm here to listen. Could you tell me more about what you're experiencing?",
        emotion: "neutral",
      };
    }
  }

  /**
   * Update emotional context based on detected keywords
   */
  private updateEmotionalContext(priority: number) {
    if (priority >= 9) {
      this.context.emotionalState = "crisis";
    } else if (priority >= 6) {
      this.context.emotionalState = "negative";
    } else if (priority >= 3 && priority <= 4) {
      this.context.emotionalState = "neutral";
    } else if (priority < 3) {
      this.context.emotionalState = "positive";
    }
  }

  /**
   * Generate a greeting message
   */
  generateGreeting(userName?: string): string {
    const greetings = [
      `Hello${userName ? " " + userName : ""}! I'm here to support you today. How are you feeling?`,
      `Welcome back${userName ? " " + userName : ""}. What's on your mind today?`,
      `Hi${userName ? " " + userName : ""}. I'm glad you're here. What would you like to talk about?`,
      `Hello${userName ? " " + userName : ""}. How can I support you today?`,
    ];

    return greetings[Math.floor(Math.random() * greetings.length)];
  }

  /**
   * Generate a closing message
   */
  generateClosing(): string {
    const closings = [
      "Thank you for sharing with me today. Remember, I'm always here when you need support. Take care of yourself.",
      "It's been meaningful talking with you. Remember to be kind to yourself. I'm here whenever you need me.",
      "Thank you for this conversation. Your wellbeing matters. Don't hesitate to return whenever you need support.",
      "I appreciate you opening up today. Take things one step at a time. I'll be here when you need to talk again.",
    ];

    return closings[Math.floor(Math.random() * closings.length)];
  }

  /**
   * Reset conversation context
   */
  resetContext() {
    this.context = {
      responseCount: 0,
      emotionalState: "neutral",
    };
  }

  /**
   * Get suggested prompts based on current context
   */
  getSuggestedPrompts(): string[] {
    const prompts = {
      crisis: [
        "I need immediate help",
        "Can we do a breathing exercise?",
        "Help me create a safety plan",
      ],
      negative: [
        "I'm feeling overwhelmed",
        "Can you help me process this?",
        "What coping strategies do you recommend?",
      ],
      neutral: [
        "I want to talk about my day",
        "Can we explore my feelings?",
        "I need advice about something",
      ],
      positive: [
        "I want to share good news",
        "How can I maintain this feeling?",
        "I'm grateful for...",
      ],
    };

    return prompts[this.context.emotionalState || "neutral"] || prompts.neutral;
  }
}

// Export singleton instance
export const chatResponseService = new ChatResponseService();
export default chatResponseService;