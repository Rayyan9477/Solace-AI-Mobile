# Claude Code Implementation Prompt

Copy and paste the prompt below when starting implementation:

---

## 🚀 MAIN IMPLEMENTATION PROMPT

```
You are a Senior Frontend Engineer implementing the Solace AI Mobile app (freud.ai mental health app).

## PROJECT CONTEXT
- Tech: React Native 0.76.9, Expo SDK 52, TypeScript 5.3
- Screens: 158 screens across 32 batches
- Components: 44 atomic components
- Architecture: Feature-based modules with shared atomic components

## CRITICAL: FRONTEND ONLY
- NO backend logic, NO API calls, NO database operations
- Use PLACEHOLDER/MOCK data for all screens
- State only for UI interactions (modals, tabs, animations)
- Components receive data via props only

## REQUIRED READING (DO THIS FIRST - IN ORDER)
1. Read `docs/implementation.md` - Full implementation plan with phases and sprints
2. Read `docs/TOOLS-AND-RESOURCES.md` - Installed packages and how to use them
3. Read `docs/ui-audit/REMEDIATION-GUIDE.md` - 42 design issues with fixes
4. **CRITICAL**: For each batch, read the corresponding audit file in `docs/ui-audit/batch-XX-*.md`
   - Review ALL screenshots/images referenced in the audit
   - Understand the exact UI layout, spacing, colors from images
   - Note all identified issues and their fixes
   - Match the design exactly as shown in screenshots

## INSTALLED TOOLS - USE THEM
| Tool | Package | Use For |
|------|---------|---------|
| **GlueStack UI** | `@gluestack-ui/themed` | Accessible components, dark mode |
| **React Hook Form** | `react-hook-form` + `zod` | ALL forms with type-safe validation |
| **Charts** | `react-native-gifted-charts` | ALL mood/sleep/stress visualizations |
| **State** | `zustand` | UI state (modals, tabs, form drafts) |
| **Styling** | `@shopify/restyle` | Design tokens, NO hardcoded values |
| **Animation** | `moti` | Declarative animations |

## MCP SERVERS - QUERY BEFORE BUILDING

### 1. Sequential Thinking (Complex Problems)
Use for multi-step implementation planning:
```
Think step-by-step about implementing [component]:
1. What are the UI requirements?
2. What accessibility features needed?
3. What states does it have?
4. How does it animate?
```

### 2. Context7 (Documentation)
Query for React Native patterns:
- "React Native [component] TypeScript accessibility"
- "React Navigation v6 bottom tabs nested stack"
- "react-native-calendars custom day component"

### 3. Exa (Code Examples)
Query for production patterns:
- "production react native [component] component variants"
- "react native mood tracker chart health app"
- "react native chat bubble message component"

### 4. Playwright (Testing)
Use for E2E test patterns when needed.

### 5. ESLint MCP
Use to verify code quality and accessibility compliance.

## DESIGN REFERENCE - SHADCN/UI PATTERNS
Follow shadcn/ui design principles:
- Clean, minimal aesthetic
- Consistent spacing (4px grid system)
- Subtle shadows and borders
- Smooth micro-interactions
- Accessible by default
- Dark mode as primary theme

## AUDIT REVIEW WORKFLOW (FOR EACH SCREEN)

Before implementing any screen:
1. **Find the audit file**: `docs/ui-audit/batch-XX-*.md`
2. **Review ALL images/screenshots** in the audit
3. **Extract from images**:
   - Exact colors (use eyedropper if needed)
   - Spacing and padding values
   - Typography sizes and weights
   - Component hierarchy
   - Icon placements
4. **Read identified issues** in the audit
5. **Apply fixes** from REMEDIATION-GUIDE.md
6. **Match the design pixel-perfect**

## IMPLEMENTATION RULES

1. **FRONTEND ONLY** - No API calls, mock all data
2. **TDD** - Write tests first, then implement
3. **Atomic Design** - atoms → molecules → organisms
4. **Dark Mode First** - Default theme for wellness app
5. **Accessibility First**:
   - 44x44pt minimum touch targets
   - Proper accessibilityLabel on ALL interactive elements
   - accessibilityRole for semantic meaning
   - Screen reader tested
6. **No Hardcoded Values** - Use theme tokens
7. **Review Images** - Match screenshots exactly

## WORKFLOW FOR EACH TASK

1. **Read** the task requirements from implementation.md
2. **Find & Review** the audit file with screenshots
3. **Think** step-by-step (use sequential-thinking MCP)
4. **Query** MCP servers for patterns (Context7, Exa)
5. **Write** test file first (.test.tsx)
6. **Implement** component matching screenshots exactly
7. **Verify** with `npm test` and `npm run lint`
8. **Mark** task complete, move to next

## QUALITY CHECKLIST (EVERY COMPONENT)

- [ ] Matches screenshot/design exactly
- [ ] Uses theme tokens (no hardcoded colors/spacing)
- [ ] Has accessibility labels and roles
- [ ] Touch targets >= 44x44pt
- [ ] Dark mode supported
- [ ] Tests written and passing
- [ ] ESLint passing (especially a11y rules)
- [ ] No API calls (frontend only)

## START COMMAND

Begin with Phase 1, Sprint 1.1, Task 1.1.1 from implementation.md.
Work sequentially through each task.
Track progress using TodoWrite tool.
Review audit images before each screen implementation.

Execute now.
```

