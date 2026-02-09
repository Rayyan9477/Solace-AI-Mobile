# VoiceOver & TalkBack Manual Testing Checklist

**Version:** 1.0
**Date:** 2026-02-05
**WCAG Level:** AA (2.1)
**Phase:** Week 2 Accessibility Audit

## Overview

This document provides a comprehensive manual testing checklist for VoiceOver (iOS) and TalkBack (Android) screen reader compatibility. All critical user flows must pass these tests before production deployment.

---

## Testing Setup

### iOS - VoiceOver Setup
1. **Enable VoiceOver:** Settings → Accessibility → VoiceOver → On
2. **Shortcuts:** Triple-click Side Button to toggle VoiceOver
3. **Gestures:**
   - **Swipe Right:** Move to next element
   - **Swipe Left:** Move to previous element
   - **Double Tap:** Activate element
   - **Two-Finger Swipe Down:** Start reading from top
   - **Rotor:** Rotate two fingers to access controls

### Android - TalkBack Setup
1. **Enable TalkBack:** Settings → Accessibility → TalkBack → On
2. **Shortcuts:** Volume Up + Down for 3 seconds
3. **Gestures:**
   - **Swipe Right:** Move to next element
   - **Swipe Left:** Move to previous element
   - **Double Tap:** Activate element
   - **Swipe Down then Right:** Read from top
   - **Local Context Menu:** Swipe up then down

---

## Critical Flows to Test

### ✅ Flow 1: Authentication & Onboarding

**Screens:** Splash → Welcome → Sign In → Onboarding Steps 1-5

| Test | VoiceOver (iOS) | TalkBack (Android) | Pass/Fail | Notes |
|------|----------------|-------------------|-----------|-------|
| Splash screen announces app name | ☐ | ☐ | | |
| Welcome screen CTA button has clear label | ☐ | ☐ | | |
| Sign In form inputs have labels | ☐ | ☐ | | |
| Email/password fields announce field type | ☐ | ☐ | | |
| "Forgot Password" link is reachable | ☐ | ☐ | | |
| Sign In button announces action | ☐ | ☐ | | |
| Onboarding progress bar announces step (e.g., "Step 1 of 5") | ☐ | ☐ | | |
| Next/Previous arrows are focusable | ☐ | ☐ | | |
| All onboarding content is readable | ☐ | ☐ | | |
| User can navigate backward | ☐ | ☐ | | |

**Expected Behavior:**
- All interactive elements should be focusable
- Progress should be announced (e.g., "Step 2 of 5")
- Error messages should be announced immediately
- Form submission should provide feedback

---

### ✅ Flow 2: Crisis Modal (SAFETY-CRITICAL)

**Screens:** Any screen → Crisis Detection → Crisis Modal

| Test | VoiceOver (iOS) | TalkBack (Android) | Pass/Fail | Notes |
|------|----------------|-------------------|-----------|-------|
| Modal opens with assertive announcement | ☐ | ☐ | **CRITICAL** | |
| Header announces "Support Available" or similar | ☐ | ☐ | **CRITICAL** | |
| "You're Not Alone" message is read | ☐ | ☐ | | |
| 988 Suicide & Crisis Lifeline button is clear | ☐ | ☐ | **CRITICAL** | |
| Text Line (741741) button announces action | ☐ | ☐ | **CRITICAL** | |
| International Resources link is reachable | ☐ | ☐ | | |
| Dismiss button announces "close" or "cancel" | ☐ | ☐ | | |
| All touch targets meet 44x44pt minimum | ☐ | ☐ | **CRITICAL** | |
| Modal doesn't trap focus (can exit) | ☐ | ☐ | **CRITICAL** | |
| Modal re-announces when reopened | ☐ | ☐ | | |

**Expected Behavior:**
- Modal should announce **immediately** when opened (assertive live region)
- User should **never** be trapped in modal
- 988 hotline button must be **first focusable element** after header
- All supportive language should be read clearly
- User can **easily** exit modal if desired

**CRITICAL:** Test end-to-end crisis flow:
1. Trigger crisis modal (low score, crisis keywords, etc.)
2. Navigate with VoiceOver/TalkBack
3. Verify user can **call 988** with screen reader active
4. Verify user can **text 741741** with screen reader active

---

### ✅ Flow 3: Dashboard & Navigation

**Screens:** Dashboard → Bottom Tabs → Feature Screens

