# Solace AI Mobile Design System

A comprehensive, therapeutic-focused design system built for mental health applications, featuring customizable components, therapeutic color palettes, and accessibility-first design principles.

## 🎨 Overview

The Solace AI Mobile Design System is specifically designed for mental health applications, incorporating color psychology, therapeutic design principles, and user-centered accessibility features. The system provides a cohesive visual language that promotes calm, trust, and emotional well-being.

## 📁 System Architecture

```
src/design-system/
├── DesignTokens.js          # Core design tokens and theming system
├── README.md                # This documentation
└── index.js                 # Main exports

src/components/
├── common/
│   ├── Button.js            # Advanced button component with therapeutic themes
│   ├── Card.js              # Flexible card component with animations
│   ├── Input.js             # Form input with therapeutic styling
│   ├── Avatar.js            # User avatar component
│   ├── Badge.js             # Status badges and indicators
│   └── ActivityIndicator.js # Loading indicators
├── dashboard/
│   ├── WelcomeHeader.js     # Dashboard welcome component
│   ├── MoodCheckIn.js       # Mood tracking interface
│   ├── DailyInsights.js     # AI-powered daily insights
│   ├── QuickActions.js      # Therapeutic action shortcuts
│   ├── ProgressOverview.js  # Mental health progress visualization
│   └── RecentActivity.js    # Activity timeline
├── icons/
│   ├── IconSystem.js        # Complete SVG icon system
│   ├── AppIcons.js          # Application-specific icons
│   └── MentalHealthIcons.js # Mental health themed icons
└── crisis/
    └── CrisisRiskAssessment.js # Crisis intervention system
```

## 🎯 Design Principles

### 1. Therapeutic Color Psychology
- **Calming**: Soft blues for peace and tranquility
- **Nurturing**: Gentle greens for growth and healing
- **Peaceful**: Muted blue-grays for serenity
- **Grounding**: Warm purples for stability
- **Energizing**: Soft oranges for motivation
- **Focus**: Clear blues for concentration
- **Mindful**: Fresh greens for awareness
- **Balance**: Warm yellows for equilibrium

### 2. Accessibility First
- Minimum 44x44px touch targets
- WCAG 2.1 AA compliance
- High contrast modes
- Screen reader compatibility
- Reduced motion support
- Semantic accessibility labels

### 3. Mental Health Focused
- Non-jarring animations
- Gentle transitions
- Calming micro-interactions
- Supportive visual hierarchy
- Stress-reducing color schemes

## 🔧 Core Tokens

### Color System

```javascript
import { BaseDesignTokens } from './DesignTokens';

// Therapeutic colors
const calmingBlue = BaseDesignTokens.colors.therapeutic.calming[500];
const nurturingGreen = BaseDesignTokens.colors.therapeutic.nurturing[500];
const peacefulGray = BaseDesignTokens.colors.therapeutic.peaceful[500];
```

### Typography Scale

```javascript
// Typography variants
'h1' - 60px - Headers and hero text
'h2' - 48px - Section headers
'h3' - 36px - Subsection headers
'h4' - 30px - Card titles
'h5' - 24px - List headers
'h6' - 20px - Small headers
'body1' - 16px - Primary body text
'body2' - 14px - Secondary body text
'therapeutic' - 18px - Therapeutic content
'mindful' - 20px - Mindfulness text
```

### Spacing System

```javascript
// Consistent spacing scale
spacing[1]  = 4px   // xs
spacing[2]  = 8px   // sm  
spacing[4]  = 16px  // md (base)
spacing[6]  = 24px  // lg
spacing[8]  = 32px  // xl
spacing[12] = 48px  // 2xl
spacing[16] = 64px  // 3xl
```

## 🧩 Component Usage

### Button Component

