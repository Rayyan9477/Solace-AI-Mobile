# Critical Issues Remediation Guide

This document provides **specific replacement text and fixes** for all 42 issues identified during the UI audit. Design team should implement these changes before development begins.

---

## PRIORITY 1: CRITICAL SAFETY ISSUES (Fix Immediately)

These issues involve harmful content that could negatively impact users or create liability. **Do not proceed with development until these are resolved.**

---

### Issue #1: Inappropriate Placeholder Content (Screen 49)

**File**: `ui-designs/Dark-mode/🔒 AI Therapy Chatbot/AI_Therapy_Chatbot_Screen_03.png`

**Current Harmful Content:**
| Chat Title | Problem |
|------------|---------|
| "Just wanna stop exist..." | Suicidal ideation |
| "More Xans this Xmas..." | Drug abuse (Xanax) |
| "Sh*tty Teacher at Uni..." | Profanity |

**Replacement Text:**
```
REPLACE: "Just wanna stop exist..."
WITH:    "Feeling overwhelmed lately..."

REPLACE: "More Xans this Xmas..."
WITH:    "Holiday stress management..."

REPLACE: "Sh*tty Teacher at Uni..."
WITH:    "Dealing with academic pressure..."
```

**Additional Fix**: The chat "Just wanna stop exist..." shows mood badge "Overjoyed" - change to "Sad" or "Struggling" to match content appropriately.

---

### Issue #2: Suicidal Content in Expression Analysis (Screen 39)

**File**: `ui-designs/Dark-mode/🔒 Mental Health Assessment/Mental_Health_Assessment_Screen_14.png`

**Current Harmful Content:**
```
"I don't want to be alive anymore. Just f***** kill me, doc."
```

**Replacement Text:**
```
REPLACE WITH:
"I've been feeling overwhelmed lately with everything going on. Work has been stressful, and I'm having trouble sleeping. I just need someone to talk to about what I'm going through."
```

---

### Issue #16: Suicidal & Violent Content in Journal (Screen 84)

**File**: `ui-designs/Dark-mode/🔒 Mental Health Journal/Mental_Health_Journal_Screen_07.png`

**Current Harmful Content:**
```
Title: "I wanna end myself."
Content: "MY BF just got killed in a car accident. Whoever fucking do this will get..."
```

**Replacement Text:**
```
REPLACE TITLE: "I wanna end myself."
WITH:          "Reflecting on a difficult day"

REPLACE CONTENT: "MY BF just got killed..."
WITH:            "Had a really challenging conversation today. Feeling a mix of emotions and trying to process everything. Writing helps me sort through my thoughts."
```

---

### Issue #18: Crisis Alert Uses Triggering Language (Screen 86)

**File**: `ui-designs/Dark-mode/🔒 Mental Health Journal/Mental_Health_Journal_Screen_09.png`

**Current Problematic Content:**
```
Title: "Suicidal Mental Pattern Detected by AI!"
Body: "Our AI detected multiple account where you mentioned suicide on your journal."
```

**Replacement Text:**
```
REPLACE TITLE: "Suicidal Mental Pattern Detected by AI!"
WITH:          "We're Here to Support You"

REPLACE BODY: "Our AI detected multiple account where..."
WITH:         "We've noticed patterns in your recent entries that concern us. You don't have to face this alone. Support resources are available 24/7."
```

**Additional Requirement**: Ensure this modal prominently displays:
- 988 Suicide & Crisis Lifeline
- Crisis Text Line: Text HOME to 741741
- "Talk to Someone Now" button

---

### Issue #26: Crisis Content Without Intervention (Screen 128)

**File**: `ui-designs/Dark-mode/🔒 Community Support/Community_Support_Screen_10.png`

**Current Problem:**
User message "I don't think I can live like this anymore..." appears without crisis intervention being triggered.

