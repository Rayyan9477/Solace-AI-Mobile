# UI Audit Documentation - Batch 4

## Profile Setup Flow (Continued)

**Audit Date**: 2026-01-09
**Source**: `ui-designs/Dark-mode/Profile Setup & Completion/`
**Screens Covered**: 5 (Screens 02-06)

---

## Batch 4 Overview

| # | Screen | Route Name | Purpose |
|---|--------|-----------|---------|
| 16 | Profile_Setup_Screen_02 | `ProfileSetupDetails` | User info form |
| 17 | Profile_Setup_Screen_03 | `PasswordSetup` | Password with strength |
| 18 | Profile_Setup_Screen_04 | `OTPSetup` | Phone number entry |
| 19 | Profile_Setup_Screen_05 | `OTPEntry` | 4-digit code entry |
| 20 | Profile_Setup_Screen_06 | `FingerprintSetup` | Biometric setup |

---

## Profile Setup Flow

```
┌────────────────────┐
│ Avatar Selection   │ (Screen 01 - Batch 3)
└─────────┬──────────┘
          │
          ▼
┌────────────────────┐
│ Profile Details    │ (Screen 02)
│ (Name, Type, etc)  │
└─────────┬──────────┘
          │
          ▼
┌────────────────────┐
│ Password Setup     │ (Screen 03)
│ (Strength check)   │
└─────────┬──────────┘
          │
          ▼
┌────────────────────┐
│ OTP Request        │ (Screen 04)
│ (Phone number)     │
└─────────┬──────────┘
          │
          ▼
┌────────────────────┐
│ OTP Verification   │ (Screen 05)
│ (Enter 4 digits)   │
└─────────┬──────────┘
          │
          ▼
┌────────────────────┐
│ Fingerprint Setup  │ (Screen 06)
│ (Biometric)        │
└─────────┬──────────┘
          │
          ▼
    Profile Complete
```

---

# Screen 16: `Profile_Setup_&_Completion_Screen_02.png`

## 1. Purpose

- **User goal**: Complete profile information with personal details
- **Primary actions**: Fill in name, verify email, set account type, add physical/demographic info
- **When/why**: Core profile setup screen after avatar selection; collects essential user data

---

## 2. UI Structure (Visual Only)

```
Screen
 └── Full Screen Container (dark brown background)
      ├── Header Section (curved olive green background)
      │    ├── BackButton (circular, left arrow)
      │    ├── HeaderTitle "Profile Setup"
      │    └── Decorative squiggles/shapes
      ├── Profile Photo Section
      │    ├── Circular Photo (~100px) with user's image
      │    └── Edit Overlay Button (link/chain icon, bottom-right)
      ├── Form Section (scrollable)
      │    ├── Full Name Field
      │    │    ├── Label "Full Name"
      │    │    └── TextInput (person icon, "Shinomiya Kag|")
      │    ├── Email Address Field
      │    │    ├── Label "Email Address"
      │    │    └── TextInput (@ icon, "elementary221b@gmail.com")
      │    ├── Password Field
      │    │    ├── Label "Password"
      │    │    └── PasswordInput (lock icon, dots, eye toggle)
      │    ├── Account Type Field
      │    │    ├── Label "Account Type"
      │    │    └── PillSelector (horizontal)
      │    │         ├── "Psychiatrist" (unselected)
      │    │         ├── "Patient" (SELECTED - green fill)
      │    │         └── "Professional" (unselected, partially visible)
      │    ├── Weight Field
      │    │    ├── Label "Weight"
      │    │    ├── Slider (50kg to 100kg)
      │    │    │    ├── Track (green filled portion)
      │    │    │    └── Thumb (circular handle at 65kg)
      │    │    └── Value Labels ("50kg", "65kg", "100kg")
      │    ├── Gender Field
      │    │    ├── Label "Gender"
      │    │    └── Dropdown (transgender symbol icon, "Trans Female", chevron)
      │    └── Location Field
      │         ├── Label "Location"
      │         └── Dropdown (pin icon, "Tokyo, Japan", chevron)
      └── Action Section
           └── PrimaryButton "Continue →"
```

**Detailed Component Analysis:**

| Element | Visual Details | User Interactions | Reusable |
|---------|---------------|-------------------|----------|
| Curved Header | Olive green with decorative squiggles (~140px) | None | Yes |
| Profile Photo | Circular, real image, ~100px, border | Tap to change photo | Yes |
| Edit Photo Button | Small circle with link/edit icon, overlays photo | Tap to edit | Yes |
| Full Name Input | Person icon left, rounded dark field | Type name | Yes |
| Email Input | @ symbol icon, shows existing email | May be read-only or editable | Yes |
| Password Input | Lock icon, dots, eye toggle | Toggle visibility, change password | Yes |
| Account Type Selector | 3 horizontal pills, one selected (green) | Tap to select | Yes |
| Weight Slider | Green track, circular thumb, 50-100kg range | Drag to adjust | Yes |
| Gender Dropdown | Transgender symbol, "Trans Female" | Tap to open options | Yes |
| Location Dropdown | Map pin icon, "Tokyo, Japan" | Tap to open picker | Yes |
| Continue Button | Tan, full width, "Continue →" | Tap to proceed | Yes |

