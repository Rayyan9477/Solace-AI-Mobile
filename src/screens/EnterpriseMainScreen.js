import React, { useState, useCallback, useMemo } from 'react';
import { useNavigation } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import { RefreshControl, Alert, Linking } from 'react-native';
import { useTheme } from 'react-native-paper';

import {
  Container,
  Section,
  Grid,
  Spacer
} from '../design-system/components/Layout';
import {
  Card,
  CardHeader,
  CardContent,
  CardActions
} from '../design-system/components/Card';
import {
  Button,
  ButtonGroup
} from '../design-system/components/Button';
import {
  Heading,
  Body,
  TherapeuticText
} from '../design-system/components/Typography';
import {
  TherapeuticGradient,
  OrganicShape,
  MentalHealthPatterns
} from '../design-system/backgrounds/PaperShaders';
import {
  FloatingElement,
  PulseElement,
  AnimatedCounter,
  staggerContainer,
  staggerItem
} from '../design-system/animations/TherapeuticAnimations';
import { Avatar, IconButton, ProgressBar, FAB } from 'react-native-paper';

const THERAPEUTIC_TIPS = [
  {
    tip: "Take three deep breaths and notice how your body feels in this moment",
    category: "Mindfulness",
    icon: "meditation",
    emotion: "calm"
  },
  {
    tip: "Practice the 5-4-3-2-1 grounding technique to center yourself",
    category: "Grounding",
    icon: "nature",
    emotion: "anxiety"
  },
  {
    tip: "Remember: it's okay to not be okay. Your feelings are valid",
    category: "Self-Compassion",
    icon: "heart",
    emotion: "depression"
  },
  {
    tip: "Journal three things you're grateful for today",
    category: "Gratitude",
    icon: "book",
    emotion: "positive"
  },
  {
    tip: "Connect with someone you care about today",
    category: "Connection",
    icon: "account-group",
    emotion: "positive"
  }
];

const WelcomeCard = ({ userName, greeting, onProfilePress, onEmergencyPress }) => {
  const theme = useTheme();

  return (
    <Card therapeuticColor="serenityGreen" animationType="slide">
      <CardHeader
        title={
          <Heading level={3} therapeuticColor="serenityGreen">
            {greeting}, {userName}
          </Heading>
        }
        subtitle={
          <Body therapeuticColor="serenityGreen">
            How are you feeling today?
          </Body>
        }
        avatar={
          <PulseElement therapeuticMode="calm">
            <Avatar.Icon size={48} icon="account" />
          </PulseElement>
        }
        action={
          <IconButton
            icon="alert-circle"
            iconColor={theme.colors.empathyOrange[60]}
            onPress={onEmergencyPress}
          />
        }
      />
    </Card>
  );
};

const DailyTipCard = ({ tip, onRefresh }) => (
  <Card therapeuticColor="mindfulBrown" animationType="fade">
    <CardHeader
      title="Daily Wellness Tip"
      action={
        <IconButton icon="refresh" onPress={onRefresh} />
      }
    />
    <CardContent>
      <TherapeuticText emotion={tip.emotion} emphasize>
        {tip.tip}
      </TherapeuticText>
      <Spacer size={8} />
      <Body size="small" therapeuticColor="mindfulBrown">
        {tip.category}
      </Body>
    </CardContent>
  </Card>
);

const MoodCheckInCard = ({ currentMood, onCheckIn }) => {
  const moodOptions = [
    { label: 'Great', value: 5, color: 'serenityGreen', icon: 'emoticon-excited' },
    { label: 'Good', value: 4, color: 'zenYellow', icon: 'emoticon-happy' },
    { label: 'Okay', value: 3, color: 'empathyOrange', icon: 'emoticon-neutral' },
    { label: 'Low', value: 2, color: 'kindPurple', icon: 'emoticon-sad' },
    { label: 'Difficult', value: 1, color: 'mindfulBrown', icon: 'emoticon-cry' }
  ];

  return (
    <Card therapeuticColor="serenityGreen" animationType="hover">
      <CardHeader
        title="Mood Check-in"
        subtitle={currentMood ? `Current: ${currentMood.label}` : "How are you feeling?"}
      />
      <CardContent>
        <ButtonGroup orientation="horizontal">
          {moodOptions.map((mood) => (
            <Button
              key={mood.value}
              variant="outlined"
              therapeuticColor={mood.color}
              size="small"
              icon={mood.icon}
              onPress={() => onCheckIn(mood)}
              animationType="scale"
            >
              {mood.label}
            </Button>
          ))}
        </ButtonGroup>
      </CardContent>
    </Card>
  );
};

const QuickActionsCard = ({ onStartChat, onTakeAssessment, onMoodTracker }) => (
  <Card therapeuticColor="empathyOrange" animationType="stagger">
    <CardHeader title="Quick Actions" />
    <CardContent>
      <Grid columns={2} spacing={12}>
        <Button
          variant="filled"
          therapeuticColor="serenityGreen"
          icon="chat"
          onPress={onStartChat}
          animationType="bounce"
        >
          AI Therapy
        </Button>
        <Button
          variant="filled"
          therapeuticColor="kindPurple"
          icon="clipboard-check"
          onPress={onTakeAssessment}
          animationType="bounce"
        >
          Assessment
        </Button>
        <Button
          variant="outlined"
          therapeuticColor="zenYellow"
          icon="chart-line"
          onPress={onMoodTracker}
          animationType="bounce"
        >
          Mood Tracker
        </Button>
        <Button
          variant="outlined"
          therapeuticColor="mindfulBrown"
          icon="meditation"
          animationType="bounce"
        >
          Mindfulness
        </Button>
      </Grid>
    </CardContent>
  </Card>
);