```jsx
import Button from '../components/common/Button';

// Basic usage
<Button
  title="Continue"
  onPress={handlePress}
  variant="primary"
  size="medium"
/>

// Therapeutic themed button
<Button
  title="Start Meditation"
  onPress={startMeditation}
  variant="therapeutic"
  style={{ backgroundColor: '#0EA5E9' }}
/>

// Emergency button
<Button
  title="Emergency Support"
  onPress={callSupport}
  variant="danger"
  size="large"
/>
```

### Card Component

```jsx
import Card from '../components/common/Card';

// Basic card
<Card
  title="Daily Check-in"
  subtitle="How are you feeling today?"
  onPress={openCheckIn}
  variant="elevated"
/>

// Therapeutic card
<Card
  title="Mindfulness Exercise"
  description="5-minute breathing meditation"
  variant="therapeutic"
  onPress={startMeditation}
/>
```

### Input Component

```jsx
import Input from '../components/common/Input';

// Basic input
<Input
  label="How are you feeling?"
  value={feeling}
  onChangeText={setFeeling}
  placeholder="Describe your emotions..."
  variant="therapeutic"
/>

// Secure input
<Input
  label="Password"
  value={password}
  onChangeText={setPassword}
  secureTextEntry={true}
  variant="secure"
/>
```

### Typography

```jsx
// Typography components available through design tokens

// Headers
<Heading level={1} therapeuticTheme="calming">
  Welcome to Solace
</Heading>

// Therapeutic text
<TherapeuticText theme="peaceful">
  Take a moment to breathe and center yourself.
</TherapeuticText>

// Custom typography
<Typography
  variant="body1"
  color="#2D5AA0"
  weight="medium"
  align="center"
>
  Your mental health matters.
</Typography>
```

### Layout Components

```jsx
// Layout utilities available through design tokens

// Container with therapeutic theme
<Container
  therapeuticTheme="calming"
  padding="lg"
  safeArea={true}
  scrollable={true}
>
  <Stack spacing="md" align="center">
    <Heading level={2}>Daily Wellness</Heading>
    <Spacing size="lg" />
    <Grid columns={2} spacing="md">
      <WellnessCard title="Mood" />
      <WellnessCard title="Sleep" />
      <WellnessCard title="Exercise" />
      <WellnessCard title="Meditation" />
    </Grid>
  </Stack>
</Container>
```

### Tab Component

```jsx
// Tab components available through navigation system

const tabs = [
  { key: 'mood', label: 'Mood', icon: <MoodIcon /> },
  { key: 'journal', label: 'Journal', icon: <JournalIcon /> },
  { key: 'insights', label: 'Insights', icon: <InsightsIcon /> },
];

<TabComponent
  tabs={tabs}
  activeTabIndex={activeTab}
  onTabChange={setActiveTab}
  variant="pills"
  therapeuticTheme="calming"
  withHaptics={true}
/>
```

## 🎨 Theming

### Predefined Themes

```javascript
import { PredefinedThemes } from './DesignTokens';

// Available themes
- default: 'Solace Blue' - Calming blues and greens
- warmth: 'Warm Embrace' - Warm oranges and soft pinks  
- forest: 'Forest Therapy' - Deep greens and earth tones
- minimal: 'Minimal Zen' - Clean grays and subtle accents
- sunset: 'Sunset Calm' - Warm sunset colors
- ocean: 'Ocean Depths' - Deep blues and teals
- lavender: 'Lavender Fields' - Soft purples and mauves
```

### Custom Theme Creation

```javascript
import { DesignSystemManager } from './DesignTokens';

// Create custom theme
const customTheme = {
  colors: {
    primary: {
      500: '#6366F1', // Custom primary color
      // ... other shades
    },
    therapeutic: {
      calming: {
        500: '#0EA5E9',
        // ... other shades
      }
    }
  }
};

// Save custom theme
await DesignSystemManager.saveCustomTokens(customTheme);
```

### Runtime Theme Switching

```javascript
// Apply predefined theme
const newTokens = DesignSystemManager.applyPredefinedTheme(
  BaseDesignTokens,
  'forest'
);

// Reset to default
await DesignSystemManager.resetToDefault();
```

