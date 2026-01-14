# Critical Design Issues - MUST FIX BEFORE IMPLEMENTATION

This document tracks critical issues identified during the UI audit that **must be resolved before development begins**.

---

## SEVERITY: CRITICAL - Mental Health Safety

### Issue #1: Inappropriate Placeholder Content (Screen 49 - ChatbotChatsList)

**Location**: `batch-10-home-completion-chatbot-start.md` - Screen 49
**Source**: `ui-designs/Dark-mode/AI Therapy Chatbot/AI_Therapy_Chatbot_Screen_03.png`

**Problem**: Chat conversation titles contain harmful placeholder content:

| Chat Title | Issue Type | Risk Level |
|------------|------------|------------|
| "Just wanna stop exist..." | Suicidal ideation | **CRITICAL** |
| "More Xans this Xmas..." | Drug abuse reference (Xanax) | **HIGH** |
| "Sh*tty Teacher at Uni..." | Profanity | **MEDIUM** |

**Additional Concern**: The chat "Just wanna stop exist..." has mood badge "Overjoyed" - this dangerous mismatch could normalize or trivialize suicidal thoughts.

**Required Action**:
- [ ] Replace all chat titles with appropriate, neutral placeholder content
- [ ] Ensure mood badges accurately reflect chat sentiment
- [ ] Review all mockups for similar issues

**Suggested Replacements**:
- "Feeling stressed about work..."
- "Need help with sleep issues..."
- "Dealing with exam anxiety..."

---

### Issue #2: Suicidal Content in Expression Analysis (Screen 39)

**Location**: `batch-08-mental-health-assessment-final.md` - Screen 39
**Source**: Mental Health Assessment Screen 14

**Problem**: Example text in the free-form expression input shows:
> "I don't want to be alive anymore. Just f***** kill me, doc."

**Risk**:
- Inappropriate for demo/placeholder content
- May be triggering for reviewers, developers, or users who see mockups
- Sets wrong tone for the feature

**Required Action**:
- [ ] Replace with neutral example text demonstrating the feature without harmful content
- [ ] Example: "I've been feeling overwhelmed lately with everything going on at work and home..."

---

## SEVERITY: HIGH - Copy/Branding Issues

### Issue #3: Inconsistent AI Naming

**Locations**: Multiple screens across batches

| Screen | Name Used |
|--------|-----------|
| Screen 47 | "Mindful AI Chatbot" |
| Screen 47 | "Doctor Freud AI" |
| Screen 39 | "Dr Freud.ai" |
| App branding | "freud.ai" |

**Required Action**:
- [ ] Establish single canonical name for AI assistant
- [ ] Update all screens to use consistent naming

---

### Issue #4: "You're suicidal" Messaging (Screen 25)

**Location**: `batch-05-profile-setup-completion.md` - Screen 25 (FreudScoreCritical)

**Problem**: Direct statement "You're suicidal" shown to users with critical scores.

**Risk**:
- Potentially harmful phrasing
- May not align with clinical best practices
- Legal/liability concerns

**Required Action**:
- [ ] Consult mental health professionals for appropriate messaging
- [ ] Consider softer phrasing like "You may be experiencing a crisis" or "We're concerned about you"
- [ ] Ensure crisis resources are prominently displayed

---

### Issue #8: Fictional Serial Killer Names as Therapists (Screens 53-54)

**Location**: `batch-11-ai-chatbot-conversations.md` - Screens 53, 54
**Source**: `ui-designs/Dark-mode/AI Therapy Chatbot/AI_Therapy_Chatbot_Screen_07.png`, `AI_Therapy_Chatbot_Screen_08.png`

**Problem**: Professional therapist referral cards use names of famous fictional serial killers:

| Name Used | Character Reference | Source |
|-----------|-------------------|--------|
| "Dr. Hannibal Lector" | Hannibal Lecter | "The Silence of the Lambs" |
| "Prof. Johann Liebert" | Johan Liebert | Anime "Monster" |

