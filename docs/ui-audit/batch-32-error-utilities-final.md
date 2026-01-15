# Batch 32: Error & Other Utilities (Final)

## Screens Covered
- **Screen 155**: Error & Utilities 02 - NoInternet
- **Screen 156**: Error & Utilities 03 - InternalError500
- **Screen 157**: Error & Utilities 04 - Maintenance
- **Screen 158**: Error & Utilities 05 - NotAllowed403

---

## Screen 155: Error & Utilities 02 - NoInternet

### 1. Purpose
Display a friendly offline state when the user's device has no internet connectivity, with options to retry or navigate home.

### 2. UI Structure
```
├── StatusBar
├── BackButton (top-left)
├── ContentSection
│   ├── OfflineIllustration (hand holding phone with WiFi icon)
│   ├── Title ("No Internet!")
│   └── Subtitle ("It seems you don't have active internet.")
├── RefreshButton ("Refresh or Try Again")
└── HomeButton ("Take Me Home")
```

### 3. Component List
| Component | Variant | Notes |
|-----------|---------|-------|
| `StatusBar` | dark | Standard status bar |
| `BackButton` | icon | Top-left navigation |
| `OfflineIllustration` | wifi-phone | Hand holding phone illustration |
| `ErrorTitle` | large | "No Internet!" |
| `ErrorSubtitle` | muted | Connectivity message |
| `Button` | secondary-icon | "Refresh or Try Again" with refresh icon |
| `Button` | primary-icon | "Take Me Home" with home icon |

### 4. Responsibility Split

**UI Layer:**
- Render offline illustration
- Display error messaging
- Handle button press animations
- Show loading state on retry

**Logic Layer:**
- Detect network connectivity
- Handle retry/refresh logic
- Monitor connectivity restoration
- Auto-dismiss when connection restored

### 5. State Definition
```typescript
interface NoInternetState {
  // Connectivity
  isConnected: boolean;
  connectionType: 'wifi' | 'cellular' | 'none';

  // Retry state
  isRetrying: boolean;
  retryCount: number;

  // Navigation
  canGoBack: boolean;
  lastRoute: string;
}
```

### 6. Data Models
```typescript
interface ConnectivityState {
  isConnected: boolean;
  type: 'wifi' | 'cellular' | 'ethernet' | 'none' | 'unknown';
  isInternetReachable: boolean | null;
  details: {
    isConnectionExpensive: boolean;
    cellularGeneration: '2g' | '3g' | '4g' | '5g' | null;
    ssid: string | null;
  };
}

// Network event handler
const handleConnectivityChange = (state: ConnectivityState) => {
  if (state.isConnected && state.isInternetReachable) {
    // Auto-navigate back to previous screen
    navigation.goBack();
  }
};
```

### 7. Navigation
- **Entry Points**: Network failure during any operation
- **Exit Points**:
  - "Refresh or Try Again" → Retry last operation
  - "Take Me Home" → Home screen
  - Auto-dismiss → Previous screen (when connected)

### 8. UI States & Edge Cases
| State | Behavior |
|-------|----------|
| Retrying | Show loading indicator on button |
| Still Offline | Reset button, show message |
| Connected | Auto-dismiss, return to previous |
| Multiple Retries | Consider showing settings link |

### 9. Implementation Breakdown

**Phase 1: Layout**
- Centered content layout
- Illustration above text
- Stacked action buttons

**Phase 2: Components**
- Build OfflineIllustration
- Create refresh button with loading state
- Implement connectivity listener

**Phase 3: Connectivity**
- Use @react-native-community/netinfo
- Set up connectivity listener
- Handle auto-recovery

### 10. Open Issues
- [ ] Should auto-dismiss when connection restored?
- [ ] Link to device WiFi settings?
- [ ] Cache last operation for auto-retry?

---

## Screen 156: Error & Utilities 03 - InternalError500

### 1. Purpose
Display a server error (500) page when backend services experience issues, with option to navigate home.

### 2. UI Structure
```
├── StatusBar
├── BackButton (top-left)
├── ContentSection
│   ├── ServerErrorIllustration (person with warning sign)
│   ├── Title ("Internal Error")
│   ├── Subtitle ("Whoops! Our server seems to error :(")
│   └── StatusBadge ("Status Code: 500")
└── HomeButton ("Take Me Home")
```

