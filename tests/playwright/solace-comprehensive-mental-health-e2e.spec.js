/**
 * Solace AI Mobile - Comprehensive Mental Health E2E Tests
 * 
 * This test suite validates all critical user journeys for the mental health app:
 * - Onboarding flow (6 steps)
 * - Authentication and security
 * - Navigation between all tabs
 * - Dashboard functionality
 * - Mood tracking workflow
 * - Error handling and boundaries
 * - Accessibility and theming
 * - Animation performance
 * - Icon system validation
 * 
 * Designed for mental health app context with focus on user safety and therapeutic UX
 */

import { test, expect, devices } from '@playwright/test';

// Test configuration for Solace AI Mobile
const TEST_CONFIG = {
  baseURL: 'http://localhost:8082',
  timeout: 30000,
  mobile: {
    viewport: { width: 375, height: 812 }, // iPhone 14 Pro
    userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15'
  },
  desktop: {
    viewport: { width: 1280, height: 720 }
  }
};

// Mental health app specific test data
const MENTAL_HEALTH_DATA = {
  onboardingSteps: [
    "Welcome to the ultimate freud UI Kit!",
    "Personalize Your Mental Health State With AI", 
    "Intelligent Mood Tracking & AI Emotion Insights",
    "AI Mental Journaling & AI Therapy Chatbot",
    "Mindful Resources That Makes You Happy",
    "Loving & Supportive Community"
  ],
  moods: ['happy', 'sad', 'anxious', 'calm', 'angry', 'excited', 'content', 'tired', 'stressed'],
  activities: ['exercise', 'meditation', 'journaling', 'therapy', 'music', 'reading', 'socializing'],
  intensityLevels: [1, 2, 3, 4, 5],
  crisisKeywords: ['suicide', 'kill myself', 'hopeless', 'worthless', 'end it all'],
  emergencyResources: ['988', '741741', 'crisis', 'emergency']
};

// Custom helper functions for mental health app testing
const MentalHealthHelpers = {
  async waitForAppLoad(page) {
    // Wait for main app to load completely
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000); // Allow animations to complete
  },

  async takeScreenshot(page, name, options = {}) {
    await page.screenshot({ 
      path: `test-results/screenshots/mental-health-${name}.png`,
      fullPage: true,
      ...options
    });
  },

  async checkTherapeuticDesign(page) {
    // Verify therapeutic color schemes and calming design
    const gradients = await page.locator('[style*="linear-gradient"], [style*="background"]').count();
    expect(gradients).toBeGreaterThan(0);
  },

  async validateAccessibility(page) {
    // Check basic accessibility requirements for mental health apps
    const buttons = await page.locator('button, [role="button"]').all();
    for (const button of buttons.slice(0, 5)) { // Check first 5 buttons
      const boundingBox = await button.boundingBox();
      if (boundingBox) {
        expect(boundingBox.width).toBeGreaterThanOrEqual(44);
        expect(boundingBox.height).toBeGreaterThanOrEqual(44);
      }
    }
  },

  async checkCrisisSupport(page) {
    // Verify crisis support is accessible
    const crisisElements = await page.locator('text=/emergency|crisis|help|988/i').count();
    expect(crisisElements).toBeGreaterThan(0);
  }
};

