/**
 * Solace AI Mobile - shadcn UI Example Screen
 * 
 * Comprehensive demonstration of all shadcn UI components designed for
 * mental health applications. This screen showcases therapeutic design
 * patterns, accessibility features, and component composition.
 */

import React, { useState } from 'react';
import {
  ScrollView,
  View,
  Text,
  SafeAreaView,
  Alert,
} from 'react-native';

// Import all shadcn UI components
import {
  // Buttons
  ShadcnButton,
  CalmingButton,
  NurturingButton,
  PeacefulButton,
  GroundingButton,
  EnergizingButton,
  OutlineButton,
  GhostButton,
  
  // Cards
  ShadcnCard,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
  TherapeuticCard,
  MoodCard,
  InteractiveCard,
  WellnessCard,
  
  // Specialized Components
  ShadcnMoodCheckIn,
  DetailedMoodCheckIn,
  QuickMoodCheckIn,
  
  ShadcnChatBubble,
  AIChatBubble,
  UserChatBubble,
  TherapeuticChatBubble,
  TypingChatBubble,
  
  ShadcnQuickActions,
  MoodBasedQuickActions,
  TherapeuticQuickActions,
  CompactQuickActions,
  
  // Progress Components
  ShadcnProgressBar,
  ShadcnCircularProgress,
  WellnessScoreCard,
  MoodProgressTracker,
  
  // Utils
  shadcnConfig,
} from '../index';

// Example data
const EXAMPLE_CHAT_MESSAGES = [
  {
    id: '1',
    message: "I've been feeling overwhelmed with work lately",
    sender: 'user',
    timestamp: '2:29 PM',
  },
  {
    id: '2',
    message: "I understand that work stress can feel overwhelming. Let's explore some techniques to help you manage these feelings. Would you like to try a breathing exercise?",
    sender: 'ai',
    timestamp: '2:30 PM',
    emotionIndicator: { mood: 'calm', label: 'Supportive response' },
  },
  {
    id: '3',
    message: "That sounds helpful, yes please",
    sender: 'user',
    timestamp: '2:31 PM',
  },
];

const WEEKLY_MOOD_DATA = [
  { mood: 'happy' },
  { mood: 'calm' },
  { mood: 'anxious' },
  { mood: 'calm' },
  { mood: 'content' },
  { mood: 'happy' },
  { mood: 'calm' },
];

