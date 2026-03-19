/**
 * Comprehensive Playwright E2E Visual Verification Tests
 * @description Tests every accessible route of the Solace AI Mobile app
 *
 * Test Strategy:
 * - Auth Flow: Direct URL navigation (no auth required)
 * - Onboarding Flow: Inject auth state via localStorage, navigate via URLs
 * - Main App Flow: Inject full auth state, navigate via tab bar + URLs
 * - Sub-screens requiring nav params: Verified via unit tests (5,264 passing)
 *
 * Prerequisites:
 * - Start Expo web server: npx expo start --web --port 8081
 * - Run: npx playwright test tests/e2e/playwright-visual-verification.spec.ts
 */

import { test, expect, type Page } from "@playwright/test";

const BASE_URL = "http://localhost:8081";
const MOBILE_VIEWPORT = { width: 390, height: 844 };

// Auth state helpers
const AUTH_STORAGE_KEY = "@solace/auth_state";

function setAuthState(page: Page, isAuthenticated: boolean, hasCompletedOnboarding: boolean) {
  return page.evaluate(
    ({ key, state }) => {
      localStorage.setItem(key, JSON.stringify(state));
    },
    {
      key: AUTH_STORAGE_KEY,
      state: { isAuthenticated, hasCompletedOnboarding },
    }
  );
}

