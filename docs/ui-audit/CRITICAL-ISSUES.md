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

### Issue #8: Fictional Serial Killer Names as Therapists/Professionals (Multiple Screens)

**Locations**:
- `batch-11-ai-chatbot-conversations.md` - Screens 53, 54 (Therapist referrals)
- `batch-23-mindful-hours-final-resources-start.md` - Screens 112, 114 (Course instructor)
- `batch-24-resources-final-community-start.md` - Screen 115 (Article author), Screen 116 (Course instructor)

**Sources**: Multiple design files across AI Therapy Chatbot, Mindful Resources

**Problem**: Names of famous fictional serial killers used as placeholder professional names throughout the app:

| Name Used | Character Reference | Source | Locations Found |
|-----------|-------------------|--------|-----------------|
| "Dr. Hannibal Lector" | Hannibal Lecter | "The Silence of the Lambs" | Screens 53, 54, 112, 114, 116 |
| "Johann Liebert" / "Prof. Johann Liebert" | Johan Liebert | Anime "Monster" | Screens 53, 54, 115 |

**Risk**:
- **CRITICAL** - Extremely inappropriate for a mental health application
- May be seen as mocking users seeking help
- Could be triggering for users familiar with these characters
- Unprofessional and potentially damaging to app credibility
- Legal concerns regarding use of copyrighted character names
- Pattern suggests systemic design issue with placeholder content

**Required Action**:
- [ ] Replace ALL instances of these names across the entire app
- [ ] Use generic professional placeholders: "Dr. Sarah Mitchell, PhD", "Dr. James Thompson, LMHC"
- [ ] Audit ALL mockups for fictional character names in professional contexts
- [ ] Establish content guidelines for placeholder names in design files

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

### Issue #15: Journal Data Inconsistency (Screen 78)

**Location**: `batch-16-mood-tracker-final-journal-start.md` - Screen 78
**Source**: `ui-designs/Dark-mode/🔒 Mental Health Journal/Mental_Health_Journal_Screen_01.png`

**Problem**: Statistics show conflicting journal entry counts:

| Display | Value | Location |
|---------|-------|----------|
| "34 Journals" | 34 | Subheading text |
| Skipped + Negative + Positive | 81 + 32 + 44 = 157 | Statistics cards |

**Risk**:
- Confuses users about their actual usage
- Undermines trust in data accuracy
- Makes it unclear what "Journals" vs individual entries means

**Required Action**:
- [ ] Clarify terminology: "Journals" vs "Entries" vs "Days"
- [ ] Ensure all numbers are consistent and mathematically correct
- [ ] Consider: 34 journals containing 157 total entries? If so, make this clear in UI

---

## SEVERITY: CRITICAL - Mental Health Safety (Continued)

### Issue #16: Suicidal & Violent Placeholder Content in Journal Timeline (Screen 84)

**Location**: `batch-17-journal-continued.md` - Screen 84
**Source**: `ui-designs/Dark-mode/🔒 Mental Health Journal/Mental_Health_Journal_Screen_07.png`

**Problem**: Journal entry placeholders contain extremely harmful content:

| Entry Title | Content Preview | Issue Type |
|-------------|-----------------|------------|
| "I wanna end myself." | "MY BF just got killed in a car accident. Whoever fucking do this will get..." | **Suicidal ideation + Violence + Profanity** |

**Risk**:
- **CRITICAL** - Suicidal ideation in mental health app mockups is deeply inappropriate
- Violent traumatic content combined with suicidal language
- Profanity ("fucking") unprofessional in design assets
- May be triggering for developers, QA, reviewers working on the project
- Sets completely wrong tone for a feature meant to support mental wellness
- Combined with Issue #1 and #2, shows pattern of harmful placeholder content

**Required Action**:
- [ ] **IMMEDIATELY** replace all harmful journal entry placeholders
- [ ] Use neutral, supportive example content
- [ ] Example replacements:
  - "I wanna end myself" → "Reflecting on a difficult day"
  - Violent content → "Processing some challenging news I received today"
- [ ] Audit ALL journal-related mockups for similar issues
- [ ] Establish content guidelines for placeholder text in mental health apps

---

### Issue #17: Typos in Journal Type Selector (Screen 80)

**Location**: `batch-17-journal-continued.md` - Screen 80
**Source**: `ui-designs/Dark-mode/🔒 Mental Health Journal/Mental_Health_Journal_Screen_03.png`

**Problem**: Voice Journal description contains multiple typos:

| Error | Correction |
|-------|------------|
| "Automaticly" | "Automatically" |
| "ealth" | "health" |

Full text: "Automaticly create ealth journal by Voice & Face detection with AI"
Corrected: "Automatically create health journal by Voice & Face detection with AI"

**Required Action**:
- [ ] Fix typos in design file
- [ ] Also fix capitalization inconsistency: "Voice Journal" vs "Text journal"

---

### Issue #18: Crisis Alert Uses Triggering Language (Screen 86)