### 3. Component List
| Component | Variant | Notes |
|-----------|---------|-------|
| `StatusBar` | dark | Standard status bar |
| `BackButton` | icon | Top-left navigation |
| `ServerErrorIllustration` | warning-sign | Person with triangle warning |
| `ErrorTitle` | large | "Internal Error" |
| `ErrorSubtitle` | muted | Server error message |
| `StatusBadge` | error-orange | "Status Code: 500" |
| `Button` | primary-icon | "Take Me Home" |

### 4. Responsibility Split

**UI Layer:**
- Render server error illustration
- Display error messaging
- Show status code badge
- Handle navigation

**Logic Layer:**
- Log server error details
- Report to error tracking service
- Handle retry logic if applicable
- Track error frequency

### 5. State Definition
```typescript
interface ServerErrorState {
  // Error info
  statusCode: number;
  errorMessage: string;
  requestId: string | null;

  // Context
  failedEndpoint: string;
  failedMethod: string;

  // UI
  canRetry: boolean;
  isRetrying: boolean;
}
```

### 6. Data Models
```typescript
interface ServerError {
  statusCode: 500 | 502 | 503 | 504;
  message: string;
  requestId: string;
  timestamp: Date;
  endpoint: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  retryable: boolean;
}

const ERROR_CONTENT: Record<number, ErrorDisplay> = {
  500: {
    title: 'Internal Error',
    subtitle: 'Our server encountered an error',
    illustration: 'warning-sign',
    retryable: true
  },
  502: {
    title: 'Bad Gateway',
    subtitle: 'Unable to reach our servers',
    illustration: 'disconnected',
    retryable: true
  },
  503: {
    title: 'Service Unavailable',
    subtitle: 'Our service is temporarily down',
    illustration: 'maintenance',
    retryable: false
  }
};
```

### 7. Navigation
- **Entry Points**: 500-series API response
- **Exit Points**:
  - "Take Me Home" → Home screen
  - Back → Previous screen (if available)

### 8. UI States & Edge Cases
| State | Behavior |
|-------|----------|
| Retryable | Show retry button |
| Not Retryable | Only show home button |
| Repeated Errors | Show support contact |
| During Critical Flow | Offer alternative actions |

### 9. Implementation Breakdown

**Phase 1: Layout**
- Centered error content
- Status badge below subtitle
- Action button at bottom

**Phase 2: Components**
- Build ServerErrorIllustration
- Create StatusBadge with variants
- Implement error logging

**Phase 3: Error Handling**
- Set up global error boundary
- Report to Sentry/Crashlytics
- Track error patterns

### 10. Open Issues
- [ ] **GRAMMAR ERROR**: "seems to error" should be "seems to have an error" or "encountered an error"
- [ ] Should show retry button for 500 errors?
- [ ] Include request ID for support tickets?
- [ ] Different messages for 502, 503, 504?

---

## Screen 157: Error & Utilities 04 - Maintenance

### 1. Purpose
Inform users that the app is undergoing scheduled maintenance with estimated downtime countdown.

### 2. UI Structure
```
├── StatusBar
├── BackButton (top-left)
├── ContentSection
│   ├── MaintenanceIllustration (worker with tools)
│   ├── Title ("Maintenance")
│   ├── Subtitle ("We're undergoing maintenance.")
│   └── CountdownBadge ("Come back in 9h 12m")
└── HomeButton ("Take Me Home")
```

### 3. Component List
| Component | Variant | Notes |
|-----------|---------|-------|
| `StatusBar` | dark | Standard status bar |
| `BackButton` | icon | Top-left navigation |
| `MaintenanceIllustration` | worker-tools | Construction worker image |
| `ErrorTitle` | large | "Maintenance" |
| `ErrorSubtitle` | muted | Maintenance message |
| `CountdownBadge` | timer | Live countdown with clock icon |
| `Button` | primary-icon | "Take Me Home" |

### 4. Responsibility Split

**UI Layer:**
- Render maintenance illustration
- Display countdown timer (live updating)
- Show status messaging
- Handle home navigation

**Logic Layer:**
- Fetch maintenance schedule from API
- Calculate remaining time
- Update countdown every minute
- Auto-refresh when maintenance ends