---

## 3. Component List

| Component Name | UI Responsibility | Reusable | Props (name: type) |
|----------------|-------------------|----------|-------------------|
| CurvedHeader | Green curved header with decorations | Yes | title: string, onBack: fn |
| ProfilePhotoDisplay | Circular photo with edit overlay | Yes | source: ImageSource, onEdit: fn, size: number |
| PhotoEditButton | Small edit icon overlay | Yes | onPress: fn |
| FormLabel | Field labels | Yes | text: string |
| TextInputWithIcon | Input with leading icon | Yes | icon: string, value: string, onChange: fn, placeholder: string |
| PasswordInput | Password with toggle | Yes | (as before) |
| PillSelector | Horizontal pill options | Yes | options: Option[], selected: string, onSelect: fn |
| PillOption | Individual pill button | Yes | label: string, selected: boolean, onPress: fn |
| RangeSlider | Slider with value display | Yes | min: number, max: number, value: number, onChange: fn, unit: string |
| DropdownSelect | Dropdown with icon and chevron | Yes | icon: string, value: string, onPress: fn, placeholder: string |
| PrimaryButton | Continue button | Yes | label: string, onPress: fn |

---

## 4. Responsibility Split

### UI Layer
- Render curved header with decorative elements
- Display circular profile photo with edit overlay
- Layout 7 form fields vertically with proper spacing
- Show selected state on account type pills (green fill)
- Render slider with current value indicator
- Display dropdowns with current selections
- Position continue button at bottom (fixed or scrollable)

### Logic Layer
- Validate full name (required, min length)
- Handle email (may be prefilled, verify if editable)
- Validate password requirements
- Track account type selection
- Handle weight slider value changes
- Open gender picker modal/bottom sheet
- Open location picker modal/search
- Submit all profile data on continue

---

## 5. State Definition

```
Local State:
- fullName: string
- email: string
- password: string
- showPassword: boolean
- accountType: 'psychiatrist' | 'patient' | 'professional'
- weight: number (50-100)
- gender: string
- location: string
- showGenderPicker: boolean
- showLocationPicker: boolean

Async State:
- profileUpdateStatus: 'idle' | 'saving' | 'success' | 'error'

Shared / Global State:
- userId: string
- profilePhoto: ImageSource | null
```

---

## 6. Data Models

```typescript
interface ProfileFormData {
  fullName: string;
  email: string;
  password?: string;
  accountType: 'psychiatrist' | 'patient' | 'professional';
  weight: number;
  weightUnit: 'kg' | 'lbs';
  gender: string;
  location: {
    city: string;
    country: string;
    coordinates?: { lat: number; lng: number };
  };
}

interface AccountTypeOption {
  id: string;
  label: string;
  description?: string;
}

interface GenderOption {
  id: string;
  label: string;
  icon?: string;
}

const accountTypes: AccountTypeOption[] = [
  { id: 'psychiatrist', label: 'Psychiatrist' },
  { id: 'patient', label: 'Patient' },
  { id: 'professional', label: 'Professional' }
];
```

---

## 7. Navigation

- **Route name**: `ProfileSetupDetails` or `ProfileSetup` with step=2
- **Incoming parameters**:
  - userId: string
  - avatarId?: string (from previous screen)
  - prefillData?: Partial<ProfileFormData>
- **Outgoing targets**:
  - → `ProfileSetupAvatar` (Screen 01) via back button
  - → `PasswordSetup` (Screen 03) via continue
  - → Image picker via photo edit button
  - → Gender picker modal
  - → Location picker/search modal
- **Trigger conditions**:
  - Back → previous screen
  - Continue with valid form → next step
  - Edit photo → image picker
  - Tap gender dropdown → gender picker
  - Tap location dropdown → location picker

---

## 8. UI States & Edge Cases

- **Default**: Form with prefilled email from registration
- **Editing**: Fields show current values, cursor in active field
- **Validation Error**: Show inline errors for invalid fields
- **Account Type**: Only one can be selected (radio behavior)
- **Slider**: Shows real-time value as user drags
- **Dropdown Closed**: Shows current value with chevron down
- **Dropdown Open**: Shows options in modal/bottom sheet
- **Scrolling**: Form should scroll if keyboard is open
- **Accessibility**:
  - Form fields need proper labels
  - Slider needs aria-valuemin, aria-valuemax, aria-valuenow
  - Dropdowns need role="listbox" when open
  - Account type pills need role="radiogroup"

