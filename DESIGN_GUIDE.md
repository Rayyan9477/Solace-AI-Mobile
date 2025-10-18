# 🎨 Design System & UI Guidelines

**Comprehensive design system documentation for Solace AI Mobile**

---

## Table of Contents

1. [Design Philosophy](#design-philosophy)
2. [Color System](#color-system)
3. [Typography](#typography)
4. [Spacing & Layout](#spacing--layout)
5. [Components](#components)
6. [Accessibility](#accessibility)
7. [Theme System](#theme-system)
8. [Design Assets](#design-assets)
9. [Animation Guidelines](#animation-guidelines)

---

## Design Philosophy

### Core Principles

#### 1. **Therapeutic Design**
- Colors chosen for mental wellness
- Calming layouts reduce anxiety
- Clear information hierarchy
- Supportive, non-judgmental interface

#### 2. **Accessibility First**
- Inclusive design for all users
- Screen reader support built-in
- High contrast options available
- Reduced motion support

#### 3. **Consistency**
- Unified component library
- Consistent spacing and sizing
- Predictable interactions
- Clear visual language

#### 4. **Simplicity**
- Minimal cognitive load
- Clear navigation paths
- Focused feature sets
- Distraction-free experience

#### 5. **Empathy**
- Consider user emotional state
- Respectful language and tone
- Crisis-aware design
- Culturally inclusive

---

## Color System

### Light Theme Palette

```
Primary Colors:
  - Blue-400:   #3B82F6  (Primary action, primary text)
  - Green-500:  #10B981  (Success, positive mood)
  - Teal-500:   #14B8A6  (Calm, peaceful)

Mood Colors:
  - Happy:      #F59E0B  (Amber - Warm, energetic)
  - Excited:    #EC4899  (Pink - Vibrant, alive)
  - Calm:       #06B6D4  (Cyan - Peaceful, serene)
  - Sad:        #6366F1  (Indigo - Melancholic)
  - Stressed:   #EF4444  (Red - Alert, tense)

Backgrounds:
  - White:      #FFFFFF (Main background)
  - Gray-50:    #F9FAFB (Secondary background)
  - Gray-100:   #F3F4F6 (Tertiary background)

Text:
  - Gray-900:   #111827 (Primary text)
  - Gray-700:   #374151 (Secondary text)
  - Gray-500:   #6B7280 (Tertiary text)

Status:
  - Success:    #10B981 (Green - OK, saved)
  - Warning:    #F59E0B (Amber - Caution, warning)
  - Error:      #EF4444 (Red - Error, danger)
  - Info:       #3B82F6 (Blue - Information)

Borders & Dividers:
  - Border:     #E5E7EB (Light border)
```

### Dark Theme Palette (Therapeutic Brown)

```
Primary Colors:
  - Amber-400:  #FBBF24  (Primary action, accent)
  - Green-500:  #10B981  (Success, positive mood)
  - Teal-500:   #14B8A6  (Calm, peaceful)

Mood Colors:
  - Happy:      #FBBF24  (Warm amber - Energetic)
  - Excited:    #EC4899  (Pink - Vibrant)
  - Calm:       #06B6D4  (Cyan - Peaceful)
  - Sad:        #818CF8  (Light indigo - Introspective)
  - Stressed:   #F87171  (Light red - Alert)

Backgrounds:
  - Dark-900:   #0F172A (Main background - Deep blue-black)
  - Brown-800:  #78350F (Primary background - Warm brown)
  - Brown-700:  #92400E (Secondary background)

Text:
  - White:      #FFFFFF (Primary text)
  - Gray-100:   #F3F4F6 (Secondary text)
  - Gray-300:   #D1D5DB (Tertiary text)

Status:
  - Success:    #10B981 (Green - OK, saved)
  - Warning:    #FBBF24 (Amber - Caution)
  - Error:      #F87171 (Light red - Error)
  - Info:       #60A5FA (Light blue - Information)

Borders & Dividers:
  - Border:     #3F3F46 (Dark border)
```

### Color Usage Guidelines

| Use Case | Light Theme | Dark Theme |
|----------|-------------|-----------|
| Primary buttons | Blue-400 | Amber-400 |
| Success states | Green-500 | Green-500 |
| Mood selection | Mood-specific colors | Mood-specific colors |
| Background | White | Brown-800 |
| Text - Primary | Gray-900 | White |
| Text - Secondary | Gray-700 | Gray-100 |
| Borders | Gray-100 | Gray-700 |
| Danger/Crisis | Red-500 | Light Red |

---

## Typography

### Font Stack

```javascript
fontFamily: {
  'sans': ['System', '-apple-system', 'BlinkMacSystemFont', '"Segoe UI"'],
  'mono': ['Courier New', 'monospace'],
  'display': ['"SF Pro Display"', 'system-ui']
}
```

### Type Scale

| Level | Size | Weight | Usage |
|-------|------|--------|-------|
| **Display** | 32px | 700 | Page titles |
| **Heading 1** | 28px | 700 | Section titles |
| **Heading 2** | 24px | 600 | Subsection titles |
| **Heading 3** | 20px | 600 | Card titles |
| **Body Large** | 18px | 400 | Important body text |
| **Body** | 16px | 400 | Standard body text |
| **Body Small** | 14px | 400 | Secondary text |
| **Caption** | 12px | 400 | Helper text, labels |

### Line Height

```javascript
lineHeight: {
  'tight': 1.2,      // Display, headings
  'normal': 1.5,     // Body text
  'relaxed': 1.75,   // Long-form text
  'loose': 2          // Lists, accessibility
}
```

### Font Weights

```javascript
fontWeight: {
  '400': 'normal',    // Regular
  '500': '500',       // Medium
  '600': '600',       // Semibold
  '700': 'bold',      // Bold
}
```

### Typography Example

```javascript
const typography = {
  display: {
    fontSize: 32,
    fontWeight: '700',
    lineHeight: 1.2
  },
  heading1: {
    fontSize: 28,
    fontWeight: '700',
    lineHeight: 1.2
  },
  body: {
    fontSize: 16,
    fontWeight: '400',
    lineHeight: 1.5
  },
  caption: {
    fontSize: 12,
    fontWeight: '400',
    lineHeight: 1.5
  }
};
```

---

## Spacing & Layout

### Spacing Scale

```javascript
spacing: {
  'xs': 4,       // 4px
  'sm': 8,       // 8px
  'md': 12,      // 12px
  'lg': 16,      // 16px
  'xl': 24,      // 24px
  'xxl': 32,     // 32px
  '3xl': 48,     // 48px
  '4xl': 64,     // 64px
}
```

### Safe Area & Padding

```javascript
const layout = {
  screenPadding: 16,           // 16px padding on screen edges
  contentMaxWidth: 600,         // Max width for wide screens
  tabBarHeight: 56,             // Bottom tab bar height
  headerHeight: 56,             // Header height
  modalsMargin: 16              // Margin around modals
};
```

### Layout Patterns

#### Full Screen

```javascript
<SafeAreaView style={{ flex: 1 }}>
  <ScrollView contentContainerStyle={{ paddingHorizontal: 16 }}>
    {/* Content */}
  </ScrollView>
</SafeAreaView>
```

#### Card Grid

```javascript
<FlatList
  data={items}
  numColumns={2}
  columnWrapperStyle={{ gap: 12 }}
  contentContainerStyle={{ padding: 16, gap: 12 }}
  renderItem={({ item }) => <Card item={item} />}
/>
```

#### Modal

```javascript
<Modal transparent>
  <View style={{ flex: 1, justifyContent: 'flex-end' }}>
    <View style={{ paddingBottom: 16, paddingHorizontal: 16 }}>
      {/* Modal content */}
    </View>
  </View>
</Modal>
```

---

## Components

### Component Hierarchy

```
Atoms (Basic)
├── Button
├── Input
├── Icon
├── Badge
├── Chip
└── Text

Molecules (Composed)
├── Card
├── Modal
├── Form
├── ListItem
├── SearchBar
└── Menu

Organisms (Complex)
├── Layout
├── Navigation
├── HeaderBar
├── MoodSelector
└── ChatBubble
```

### Component Specifications

#### Button Component

```javascript
// Variants
const buttonVariants = {
  'primary': {
    backgroundColor: theme.colors.primary,
    color: 'white'
  },
  'secondary': {
    backgroundColor: theme.colors.secondary,
    color: theme.colors.text
  },
  'danger': {
    backgroundColor: theme.colors.error,
    color: 'white'
  }
};

// Sizes
const buttonSizes = {
  'sm': { paddingVertical: 8, paddingHorizontal: 12, fontSize: 14 },
  'md': { paddingVertical: 12, paddingHorizontal: 16, fontSize: 16 },
  'lg': { paddingVertical: 16, paddingHorizontal: 24, fontSize: 18 }
};

// Usage
<Button
  label="Save Mood"
  variant="primary"
  size="md"
  onPress={handleSave}
  disabled={isLoading}
/>
```

#### Card Component

```javascript
// Specifications
const cardStyles = {
  padding: 16,
  borderRadius: 12,
  backgroundColor: theme.colors.surface,
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.1,
  shadowRadius: 4,
  elevation: 3
};

// Usage
<Card>
  <Text style={styles.title}>Mood Summary</Text>
  <Text style={styles.body}>Your average mood this week</Text>
</Card>
```

#### Input Component

```javascript
// Specifications
const inputStyles = {
  paddingVertical: 12,
  paddingHorizontal: 12,
  borderRadius: 8,
  borderWidth: 1,
  borderColor: theme.colors.border,
  fontSize: 16,
  backgroundColor: theme.colors.input
};

// Usage
<Input
  placeholder="How are you feeling?"
  value={mood}
  onChangeText={setMood}
  multiline
  maxLength={500}
/>
```

---

## Accessibility

### WCAG 2.1 Compliance

We target **WCAG 2.1 Level AA** compliance:

- ✅ Sufficient color contrast (4.5:1 for text)
- ✅ Keyboard navigation
- ✅ Screen reader support
- ✅ Focus indicators
- ✅ Reduced motion support

### Implementation Guidelines

#### Color Contrast

```javascript
// ✅ Good contrast
Light text on dark background: #FFFFFF on #0F172A (21:1)
Dark text on light background: #111827 on #FFFFFF (20:1)

// ✅ Minimum acceptable
Dark text on light background: #374151 on #FFFFFF (8.5:1)
Light text on dark background: #D1D5DB on #0F172A (9:1)
```

#### Screen Reader Support

```javascript
// ✅ Good
<TouchableOpacity
  accessible
  accessibilityLabel="Select mood: Happy"
  accessibilityRole="button"
  accessibilityState={{ disabled: false }}
  onPress={handleSelect}
>
  <Text>😊 Happy</Text>
</TouchableOpacity>

// ❌ Bad - Missing accessibility
<TouchableOpacity onPress={handleSelect}>
  <Text>😊 Happy</Text>
</TouchableOpacity>
```

#### Keyboard Navigation

```javascript
// ✅ Good - Tab traversal in logical order
<View accessible={false} collapsable={false}>
  <Button label="Save" onPress={handleSave} />
  <Button label="Cancel" onPress={handleCancel} />
</View>

// Use accessibilityNavigationOptions for custom order
```

#### Focus Management

```javascript
// ✅ Good - Clear focus indicator
const focusedStyle = isFocused ? {
  outlineWidth: 3,
  outlineColor: theme.colors.focus
} : {};

<TouchableOpacity
  style={[styles.button, focusedStyle]}
  onFocus={() => setIsFocused(true)}
  onBlur={() => setIsFocused(false)}
>
  {/* Content */}
</TouchableOpacity>
```

#### Reduced Motion Support

```javascript
// ✅ Good - Respect reduced motion preference
const { reduceMotionEnabled } = useAccessibilityInfo();

<Animated.View
  style={{
    opacity: reduceMotionEnabled ? 1 : animatedOpacity
  }}
>
  {/* Content */}
</Animated.View>
```

---

## Theme System

### Theme Structure

```javascript
const themeConfig = {
  light: {
    mode: 'light',
    colors: {
      primary: '#3B82F6',
      secondary: '#10B981',
      background: '#FFFFFF',
      surface: '#F9FAFB',
      text: '#111827',
      textSecondary: '#6B7280',
      border: '#E5E7EB',
      // ... mood colors, status colors
    },
    typography: {
      display: { fontSize: 32, fontWeight: '700' },
      heading1: { fontSize: 28, fontWeight: '700' },
      // ... other styles
    },
    spacing: {
      xs: 4,
      sm: 8,
      md: 12,
      // ... more sizes
    }
  },
  dark: {
    // Similar structure with dark theme colors
  }
};
```

### Using Theme in Components

```javascript
import { useTheme } from '@theme/ThemeProvider';

export const MoodCard = ({ mood }) => {
  const theme = useTheme();
  
  return (
    <View style={{ backgroundColor: theme.colors.surface }}>
      <Text style={{ color: theme.colors.text }}>
        {mood.name}
      </Text>
    </View>
  );
};
```

### Switching Themes

```javascript
import { useThemeToggle } from '@theme/ThemeProvider';

export const SettingsScreen = () => {
  const { theme, toggleTheme } = useThemeToggle();
  
  return (
    <Switch
      value={theme === 'dark'}
      onValueChange={toggleTheme}
    />
  );
};
```

---

## Design Assets

### UI Design Files

Located in `ui-designs/` folder:

```
ui-designs/
├── Light mode/               # Light theme designs (18 images)
├── Dark-mode/                # Dark theme designs (18 images)
├── Design System and Components/  # Component specifications
├── Dashboard/                # Dashboard layout designs
├── Icon set/                 # Icon collection
└── utils/                    # Design utilities
```

### Design Resources

- **Figma Project**: [Link to design system]
- **Component Showcase**: `npm run theme-preview`
- **Icon Library**: React Native Vector Icons
- **Color Tool**: [Design color palette tool]

---

## Animation Guidelines

### Principles

- ✅ **Purpose**: Animations should serve a purpose
- ✅ **Subtle**: Keep animations smooth and understated
- ✅ **Respectful**: Respect reduced motion preferences
- ✅ **Performance**: Animations shouldn't impact performance
- ✅ **Consistent**: Use consistent animation patterns

### Timing

```javascript
const animations = {
  fast: 200,      // Quick transitions (tooltips, popups)
  normal: 300,    // Standard transitions (button press, state change)
  slow: 500,      // Slow transitions (page transition, emphasis)
  slowest: 800    // Very slow transitions (intro animations)
};
```

### Common Animations

#### Fade In/Out

```javascript
<Animated.View
  style={{
    opacity: fadeAnim,
    animationDuration: 300
  }}
>
  {/* Content */}
</Animated.View>
```

#### Scale

```javascript
<Animated.View
  style={{
    transform: [{ scale: scaleAnim }]
  }}
>
  {/* Content */}
</Animated.View>
```

#### Slide

```javascript
<Animated.View
  style={{
    transform: [{ translateY: slideAnim }]
  }}
>
  {/* Content */}
</Animated.View>
```

### Reduced Motion Support

```javascript
const getAnimationDuration = (reduceMotionEnabled) => {
  return reduceMotionEnabled ? 0 : 300;
};

const animationDuration = getAnimationDuration(reduceMotionEnabled);
```

---

## Implementation Checklist

When implementing UI components:

- [ ] Uses theme colors from design system
- [ ] Follows typography guidelines
- [ ] Respects spacing/padding rules
- [ ] Includes accessibility attributes
- [ ] Supports both light and dark themes
- [ ] Works on small and large screens
- [ ] Animations respect reduced motion
- [ ] Has proper contrast ratio (4.5:1)
- [ ] Keyboard navigation works
- [ ] Tested with screen reader

---

## Resources

- **Design System Repo**: [Link]
- **Component Library**: Check `src/shared/components/`
- **Theme Configuration**: `src/shared/theme/UnifiedThemeProvider.js`
- **Figma**: [Link to design file]
- **Icon Reference**: [Vector Icons Library]

---

**Last Updated**: October 2025 | **Maintained by**: Design Team