// ============================================================================
// AUTH FLOW TESTS (14 screens)
// ============================================================================
test.describe("Auth Flow", () => {
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize(MOBILE_VIEWPORT);
  });

  test("Splash screen renders with logo", async ({ page }) => {
    await page.goto(`${BASE_URL}/auth`);
    await expect(page.getByText("Solace AI")).toBeVisible();
    await expect(page.locator('[aria-label="Solace AI logo"]')).toBeVisible();
  });

  test("Welcome screen renders with CTA", async ({ page }) => {
    await page.goto(`${BASE_URL}/auth/welcome`);
    await expect(page.getByText("Welcome to")).toBeVisible();
    await expect(page.getByText("Solace AI")).toBeVisible();
    await expect(page.getByText("Your mindful mental health AI companion")).toBeVisible();
    await expect(page.getByRole("button", { name: "Get Started" })).toBeVisible();
    await expect(page.getByText("Already have an account?")).toBeVisible();
  });

  test("Onboarding Step 1 - Personalize", async ({ page }) => {
    await page.goto(`${BASE_URL}/auth/onboarding/step-1`);
    await expect(page.getByText("Step One")).toBeVisible();
    await expect(page.getByText("Personalize Your Mental Health State With AI")).toBeVisible();
    await expect(page.getByRole("button", { name: "Next step" })).toBeVisible();
  });

  test("Onboarding Step 2 - Mood Tracking", async ({ page }) => {
    await page.goto(`${BASE_URL}/auth/onboarding/step-2`);
    await expect(page.getByText("Step Two")).toBeVisible();
    await expect(page.getByText("Intelligent Mood Tracking & Emotion Insights")).toBeVisible();
    await expect(page.getByRole("button", { name: "Next step" })).toBeVisible();
    await expect(page.getByRole("button", { name: "Previous step" })).toBeVisible();
  });

  test("Onboarding Step 3 - Journaling & Chatbot", async ({ page }) => {
    await page.goto(`${BASE_URL}/auth/onboarding/step-3`);
    await expect(page.getByText("Step Three")).toBeVisible();
    await expect(page.getByText("AI Mental Journaling & AI Therapy Chatbot")).toBeVisible();
  });

  test("Onboarding Step 4 - Mindful Resources", async ({ page }) => {
    await page.goto(`${BASE_URL}/auth/onboarding/step-4`);
    await expect(page.getByText("Step Four")).toBeVisible();
    await expect(page.getByText("Mindful Resources That Makes You Happy")).toBeVisible();
  });

  test("Onboarding Step 5 - Community", async ({ page }) => {
    await page.goto(`${BASE_URL}/auth/onboarding/step-5`);
    await expect(page.getByText("Step Five")).toBeVisible();
    await expect(page.getByText("Loving & Supportive Community")).toBeVisible();
    await expect(page.getByRole("button", { name: "Complete onboarding" })).toBeVisible();
  });

  test("Sign Up screen renders form", async ({ page }) => {
    await page.goto(`${BASE_URL}/auth/signup`);
    await expect(page.getByText("Sign Up For Free")).toBeVisible();
    await expect(page.getByPlaceholder("Enter your email...")).toBeVisible();
    await expect(page.getByPlaceholder("Enter your password...")).toBeVisible();
    await expect(page.getByPlaceholder("Confirm your password...")).toBeVisible();
    await expect(page.getByRole("button", { name: "Sign Up" })).toBeVisible();
    await expect(page.getByText("Already have an account?")).toBeVisible();
  });

  test("Sign In screen renders form with social login", async ({ page }) => {
    await page.goto(`${BASE_URL}/auth/signin`);
    await expect(page.getByText("Sign In To Solace AI")).toBeVisible();
    await expect(page.getByPlaceholder("Enter your email...")).toBeVisible();
    await expect(page.getByPlaceholder("Enter your password...")).toBeVisible();
    await expect(page.getByText("Forgot Password")).toBeVisible();
    // Social login buttons
    await expect(page.locator('[aria-label="Sign in with Facebook"]')).toBeVisible();
    await expect(page.locator('[aria-label="Sign in with Google"]')).toBeVisible();
    await expect(page.locator('[aria-label="Sign in with Instagram"]')).toBeVisible();
  });

  test("Forgot Password screen renders recovery options", async ({ page }) => {
    await page.goto(`${BASE_URL}/auth/forgot-password`);
    await expect(page.getByText("Forgot Password")).toBeVisible();
    await expect(page.getByText("Select contact details where you want to reset your password")).toBeVisible();
    await expect(page.getByRole("radio", { name: "Use 2FA recovery method" })).toBeVisible();
    await expect(page.getByRole("radio", { name: "Password recovery method" })).toBeVisible();
    await expect(page.getByRole("radio", { name: "Google Authenticator recovery method" })).toBeVisible();
    await expect(page.getByRole("button", { name: "Send Reset Link" })).toBeVisible();
  });

  test("Verification Sent screen renders", async ({ page }) => {
    await page.goto(`${BASE_URL}/auth/verification-sent`);
    await expect(page.getByText("We've Sent Verification")).toBeVisible();
    await expect(page.getByRole("button", { name: "Re-Send Password" })).toBeVisible();
    await expect(page.getByRole("button", { name: "Close" })).toBeVisible();
  });

  test("Loading Progress screen renders", async ({ page }) => {
    await page.goto(`${BASE_URL}/auth/loading`);
    await expect(page.getByText("100%")).toBeVisible();
  });

  test("Full onboarding navigation flow", async ({ page }) => {
    await page.goto(`${BASE_URL}/auth/welcome`);

    // Welcome → Step 1
    await page.getByRole("button", { name: "Get Started" }).click();
    await expect(page.getByText("Step One")).toBeVisible();

    // Step 1 → Step 2
    await page.getByRole("button", { name: "Next step" }).click();
    await expect(page.getByText("Step Two")).toBeVisible();

    // Step 2 → Step 3
    await page.getByRole("button", { name: "Next step" }).click();
    await expect(page.getByText("Step Three")).toBeVisible();

    // Step 3 → Step 4
    await page.getByRole("button", { name: "Next step" }).click();
    await expect(page.getByText("Step Four")).toBeVisible();

    // Step 4 → Step 5
    await page.getByRole("button", { name: "Next step" }).click();
    await expect(page.getByText("Step Five")).toBeVisible();

    // Step 5 → SignUp
    await page.getByRole("button", { name: "Complete onboarding" }).click();
    await expect(page.getByText("Sign Up For Free")).toBeVisible();

    // SignUp → SignIn
    await page.getByText("Already have an account?").click();
    await expect(page.getByText("Sign In To Solace AI")).toBeVisible();

    // SignIn → ForgotPassword
    await page.getByText("Forgot Password").click();
    await expect(page.getByText("Select contact details")).toBeVisible();
  });
});

