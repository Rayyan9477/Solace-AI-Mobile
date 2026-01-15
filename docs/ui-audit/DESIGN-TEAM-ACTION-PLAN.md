# Design Team Action Plan

## Overview

This document outlines the step-by-step process for the design team to resolve all 42 identified issues before development can begin.

**Status**: UI Audit Complete (158 screens documented)
**Issues Identified**: 42 total
**Blocking Development**: Yes - Critical safety issues must be resolved first

---

## Step 1: Review Documentation

### Required Reading (in order):

1. **[REMEDIATION-GUIDE.md](./REMEDIATION-GUIDE.md)** ← START HERE
   - Contains exact replacement text for all 42 issues
   - Organized by priority (P1 Critical → P4 Low)
   - Copy-paste ready fixes

2. **[CRITICAL-ISSUES.md](./CRITICAL-ISSUES.md)**
   - Detailed context for each issue
   - Risk assessment and rationale
   - Resolution tracking table

3. **[README.md](./README.md)**
   - Full screen inventory
   - Batch documentation links
   - Component library reference

---

## Step 2: Priority 1 - Critical Safety Issues (IMMEDIATE)

These 5 issues **MUST** be fixed before any development begins.

### Issue #1: Suicidal/Drug Content in Chat Titles
| Field | Value |
|-------|-------|
| **File** | `ui-designs/Dark-mode/🔒 AI Therapy Chatbot/AI_Therapy_Chatbot_Screen_03.png` |
| **Screen** | 49 |
| **Action** | Replace 3 chat titles with provided neutral alternatives |
| **Estimated Time** | 15 minutes |

### Issue #2: Suicidal Text in Expression Analysis
| Field | Value |
|-------|-------|
| **File** | `ui-designs/Dark-mode/🔒 Mental Health Assessment/Mental_Health_Assessment_Screen_14.png` |
| **Screen** | 39 |
| **Action** | Replace example text with provided supportive alternative |
| **Estimated Time** | 10 minutes |

### Issue #16: Violent Journal Content
| Field | Value |
|-------|-------|
| **File** | `ui-designs/Dark-mode/🔒 Mental Health Journal/Mental_Health_Journal_Screen_07.png` |
| **Screen** | 84 |
| **Action** | Replace journal entry title and content |
| **Estimated Time** | 15 minutes |

### Issue #18: Triggering Crisis Alert Language
| Field | Value |
|-------|-------|
| **File** | `ui-designs/Dark-mode/🔒 Mental Health Journal/Mental_Health_Journal_Screen_09.png` |
| **Screen** | 86 |
| **Action** | Rewrite alert title and body with supportive language |
| **Estimated Time** | 20 minutes |

### Issue #26: Crisis Message Without Intervention
| Field | Value |
|-------|-------|
| **File** | `ui-designs/Dark-mode/🔒 Community Support/Community_Support_Screen_10.png` |
| **Screen** | 128 |
| **Action** | Add crisis resources to AI response |
| **Estimated Time** | 20 minutes |

**Total P1 Estimated Time**: ~1.5 hours

---

## Step 3: Priority 2 - High Severity Issues

### Issue #8: Serial Killer Names as Professionals
| Files Affected | Action |
|----------------|--------|
| AI_Therapy_Chatbot_Screen_07.png | Replace "Dr. Hannibal Lector" |
| AI_Therapy_Chatbot_Screen_08.png | Replace "Johann Liebert" |
| Multiple Mindful Resources screens | Replace all instances |

### Issue #9: AI Diagnosing Conditions
| File | Action |
|------|--------|
| AI_Therapy_Chatbot_Screen_13.png | Replace diagnostic language with observational |

### Issue #4: "You're suicidal" Messaging
| File | Action |
|------|--------|
| Profile_Setup_&_Completion_Screen_11.png | Replace with supportive phrasing |

### Issue #3: Inconsistent AI Naming
| Action | Standard |
|--------|----------|
| Audit all screens | Use "Dr. Freud" consistently |

### Issue #27: "GPT-6" Reference
| File | Action |
|------|--------|
| Community_Support_Screen_10.png | Replace with "Dr. Freud" |

**Total P2 Estimated Time**: ~2 hours

---

## Step 4: Priority 3 - Medium Severity Issues

### Typos & Spelling (Quick Fixes)
| Issue | Screen | File | Fix |
|-------|--------|------|-----|
| #5 | 36 | Mental_Health_Assessment_Screen_11.png | "Withdrawl" → "Withdrawal" |
| #5 | 37 | Mental_Health_Assessment_Screen_12.png | "Exremely" → "Extremely" |
| #5 | 42 | Home_Screen_02.png | "Postive" → "Positive" |
| #5 | 3 | Sign_In_&_Sign_Up_Screen_03.png | "passwrod" → "password" |
| #5 | 68 | Mood_Tracker_Screen_02.png | "throught" → "throughout" |