### 5. State Definition
```typescript
interface MaintenanceState {
  // Schedule
  maintenanceStart: Date;
  maintenanceEnd: Date;
  estimatedDuration: number; // minutes

  // Countdown
  remainingTime: {
    hours: number;
    minutes: number;
  };

  // Status
  isActive: boolean;
  message: string;
}
```

### 6. Data Models
```typescript
interface MaintenanceSchedule {
  id: string;
  type: 'scheduled' | 'emergency';
  startTime: Date;
  estimatedEndTime: Date;
  affectedServices: string[];
  message: string;
  updateUrl: string | null;
  notificationSent: boolean;
}

// Countdown formatter
const formatCountdown = (endTime: Date): string => {
  const now = new Date();
  const diff = endTime.getTime() - now.getTime();

  if (diff <= 0) return 'Ending soon';

  const hours = Math.floor(diff / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

  return `Come back in ${hours}h ${minutes}m`;
};
```

### 7. Navigation
- **Entry Points**: App launch during maintenance, API maintenance response
- **Exit Points**:
  - "Take Me Home" → Home screen (limited functionality)
  - Auto-dismiss → Full app (when maintenance ends)

### 8. UI States & Edge Cases
| State | Behavior |
|-------|----------|
| Countdown Active | Live updating timer |
| Ending Soon | "Ending soon" message |
| Maintenance Over | Auto-refresh, navigate to app |
| Extended | Update estimated time |
| Emergency | Different messaging tone |

### 9. Implementation Breakdown

**Phase 1: Layout**
- Centered maintenance content
- Animated countdown badge
- Home button at bottom

**Phase 2: Components**
- Build MaintenanceIllustration
- Create CountdownBadge with live timer
- Implement auto-refresh logic

**Phase 3: Schedule Integration**
- Poll maintenance status endpoint
- Handle schedule changes
- Notify when maintenance ends

### 10. Open Issues
- [ ] Should countdown update live (every minute)?
- [ ] What functionality is available during maintenance?
- [ ] Push notification when maintenance ends?
- [ ] Different message for emergency vs scheduled?

---

## Screen 158: Error & Utilities 05 - NotAllowed403

### 1. Purpose
Display a permission denied (403) error when user attempts to access restricted content or features.

### 2. UI Structure
```
├── StatusBar
├── BackButton (top-left)
├── ContentSection
│   ├── ForbiddenIllustration (person with STOP sign)
│   ├── Title ("Not Allowed")
│   └── Subtitle ("Hey, you don't have permission.")
├── ContactButton ("Contact Admin")
└── HomeButton ("Take Me Home")
```

### 3. Component List
| Component | Variant | Notes |
|-----------|---------|-------|
| `StatusBar` | dark | Standard status bar |
| `BackButton` | icon | Top-left navigation |
| `ForbiddenIllustration` | stop-sign | Person pointing with stop sign |
| `ErrorTitle` | large | "Not Allowed" |
| `ErrorSubtitle` | muted | Permission message |
| `Button` | secondary-icon | "Contact Admin" with phone icon |
| `Button` | primary-icon | "Take Me Home" |

### 4. Responsibility Split

**UI Layer:**
- Render forbidden illustration
- Display permission messaging
- Show contact and home buttons
- Handle button animations

**Logic Layer:**
- Log access attempt
- Track permission issues
- Handle admin contact flow
- Redirect to appropriate screen

### 5. State Definition
```typescript
interface ForbiddenState {
  // Error context
  attemptedResource: string;
  requiredPermission: string;
  userRole: string;

  // Actions
  canRequestAccess: boolean;
  adminContact: string | null;

  // Navigation
  canGoBack: boolean;
}
```

### 6. Data Models
```typescript
interface PermissionError {
  statusCode: 403;
  resource: string;
  requiredRole: UserRole;
  currentRole: UserRole;
  canRequest: boolean;
  adminEmail: string | null;
  message: string;
}

type UserRole =
  | 'guest'
  | 'patient'
  | 'premium'
  | 'professional'
  | 'psychiatrist'
  | 'admin';

const PERMISSION_MESSAGES: Record<string, string> = {
  premium_content: 'This content is for premium members only.',
  professional_only: 'This feature is for healthcare professionals.',
  admin_area: 'You need administrator access.',
  default: "Hey, you don't have permission."
};
```

### 7. Navigation
- **Entry Points**: 403 API response, unauthorized route access
- **Exit Points**:
  - "Contact Admin" → Email/support contact
  - "Take Me Home" → Home screen
  - Back → Previous screen