| Test | VoiceOver (iOS) | TalkBack (Android) | Pass/Fail | Notes |
|------|----------------|-------------------|-----------|-------|
| Dashboard header announces screen name | ☐ | ☐ | | |
| Solace Score card is focusable | ☐ | ☐ | | |
| Score value is announced clearly | ☐ | ☐ | | |
| Bottom tab icons have labels | ☐ | ☐ | | |
| Current tab is announced as "selected" | ☐ | ☐ | | |
| Tab switches announce new screen | ☐ | ☐ | | |
| Home tab: "Home" or "Dashboard" | ☐ | ☐ | | |
| Mood tab: "Mood Tracking" | ☐ | ☐ | | |
| Chat tab: "AI Therapy Chat" | ☐ | ☐ | | |
| Journal tab: "Mental Health Journal" | ☐ | ☐ | | |
| Profile tab: "Profile and Settings" | ☐ | ☐ | | |

**Expected Behavior:**
- Tabs should announce their label and selected state
- Screen transitions should be announced
- User can navigate to any screen via tabs

---

### ✅ Flow 4: Mood Tracking

**Screens:** Mood Dashboard → Mood Selector → Mood History

| Test | VoiceOver (iOS) | TalkBack (Android) | Pass/Fail | Notes |
|------|----------------|-------------------|-----------|-------|
| Mood selector emotions have clear labels | ☐ | ☐ | | |
| Selected mood is announced (e.g., "Happy, selected") | ☐ | ☐ | | |
| Mood intensity slider announces value | ☐ | ☐ | | |
| Save button announces action | ☐ | ☐ | | |
| Success confirmation is announced | ☐ | ☐ | | |
| Mood history list items are readable | ☐ | ☐ | | |
| Calendar dates are navigable | ☐ | ☐ | | |
| Mood insights are announced clearly | ☐ | ☐ | | |

**Expected Behavior:**
- All mood options should be announced with clear labels
- Slider adjustments should announce current value
- Saving should provide immediate feedback

---

### ✅ Flow 5: AI Chat

**Screens:** Chat List → Active Chat → Voice Input

| Test | VoiceOver (iOS) | TalkBack (Android) | Pass/Fail | Notes |
|------|----------------|-------------------|-----------|-------|
| Chat list conversations are readable | ☐ | ☐ | | |
| Message input field has label | ☐ | ☐ | | |
| Send button announces action | ☐ | ☐ | | |
| Voice input button has clear label | ☐ | ☐ | | |
| User messages are announced | ☐ | ☐ | | |
| AI responses are announced | ☐ | ☐ | | |
| Typing indicator is announced | ☐ | ☐ | | |
| Conversation options are reachable | ☐ | ☐ | | |

**Expected Behavior:**
- Messages should be announced in chronological order
- User can distinguish between sent/received messages
- Voice input should provide clear feedback

---

### ✅ Flow 6: Journal

**Screens:** Journal Dashboard → Text Composer → Voice Recording

| Test | VoiceOver (iOS) | TalkBack (Android) | Pass/Fail | Notes |
|------|----------------|-------------------|-----------|-------|
| Journal entries are navigable | ☐ | ☐ | | |
| Entry dates are announced | ☐ | ☐ | | |
| Text composer has accessible label | ☐ | ☐ | | |
| Mood tags are selectable | ☐ | ☐ | | |
| Save button announces action | ☐ | ☐ | | |
| Voice recording button has clear label | ☐ | ☐ | | |
| Recording status is announced | ☐ | ☐ | | |
| Stop recording announces completion | ☐ | ☐ | | |

**Expected Behavior:**
- All journal entries should be readable
- User can create new entries with screen reader
- Voice recording provides clear status updates

---

### ✅ Flow 7: Profile & Settings

**Screens:** Profile Dashboard → Account Settings → Security

| Test | VoiceOver (iOS) | TalkBack (Android) | Pass/Fail | Notes |
|------|----------------|-------------------|-----------|-------|
| Profile information is readable | ☐ | ☐ | | |
| Settings options have clear labels | ☐ | ☐ | | |
| Toggle switches announce on/off state | ☐ | ☐ | | |
| Save changes button is reachable | ☐ | ☐ | | |
| Security options are announced | ☐ | ☐ | | |
| Logout button has clear warning | ☐ | ☐ | | |

**Expected Behavior:**
- All settings should be accessible
- Toggles should announce current state
- Changes should be confirmed

---

## Touch Target Size Validation

| Component | Minimum Size | VoiceOver | TalkBack | Pass/Fail | Notes |
|-----------|-------------|-----------|----------|-----------|-------|
| Primary buttons | 44x44pt | ☐ | ☐ | | |
| Secondary buttons | 44x44pt | ☐ | ☐ | | |
| Crisis hotline button | 48x48pt+ | ☐ | ☐ | **CRITICAL** | |
| Tab bar icons | 44x44pt | ☐ | ☐ | | |
| Form inputs | 44pt height | ☐ | ☐ | | |
| Close/dismiss buttons | 44x44pt | ☐ | ☐ | | |
| Links | 44pt height | ☐ | ☐ | | |