**Risk**:
- **CRITICAL** - Extremely inappropriate for a mental health application
- May be seen as mocking users seeking help
- Could be triggering for users familiar with these characters
- Unprofessional and potentially damaging to app credibility
- Legal concerns regarding use of copyrighted character names

**Required Action**:
- [ ] Replace all therapist names with generic professional placeholders
- [ ] Example: "Dr. Sarah Mitchell, PhD", "Dr. James Thompson, LMHC"
- [ ] Review all professional referral mockups for similar issues

---

### Issue #9: AI Diagnosing Medical Conditions (Screen 59)

**Location**: `batch-12-ai-chatbot-rich-media.md` - Screen 59
**Source**: `ui-designs/Dark-mode/🔒 AI Therapy Chatbot/AI_Therapy_Chatbot_Screen_13.png`

**Problem**: AI response states "it seems you have a Chronic Depression Disorder"

**Risk**:
- **CRITICAL** - AI should NEVER diagnose medical/psychiatric conditions
- Legal liability for practicing medicine without a license
- Could cause user distress or inappropriate self-treatment
- Violates medical ethics and potentially laws (varies by jurisdiction)
- Could lead to regulatory action against the app

**Required Action**:
- [ ] Replace ALL diagnostic language with observational language
- [ ] Example: "You seem to be experiencing feelings of sadness" instead of "you have Chronic Depression Disorder"
- [ ] Add prominent disclaimer that AI is not a medical professional
- [ ] Recommend consulting licensed professionals for any diagnosis
- [ ] Legal review of all AI response templates

---

### Issue #10: Inappropriate Image Filename (Screen 59)

**Location**: `batch-12-ai-chatbot-rich-media.md` - Screen 59
**Source**: `ui-designs/Dark-mode/🔒 AI Therapy Chatbot/AI_Therapy_Chatbot_Screen_13.png`

**Problem**: Placeholder filename "h4te_this_world.jpg" contains concerning content

**Risk**:
- Normalizes negative self-talk in mental health app context
- Inappropriate placeholder for any professional application
- May be triggering for vulnerable users
- Sets wrong tone for expression analysis feature

**Required Action**:
- [ ] Replace with neutral filename like "selfie_capture.jpg" or "expression_01.jpg"
- [ ] Review all placeholder filenames across designs

---

## SEVERITY: MEDIUM - Typos & Data Issues

### Issue #5: Spelling/Grammar Errors

| Screen | Error | Correction |
|--------|-------|------------|
| Screen 36 | "Social Withdrawl" | "Social Withdrawal" |
| Screen 37 | "Exremely" | "Extremely" |
| Screen 42 | "Postive" | "Positive" |
| Screen 43 | Date "2025/18/16" | Invalid date format |
| Screen 32 | "different place" | "different places" |
| Screen 3 | "passwrod" | "password" |
| Screen 68 | "throught" | "throughout" |

**Required Action**:
- [ ] Fix all typos in design files before implementation

---

### Issue #6: Fictional Medication Data (Screen 35)

**Location**: `batch-07-mental-health-assessment-continued.md` - Screen 35

**Problem**: Medication list includes "Axpelliarmus" (Harry Potter spell reference)

**Required Action**:
- [ ] Replace with real medication database
- [ ] Ensure all placeholder data is realistic

---

### Issue #7: Questionable Health Advice (Screen 44)

**Location**: `batch-09-home-mental-health-score.md` - Screen 44

**Problem**: "Binge Watching" listed as a mental health activity under Social Connection

**Required Action**:
- [ ] Review all AI suggestions with mental health professionals
- [ ] Ensure recommendations align with evidence-based practices

---

### Issue #11: Truncated/Incomplete Placeholder Text (Screen 62)

**Location**: `batch-13-ai-chatbot-voice-reports.md` - Screen 62
**Source**: `ui-designs/Dark-mode/🔒 AI Therapy Chatbot/AI_Therapy_Chatbot_Screen_16.png`