---

## 9. Implementation Breakdown

```
Step 1: Reuse CurvedHeader with decorative squiggles
Step 2: Create ProfilePhotoDisplay with edit overlay
Step 3: Create TextInputWithIcon component (generic with icon prop)
Step 4: Create PillSelector and PillOption components
Step 5: Create RangeSlider with value labels
Step 6: Create DropdownSelect with icon and chevron
Step 7: Layout all form fields with ScrollView
Step 8: Implement gender picker modal with options
Step 9: Implement location picker (search or list)
Step 10: Wire form state and validation
Step 11: Handle form submission
Step 12: Wire navigation
```

---

## 10. Open Issues

- [ ] Is email editable or read-only?
- [ ] Password field purpose - changing existing or confirming?
- [ ] Full list of account types (only 3 visible?)
- [ ] Weight unit toggle (kg/lbs) not shown
- [ ] Full list of gender options
- [ ] Location picker style (search? list? map?)
- [ ] Validation requirements for each field
- [ ] Photo edit - camera or gallery or both?
- [ ] "Professional" pill is cut off - scroll behavior?

---

---

# Screen 17: `Profile_Setup_&_Completion_Screen_03.png`

## 1. Purpose

- **User goal**: Create a secure password meeting all requirements
- **Primary actions**: Enter password, see strength feedback, meet all requirements
- **When/why**: Security setup step; ensures user creates strong password

---

## 2. UI Structure (Visual Only)

```
Screen
 └── Full Screen Container (dark brown background)
      ├── Header Section
      │    ├── BackButton (circular, left arrow)
      │    └── HeaderTitle "Password Setup"
      ├── Password Input Section
      │    └── Large Password Input
      │         ├── 6 dots (password hidden)
      │         ├── Cursor line (orange)
      │         ├── Orange border (focused state)
      │         └── Eye Toggle Button (circular brown bg, eye icon)
      ├── Strength Indicator Section
      │    ├── Label "Password Strength"
      │    ├── Progress Bar
      │    │    ├── Orange filled portion (~30%)
      │    │    └── Gray unfilled portion (~70%)
      │    └── Strength Message "Weak!! Increase strength 💪"
      ├── Requirements Section
      │    ├── RequirementChip "⚠ Must have A-Z" (outlined, warning icon)
      │    └── RequirementChip "⚠ Must Have 0-9" (outlined, warning icon)
      ├── Action Section
      │    └── PrimaryButton "Continue →"
      └── Keyboard (system)
```

**Detailed Component Analysis:**

| Element | Visual Details | User Interactions | Reusable |
|---------|---------------|-------------------|----------|
| Header | No curve, just back button + title | Back navigation | Yes |
| Password Input | Large, orange border, dots, ~64px height | Type password | Yes |
| Eye Toggle | Circular brown bg (~40px), eye icon | Tap to show/hide | Yes |
| Strength Label | "Password Strength", white, ~14px | None | Yes |
| Strength Bar | Horizontal, orange fill for weak, ~8px height | None | Yes |
| Strength Message | "Weak!! Increase strength 💪", orange text | None | Yes |
| Requirement Chip | Outlined pill, warning icon, requirement text | None (indicator only) | Yes |
| Continue Button | Tan, "Continue →", may be disabled until strong | Tap to proceed | Yes |

---

## 3. Component List

| Component Name | UI Responsibility | Reusable | Props (name: type) |
|----------------|-------------------|----------|-------------------|
| HeaderWithBack | Back button + title | Yes | title: string, onBack: fn |
| LargePasswordInput | Prominent password field | Yes | value: string, onChange: fn, showPassword: boolean, onToggle: fn, focused: boolean |
| EyeToggleButton | Circular visibility toggle | Yes | visible: boolean, onToggle: fn |
| PasswordStrengthBar | Colored progress indicator | Yes | strength: 'weak' \| 'medium' \| 'strong', percentage: number |
| PasswordStrengthLabel | Strength text with emoji | Yes | strength: string, message: string |
| RequirementChip | Outlined requirement indicator | Yes | met: boolean, label: string, icon: 'warning' \| 'check' |
| RequirementsList | Container for requirement chips | Yes | requirements: Requirement[], horizontal: boolean |
| PrimaryButton | Continue button | Yes | label: string, onPress: fn, disabled?: boolean |

---

## 4. Responsibility Split

### UI Layer
- Render simple header with back button
- Display large password input with prominent styling
- Show password strength bar with color coding (orange=weak, yellow=medium, green=strong)
- Display strength message with appropriate emoji
- Render requirement chips showing met/unmet status
- Position continue button (may be disabled)

### Logic Layer
- Calculate password strength in real-time
- Check each requirement (A-Z, 0-9, special chars, length)
- Update strength bar and message
- Update requirement chips (warning→check when met)
- Enable continue only when all requirements met
- Navigate to next step

