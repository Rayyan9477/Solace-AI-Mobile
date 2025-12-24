/**
 * TherapySessionDetailScreen - View details of a past therapy session
 * Shows complete session transcript, mood, exercises, and insights
 */

import { useNavigation, useRoute } from "@react-navigation/native";
import { useTheme } from "@theme/ThemeProvider";
import { useResponsive } from "@shared/hooks/useResponsive";
import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
} from "react-native";

interface Message {
  id: string;
  sender: "user" | "ai";
  content: string;
  timestamp: string;
}

interface SessionSummary {
  exercisesCompleted: string[];
  topics: string[];
  moodBefore: number;
  moodAfter: number;
  insights: string[];
}

interface TherapySession {
  id: string;
  date: string;
  duration: number; // in minutes
  moodBefore: number;
  moodAfter: number;
  messages: Message[];
  summary: SessionSummary;
}

// Sample therapy sessions database
const SAMPLE_SESSIONS: Record<string, TherapySession> = {
  "session-001": {
    id: "session-001",
    date: "2025-11-08",
    duration: 35,
    moodBefore: 4,
    moodAfter: 7,
    messages: [
      {
        id: "msg-1",
        sender: "ai",
        content:
          "Hello! I'm here to support you today. How are you feeling right now?",
        timestamp: "14:30",
      },
      {
        id: "msg-2",
        sender: "user",
        content:
          "I've been feeling pretty anxious lately. Work has been really stressful and I can't seem to relax even when I'm home.",
        timestamp: "14:31",
      },
      {
        id: "msg-3",
        sender: "ai",
        content:
          "Thank you for sharing that with me. Anxiety can be really challenging, especially when it follows you home from work. Can you tell me more about what specifically at work is causing you stress?",
        timestamp: "14:31",
      },
      {
        id: "msg-4",
        sender: "user",
        content:
          "I have this big project deadline coming up next week, and I feel like there's so much to do. I keep worrying that I won't finish in time or that I'll make mistakes.",
        timestamp: "14:33",
      },
      {
        id: "msg-5",
        sender: "ai",
        content:
          "It sounds like you're experiencing anticipatory anxiety about the deadline. That's very common and completely understandable. When we worry about future events, our minds can sometimes magnify the potential problems. Let's try to break this down together. What specific tasks do you have left to complete?",
        timestamp: "14:34",
      },
      {
        id: "msg-6",
        sender: "user",
        content:
          "Well, I need to finish the data analysis, write the final report, and prepare the presentation. When I think about all of it together, it feels overwhelming.",
        timestamp: "14:36",
      },
      {
        id: "msg-7",
        sender: "ai",
        content:
          "Breaking tasks into smaller pieces is a great coping strategy. You've already done that by listing three main tasks. Now, let's make them even more manageable. For the data analysis, what would be the very next step you need to take?",
        timestamp: "14:37",
      },
      {
        id: "msg-8",
        sender: "user",
        content:
          "I guess I need to organize the raw data first, then run the statistical tests. That actually doesn't sound too bad when I think about just that one step.",
        timestamp: "14:38",
      },
      {
        id: "msg-9",
        sender: "ai",
        content:
          "Exactly! You've just demonstrated an important principle: when we break overwhelming tasks into single, concrete steps, they become much more manageable. Your mind is less likely to feel overwhelmed by 'organize raw data' than by 'finish entire project.' Let's practice a breathing exercise to help calm your anxiety before we continue planning.",
        timestamp: "14:39",
      },
      {
        id: "msg-10",
        sender: "user",
        content: "That sounds helpful. What should I do?",
        timestamp: "14:40",
      },
      {
        id: "msg-11",
        sender: "ai",
        content:
          "I recommend the 4-7-8 breathing technique. It's scientifically proven to activate your parasympathetic nervous system and reduce anxiety. Would you like to try it now?",
        timestamp: "14:40",
      },
      {
        id: "msg-12",
        sender: "user",
        content:
          "Yes, I just completed the breathing exercise. I actually do feel calmer now. That's interesting how quickly it worked.",
        timestamp: "14:47",
      },
      {
        id: "msg-13",
        sender: "ai",
        content:
          "I'm glad that helped! The 4-7-8 technique is powerful because it gives your mind something specific to focus on, interrupting the anxiety spiral. You can use this anytime you feel overwhelmed. Now, let's create a realistic action plan for your project. Do you have time to work on it this weekend?",
        timestamp: "14:48",
      },
      {
        id: "msg-14",
        sender: "user",
        content:
          "Yes, I have Saturday and Sunday mostly free. I was planning to work on it but kept putting it off because I felt so overwhelmed.",
        timestamp: "14:49",
      },
      {
        id: "msg-15",
        sender: "ai",
        content:
          "That's actually a form of avoidance, which is a common response to anxiety. But avoidance usually makes anxiety worse over time. Now that you've broken the project into smaller steps, you have a clearer path forward. Here's what I suggest: Schedule specific time blocks for each task. For example, Saturday morning for organizing data, Saturday afternoon for statistical tests. What do you think?",
        timestamp: "14:50",
      },
      {
        id: "msg-16",
        sender: "user",
        content:
          "That makes sense. I think I can do that. It feels much more achievable when it's scheduled like that instead of just 'work on project all weekend.'",
        timestamp: "14:52",
      },
      {
        id: "msg-17",
        sender: "ai",
        content:
          "Excellent insight! You're learning to recognize how framing affects your emotional response. One more thing: What will you do to take care of yourself this weekend while working on the project?",
        timestamp: "14:53",
      },
      {
        id: "msg-18",
        sender: "user",
        content:
          "I haven't really thought about that. Maybe I could take breaks to go for short walks? I usually forget to take breaks when I'm stressed.",
        timestamp: "14:54",
      },
      {
        id: "msg-19",
        sender: "ai",
        content:
          "Short walks are perfect! Movement helps process stress hormones. Try the Pomodoro Technique: work for 25 minutes, then take a 5-minute break. Every four cycles, take a longer 15-20 minute break. This prevents burnout and actually improves productivity. Does that sound doable?",
        timestamp: "14:55",
      },
      {
        id: "msg-20",
        sender: "user",
        content:
          "Yes, I think I can do that. Thank you so much. I feel like I actually have a plan now instead of just feeling paralyzed by anxiety.",
        timestamp: "14:57",
      },
      {
        id: "msg-21",
        sender: "ai",
        content:
          "You're very welcome. You've done excellent work today recognizing your anxiety, practicing coping strategies, and creating an actionable plan. Remember: anxiety is information, not a command. It's your mind trying to protect you, but you don't have to let it control your actions. You have the tools now. How are you feeling compared to when we started?",
        timestamp: "14:58",
      },
      {
        id: "msg-22",
        sender: "user",
        content:
          "Much better! I'd say I went from a 4 to maybe a 7 in terms of how I'm feeling. The overwhelm is still there a little, but it's manageable now.",
        timestamp: "15:00",
      },
      {
        id: "msg-23",
        sender: "ai",
        content:
          "That's wonderful progress! A 3-point improvement in one session shows you're actively engaging with these strategies. Remember to use the 4-7-8 breathing whenever you feel that anxiety rising. And be kind to yourself this weekend - you're doing your best in a challenging situation. Would you like to schedule another session for next week after your project is complete?",
        timestamp: "15:01",
      },
      {
        id: "msg-24",
        sender: "user",
        content:
          "Yes, that would be great. Thank you again for all your help today.",
        timestamp: "15:02",
      },
      {
        id: "msg-25",
        sender: "ai",
        content:
          "You're welcome! Take care of yourself, and remember - you've got this. Feel free to reach out anytime you need support.",
        timestamp: "15:02",
      },
    ],
    summary: {
      exercisesCompleted: ["4-7-8 Breathing Technique"],
      topics: [
        "Work-related anxiety",
        "Project deadline stress",
        "Task overwhelm",
        "Avoidance behaviors",
        "Time management",
      ],
      moodBefore: 4,
      moodAfter: 7,
      insights: [
        "Breaking large tasks into smaller, concrete steps reduces overwhelm",
        "Breathing exercises can quickly reduce acute anxiety",
        "Avoidance is a common anxiety response that worsens stress over time",
        "Structured planning with specific time blocks increases sense of control",
        "Regular breaks and self-care prevent burnout during stressful periods",
      ],
    },
  },
  "session-002": {
    id: "session-002",
    date: "2025-11-05",
    duration: 28,
    moodBefore: 5,
    moodAfter: 8,
    messages: [
      {
        id: "msg-1",
        sender: "ai",
        content: "Welcome back! How have you been since our last session?",
        timestamp: "10:15",
      },
      {
        id: "msg-2",
        sender: "user",
        content:
          "Pretty good actually. I've been practicing the breathing exercises you taught me, and they really help when I feel anxious.",
        timestamp: "10:16",
      },
      {
        id: "msg-3",
        sender: "ai",
        content:
          "That's wonderful to hear! Building a consistent practice with coping techniques is a sign of real progress. Today, I'd like to help you work on something new. Is there anything specific on your mind?",
        timestamp: "10:17",
      },
      {
        id: "msg-4",
        sender: "user",
        content:
          "Well, I've noticed I tend to be really hard on myself when things don't go perfectly. Even small mistakes make me feel like a failure.",
        timestamp: "10:19",
      },
      {
        id: "msg-5",
        sender: "ai",
        content:
          "Thank you for sharing that. Many people struggle with self-criticism, and recognizing this pattern is an important first step. Can you give me an example of a recent situation where you were hard on yourself?",
        timestamp: "10:20",
      },
    ],
    summary: {
      exercisesCompleted: ["Mindful Observation"],
      topics: ["Self-compassion", "Perfectionism", "Negative self-talk"],
      moodBefore: 5,
      moodAfter: 8,
      insights: [
        "Self-criticism often stems from unrealistic perfectionism",
        "Treating yourself with the same kindness you'd show a friend reduces anxiety",
        "Mindfulness practices help interrupt automatic negative thoughts",
      ],
    },
  },
};