const ProgressCard = ({ weeklyStats, userStats }) => {
  const moodScore = weeklyStats?.averageMood || 0;
  const streakDays = userStats?.currentStreak || 0;
  const totalSessions = userStats?.totalSessions || 0;

  return (
    <Card therapeuticColor="kindPurple" animationType="slide">
      <CardHeader title="Your Progress" />
      <CardContent>
        <Section spacing={16}>
          <div style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <div style={{ alignItems: 'center' }}>
              <AnimatedCounter from={0} to={moodScore} />
              <Body size="small">Weekly Mood</Body>
            </div>
            <div style={{ alignItems: 'center' }}>
              <AnimatedCounter from={0} to={streakDays} />
              <Body size="small">Day Streak</Body>
            </div>
            <div style={{ alignItems: 'center' }}>
              <AnimatedCounter from={0} to={totalSessions} />
              <Body size="small">Sessions</Body>
            </div>
          </div>
          <ProgressBar
            progress={moodScore / 5}
            color={moodScore > 3 ? '#7D944D' : '#C96100'}
          />
        </Section>
      </CardContent>
    </Card>
  );
};

const EnterpriseMainScreen = () => {
  const navigation = useNavigation();
  const theme = useTheme();
  const [refreshing, setRefreshing] = useState(false);
  const [currentTip, setCurrentTip] = useState(THERAPEUTIC_TIPS[0]);

  const { user, mood, chat } = useSelector((state) => ({
    user: state.user || { profile: { name: "Friend" }, stats: {} },
    mood: state.mood || {
      currentMood: null,
      insights: [],
      weeklyStats: {},
      moodHistory: []
    },
    chat: state.chat || { conversations: [] }
  }));

  const greeting = useMemo(() => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 17) return "Good afternoon";
    return "Good evening";
  }, []);

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    const randomTip = THERAPEUTIC_TIPS[Math.floor(Math.random() * THERAPEUTIC_TIPS.length)];
    setCurrentTip(randomTip);
    setTimeout(() => setRefreshing(false), 1000);
  }, []);

  const handleTipRefresh = useCallback(() => {
    const randomTip = THERAPEUTIC_TIPS[Math.floor(Math.random() * THERAPEUTIC_TIPS.length)];
    setCurrentTip(randomTip);
  }, []);

  const handleMoodCheckIn = useCallback((mood) => {
    navigation.navigate("Mood", { selectedMood: mood });
  }, [navigation]);

  const handleStartChat = useCallback(() => {
    navigation.navigate("Chat");
  }, [navigation]);

  const handleTakeAssessment = useCallback(() => {
    navigation.navigate("Assessment");
  }, [navigation]);

  const handleViewProfile = useCallback(() => {
    navigation.navigate("Profile");
  }, [navigation]);

  const showEmergencyAlert = useCallback(() => {
    Alert.alert(
      "🚨 Emergency Crisis Support",
      "If you are experiencing a mental health crisis, please contact:\n\n• National Suicide Prevention Lifeline: 988\n• Crisis Text Line: Text HOME to 741741\n• Or call 911 for immediate assistance\n\nYou are not alone. Help is available 24/7.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Call 988 Now",
          style: "default",
          onPress: async () => {
            try {
              const supported = await Linking.canOpenURL("tel:988");
              if (supported) {
                await Linking.openURL("tel:988");
              }
            } catch (error) {
              Alert.alert("Call Error", "Please dial 988 manually for immediate assistance.");
            }
          }
        }
      ]
    );
  }, []);

  return (
    <TherapeuticGradient therapeuticColor="serenityGreen" intensity="subtle">
      <MentalHealthPatterns pattern="breathing" therapeuticColor="serenityGreen">
        <OrganicShape
          therapeuticColor="empathyOrange"
          size={150}
          position={{ top: 100, right: -30 }}
          animationType="float"
        />
        <OrganicShape
          therapeuticColor="kindPurple"
          size={100}
          position={{ bottom: 200, left: -20 }}
          animationType="pulse"
        />

        <Container
          scrollable
          safe
          animationType="fade"
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefresh}
              tintColor={theme.colors.serenityGreen[60]}
            />
          }
        >
          <Section title="" animationType="stagger">
            <WelcomeCard
              userName={user?.profile?.name || "Friend"}
              greeting={greeting}
              onProfilePress={handleViewProfile}
              onEmergencyPress={showEmergencyAlert}
            />

            <DailyTipCard tip={currentTip} onRefresh={handleTipRefresh} />

            <MoodCheckInCard
              currentMood={mood?.currentMood}
              onCheckIn={handleMoodCheckIn}
            />

            <QuickActionsCard
              onStartChat={handleStartChat}
              onTakeAssessment={handleTakeAssessment}
              onMoodTracker={() => handleMoodCheckIn(null)}
            />

            <ProgressCard
              weeklyStats={mood?.weeklyStats}
              userStats={user?.stats}
            />

            <Spacer size={100} />
          </Section>
        </Container>

        <FAB
          icon="chat"
          style={{
            position: 'absolute',
            margin: 16,
            right: 0,
            bottom: 0,
            backgroundColor: theme.colors.serenityGreen[60]
          }}
          onPress={handleStartChat}
        />
      </MentalHealthPatterns>
    </TherapeuticGradient>
  );
};

export default EnterpriseMainScreen;