### 8. UI States & Edge Cases
| State | Behavior |
|-------|----------|
| Can Request Access | Show "Request Access" button |
| Premium Feature | Show upgrade option |
| Professional Only | Show verification option |
| Admin Contact | Show contact button |
| No Contact Available | Hide contact button |

### 9. Implementation Breakdown

**Phase 1: Layout**
- Centered forbidden content
- Stacked action buttons
- Illustration with stop sign

**Phase 2: Components**
- Build ForbiddenIllustration
- Create contact button with phone icon
- Implement permission context

**Phase 3: Contact Flow**
- Open email client for admin contact
- Track access requests
- Handle premium upgrade flow

### 10. Open Issues
- [ ] What opens when "Contact Admin" is pressed?
- [ ] Should show upgrade option for premium content?
- [ ] Different messages based on permission type?
- [ ] **ERROR & UTILITIES COMPLETE (5/5)** ✅

---

## Cross-Screen Analysis

### Shared Components Identified
| Component | Used In | Notes |
|-----------|---------|-------|
| `BackButton` | All screens | Top-left navigation |
| `ErrorTitle` | All screens | Large error heading |
| `ErrorSubtitle` | All screens | Descriptive message |
| `Button` | All screens | "Take Me Home" primary action |
| `ErrorIllustration` | All screens | Themed illustrations |

### Error Screen Pattern
All error screens follow consistent pattern:
1. Back button (top-left)
2. Themed illustration (centered)
3. Title (bold, large)
4. Subtitle (muted, descriptive)
5. Status/action badge (contextual)
6. Primary action button ("Take Me Home")

### State Management Strategy
- **No Internet**: Connectivity listener + auto-recovery
- **Server Error**: Global error boundary + logging
- **Maintenance**: Scheduled status polling
- **Forbidden**: Permission context + role checking

### New Issues Found

| Issue # | Screen | Severity | Description |
|---------|--------|----------|-------------|
| #42 | 156 | LOW | "seems to error" grammar error |

---

## Progress Update
- **Error & Other Utilities**: 5/5 ✅ **COMPLETE**
- **Total Progress**: 158/158 screens (100%)

---

# 🎉 UI AUDIT COMPLETE! 🎉

## Final Summary

### Screens Documented
- **Total Screens**: 158
- **Batches**: 32
- **Features Covered**: 17

### Feature Completion Status
| Feature | Screens | Status |
|---------|---------|--------|
| Splash & Loading | 4 | ✅ Complete |
| Welcome/Onboarding | 6 | ✅ Complete |
| Sign In & Sign Up | 4 | ✅ Complete |
| Profile Setup | 11 | ✅ Complete |
| Mental Health Assessment | 14 | ✅ Complete |
| Home & Mental Health Score | 7 | ✅ Complete |
| AI Therapy Chatbot | 20 | ✅ Complete |
| Mood Tracker | 11 | ✅ Complete |
| Mental Health Journal | 9 | ✅ Complete |
| Sleep Quality | 10 | ✅ Complete |
| Stress Management | 7 | ✅ Complete |
| Mindful Hours | 8 | ✅ Complete |
| Mindful Resources | 7 | ✅ Complete |
| Community Support | 10 | ✅ Complete |
| Search Screen | 5 | ✅ Complete |
| Smart Notifications | 7 | ✅ Complete |
| Profile Settings & Help Center | 13 | ✅ Complete |
| Error & Other Utilities | 5 | ✅ Complete |

### Critical Issues Summary
- **Total Issues**: 42
- **Critical (Safety)**: 8 (Issues #1, #2, #4, #16, #18, #26)
- **High (Branding/Legal)**: 10
- **Medium (Data/Content)**: 15
- **Low (Typos/Grammar)**: 9

### Key Recommendations
1. **Immediate**: Review and fix all mental health safety issues (Issues #1, #2, #16, #18, #26)
2. **Before Launch**: Clinical review of crisis detection and response features
3. **Legal Review**: AI diagnosis language (Issue #9), character names (Issue #8)
4. **Design Polish**: Fix all typos and grammar errors before development

### Components Identified
- **Total Components**: ~400+ unique components
- **High Priority**: ~20 core components
- **Medium Priority**: ~50 common components
- **Feature-Specific**: ~330+ specialized components