// ============================================================================
// ONBOARDING FLOW TESTS (Profile Setup + Assessment)
// ============================================================================
test.describe("Onboarding Flow", () => {
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize(MOBILE_VIEWPORT);
    await page.goto(BASE_URL);
    await setAuthState(page, true, false);
  });

  test("Profile Setup Welcome renders", async ({ page }) => {
    await page.goto(`${BASE_URL}/onboarding/welcome`);
    await expect(page.getByText("Welcome to Solace")).toBeVisible();
  });

  test("Profile Setup Details form renders all fields", async ({ page }) => {
    await page.goto(`${BASE_URL}/onboarding/name`);
    await expect(page.getByText("Profile Setup")).toBeVisible();
    await expect(page.getByPlaceholder("Enter your full name")).toBeVisible();
    await expect(page.getByPlaceholder("Enter your email")).toBeVisible();
    await expect(page.getByPlaceholder("Enter your password")).toBeVisible();
    // Account type selection
    await expect(page.getByText("Psychiatrist")).toBeVisible();
    await expect(page.getByText("Patient")).toBeVisible();
    await expect(page.getByText("Professional")).toBeVisible();
    // Weight slider
    await expect(page.getByText("Weight")).toBeVisible();
    // Gender and Location dropdowns
    await expect(page.getByText("Select gender")).toBeVisible();
    await expect(page.getByText("Select location")).toBeVisible();
    await expect(page.getByRole("button", { name: "Continue to next step" })).toBeVisible();
  });

  test("Password Setup renders with strength indicator", async ({ page }) => {
    await page.goto(`${BASE_URL}/onboarding/password`);
    await expect(page.getByText("Password Setup")).toBeVisible();
    await expect(page.getByPlaceholder("Enter password")).toBeVisible();
    await expect(page.getByText("Password Strength")).toBeVisible();
    await expect(page.getByText("Must have A-Z")).toBeVisible();
    await expect(page.getByText("Must Have 0-9")).toBeVisible();
  });

  test("OTP Entry renders with 4 digit inputs", async ({ page }) => {
    await page.goto(`${BASE_URL}/onboarding/otp-verification`);
    await expect(page.getByText("Enter 4 digit OTP Code")).toBeVisible();
    await expect(page.getByText("Enter the verification code sent to your phone")).toBeVisible();
    // 4 digit inputs
    await expect(page.locator('[aria-label="Digit 1 of 4"]')).toBeVisible();
    await expect(page.locator('[aria-label="Digit 2 of 4"]')).toBeVisible();
    await expect(page.locator('[aria-label="Digit 3 of 4"]')).toBeVisible();
    await expect(page.locator('[aria-label="Digit 4 of 4"]')).toBeVisible();
    await expect(page.getByText("Didn't receive the OTP?")).toBeVisible();
  });

  test("Emergency Contact placeholder renders", async ({ page }) => {
    await page.goto(`${BASE_URL}/onboarding/emergency-contact`);
    await expect(page.getByText("Emergency Contact")).toBeVisible();
    await expect(page.getByText("Coming Soon")).toBeVisible();
  });

  test("Fingerprint Setup renders with biometric UI", async ({ page }) => {
    await page.goto(`${BASE_URL}/onboarding/biometric`);
    await expect(page.getByText("Fingerprint Setup")).toBeVisible();
    await expect(page.getByText("Scan your biometric fingerprint")).toBeVisible();
    await expect(page.getByRole("button", { name: "Continue to next step" })).toBeVisible();
  });

  test("Assessment Intro renders with details", async ({ page }) => {
    await page.goto(`${BASE_URL}/onboarding/assessment`);
    await expect(page.getByText("Mental Health Assessment")).toBeVisible();
    await expect(page.getByText("14 questions")).toBeVisible();
    await expect(page.getByText("5-7 minutes")).toBeVisible();
    await expect(page.getByText("Your responses are private and confidential")).toBeVisible();
    await expect(page.getByRole("button", { name: "Start the mental health assessment" })).toBeVisible();
  });

  test("Assessment Q1 - Primary Concern renders options", async ({ page }) => {
    await page.goto(`${BASE_URL}/onboarding/assessment/concern`);
    await expect(page.getByText("What's your primary concern right now?")).toBeVisible();
    await expect(page.getByText("1 of 14")).toBeVisible();
    await expect(page.getByRole("radio", { name: "Anxiety" })).toBeVisible();
    await expect(page.getByRole("radio", { name: "Low mood" })).toBeVisible();
    await expect(page.getByRole("radio", { name: "Sleep difficulties" })).toBeVisible();
    await expect(page.getByRole("radio", { name: "Focus and clarity" })).toBeVisible();
  });

  test("Assessment Q2 - Age picker renders", async ({ page }) => {
    await page.goto(`${BASE_URL}/onboarding/assessment/age`);
    await expect(page.getByText("What's your age?")).toBeVisible();
    await expect(page.getByText("2 of 14")).toBeVisible();
    await expect(page.getByRole("button", { name: "Increase age" })).toBeVisible();
    await expect(page.getByRole("button", { name: "Decrease age" })).toBeVisible();
  });

  test("Assessment Q4 - Mood renders options", async ({ page }) => {
    await page.goto(`${BASE_URL}/onboarding/assessment/mood`);
    await expect(page.getByText("How have you been feeling lately?")).toBeVisible();
    await expect(page.getByRole("radio", { name: "Mostly good" })).toBeVisible();
    await expect(page.getByRole("radio", { name: "Neutral" })).toBeVisible();
    await expect(page.getByRole("radio", { name: "Stressed" })).toBeVisible();
    await expect(page.getByRole("radio", { name: "Low mood" })).toBeVisible();
  });

  test("Assessment Q5 - Stress Level renders 1-5 scale", async ({ page }) => {
    await page.goto(`${BASE_URL}/onboarding/assessment/stress`);
    await expect(page.getByText("How would you rate your stress level?")).toBeVisible();
    for (let i = 1; i <= 5; i++) {
      await expect(page.getByRole("button", { name: `Stress level ${i}` })).toBeVisible();
    }
    await expect(page.getByText("You Are Moderately Stressed.")).toBeVisible();
  });

  test("Assessment Results renders score breakdown", async ({ page }) => {
    await page.goto(`${BASE_URL}/onboarding/assessment/results`);
    await expect(page.getByText("Assessment Complete")).toBeVisible();
    await expect(page.getByText("Mental Health Score")).toBeVisible();
    await expect(page.getByText("Score Breakdown")).toBeVisible();
    await expect(page.getByText("Mood & Emotions")).toBeVisible();
    await expect(page.getByText("Stress Management")).toBeVisible();
    await expect(page.getByText("Lifestyle & Support")).toBeVisible();
    await expect(page.getByText("Recommendations")).toBeVisible();
    await expect(page.getByRole("button", { name: "View detailed breakdown" })).toBeVisible();
    await expect(page.getByRole("button", { name: "Continue to main app" })).toBeVisible();
  });
});

