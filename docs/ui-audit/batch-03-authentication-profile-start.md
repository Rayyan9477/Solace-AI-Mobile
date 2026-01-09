# UI Audit Documentation - Batch 3

## Authentication Flow & Profile Setup Start

**Audit Date**: 2026-01-09
**Source**: `ui-designs/Dark-mode/Sign In & Sign Up/` + `ui-designs/Dark-mode/Profile Setup & Completion/`
**Screens Covered**: 5

---

## Batch 3 Overview

| # | Screen | Route Name | Purpose |
|---|--------|-----------|---------|
| 11 | Sign_In_&_Sign_Up_Screen_01 | `SignIn` | User authentication |
| 12 | Sign_In_&_Sign_Up_Screen_02 | `SignUp` | New user registration (with error state) |
| 13 | Sign_In_&_Sign_Up_Screen_03 | `ForgotPassword` | Recovery method selection |
| 14 | Sign_In_&_Sign_Up_Screen_04 | `VerificationCodeSent` | Code sent confirmation modal |
| 15 | Profile_Setup_Screen_01 | `ProfileSetupAvatar` | Avatar selection |

---

## Authentication Flow Map

```
                    ┌─────────────────┐
                    │    Welcome      │
                    └────────┬────────┘
                             │
              ┌──────────────┴──────────────┐
              ▼                              ▼
      ┌───────────┐                  ┌────────────┐
      │  Sign In  │◄────────────────►│  Sign Up   │
      └─────┬─────┘                  └──────┬─────┘
            │                               │
            │ Forgot Password               │ Success
            ▼                               ▼
    ┌───────────────┐               ┌───────────────┐
    │ Forgot Pass   │               │ Profile Setup │
    │ (Method)      │               │ (Avatar)      │
    └───────┬───────┘               └───────────────┘
            │
            ▼
    ┌───────────────┐
    │ Verification  │
    │ Code Sent     │
    └───────────────┘
```

---

# Screen 11: `Sign_In_&_Sign_Up_Screen_01.png`

## 1. Purpose

- **User goal**: Authenticate into the app using existing credentials
- **Primary actions**: Enter email/password and sign in, OR use social login, OR navigate to sign up/forgot password
- **When/why**: Displayed when returning user taps "Sign In" from Welcome screen or when session expires

---

## 2. UI Structure (Visual Only)

```
Screen
 └── Full Screen Container (dark brown background)
      ├── Header Section (curved olive/sage green background)
      │    └── AppLogo (white 4-circle clover, centered)
      ├── Title Section
      │    └── Title "Sign In To freud.ai" (white, serif/italic)
      ├── Form Section
      │    ├── Email Field Group
      │    │    ├── Label "Email Address" (white, small)
      │    │    └── TextInput
      │    │         ├── Leading Icon (envelope/email)
      │    │         ├── Input text "princesskaguya@gmail.co"
      │    │         └── Orange/tan border (focused state)
      │    └── Password Field Group
      │         ├── Label "Password" (white, small)
      │         └── PasswordInput
      │              ├── Leading Icon (lock)
      │              ├── Placeholder "Enter your password..."
      │              └── Trailing Icon (eye toggle)
      ├── Submit Section
      │    └── PrimaryButton "Sign In →"
      ├── Social Login Section
      │    ├── Divider (implicit)
      │    └── Social Button Row
      │         ├── FacebookButton (circle, f icon)
      │         ├── GoogleButton (circle, G icon)
      │         └── InstagramButton (circle, camera icon)
      └── Footer Section
           ├── TextLink "Don't have an account? Sign Up."
           └── TextLink "Forgot Password"
```

**Detailed Component Analysis:**