---

## 5. State Definition

```
Local State:
- password: string
- showPassword: boolean

Derived State:
- passwordStrength: 'weak' | 'medium' | 'strong'
- strengthPercentage: number (0-100)
- requirements: {
    hasUppercase: boolean;
    hasLowercase: boolean;
    hasNumber: boolean;
    hasSpecialChar: boolean;
    minLength: boolean;
  }
- allRequirementsMet: boolean
- canContinue: boolean
```

---

## 6. Data Models

```typescript
interface PasswordRequirement {
  id: string;
  label: string;
  validator: (password: string) => boolean;
  met: boolean;
}

interface PasswordStrengthResult {
  strength: 'weak' | 'medium' | 'strong';
  percentage: number;
  message: string;
  emoji: string;
  color: string;
}

const passwordRequirements: PasswordRequirement[] = [
  { id: 'uppercase', label: 'Must have A-Z', validator: (p) => /[A-Z]/.test(p), met: false },
  { id: 'number', label: 'Must Have 0-9', validator: (p) => /[0-9]/.test(p), met: false },
];
```

---

## 7. Navigation

- **Route name**: `PasswordSetup`
- **Incoming parameters**:
  - userId: string
  - isNewPassword: boolean
- **Outgoing targets**:
  - → `ProfileSetupDetails` (Screen 02) via back
  - → `OTPSetup` (Screen 04) via continue when requirements met
- **Trigger conditions**:
  - Back → previous screen
  - Continue (enabled) → next screen

---

## 8. UI States & Edge Cases

- **Empty**: No password entered, strength bar empty
- **Weak**: Orange bar, "Weak!!" message, requirements show warnings
- **Medium**: Yellow bar, encouraging message
- **Strong**: Green bar, "Strong!" message, all requirements checked
- **Requirements Met**: Chips change from warning to checkmark
- **Continue Disabled**: Gray/inactive until all requirements met
- **Keyboard**: Should not cover input or requirements
- **Accessibility**:
  - Password input: role="textbox", aria-describedby strength
  - Strength bar: role="progressbar", aria-valuenow
  - Requirements: live region for screen reader updates

---

## 9. Implementation Breakdown

```
Step 1: Create HeaderWithBack (simple, no curve)
Step 2: Create LargePasswordInput with prominent styling
Step 3: Create EyeToggleButton with circular background
Step 4: Create PasswordStrengthBar with color states
Step 5: Create PasswordStrengthLabel with emoji support
Step 6: Create RequirementChip with warning/check states
Step 7: Implement password strength calculation logic
Step 8: Wire real-time validation as user types
Step 9: Enable/disable continue button based on requirements
Step 10: Wire navigation
```

---

## 10. Open Issues

- [ ] Full list of password requirements (only 2 visible)
- [ ] Minimum password length requirement
- [ ] Special character requirement?
- [ ] Strength calculation algorithm
- [ ] Can user skip this step?
- [ ] Flexed arm emoji 💪 cross-platform rendering
- [ ] Password visibility default (hidden shown)

---

---

# Screen 18: `Profile_Setup_&_Completion_Screen_04.png`

## 1. Purpose

- **User goal**: Enter phone number to receive OTP for verification
- **Primary actions**: Select country code, enter phone number, request OTP
- **When/why**: Security/verification step to confirm phone ownership

---

## 2. UI Structure (Visual Only)

```
Screen
 └── Full Screen Container (dark brown background)
      ├── Header Section
      │    ├── BackButton (circular, left arrow)
      │    └── HeaderTitle "OTP Setup"
      ├── Illustration Section
      │    └── Image: Person hugging green shield with checkmark
      │         (olive green background, orange sparkles, ~250px height)
      ├── Content Section
      │    ├── Title "OTP Verification" (white, serif, bold)
      │    └── Subtitle "We will send a one time SMS message.
      │                  Carrier rates may apply." (gray, ~14px)
      ├── Phone Input Section
      │    └── PhoneNumberInput (green/tan border)
      │         ├── Country Selector
      │         │    ├── Flag Icon (US flag)
      │         │    └── Dropdown Chevron
      │         ├── Divider (vertical line)
      │         ├── Phone Number Field "(+1) 234-567-89|"
      │         └── Copy Icon (right side)
      └── Action Section
           └── PrimaryButton "Send OTP →"
```

**Detailed Component Analysis:**

| Element | Visual Details | User Interactions | Reusable |
|---------|---------------|-------------------|----------|
| Header | Back + "OTP Setup" | Back navigation | Yes |
| Illustration | Person + shield + sparkles, ~250px | None | No |
| Title | "OTP Verification", white, serif, ~24px | None | Yes |
| Subtitle | Gray text, 2 lines, mentions carrier rates | None | Yes |
| Phone Input Container | Rounded rect, green/tan outline | None | Yes |
| Country Selector | Flag + chevron, left portion of input | Tap to open country list | Yes |
| Flag Icon | US flag emoji/image, ~24px | None | Yes |
| Phone Field | Shows formatted number "(+1) 234-567-89" | Type number | Yes |
| Copy Icon | Clipboard icon on right | Tap to copy number | Yes |
| Send OTP Button | Tan, "Send OTP →" | Tap to send | Yes |

