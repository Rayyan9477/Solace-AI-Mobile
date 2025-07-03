# Freud UI Kit Light Mode - Design System

## Overview

The Solace AI Mobile app now features a modern, accessible light mode design system inspired by the Freud UI Kit. This design system prioritizes mental health and wellness with carefully chosen therapeutic colors, typography, and component patterns.

## Design Philosophy

### Core Principles
- **Therapeutic First**: Colors and components designed to promote mental wellness
- **Accessibility**: High contrast ratios and readable typography
- **Consistency**: Unified design language across all components
- **Flexibility**: Support for both light and dark modes
- **Modern**: Clean, contemporary aesthetic inspired by leading mental health apps

### Color Psychology
The color palette is specifically chosen to support mental health:
- **Primary (Slate Blue)**: Calming, professional, trustworthy
- **Secondary (Sage Green)**: Nurturing, growth, balance
- **Mood Colors**: Gentle representations of emotional states
- **Therapeutic Colors**: Specific color families for different therapeutic purposes

## Color System

### Primary Colors
- **50-900 Scale**: From very light to very dark
- **Main Color**: `#64748B` (Slate 500)
- **Usage**: Primary actions, navigation, branding

### Secondary Colors
- **50-900 Scale**: Sage green palette
- **Main Color**: `#7FB08A` (Sage 500)
- **Usage**: Secondary actions, nature-related features

### Therapeutic Colors
- **Calming**: Blue tones for relaxation features
- **Energizing**: Orange tones for motivation
- **Grounding**: Purple tones for stability
- **Nurturing**: Green tones for growth
- **Peaceful**: Blue-gray tones for tranquility

### Mood Colors
Gentle, accessible colors for mood tracking:
- **Happy**: Soft yellow `#FEF08A`
- **Calm**: Light blue `#BAE6FD`
- **Anxious**: Light purple `#E0E7FF`
- **Content**: Pale green `#DCFCE7`
- And more...

## Typography

### Font Hierarchy
- **Heading 1**: 48px, Bold
- **Heading 2**: 36px, Semi-bold
- **Heading 3**: 28px, Medium
- **Body Large**: 18px, Regular
- **Body Regular**: 14px, Regular
- **Body Small**: 12px, Regular

### Usage Guidelines
- Use consistent line heights for readability
- Maintain proper contrast ratios
- Consider dyslexia-friendly font choices

## Components

### Cards
- **Background**: Pure white `#FFFFFF`
- **Border**: Light gray `#E5E7EB`
- **Shadow**: Subtle elevation
- **Radius**: 16px for modern appearance

### Buttons
- **Primary**: Slate blue background
- **Secondary**: Sage green background
- **Outline**: Transparent with border
- **Therapeutic**: Specific therapeutic colors

### Inputs
- **Background**: Very light gray `#F9FAFB`
- **Border**: Light gray `#E5E7EB`
- **Focus**: Primary blue `#3B82F6`
- **Placeholder**: Medium gray `#9CA3AF`

## Implementation

### Theme Usage
```javascript
import { useTheme } from '../contexts/ThemeContext';

const MyComponent = () => {
  const { theme } = useTheme();
  
  return (
    <View style={{ backgroundColor: theme.colors.background.primary }}>
      <Text style={{ color: theme.colors.text.primary }}>
        Hello World
      </Text>
    </View>
  );
};
```

### Color Access
```javascript
// Primary colors
theme.colors.primary[500]    // Main primary
theme.colors.primary[100]    // Light primary
theme.colors.primary[700]    // Dark primary

// Therapeutic colors
theme.colors.therapeutic.calming[500]
theme.colors.therapeutic.energizing[200]

// Mood colors
theme.colors.mood.happy
theme.colors.mood.calm
```

## Dark Mode Support

The design system includes full dark mode support:
- **Background**: Deep midnight `#0F172A`
- **Text**: Light blue-white `#F8FAFC`
- **Cards**: Dark slate `#1E293B`
- **Borders**: Medium slate `#475569`

## Accessibility

### Contrast Ratios
- **Primary text**: 4.5:1 minimum
- **Secondary text**: 3:1 minimum
- **Interactive elements**: 4.5:1 minimum

### Features
- Screen reader friendly
- High contrast mode support
- Keyboard navigation support
- Touch target sizes (44px minimum)

## File Structure

```
src/
  styles/
    theme.js                 # Main theme configuration
  contexts/
    ThemeContext.js         # Theme provider and hooks
  components/
    demo/
      LightModeDemo.js      # Demo component
  screens/
    ThemeShowcaseScreen.js  # Full showcase screen
```

## Usage Examples

### Basic Card
```javascript
<View style={[
  styles.card,
  { 
    backgroundColor: theme.colors.background.card,
    borderColor: theme.colors.border.primary,
  }
]}>
  <Text style={{ color: theme.colors.text.primary }}>
    Card Content
  </Text>
</View>
```

### Mood Button
```javascript
<TouchableOpacity style={[
  styles.moodButton,
  { backgroundColor: theme.colors.mood.happy }
]}>
  <Text style={{ color: theme.colors.text.primary }}>
    Happy
  </Text>
</TouchableOpacity>
```

### Therapeutic Section
```javascript
<View style={[
  styles.section,
  { backgroundColor: theme.colors.therapeutic.calming[50] }
]}>
  <Text style={{ color: theme.colors.text.primary }}>
    Meditation Section
  </Text>
</View>
```

## Development

### Testing
- Use ThemeShowcaseScreen to preview all colors and components
- Test in both light and dark modes
- Verify accessibility with screen readers
- Check contrast ratios with tools

### Customization
- Modify colors in `theme.js`
- Update component styles to use theme colors
- Test across different screen sizes
- Ensure consistency with design system

## Best Practices

1. **Always use theme colors**: Never hardcode colors
2. **Test accessibility**: Ensure proper contrast ratios
3. **Consistent spacing**: Use theme spacing values
4. **Responsive design**: Consider different screen sizes
5. **Performance**: Optimize for smooth animations
6. **User feedback**: Gather input on color choices and usability

## Future Enhancements

- [ ] Custom font integration
- [ ] Animation system expansion
- [ ] Additional therapeutic color variations
- [ ] Advanced accessibility features
- [ ] User customization options
- [ ] Automated design token generation from Figma

## Resources

- [Freud UI Kit](https://www.figma.com/design/gNHpWsoal7dlP2WJpoq1Ob/freud-UI-Kit--AI-Mental-Health-App--Community-)
- [Web Content Accessibility Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [Mental Health App Design Guidelines](https://www.nimh.nih.gov/health/topics/technology-and-the-future-of-mental-health-treatment)
