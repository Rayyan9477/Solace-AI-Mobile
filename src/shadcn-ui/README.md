# Solace AI Mobile - shadcn UI Integration

A comprehensive shadcn UI system designed specifically for mental health applications, providing therapeutic design patterns, accessibility-first components, and React Native compatibility.

## 🎨 Design Philosophy

This shadcn UI integration follows core principles designed to support mental wellness:

- **Therapeutic Color Psychology**: Calming blues, nurturing greens, peaceful grays, grounding purples, and energizing oranges
- **Gentle Animations**: Smooth, non-jarring transitions that promote calmness and reduce anxiety
- **Accessibility-First**: WCAG 2.1 compliance with proper contrast ratios, touch targets, and screen reader support
- **Mobile-Optimized**: Touch-friendly components with haptic feedback and responsive design
- **Mental Health Focus**: Components specifically designed for mood tracking, therapy interactions, and wellness monitoring

## 🏗️ Architecture

### Core Files Structure

```
src/shadcn-ui/
├── config.js              # Main configuration and design tokens
├── utils.js               # Utility functions for colors, animations, accessibility
├── index.js               # Main export file
└── components/
    ├── index.js           # Component exports
    ├── Button.js          # Enhanced button component with therapeutic variants
    ├── Card.js            # Flexible card component with mood-based styling
    ├── MoodCheckIn.js     # Comprehensive mood tracking interface
    ├── ChatBubble.js      # Therapy chat bubble component
    ├── QuickActions.js    # Quick actions grid for mental health tools
    └── Progress.js        # Progress visualization components
```

## 🎯 Key Features

### Therapeutic Color System

```javascript
import { colorUtils } from '@/shadcn-ui';

// Get therapeutic colors
const calmingColor = colorUtils.resolveColor('therapeutic.calming.500');
const moodColor = colorUtils.getTherapeuticColor('anxious');
const gradient = colorUtils.getTherapeuticGradient('nurturing', 2);
```

### Component Variants

All components support therapeutic schemes:
- **Calming**: Soft blues for anxiety and stress relief
- **Nurturing**: Gentle greens for growth and healing
- **Peaceful**: Muted blue-grays for serenity and meditation
- **Grounding**: Warm purples for stability and focus
- **Energizing**: Soft oranges for motivation and positivity

### Accessibility Features

- Minimum 44px touch targets on mobile
- WCAG 2.1 AA contrast compliance
- Screen reader optimization
- Keyboard navigation support
- Haptic feedback integration
- Focus management and announcements

## 📚 Component Library

### Button Components

#### Basic Usage
```jsx
import { ShadcnButton, CalmingButton } from '@/shadcn-ui';

// Standard button with therapeutic scheme
<ShadcnButton 
  variant="primary" 
  therapeuticScheme="calming"
  onPress={handlePress}
>
  Start Meditation
</ShadcnButton>

// Specialized therapeutic button
<CalmingButton gradient onPress={handleMeditation}>
  Begin Breathing Exercise
</CalmingButton>
```

#### Available Variants
- `PrimaryButton` - Main action button
- `SecondaryButton` - Secondary actions
- `OutlineButton` - Subtle actions
- `GhostButton` - Minimal actions
- `CalmingButton` - For anxiety relief
- `NurturingButton` - For growth and healing
- `PeacefulButton` - For meditation and calm
- `GroundingButton` - For stability and focus
- `EnergizingButton` - For motivation

### Card Components

#### Basic Usage
```jsx
import { ShadcnCard, TherapeuticCard, MoodCard } from '@/shadcn-ui';

// Standard card with therapeutic styling
<TherapeuticCard scheme="calming" gradient>
  <CardHeader>
    <CardTitle>Daily Reflection</CardTitle>
    <CardDescription>Take a moment to reflect on your day</CardDescription>
  </CardHeader>
  <CardContent>
    {/* Card content */}
  </CardContent>
</TherapeuticCard>

// Mood-based card that adapts colors
<MoodCard mood="anxious" interactive onPress={handleMoodView}>
  <CardContent>
    <Text>Current mood: Anxious</Text>
    <Text>Intensity: 3/5</Text>
  </CardContent>
</MoodCard>
```