### Data Issues
| Issue | Screen | File | Fix |
|-------|--------|------|-----|
| #6 | 35 | Assessment screen | Replace "Axpelliarmus" with real medication |
| #10 | 59 | Chatbot screen | Replace "h4te_this_world.jpg" filename |
| #22 | 120 | Community_Support_Screen_02.png | "Suicide" → "Crisis Support" |
| #23 | 124 | Community_Support_Screen_06.png | Replace celebrity names |
| #24 | Multiple | Multiple | Replace anime character names |

### Profile Data Issues
| Issue | Screen | Fix |
|-------|--------|-----|
| #34 | 141 | Change age from 17y to 28y |
| #35 | 141, 143 | Make weight consistent (48kg or 65kg) |

### Language/Address Issues
| Issue | Screen | Fix |
|-------|--------|-----|
| #38 | 147 | Fix language codes (IL→IT, IR→IE, etc.) |
| #39 | 148 | Fix "Detroit, Texas" → "Detroit, MI" |
| #40 | 148 | Add actual phone numbers |

**Total P3 Estimated Time**: ~3 hours

---

## Step 5: Priority 4 - Low Severity (Grammar/Polish)

| Issue | Screen | Current | Fix |
|-------|--------|---------|-----|
| #11 | 62 | "Surprise birt!" | "Surprise birthday gift" |
| #17 | 80 | "Automaticly" | "Automatically" |
| #19 | 96 | "2025/18/16" | "2025/01/16" |
| #19 | 96 | "Filter Mood" | "Filter Sleep" |
| #20 | 99 | "will impacts" | "will impact" |
| #21 | 95 | "heatbeat" | "heartbeat" |
| #25 | 123 | "posted a post" | "Your post has been published!" |
| #28 | 125, 133 | "2052" | "2025" |
| #29 | 131 | "found.404" | "found. 404" |
| #31 | 136 | "9 daily journal" | "9 daily journals" |
| #32 | 138 | "Decresased" | "Decreased" |
| #33 | 139 | "mediation" | "meditation" |
| #33 | 139 | "Pelase" | "Please" |
| #36 | 144 | "check for sounds" | "play notification sounds" |
| #37 | 145 | "by by visiting" | "by visiting" |
| #41 | 153 | "Which of the area" | "Which area" |
| #42 | 156 | "seems to error" | "encountered an error" |

**Total P4 Estimated Time**: ~1.5 hours

---

## Step 6: Review Workflow

### After Each Priority Level:

1. **Self-Review**
   - Open modified PNG files
   - Verify text changes are correct
   - Check for any introduced typos

2. **Peer Review**
   - Have another designer verify changes
   - Use REMEDIATION-GUIDE.md as checklist

3. **Update Tracking**
   - Mark issues as "IN PROGRESS" or "RESOLVED" in CRITICAL-ISSUES.md
   - Add resolution date

---

## Step 7: Clinical Review (Required for P1)

Before development begins, the following require **clinical sign-off**:

| Issue | Content Type | Reviewer Required |
|-------|--------------|-------------------|
| #1 | Suicidal ideation placeholders | Mental Health Professional |
| #2 | Crisis expression example | Mental Health Professional |
| #16 | Violent content replacement | Mental Health Professional |
| #18 | Crisis alert messaging | Mental Health Professional |
| #26 | Crisis intervention response | Mental Health Professional |
| #4 | Crisis score messaging | Mental Health Professional |
| #9 | AI disclaimer language | Legal + Clinical |

### Clinical Review Checklist:
- [ ] All crisis-related messaging reviewed
- [ ] Language is supportive, not triggering
- [ ] Crisis resources are accurate and current
- [ ] AI limitations are clearly stated
- [ ] No diagnostic language remains

---

## Step 8: Final Verification

Before marking complete:

### Checklist:
- [ ] All 42 issues addressed
- [ ] All modified PNGs verified
- [ ] CRITICAL-ISSUES.md tracking table updated
- [ ] Clinical review sign-off obtained (for P1 issues)
- [ ] Legal review sign-off obtained (for Issue #9)
- [ ] Light mode versions updated (if applicable)

---

## Timeline Estimate

| Phase | Issues | Estimated Time |
|-------|--------|----------------|
| Priority 1 (Critical) | 5 | 1.5 hours |
| Priority 2 (High) | 5 | 2 hours |
| Priority 3 (Medium) | 18 | 3 hours |
| Priority 4 (Low) | 14 | 1.5 hours |
| Review & QA | - | 2 hours |
| **Total** | **42** | **~10 hours** |

---

## Contact & Questions

For questions about specific fixes, refer to:
- **REMEDIATION-GUIDE.md** - Exact replacement text
- **CRITICAL-ISSUES.md** - Detailed context
- **Batch documentation files** - Screen-by-screen details

---

## Sign-Off

| Role | Name | Date | Signature |
|------|------|------|-----------|
| Design Lead | | | |
| Clinical Reviewer | | | |
| Legal Reviewer | | | |
| Product Owner | | | |

---

*Document created: UI Audit completion*
*Development blocked until Priority 1 issues resolved*