**Location**: `batch-18-journal-final-sleep-start.md` - Screen 86
**Source**: `ui-designs/Dark-mode/🔒 Mental Health Journal/Mental_Health_Journal_Screen_09.png`

**Problem**: The crisis support alert modal uses direct, potentially triggering language:

| Element | Current Text | Issue |
|---------|-------------|-------|
| Alert Title | "Suicidal Mental Pattern Detected by AI!" | Too direct, uses word "suicidal" prominently |
| Alert Body | "Our AI detected multiple account where you mentioned suicide on your journal." | Uses "suicide" again, grammatically incorrect ("account" should be "accounts" or "instances") |

**Risk**:
- **CRITICAL** - Alert language itself can be triggering for users in crisis
- Using clinical terms like "suicidal" in large, bold text may worsen mental state
- The feature is valuable but execution needs professional refinement
- Does not follow crisis intervention best practices for gentle, supportive communication
- Grammar errors undermine professionalism and trust

**Required Action**:
- [ ] **IMMEDIATELY** reword alert with gentle, supportive language
- [ ] Remove direct use of "suicidal" and "suicide" from prominent display
- [ ] Fix grammar: "multiple account" → "multiple instances" or "patterns"
- [ ] Review all crisis-related language with licensed mental health professionals
- [ ] Ensure compliance with crisis intervention best practices
- [ ] Consider softer alternatives:
  - Title: "We noticed you might be struggling" or "We're here to support you"
  - Body: "We've noticed patterns in your recent entries that concern us. Support resources are available 24/7."
- [ ] Legal and clinical review required before implementation

**Note**: The crisis detection feature itself is valuable and appropriate for a mental health app. The issue is specifically with the language used in the alert, not the feature concept.

---

## SEVERITY: MEDIUM - Data & Content Issues

### Issue #19: Invalid Date and Wrong Button Label (Screen 96)

**Location**: `batch-20-sleep-final-stress-start.md` - Screen 96
**Source**: `ui-designs/Dark-mode/🔒 Sleep Quality/Sleep_Quality_Screen_10.png`

**Problem**: Filter Sleep bottom sheet contains invalid date and wrong label:

| Element | Current Value | Issue |
|---------|---------------|-------|
| Date fields | "2025/18/16" | Invalid date - no month 18 exists |
| Apply button | "Filter Mood (25)" | Wrong feature name - should be "Filter Sleep" |

**Required Action**:
- [ ] Fix date format to valid date (e.g., "2025/01/16" or "2025/06/16")
- [ ] Change button label from "Filter Mood" to "Filter Sleep"

---

### Issue #20: Grammar Error and Truncated Labels (Screen 99)

**Location**: `batch-20-sleep-final-stress-start.md` - Screen 99
**Source**: `ui-designs/Dark-mode/🔒 Stress Management/Stress_Management_Screen_03.png`

**Problem**: Grammar error in subtitle and truncated bubble labels:

| Issue | Current | Correct |
|-------|---------|---------|
| Grammar | "will impacts" | "will impact" |
| Truncation | "nship" | "Relationship" |
| Truncation | "Fin" | "Finance" |

**Full text**:
- Current: "Our AI will decide how your stressor will impacts your life in general."
- Correct: "Our AI will decide how your stressor will impact your life in general."

**Required Action**:
- [ ] Fix grammar: "impacts" → "impact"
- [ ] Ensure all bubble labels are fully visible (may need layout adjustment)

---

### Issue #21: Typo "heatbeat" (Screen 95)

**Location**: `batch-20-sleep-final-stress-start.md` - Screen 95
**Source**: `ui-designs/Dark-mode/🔒 Sleep Quality/Sleep_Quality_Screen_09.png`

**Problem**: Typo in Heartbeat Irregularity suggestion description:

- Current: "We detected **heatbeat** deviation"
- Correct: "We detected **heartbeat** deviation"

**Required Action**:
- [ ] Fix typo: "heatbeat" → "heartbeat"

---

### Issue #22: "Suicide" as Community Browse Category (Screen 120)

**Location**: `batch-25-community-support-continued.md` - Screen 120
**Source**: `ui-designs/Dark-mode/🔒 Community Support/Community_Support_Screen_02.png`

**Problem**: "Suicide" appears as a browsable category filter in the community feed, alongside "Trending" and "Stress".