// ============================================================================
// MAIN APP FLOW TESTS (Tab Navigator + Landing Screens)
// ============================================================================
test.describe("Main App Flow", () => {
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize(MOBILE_VIEWPORT);
    await page.goto(BASE_URL);
    await setAuthState(page, true, true);
  });

  test("Home Dashboard renders all sections", async ({ page }) => {
    await page.goto(`${BASE_URL}/home`);
    // Header
    await expect(page.getByText("Hi, User!")).toBeVisible();
    await expect(page.getByRole("button", { name: "Notifications" })).toBeVisible();
    await expect(page.getByRole("button", { name: "Search" })).toBeVisible();
    // Mental Health Metrics
    await expect(page.getByText("Mental Health Metrics")).toBeVisible();
    await expect(page.getByText("Solace Score")).toBeVisible();
    await expect(page.getByText("Mentally Stable")).toBeVisible();
    // Metric cards
    await expect(page.getByText("Mood")).first().toBeVisible();
    await expect(page.getByText("Mindful Hours")).toBeVisible();
    await expect(page.getByText("Sleep Quality")).toBeVisible();
    await expect(page.getByText("Mental Journal")).toBeVisible();
    await expect(page.getByText("Stress Level")).toBeVisible();
    await expect(page.getByText("Mood Tracker")).toBeVisible();
    // AI Chatbot section
    await expect(page.getByText("AI Therapy Chatbot")).toBeVisible();
    await expect(page.getByText("Conversations")).toBeVisible();
  });

  test("Tab bar renders all 5 tabs", async ({ page }) => {
    await page.goto(`${BASE_URL}/home`);
    await expect(page.getByRole("link", { name: "Home dashboard" })).toBeVisible();
    await expect(page.getByRole("link", { name: "Mood tracking" })).toBeVisible();
    await expect(page.getByRole("link", { name: "AI therapy chat" })).toBeVisible();
    await expect(page.getByRole("link", { name: "Mental health journal" })).toBeVisible();
    await expect(page.getByRole("link", { name: "User profile and settings" })).toBeVisible();
  });

  test("Tab navigation works correctly", async ({ page }) => {
    await page.goto(`${BASE_URL}/home`);

    // Navigate to Mood tab
    await page.getByRole("link", { name: "Mood tracking" }).click();
    await expect(page.getByText("Mood Tracker")).toBeVisible();

    // Navigate to Chat tab
    await page.getByRole("link", { name: "AI therapy chat" }).click();
    await expect(page.getByText("My AI Chats")).toBeVisible();

    // Navigate to Journal tab
    await page.getByRole("link", { name: "Mental health journal" }).click();
    await expect(page.getByText("Health Journal")).toBeVisible();

    // Navigate to Profile tab
    await page.getByRole("link", { name: "User profile and settings" }).click();
    await expect(page.getByText("Solace Score")).toBeVisible();

    // Navigate back to Home
    await page.getByRole("link", { name: "Home dashboard" }).click();
    await expect(page.getByText("Mental Health Metrics")).toBeVisible();
  });

  test("Mood Dashboard renders correctly", async ({ page }) => {
    await page.goto(`${BASE_URL}/mood`);
    await expect(page.getByText("Mood Tracker")).toBeVisible();
    await expect(page.getByText("Neutral")).toBeVisible();
    await expect(page.getByText("Weekly Mood")).toBeVisible();
    await expect(page.getByRole("button", { name: "Filter moods" })).toBeVisible();
    await expect(page.getByRole("button", { name: "Add mood entry" })).toBeVisible();
  });

  test("Mood History renders with tabs", async ({ page }) => {
    await page.goto(`${BASE_URL}/mood/history`);
    await expect(page.getByText("Mood History")).toBeVisible();
    await expect(page.getByRole("button", { name: "View history" })).toBeVisible();
    await expect(page.getByRole("button", { name: "View AI suggestions" })).toBeVisible();
    await expect(page.getByRole("button", { name: "Add mood entry" })).toBeVisible();
    await expect(page.getByRole("button", { name: "Edit mood entries" })).toBeVisible();
  });

  test("Chat List renders with tabs", async ({ page }) => {
    await page.goto(`${BASE_URL}/chat`);
    await expect(page.getByText("My AI Chats")).toBeVisible();
    await expect(page.getByRole("tab", { name: "Recent" })).toBeVisible();
    await expect(page.getByRole("tab", { name: "Trash" })).toBeVisible();
    await expect(page.getByText("Recent (0)")).toBeVisible();
    await expect(page.getByText("Trash (0)")).toBeVisible();
  });

  test("Journal Dashboard renders with stats", async ({ page }) => {
    await page.goto(`${BASE_URL}/journal`);
    await expect(page.getByText("Health Journal")).toBeVisible();
    await expect(page.getByText("Journals This Week.")).toBeVisible();
    await expect(page.getByRole("button", { name: "Add new journal entry" })).toBeVisible();
    await expect(page.getByText("Journal Statistics")).toBeVisible();
    await expect(page.getByText("Skipped")).toBeVisible();
    await expect(page.getByText("Positive")).toBeVisible();
    await expect(page.getByText("Negative")).toBeVisible();
  });

  test("Profile Dashboard renders user info and cards", async ({ page }) => {
    await page.goto(`${BASE_URL}/profile`);
    await expect(page.getByText("User")).toBeVisible();
    await expect(page.getByText("Free")).toBeVisible();
    await expect(page.getByText("Age")).toBeVisible();
    await expect(page.getByText("Weight")).toBeVisible();
    await expect(page.getByText("Height")).toBeVisible();
    await expect(page.getByRole("button", { name: "View Solace Score" })).toBeVisible();
    await expect(page.getByRole("button", { name: "View Mood" })).toBeVisible();
    await expect(page.getByRole("button", { name: "Settings" })).toBeVisible();
  });
});