## 🔄 Component Customization

All components support extensive customization through props:

### Common Props
- `therapeuticTheme`: Apply therapeutic color schemes
- `variant`: Different visual styles
- `size`: Consistent sizing (xs, sm, md, lg, xl)
- `disabled`: Disabled state with appropriate styling
- `withAnimation`: Enable/disable animations
- `style`: Custom styling override
- `testID`: Testing identifiers
- `accessibilityLabel`: Screen reader labels

### Therapeutic Themes
- `calming`: Soft blues for anxiety reduction
- `nurturing`: Gentle greens for growth
- `peaceful`: Muted tones for serenity
- `grounding`: Earth tones for stability
- `energizing`: Warm colors for motivation
- `focus`: Clear blues for concentration
- `mindful`: Fresh greens for awareness
- `balance`: Warm yellows for equilibrium

## ♿ Accessibility Features

### Built-in Accessibility
- Minimum touch target sizes (44x44px)
- High contrast color options
- Screen reader compatibility
- Keyboard navigation support
- Reduced motion preferences
- Semantic HTML roles
- Focus indicators
- Color contrast compliance (WCAG 2.1 AA)

### Accessibility Props
```jsx
<EnhancedButton
  accessibilityLabel="Start meditation session"
  accessibilityHint="Double tap to begin a 10-minute guided meditation"
  accessibilityRole="button"
  testID="start-meditation-button"
/>
```

## 📱 Platform Optimization

### iOS Specific
- Haptic feedback integration
- Native navigation patterns
- iOS-specific touch targets
- Platform-appropriate shadows

### Android Specific  
- Material Design influences
- Android haptic patterns
- Platform-specific animations
- Android accessibility features

### Cross-Platform
- Consistent visual language
- Universal design tokens
- Platform-aware components
- Responsive breakpoints

## 🔧 Development Guidelines

### Using the Design System

1. **Import Components**
```javascript
import Button from '../components/common/Button';
import Card from '../components/common/Card';
import { BaseDesignTokens } from '../design-system/DesignTokens';
```

2. **Follow Naming Conventions**
- Use descriptive, semantic names
- Include therapeutic theme when relevant
- Maintain consistent prop naming

3. **Maintain Accessibility**
- Always include accessibility labels
- Test with screen readers
- Ensure proper color contrast
- Maintain touch target sizes

4. **Performance Considerations**
- Use native driver for animations
- Optimize image loading
- Implement proper memoization
- Test on various devices

### Creating New Components

When creating new components:

1. Follow the established patterns
2. Include therapeutic theme support
3. Implement accessibility features
4. Add comprehensive PropTypes
5. Include usage examples
6. Test across platforms

### Testing Components

```javascript
// Example test structure
describe('EnhancedButton', () => {
  it('renders with therapeutic theme', () => {
    render(
      <EnhancedButton
        title="Test"
        therapeuticTheme="calming"
        testID="test-button"
      />
    );
    // Test implementation
  });
});
```

## 🚀 Future Roadmap

### Planned Enhancements
- Advanced animation library
- Additional therapeutic themes
- Voice interaction support
- AI-powered component suggestions
- Advanced accessibility features
- Performance optimizations
- Component playground/storybook
- Advanced customization tools

### Contributing
To contribute to the design system:

1. Follow the established patterns
2. Include comprehensive tests
3. Update documentation
4. Consider accessibility impact
5. Test across platforms
6. Include therapeutic considerations

## 📚 Resources

### Design References
- [Mental Health App Design Guidelines](https://example.com)
- [Therapeutic Color Psychology](https://example.com)
- [Accessibility Best Practices](https://example.com)
- [React Native Performance](https://example.com)

### Tools and Libraries
- React Native
- Expo
- React Native SVG
- Expo Haptics
- Expo Linear Gradient
- React Native Safe Area Context

---

Built with 💙 for mental health and wellness applications.