**Risk**:
- May need clinical review for appropriate presentation
- Could be triggering for some users
- Unclear if this is for support-seeking or content discovery
- Different from crisis detection (Issue #18) - this is user-driven browsing

**Required Action**:
- [ ] Clinical review of category appropriateness
- [ ] Consider renaming to "Crisis Support" or "Need Help"
- [ ] Ensure proper content moderation in this category
- [ ] Add warnings or support resources when browsing

**Note**: Having a space for users to seek support around suicidal thoughts is valuable, but the presentation and moderation approach needs professional guidance.

---

### Issue #23: Real Person Names as Placeholders (Screen 124)

**Location**: `batch-25-community-support-continued.md` - Screen 124
**Source**: `ui-designs/Dark-mode/🔒 Community Support/Community_Support_Screen_06.png`

**Problem**: Real celebrity names used as placeholder usernames in notification examples:

| Name Used | Issue |
|-----------|-------|
| "Joe Biden" | Current US President |
| "John Cena" | Celebrity/Wrestler |

**Risk**:
- Could imply endorsement or association
- Unprofessional in design assets
- Should use clearly fictional names

**Required Action**:
- [ ] Replace with generic usernames (e.g., "user_123", "Alex M", "Sam T")
- [ ] Audit all mockups for real person name usage

---

### Issue #24: Anime Character Names as Users (Screens 120, 122)

**Location**: `batch-25-community-support-continued.md` - Screens 120, 122
**Source**: Community Support screens 02 and 04

**Problem**: Anime character names used as placeholder usernames:

| Name Used | Character Reference | Source |
|-----------|-------------------|--------|
| "Shinomiya Kaguya" | Kaguya Shinomiya | "Kaguya-sama: Love is War" |
| "Makima D. Smith" | Makima | "Chainsaw Man" (antagonist) |

**Risk**:
- Copyright concerns with copyrighted character names
- Makima is a villain/antagonist character - inappropriate association
- Less severe than Issue #8 but still problematic pattern

**Required Action**:
- [ ] Replace with generic placeholder names
- [ ] Establish guidelines for placeholder names in designs

---

### Issue #25: Redundant Grammar in Success Modal (Screen 123)

**Location**: `batch-25-community-support-continued.md` - Screen 123
**Source**: `ui-designs/Dark-mode/🔒 Community Support/Community_Support_Screen_05.png`

**Problem**: Success message contains redundant phrasing:
- Current: "You have successfully posted a post."
- Issue: "posted a post" is grammatically awkward and redundant

**Required Action**:
- [ ] Change to: "Your post has been published!" or "Successfully shared!"

---

## SEVERITY: CRITICAL - Safety

### Issue #26: Crisis Content Without Intervention (Screen 128)

**Location**: `batch-26-community-final-search-start.md` - Screen 128
**Source**: `ui-designs/Dark-mode/🔒 Community Support/Community_Support_Screen_10.png`

**Problem**: User message "I don't think I can live like this anymore..." appears in chat without any visible crisis intervention or support resources being triggered.

**Risk**:
- **CRITICAL** - This is exactly the type of content that should trigger immediate crisis response
- Design shows regular chat continuing as if nothing concerning was said
- Contradicts Issue #18 where crisis detection was shown (but with poor wording)
- The AI response shows generic supportive text but NO crisis resources
- Could result in user harm if crisis content isn't handled appropriately

**Required Action**:
- [ ] **IMMEDIATELY** show crisis intervention for this message type
- [ ] Display crisis support modal with emergency resources
- [ ] Provide hotline numbers (988 Suicide & Crisis Lifeline)
- [ ] Add text crisis options (Crisis Text Line: Text HOME to 741741)
- [ ] This is legally and ethically essential for any mental health app
- [ ] Review with clinical team before implementation

**Note**: This is one of the most serious issues identified - a mental health app MUST have robust crisis detection and response. This screen shows a critical failure in that system.

---

### Issue #27: Non-existent AI Model Reference (Screen 128)

**Location**: `batch-26-community-final-search-start.md` - Screen 128
**Source**: `ui-designs/Dark-mode/🔒 Community Support/Community_Support_Screen_10.png`

**Problem**: Chat header shows "GPT-6" which:
1. Does not exist as of 2025
2. Is OpenAI branding, not freud.ai
3. Creates confusion about the AI powering the app
4. May create false expectations about AI capabilities

**Required Action**:
- [ ] Remove GPT reference entirely
- [ ] Use own branding: "Freud AI" or "Doctor Freud"
- [ ] If showing model info, use generic terms or own nomenclature

---

### Issue #28: Future Date Placeholder (Screen 125)

**Location**: `batch-26-community-final-search-start.md` - Screen 125
**Source**: `ui-designs/Dark-mode/🔒 Community Support/Community_Support_Screen_07.png`

**Problem**: Filter date shows "25 January, 2052" - a placeholder date 27 years in the future.

**Required Action**:
- [ ] Use realistic placeholder date
- [ ] Example: "15 January, 2025" or dynamic "Today"

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
| 15 | OPEN | Design Team | - |
| 16 | OPEN | Design Team | - |
| 17 | OPEN | Design Team | - |
| 18 | OPEN | Clinical Review | - |
| 19 | OPEN | Design Team | - |
| 20 | OPEN | Design Team | - |
| 21 | OPEN | Design Team | - |
| 22 | OPEN | Clinical Review | - |
| 23 | OPEN | Design Team | - |
| 24 | OPEN | Design Team | - |
| 25 | OPEN | Design Team | - |
| 26 | OPEN | Clinical + Dev | - |
| 27 | OPEN | Design Team | - |
| 28 | OPEN | Design Team | - |

---

## Notes

- **DO NOT** implement screens with critical issues until resolved
- All mental health content should be reviewed by licensed professionals
- Crisis-related features require legal review before launch