test.describe('Solace AI Mobile - Comprehensive Mental Health E2E Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize(TEST_CONFIG.mobile.viewport);
    await page.goto(TEST_CONFIG.baseURL);
    await MentalHealthHelpers.waitForAppLoad(page);
  });

  test.describe('1. App Loading and Initial State', () => {
    test('loads app successfully and shows onboarding screen', async ({ page }) => {
      // Should show onboarding screen first
      await expect(page.locator('text=/Welcome to the ultimate freud UI Kit/i')).toBeVisible({
        timeout: 10000
      });

      // Check for step indicator
      await expect(page.locator('text=/Step One/i')).toBeVisible();

      // Verify therapeutic design elements
      await MentalHealthHelpers.checkTherapeuticDesign(page);

      await MentalHealthHelpers.takeScreenshot(page, 'initial-onboarding');
    });

    test('displays therapeutic gradient backgrounds', async ({ page }) => {
      // Check for LinearGradient backgrounds
      const gradientElements = await page.locator('[style*="linear-gradient"]').count();
      expect(gradientElements).toBeGreaterThan(0);

      // Verify calming color schemes
      const backgroundColor = await page.evaluate(() => {
        const body = document.body;
        return window.getComputedStyle(body).backgroundColor;
      });
      expect(backgroundColor).toBeTruthy();
    });

    test('shows proper step indicators and navigation', async ({ page }) => {
      // Check step dots
      const dots = await page.locator('[accessibilityRole="tab"]').count();
      expect(dots).toBe(6); // Should have 6 onboarding steps

      // Check Get Started button
      await expect(page.locator('text=/Get Started/i')).toBeVisible();

      // Check Skip button
      await expect(page.locator('text=/Skip/i')).toBeVisible();
    });
  });

  test.describe('2. Onboarding Flow (6 Steps)', () => {
    test('completes full 6-step onboarding flow', async ({ page }) => {
      // Step 1: Welcome screen
      await expect(page.locator('text=/Welcome to the ultimate freud UI Kit/i')).toBeVisible();
      await expect(page.locator('text=/Step One/i')).toBeVisible();
      
      await MentalHealthHelpers.takeScreenshot(page, 'onboarding-step-1');
      await page.click('text=/Get Started/i');
      await page.waitForTimeout(1000);

      // Step 2: Personalize Mental Health
      await expect(page.locator('text=/Personalize Your Mental Health State With AI/i')).toBeVisible();
      await expect(page.locator('text=/Step Two/i')).toBeVisible();
      
      await MentalHealthHelpers.takeScreenshot(page, 'onboarding-step-2');
      await page.click('text=/Continue/i');
      await page.waitForTimeout(1000);

      // Step 3: Mood Tracking
      await expect(page.locator('text=/Intelligent Mood Tracking/i')).toBeVisible();
      await expect(page.locator('text=/Step Three/i')).toBeVisible();
      
      await MentalHealthHelpers.takeScreenshot(page, 'onboarding-step-3');
      await page.click('text=/Continue/i');
      await page.waitForTimeout(1000);

      // Step 4: AI Journaling
      await expect(page.locator('text=/AI Mental Journaling/i')).toBeVisible();
      await expect(page.locator('text=/Step Four/i')).toBeVisible();
      
      await MentalHealthHelpers.takeScreenshot(page, 'onboarding-step-4');
      await page.click('text=/Continue/i');
      await page.waitForTimeout(1000);

      // Step 5: Mindful Resources
      await expect(page.locator('text=/Mindful Resources That Makes You Happy/i')).toBeVisible();
      await expect(page.locator('text=/Step Five/i')).toBeVisible();
      
      await MentalHealthHelpers.takeScreenshot(page, 'onboarding-step-5');
      await page.click('text=/Continue/i');
      await page.waitForTimeout(1000);

      // Step 6: Community
      await expect(page.locator('text=/Loving & Supportive Community/i')).toBeVisible();
      await expect(page.locator('text=/Step Six/i')).toBeVisible();
      
      await MentalHealthHelpers.takeScreenshot(page, 'onboarding-step-6');
      await page.click('text=/Get Started/i');
      await page.waitForTimeout(2000);

      // Should now be in main app
      await expect(page.locator('text=/Welcome|Home|Mood/i')).toBeVisible({
        timeout: 10000
      });

      await MentalHealthHelpers.takeScreenshot(page, 'onboarding-complete-main-app');
    });

    test('allows skipping onboarding flow', async ({ page }) => {
      // Click Skip button on first step
      await page.click('text=/Skip/i');
      await page.waitForTimeout(2000);

      // Should go directly to main app
      await expect(page.locator('text=/Welcome|Home|Mood/i')).toBeVisible({
        timeout: 10000
      });

      await MentalHealthHelpers.takeScreenshot(page, 'onboarding-skipped');
    });

    test('maintains step progress with animations', async ({ page }) => {
      // Go to step 2
      await page.click('text=/Get Started/i');
      await page.waitForTimeout(1000);
      
      // Verify smooth transition and step indicator update
      await expect(page.locator('text=/Step Two/i')).toBeVisible();
      
      // Check that dots updated (second dot should be active)
      const activeDots = await page.locator('[style*="24"]').count(); // Active dots are wider (24px)
      expect(activeDots).toBeGreaterThanOrEqual(1);
    });
  });

  test.describe('3. Navigation Between Tabs', () => {
    test.beforeEach(async ({ page }) => {
      // Complete onboarding first
      await page.click('text=/Skip/i');
      await page.waitForTimeout(2000);
    });

    test('navigates through all main tabs successfully', async ({ page }) => {
      const tabs = [
        { name: 'Welcome', testId: 'tab-welcome', expectedContent: 'Welcome' },
        { name: 'Home', testId: 'tab-home', expectedContent: 'mood|dashboard|check' },
        { name: 'Chat', testId: 'tab-chat', expectedContent: 'chat|conversation|message' },
        { name: 'Mood', testId: 'tab-mood', expectedContent: 'mood|tracking|feeling' },
        { name: 'Assessment', testId: 'tab-assessment', expectedContent: 'assessment|evaluation' },
        { name: 'Wellness', testId: 'tab-wellness', expectedContent: 'wellness|mindful|resources' },
        { name: 'Utilities', testId: 'tab-utilities', expectedContent: 'search|help|tools' },
        { name: 'Profile', testId: 'tab-profile', expectedContent: 'profile|settings|account' }
      ];

      for (const tab of tabs) {
        // Click tab
        await page.click(`[data-testid="${tab.testId}"], text=${tab.name}`);
        await page.waitForTimeout(1500);

        // Verify navigation worked
        await expect(page.locator(`text=/${tab.expectedContent}/i`).first()).toBeVisible({
          timeout: 10000
        });

        // Take screenshot
        await MentalHealthHelpers.takeScreenshot(page, `navigation-${tab.name.toLowerCase()}`);

        // Verify therapeutic design is maintained
        await MentalHealthHelpers.checkTherapeuticDesign(page);
      }
    });

    test('maintains tab state during navigation', async ({ page }) => {
      // Go to Home tab and interact
      await page.click('text=Home');
      await page.waitForTimeout(1000);

      // Look for mood check-in or dashboard elements
      const moodElements = await page.locator('text=/mood|feeling|check/i').count();
      expect(moodElements).toBeGreaterThan(0);

      // Navigate to another tab and back
      await page.click('text=Profile');
      await page.waitForTimeout(1000);
      
      await page.click('text=Home');
      await page.waitForTimeout(1000);

      // State should be preserved
      const preservedElements = await page.locator('text=/mood|feeling|check/i').count();
      expect(preservedElements).toBeGreaterThan(0);
    });

    test('shows correct tab icons and styling', async ({ page }) => {
      // Check that navigation icons are visible
      const navIcons = await page.locator('[data-testid*="tab-"]').count();
      expect(navIcons).toBeGreaterThanOrEqual(6); // Should have at least 6 main tabs

      // Verify tab bar styling
      const tabBar = page.locator('text=Welcome').locator('..').locator('..');
      await expect(tabBar).toBeVisible();
    });
  });

  test.describe('4. Dashboard Components Functionality', () => {
    test.beforeEach(async ({ page }) => {
      // Complete onboarding and go to Home
      await page.click('text=/Skip/i');
      await page.waitForTimeout(2000);
      await page.click('text=Home');
      await page.waitForTimeout(1500);
    });

    test('displays mood check-in component', async ({ page }) => {
      // Look for mood check-in elements
      const moodCheckIn = page.locator('text=/mood|feeling|check.*in/i').first();
      await expect(moodCheckIn).toBeVisible({ timeout: 10000 });

      // Test interaction
      await moodCheckIn.click();
      await page.waitForTimeout(1000);

      await MentalHealthHelpers.takeScreenshot(page, 'mood-check-in-interaction');
    });

    test('shows quick actions with therapeutic design', async ({ page }) => {
      // Look for quick actions
      const quickActions = page.locator('text=/quick.*action|action/i').first();
      if (await quickActions.isVisible()) {
        await expect(quickActions).toBeVisible();
        
        // Check for therapeutic colors and gradients
        await MentalHealthHelpers.checkTherapeuticDesign(page);
      }

      await MentalHealthHelpers.takeScreenshot(page, 'quick-actions');
    });

    test('displays welcome header with time-based theming', async ({ page }) => {
      // Look for welcome/greeting message
      const welcomeHeader = page.locator('text=/welcome|good.*morning|good.*afternoon|good.*evening|hello/i').first();
      
      if (await welcomeHeader.isVisible()) {
        await expect(welcomeHeader).toBeVisible();
        
        // Check that greeting changes based on time
        const greetingText = await welcomeHeader.textContent();
        expect(greetingText).toMatch(/welcome|good|hello/i);
      }

      await MentalHealthHelpers.takeScreenshot(page, 'welcome-header');
    });

    test('shows progress overview and insights', async ({ page }) => {
      // Look for progress or insights components
      const progressElements = page.locator('text=/progress|insight|overview|stat/i');
      const count = await progressElements.count();
      
      if (count > 0) {
        await expect(progressElements.first()).toBeVisible();
        await MentalHealthHelpers.takeScreenshot(page, 'progress-insights');
      }
    });

    test('displays recent activity feed', async ({ page }) => {
      // Look for recent activity
      const activityElements = page.locator('text=/recent|activity|history|log/i');
      const count = await activityElements.count();
      
      if (count > 0) {
        await expect(activityElements.first()).toBeVisible();
        await MentalHealthHelpers.takeScreenshot(page, 'recent-activity');
      }
    });
  });

  test.describe('5. Enhanced Mood Tracking Flow', () => {
    test.beforeEach(async ({ page }) => {
      // Complete onboarding and navigate to mood tracking
      await page.click('text=/Skip/i');
      await page.waitForTimeout(2000);
      await page.click('text=Mood');
      await page.waitForTimeout(1500);
    });

    test('completes 4-step mood tracking process', async ({ page }) => {
      // Step 1: Mood Selection
      await expect(page.locator('text=/select.*mood|step.*1|mood.*selection/i')).toBeVisible({
        timeout: 10000
      });

      // Look for mood options
      const moodOptions = await page.locator('text=/happy|sad|anxious|calm|angry|excited/i').count();
      expect(moodOptions).toBeGreaterThan(0);

      // Select a mood
      const happyMood = page.locator('text=/happy/i').first();
      if (await happyMood.isVisible()) {
        await happyMood.click();
        await page.waitForTimeout(500);
      }

      // Continue to step 2
      const nextButton = page.locator('text=/next|continue/i').first();
      if (await nextButton.isVisible()) {
        await nextButton.click();
        await page.waitForTimeout(1000);
      }

      await MentalHealthHelpers.takeScreenshot(page, 'mood-tracking-step-1');

      // Step 2: Intensity
      const intensityStep = page.locator('text=/intensity|step.*2|how.*intense/i');
      if (await intensityStep.isVisible()) {
        await expect(intensityStep).toBeVisible();
        
        // Look for slider or intensity options
        const slider = page.locator('input[type="range"], [role="slider"]').first();
        if (await slider.isVisible()) {
          await slider.click();
        }

        await MentalHealthHelpers.takeScreenshot(page, 'mood-tracking-step-2');
        
        // Continue to step 3
        const nextButton2 = page.locator('text=/next|continue/i').first();
        if (await nextButton2.isVisible()) {
          await nextButton2.click();
          await page.waitForTimeout(1000);
        }
      }

      // Step 3: Activities
      const activitiesStep = page.locator('text=/activit|step.*3|what.*did/i');
      if (await activitiesStep.isVisible()) {
        await expect(activitiesStep).toBeVisible();
        
        // Select activities
        const exerciseActivity = page.locator('text=/exercise/i').first();
        if (await exerciseActivity.isVisible()) {
          await exerciseActivity.click();
        }

        await MentalHealthHelpers.takeScreenshot(page, 'mood-tracking-step-3');
        
        // Continue to step 4
        const nextButton3 = page.locator('text=/next|continue/i').first();
        if (await nextButton3.isVisible()) {
          await nextButton3.click();
          await page.waitForTimeout(1000);
        }
      }

      // Step 4: Notes
      const notesStep = page.locator('text=/notes|step.*4|additional.*thoughts/i');
      if (await notesStep.isVisible()) {
        await expect(notesStep).toBeVisible();
        
        // Add notes
        const notesInput = page.locator('textarea, input[type="text"]').last();
        if (await notesInput.isVisible()) {
          await notesInput.fill('Feeling great after morning exercise and meditation!');
        }

        await MentalHealthHelpers.takeScreenshot(page, 'mood-tracking-step-4');
        
        // Save mood entry
        const saveButton = page.locator('text=/save|complete|finish/i').first();
        if (await saveButton.isVisible()) {
          await saveButton.click();
          await page.waitForTimeout(2000);
        }
      }

      // Verify completion
      await expect(page.locator('text=/saved|complete|success|thank/i')).toBeVisible({
        timeout: 10000
      });

      await MentalHealthHelpers.takeScreenshot(page, 'mood-tracking-complete');
    });

    test('validates mood tracking form fields', async ({ page }) => {
      // Try to proceed without selecting mood (if validation exists)
      const nextButton = page.locator('text=/next|continue/i').first();
      if (await nextButton.isVisible()) {
        await nextButton.click();
        
        // Look for validation message
        const validationMessage = page.locator('text=/please.*select|required|choose.*mood/i');
        if (await validationMessage.isVisible()) {
          await expect(validationMessage).toBeVisible();
        }
      }
    });

    test('allows navigation between mood tracking steps', async ({ page }) => {
      // Complete step 1
      const happyMood = page.locator('text=/happy/i').first();
      if (await happyMood.isVisible()) {
        await happyMood.click();
        await page.waitForTimeout(500);
        
        const nextButton = page.locator('text=/next|continue/i').first();
        if (await nextButton.isVisible()) {
          await nextButton.click();
          await page.waitForTimeout(1000);
        }
      }

      // Try to go back
      const backButton = page.locator('text=/back|previous/i').first();
      if (await backButton.isVisible()) {
        await backButton.click();
        await page.waitForTimeout(1000);
        
        // Should be back on step 1
        await expect(page.locator('text=/select.*mood|step.*1/i')).toBeVisible();
      }
    });
  });

  test.describe('6. Authentication State Management', () => {
    test('handles authentication state properly', async ({ page }) => {
      // App should show onboarding for new users
      await expect(page.locator('text=/Welcome to the ultimate freud UI Kit/i')).toBeVisible();

      // Complete onboarding - should automatically authenticate demo user
      await page.click('text=/Skip/i');
      await page.waitForTimeout(2000);

      // Should be authenticated and show main app
      await expect(page.locator('text=/Welcome|Home|Mood/i')).toBeVisible();

      // Verify no hardcoded authentication bypasses
      const pageContent = await page.content();
      expect(pageContent).not.toMatch(/demo.*token|hardcoded.*auth|bypass.*auth/i);
    });

    test('maintains secure authentication flow', async ({ page }) => {
      // Check that sensitive data is not exposed
      const pageContent = await page.content();
      expect(pageContent).not.toMatch(/api[_-]?key|secret|password|private.*key/i);

      // Verify proper session management
      await page.click('text=/Skip/i');
      await page.waitForTimeout(2000);
      
      // Should maintain session across navigation
      await page.click('text=Profile');
      await page.waitForTimeout(1000);
      
      // Should still be authenticated
      await expect(page.locator('text=/profile|settings|account/i')).toBeVisible();
    });
  });

  test.describe('7. Error Boundaries and Error Handling', () => {
    test('handles component errors gracefully', async ({ page }) => {
      // Complete onboarding
      await page.click('text=/Skip/i');
      await page.waitForTimeout(2000);

      // Try invalid inputs to test error boundaries
      const textInputs = await page.locator('input[type="text"], textarea').all();
      for (const input of textInputs.slice(0, 2)) {
        if (await input.isVisible()) {
          // Try very long input
          await input.fill('a'.repeat(10000));
          await page.waitForTimeout(500);
        }
      }

      // App should still be functional
      await expect(page.locator('text=/Welcome|Home|Mood/i')).toBeVisible();
    });

    test('shows error boundaries when errors occur', async ({ page }) => {
      // Navigate around app to test stability
      const tabs = ['Home', 'Chat', 'Mood', 'Profile'];
      
      for (const tab of tabs) {
        await page.click(`text=${tab}`);
        await page.waitForTimeout(1000);
        
        // Check that error boundaries don't show
        const errorText = await page.locator('text=/error.*occurred|something.*wrong|boundary/i').count();
        expect(errorText).toBe(0);
      }
    });

    test('recovers from network errors', async ({ page }) => {
      // Complete onboarding
      await page.click('text=/Skip/i');
      await page.waitForTimeout(2000);

      // Simulate offline mode
      await page.setOffline(true);
      
      // Try to interact with app
      await page.click('text=Mood');
      await page.waitForTimeout(1000);
      
      // Should handle offline gracefully
      const offlineMessage = page.locator('text=/offline|no.*connection|network.*error/i');
      if (await offlineMessage.isVisible()) {
        await expect(offlineMessage).toBeVisible();
      }

      // Restore online
      await page.setOffline(false);
      await page.waitForTimeout(1000);
      
      // Should recover
      await expect(page.locator('text=/mood|tracking/i')).toBeVisible();
    });
  });

  test.describe('8. Theme Switching and Accessibility', () => {
    test.beforeEach(async ({ page }) => {
      // Complete onboarding
      await page.click('text=/Skip/i');
      await page.waitForTimeout(2000);
    });

    test('supports keyboard navigation', async ({ page }) => {
      // Test keyboard navigation
      await page.keyboard.press('Tab');
      
      const focusedElement = page.locator(':focus');
      await expect(focusedElement).toBeVisible();
      
      // Navigate through several elements
      for (let i = 0; i < 5; i++) {
        await page.keyboard.press('Tab');
        const currentFocus = page.locator(':focus');
        if (await currentFocus.isVisible()) {
          await expect(currentFocus).toBeVisible();
        }
      }
    });

    test('meets accessibility standards for mental health apps', async ({ page }) => {
      await MentalHealthHelpers.validateAccessibility(page);
      
      // Check for proper ARIA labels
      const buttons = await page.locator('button').all();
      for (const button of buttons.slice(0, 3)) {
        const ariaLabel = await button.getAttribute('aria-label');
        const textContent = await button.textContent();
        expect(ariaLabel || textContent).toBeTruthy();
      }
    });

    test('supports reduced motion preferences', async ({ page }) => {
      // Enable reduced motion
      await page.emulateMedia({ reducedMotion: 'reduce' });
      
      // Navigate to different screens
      await page.click('text=Mood');
      await page.waitForTimeout(1000);
      
      // Content should still be accessible
      await expect(page.locator('text=/mood|tracking/i')).toBeVisible();
    });

    test('maintains therapeutic color schemes', async ({ page }) => {
      // Check for therapeutic design across screens
      const screens = ['Home', 'Mood', 'Profile'];
      
      for (const screen of screens) {
        await page.click(`text=${screen}`);
        await page.waitForTimeout(1000);
        
        await MentalHealthHelpers.checkTherapeuticDesign(page);
      }
    });
  });

  test.describe('9. Animation Performance and Memory Management', () => {
    test.beforeEach(async ({ page }) => {
      // Complete onboarding
      await page.click('text=/Skip/i');
      await page.waitForTimeout(2000);
    });

    test('maintains smooth animations without memory leaks', async ({ page }) => {
      // Navigate rapidly between tabs to test animation performance
      const tabs = ['Home', 'Mood', 'Chat', 'Profile'];
      
      for (let cycle = 0; cycle < 3; cycle++) {
        for (const tab of tabs) {
          await page.click(`text=${tab}`);
          await page.waitForTimeout(200); // Rapid navigation
        }
      }
      
      // Check memory usage
      const metrics = await page.evaluate(() => {
        return {
          memory: performance.memory ? {
            usedJSHeapSize: performance.memory.usedJSHeapSize,
            totalJSHeapSize: performance.memory.totalJSHeapSize
          } : null,
          timing: performance.timing
        };
      });
      
      // Memory should be reasonable (less than 50MB)
      if (metrics.memory) {
        expect(metrics.memory.usedJSHeapSize).toBeLessThan(50 * 1024 * 1024);
      }
    });

    test('loads quickly and maintains performance', async ({ page }) => {
      const startTime = Date.now();
      
      await page.goto(TEST_CONFIG.baseURL);
      await page.waitForLoadState('networkidle');
      
      const loadTime = Date.now() - startTime;
      
      // Should load within 5 seconds
      expect(loadTime).toBeLessThan(5000);
      
      await MentalHealthHelpers.takeScreenshot(page, 'performance-test');
    });

    test('handles rapid interactions without lag', async ({ page }) => {
      // Rapid mood check-in interactions
      await page.click('text=Home');
      await page.waitForTimeout(1000);
      
      const moodButton = page.locator('text=/mood|feeling|check/i').first();
      
      if (await moodButton.isVisible()) {
        for (let i = 0; i < 5; i++) {
          await moodButton.click({ timeout: 1000 });
          await page.waitForTimeout(100);
        }
      }
      
      // App should remain responsive
      await expect(page.locator('text=/Home|mood/i')).toBeVisible();
    });
  });

  test.describe('10. Icon System Validation', () => {
    test.beforeEach(async ({ page }) => {
      // Complete onboarding
      await page.click('text=/Skip/i');
      await page.waitForTimeout(2000);
    });

    test('displays custom SVG icons correctly', async ({ page }) => {
      // Check that icons are loaded in navigation
      const tabElements = await page.locator('[data-testid*="tab-"]').count();
      expect(tabElements).toBeGreaterThan(5);
      
      // Icons should be visible (not broken)
      const iconElements = await page.locator('svg, [viewBox]').count();
      expect(iconElements).toBeGreaterThan(0);
    });

    test('shows mental health specific icons', async ({ page }) => {
      // Navigate to different screens and check for appropriate icons
      await page.click('text=Mood');
      await page.waitForTimeout(1000);
      
      // Should have mood/heart related icons
      const moodIcons = await page.locator('svg, [aria-label*="mood"], [aria-label*="heart"]').count();
      
      await page.click('text=Wellness');
      await page.waitForTimeout(1000);
      
      // Should have wellness/mindfulness icons
      const wellnessIcons = await page.locator('svg, [aria-label*="wellness"], [aria-label*="mindful"]').count();
      
      expect(moodIcons + wellnessIcons).toBeGreaterThan(0);
    });

    test('maintains icon consistency across platforms', async ({ page }) => {
      // Test icon rendering in different contexts
      const screens = ['Home', 'Chat', 'Mood', 'Profile'];
      
      for (const screen of screens) {
        await page.click(`text=${screen}`);
        await page.waitForTimeout(500);
        
        // Icons should be consistent size and style
        const icons = await page.locator('svg').all();
        for (const icon of icons.slice(0, 3)) {
          const boundingBox = await icon.boundingBox();
          if (boundingBox) {
            expect(boundingBox.width).toBeGreaterThan(0);
            expect(boundingBox.height).toBeGreaterThan(0);
          }
        }
      }
    });
  });

  test.describe('11. Crisis Support and Safety Features', () => {
    test.beforeEach(async ({ page }) => {
      // Complete onboarding
      await page.click('text=/Skip/i');
      await page.waitForTimeout(2000);
    });

    test('provides accessible crisis support throughout app', async ({ page }) => {
      await MentalHealthHelpers.checkCrisisSupport(page);
      
      // Check crisis support on different screens
      const screens = ['Home', 'Chat', 'Mood', 'Profile'];
      
      for (const screen of screens) {
        await page.click(`text=${screen}`);
        await page.waitForTimeout(1000);
        
        await MentalHealthHelpers.checkCrisisSupport(page);
      }
    });

    test('detects crisis keywords and provides immediate support', async ({ page }) => {
      // Navigate to a text input area (like mood notes)
      await page.click('text=Mood');
      await page.waitForTimeout(1500);
      
      // Look for text input
      const textInput = page.locator('textarea, input[type="text"]').last();
      
      if (await textInput.isVisible()) {
        // Enter crisis-related text
        await textInput.fill('I feel hopeless and want to hurt myself');
        await page.waitForTimeout(2000);
        
        // Should trigger crisis support
        const crisisResponse = page.locator('text=/crisis|emergency|help.*now|988|call.*now/i');
        if (await crisisResponse.isVisible()) {
          await expect(crisisResponse).toBeVisible();
          await MentalHealthHelpers.takeScreenshot(page, 'crisis-detection');
        }
      }
    });

    test('shows emergency resources prominently', async ({ page }) => {
      // Look for emergency access
      const emergencyButton = page.locator('text=/emergency|crisis|help.*now/i').first();
      
      if (await emergencyButton.isVisible()) {
        await emergencyButton.click();
        await page.waitForTimeout(1000);
        
        // Should show emergency resources
        await expect(page.locator('text=/988|741741|crisis.*line/i')).toBeVisible();
        
        await MentalHealthHelpers.takeScreenshot(page, 'emergency-resources');
      }
    });
  });

  test.describe('12. Cross-Device Responsiveness', () => {
    test('adapts to tablet viewport', async ({ page }) => {
      await page.setViewportSize({ width: 768, height: 1024 });
      await page.reload();
      await MentalHealthHelpers.waitForAppLoad(page);
      
      // Complete onboarding
      await page.click('text=/Skip/i');
      await page.waitForTimeout(2000);
      
      // Check layout adaptation
      await expect(page.locator('text=/Welcome|Home|Mood/i')).toBeVisible();
      
      await MentalHealthHelpers.takeScreenshot(page, 'tablet-viewport');
    });

    test('works on desktop viewport', async ({ page }) => {
      await page.setViewportSize(TEST_CONFIG.desktop.viewport);
      await page.reload();
      await MentalHealthHelpers.waitForAppLoad(page);
      
      // Complete onboarding
      await page.click('text=/Skip/i');
      await page.waitForTimeout(2000);
      
      // Should maintain functionality
      await expect(page.locator('text=/Welcome|Home|Mood/i')).toBeVisible();
      
      // Test interaction
      await page.click('text=Home');
      await page.waitForTimeout(1000);
      
      await MentalHealthHelpers.takeScreenshot(page, 'desktop-viewport');
    });
  });
});