| Element | Visual Details | User Interactions | Reusable |
|---------|---------------|-------------------|----------|
| Header Curve | Sage green (#9AAD5C), curved bottom edge (~120px height) | None | Yes |
| AppLogo | White variant, 4 circles, ~40px | None | Yes |
| Title | "Sign In To freud.ai", italic serif, white, ~24px | None | Yes |
| Email Label | "Email Address", white, ~12px, uppercase tracking | None | Yes |
| Email Input | Rounded rect, dark fill, orange border when focused, envelope icon left | Tap to focus, keyboard input | Yes |
| Password Label | "Password", same style as email label | None | Yes |
| Password Input | Lock icon left, eye icon right (toggle), dots for hidden text | Tap to focus, toggle visibility | Yes |
| Sign In Button | Full width, tan/beige (#C4A574), "Sign In →", ~48px height | Tap to submit | Yes |
| Social Buttons | 3 circles (~48px), dark gray (#3D3D3D), icons centered | Tap to OAuth flow | Yes |
| Sign Up Link | "Don't have an account? **Sign Up.**" - Sign Up in orange | Tap on "Sign Up" | Yes |
| Forgot Link | "Forgot Password" in orange, standalone | Tap to navigate | Yes |

---

## 3. Component List

| Component Name | UI Responsibility | Reusable | Props (name: type) |
|----------------|-------------------|----------|-------------------|
| CurvedHeader | Green curved background with logo | Yes | backgroundColor: string, height: number |
| AppLogo | 4-circle logo | Yes | variant: 'light' \| 'dark', size: number |
| ScreenTitle | Italic serif title | Yes | text: string, style?: TextStyle |
| FormLabel | Uppercase small label | Yes | text: string |
| EmailInput | Email field with envelope icon | Yes | value: string, onChange: fn, error?: string, focused?: boolean |
| PasswordInput | Password field with lock + eye toggle | Yes | value: string, onChange: fn, showPassword: boolean, onToggle: fn |
| PrimaryButton | Tan full-width button | Yes | label: string, onPress: fn, icon?: 'arrow' \| 'lock', loading?: boolean |
| SocialLoginButton | Circular social auth button | Yes | provider: 'facebook' \| 'google' \| 'instagram', onPress: fn |
| SocialLoginRow | Horizontal row of social buttons | Yes | providers: string[], onPress: (provider) => void |
| TextLink | Text with tappable portion | Yes | prefix?: string, linkText: string, onPress: fn |
| FooterLinks | Container for bottom links | No | children: ReactNode |

---

## 4. Responsibility Split

### UI Layer
- Render curved header with centered logo
- Display form fields with proper spacing (16-24px gaps)
- Show focus states on inputs (orange border)
- Render social buttons in horizontal row with equal spacing
- Position footer links at bottom with adequate touch targets

### Logic Layer
- Validate email format on blur/submit
- Validate password is not empty
- Handle sign in API call
- Handle OAuth flows for social login (Facebook, Google, Instagram)
- Navigate to Sign Up screen
- Navigate to Forgot Password screen
- Store auth token on successful login
- Handle authentication errors

---

## 5. State Definition

```
Local State:
- email: string
- password: string
- showPassword: boolean
- isEmailFocused: boolean
- isPasswordFocused: boolean
- emailError: string | null
- passwordError: string | null

Async State:
- signInStatus: 'idle' | 'loading' | 'success' | 'error'
- signInError: string | null

Shared / Global State:
- isAuthenticated: boolean (set on success)
- authToken: string | null
- user: User | null
```

---

## 6. Data Models

```typescript
interface SignInCredentials {
  email: string;
  password: string;
}

interface SignInResponse {
  token: string;
  refreshToken: string;
  user: User;
}

interface User {
  id: string;
  email: string;
  name?: string;
  avatarUrl?: string;
  hasCompletedProfile: boolean;
}

interface SocialAuthProvider {
  provider: 'facebook' | 'google' | 'instagram';
  accessToken: string;
}
```

---

## 7. Navigation

- **Route name**: `SignIn`
- **Incoming parameters**:
  - returnTo?: string (screen to return to after auth)
  - prefillEmail?: string (from sign up or other flows)
- **Outgoing targets**:
  - → `Home` or `ProfileSetup` on successful sign in (based on user.hasCompletedProfile)
  - → `SignUp` via "Sign Up" link
  - → `ForgotPassword` via "Forgot Password" link
- **Trigger conditions**:
  - Successful authentication → check profile completion → navigate
  - Tap "Sign Up" → SignUp screen
  - Tap "Forgot Password" → ForgotPassword screen

---

## 8. UI States & Edge Cases

- **Default**: Empty form, no errors
- **Focused**: Orange border on active input
- **Filled**: User data visible in email, dots in password
- **Loading**: Button shows loading spinner, inputs disabled
- **Error**:
  - Invalid credentials: Show error toast/message
  - Network error: Show retry option
- **Disabled**: Button disabled when form is empty or invalid
- **Accessibility**:
  - Email input: type="email", autocomplete="email"
  - Password input: type="password", autocomplete="current-password"
  - Social buttons need aria-labels ("Sign in with Facebook", etc.)
  - Eye toggle announces "Show password" / "Hide password"

---

## 9. Implementation Breakdown

```
Step 1: Create CurvedHeader component with SVG curved path or borderRadius
Step 2: Build EmailInput with leading icon and focus border state
Step 3: Build PasswordInput with leading lock icon and trailing eye toggle
Step 4: Create FormLabel component with uppercase styling
Step 5: Layout form section with proper vertical spacing
Step 6: Create SocialLoginButton and SocialLoginRow components
Step 7: Create TextLink component for footer links
Step 8: Wire form state and validation
Step 9: Implement sign in API integration
Step 10: Implement OAuth social login flows
Step 11: Wire navigation to Sign Up and Forgot Password
Step 12: Handle success/error states with appropriate feedback
```

---

## 10. Open Issues

- [ ] Exact curve shape for header (bezier? ellipse?)
- [ ] Instagram OAuth availability (not commonly supported)
- [ ] Social button exact colors and icon sources
- [ ] Password minimum requirements not shown
- [ ] Remember me / Keep signed in option not shown
- [ ] Biometric login option not shown
- [ ] Error message display location not shown in design

---

---

# Screen 12: `Sign_In_&_Sign_Up_Screen_02.png`

## 1. Purpose

- **User goal**: Create a new account in the app
- **Primary actions**: Enter email, password, confirm password and sign up
- **When/why**: Displayed when new user taps "Sign Up" from Welcome screen or Sign In screen

---

## 2. UI Structure (Visual Only)

```
Screen
 └── Full Screen Container (dark brown background)
      ├── Header Section (curved olive/sage green background)
      │    └── AppLogo (white 4-circle clover, centered)
      ├── Title Section
      │    └── Title "Sign Up For Free" (white, serif/italic)
      ├── Form Section
      │    ├── Email Field Group
      │    │    ├── Label "Email Address"
      │    │    ├── TextInput (ERROR STATE)
      │    │    │    ├── Leading Icon (envelope)
      │    │    │    ├── Placeholder "Enter your email..."
      │    │    │    └── Orange border (error indicator)
      │    │    └── Error Message Row
      │    │         ├── Warning Icon (triangle ⚠)
      │    │         └── Error Text "Invalid Email Address!!!"
      │    ├── Password Field Group
      │    │    ├── Label "Password"
      │    │    └── PasswordInput
      │    │         ├── Leading Icon (lock)
      │    │         ├── Placeholder "Enter your password..."
      │    │         └── Trailing Icon (eye toggle)
      │    └── Password Confirmation Field Group
      │         ├── Label "Password Confirmation"
      │         └── PasswordInput
      │              ├── Leading Icon (lock)
      │              ├── Placeholder "Enter your password..."
      │              └── Trailing Icon (eye toggle)
      ├── Submit Section
      │    └── PrimaryButton "Sign Up →"
      └── Footer Section
           └── TextLink "Already have an account? Sign In."
```

**Detailed Component Analysis:**

| Element | Visual Details | User Interactions | Reusable |
|---------|---------------|-------------------|----------|
| Header Curve | Same as Sign In - sage green curved | None | Yes |
| Title | "Sign Up For Free", italic serif, white | None | Yes |
| Email Input (Error) | Orange border, empty/placeholder visible | Tap to focus, type | Yes |
| Error Row | Orange warning triangle + "Invalid Email Address!!!" text | None | Yes |
| Password Input | Same as Sign In | Toggle visibility | Yes |
| Confirm Password Input | Identical to Password input | Toggle visibility | Yes |
| Sign Up Button | Full width tan, "Sign Up →" | Tap to submit | Yes |
| Sign In Link | "Already have an account? **Sign In.**" | Tap "Sign In" | Yes |

---

## 3. Component List

| Component Name | UI Responsibility | Reusable | Props (name: type) |
|----------------|-------------------|----------|-------------------|
| CurvedHeader | Green curved background with logo | Yes | (same as Sign In) |
| ScreenTitle | "Sign Up For Free" | Yes | text: string |
| FormLabel | Field labels | Yes | text: string |
| EmailInput | Email field | Yes | value: string, error?: string, ... |
| FormErrorMessage | Error display with icon | Yes | message: string, icon?: 'warning' \| 'error' |
| PasswordInput | Password field with toggle | Yes | (same as Sign In) |
| PrimaryButton | "Sign Up →" | Yes | label: string, onPress: fn |
| TextLink | Footer link | Yes | prefix: string, linkText: string, onPress: fn |

---

## 4. Responsibility Split

### UI Layer
- Render same curved header as Sign In
- Display 3 form fields with proper spacing
- Show error state: orange border + error message below field
- Error message has warning icon (triangle) + red/orange text
- Footer has single link to Sign In

### Logic Layer
- Validate email format (show "Invalid Email Address!!!" on invalid)
- Validate password requirements (length, complexity)
- Validate password confirmation matches password
- Handle sign up API call
- Navigate to appropriate screen on success
- Handle registration errors

---

## 5. State Definition

```
Local State:
- email: string
- password: string
- passwordConfirmation: string
- showPassword: boolean
- showPasswordConfirmation: boolean
- emailError: string | null
- passwordError: string | null
- confirmationError: string | null

Async State:
- signUpStatus: 'idle' | 'loading' | 'success' | 'error'
- signUpError: string | null

Derived State:
- isFormValid: boolean
- passwordsMatch: boolean
```

---

## 6. Data Models

```typescript
interface SignUpCredentials {
  email: string;
  password: string;
  passwordConfirmation: string;
}

interface SignUpResponse {
  token: string;
  user: User;
  requiresEmailVerification: boolean;
}

interface ValidationError {
  field: 'email' | 'password' | 'passwordConfirmation';
  message: string;
}
```

---

## 7. Navigation

- **Route name**: `SignUp`
- **Incoming parameters**:
  - prefillEmail?: string
- **Outgoing targets**:
  - → `ProfileSetup` on successful registration
  - → `EmailVerification` if email verification required
  - → `SignIn` via "Sign In" link
- **Trigger conditions**:
  - Successful sign up → profile setup or verification
  - Tap "Sign In" → SignIn screen

---

## 8. UI States & Edge Cases

- **Default**: Empty form, no errors
- **Typing**: Real-time validation optional
- **Error**:
  - Orange border on invalid field
  - Warning icon + error message below field
  - "Invalid Email Address!!!" for email
  - "Passwords do not match" for confirmation
- **Loading**: Button shows spinner
- **Success**: Navigate away
- **Accessibility**:
  - Error messages linked to inputs via aria-describedby
  - Warning icon should be decorative (aria-hidden)
  - Focus should move to first error field

---

## 9. Implementation Breakdown

```
Step 1: Reuse CurvedHeader from Sign In
Step 2: Update title to "Sign Up For Free"
Step 3: Add FormErrorMessage component with warning icon
Step 4: Create third password field for confirmation
Step 5: Wire validation for all 3 fields
Step 6: Implement real-time or on-blur email validation
Step 7: Implement password match validation
Step 8: Wire sign up API integration
Step 9: Handle success flow (profile setup or verification)
Step 10: Wire navigation to Sign In
```

---

## 10. Open Issues

- [ ] Password requirements not displayed (min length, special chars?)
- [ ] Password strength indicator not shown
- [ ] Terms of service / Privacy policy acceptance not shown
- [ ] Email verification flow not shown in this design
- [ ] Social sign up options not shown (different from Sign In?)
- [ ] Error message style: "!!!" seems aggressive - confirm copy

---

---

# Screen 13: `Sign_In_&_Sign_Up_Screen_03.png`

## 1. Purpose

- **User goal**: Choose method to reset forgotten password
- **Primary actions**: Select recovery method and proceed
- **When/why**: Displayed when user taps "Forgot Password" from Sign In screen

---

## 2. UI Structure (Visual Only)

```
Screen
 └── Full Screen Container (dark brown background)
      ├── Header Section
      │    └── BackButton (circular, left arrow icon)
      ├── Title Section
      │    ├── Title "Forgot Password" (white, serif/italic, large)
      │    └── Subtitle "Select contact details where you want to reset
      │                  your passwrod." (gray, smaller) [NOTE: typo in design]
      ├── Options Section
      │    ├── SelectableCard "Use 2FA"
      │    │    ├── Icon (padlock with circles, green/brown pattern)
      │    │    └── Label "Use 2FA"
      │    ├── SelectableCard "Password" (SELECTED)
      │    │    ├── Icon (geometric 4-quadrant pattern)
      │    │    ├── Label "Password"
      │    │    └── Selection Border (green/tan outline)
      │    └── SelectableCard "Google Authenticator"
      │         ├── Icon (X pattern, green/brown)
      │         └── Label "Google Authenticator"
      └── Action Section
           └── PrimaryButton "Send Password" (with lock icon)
```

**Detailed Component Analysis:**

| Element | Visual Details | User Interactions | Reusable |
|---------|---------------|-------------------|----------|
| Back Button | Circular (~40px), dark border, left chevron/arrow | Tap to go back | Yes |
| Title | "Forgot Password", white, serif italic, ~28px | None | Yes |
| Subtitle | Gray text, ~14px, explains action | None | Yes |
| Option Card (Unselected) | Dark brown bg, rounded rect, ~72px height | Tap to select | Yes |
| Option Card (Selected) | Same + green/tan border outline (~2px) | Shows selected state | Yes |
| Card Icon | ~48px circular area with geometric pattern | None | Yes |
| Card Label | White text, ~16px, right of icon | None | Yes |
| Send Password Button | Tan bg, "Send Password", lock icon right | Tap to proceed | Yes |

---

## 3. Component List

| Component Name | UI Responsibility | Reusable | Props (name: type) |
|----------------|-------------------|----------|-------------------|
| BackButton | Circular back navigation button | Yes | onPress: fn |
| ScreenTitle | Large title text | Yes | text: string |
| ScreenSubtitle | Smaller gray description | Yes | text: string |
| SelectableOptionCard | Card with icon, label, selection state | Yes | icon: ImageSource, label: string, selected: boolean, onSelect: fn |
| OptionCardIcon | Custom geometric icon | No | type: '2fa' \| 'password' \| 'authenticator' |
| PrimaryButton | Action button with optional icon | Yes | label: string, onPress: fn, rightIcon?: string |

---

## 4. Responsibility Split

### UI Layer
- Render back button in top-left
- Display title and subtitle with proper hierarchy
- Render 3 selectable option cards vertically
- Show selected state with border highlight
- Render submit button at bottom

### Logic Layer
- Track selected recovery method
- Validate that a method is selected
- Handle "Send Password" action based on selected method
- Navigate back on back button press
- Different API calls based on method selected

---

## 5. State Definition

```
Local State:
- selectedMethod: 'use2fa' | 'password' | 'googleAuthenticator' | null

Async State:
- sendStatus: 'idle' | 'loading' | 'success' | 'error'

Shared / Global State:
- userEmail: string (from previous screen or stored)
- userPhoneNumber?: string (masked, for 2FA)
```

---

## 6. Data Models

```typescript
type RecoveryMethod = 'use2fa' | 'password' | 'googleAuthenticator';

interface RecoveryOption {
  id: RecoveryMethod;
  label: string;
  icon: ImageSource;
  available: boolean;
}

interface PasswordResetRequest {
  method: RecoveryMethod;
  email: string;
}

interface PasswordResetResponse {
  success: boolean;
  maskedDestination: string; // e.g., "****-****-***24"
  expiresIn: number; // seconds
}
```

---

## 7. Navigation

- **Route name**: `ForgotPassword`
- **Incoming parameters**:
  - email?: string (from sign in attempt)
- **Outgoing targets**:
  - → `SignIn` via back button
  - → `VerificationCodeSent` (Screen 14) on success
- **Trigger conditions**:
  - Back button → previous screen
  - "Send Password" with valid selection → verification screen

---

## 8. UI States & Edge Cases

- **Default**: No method selected, button may be disabled
- **Selected**: One card shows selection border
- **Loading**: Button shows spinner
- **Error**: Toast or inline error for failed request
- **Unavailable Method**: Some methods may be grayed out if not set up
- **Accessibility**:
  - Cards should be radio button semantics (role="radio", aria-checked)
  - Card group should be role="radiogroup"
  - Back button needs aria-label "Go back"

---

## 9. Implementation Breakdown

```
Step 1: Create BackButton component (reusable circular button)
Step 2: Create SelectableOptionCard with selection border state
Step 3: Create custom icons for each recovery method
Step 4: Layout cards vertically with ~16px gap
Step 5: Wire selection state (only one can be selected)
Step 6: Enable/disable button based on selection
Step 7: Implement API call for each recovery method
Step 8: Navigate to verification screen on success
Step 9: Wire back navigation
```

---

## 10. Open Issues

- [ ] **TYPO**: "passwrod" should be "password" in subtitle
- [ ] What exactly is "Password" option? (Email reset link?)
- [ ] User's email/phone needed but not shown being entered here
- [ ] Which methods are available depends on user's account setup
- [ ] "Use 2FA" vs "Google Authenticator" distinction unclear
- [ ] Icon assets needed for all 3 options

---

---

# Screen 14: `Sign_In_&_Sign_Up_Screen_04.png`

## 1. Purpose

- **User goal**: Understand verification code was sent, resend if needed
- **Primary actions**: Wait for code, resend if not received, or dismiss
- **When/why**: Displayed after user requests password reset, shows confirmation

---

## 2. UI Structure (Visual Only)

```
Screen
 └── Full Screen Container (dark brown background with overlay)
      ├── Header Section
      │    └── BackButton (circular, faded/dark)
      ├── Modal Card (centered, raised)
      │    ├── Illustration Section
      │    │    └── Image: Hand entering code on keypad/safe
      │    │         (olive green bg, hand reaching to numbered buttons)
      │    ├── Content Section
      │    │    ├── Title "We've Sent Verification"
      │    │    │       "Code to ****-****-***24"
      │    │    └── Subtitle "Didn't receive the link? Then re-send
      │    │                  the password below! 🔑"
      │    ├── Primary Action
      │    │    └── PrimaryButton "Re-Send Password" (with lock icon)
      │    └── Secondary Action
      │         └── DisabledButton "Send Password" (grayed out, with lock)
      └── Dismiss Button
           └── CircleButton (white, X icon, bottom center)
```

**Detailed Component Analysis:**

| Element | Visual Details | User Interactions | Reusable |
|---------|---------------|-------------------|----------|
| Background | Dark with semi-transparent overlay | Tap outside to dismiss? | No |
| Back Button | Same style but darker/faded | Tap to go back | Yes |
| Modal Card | Rounded corners (~16px), dark brown bg, elevated | None | Yes |
| Illustration | ~200px height, olive green bg, hand + keypad art | None | No |
| Title | "We've Sent Verification Code to ****-****-***24", white, bold | None | Yes |
| Masked Number | Phone/email masked with asterisks, last 2 digits visible | None | Yes |
| Subtitle | Gray text with key emoji 🔑, ~14px | None | Yes |
| Re-Send Button | Tan bg, "Re-Send Password", lock icon, full width | Tap to resend | Yes |
| Send Password Button | Grayed out, same style but disabled | None (disabled) | Yes |
| Dismiss Button | White circle (~56px), X icon, floating at bottom | Tap to close | Yes |

---

## 3. Component List

| Component Name | UI Responsibility | Reusable | Props (name: type) |
|----------------|-------------------|----------|-------------------|
| ModalOverlay | Dark semi-transparent background | Yes | visible: boolean, onDismiss?: fn |
| ModalCard | Elevated card container | Yes | children: ReactNode |
| VerificationIllustration | Keypad/code entry artwork | No | - |
| MaskedContact | Shows masked phone/email | Yes | value: string, visibleChars: number |
| PrimaryButton | Active action button | Yes | (same as before) |
| DisabledButton | Grayed out inactive button | Yes | label: string, icon?: string |
| DismissButton | White circular X button | Yes | onPress: fn |

---

## 4. Responsibility Split

### UI Layer
- Render modal overlay with dimmed background
- Display modal card with proper elevation/shadow
- Show illustration at top of card
- Display title with masked destination
- Show descriptive subtitle with emoji
- Render action buttons (primary active, secondary disabled)
- Position dismiss button at bottom

### Logic Layer
- Track resend cooldown timer
- Handle resend API call
- Update masked destination from API response
- Handle dismiss action
- Navigate to code entry screen (not shown in this batch)

---

## 5. State Definition

```
Local State:
- canResend: boolean
- resendCooldown: number (seconds remaining)

Async State:
- resendStatus: 'idle' | 'loading' | 'success' | 'error'

Shared / Global State:
- maskedDestination: string (from previous API response)
- resetToken: string (for API calls)
```

---

## 6. Data Models

```typescript
interface VerificationSentState {
  maskedDestination: string; // "****-****-***24"
  destinationType: 'phone' | 'email';
  expiresAt: timestamp;
  canResendAt: timestamp;
}

interface ResendCodeResponse {
  success: boolean;
  newExpiresAt: timestamp;
  canResendAt: timestamp;
}
```

---

## 7. Navigation

- **Route name**: `VerificationCodeSent`
- **Incoming parameters**:
  - maskedDestination: string
  - destinationType: 'phone' | 'email'
  - resetToken: string
- **Outgoing targets**:
  - → `ForgotPassword` via back button
  - → `SignIn` via dismiss button (or closes modal)
  - → `EnterVerificationCode` when user receives code (not shown)
- **Trigger conditions**:
  - Back button → previous screen
  - Dismiss (X) → close modal, return to sign in
  - Code received → navigate to code entry (external trigger)

---

## 8. UI States & Edge Cases

- **Default**: Re-Send active, Send Password disabled
- **Cooldown**: Re-Send may be disabled with timer showing
- **Resending**: Button shows loading spinner
- **Resent**: Success feedback, reset cooldown
- **Error**: Show error toast if resend fails
- **Accessibility**:
  - Modal should trap focus
  - Dismiss button: aria-label "Close"
  - Announce "Verification code sent to [destination]"

---

## 9. Implementation Breakdown

```
Step 1: Create ModalOverlay component with backdrop
Step 2: Create ModalCard with proper styling and elevation
Step 3: Add VerificationIllustration asset
Step 4: Create MaskedContact display component
Step 5: Layout content within modal card
Step 6: Implement resend cooldown timer logic
Step 7: Wire resend API call
Step 8: Create DismissButton component
Step 9: Handle modal dismiss behavior
Step 10: Wire navigation flows
```

---

## 10. Open Issues

- [ ] Why are there TWO buttons (Re-Send and Send Password)?
- [ ] What's the difference between "Re-Send Password" and "Send Password"?
- [ ] Cooldown timer between resends not visually shown
- [ ] Code entry screen not shown in this batch
- [ ] Illustration asset source needed
- [ ] Modal dismiss behavior (tap outside? Only X button?)
- [ ] Key emoji 🔑 cross-platform rendering

---

---

# Screen 15: `Profile_Setup_&_Completion_Screen_01.png`

## 1. Purpose

- **User goal**: Select or upload a profile avatar during account setup
- **Primary actions**: Browse preset avatars, upload custom image, or skip
- **When/why**: First step of profile setup after successful registration

---

## 2. UI Structure (Visual Only)

```
Screen
 └── Full Screen Container (dark brown background)
      ├── Header Section
      │    ├── BackButton (circular, left arrow)
      │    └── HeaderTitle "Profile Setup" (white, next to back button)
      ├── Avatar Selection Section
      │    ├── Navigation Indicator (top)
      │    │    └── Droplet/Arrow pointing up (suggests scroll/swipe up)
      │    ├── Main Avatar Display
      │    │    └── Large Circular Avatar (~180px)
      │    │         └── Current: Pie-chart pattern (green, tan, brown segments)
      │    ├── Navigation Indicator (bottom)
      │    │    └── Droplet/Arrow pointing down (suggests scroll/swipe down)
      │    └── Decorative Circles (partial, in corners)
      ├── Content Section
      │    ├── Title "Select your Avatar" (white, serif, bold)
      │    └── Subtitle "We have a set of customizable avatar. Or you can
      │                  upload your own image from your local file."
      └── Upload Section
           ├── UploadButton (circular, dashed border, + icon)
           └── Label "Or upload your profile"
```

**Detailed Component Analysis:**

| Element | Visual Details | User Interactions | Reusable |
|---------|---------------|-------------------|----------|
| Back Button | Circular, dark border, left arrow | Tap to go back | Yes |
| Header Title | "Profile Setup", white, ~18px, inline with back | None | Yes |
| Avatar Display | Large circle (~180px), brown border (~8px) | Swipe up/down to change | Yes |
| Avatar Content | Current shows geometric pie pattern | Changes on swipe | Yes |
| Nav Indicators | Small droplet shapes above/below avatar | Suggest swipe direction | Yes |
| Decorative Circles | Partial dark circles at corners | None | Yes |
| Title | "Select your Avatar", white serif, ~24px | None | Yes |
| Subtitle | Gray text, ~14px, multi-line | None | Yes |
| Upload Button | Dashed circle border (~80px), + icon center | Tap to open picker | Yes |
| Upload Label | "Or upload your profile", gray, ~14px | None | Yes |

---

## 3. Component List

| Component Name | UI Responsibility | Reusable | Props (name: type) |
|----------------|-------------------|----------|-------------------|
| HeaderWithBack | Back button + title row | Yes | title: string, onBack: fn |
| AvatarCarousel | Swipeable avatar selector | Yes | avatars: Avatar[], selected: number, onSelect: fn |
| AvatarDisplay | Large circular avatar frame | Yes | source: ImageSource, size: number, borderColor: string |
| SwipeIndicator | Droplet arrow showing swipe direction | Yes | direction: 'up' \| 'down' |
| DecorativeCircles | Background decoration | Yes | positions: array |
| ScreenTitle | Section title | Yes | text: string |
| ScreenSubtitle | Description text | Yes | text: string |
| UploadButton | Dashed circle with plus | Yes | onPress: fn, size: number |
| ActionLabel | Small label below button | Yes | text: string |

---

## 4. Responsibility Split

### UI Layer
- Render header with back button and title inline
- Display large avatar with decorative border
- Show swipe indicators above and below avatar
- Render preset avatar carousel (swipeable)
- Display title and subtitle text
- Render dashed upload button with plus icon
- Position decorative circles in background

### Logic Layer
- Track currently selected avatar index
- Handle swipe gestures to change avatar
- Handle upload button tap → open image picker
- Process selected/uploaded image
- Store avatar selection
- Navigate to next setup step

---

## 5. State Definition

```
Local State:
- selectedAvatarIndex: number
- customAvatar: ImageSource | null
- isUploading: boolean

Async State:
- uploadStatus: 'idle' | 'uploading' | 'success' | 'error'
- availableAvatars: Avatar[] (may be fetched)

Derived State:
- currentAvatarSource: ImageSource (preset or custom)
- hasCustomAvatar: boolean
```

---

## 6. Data Models

```typescript
interface Avatar {
  id: string;
  source: ImageSource;
  name?: string;
  category?: string;
}

interface AvatarSelection {
  type: 'preset' | 'custom';
  presetId?: string;
  customImageUri?: string;
}

interface ImagePickerResult {
  uri: string;
  width: number;
  height: number;
  type: string;
}
```

---

## 7. Navigation

- **Route name**: `ProfileSetupAvatar` or `ProfileSetup` with step=1
- **Incoming parameters**:
  - userId: string
  - fromRegistration: boolean
- **Outgoing targets**:
  - → Previous screen via back button
  - → `ProfileSetupName` (next step) via implicit continue or swipe
  - → Image picker modal via upload button
- **Trigger conditions**:
  - Back button → go back (cancel setup?)
  - Select avatar + continue → next step
  - Upload + select image → show in display, enable continue

---

## 8. UI States & Edge Cases

- **Default**: First preset avatar shown
- **Browsing**: User swipes through presets
- **Custom Selected**: Custom upload replaces preset display
- **Uploading**: Loading indicator on upload button
- **Upload Error**: Show error, revert to previous
- **No Selection**: May need to select before continuing (or has default)
- **Accessibility**:
  - Avatar carousel: announce "Avatar X of Y, [description]"
  - Upload button: "Upload custom profile picture"
  - Swipe indicators should be decorative (aria-hidden)

---

## 9. Implementation Breakdown

```
Step 1: Create HeaderWithBack component
Step 2: Build AvatarCarousel with vertical swipe gesture
Step 3: Create AvatarDisplay with thick border styling
Step 4: Add SwipeIndicator components (droplet arrows)
Step 5: Create UploadButton with dashed border style
Step 6: Layout content section with title/subtitle
Step 7: Implement swipe gesture handling (react-native-gesture-handler)
Step 8: Wire image picker for upload functionality
Step 9: Handle avatar selection state
Step 10: Add decorative background circles
Step 11: Wire navigation to next step
```

---

## 10. Open Issues

- [ ] How many preset avatars available?
- [ ] Are avatars vertical scroll or carousel?
- [ ] Is there a "Continue" / "Next" button? (Not visible in design)
- [ ] Can user skip avatar selection?
- [ ] What avatar format? (SVG geometric patterns?)
- [ ] Image upload size/format restrictions
- [ ] Back button behavior: cancel entire setup or just this step?
- [ ] Navigation indicators (droplets) exact interaction

---

---

## New Components Identified (Batch 3)

### High Priority
| Component | Description |
|-----------|-------------|
| CurvedHeader | Green curved header with centered logo |
| EmailInput | Email field with envelope icon, validation states |
| PasswordInput | Password field with lock icon, eye toggle |
| FormErrorMessage | Error display with warning icon |
| BackButton | Circular back navigation button |
| HeaderWithBack | Header row with back button + title |

### Medium Priority
| Component | Description |
|-----------|-------------|
| SocialLoginButton | Circular OAuth provider button |
| SocialLoginRow | Container for social login buttons |
| SelectableOptionCard | Radio-style selection card |
| ModalCard | Elevated modal container |
| ModalOverlay | Dimmed backdrop for modals |
| DismissButton | Circular X close button |
| AvatarCarousel | Swipeable avatar picker |
| AvatarDisplay | Large circular avatar frame |
| UploadButton | Dashed circle upload trigger |

### Lower Priority
| Component | Description |
|-----------|-------------|
| MaskedContact | Displays masked phone/email |
| SwipeIndicator | Droplet arrow for swipe hint |
| OptionCardIcon | Geometric icons for recovery methods |

---

## Form Input Specifications

### EmailInput
```typescript
interface EmailInputProps {
  value: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
  placeholder?: string;
  error?: string;
  focused?: boolean;
  disabled?: boolean;
  autoComplete?: 'email' | 'username';
}

// Visual specs:
// - Height: 56px
// - Border radius: 12px
// - Background: dark brown (#2A2220)
// - Border: 2px, transparent default, orange (#E8853A) on focus/error
// - Leading icon: envelope, 24px, gray
// - Font size: 16px
// - Placeholder color: gray (#8A8A8A)
```

### PasswordInput
```typescript
interface PasswordInputProps {
  value: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
  placeholder?: string;
  error?: string;
  showPassword: boolean;
  onToggleVisibility: () => void;
  disabled?: boolean;
  autoComplete?: 'current-password' | 'new-password';
}

// Visual specs:
// - Same as EmailInput
// - Leading icon: lock, 24px
// - Trailing icon: eye / eye-off, 24px, tappable
```

---

## Next Batch Preview

**Batch 4** will cover:
- Profile_Setup_&_Completion_Screen_02.png
- Profile_Setup_&_Completion_Screen_03.png
- Profile_Setup_&_Completion_Screen_04.png
- Profile_Setup_&_Completion_Screen_05.png
- Profile_Setup_&_Completion_Screen_06.png
