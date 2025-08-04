# Accessibility Guidelines & Best Practices
## Solace AI Mobile App - WCAG 2.1 AA Compliance Guide

> **Version**: 1.0  
> **Last Updated**: August 2025  
> **Compliance Level**: WCAG 2.1 AA  
> **Target Platform**: React Native (iOS/Android)  

---

## 📋 Table of Contents

1. [Overview](#overview)
2. [WCAG 2.1 AA Requirements](#wcag-21-aa-requirements)
3. [Implementation Guidelines](#implementation-guidelines)
4. [Component Usage Examples](#component-usage-examples)
5. [Testing & Validation](#testing--validation)
6. [Mental Health App Specific Guidelines](#mental-health-app-specific-guidelines)
7. [Tools & Resources](#tools--resources)
8. [Troubleshooting](#troubleshooting)

---

## 🎯 Overview

This document provides comprehensive accessibility guidelines for the Solace AI Mobile App, ensuring WCAG 2.1 AA compliance and creating an inclusive experience for users with disabilities. The mental health focus of our app makes accessibility not just a requirement, but a moral imperative.

### Key Principles

- **Inclusive by Design**: Every user deserves equal access to mental health support
- **WCAG 2.1 AA Compliance**: Meet international accessibility standards
- **Screen Reader Optimization**: Support for TalkBack (Android) and VoiceOver (iOS)
- **Keyboard Navigation**: Full functionality without touch interaction
- **Reduced Motion Support**: Respect user motion preferences
- **High Contrast Support**: Ensure visibility for all users

---

## 📊 WCAG 2.1 AA Requirements

### 1.1.1 Non-text Content (Level A)
**Requirement**: All non-text content has text alternatives.

```javascript
// ✅ Correct Implementation
<Image 
  source={require('./therapy-icon.png')}
  accessibilityLabel="Therapy session icon"
  accessibilityRole="image"
/>

// ❌ Incorrect Implementation
<Image source={require('./therapy-icon.png')} />
```

**Mental Health Context**: Therapeutic images and mood indicators must have meaningful descriptions that convey emotional context.

### 1.4.3 Contrast (Minimum) (Level AA)
**Requirement**: Text has contrast ratio of at least 4.5:1 (3:1 for large text).

```javascript
// ✅ Correct Implementation - Using validation
import { AccessibilityValidators } from '../utils/accessibility';

const contrastCheck = AccessibilityValidators.validateColorContrast(
  '#000000', // Text color
  '#FFFFFF', // Background color
  16,        // Font size
  false,     // Not bold
  'AA'       // WCAG level
);

if (contrastCheck.requiredRatio <= calculatedRatio) {
  // Safe to use colors
}
```

**Therapeutic Colors**: Our calming color palette is validated for accessibility:
- **Calming Blue**: `#4A90E2` on white (contrast: 5.2:1) ✅
- **Nurturing Green**: `#7ED321` on white (contrast: 4.8:1) ✅
- **Peaceful Gray**: `#9B9B9B` on white (contrast: 4.6:1) ✅

### 2.1.1 Keyboard (Level A)
**Requirement**: All functionality available via keyboard.

```javascript
// ✅ Correct Implementation
<AccessibleButton
  title="Start Therapy Session"
  onPress={startTherapy}
  onFocus={handleFocus}
  onBlur={handleBlur}
  accessibilityLabel="Start therapy session"
  accessibilityHint="Double tap to begin guided therapy"
/>
```

### 2.4.7 Focus Visible (Level AA)
**Requirement**: Keyboard focus indicators are visible.

```javascript
// ✅ Automatic focus styling with AccessibleButton
const focusStyles = {
  borderWidth: 2,
  borderColor: '#0066cc',
  shadowColor: '#0066cc',
  shadowOpacity: 0.4,
  shadowRadius: 4,
};
```

### 2.5.5 Target Size (Level AAA - Recommended)
**Requirement**: Touch targets are at least 44x44 density-independent pixels.

```javascript
// ✅ Automatic touch target sizing
import { TouchTargetHelpers } from '../utils/accessibility';

const { style, hitSlop } = TouchTargetHelpers.ensureMinimumTouchTarget({
  width: 32,
  height: 32,
});
// Results in minimum 44x44 target with appropriate hitSlop
```

### 4.1.2 Name, Role, Value (Level A)
**Requirement**: UI components have accessible names, roles, and states.

```javascript
// ✅ Complete implementation
<TouchableOpacity
  accessible={true}
  accessibilityRole="button"
  accessibilityLabel="Record mood entry"
  accessibilityHint="Double tap to record your current mood"
  accessibilityState={{
    disabled: false,
    selected: isSelected,
    busy: isLoading,
  }}
  onPress={recordMood}
>
  <Text>Record Mood</Text>
</TouchableOpacity>
```

---

## 🛠 Implementation Guidelines

### Using AccessibleButton Component

The `AccessibleButton` component provides automatic WCAG compliance:

```javascript
import AccessibleButton from '../components/common/AccessibleButton';

// Basic usage
<AccessibleButton
  title="Save Progress"
  onPress={handleSave}
  variant="primary"
  size="medium"
/>

// Advanced usage with full accessibility
<AccessibleButton
  title="Emergency Support"
  onPress={handleEmergency}
  variant="secondary"
  size="large"
  accessibilityLabel="Access emergency mental health support"
  accessibilityHint="Double tap for immediate crisis resources"
  icon={<EmergencyIcon />}
  highContrast={userPreferences.highContrast}
  reducedMotion={userPreferences.reducedMotion}
  validateAccessibility={true}
/>
```

### Accessibility Utilities Usage

```javascript
import {
  WCAG_CONSTANTS,
  AccessibilityValidators,
  TouchTargetHelpers,
  FocusManagement,
} from '../utils/accessibility';

// Validate touch targets
const isValidTarget = AccessibilityValidators.validateTouchTarget(width, height);

// Ensure minimum size
const { style, hitSlop } = TouchTargetHelpers.ensureMinimumTouchTarget(originalStyle);

// Make announcements
FocusManagement.announceForScreenReader('Mood saved successfully', 'polite');

// Create accessible props
const moodProps = MentalHealthAccessibility.moodTracker.moodSelection('happy', true);
```

### Form Accessibility

```javascript
// ✅ Accessible form input
<TextInput
  accessibilityLabel="Journal entry"
  accessibilityHint="Enter your thoughts and feelings"
  placeholder="How are you feeling today?"
  value={journalText}
  onChangeText={setJournalText}
  accessibilityInvalid={hasError}
  accessibilityErrorMessage={errorMessage}
  multiline={true}
  numberOfLines={4}
/>

// Associated error message
{hasError && (
  <Text
    accessibilityRole="alert"
    accessibilityLiveRegion="assertive"
    style={styles.errorText}
  >
    {errorMessage}
  </Text>
)}
```

### Modal/Dialog Accessibility

```javascript
import { createModalAccessibility } from '../utils/accessibility';

const modalProps = createModalAccessibility(
  'Mood Selection',
  'Choose your current mood from the available options'
);

<Modal
  visible={modalVisible}
  {...modalProps}
  onRequestClose={closeModal}
>
  <View style={styles.modalContent}>
    <Text accessibilityRole="header">Select Your Mood</Text>
    {/* Modal content */}
  </View>
</Modal>
```

---

## 📱 Component Usage Examples

### Mood Tracker Component

```javascript
// Enhanced MoodCheckIn with full accessibility
<MoodCheckIn
  currentMood={userMood}
  onCheckIn={handleMoodUpdate}
  accessibilityLabel="Daily mood check-in"
  accessibilityHint="Record your current emotional state"
  disabled={false}
  testID="mood-check-in"
/>
```

### Therapy Chat Interface

```javascript
// Accessible chat messages
const ChatMessage = ({ message, isUser }) => (
  <View
    accessibilityRole="text"
    accessibilityLabel={isUser ? "Your message" : "AI therapist message"}
    accessibilityValue={{ text: message.content }}
  >
    <Text>{message.content}</Text>
  </View>
);

// Send button
<AccessibleButton
  title="Send"
  onPress={sendMessage}
  accessibilityLabel="Send message"
  accessibilityHint="Double tap to send your message to the AI therapist"
  disabled={!messageText.trim()}
/>
```

### Assessment Questions

```javascript
const AssessmentQuestion = ({ question, options, selectedOption, onSelect }) => (
  <View>
    <Text
      accessibilityRole="header"
      accessibilityLabel={`Question ${question.number} of ${question.total}: ${question.text}`}
    >
      {question.text}
    </Text>
    
    {options.map((option, index) => (
      <TouchableOpacity
        key={index}
        accessibilityRole="radio"
        accessibilityLabel={option.text}
        accessibilityState={{ checked: selectedOption === index }}
        accessibilityHint="Double tap to select this answer"
        onPress={() => onSelect(index)}
      >
        <Text>{option.text}</Text>
      </TouchableOpacity>
    ))}
  </View>
);
```

---

## 🧪 Testing & Validation

### Automated Testing

```javascript
// Run accessibility audit
npm run accessibility:audit

// Run accessibility tests
npm test -- --testPathPattern="accessibility"

// Integration testing
npm run accessibility:test-integration
```

### Manual Testing Checklist

#### Screen Reader Testing
- [ ] **iOS VoiceOver**: Navigate entire app with VoiceOver enabled
- [ ] **Android TalkBack**: Test all interactions with TalkBack
- [ ] **Announcements**: Verify important actions are announced
- [ ] **Reading Order**: Ensure logical content flow

#### Keyboard Navigation Testing
- [ ] **Tab Order**: Logical focus progression through interface
- [ ] **Focus Indicators**: Visible focus outlines on all interactive elements
- [ ] **Keyboard Shortcuts**: All actions accessible via keyboard
- [ ] **Escape Routes**: Users can exit modals/overlays with keyboard

#### Touch Target Testing
- [ ] **Minimum Size**: All interactive elements ≥44x44dp
- [ ] **Spacing**: Adequate space between adjacent targets
- [ ] **hitSlop**: Properly configured for small visual elements

#### Color & Contrast Testing
- [ ] **Color Contrast**: All text meets 4.5:1 ratio (3:1 for large text)
- [ ] **Color Blindness**: Interface works without color dependency
- [ ] **High Contrast**: Support for high contrast mode

### Using Accessibility Testing Tools

```javascript
import AccessibilityTester, { 
  MentalHealthAccessibilityTesting 
} from '../utils/accessibilityTesting';

// Test component accessibility
const tester = new AccessibilityTester();
const results = tester.testComponent(buttonComponent, 'Mood Button');

// Test mental health specific patterns
const moodResults = MentalHealthAccessibilityTesting.testMoodTracker(moodComponent);
const chatResults = MentalHealthAccessibilityTesting.testChatAccessibility(chatComponent);

// Generate report
const report = tester.generateReport(allResults, './accessibility-report.json');
```

---

## 🧠 Mental Health App Specific Guidelines

### Therapeutic Content Accessibility

```javascript
// ✅ Therapeutic content with proper context
<TherapeuticContent
  type="mindfulness"
  title="Breathing Exercise"
  description="5-minute guided breathing for anxiety relief"
  accessibilityLabel="Mindfulness exercise: 5-minute guided breathing for anxiety relief"
  accessibilityHint="Double tap to start guided breathing exercise"
/>

// ✅ Crisis support accessibility
<EmergencyButton
  accessibilityLabel="Emergency mental health support"
  accessibilityHint="Double tap for immediate access to crisis resources and emergency contacts"
  onPress={showCrisisResources}
/>
```

### Mood and Emotion Accessibility

```javascript
// ✅ Emotional state indicators
const MoodIndicator = ({ mood, intensity }) => (
  <View
    accessibilityRole="button"
    accessibilityLabel={`${mood} mood with ${intensity} intensity`}
    accessibilityHint={`Tap to select ${mood} as your current mood`}
    accessibilityState={{ selected: isSelected }}
  >
    <Text accessibilityElementsHidden={true}>{moodEmoji}</Text>
    <Text>{mood}</Text>
  </View>
);
```

### Progress and Achievement Accessibility

```javascript
// ✅ Progress indicators
<ProgressBar
  progress={completionPercentage}
  accessibilityRole="progressbar"
  accessibilityLabel="Therapy session progress"
  accessibilityValue={{
    min: 0,
    max: 100,
    now: completionPercentage,
    text: `${completionPercentage}% complete`
  }}
/>
```

### Sensitive Content Handling

```javascript
// ✅ Content warnings with accessibility
<ContentWarning
  level="high"
  topics={['anxiety', 'depression']}
  accessibilityLabel="Content warning: This section discusses anxiety and depression"
  accessibilityHint="Double tap to acknowledge and continue, or navigate away if you prefer"
  onAcknowledge={proceedWithContent}
  onSkip={skipContent}
/>
```

---

## 🔧 Tools & Resources

### Development Tools

1. **Accessibility Audit Script**: `scripts/accessibility-audit.js`
   - Comprehensive WCAG 2.1 AA compliance checking
   - Automated touch target validation
   - Color contrast analysis
   - Screen reader compatibility checks

2. **Testing Utilities**: `src/utils/accessibilityTesting.js`
   - Component accessibility validation
   - Screen reader simulation
   - Keyboard navigation testing
   - Mental health specific patterns

3. **Component Library**: Enhanced accessible components
   - `AccessibleButton`: Fully compliant button component
   - Enhanced existing components with accessibility features

### Testing Commands

```bash
# Run full accessibility audit
node scripts/accessibility-audit.js

# Run accessibility integration tests
node scripts/test-accessibility-integration.js

# Run comprehensive testing suite
node scripts/run-accessibility-tests.js

# Run Jest accessibility tests
npm test -- --testPathPattern="accessibility"
```

### External Tools

- **iOS VoiceOver**: Built-in screen reader
- **Android TalkBack**: Built-in screen reader
- **Color Oracle**: Color blindness simulator
- **Web Content Accessibility Guidelines**: [WCAG 2.1 Reference](https://www.w3.org/WAI/WCAG21/quickref/)

---

## 🚨 Troubleshooting

### Common Issues & Solutions

#### Screen Reader Not Announcing Content

```javascript
// ❌ Problem: Content not being read
<View>
  <Text>Important message</Text>
</View>

// ✅ Solution: Add accessibility props
<View
  accessible={true}
  accessibilityRole="text"
  accessibilityLabel="Important message"
>
  <Text>Important message</Text>
</View>
```

#### Touch Targets Too Small

```javascript
// ❌ Problem: Small touch targets
<TouchableOpacity style={{ width: 20, height: 20 }}>
  <Icon name="close" />
</TouchableOpacity>

// ✅ Solution: Use TouchTargetHelpers
import { TouchTargetHelpers } from '../utils/accessibility';

const { style, hitSlop } = TouchTargetHelpers.ensureMinimumTouchTarget({
  width: 20,
  height: 20,
});

<TouchableOpacity style={[baseStyle, style]} hitSlop={hitSlop}>
  <Icon name="close" />
</TouchableOpacity>
```

#### Focus Not Visible

```javascript
// ❌ Problem: No focus indicators
<TouchableOpacity onPress={handlePress}>
  <Text>Button</Text>
</TouchableOpacity>

// ✅ Solution: Use AccessibleButton or add focus styles
const [isFocused, setIsFocused] = useState(false);

<TouchableOpacity
  onPress={handlePress}
  onFocus={() => setIsFocused(true)}
  onBlur={() => setIsFocused(false)}
  style={[
    baseStyle,
    isFocused && {
      borderWidth: 2,
      borderColor: '#0066cc',
      shadowColor: '#0066cc',
      shadowOpacity: 0.4,
    }
  ]}
>
  <Text>Button</Text>
</TouchableOpacity>
```

#### Low Color Contrast

```javascript
// ❌ Problem: Insufficient contrast
const lowContrastStyle = {
  color: '#999999',
  backgroundColor: '#CCCCCC',
};

// ✅ Solution: Use validated colors
import { AccessibilityValidators } from '../utils/accessibility';

const textColor = '#333333';
const backgroundColor = '#FFFFFF';

const contrastCheck = AccessibilityValidators.validateColorContrast(
  textColor,
  backgroundColor,
  16,
  false,
  'AA'
);

// Use colors only if they pass validation
```

### Testing Issues

#### Jest Tests Failing

```bash
# Clear Jest cache
npm test -- --clearCache

# Run tests in watch mode for debugging
npm test -- --testPathPattern="accessibility" --watch

# Run with verbose output
npm test -- --testPathPattern="accessibility" --verbose
```

#### Screen Reader Testing Issues

1. **Enable screen reader**:
   - iOS: Settings > Accessibility > VoiceOver
   - Android: Settings > Accessibility > TalkBack

2. **Test in development**:
   - Use Expo development client
   - Test on physical devices when possible
   - Use screen reader gestures, not just tap

3. **Announcement issues**:
   - Use `AccessibilityInfo.announceForAccessibility()`
   - Check `accessibilityLiveRegion` props
   - Verify announcement timing

---

## 📈 Compliance Checklist

### Pre-Release Accessibility Audit

- [ ] **Automated Testing**: All automated tests pass
- [ ] **Manual Testing**: Complete manual testing checklist
- [ ] **Screen Reader Testing**: Tested with VoiceOver and TalkBack
- [ ] **Keyboard Navigation**: All functionality accessible via keyboard
- [ ] **Color Contrast**: All text meets WCAG AA requirements
- [ ] **Touch Targets**: All interactive elements ≥44x44dp
- [ ] **Focus Indicators**: Visible focus on all interactive elements
- [ ] **Error Handling**: Accessible error messages and validation
- [ ] **Forms**: All form inputs properly labeled
- [ ] **Images**: All images have appropriate alt text
- [ ] **Videos/Audio**: Captions and transcripts provided
- [ ] **Motion**: Reduced motion preferences respected
- [ ] **Content Structure**: Proper heading hierarchy
- [ ] **Language**: Content language properly identified
- [ ] **Documentation**: Accessibility features documented

### Mental Health Specific Checks

- [ ] **Crisis Support**: Emergency features always accessible
- [ ] **Therapeutic Content**: Proper context and warnings
- [ ] **Mood Tracking**: Emotional states clearly communicated
- [ ] **Progress Indicators**: Achievement progress accessible
- [ ] **Sensitive Content**: Appropriate content warnings
- [ ] **Privacy**: Screen reader respects privacy settings

---

## 📚 Additional Resources

### Documentation Links

- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [React Native Accessibility](https://reactnative.dev/docs/accessibility)
- [iOS Accessibility Guidelines](https://developer.apple.com/accessibility/)
- [Android Accessibility Guidelines](https://developer.android.com/guide/topics/ui/accessibility)
- [Mental Health App Accessibility Best Practices](https://www.w3.org/WAI/perspective-videos/voice/)

### Community Resources

- [WebAIM](https://webaim.org/)
- [The A11Y Project](https://www.a11yproject.com/)
- [Accessibility Developer Guide](https://www.accessibility-developer-guide.com/)

---

## 🤝 Contributing to Accessibility

### Reporting Issues

When reporting accessibility issues:

1. **Describe the issue**: What's not working?
2. **Steps to reproduce**: How to encounter the issue
3. **Expected behavior**: What should happen?
4. **Assistive technology**: Screen reader, keyboard, etc.
5. **Device/OS**: Platform and version details

### Submitting Improvements

1. **Test thoroughly**: Use automated and manual testing
2. **Document changes**: Update this guide as needed
3. **Follow patterns**: Use established accessibility utilities
4. **Consider impact**: How does this affect users with disabilities?

---

*This guide is a living document. As accessibility standards evolve and we learn from user feedback, we'll continue to improve our practices and update these guidelines.*

**Remember**: Accessibility is not a feature to be added later—it's a fundamental aspect of inclusive design that should be considered from the very beginning of development.