#### Available Variants
- `TherapeuticCard` - With therapeutic color schemes
- `MoodCard` - Adapts to mood colors
- `InteractiveCard` - Touchable with press animations
- `WellnessCard` - For wellness content
- `ProgressCard` - For progress tracking
- `InsightCard` - For insights and tips

### Mood Check-In Component

#### Basic Usage
```jsx
import { ShadcnMoodCheckIn, DetailedMoodCheckIn } from '@/shadcn-ui';

// Comprehensive mood check-in with intensity tracking
<DetailedMoodCheckIn
  currentMood="calm"
  currentIntensity={3}
  onMoodSelect={(mood) => console.log('Selected mood:', mood)}
  onIntensityChange={(intensity) => console.log('Intensity:', intensity)}
  onSubmit={(data) => console.log('Submitted:', data)}
  therapeuticMode
  timeBasedTheming
  animated
/>

// Quick mood check without intensity
<QuickMoodCheckIn
  onMoodSelect={handleQuickMood}
  animated={false}
/>
```

#### Features
- 8 therapeutic mood options with descriptions
- 5-level intensity scale
- Time-based theming
- Staggered animations
- Accessibility support
- Step-by-step flow

### Chat Bubble Components

#### Basic Usage
```jsx
import { 
  AIChatBubble, 
  UserChatBubble, 
  TherapeuticChatBubble,
  TypingChatBubble 
} from '@/shadcn-ui';

// AI therapist message with therapeutic styling
<TherapeuticChatBubble
  message="I understand you're feeling anxious. Let's try a breathing exercise together."
  timestamp="2:30 PM"
  emotionIndicator={{ mood: 'calm', label: 'Supportive response' }}
  onPress={handleMessagePress}
/>

// User message
<UserChatBubble
  message="I've been feeling overwhelmed lately"
  timestamp="2:29 PM"
/>

// Typing indicator
<TypingChatBubble />
```

#### Features
- User, AI, and system message variants
- Therapeutic gradients for AI responses
- Emotion indicators
- Typing animations
- Avatar integration
- Accessibility labels

### Quick Actions Grid

#### Basic Usage
```jsx
import { 
  ShadcnQuickActions, 
  MoodBasedQuickActions,
  TherapeuticQuickActions 
} from '@/shadcn-ui';

// Mood-aware quick actions
<MoodBasedQuickActions
  currentMood="anxious"
  onActionPress={(action) => navigation.navigate(action.screen)}
  columns={2}
  animated
  showDescriptions
/>

// Therapeutic-focused actions
<TherapeuticQuickActions
  onActionPress={handleAction}
  size="large"
/>

// Custom actions
<ShadcnQuickActions
  actions={[
    {
      id: 'meditation',
      title: 'Meditation',
      description: 'Guided mindfulness',
      icon: 'Mindfulness',
      therapeuticScheme: 'peaceful',
    },
    // ... more actions
  ]}
  columns={3}
  variant="grid"
/>
```

#### Features
- Customizable action grid
- Therapeutic gradients
- Icon integration
- Mood-based prioritization
- Staggered animations
- Haptic feedback

### Progress Components

#### Basic Usage
```jsx
import { 
  ShadcnProgressBar,
  ShadcnCircularProgress,
  WellnessScoreCard,
  MoodProgressTracker 
} from '@/shadcn-ui';

// Linear progress with therapeutic colors
<ShadcnProgressBar
  value={75}
  max={100}
  therapeuticScheme="nurturing"
  label="Weekly Wellness Goal"
  animated
  gradient
/>

// Circular progress
<ShadcnCircularProgress
  value={85}
  size={120}
  therapeuticScheme="calming"
  showLabel
  label="Mood Stability"
/>

// Wellness score card
<WellnessScoreCard
  score={78}
  title="Overall Wellness"
  subtitle="This week's average"
  trend="up"
  therapeuticScheme="energizing"
  showCircular
/>

// Weekly mood tracking
<MoodProgressTracker
  weeklyData={[
    { mood: 'happy' },
    { mood: 'calm' },
    { mood: 'anxious' },
    // ... 7 days
  ]}
  currentMood="calm"
/>
```

#### Features
- Linear and circular progress bars
- Therapeutic color schemes
- Animated progressions
- Wellness score cards
- Mood tracking visualization
- Trend indicators

