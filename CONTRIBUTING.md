# 👥 Contributing to Solace AI Mobile

Thank you for your interest in contributing to Solace AI Mobile! This document provides guidelines and instructions for contributing to the project.

---

## Table of Contents

1. [Code of Conduct](#code-of-conduct)
2. [Getting Started](#getting-started)
3. [Development Setup](#development-setup)
4. [Coding Standards](#coding-standards)
5. [Commit Conventions](#commit-conventions)
6. [Pull Request Process](#pull-request-process)
7. [Testing Guidelines](#testing-guidelines)
8. [Documentation](#documentation)
9. [Mental Health Considerations](#mental-health-considerations)

---

## Code of Conduct

### Our Commitment

We are committed to providing a welcoming and inclusive environment for all contributors. We respect diverse backgrounds and perspectives.

### Our Standards

- Use welcoming and inclusive language
- Be respectful of differing opinions and experiences
- Gracefully accept constructive criticism
- Focus on what is best for the community
- Show empathy towards other community members

### Unacceptable Behavior

- Harassment, discrimination, or intimidation
- Offensive language or personal attacks
- Unwelcome sexual attention
- Publishing others' private information without permission
- Other conduct unsuitable for a professional environment

### Reporting Issues

If you experience or witness unacceptable behavior, please contact maintainers directly or email report@solaceai.example.com.

---

## Getting Started

### Prerequisites

- Node.js v16+ and npm v8+
- Git
- Familiarity with React Native and JavaScript/TypeScript
- Understanding of mental health app principles (preferred but not required)

### Finding Work

Look for issues labeled:

- `good-first-issue` - Good starting points for new contributors
- `help-wanted` - Areas where contributions are needed
- `bug` - Issues to fix
- `feature-request` - New features to implement
- `documentation` - Documentation improvements

### Communication

- **Discussions**: Use GitHub Discussions for questions and ideas
- **Issues**: Use Issues for bug reports and feature requests
- **Pull Requests**: For code changes
- **Email**: For sensitive topics or code of conduct issues

---

## Development Setup

### 1. Fork and Clone

```bash
# Fork the repository on GitHub

# Clone your fork
git clone https://github.com/YOUR_USERNAME/Solace-AI-Mobile.git
cd Solace-AI-Mobile

# Add upstream remote
git remote add upstream https://github.com/Rayyan9477/Solace-AI-Mobile.git
```

### 2. Install Dependencies

```bash
# Install all dependencies including theme-preview
npm run setup

# If you only need the main app
npm install
```

### 3. Create Feature Branch

```bash
# Update main branch
git fetch upstream
git checkout main
git rebase upstream/main

# Create feature branch
git checkout -b feature/your-feature-name
```

### 4. Start Development

```bash
# Option 1: Main app development
npm start

# Option 2: Web development
npm run web

# Option 3: Concurrent development (main app + theme preview)
npm run dev
```

---

## Coding Standards

### File Organization

```
feature-name/
├── screens/
│   ├── FeatureScreen.js
│   └── index.ts
├── components/
│   ├── FeatureComponent.js
│   └── index.ts
├── services/
│   └── featureService.js
├── hooks/
│   └── useFeature.js
├── types/
│   └── feature.types.ts
└── index.ts
```

### Naming Conventions

| Item | Convention | Example |
|------|-----------|---------|
| Files | PascalCase or kebab-case | `MoodTracker.js` or `mood-tracker.js` |
| Components | PascalCase | `MoodCard.js` |
| Functions | camelCase | `calculateMoodStats()` |
| Constants | UPPER_SNAKE_CASE | `MAX_MOOD_INTENSITY` |
| Private functions | _camelCase | `_validateInput()` |
| Boolean variables | is/has prefix | `isLoading`, `hasError` |

### Code Style

#### Functional Components Only

```javascript
// ✅ Good
export const MoodCard = ({ mood, onPress }) => {
  return (
    <TouchableOpacity onPress={onPress}>
      <Text>{mood.name}</Text>
    </TouchableOpacity>
  );
};

// ❌ Bad
export class MoodCard extends Component {
  render() {
    return <Text>{this.props.mood.name}</Text>;
  }
}
```

#### Use React Hooks

```javascript
// ✅ Good
export const MoodTracker = () => {
  const [mood, setMood] = useState(null);
  
  useEffect(() => {
    // Load mood data
  }, []);
  
  return <View>{/* JSX */}</View>;
};

// ❌ Bad
export const MoodTracker = () => {
  const [state, setState] = useState({
    mood: null,
    loading: false
  });
  
  this.componentDidMount(); // ❌ No 'this' in functional components
};
```

#### Import Aliases

```javascript
// ✅ Good - Use aliases
import { Button } from '@components/atoms/Button';
import { useTheme } from '@theme/ThemeProvider';
import { formatDate } from '@utils/dateUtils';
import { saveMood } from '@app/store/slices/moodSlice';

// ❌ Bad - Deep relative paths
import { Button } from '../../../../shared/components/atoms/Button';
import { useTheme } from '../../shared/theme/ThemeProvider';
```

#### Props and TypeScript

```javascript
// ✅ Good - Clear interface
interface MoodCardProps {
  mood: Mood;
  onPress: (mood: Mood) => void;
  disabled?: boolean;
}

export const MoodCard: React.FC<MoodCardProps> = ({ mood, onPress, disabled }) => {
  // Implementation
};

// Or use PropTypes
MoodCard.propTypes = {
  mood: PropTypes.shape({
    id: PropTypes.string.required,
    name: PropTypes.string.required
  }).required,
  onPress: PropTypes.func.required,
  disabled: PropTypes.bool
};
```

#### Accessibility

```javascript
// ✅ Good - Full accessibility
<TouchableOpacity
  accessible
  accessibilityLabel="Select mood: happy"
  accessibilityRole="button"
  accessibilityState={{ disabled: isDisabled }}
  onPress={onPress}
>
  <Text>Happy</Text>
</TouchableOpacity>

// ❌ Bad - No accessibility
<TouchableOpacity onPress={onPress}>
  <Text>Happy</Text>
</TouchableOpacity>
```

#### Comments and Documentation

```javascript
/**
 * MoodCard - Interactive mood selection component
 * @component
 * @param {Mood} mood - The mood object
 * @param {Function} onPress - Callback when mood is selected
 * @param {boolean} [disabled=false] - Whether the card is disabled
 * @returns {JSX.Element}
 */
export const MoodCard = ({ mood, onPress, disabled = false }) => {
  // Implementation
};

// TODO: Add mood emoji animation when implemented
// FIXME: Mood color transitions are laggy on older devices
// HACK: Temporarily using hardcoded colors, replace with theme
```

#### Error Handling

```javascript
// ✅ Good
export const MoodTracker = () => {
  try {
    const data = fetchMoodData();
    return <MoodList data={data} />;
  } catch (error) {
    console.error('Failed to fetch mood data:', error);
    return <ErrorBoundary error={error} />;
  }
};

// Using Redux for async errors
const { data, error } = useSelector(state => state.mood);

if (error) {
  return <ErrorAlert message={error} onRetry={refetch} />;
}
```

---

## Commit Conventions

### Commit Message Format

```
type(scope): subject

body

footer
```

### Types

- `feat` - New feature
- `fix` - Bug fix
- `docs` - Documentation changes
- `style` - Code style changes (formatting, missing semicolons)
- `refactor` - Code refactoring without feature changes
- `perf` - Performance improvements
- `test` - Test additions or updates
- `chore` - Build, dependency, or tooling changes
- `ci` - CI/CD configuration changes

### Scope

Scope specifies which feature/component is affected:

- `mood` - Mood tracking feature
- `chat` - AI therapy chat
- `auth` - Authentication
- `ui` - UI components
- `theme` - Theme system
- `navigation` - Navigation changes
- `store` - State management

### Examples

```bash
git commit -m "feat(mood): add mood intensity slider to tracker"
git commit -m "fix(chat): resolve message scroll position bug"
git commit -m "docs(readme): update installation instructions"
git commit -m "refactor(ui): extract button styles to separate file"
git commit -m "perf(mood): optimize mood chart rendering"
git commit -m "test(auth): add login validation tests"
```

### Commit Guidelines

- **One concern per commit** - Each commit should address one logical change
- **Write descriptive messages** - Explain what and why, not just what
- **Use imperative mood** - "Add feature" not "Added feature"
- **Keep commits atomic** - Commits should compile and test independently
- **Reference issues** - Include issue numbers: "Closes #123"

---

## Pull Request Process

### Before Creating a PR

1. **Update main branch**
   ```bash
   git fetch upstream
   git rebase upstream/main
   ```

2. **Test your changes**
   ```bash
   npm run lint:fix
   npm test
   npm run test:coverage
   ```

3. **Ensure tests pass**
   - Run full test suite: `npm run test:ci`
   - Check coverage is acceptable
   - Test on target platform

### Creating a Pull Request

1. **Push your branch**
   ```bash
   git push origin feature/your-feature
   ```

2. **Create PR on GitHub**
   - Use descriptive title
   - Fill out PR template completely
   - Link related issues
   - Explain changes clearly

### PR Template

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix (fixes an existing issue)
- [ ] New feature (adds new functionality)
- [ ] Breaking change (causes existing functionality to change)
- [ ] Documentation update

## Related Issues
Closes #123

## How Has This Been Tested?
Describe testing procedures:
- [ ] Unit tests pass
- [ ] Manual testing completed
- [ ] Tested on Android
- [ ] Tested on iOS
- [ ] Tested accessibility

## Screenshots (if applicable)
Add screenshots for UI changes

## Checklist
- [ ] My code follows the style guidelines
- [ ] I have performed a self-review
- [ ] I have commented complex code
- [ ] I have updated relevant documentation
- [ ] My changes generate no new warnings
- [ ] I have added tests
- [ ] New and existing tests pass
- [ ] I have tested accessibility
```

### PR Review Process

1. **Automated checks run**
   - Linting
   - Tests
   - Code coverage

2. **Code review**
   - Maintainers review code
   - Provide feedback or approval

3. **Changes requested**
   - Address review comments
   - Push updates to same branch
   - Re-request review

4. **Approval and merge**
   - Maintainers merge PR
   - Branch is automatically deleted

---

## Testing Guidelines

### Test File Location

```
test/
├── features/
│   └── mood/
│       ├── MoodTracker.test.js
│       └── moodService.test.js
├── shared/
│   └── components/
│       └── atoms/
│           └── Button.test.js
└── ...
```

### Writing Tests

#### Unit Tests

```javascript
import { render, screen, fireEvent } from '@testing-library/react-native';
import { MoodCard } from '@features/mood/components/MoodCard';

describe('MoodCard', () => {
  it('renders mood name', () => {
    const mood = { id: '1', name: 'Happy' };
    render(<MoodCard mood={mood} onPress={() => {}} />);
    
    expect(screen.getByText('Happy')).toBeTruthy();
  });

  it('calls onPress when pressed', () => {
    const onPress = jest.fn();
    const mood = { id: '1', name: 'Happy' };
    
    const { getByRole } = render(
      <MoodCard mood={mood} onPress={onPress} />
    );
    
    fireEvent.press(getByRole('button'));
    expect(onPress).toHaveBeenCalledWith(mood);
  });

  it('disables when disabled prop is true', () => {
    const mood = { id: '1', name: 'Happy' };
    const { getByRole } = render(
      <MoodCard mood={mood} onPress={() => {}} disabled />
    );
    
    const button = getByRole('button');
    expect(button).toHaveAccessibilityState({ disabled: true });
  });
});
```

#### Integration Tests

```javascript
describe('Mood Tracking Workflow', () => {
  it('saves mood and updates history', async () => {
    const { getByRole, getByText } = render(
      <ReduxProvider store={store}>
        <MoodTracker />
      </ReduxProvider>
    );

    const happyButton = getByRole('button', { name: /happy/i });
    fireEvent.press(happyButton);

    await waitFor(() => {
      expect(getByText(/mood saved/i)).toBeTruthy();
    });

    expect(store.getState().mood.currentMood).toEqual('happy');
  });
});
```

#### Snapshot Tests

```javascript
it('renders correctly', () => {
  const tree = render(
    <MoodCard mood={{ name: 'Happy' }} onPress={() => {}} />
  ).toJSON();
  
  expect(tree).toMatchSnapshot();
});
```

### Test Coverage

- **Target**: Minimum 80% code coverage
- **Focus areas**: 
  - All public functions
  - Error cases
  - Edge cases
  - UI interactions

Run coverage:

```bash
npm run test:coverage
```

---

## Documentation

### Code Documentation

Use JSDoc comments for all functions and components:

```javascript
/**
 * Calculates mood statistics from mood entries
 * @param {Array<MoodEntry>} entries - Array of mood entries
 * @param {string} [period='week'] - Time period ('day', 'week', 'month')
 * @returns {Object} Statistics object with average, trend, and distribution
 * @throws {Error} If entries array is empty
 */
export const calculateMoodStats = (entries, period = 'week') => {
  // Implementation
};
```

### README Files

Create README files for complex features:

```markdown
# Mood Tracking Feature

## Overview
Brief description of feature

## Architecture
How it works internally

## Usage
How to use in components

## API
Public functions and interfaces

## Examples
Code examples
```

### Update Main Documentation

- Update `PROJECT.md` for major architecture changes
- Update `ARCHITECTURE.md` for pattern changes
- Update feature README if adding new capabilities
- Update CLAUDE.md if adding development guidelines

---

## Mental Health Considerations

### When Working on Mental Health Features

1. **Sensitivity**: Always consider that users may be in distress
2. **Crisis Safety**: Ensure crisis features work even if app fails
3. **Therapeutic Accuracy**: Consult mental health professionals for guidance
4. **Accessibility**: Mental health users may have accessibility needs
5. **Privacy**: Treat all user data with utmost confidentiality

### Responsible Feature Development

- ✅ Test crisis intervention paths thoroughly
- ✅ Include proper error recovery
- ✅ Provide emergency resources
- ✅ Ensure therapeutic accuracy
- ✅ Consider user vulnerability

### Testing Mental Health Features

```javascript
describe('Crisis Intervention', () => {
  // CRITICAL: These tests must always pass
  it('shows crisis resources when triggered', () => {
    // Implementation
  });

  it('displays hotline number prominently', () => {
    // Implementation
  });

  it('allows immediate emergency contact', () => {
    // Implementation
  });

  it('works even with network errors', () => {
    // Implementation
  });
});
```

---

## Questions or Need Help?

- **GitHub Issues**: Ask in an issue
- **GitHub Discussions**: Start a discussion
- **Email**: Contact maintainers
- **Documentation**: Check PROJECT.md, ARCHITECTURE.md, and DESIGN_GUIDE.md

---

## License

By contributing to Solace AI Mobile, you agree that your contributions will be licensed under the MIT License.

---

## Acknowledgments

Thank you for contributing to mental health technology! Your work helps people get support when they need it most.

**Last Updated**: October 2025