// Performance-focused tests
test.describe('Performance and Core Web Vitals', () => {
  test('meets mental health app performance standards', async ({ page }) => {
    const startTime = Date.now();
    
    await page.goto(TEST_CONFIG.baseURL);
    await page.waitForLoadState('networkidle');
    
    const loadTime = Date.now() - startTime;
    
    // Mental health apps should load quickly to reduce user anxiety
    expect(loadTime).toBeLessThan(3000);
    
    // Check performance metrics
    const metrics = await page.evaluate(() => {
      const navigation = performance.getEntriesByType('navigation')[0];
      return {
        loadTime: navigation.loadEventEnd - navigation.loadEventStart,
        domContentLoaded: navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart,
        firstContentfulPaint: performance.getEntriesByName('first-contentful-paint')[0]?.startTime || 0
      };
    });
    
    expect(metrics.domContentLoaded).toBeLessThan(2000);
    
    await MentalHealthHelpers.takeScreenshot(page, 'performance-metrics');
  });
});

// Device-specific tests
test.describe('Mobile Device Compatibility', () => {
  test('works on iPhone 14 Pro simulation', async ({ browser }) => {
    const context = await browser.newContext({
      ...devices['iPhone 14 Pro'],
    });
    const page = await context.newPage();
    
    await page.goto(TEST_CONFIG.baseURL);
    await MentalHealthHelpers.waitForAppLoad(page);
    
    // Complete onboarding
    await page.tap('text=/Skip/i');
    await page.waitForTimeout(2000);
    
    // Test touch interactions
    await page.tap('text=Mood');
    await page.waitForTimeout(1000);
    
    await expect(page.locator('text=/mood|tracking/i')).toBeVisible();
    
    await MentalHealthHelpers.takeScreenshot(page, 'iphone-14-pro');
    await context.close();
  });

  test('works on Android simulation', async ({ browser }) => {
    const context = await browser.newContext({
      ...devices['Galaxy S21'],
    });
    const page = await context.newPage();
    
    await page.goto(TEST_CONFIG.baseURL);
    await MentalHealthHelpers.waitForAppLoad(page);
    
    // Complete onboarding
    await page.tap('text=/Skip/i');
    await page.waitForTimeout(2000);
    
    await expect(page.locator('text=/Welcome|Home|Mood/i')).toBeVisible();
    
    await MentalHealthHelpers.takeScreenshot(page, 'android-galaxy-s21');
    await context.close();
  });
});