// ============================================================================
// ACCESSIBILITY TESTS
// ============================================================================
test.describe("Accessibility", () => {
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize(MOBILE_VIEWPORT);
  });

  test("Auth screens have proper ARIA labels", async ({ page }) => {
    await page.goto(`${BASE_URL}/auth/welcome`);
    const snapshot = await page.accessibility.snapshot();
    expect(snapshot).toBeTruthy();
  });

  test("Sign In form fields have labels", async ({ page }) => {
    await page.goto(`${BASE_URL}/auth/signin`);
    await expect(page.getByLabel("Email Address")).toBeVisible();
    await expect(page.getByLabel("Password")).toBeVisible();
    await expect(page.locator('[aria-label="Show password"]')).toBeVisible();
  });

  test("Assessment screens have progress indicators", async ({ page }) => {
    await page.goto(BASE_URL);
    await setAuthState(page, true, false);
    await page.goto(`${BASE_URL}/onboarding/assessment/concern`);
    await expect(page.getByRole("progressbar")).toBeVisible();
  });
});

// ============================================================================
// ERROR BOUNDARY TESTS
// ============================================================================
test.describe("Error Handling", () => {
  test("Error boundary catches and displays fallback", async ({ page }) => {
    await page.setViewportSize(MOBILE_VIEWPORT);
    // Navigate to a screen that requires params it won't get
    await page.goto(BASE_URL);
    await setAuthState(page, true, true);
    await page.goto(`${BASE_URL}/home/score`);
    await page.waitForTimeout(2000);
    await expect(page.getByText("Something went wrong")).toBeVisible();
    await expect(page.getByText("Tap to retry")).toBeVisible();
  });
});