/**
 * TherapySessionDetailScreen Component
 * Displays full details of a completed therapy session
 */
const TherapySessionDetailScreen = () => {
  const { theme } = useTheme();
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const { sessionId } = route.params || {};
  const { isWeb, getMaxContentWidth, getContainerPadding } = useResponsive();

  const [showFullTranscript, setShowFullTranscript] = useState(false);

  const session = SAMPLE_SESSIONS[sessionId] || SAMPLE_SESSIONS["session-001"];
  const maxWidth = getMaxContentWidth();
  const contentMaxWidth = isWeb ? Math.min(maxWidth, 800) : "100%";
  const containerPadding = getContainerPadding();

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getMoodLabel = (mood: number): string => {
    if (mood >= 8) return "Great";
    if (mood >= 6) return "Good";
    if (mood >= 4) return "Okay";
    if (mood >= 2) return "Difficult";
    return "Very Difficult";
  };

  const getMoodColor = (mood: number): string => {
    if (mood >= 8) return theme.colors.green[60];
    if (mood >= 6) return theme.colors.green[50];
    if (mood >= 4) return theme.colors.orange[40];
    if (mood >= 2) return theme.colors.orange[60];
    return theme.colors.red[60];
  };

  const displayedMessages = showFullTranscript
    ? session.messages
    : session.messages.slice(0, 6);

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background.primary,
    },
    scrollContent: {
      flexGrow: 1,
    },
    innerContainer: {
      width: "100%",
      alignItems: "center",
    },
    contentWrapper: {
      width: "100%",
      maxWidth: contentMaxWidth,
      paddingHorizontal: containerPadding,
    },
    header: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingHorizontal: 20,
      paddingVertical: 16,
      backgroundColor: theme.colors.brown[70],
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.brown[60],
    },
    backButton: {
      padding: 8,
    },
    backButtonText: {
      fontSize: 16,
      fontWeight: "600",
      color: theme.colors.brown[10],
    },
    headerTitle: {
      fontSize: 18,
      fontWeight: "700",
      color: theme.colors.brown[10],
    },
    headerSpacer: {
      width: 60,
    },
    content: {
      paddingVertical: 16,
      gap: 16,
    },
    card: {
      backgroundColor: theme.colors.brown[20],
      borderRadius: 16,
      padding: 20,
    },
    cardTitle: {
      fontSize: 20,
      fontWeight: "700",
      color: theme.colors.text.primary,
      marginBottom: 16,
    },
    sessionMetadata: {
      gap: 12,
    },
    metaRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
    },
    metaLabel: {
      fontSize: 14,
      fontWeight: "600",
      color: theme.colors.text.secondary,
    },
    metaValue: {
      fontSize: 14,
      fontWeight: "700",
      color: theme.colors.text.primary,
    },
    moodRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginTop: 8,
    },
    moodItem: {
      alignItems: "center",
      flex: 1,
    },
    moodLabel: {
      fontSize: 13,
      fontWeight: "600",
      color: theme.colors.text.secondary,
      marginBottom: 8,
    },
    moodBadge: {
      paddingHorizontal: 16,
      paddingVertical: 8,
      borderRadius: 12,
      minWidth: 60,
      alignItems: "center",
    },
    moodText: {
      fontSize: 16,
      fontWeight: "700",
      color: "#FFFFFF",
    },
    moodChange: {
      flexDirection: "row",
      alignItems: "center",
      gap: 4,
      marginTop: 8,
    },
    moodChangeText: {
      fontSize: 13,
      fontWeight: "600",
      color: theme.colors.green[60],
    },
    transcriptCard: {
      backgroundColor: theme.colors.brown[20],
      borderRadius: 16,
      padding: 20,
    },
    messageContainer: {
      marginBottom: 16,
    },
    messageHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 8,
    },
    messageSender: {
      fontSize: 13,
      fontWeight: "700",
      color: theme.colors.brown[70],
    },
    messageTime: {
      fontSize: 12,
      fontWeight: "500",
      color: theme.colors.text.tertiary,
    },
    messageContent: {
      fontSize: 15,
      lineHeight: 22,
      color: theme.colors.text.secondary,
    },
    messageBubbleUser: {
      backgroundColor: theme.colors.brown[30],
      borderRadius: 12,
      padding: 12,
    },
    messageBubbleAI: {
      backgroundColor: theme.colors.brown[25],
      borderRadius: 12,
      padding: 12,
    },
    showMoreButton: {
      backgroundColor: theme.colors.brown[30],
      paddingVertical: 12,
      borderRadius: 12,
      alignItems: "center",
      marginTop: 8,
    },
    showMoreText: {
      fontSize: 14,
      fontWeight: "600",
      color: theme.colors.brown[70],
    },
    listSection: {
      gap: 8,
    },
    listItem: {
      flexDirection: "row",
      alignItems: "flex-start",
      gap: 8,
    },
    bullet: {
      fontSize: 14,
      color: theme.colors.brown[70],
      marginTop: 2,
    },
    listText: {
      flex: 1,
      fontSize: 15,
      lineHeight: 22,
      color: theme.colors.text.secondary,
    },
    insightItem: {
      backgroundColor: theme.colors.brown[30],
      borderRadius: 12,
      padding: 16,
      marginBottom: 12,
    },
    insightText: {
      fontSize: 15,
      lineHeight: 22,
      color: theme.colors.text.primary,
    },
    button: {
      backgroundColor: theme.colors.brown[70],
      paddingVertical: 16,
      borderRadius: 12,
      alignItems: "center",
    },
    buttonText: {
      fontSize: 16,
      fontWeight: "600",
      color: theme.colors.brown[10],
    },
  });

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
          accessible
          accessibilityLabel="Go back"
          accessibilityRole="button"
        >
          <Text style={styles.backButtonText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Session Details</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.innerContainer}>
          <View style={styles.contentWrapper}>
            <View style={styles.content}>
              {/* Session Metadata */}
              <View style={styles.card}>
                <Text style={styles.cardTitle}>Session Overview</Text>
                <View style={styles.sessionMetadata}>
                  <View style={styles.metaRow}>
                    <Text style={styles.metaLabel}>Date:</Text>
                    <Text style={styles.metaValue}>
                      {formatDate(session.date)}
                    </Text>
                  </View>
                  <View style={styles.metaRow}>
                    <Text style={styles.metaLabel}>Duration:</Text>
                    <Text style={styles.metaValue}>{session.duration} min</Text>
                  </View>
                  <View style={styles.metaRow}>
                    <Text style={styles.metaLabel}>Exercises Completed:</Text>
                    <Text style={styles.metaValue}>
                      {session.summary.exercisesCompleted.length}
                    </Text>
                  </View>
                </View>
              </View>

              {/* Mood Comparison */}
              <View style={styles.card}>
                <Text style={styles.cardTitle}>Mood Progress</Text>
                <View style={styles.moodRow}>
                  <View style={styles.moodItem}>
                    <Text style={styles.moodLabel}>Before Session</Text>
                    <View
                      style={[
                        styles.moodBadge,
                        { backgroundColor: getMoodColor(session.moodBefore) },
                      ]}
                    >
                      <Text style={styles.moodText}>
                        {session.moodBefore}/10
                      </Text>
                    </View>
                    <Text style={[styles.metaLabel, { marginTop: 8 }]}>
                      {getMoodLabel(session.moodBefore)}
                    </Text>
                  </View>

                  <View style={styles.moodChange}>
                    <Text style={styles.moodChangeText}>→</Text>
                  </View>

                  <View style={styles.moodItem}>
                    <Text style={styles.moodLabel}>After Session</Text>
                    <View
                      style={[
                        styles.moodBadge,
                        { backgroundColor: getMoodColor(session.moodAfter) },
                      ]}
                    >
                      <Text style={styles.moodText}>
                        {session.moodAfter}/10
                      </Text>
                    </View>
                    <Text style={[styles.metaLabel, { marginTop: 8 }]}>
                      {getMoodLabel(session.moodAfter)}
                    </Text>
                  </View>
                </View>

                <View style={[styles.moodChange, { justifyContent: "center" }]}>
                  <Text style={styles.moodChangeText}>
                    ↑ +{session.moodAfter - session.moodBefore} point
                    improvement
                  </Text>
                </View>
              </View>

              {/* Topics Discussed */}
              <View style={styles.card}>
                <Text style={styles.cardTitle}>Topics Discussed</Text>
                <View style={styles.listSection}>
                  {/* LOW-NEW-002 FIX: Use topic text as stable key instead of index */}
                  {session.summary.topics.map((topic) => (
                    <View key={`topic-${topic.substring(0, 25).replace(/\s/g, '-')}`} style={styles.listItem}>
                      <Text style={styles.bullet}>•</Text>
                      <Text style={styles.listText}>{topic}</Text>
                    </View>
                  ))}
                </View>
              </View>

              {/* Key Insights */}
              <View style={styles.card}>
                <Text style={styles.cardTitle}>Key Insights & Learnings</Text>
                {/* LOW-NEW-002 FIX: Use insight text as stable key instead of index */}
                {session.summary.insights.map((insight) => (
                  <View key={`insight-${insight.substring(0, 25).replace(/\s/g, '-')}`} style={styles.insightItem}>
                    <Text style={styles.insightText}>{insight}</Text>
                  </View>
                ))}
              </View>

              {/* Conversation Transcript */}
              <View style={styles.transcriptCard}>
                <Text style={styles.cardTitle}>Conversation Transcript</Text>
                {displayedMessages.map((message) => (
                  <View key={message.id} style={styles.messageContainer}>
                    <View style={styles.messageHeader}>
                      <Text style={styles.messageSender}>
                        {message.sender === "ai" ? "AI Therapist" : "You"}
                      </Text>
                      <Text style={styles.messageTime}>
                        {message.timestamp}
                      </Text>
                    </View>
                    <View
                      style={
                        message.sender === "user"
                          ? styles.messageBubbleUser
                          : styles.messageBubbleAI
                      }
                    >
                      <Text style={styles.messageContent}>
                        {message.content}
                      </Text>
                    </View>
                  </View>
                ))}

                {!showFullTranscript && session.messages.length > 6 && (
                  <TouchableOpacity
                    style={styles.showMoreButton}
                    onPress={() => setShowFullTranscript(true)}
                    accessible
                    accessibilityLabel="Show full transcript"
                    accessibilityRole="button"
                  >
                    <Text style={styles.showMoreText}>
                      Show Full Transcript ({session.messages.length - 6} more
                      messages)
                    </Text>
                  </TouchableOpacity>
                )}
              </View>

              {/* Action Button */}
              <TouchableOpacity
                style={styles.button}
                onPress={() => navigation.navigate("TherapyHistory")}
                accessible
                accessibilityLabel="View all sessions"
                accessibilityRole="button"
              >
                <Text style={styles.buttonText}>View All Sessions</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

// LOW-NEW-001 FIX: Add displayName for debugging
TherapySessionDetailScreen.displayName = 'TherapySessionDetailScreen';

export default TherapySessionDetailScreen;