---

## 📝 SHORTER VERSION (Quick Start)

```
Implement Solace AI Mobile following docs/implementation.md.

CRITICAL - FRONTEND ONLY:
- NO API calls, NO backend logic
- Use PLACEHOLDER/MOCK data only
- State only for UI interactions

BEFORE EACH SCREEN:
1. Read audit file: docs/ui-audit/batch-XX-*.md
2. Review ALL screenshots/images in audit
3. Match the design pixel-perfect
4. Apply fixes from REMEDIATION-GUIDE.md

USE INSTALLED TOOLS:
- GlueStack UI - Accessible components
- React Hook Form + Zod - ALL forms
- react-native-gifted-charts - ALL charts
- Zustand - UI state
- Shopify Restyle - Design tokens (NO hardcoded values)
- Moti - Animations

USE MCP SERVERS:
- Sequential Thinking - Complex problem planning
- Context7 - React Native documentation
- Exa - Production code examples

RULES:
- TDD: test first, then implement
- Dark mode first, accessibility-first (WCAG 2.1 AA)
- 44x44pt minimum touch targets
- Match screenshots exactly

Start Phase 1, Sprint 1.1, Task 1.1.1. Track with TodoWrite.
```

---

## 🎯 SINGLE SCREEN PROMPT

For implementing a specific screen:

```
Build [SCREEN_NAME] from docs/implementation.md Task [X.X.X].

STEP 1 - REVIEW AUDIT:
1. Read docs/ui-audit/batch-XX-*.md for this screen
2. Review ALL screenshots/images carefully
3. Note exact colors, spacing, layout from images
4. Read identified issues and fixes

STEP 2 - PLAN (Sequential Thinking):
Think step-by-step:
- What components does this screen need?
- What is the layout structure?
- What states/interactions exist?
- What accessibility features needed?

STEP 3 - QUERY MCP:
- Context7: "React Native [relevant pattern]"
- Exa: "production [similar component]"

STEP 4 - IMPLEMENT:
- FRONTEND ONLY - use mock/placeholder data
- Use Shopify Restyle for styling
- Use GlueStack UI patterns for accessibility
- Match screenshot exactly
- Write tests first (TDD)

STEP 5 - VERIFY:
- npm test (tests pass)
- npm run lint (a11y rules pass)
- Visual match to screenshot

Implement now.
```

---

## 🔧 PHASE-SPECIFIC PROMPTS

### Phase 1: Design System
```
Implement Phase 1 (Design System Foundation) from docs/implementation.md.

FRONTEND ONLY - Create theme configuration files:
- shadows.ts - Shadow presets
- gradients.ts - Gradient definitions
- animationTimings.ts - Animation/easing presets
- zIndex.ts - Z-index scale

Use Shopify Restyle for type-safe theme tokens.
Follow shadcn/ui design principles (clean, minimal, accessible).
TDD approach - write tests first.

Start Sprint 1.1, Task 1.1.1.
```

### Phase 2: Components
```
Implement Phase 2 (Core Component Library) from docs/implementation.md.

FRONTEND ONLY - Build 44 atomic components:
- Atoms: Button, Input, Badge, Avatar, etc.
- Molecules: Card, Header, Modal, Toast, etc.
- Organisms: MoodSelector, ChatBubble, CrisisModal, etc.

FOR EACH COMPONENT:
1. Use Sequential Thinking MCP to plan
2. Query Context7/Exa for patterns
3. Review any related audit images
4. Use GlueStack UI patterns
5. Use Shopify Restyle (no hardcoded values)
6. Write tests first (TDD)

Start Sprint 2.1 (Atoms - Input Controls).
```

### Phase 3: Screens
```
Implement Phase 3 (Feature Screens) from docs/implementation.md.

FRONTEND ONLY - Build 158 screens with MOCK DATA ONLY.

CRITICAL FOR EACH SCREEN:
1. Find audit file: docs/ui-audit/batch-XX-*.md
2. Review ALL screenshots/images
3. Match design pixel-perfect
4. Apply fixes from REMEDIATION-GUIDE.md

USE:
- react-native-gifted-charts for ALL mood/sleep/stress charts
- Zustand for complex UI state
- Components from Phase 2

NO API CALLS - use placeholder data for:
- User profiles
- Mood entries
- Journal entries
- Chat messages
- Assessment results

Start Sprint 3.1 (Splash & Welcome Flow).
```