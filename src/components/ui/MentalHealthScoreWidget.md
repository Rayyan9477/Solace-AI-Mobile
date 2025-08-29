# Mental Health Score Widget

## Overview

The Mental Health Score Widget is a professional, medical-grade UI component designed specifically for mental health applications. It displays a mental health score using a circular progress indicator with clean, accessible design patterns that follow the "Doctor Freud.AI" visual style.

## Key Features

- **Circular Progress Indicator**: Clean, professional design with smooth animations
- **Score-based Emotional States**: Automatic state determination based on score ranges
- **Professional Color Scheme**: Uses medical-grade green (#00A878) color palette
- **Accessibility First**: Full screen reader support and WCAG 2.1 compliance
- **Multiple Variants**: Detailed, Compact, and Minimal versions
- **Smooth Animations**: Optional animated progress with easing transitions
- **Emotional Indicators**: Emoji and descriptive text based on mental health score
- **Responsive Design**: Adapts to different screen sizes and orientations

## Usage

### Basic Usage

```javascript
import { MentalHealthScoreWidget } from '../components/ui';

<MentalHealthScoreWidget
  score={80}
  maxScore={100}
  size={160}
  animated={true}
/>
```

### Advanced Usage with All Props

```javascript
<MentalHealthScoreWidget
  score={85}
  maxScore={100}
  size={200}
  strokeWidth={10}
  animated={true}
  showEmoji={true}
  showDescription={true}
  showDetails={true}
  style={customStyles.widget}
  contentStyle={customStyles.content}
  onPress={handlePress}
  accessibilityLabel="Mental health score widget"
  accessibilityHint="Shows current mental health status"
  testID="mental-health-widget"
/>
```

## Component Variants

### 1. Default Widget
```javascript
<MentalHealthScoreWidget score={80} />
```
- Size: 160px
- Shows: Score, emotional state, emoji, description, progress bar
- Best for: Main dashboard displays

### 2. Detailed Widget
```javascript
<DetailedMentalHealthScoreWidget score={80} />
```
- Size: 200px
- Shows: All features with larger display
- Best for: Dedicated mental health pages

### 3. Compact Widget
```javascript
<CompactMentalHealthScoreWidget score={80} />
```
- Size: 120px
- Shows: Score, emotional state, emoji
- Best for: Cards and smaller spaces

### 4. Minimal Widget
```javascript
<MinimalMentalHealthScoreWidget score={80} />
```
- Size: 100px
- Shows: Score only
- Best for: Lists and tight layouts

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `score` | number | `80` | The current mental health score |
| `maxScore` | number | `100` | The maximum possible score |
| `size` | number | `160` | Size of the circular widget in pixels |
| `strokeWidth` | number | `8` | Width of the progress circle stroke |
| `animated` | boolean | `true` | Enable smooth progress animations |
| `showEmoji` | boolean | `true` | Show emotional state emoji |
| `showDescription` | boolean | `true` | Show descriptive text |
| `showDetails` | boolean | `true` | Show additional details and progress bar |
| `style` | object/array | `{}` | Custom styles for container |
| `contentStyle` | object/array | `{}` | Custom styles for content area |
| `onPress` | function | `undefined` | Callback when widget is pressed |
| `accessibilityLabel` | string | `auto` | Custom accessibility label |
| `accessibilityHint` | string | `auto` | Custom accessibility hint |
| `testID` | string | `'mental-health-score-widget'` | Test identifier |

## Emotional State Mapping

The widget automatically determines emotional state based on score ranges:

| Score Range | State | Emoji | Description | Color |
|-------------|-------|-------|-------------|-------|
| 90-100 | Excellent | 🌟 | Thriving mentally | #00C896 |
| 80-89 | Mentally Stable | 😌 | In good mental health | #00A878 |
| 70-79 | Good | 🙂 | Generally positive | #28A745 |
| 60-69 | Fair | 😐 | Room for improvement | #FFC107 |
| 50-59 | Concerning | 😟 | Needs attention | #FF9800 |
| 40-49 | At Risk | 😰 | Requires support | #FF5722 |
| 0-39 | Critical | 🆘 | Immediate help needed | #F44336 |

## Design Specifications

### Visual Design
- **Background**: Clean white (#F8F9FA) or dark theme compatible
- **Progress Color**: Professional medical green (#00A878)
- **Track Color**: Light gray (#E9ECEF) or dark theme compatible
- **Typography**: System font with proper weight hierarchy
- **Shadows**: Subtle elevation for depth perception
- **Border Radius**: 16px for modern, friendly appearance

### Accessibility Features
- **Screen Reader**: Full VoiceOver/TalkBack support
- **Touch Targets**: Minimum 44x44px touch areas
- **Color Contrast**: WCAG 2.1 AA compliant ratios
- **High Contrast**: Support for system high contrast modes
- **Reduced Motion**: Respects user's motion preferences
- **Semantic Labels**: Meaningful descriptions for assistive technology

### Animation Specifications
- **Duration**: 2000ms for full progress animation
- **Easing**: Cubic bezier out easing for natural feel
- **Performance**: Native driver enabled for 60fps
- **Interruption**: Smooth handling of score changes during animation

## Integration Examples

### Dashboard Integration
```javascript
// In your dashboard component
import { MentalHealthScoreWidget } from '../components/ui';

const DashboardScreen = () => {
  const [mentalHealthScore, setMentalHealthScore] = useState(80);
  
  return (
    <View style={styles.dashboard}>
      <MentalHealthScoreWidget
        score={mentalHealthScore}
        onPress={() => navigation.navigate('MentalHealthDetails')}
        style={styles.scoreWidget}
      />
    </View>
  );
};
```

### Progress Tracking Integration
```javascript
// For tracking progress over time
const ProgressTracker = ({ weeklyScores }) => {
  const currentScore = weeklyScores[weeklyScores.length - 1];
  
  return (
    <View style={styles.progressContainer}>
      <DetailedMentalHealthScoreWidget
        score={currentScore}
        animated={true}
        style={styles.progressWidget}
      />
      <Text>Your progress this week</Text>
    </View>
  );
};
```

### Card Layout Integration
```javascript
// In a card layout
const MentalHealthCard = ({ score, onViewDetails }) => (
  <Card style={styles.mentalHealthCard}>
    <CardHeader title="Mental Health Score" />
    <CompactMentalHealthScoreWidget
      score={score}
      onPress={onViewDetails}
    />
  </Card>
);
```

## Customization

### Custom Styling
```javascript
const customStyles = StyleSheet.create({
  widget: {
    backgroundColor: '#F0F8FF',
    borderWidth: 2,
    borderColor: '#00A878',
    borderRadius: 20,
    padding: 24,
  },
  content: {
    alignItems: 'center',
  },
});

<MentalHealthScoreWidget
  score={75}
  style={customStyles.widget}
  contentStyle={customStyles.content}
/>
```

### Theme Integration
```javascript
// The widget automatically adapts to your app's theme
const { theme, isDarkMode } = useTheme();

<MentalHealthScoreWidget
  score={score}
  // Widget automatically uses theme colors
  style={{
    backgroundColor: theme.colors.background.card,
    shadowColor: theme.colors.shadow,
  }}
/>
```

## Performance Considerations

1. **Animation Performance**: Uses native driver for smooth 60fps animations
2. **Memory Management**: Properly cleans up animations on unmount
3. **Re-render Optimization**: Minimizes unnecessary re-renders
4. **Bundle Size**: Lightweight implementation with minimal dependencies

## Testing

### Unit Testing
```javascript
import { render, fireEvent } from '@testing-library/react-native';
import MentalHealthScoreWidget from './MentalHealthScoreWidget';

test('displays correct score', () => {
  const { getByText } = render(<MentalHealthScoreWidget score={80} />);
  expect(getByText('80')).toBeTruthy();
  expect(getByText('Mentally Stable')).toBeTruthy();
});

test('calls onPress when tapped', () => {
  const mockOnPress = jest.fn();
  const { getByTestId } = render(
    <MentalHealthScoreWidget score={80} onPress={mockOnPress} />
  );
  fireEvent.press(getByTestId('mental-health-score-widget'));
  expect(mockOnPress).toHaveBeenCalled();
});
```

### Accessibility Testing
```javascript
test('has correct accessibility attributes', () => {
  const { getByLabelText } = render(<MentalHealthScoreWidget score={75} />);
  const widget = getByLabelText(/Mental health score: 75/);
  expect(widget).toBeTruthy();
  expect(widget.props.accessibilityRole).toBe('progressbar');
});
```

## Browser/Platform Support

- **React Native**: iOS 12+, Android API 21+
- **React Native Web**: Modern browsers with SVG support
- **Expo**: SDK 45+
- **Dependencies**: react-native-svg for cross-platform SVG rendering

## Medical Compliance

This component is designed following mental health app best practices:

1. **Professional Appearance**: Medical-grade design standards
2. **Non-Stigmatizing**: Positive, supportive language and imagery
3. **Privacy Focused**: No automatic data collection or tracking
4. **Crisis Awareness**: Appropriate visual cues for concerning scores
5. **Therapeutic Colors**: Color psychology for mental wellness

## Migration Guide

### From Version 1.x to 2.x
```javascript
// Old usage
<MentalHealthScore value={80} />

// New usage
<MentalHealthScoreWidget score={80} />
```

### Breaking Changes
- Prop `value` renamed to `score`
- Default size increased from 120px to 160px
- Removed `theme` prop (now uses ThemeContext automatically)

## Support & Feedback

For questions, issues, or feature requests related to the Mental Health Score Widget:

1. Check existing issues in the project repository
2. Review the demo screen implementation for examples
3. Consult the therapeutic design guidelines
4. Follow mental health app accessibility standards

## Related Components

- `ProgressCard`: For displaying progress metrics
- `MoodTrackerIcon`: For mood-related iconography
- `TherapeuticButton`: For action buttons in mental health context
- `Card`: For containing the widget in layouts