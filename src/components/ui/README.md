# Freud Design System UI Components

A comprehensive, therapeutic-focused UI component library for mental health applications, built with React Native and based on color psychology principles.

## 🎨 Design Philosophy

This component library is built around **therapeutic color psychology** and **mental health UX patterns**, featuring:

- **Calming Blues** - For anxiety relief and peace
- **Nurturing Browns** - For support and comfort  
- **Peaceful Grays** - For meditation and tranquility
- **Grounding Purples** - For stability and focus
- **Energizing Oranges** - For motivation and action
- **Optimistic Yellows** - For hope and positivity

## 🚀 Quick Start

```javascript
import { 
  Button, 
  Input, 
  Card, 
  CalmingButton, 
  TherapeuticInput,
  FreudColorPalette 
} from '../components/ui';

// Basic usage
<Button title="Get Started" therapeuticColor="calming" />

// Therapeutic variants
<CalmingButton title="Relax" />
<NurturingInput placeholder="Share your thoughts..." />

// Custom theming
<Card therapeuticColor="grounding" variant="therapeutic">
  <Text>Your content here</Text>
</Card>
```

## 📦 Component Categories

### Form Components

#### Button
Versatile button component with therapeutic color support.

```javascript
// Basic button
<Button title="Click Me" />

// Therapeutic variants
<Button title="Calm Mind" therapeuticColor="calming" />
<CalmingButton title="Meditation" />
<NurturingButton title="Journal Entry" />
<GroundingButton title="Focus Exercise" />

// Different sizes and variants
<Button title="Small" size="small" variant="outline" />
<Button title="Large" size="large" variant="filled" />
<Button title="Loading" loading={true} />
<Button title="With Icon" icon="Heart" />
```

**Props:**
- `therapeuticColor`: 'calming' | 'nurturing' | 'peaceful' | 'grounding' | 'energizing' | 'optimistic'
- `variant`: 'primary' | 'secondary' | 'outline' | 'ghost' | 'link' | 'destructive'
- `size`: 'small' | 'medium' | 'large' | 'xl'
- `loading`: boolean
- `disabled`: boolean
- `icon`: string | ReactElement
- `fullWidth`: boolean

#### Input
Advanced input component with floating labels and therapeutic theming.

```javascript
// Basic inputs
<Input placeholder="Enter text..." />
<Input label="Full Name" required />

// Therapeutic variants
<CalmingInput label="How are you feeling?" />
<NurturingInput label="Share your thoughts" multiline />

// Specialized inputs
<PasswordInput label="Password" />
<EmailInput label="Email Address" />
<SearchInput placeholder="Search resources..." />

// Different variants
<FloatingLabelInput label="Floating Label" />
<FilledInput label="Filled Style" variant="filled" />
<OutlineInput label="Outlined" variant="outline" />
```

**Props:**
- `therapeuticColor`: string
- `variant`: 'default' | 'filled' | 'outline' | 'underline' | 'floating' | 'none'
- `size`: 'small' | 'medium' | 'large'
- `leftIcon`: string | ReactElement
- `rightIcon`: string | ReactElement
- `error`: boolean
- `errorMessage`: string
- `helperText`: string

#### Slider
Smooth slider component for ratings and range selections.

```javascript
// Basic slider
<Slider 
  value={mood} 
  minimumValue={1} 
  maximumValue={10}
  onValueChange={setMood}
/>

// Therapeutic variants
<CalmingSlider 
  value={anxiety} 
  minimumLabel="Calm" 
  maximumLabel="Anxious"
/>

// Range slider
<RangeSlider 
  lowValue={startTime} 
  highValue={endTime}
  therapeuticColor="grounding"
/>
```

### Display Components

#### Card
Flexible card component for organizing content.

```javascript
// Basic card
<Card title="Daily Insight" description="Your progress today">
  <Text>Content goes here</Text>
</Card>

// Therapeutic card
<Card 
  therapeuticColor="nurturing" 
  variant="therapeutic"
  icon="Heart"
>
  <Text>Therapeutic content</Text>
</Card>

// Specialized cards
<JournalCard 
  entry="Today was challenging but I managed..."
  mood="Reflective"
  date="Dec 15, 2023"
  tags={['growth', 'mindfulness']}
/>

<ProgressCard 
  title="Weekly Mood"
  value={75}
  maxValue={100}
  change={+5}
  period="this week"
/>
```

#### Tag
Flexible tagging system with therapeutic colors.