## 🛠️ Utility Functions

### Color Utilities

```javascript
import { colorUtils } from '@/shadcn-ui';

// Resolve color tokens
const primaryColor = colorUtils.resolveColor('primary.500');
const therapeuticColor = colorUtils.resolveColor('therapeutic.calming.400');

// Get mood-based colors
const anxiousColor = colorUtils.getTherapeuticColor('anxious');

// Generate therapeutic gradients
const calmingGradient = colorUtils.getTherapeuticGradient('calming', 2);

// Add opacity
const transparentColor = colorUtils.withOpacity('#3b82f6', 0.5);
```

### Animation Utilities

```javascript
import { animationUtils } from '@/shadcn-ui';

// Gentle entrance animation
animationUtils.createGentleEntrance(animatedValue).start();

// Soothing slide-in
animationUtils.createSoothingSlideIn(translateY, opacity).start();

// Breathing animation for meditation
animationUtils.createBreathingAnimation(scaleValue).start();

// Staggered animations
animationUtils.createStaggeredEntrance(animatedValues, 100).start();
```

### Accessibility Utilities

```javascript
import { accessibilityUtils } from '@/shadcn-ui';

// Get accessibility props
const a11yProps = accessibilityUtils.getAccessibilityProps({
  label: 'Start meditation session',
  hint: 'Double tap to begin guided meditation',
  role: 'button',
  testID: 'meditation-button',
});

// Ensure minimum touch target
const { style, hitSlop } = accessibilityUtils.ensureMinimumTouchTarget({
  width: 32,
  height: 32,
});

// Analyze content for readability
const analysis = accessibilityUtils.analyzeTherapeuticContent(text);
```

## 🎨 Therapeutic Design Tokens

### Color Schemes

```javascript
// Therapeutic colors for different mental health contexts
therapeutic: {
  calming: '#0ea5e9',      // Anxiety relief, stress reduction
  nurturing: '#22c55e',    // Growth, healing, positivity  
  peaceful: '#64748b',     // Meditation, serenity
  grounding: '#a855f7',    // Stability, focus, centering
  energizing: '#f97316',   // Motivation, enthusiasm
}

// Mood-specific colors
mood: {
  happy: '#fbbf24',
  calm: '#22c55e', 
  anxious: '#f97316',
  sad: '#3b82f6',
  angry: '#ef4444',
  neutral: '#64748b',
  excited: '#a855f7',
  tired: '#6b7280',
  stressed: '#dc2626',
  content: '#059669',
}
```

### Animation Presets

```javascript
// Calming animation configurations
animations: {
  gentle: { duration: 300, easing: 'ease-out' },
  soothing: { duration: 500, easing: 'ease-in-out' },
  calm: { duration: 200, easing: 'ease-out' },
  breathe: { duration: 4000, easing: 'ease-in-out', loop: true },
}
```

## 🔧 Configuration

### Custom Themes

```javascript
import { themeUtils } from '@/shadcn-ui';

// Time-based theming
const timeTheme = themeUtils.getTimeBasedTheme('default', new Date());

// Mood-based theme modifications
const moodTheme = themeUtils.applyMoodTheme(baseTheme, 'calm');
```

### Platform Optimizations

```javascript
import { platformUtils } from '@/shadcn-ui';

// Platform-specific styles
const platformStyle = platformUtils.getPlatformStyle({
  ios: { shadowOpacity: 0.1 },
  android: { elevation: 4 },
  default: { borderWidth: 1 },
});

// Platform-specific shadows
const shadow = platformUtils.getPlatformShadow(shadowConfig);
```

## 📱 Example Implementation

### Complete Mood Check-In Screen