---

## 3. Component List

| Component Name | UI Responsibility | Reusable | Props (name: type) |
|----------------|-------------------|----------|-------------------|
| HeaderWithBack | Back + title | Yes | title: string, onBack: fn |
| OTPIllustration | Shield/security artwork | No | - |
| ScreenTitle | Section title | Yes | text: string |
| ScreenSubtitle | Description text | Yes | text: string |
| PhoneNumberInput | Complete phone input with country | Yes | value: PhoneNumber, onChange: fn, onCountryPress: fn |
| CountrySelector | Flag + chevron dropdown trigger | Yes | country: Country, onPress: fn |
| FlagIcon | Country flag display | Yes | countryCode: string, size: number |
| PhoneField | Formatted phone number input | Yes | value: string, onChange: fn, countryCode: string |
| CopyButton | Icon button to copy | Yes | onPress: fn, value: string |
| PrimaryButton | Send OTP button | Yes | label: string, onPress: fn, icon?: string |

---

## 4. Responsibility Split

### UI Layer
- Render header with back button
- Display security illustration
- Show title and subtitle
- Render phone input with country selector
- Display formatted phone number
- Show copy icon
- Render send OTP button

### Logic Layer
- Handle country selection (open picker, update code)
- Format phone number as user types
- Validate phone number format
- Handle copy to clipboard
- Send OTP API request
- Navigate to code entry on success

---

## 5. State Definition

```
Local State:
- phoneNumber: string (raw digits)
- selectedCountry: Country
- showCountryPicker: boolean
- phoneError: string | null

Async State:
- sendOTPStatus: 'idle' | 'sending' | 'sent' | 'error'

Derived State:
- formattedPhoneNumber: string (with formatting)
- isValidPhoneNumber: boolean
- fullPhoneNumber: string (country code + number)
```

---

## 6. Data Models

```typescript
interface Country {
  code: string; // "US"
  dialCode: string; // "+1"
  name: string; // "United States"
  flag: string; // Emoji or image URL
  format?: string; // "(###) ###-####"
}

interface PhoneNumber {
  countryCode: string;
  dialCode: string;
  number: string;
  formatted: string;
  raw: string;
}

interface SendOTPRequest {
  phoneNumber: string;
  countryCode: string;
}

interface SendOTPResponse {
  success: boolean;
  maskedPhone: string;
  expiresIn: number;
  otpLength: number;
}
```

---

## 7. Navigation

- **Route name**: `OTPSetup` or `PhoneVerification`
- **Incoming parameters**:
  - userId: string
  - prefillPhone?: string
- **Outgoing targets**:
  - → `PasswordSetup` (Screen 03) via back
  - → `OTPEntry` (Screen 05) via Send OTP success
  - → Country picker modal
- **Trigger conditions**:
  - Back → previous screen
  - Send OTP → API call → success → code entry screen
  - Tap country selector → country picker modal

---

## 8. UI States & Edge Cases

- **Default**: Empty phone field, US selected
- **Typing**: Number formats as user types
- **Invalid**: Error message for invalid format
- **Sending**: Button shows loading state
- **Sent**: Navigate to code entry
- **Error**: Show error toast/message
- **Country Picker**: Modal/bottom sheet with searchable list
- **Accessibility**:
  - Phone input: type="tel"
  - Country selector: role="listbox"
  - Copy button: announce "Copied to clipboard"

---

## 9. Implementation Breakdown

```
Step 1: Reuse HeaderWithBack
Step 2: Add OTPIllustration asset
Step 3: Create PhoneNumberInput container component
Step 4: Create CountrySelector with flag and chevron
Step 5: Implement phone number formatting logic
Step 6: Create country picker modal with search
Step 7: Create CopyButton with clipboard functionality
Step 8: Wire OTP sending API
Step 9: Handle success/error states
Step 10: Navigate to code entry on success
```

---

## 10. Open Issues

- [ ] Full country list source
- [ ] Phone number validation per country
- [ ] Phone format patterns per country
- [ ] Copy icon purpose (copy own number?)
- [ ] Can user skip phone verification?
- [ ] SMS delivery timeout/retry
- [ ] Illustration asset source

---

---

# Screen 19: `Profile_Setup_&_Completion_Screen_05.png`

## 1. Purpose

- **User goal**: Enter the 4-digit OTP code received via SMS
- **Primary actions**: Enter code, retry if invalid, resend if not received
- **When/why**: Verification step to confirm phone number ownership