const ShadcnUIExampleScreen = () => {
  const [currentMood, setCurrentMood] = useState('calm');
  const [moodIntensity, setMoodIntensity] = useState(3);
  const [wellnessScore] = useState(78);
  const [showTyping, setShowTyping] = useState(false);

  // Example handlers
  const handleMoodSelect = (mood) => {
    setCurrentMood(mood);
    Alert.alert('Mood Selected', `You selected: ${mood}`);
  };

  const handleMoodSubmit = (data) => {
    Alert.alert('Mood Submitted', JSON.stringify(data, null, 2));
  };

  const handleActionPress = (action) => {
    Alert.alert('Action Pressed', `Selected: ${action.title}`);
  };

  const handleChatPress = () => {
    setShowTyping(true);
    setTimeout(() => setShowTyping(false), 2000);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#f8fafc' }}>
      <ScrollView 
        style={{ flex: 1 }}
        contentContainerStyle={{ padding: 16 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <ShadcnCard variant="elevated" style={{ marginBottom: 24 }}>
          <CardHeader>
            <CardTitle therapeuticScheme="calming">
              shadcn UI for Mental Health Apps
            </CardTitle>
            <CardDescription>
              Comprehensive component library with therapeutic design patterns
            </CardDescription>
          </CardHeader>
        </ShadcnCard>

        {/* Button Examples */}
        <TherapeuticCard scheme="calming" style={{ marginBottom: 24 }}>
          <CardHeader>
            <CardTitle>Therapeutic Buttons</CardTitle>
            <CardDescription>
              Buttons designed with mental health color psychology
            </CardDescription>
          </CardHeader>
          <CardContent>
            <View style={{ gap: 12 }}>
              <CalmingButton gradient onPress={() => Alert.alert('Calming', 'For anxiety relief')}>
                Anxiety Relief
              </CalmingButton>
              
              <NurturingButton gradient onPress={() => Alert.alert('Nurturing', 'For growth and healing')}>
                Growth & Healing
              </NurturingButton>
              
              <PeacefulButton gradient onPress={() => Alert.alert('Peaceful', 'For meditation')}>
                Meditation Mode
              </PeacefulButton>
              
              <GroundingButton gradient onPress={() => Alert.alert('Grounding', 'For stability')}>
                Find Stability
              </GroundingButton>
              
              <EnergizingButton gradient onPress={() => Alert.alert('Energizing', 'For motivation')}>
                Boost Energy
              </EnergizingButton>
              
              <View style={{ flexDirection: 'row', gap: 12, marginTop: 8 }}>
                <OutlineButton style={{ flex: 1 }} onPress={() => Alert.alert('Outline')}>
                  Secondary
                </OutlineButton>
                <GhostButton style={{ flex: 1 }} onPress={() => Alert.alert('Ghost')}>
                  Subtle
                </GhostButton>
              </View>
            </View>
          </CardContent>
        </TherapeuticCard>

        {/* Mood Check-In Example */}
        <DetailedMoodCheckIn
          currentMood={currentMood}
          currentIntensity={moodIntensity}
          onMoodSelect={handleMoodSelect}
          onIntensityChange={setMoodIntensity}
          onSubmit={handleMoodSubmit}
          therapeuticMode
          timeBasedTheming
          animated
          style={{ marginBottom: 24 }}
        />

        {/* Wellness Score Card */}
        <WellnessScoreCard
          score={wellnessScore}
          title="Overall Wellness Score"
          subtitle="Based on your recent activity and mood tracking"
          trend="up"
          therapeuticScheme="energizing"
          showCircular
          style={{ marginBottom: 24 }}
        />

        {/* Progress Examples */}
        <TherapeuticCard scheme="peaceful" style={{ marginBottom: 24 }}>
          <CardHeader>
            <CardTitle>Progress Tracking</CardTitle>
            <CardDescription>
              Visual progress indicators with therapeutic colors
            </CardDescription>
          </CardHeader>
          <CardContent>
            <View style={{ gap: 16 }}>
              <ShadcnProgressBar
                value={85}
                therapeuticScheme="nurturing"
                label="Weekly Meditation Goal"
                animated
                gradient
              />
              
              <ShadcnProgressBar
                value={60}
                therapeuticScheme="calming"
                label="Anxiety Management"
                animated
                gradient
              />
              
              <View style={{ alignItems: 'center', marginTop: 16 }}>
                <ShadcnCircularProgress
                  value={78}
                  size={100}
                  therapeuticScheme="peaceful"
                  showLabel
                  label="Mindfulness"
                  animated
                />
              </View>
            </View>
          </CardContent>
        </TherapeuticCard>

        {/* Weekly Mood Progress */}
        <MoodProgressTracker
          weeklyData={WEEKLY_MOOD_DATA}
          currentMood={currentMood}
          style={{ marginBottom: 24 }}
        />

        {/* Chat Examples */}
        <TherapeuticCard scheme="grounding" style={{ marginBottom: 24 }}>
          <CardHeader>
            <CardTitle>Therapeutic Chat Interface</CardTitle>
            <CardDescription>
              AI therapy chat with supportive design patterns
            </CardDescription>
          </CardHeader>
          <CardContent>
            <View style={{ gap: 8 }}>
              {EXAMPLE_CHAT_MESSAGES.map((msg) => {
                if (msg.sender === 'user') {
                  return (
                    <UserChatBubble
                      key={msg.id}
                      message={msg.message}
                      timestamp={msg.timestamp}
                      animated
                    />
                  );
                } else {
                  return (
                    <TherapeuticChatBubble
                      key={msg.id}
                      message={msg.message}
                      timestamp={msg.timestamp}
                      emotionIndicator={msg.emotionIndicator}
                      animated
                      onPress={handleChatPress}
                    />
                  );
                }
              })}
              
              {showTyping && <TypingChatBubble />}
            </View>
          </CardContent>
        </TherapeuticCard>

        {/* Quick Actions Examples */}
        <ShadcnCard variant="elevated" style={{ marginBottom: 24 }}>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>
              Mood-aware action grids for mental health tools
            </CardDescription>
          </CardHeader>
          <CardContent>
            <MoodBasedQuickActions
              currentMood={currentMood}
              onActionPress={handleActionPress}
              columns={2}
              animated
              showDescriptions
            />
          </CardContent>
        </ShadcnCard>

        {/* Therapeutic Quick Actions */}
        <TherapeuticQuickActions
          onActionPress={handleActionPress}
          style={{ marginBottom: 24 }}
        />

        {/* Compact Quick Actions */}
        <ShadcnCard variant="elevated" style={{ marginBottom: 24 }}>
          <CardHeader>
            <CardTitle>Compact Actions</CardTitle>
            <CardDescription>
              Space-efficient action grid
            </CardDescription>
          </CardHeader>
          <CardContent>
            <CompactQuickActions
              onActionPress={handleActionPress}
              animated
            />
          </CardContent>
        </ShadcnCard>

        {/* Interactive Cards Examples */}
        <View style={{ gap: 16, marginBottom: 24 }}>
          <InteractiveCard 
            onPress={() => Alert.alert('Interactive', 'Card pressed!')}
            therapeuticScheme="calming"
            gradient
          >
            <CardContent>
              <Text style={{
                fontSize: 16,
                fontWeight: '600',
                color: shadcnConfig.colors.foreground.primary,
                marginBottom: 4,
              }}>
                Interactive Therapeutic Card
              </Text>
              <Text style={{
                fontSize: 14,
                color: shadcnConfig.colors.foreground.muted,
              }}>
                Tap to interact with calming animations
              </Text>
            </CardContent>
          </InteractiveCard>

          <MoodCard 
            mood="happy" 
            onPress={() => Alert.alert('Mood Card', 'Happy mood card pressed!')}
          >
            <CardContent>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Text style={{ fontSize: 32, marginRight: 12 }}>😊</Text>
                <View style={{ flex: 1 }}>
                  <Text style={{
                    fontSize: 16,
                    fontWeight: '600',
                    color: shadcnConfig.colors.foreground.primary,
                    marginBottom: 4,
                  }}>
                    Happy Mood
                  </Text>
                  <Text style={{
                    fontSize: 14,
                    color: shadcnConfig.colors.foreground.muted,
                  }}>
                    Feeling joyful and content
                  </Text>
                </View>
              </View>
            </CardContent>
          </MoodCard>

          <WellnessCard>
            <CardContent>
              <Text style={{
                fontSize: 16,
                fontWeight: '600',
                color: shadcnConfig.colors.foreground.primary,
                marginBottom: 4,
              }}>
                Wellness Tips
              </Text>
              <Text style={{
                fontSize: 14,
                color: shadcnConfig.colors.foreground.muted,
                lineHeight: 20,
              }}>
                Remember to take breaks, practice deep breathing, and stay hydrated throughout your day.
              </Text>
            </CardContent>
          </WellnessCard>
        </View>

        {/* Configuration Info */}
        <ShadcnCard variant="elevated">
          <CardHeader>
            <CardTitle therapeuticScheme="peaceful">
              Design System Features
            </CardTitle>
            <CardDescription>
              Key features of this shadcn UI implementation
            </CardDescription>
          </CardHeader>
          <CardContent>
            <View style={{ gap: 12 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Text style={{ fontSize: 20, marginRight: 8 }}>🎨</Text>
                <Text style={{ fontSize: 14, flex: 1 }}>
                  Therapeutic color psychology for mental wellness
                </Text>
              </View>
              
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Text style={{ fontSize: 20, marginRight: 8 }}>♿</Text>
                <Text style={{ fontSize: 14, flex: 1 }}>
                  WCAG 2.1 accessibility compliance with screen reader support
                </Text>
              </View>
              
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Text style={{ fontSize: 20, marginRight: 8 }}>📱</Text>
                <Text style={{ fontSize: 14, flex: 1 }}>
                  Mobile-optimized with haptic feedback and touch targets
                </Text>
              </View>
              
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Text style={{ fontSize: 20, marginRight: 8 }}>✨</Text>
                <Text style={{ fontSize: 14, flex: 1 }}>
                  Gentle animations that respect reduced motion preferences
                </Text>
              </View>
              
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Text style={{ fontSize: 20, marginRight: 8 }}>🧠</Text>
                <Text style={{ fontSize: 14, flex: 1 }}>
                  Mental health-focused component variants and interactions
                </Text>
              </View>
            </View>
          </CardContent>
          
          <CardFooter>
            <ShadcnButton
              variant="outline"
              onPress={() => Alert.alert(
                'shadcn UI for Mental Health',
                'This implementation demonstrates how to adapt shadcn UI patterns for React Native mental health applications with therapeutic design principles.'
              )}
              style={{ flex: 1 }}
            >
              Learn More
            </ShadcnButton>
          </CardFooter>
        </ShadcnCard>

        {/* Bottom spacing */}
        <View style={{ height: 32 }} />
      </ScrollView>
    </SafeAreaView>
  );
};

export default ShadcnUIExampleScreen;