```jsx
import React, { useState } from 'react';
import { ScrollView } from 'react-native';
import {
  ShadcnCard,
  CardHeader,
  CardTitle,
  DetailedMoodCheckIn,
  WellnessScoreCard,
  MoodProgressTracker,
  TherapeuticQuickActions,
} from '@/shadcn-ui';

const MoodTrackingScreen = () => {
  const [currentMood, setCurrentMood] = useState('calm');
  const [wellnessScore, setWellnessScore] = useState(78);

  const weeklyMoodData = [
    { mood: 'happy' },
    { mood: 'calm' },
    { mood: 'anxious' },
    { mood: 'calm' },
    { mood: 'content' },
    { mood: 'happy' },
    { mood: 'calm' },
  ];

  return (
    <ScrollView style={{ flex: 1, backgroundColor: '#f8fafc' }}>
      {/* Daily Mood Check-In */}
      <DetailedMoodCheckIn
        currentMood={currentMood}
        onMoodSelect={setCurrentMood}
        onSubmit={(data) => {
          console.log('Mood submitted:', data);
          // Handle mood submission
        }}
        therapeuticMode
        timeBasedTheming
        animated
      />

      {/* Wellness Score */}
      <WellnessScoreCard
        score={wellnessScore}
        title="Wellness Score"
        subtitle="Based on your recent activity"
        trend="up"
        therapeuticScheme="energizing"
        style={{ margin: 16 }}
      />

      {/* Weekly Progress */}
      <MoodProgressTracker
        weeklyData={weeklyMoodData}
        currentMood={currentMood}
        style={{ margin: 16 }}
      />

      {/* Quick Actions */}
      <TherapeuticQuickActions
        onActionPress={(action) => {
          console.log('Action pressed:', action);
          // Handle navigation
        }}
        style={{ margin: 16 }}
      />
    </ScrollView>
  );
};

export default MoodTrackingScreen;
```

## 🚀 Getting Started

1. **Install Dependencies**
   ```bash
   npm install expo-linear-gradient expo-haptics react-native-svg
   ```

2. **Import Components**
   ```jsx
   import { ShadcnButton, TherapeuticCard } from '@/shadcn-ui';
   ```

3. **Use Therapeutic Design**
   ```jsx
   <ShadcnButton therapeuticScheme="calming" gradient>
     Start Your Journey
   </ShadcnButton>
   ```

## 🎯 Mental Health Best Practices

### Color Psychology
- **Blue (Calming)**: Reduces anxiety and promotes tranquility
- **Green (Nurturing)**: Encourages growth and healing
- **Gray (Peaceful)**: Provides neutral, meditative spaces
- **Purple (Grounding)**: Offers stability and focus
- **Orange (Energizing)**: Motivates and inspires action

### Animation Guidelines
- Use gentle, non-jarring transitions (300-500ms duration)
- Implement breathing animations for meditation features
- Provide staggered entrances to avoid overwhelming users
- Respect reduced motion preferences

### Accessibility Considerations
- Maintain 4.5:1 contrast ratio for normal text
- Ensure 44px minimum touch targets
- Provide clear focus indicators
- Include descriptive accessibility labels
- Support screen readers with proper announcements

## 🔧 Customization

### Custom Therapeutic Scheme

```javascript
// Add custom therapeutic colors
const customConfig = {
  ...shadcnConfig,
  colors: {
    ...shadcnConfig.colors,
    therapeutic: {
      ...shadcnConfig.colors.therapeutic,
      healing: {
        50: '#f0f9f0',
        100: '#dcf0dc',
        // ... full color scale
        500: '#4a9a4a',
        // ...
      },
    },
  },
};
```

### Custom Components

```jsx
// Create custom therapeutic component
const HealingButton = (props) => (
  <ShadcnButton 
    variant="primary" 
    therapeuticScheme="healing"
    gradient
    hapticFeedback
    {...props} 
  />
);
```

## 📄 License

This shadcn UI integration is part of the Solace AI Mobile mental health application. It demonstrates how to adapt shadcn UI patterns for React Native with a focus on therapeutic design and accessibility.

## 🤝 Contributing

When contributing to this component library, please ensure:

1. **Therapeutic Focus**: All components should support mental wellness
2. **Accessibility First**: WCAG 2.1 AA compliance is required
3. **Mobile Optimization**: Components must work perfectly on mobile devices
4. **Animation Respect**: Honor reduced motion preferences
5. **Color Psychology**: Use therapeutic color schemes appropriately
6. **Documentation**: Include comprehensive usage examples

---

**Note**: This implementation showcases how shadcn UI principles can be adapted for React Native mental health applications. It demonstrates therapeutic design patterns, accessibility best practices, and mobile optimization techniques specifically tailored for mental wellness applications.