**Problem**: Journal entry preview shows incomplete/truncated placeholder text:
- "Surprise birt! gift from bes" (should be "Surprise birthday gift from best friend")
- "Depressiv" mood badge truncated (should be "Depressed")

**Required Action**:
- [ ] Complete all placeholder text entries
- [ ] Ensure mood badges display full text or use proper abbreviations
- [ ] Review all card previews for truncation issues

---

### Issue #12: Inappropriate File Formats in Health Report (Screen 64)

**Location**: `batch-13-ai-chatbot-voice-reports.md` - Screen 64
**Source**: `ui-designs/Dark-mode/🔒 AI Therapy Chatbot/AI_Therapy_Chatbot_Screen_18.png`

**Problem**: Health reports use inappropriate file formats and unrealistic sizes:

| File | Issue |
|------|-------|
| "Stress Level.rar" | RAR archive format inappropriate for health data |
| "Sleep Level.mp4" | 8GB video unrealistic for health report |
| File sizes (4kb, 29mb, 8gb) | Wildly inconsistent, unrealistic |

**Required Action**:
- [ ] Change file formats to appropriate types (PDF, CSV, JSON)
- [ ] Use realistic file sizes (typically KB to low MB)
- [ ] Clarify or remove video format for health reports
- [ ] Ensure dates are in chronological order

---

### Issue #13: Medically Inappropriate Biometric Placeholders (Screen 74)

**Location**: `batch-15-mood-tracker-continued.md` - Screen 74
**Source**: `ui-designs/Dark-mode/🔒 Mood Tracker/Mood_Tracker_Screen_08.png`

**Problem**: Biometric placeholder data shows medically dangerous values:

| Entry | Heart Rate | Blood Pressure | Medical Concern |
|-------|------------|----------------|-----------------|
| Depressed | 121 bpm | 180 sys | **HYPERTENSIVE CRISIS** (180+ is emergency) |
| Sad | 99 bpm | 150 sys | Stage 2 Hypertension |

**Risk**:
- Normalizes dangerous health values in a mental health context
- Could confuse users about healthy ranges
- May create false correlation between mood and dangerous BP levels
- Medical professionals may view this as irresponsible

**Required Action**:
- [ ] Use realistic, healthy biometric ranges as placeholders
- [ ] Normal heart rate: 60-100 bpm
- [ ] Normal blood pressure: 90-120 systolic
- [ ] Add disclaimer about biometric data interpretation

---

### Issue #14: Non-Chronological Date Order (Screen 74)

**Location**: `batch-15-mood-tracker-continued.md` - Screen 74
**Source**: `ui-designs/Dark-mode/🔒 Mood Tracker/Mood_Tracker_Screen_08.png`

**Problem**: Dates appear in order: Sep 12, Sep 11, Sep 9, Sep 10, Sep 8 (not chronological)

**Required Action**:
- [ ] If "newest first" sorting, dates should be: Sep 12, 11, 10, 9, 8
- [ ] Fix placeholder data to demonstrate intended sorting correctly

---

## Resolution Tracking

| Issue # | Status | Assigned To | Resolution Date |
|---------|--------|-------------|-----------------|
| 1 | OPEN | Design Team | - |
| 2 | OPEN | Design Team | - |
| 3 | OPEN | Product | - |
| 4 | OPEN | Clinical Review | - |
| 5 | OPEN | Design Team | - |
| 6 | OPEN | Design Team | - |
| 7 | OPEN | Clinical Review | - |
| 8 | OPEN | Design Team | - |
| 9 | OPEN | Legal + Clinical | - |
| 10 | OPEN | Design Team | - |
| 11 | OPEN | Design Team | - |
| 12 | OPEN | Design Team | - |
| 13 | OPEN | Clinical Review | - |
| 14 | OPEN | Design Team | - |

---

## Notes

- **DO NOT** implement screens with critical issues until resolved
- All mental health content should be reviewed by licensed professionals
- Crisis-related features require legal review before launch