```javascript
// Basic tags
<Tag label="Mindfulness" />
<Tag label="Anxiety" therapeuticColor="calming" />

// Interactive tags
<Tag 
  label="Selected" 
  selected 
  onPress={() => handleTagPress()} 
/>

// Tag groups
<TagGroup 
  tags={moodTags}
  multiSelect
  selectedTags={selectedMoods}
  onSelectionChange={setSelectedMoods}
  therapeuticColor="peaceful"
/>

// Therapeutic variants
<CalmingTag label="Relaxation" />
<NurturingTag label="Self-Care" />
<GroundingTag label="Meditation" />
```

### Overlay Components

#### Modal
Accessible modal with therapeutic theming.

```javascript
// Basic modal
<Modal 
  visible={showModal}
  onClose={closeModal}
  title="Meditation Session"
  therapeuticColor="calming"
>
  <Text>Modal content</Text>
</Modal>

// Confirmation modal
<ConfirmModal 
  visible={showConfirm}
  title="Delete Journal Entry"
  message="This action cannot be undone."
  onConfirm={handleDelete}
  onCancel={closeConfirm}
  therapeuticColor="energizing"
/>

// Info modal
<InfoModal 
  visible={showInfo}
  title="Daily Tip"
  message="Take 5 deep breaths to center yourself."
  onClose={closeInfo}
/>
```

## 🎨 Customization Guide

### Color Palette Customization

The color palette can be easily customized by modifying the `ColorPalette.js` file:

```javascript
import { FreudColorPalette, getTherapeuticColor } from '../ui';

// Access colors directly
const calmingBlue = FreudColorPalette.therapeutic.calming[500];
const nurturingBrown = FreudColorPalette.therapeutic.nurturing[400];

// Use helper functions
const dynamicColor = getTherapeuticColor('peaceful', 600, isDarkMode);
```

### Creating Custom Therapeutic Colors

```javascript
// Add to ColorPalette.js
const CustomColorPalette = {
  ...FreudColorPalette,
  therapeutic: {
    ...FreudColorPalette.therapeutic,
    custom: {
      50: '#F0F9FF',
      100: '#E0F2FE',
      // ... add full color scale
      900: '#0C4A6E'
    }
  }
};
```

### Component Theming

All components accept a `therapeuticColor` prop for easy theming:

```javascript
// Global theme application
const MyButton = (props) => (
  <Button 
    therapeuticColor="calming" 
    {...props} 
  />
);

// Conditional theming based on context
<Button 
  therapeuticColor={isEmergency ? 'energizing' : 'calming'}
  title={isEmergency ? 'Get Help Now' : 'Continue'}
/>
```

### Dark Mode Support

All components automatically adapt to dark mode:

```javascript
import { useTheme } from '../shared/theme/ThemeContext';

const MyComponent = () => {
  const { isDarkMode, theme } = useTheme();
  
  return (
    <Button 
      therapeuticColor="calming"
      // Colors automatically adjust for dark mode
    />
  );
};
```

### Size Variants

Components support consistent size variants:

```javascript
// Small components for compact layouts
<Button size="small" title="Compact" />
<Input size="small" placeholder="Small input" />
<Card size="small">Compact card</Card>

// Large components for emphasis
<Button size="large" title="Primary Action" />
<Modal size="large" title="Important Dialog" />
```

## 🔧 Advanced Customization

### Custom Variants

Add custom variants to existing components:

```javascript
// In your component
const CustomButton = ({ variant = 'custom', ...props }) => {
  const customStyles = variant === 'custom' ? {
    backgroundColor: '#FF6B9D',
    borderRadius: 25,
  } : {};
  
  return <Button style={customStyles} {...props} />;
};
```

### Extending Color Palette

```javascript
// Create theme extensions
const extendedTheme = {
  ...FreudColorPalette,
  brand: {
    primary: '#4F46E5',
    secondary: '#06B6D4',
    accent: '#F59E0B',
  },
  custom: {
    success: '#10B981',
    warning: '#F59E0B', 
    error: '#EF4444',
  }
};
```

### Animation Customization

Modify animation timings and effects:

```javascript
// Custom animation values
<Button 
  style={{
    // Override default animations
    shadowOpacity: 0.3,
    // Add custom transforms
  }}
/>
```

## 📱 Accessibility Features

All components include comprehensive accessibility support:

- **Screen Reader Support**: Proper `accessibilityLabel` and `accessibilityHint`
- **Touch Targets**: Minimum 44px touch targets (WCAG 2.1)
- **Keyboard Navigation**: Full keyboard accessibility
- **High Contrast**: Color combinations meet WCAG AA standards
- **Focus Management**: Proper focus indicators and management

### Accessibility Props

```javascript
<Button 
  accessibilityLabel="Start meditation session"
  accessibilityHint="Opens guided meditation with calming sounds"
  accessibilityState={{ disabled: false }}
/>

<Input 
  accessibilityLabel="Journal entry"
  accessibilityHint="Write about your day and feelings"
/>
```

## 🎯 Mental Health UX Patterns

### Therapeutic Interactions

- **Gentle Animations**: Smooth, non-jarring transitions
- **Calming Colors**: Stress-reducing color combinations  
- **Clear Hierarchy**: Important actions are visually prominent
- **Safety First**: Emergency actions use energizing colors
- **Progressive Disclosure**: Complex forms broken into steps

### Example Mental Health Patterns

```javascript
// Mood tracking interface
<Card therapeuticColor="peaceful" variant="therapeutic">
  <Text>How are you feeling today?</Text>
  <TagGroup 
    tags={moodOptions}
    therapeuticColor="calming"
    multiSelect
  />
  <CalmingSlider 
    minimumLabel="Low" 
    maximumLabel="High"
    therapeuticColor="peaceful"
  />
</Card>

// Crisis intervention button
<EnergizingButton 
  title="Get Help Now" 
  size="large" 
  icon="Heart"
  onPress={handleCrisisHelp}
/>

// Daily wellness check
<NurturingCard 
  title="Daily Wellness"
  icon="Heart"
>
  <ProgressCard 
    title="Today's Mood"
    value={currentMood}
    therapeuticColor="nurturing"
  />
</NurturingCard>
```

## 🛠️ Development Guidelines

### Component Creation

When creating new components:

1. **Extend existing patterns**: Use therapeutic colors and size variants
2. **Include accessibility**: Add proper ARIA labels and keyboard support  
3. **Support theming**: Accept `therapeuticColor` prop
4. **Follow naming**: Use semantic, therapy-focused naming
5. **Add documentation**: Include usage examples and props

### Testing Components

```javascript
// Example test structure
describe('CalmingButton', () => {
  it('applies calming therapeutic colors', () => {
    const { getByRole } = render(
      <CalmingButton title="Test" />
    );
    
    const button = getByRole('button');
    expect(button).toHaveStyle({
      backgroundColor: FreudColorPalette.therapeutic.calming[500]
    });
  });
});
```

## 📊 Component Status

| Component | Status | Therapeutic Colors | Dark Mode | Accessibility |
|-----------|--------|-------------------|-----------|---------------|
| Button | ✅ Complete | ✅ Yes | ✅ Yes | ✅ WCAG 2.1 |
| Input | ✅ Complete | ✅ Yes | ✅ Yes | ✅ WCAG 2.1 |
| Card | ✅ Complete | ✅ Yes | ✅ Yes | ✅ WCAG 2.1 |
| Tag | ✅ Complete | ✅ Yes | ✅ Yes | ✅ WCAG 2.1 |
| Slider | ✅ Complete | ✅ Yes | ✅ Yes | ✅ WCAG 2.1 |
| Modal | ✅ Complete | ✅ Yes | ✅ Yes | ✅ WCAG 2.1 |
| Checkbox | ✅ Complete | ✅ Yes | ✅ Yes | ✅ WCAG 2.1 |
| Dropdown | 🚧 In Progress | ⏳ Pending | ⏳ Pending | ⏳ Pending |
| Table | 🚧 In Progress | ⏳ Pending | ⏳ Pending | ⏳ Pending |
| Tooltip | 🚧 In Progress | ⏳ Pending | ⏳ Pending | ⏳ Pending |

## 📚 Resources

- [Color Psychology in Mental Health Apps](https://example.com)
- [WCAG 2.1 Accessibility Guidelines](https://www.w3.org/WAI/WCAG21/)
- [React Native Accessibility](https://reactnative.dev/docs/accessibility)
- [Mental Health UX Best Practices](https://example.com)

## 🤝 Contributing

When contributing new components:

1. Follow the therapeutic color system
2. Include comprehensive accessibility features
3. Add proper TypeScript types (if applicable)
4. Include usage examples and documentation
5. Test on both light and dark modes
6. Ensure cross-platform compatibility

---

**Built with ❤️ for mental health and wellbeing**