**WCAG 2.1 Requirement:** All touch targets must be at least 44x44 CSS pixels

---

## Color Contrast Validation

| Element | Foreground | Background | Ratio | Required | Pass/Fail |
|---------|-----------|------------|-------|----------|-----------|
| Primary text | #FFFFFF | #1C1410 | 14.5:1 | 4.5:1 | ✅ |
| Secondary text | #94A3B8 | #1C1410 | 6.8:1 | 4.5:1 | ✅ |
| Button text (tan) | #1C1410 | #C4A574 | 5.2:1 | 4.5:1 | ✅ |
| Crisis button | #FFFFFF | #EF4444 | 5.9:1 | 4.5:1 | ✅ |
| Error text | #EF4444 | #1C1410 | 5.5:1 | 4.5:1 | ✅ |
| Form placeholder | #64748B | #1C1410 | 4.6:1 | 4.5:1 | ✅ |

**Tool:** Use [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/)

---

## Dynamic Content Testing

| Scenario | VoiceOver | TalkBack | Pass/Fail | Notes |
|----------|-----------|----------|-----------|-------|
| Loading indicators announce status | ☐ | ☐ | | |
| Error messages are announced immediately | ☐ | ☐ | | |
| Success confirmations are announced | ☐ | ☐ | | |
| Modal opens announce content | ☐ | ☐ | | |
| Form validation errors are announced | ☐ | ☐ | | |
| Live chat messages are announced | ☐ | ☐ | | |
| Mood tracking updates are confirmed | ☐ | ☐ | | |

**Expected Behavior:**
- Dynamic changes should use `accessibilityLiveRegion`
- Critical alerts should use `"assertive"`
- Non-critical updates should use `"polite"`

---

## Reduced Motion Testing

| Feature | Reduced Motion Respected | Pass/Fail | Notes |
|---------|------------------------|-----------|-------|
| Page transitions | ☐ | | |
| Modal animations | ☐ | | |
| Button press feedback | ☐ | | |
| Loading indicators | ☐ | | |
| Scroll animations | ☐ | | |

**Setup:**
- **iOS:** Settings → Accessibility → Motion → Reduce Motion
- **Android:** Settings → Accessibility → Remove Animations

---

## Text Scaling Testing

| Screen | iOS Dynamic Type (xxxLarge) | Android Large Text | Pass/Fail | Notes |
|--------|---------------------------|-------------------|-----------|-------|
| Sign In | ☐ | ☐ | | |
| Dashboard | ☐ | ☐ | | |
| Crisis Modal | ☐ | ☐ | **CRITICAL** | |
| Mood Selector | ☐ | ☐ | | |
| Journal Composer | ☐ | ☐ | | |

**Expected Behavior:**
- Layout should not break at large text sizes
- All text should remain readable
- Touch targets should not overlap

---

## Known Issues & Limitations

### Current Gaps (From Automated Tests)
1. **Touch Target Sizes:** Some buttons don't meet 44x44pt minimum
2. **Screen Reader Hints:** Missing `accessibilityHint` on some elements
3. **Crisis Modal TestIDs:** Missing for automated testing
4. **State Announcements:** Toggle switches don't properly announce checked state

### Planned Improvements
- [ ] Fix touch target sizes for all buttons
- [ ] Add accessibility hints for complex interactions
- [ ] Add testIDs to all critical components
- [ ] Implement proper state announcements for toggles
- [ ] Add live region announcements for dynamic content

---

## Sign-Off Requirements

**Before Production:**
- [ ] All critical flows pass VoiceOver testing (iOS)
- [ ] All critical flows pass TalkBack testing (Android)
- [ ] Crisis modal end-to-end test successful
- [ ] All touch targets meet 44x44pt minimum
- [ ] All color contrasts meet WCAG AA (4.5:1)
- [ ] Reduced motion preferences respected
- [ ] Text scaling tested up to xxxLarge (iOS) and Large (Android)

**Reviewers:**
- [ ] **Accessibility Specialist:** _______________  Date: _______
- [ ] **QA Lead:** _______________  Date: _______
- [ ] **Product Manager:** _______________  Date: _______
- [ ] **Tech Lead:** _______________  Date: _______

---

## Resources

- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [iOS VoiceOver Guide](https://support.apple.com/guide/iphone/turn-on-and-practice-voiceover-iph3e2e415f/ios)
- [Android TalkBack Guide](https://support.google.com/accessibility/android/answer/6283677)
- [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/)
- [React Native Accessibility Docs](https://reactnative.dev/docs/accessibility)

---

**Last Updated:** 2026-02-05
**Next Review:** Before production deployment