**Required Fix:**
1. This message MUST trigger the crisis support modal (from Issue #18 fix)
2. AI response should include crisis resources, not just generic support
3. Add prominent "Need Help Now?" button visible in this chat

**Replacement AI Response:**
```
CURRENT: [generic supportive message]

REPLACE WITH:
"I hear that you're going through something really difficult right now. Your feelings are valid, and I want you to know that support is available.

If you're having thoughts of harming yourself, please reach out:
📞 988 Suicide & Crisis Lifeline (call or text)
💬 Crisis Text Line: Text HOME to 741741

Would you like me to connect you with someone who can help right now?"
```

---

## PRIORITY 2: HIGH SEVERITY ISSUES

---

### Issue #8: Serial Killer Names as Professionals

**Files Affected:**
- `AI_Therapy_Chatbot_Screen_07.png` (Screen 53)
- `AI_Therapy_Chatbot_Screen_08.png` (Screen 54)
- Multiple Mindful Resources screens

**Current Harmful Content:**
| Name Used | Character |
|-----------|-----------|
| "Dr. Hannibal Lector" | Serial killer from Silence of the Lambs |
| "Johann Liebert" | Serial killer from anime "Monster" |

**Replacement Names:**
```
REPLACE: "Dr. Hannibal Lector"
WITH:    "Dr. Sarah Mitchell, PhD, LMHC"

REPLACE: "Johann Liebert" / "Prof. Johann Liebert"
WITH:    "Dr. James Thompson, PsyD"

Alternative professional names to use:
- Dr. Emily Chen, LCSW
- Dr. Michael Roberts, PhD
- Dr. Rachel Kim, LMFT
- Dr. David Patel, MD
```

---

### Issue #9: AI Diagnosing Medical Conditions (Screen 59)

**File**: `ui-designs/Dark-mode/🔒 AI Therapy Chatbot/AI_Therapy_Chatbot_Screen_13.png`

**Current Problematic Content:**
```
"it seems you have a Chronic Depression Disorder"
```

**Replacement Text:**
```
REPLACE: "it seems you have a Chronic Depression Disorder"
WITH:    "Based on what you've shared, you seem to be experiencing persistent feelings of sadness and low energy. These feelings are valid, and it might be helpful to discuss them with a licensed mental health professional who can provide a proper evaluation."
```

**Add Disclaimer:**
```
"Note: I'm an AI assistant, not a medical professional. I cannot diagnose conditions. Please consult a licensed healthcare provider for any medical concerns."
```

---

### Issue #4: "You're suicidal" Messaging (Screen 25)

**File**: `ui-designs/Dark-mode/🔒 Profile Setup & Completion/Profile_Setup_&_Completion_Screen_11.png`

**Current Problematic Content:**
```
"You're suicidal"
```

**Replacement Text:**
```
REPLACE: "You're suicidal"
WITH:    "We're concerned about you"

OR:      "You may be experiencing a crisis"

OR:      "Your wellbeing matters to us"
```

---

### Issue #3: Inconsistent AI Naming

**Multiple Files Affected**

**Current Inconsistency:**
- "Mindful AI Chatbot"
- "Doctor Freud AI"
- "Dr Freud.ai"
- "freud.ai"

**Standardized Names:**
```
OFFICIAL BRAND: freud.ai
AI ASSISTANT NAME: Dr. Freud (or "Freud")
FULL REFERENCE: "Dr. Freud, your AI wellness companion"

Use consistently across all screens.
```

---

### Issue #27: Non-existent AI Model Reference (Screen 128)

**File**: `ui-designs/Dark-mode/🔒 Community Support/Community_Support_Screen_10.png`

**Current Content:**
```
"GPT-6"
```

**Replacement:**
```
REPLACE: "GPT-6"
WITH:    "Dr. Freud" or simply remove the model reference
```

---

## PRIORITY 3: MEDIUM SEVERITY ISSUES

---

### Issue #5: Spelling/Grammar Errors

| Screen | File | Error | Fix |
|--------|------|-------|-----|
| 36 | Mental_Health_Assessment_Screen_11.png | "Social Withdrawl" | "Social Withdrawal" |
| 37 | Mental_Health_Assessment_Screen_12.png | "Exremely" | "Extremely" |
| 42 | Home_Screen_02.png | "Postive" | "Positive" |
| 43 | Home_Screen_03.png | "2025/18/16" | "2025/06/16" (valid date) |
| 32 | Mental_Health_Assessment_Screen_07.png | "different place" | "different places" |
| 3 | Sign_In_&_Sign_Up_Screen_03.png | "passwrod" | "password" |
| 68 | Mood_Tracker_Screen_02.png | "throught" | "throughout" |

---

### Issue #6: Fictional Medication (Screen 35)

**Current:** "Axpelliarmus" (Harry Potter reference)

**Replace with real medications:**
- Sertraline
- Fluoxetine
- Escitalopram
- Venlafaxine
- Bupropion

---

### Issue #10: Inappropriate Filename (Screen 59)

**Current:** "h4te_this_world.jpg"

**Replace with:** "selfie_capture.jpg" or "expression_photo.jpg"

---

### Issue #22: "Suicide" as Browse Category (Screen 120)

**Current:** "Suicide" as a browsable filter category

**Replace with:** "Crisis Support" or "Need Help"

---

### Issue #23: Real Person Names (Screen 124)

**Current:** "Joe Biden", "John Cena"

**Replace with:** Generic usernames like "Alex_M", "Sam_T", "Jordan123"

---

### Issue #24: Anime Character Names (Multiple Screens)

**Current:** "Shinomiya Kaguya", "Makima D. Smith"

**Replace with:** "Sarah Johnson", "Michael Chen", "Emma Williams"

---

### Issue #34: Minor Age Placeholder (Screen 141)

**Current:** "Age: 17y"

**Replace with:** "Age: 28y" (adult age)

---

### Issue #35: Weight Inconsistency (Screens 141, 143)

**Problem:** Profile shows 48kg, slider shows 90kg

**Fix:** Use consistent value across screens (e.g., 65kg)

---

### Issue #38: Incorrect Language Codes (Screen 147)

| Current | Fix |
|---------|-----|
| "Italian (IL)" | "Italian (IT)" |
| "American (US)" | "English (US)" |
| "Irish (IR)" | "Irish (IE)" |
| "European (EU)" | Remove this entry |
| "Japan (JP)" | "Japanese (JA)" |

---

### Issue #39: Detroit in Texas (Screen 148)

**Current:** "North Detroit, Texas"

**Fix:** Either:
- Use real address: "Detroit, MI 48201"
- Use clearly fictional: "123 Wellness Street, Mindful City, MC 12345"

---

### Issue #40: Phone Shows Address (Screen 148)

**Current:**
```
Our Phone Number
221 Sherlock St,
Great Boolean Ave
London, UK
```

**Replace with:**
```
Our Phone Number
+1 (800) 555-MIND
+44 20 7946 0958
```

---

## PRIORITY 4: LOW SEVERITY (Typos & Grammar)

| Issue # | Screen | Current | Fix |
|---------|--------|---------|-----|
| 11 | 62 | "Surprise birt! gift from bes" | "Surprise birthday gift from best friend" |
| 17 | 80 | "Automaticly create ealth" | "Automatically create health" |
| 19 | 96 | "2025/18/16" | "2025/01/16" |
| 19 | 96 | "Filter Mood (25)" | "Filter Sleep (25)" |
| 20 | 99 | "will impacts" | "will impact" |
| 21 | 95 | "heatbeat" | "heartbeat" |
| 25 | 123 | "posted a post" | "Your post has been published!" |
| 28 | 125, 133 | "25 January, 2052" | "15 January, 2025" |
| 29 | 131 | "found.404 Error" | "found. 404 Error" |
| 31 | 136 | "9 daily journal" | "9 daily journals" |
| 32 | 138 | "Decresased" | "Decreased" |
| 33 | 139 | "mediation session" | "meditation session" |
| 33 | 139 | "Pelase do" | "Please do" |
| 36 | 144 | "check for sounds" | "play notification sounds" |
| 37 | 145 | "by by visiting" | "by visiting" |
| 41 | 153 | "Which of the area" | "Which area" |
| 42 | 156 | "seems to error" | "encountered an error" |

---

## Implementation Checklist

### Before Development Starts:
- [ ] All PRIORITY 1 (Critical Safety) issues resolved
- [ ] Clinical review of crisis messaging complete
- [ ] Legal review of AI disclaimer language complete

### Before QA Testing:
- [ ] All PRIORITY 2 (High) issues resolved
- [ ] Branding consistency verified

### Before Launch:
- [ ] All PRIORITY 3-4 issues resolved
- [ ] Full copyedit pass on all text
- [ ] Accessibility review complete

---

## Sign-off Required

| Review Type | Reviewer | Date | Approved |
|-------------|----------|------|----------|
| Clinical Safety | [Mental Health Professional] | | ☐ |
| Legal Compliance | [Legal Team] | | ☐ |
| Brand Consistency | [Product/Design Lead] | | ☐ |
| Copy Review | [Copywriter/Editor] | | ☐ |

---

*Document generated from UI Audit - 42 issues identified across 158 screens*
