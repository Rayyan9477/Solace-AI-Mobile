# 🧠 Solace AI Mobile

**Your Empathetic Digital Confidant** — A React Native mental health application with AI therapy, mood tracking, mindfulness, and community support.

![React Native](https://img.shields.io/badge/React%20Native-0.76.9-61dafb?logo=react)
![Expo](https://img.shields.io/badge/Expo-~52.0.0-000020?logo=expo)
![TypeScript](https://img.shields.io/badge/TypeScript-5.3.3-3178c6?logo=typescript)
![License](https://img.shields.io/badge/License-MIT-green)
![Tests](https://img.shields.io/badge/Tests-519%2F548%20passing-brightgreen)

---

## ✨ Key Features

| Feature | Description |
|---------|-------------|
| 🤖 **AI Therapy Chat** | Natural language conversations with emotional intelligence |
| 📊 **Mood Tracking** | Track daily moods with analytics and trend insights |
| 🧘 **Mindfulness** | Guided meditation and breathing exercises |
| 📝 **Journaling** | Secure mental health journal with mood tagging |
| 🆘 **Crisis Support** | Emergency resources and crisis hotline integration |
| 👥 **Community** | Moderated support groups and peer connection |
| 📈 **Assessments** | Evidence-based mental health screening |
| 🎨 **Customizable Themes** | 5 therapeutic color palettes + light/dark modes + web responsive design |
| ♿ **Accessibility** | Full screen reader support and keyboard navigation |
| 📱 **Cross-Platform** | iOS, Android, and Web support |

---

## 🚀 Quick Start

### Prerequisites

- **Node.js** v16+ | **npm** v8+ | **Git**
- **Expo CLI**: `npm install -g expo-cli`
- Optional: **Xcode** (iOS) | **Android Studio** (Android)

### Installation & Running

```bash
# Clone the repository
git clone https://github.com/Rayyan9477/Solace-AI-Mobile.git
cd Solace-AI-Mobile

# Install dependencies
npm run setup

# Start development server
npm start

# Run on platform (from Expo CLI):
# Press 'a' for Android | 'i' for iOS | 'w' for web
```

### Alternative Commands

```bash
npm run web                    # Web development
npm run dev                    # Main app + theme preview (concurrent)
npm run android               # Android build
npm run ios                   # iOS build
```

---

## 📚 Documentation

| Document | Purpose |
|----------|---------|
| **[PROJECT.md](./PROJECT.md)** | Comprehensive project guide with structure & architecture |
| **[ARCHITECTURE.md](./ARCHITECTURE.md)** | Detailed system design and patterns |
| **[DESIGN_GUIDE.md](./DESIGN_GUIDE.md)** | Design system, UI components, and guidelines |
| **[CONTRIBUTING.md](./CONTRIBUTING.md)** | Development standards and contribution workflow |
| **[CLAUDE.md](./CLAUDE.md)** | AI development assistant reference |

---

## 🏗️ Architecture Overview

### Feature-Based Structure

```
src/
├── app/                    # App configuration (navigation, store, providers)
├── features/               # Feature modules (mood, chat, auth, etc.)
├── shared/                 # Reusable components & utilities (Atomic Design)
└── ...
```

### Key Technologies

- **State Management**: Redux Toolkit + Redux Persist
- **Navigation**: React Navigation v6
- **UI Components**: React Native Paper + Custom Atomic Design
- **Theme System**: UnifiedThemeProvider (Light/Dark modes)
- **Testing**: Jest + React Testing Library + Playwright
- **Type Safety**: TypeScript

### Import Aliases

```javascript
// Clean absolute imports
import { Button } from '@components/atoms/Button';
import { useTheme } from '@theme/ThemeProvider';
import { formatDate } from '@utils/dateUtils';
```

---

## 🧪 Testing

```bash
# Run all tests
npm test                          # Jest watch mode
npm run test:ci                   # CI with coverage

# E2E tests (Playwright)
npm run test:playwright           # Run all E2E tests
npm run test:playwright:debug     # Debug mode
npm run test:playwright:report    # View HTML report

# Code quality
npm run lint                      # Check linting
npm run lint:fix                  # Auto-fix issues
```

**Test Status**: 519/548 tests passing (94.7%) ✅

---

## 💻 Development Workflow

### Code Standards

- ✅ Functional components with React Hooks
- ✅ TypeScript for type safety
- ✅ Absolute imports with aliases
- ✅ Atomic Design pattern for UI components
- ✅ Proper error boundaries
- ✅ Comprehensive accessibility attributes

### Development Commands

```bash
npm start              # Expo development server
npm run dev           # Main app + theme preview
npm run lint:fix      # Fix linting issues
npm run theme-preview # Theme preview only
```

---

## 📊 Project Statistics

| Metric | Value |
|--------|-------|
| **Components** | 50+ reusable components |
| **Features** | 10+ major features |
| **Test Coverage** | 85%+ code coverage |
| **Test Suites** | 30 test suites |
| **TypeScript Files** | 80+ .ts/.tsx files |
| **Documentation** | Comprehensive (5+ guides) |

---

## 🎨 Design System

### Themes

- **Light Mode**: Clean, energizing colors for daytime use
- **Dark Mode**: Therapeutic brown palette for evening use
- **Accessible**: High contrast options and reduced motion support
- **Web Responsive**: Adaptive layouts for desktop, tablet, and mobile

### Color Palettes

Choose from 5 therapeutic color presets designed for mental wellness:

| Palette | Description | Best For |
|---------|-------------|----------|
| **Mindful Brown** | Original therapeutic brown (default) | General wellness, evening use |
| **Serene Green** | Calming green tones | Anxiety relief, meditation |
| **Warm Orange** | Energizing orange/amber | Motivation, morning use |
| **Wisdom Purple** | Deep purple tones | Focus, contemplation |
| **Sunshine Yellow** | Bright optimistic yellows | Mood elevation, energy boost |

**Customize your theme**: Navigate to **Profile → Theme Settings** to select your preferred color palette. Changes apply instantly and persist across sessions.

### Responsive Design

- **Mobile First**: Optimized touch targets and layouts for phones
- **Web Optimized**: Centered content with max-width constraints (480-800px)
- **Tablet Support**: Adaptive breakpoints for iPad and tablets
- **Desktop Ready**: Professional card-based layouts for large screens

See [DESIGN_GUIDE.md](./DESIGN_GUIDE.md) for detailed design specifications.

---

## 🔧 Technology Stack

### Core
- **React Native** - Mobile app framework
- **Expo** - Development platform
- **React** 18.3.1 - UI library
- **TypeScript** - Type safety

### State & Routing
- **Redux Toolkit** - State management
- **Redux Persist** - State persistence
- **React Navigation** v6 - Routing

### UI & Styling
- **React Native Paper** - Material Design
- **Reanimated** - Smooth animations
- **Linear Gradient** - Gradient effects

### Testing
- **Jest** - Test runner
- **React Testing Library** - Component testing
- **Playwright** - E2E testing

---

## 🚢 Building & Deployment

### Development

```bash
npm run setup          # Full setup
npm start             # Start Expo
npm run web           # Web development
```

### Production

```bash
npm run lint:fix      # Format code
npm run test:ci       # Run tests
npm run android       # Android build
npm run ios           # iOS build
```

---

## 👥 Contributing

We welcome contributions! Please see [CONTRIBUTING.md](./CONTRIBUTING.md) for:

- Code standards and style guide
- Commit message conventions
- Pull request process
- Testing requirements
- Documentation guidelines

### Quick Contribution Steps

```bash
# 1. Create feature branch
git checkout -b feature/your-feature

# 2. Make changes & add tests
npm run lint:fix
npm test

# 3. Push and create pull request
git push origin feature/your-feature
```

---

## 🆘 Crisis Support

**If you're in crisis, please reach out:**

- **National Suicide Prevention Lifeline** (US): **1-800-273-8255**
- **Crisis Text Line**: Text **HOME** to **741741**
- **International**: https://www.iasp.info/resources/Crisis_Centres/

The app includes emergency resources and crisis support features.

---

## 📄 License

MIT License - See [LICENSE](./LICENSE) file for details

---

## 📞 Support

- **Issues & Bugs**: [GitHub Issues](https://github.com/Rayyan9477/Solace-AI-Mobile/issues)
- **Documentation**: See [PROJECT.md](./PROJECT.md)
- **Architecture**: See [ARCHITECTURE.md](./ARCHITECTURE.md)

---

**Version**: 1.0.0 | **Last Updated**: October 2025 | **Maintained by**: [Rayyan9477](https://github.com/Rayyan9477)