---

## 2. UI Structure (Visual Only)

```
Screen
 └── Full Screen Container (dark brown background)
      ├── Header Section
      │    ├── BackButton (circular, left arrow)
      │    └── HeaderTitle "OTP Setup"
      ├── Content Section
      │    ├── Title "Enter 4 digit OTP Code" (white, serif, bold)
      │    └── Subtitle "Scan your biometric fingerprint to make your
      │                  account more secure." (gray, ~14px)
      ├── OTP Input Section
      │    └── 4-Digit Code Input
      │         ├── Digit Box 1: "9" (dark brown bg, white text)
      │         ├── Digit Box 2: "5" (GREEN bg - focused, dark text)
      │         ├── Digit Box 3: "0" (dark brown bg, light text)
      │         └── Digit Box 4: "0" (dark brown bg, light text)
      ├── Error Section
      │    └── ErrorChip "⚠ Invalid OTP! Try Again!"
      │         (orange bg, warning icon, orange/white text)
      ├── Action Section
      │    └── PrimaryButton "Continue →"
      └── Footer Section
           └── TextLink "Didn't receive the OTP? Re-send."
```

**Detailed Component Analysis:**

| Element | Visual Details | User Interactions | Reusable |
|---------|---------------|-------------------|----------|
| Header | Back + "OTP Setup" | Back navigation | Yes |
| Title | "Enter 4 digit OTP Code", white serif | None | Yes |
| Subtitle | Gray text about fingerprint (seems misplaced) | None | Yes |
| OTP Digit Box | ~64px square, rounded, single digit | Tap to focus, auto-advance | Yes |
| Active Digit Box | Green background (#9AAD5C), shows focus | Currently typing | Yes |
| Inactive Digit Box | Dark brown bg | Previous/next digits | Yes |
| Error Chip | Orange bg, warning icon, error text | None | Yes |
| Continue Button | Tan, "Continue →" | Tap to verify | Yes |
| Re-send Link | "Didn't receive the OTP? **Re-send.**" | Tap Re-send | Yes |

---

## 3. Component List

| Component Name | UI Responsibility | Reusable | Props (name: type) |
|----------------|-------------------|----------|-------------------|
| HeaderWithBack | Back + title | Yes | title: string, onBack: fn |
| ScreenTitle | "Enter 4 digit OTP Code" | Yes | text: string |
| ScreenSubtitle | Description text | Yes | text: string |
| OTPCodeInput | 4-digit code entry | Yes | length: number, value: string, onChange: fn, error?: boolean, focusedIndex: number |
| OTPDigitBox | Single digit display | Yes | digit: string, focused: boolean, filled: boolean |
| ErrorChip | Error message with icon | Yes | message: string, visible: boolean |
| PrimaryButton | Continue button | Yes | label: string, onPress: fn |
| TextLink | Re-send link | Yes | prefix: string, linkText: string, onPress: fn |

---

## 4. Responsibility Split

### UI Layer
- Render header with back
- Display title and subtitle
- Render 4 digit boxes with proper focus states
- Show error chip when OTP is invalid
- Position continue button
- Display resend link at bottom

### Logic Layer
- Handle digit input (auto-advance to next box)
- Handle backspace (go to previous box)
- Validate complete OTP (4 digits)
- Submit OTP for verification
- Handle invalid OTP error
- Handle resend functionality with cooldown

---

## 5. State Definition

```
Local State:
- otpValue: string (4 digits)
- focusedIndex: number (0-3)
- error: string | null
- canResend: boolean
- resendCooldown: number

Async State:
- verifyStatus: 'idle' | 'verifying' | 'success' | 'error'
- resendStatus: 'idle' | 'sending' | 'sent'

Derived State:
- isComplete: boolean (otpValue.length === 4)
- digits: string[] (split otpValue into array)
```

---

## 6. Data Models

```typescript
interface OTPVerifyRequest {
  otp: string;
  phoneNumber: string;
  verificationId: string;
}

interface OTPVerifyResponse {
  success: boolean;
  error?: string;
  attemptsRemaining?: number;
}

interface OTPState {
  value: string;
  focusedIndex: number;
  isComplete: boolean;
  isValid: boolean | null;
}
```

---

## 7. Navigation

- **Route name**: `OTPEntry` or `OTPVerification`
- **Incoming parameters**:
  - phoneNumber: string
  - maskedPhone: string
  - verificationId: string
- **Outgoing targets**:
  - → `OTPSetup` (Screen 04) via back
  - → `FingerprintSetup` (Screen 06) via continue on success
- **Trigger conditions**:
  - Back → previous screen
  - Continue with valid OTP → verify → success → next screen
  - Re-send → resend OTP API call

---

## 8. UI States & Edge Cases

- **Empty**: All boxes empty, first focused
- **Partial**: Some digits entered, cursor on next empty
- **Complete**: All 4 digits entered, ready to verify
- **Verifying**: Button shows loading
- **Invalid**: Error chip shown "Invalid OTP! Try Again!"
- **Too Many Attempts**: May lock out user
- **Resend Cooldown**: Re-send disabled with timer
- **Accessibility**:
  - OTP input: role="group", aria-label "OTP input"
  - Each box: aria-label "Digit X of 4"
  - Error: role="alert"
  - Auto-focus management

---

## 9. Implementation Breakdown

```
Step 1: Reuse HeaderWithBack
Step 2: Create OTPCodeInput container
Step 3: Create OTPDigitBox with focus/filled states
Step 4: Implement auto-advance on digit entry
Step 5: Implement backspace handling
Step 6: Create ErrorChip component
Step 7: Wire OTP verification API
Step 8: Implement resend with cooldown timer
Step 9: Handle error states
Step 10: Navigate on success
```

---

## 10. Open Issues

- [ ] Subtitle mentions fingerprint but this is OTP screen - copy error?
- [ ] OTP length (4 shown, confirm)
- [ ] Max verification attempts
- [ ] Resend cooldown duration
- [ ] Auto-submit when 4 digits entered?
- [ ] Paste functionality for OTP
- [ ] Error chip styling (orange bg confirmed)

---

---

# Screen 20: `Profile_Setup_&_Completion_Screen_06.png`

## 1. Purpose

- **User goal**: Set up biometric (fingerprint) authentication
- **Primary actions**: Scan fingerprint to enable biometric login
- **When/why**: Optional security enhancement after OTP verification

---

## 2. UI Structure (Visual Only)

```
Screen
 └── Full Screen Container (dark brown background)
      ├── Header Section
      │    ├── BackButton (circular, left arrow)
      │    └── HeaderTitle "Fingerprint Setup"
      ├── Fingerprint Scanner Section
      │    └── Scanner Visual
      │         ├── Corner Brackets (4 corners, white/gray)
      │         ├── Fingerprint Icon (large, white circular pattern)
      │         └── Scan Line (green horizontal line, animated?)
      ├── Content Section
      │    ├── Title "Fingerprint Setup" (white, serif, bold)
      │    └── Subtitle "Scan your biometric fingerprint to make your
      │                  account more secure. 🔑" (gray, key emoji)
      └── Action Section
           └── PrimaryButton "Continue →"
```

**Detailed Component Analysis:**

| Element | Visual Details | User Interactions | Reusable |
|---------|---------------|-------------------|----------|
| Header | Back + "Fingerprint Setup" | Back navigation | Yes |
| Scanner Frame | 4 corner brackets, ~200px | Visual guide | Yes |
| Fingerprint Icon | Large white fingerprint pattern, ~150px | Touch to scan | Yes |
| Scan Line | Horizontal green line across fingerprint | Animated scanning effect | Yes |
| Title | "Fingerprint Setup", white serif | None | Yes |
| Subtitle | Gray text with key emoji 🔑 | None | Yes |
| Continue Button | Tan, "Continue →" | Tap after successful scan | Yes |

---

## 3. Component List

| Component Name | UI Responsibility | Reusable | Props (name: type) |
|----------------|-------------------|----------|-------------------|
| HeaderWithBack | Back + title | Yes | title: string, onBack: fn |
| FingerprintScanner | Scanner visualization | Yes | status: 'idle' \| 'scanning' \| 'success' \| 'error' |
| ScannerFrame | Corner brackets container | Yes | size: number |
| FingerprintIcon | Fingerprint pattern graphic | Yes | size: number, color: string |
| ScanLine | Animated horizontal line | Yes | visible: boolean, animated: boolean |
| ScreenTitle | "Fingerprint Setup" | Yes | text: string |
| ScreenSubtitle | Description with emoji | Yes | text: string |
| PrimaryButton | Continue button | Yes | label: string, onPress: fn |

---

## 4. Responsibility Split

### UI Layer
- Render header with back button
- Display large fingerprint scanner visualization
- Animate scan line during scanning
- Show corner brackets as scanning guide
- Display title and subtitle
- Render continue button

### Logic Layer
- Request biometric permission
- Initiate fingerprint scan
- Handle scan success/failure
- Store biometric credentials
- Handle skip option (if available)
- Navigate to completion

---

## 5. State Definition

```
Local State:
- scanStatus: 'idle' | 'scanning' | 'success' | 'error'
- scanError: string | null
- biometricEnabled: boolean

Async State:
- biometricSetupStatus: 'idle' | 'setting_up' | 'complete' | 'error'

Shared / Global State:
- deviceSupportsBiometrics: boolean
- biometricType: 'fingerprint' | 'faceId' | 'none'
```

---

## 6. Data Models

```typescript
interface BiometricCapability {
  supported: boolean;
  type: 'fingerprint' | 'faceId' | 'iris' | 'none';
  enrolled: boolean;
}

interface BiometricSetupResult {
  success: boolean;
  enabled: boolean;
  error?: string;
}

type ScanStatus = 'idle' | 'scanning' | 'success' | 'error';
```

---

## 7. Navigation

- **Route name**: `FingerprintSetup` or `BiometricSetup`
- **Incoming parameters**:
  - userId: string
  - isOptional: boolean
- **Outgoing targets**:
  - → `OTPEntry` (Screen 05) via back
  - → `ProfileComplete` or `Home` via continue after success
- **Trigger conditions**:
  - Back → previous screen
  - Successful scan + continue → completion/home
  - Skip (if available) → completion/home

---

## 8. UI States & Edge Cases

- **Idle**: Fingerprint icon static, waiting for user
- **Scanning**: Scan line animates, fingerprint may pulse
- **Success**: Green checkmark or success indicator
- **Error**: Red indicator, error message
- **Not Supported**: Show alternative or skip option
- **Permission Denied**: Prompt to enable in settings
- **Accessibility**:
  - Announce scanning status
  - Provide alternative for users without fingerprint
  - Button should be accessible even during scan

---

## 9. Implementation Breakdown

```
Step 1: Reuse HeaderWithBack
Step 2: Create FingerprintScanner container
Step 3: Create ScannerFrame with corner brackets
Step 4: Create FingerprintIcon (SVG or image)
Step 5: Create ScanLine with animation
Step 6: Check biometric availability on mount
Step 7: Implement fingerprint scan using expo-local-authentication
Step 8: Handle scan results
Step 9: Store biometric preference
Step 10: Wire navigation to completion
```

---

## 10. Open Issues

- [ ] Is fingerprint setup required or skippable?
- [ ] Face ID support for iOS?
- [ ] Animation specs for scan line
- [ ] What happens if device doesn't support biometrics?
- [ ] Key emoji 🔑 cross-platform rendering
- [ ] Error handling for failed scans
- [ ] Number of retry attempts

---

---

## New Components Identified (Batch 4)

### High Priority
| Component | Description |
|-----------|-------------|
| PillSelector | Horizontal pill radio group (Account Type) |
| DropdownSelect | Dropdown with icon and chevron |
| OTPCodeInput | Multi-digit OTP entry (4 boxes) |
| ErrorChip | Error message with warning icon |

### Medium Priority
| Component | Description |
|-----------|-------------|
| ProfilePhotoDisplay | Circular photo with edit overlay |
| RangeSlider | Slider with min/max labels |
| PasswordStrengthBar | Colored strength indicator |
| RequirementChip | Password requirement indicator |
| PhoneNumberInput | Phone with country selector |
| CountrySelector | Flag + dropdown trigger |
| OTPDigitBox | Single digit display box |

### Lower Priority
| Component | Description |
|-----------|-------------|
| FingerprintScanner | Biometric scan visualization |
| ScanLine | Animated scan line |
| ScannerFrame | Corner brackets for scanner |
| CopyButton | Clipboard copy icon button |
| LargePasswordInput | Prominent password field |

---

## Form Field Specifications

### PillSelector
```typescript
interface PillSelectorProps {
  options: Array<{ id: string; label: string }>;
  selected: string;
  onSelect: (id: string) => void;
  disabled?: boolean;
}

// Visual specs:
// - Horizontal layout, overflow scroll if needed
// - Unselected: dark brown bg, white text, no border
// - Selected: olive green (#9AAD5C) bg, dark text
// - Height: ~40px
// - Border radius: 20px (pill shape)
// - Gap between pills: 8px
```

### RangeSlider
```typescript
interface RangeSliderProps {
  min: number;
  max: number;
  value: number;
  onChange: (value: number) => void;
  unit: string;
  showLabels?: boolean;
}

// Visual specs:
// - Track: gray background, green (#9AAD5C) filled portion
// - Thumb: white circle with shadow, ~24px
// - Height: ~40px total with labels
// - Labels: min value left, current center, max right
```

### OTPCodeInput
```typescript
interface OTPCodeInputProps {
  length: number; // 4 or 6
  value: string;
  onChange: (value: string) => void;
  error?: boolean;
  autoFocus?: boolean;
}

// Visual specs:
// - Box size: ~64px square
// - Gap: ~16px between boxes
// - Unfocused: dark brown (#2A2220) bg
// - Focused: olive green (#9AAD5C) bg
// - Border radius: ~12px
// - Font size: ~32px
```

---

## Next Batch Preview

**Batch 5** will cover:
- Profile_Setup_&_Completion_Screen_07.png
- Profile_Setup_&_Completion_Screen_08.png
- Profile_Setup_&_Completion_Screen_09.png
- Profile_Setup_&_Completion_Screen_10.png
- Profile_Setup_&_Completion_Screen_11.png
