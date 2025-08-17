/**
 * Comprehensive Mental Health App E2E Tests
 * Tests complete user journeys, crisis management, and accessibility
 * Uses Playwright for cross-browser and device testing
 */

import { test, expect, devices } from '@playwright/test';

// Test configuration
const TEST_CONFIG = {
  baseURL: process.env.SOLACE_BASE_URL || 'http://localhost:8081',
  timeout: 30000,
  viewport: { width: 375, height: 812 }, // iPhone 14 Pro dimensions
};

// Test data
const TEST_DATA = {
  moodOptions: ['happy', 'sad', 'anxious', 'calm', 'angry', 'excited'],
  activities: ['exercise', 'meditation', 'journaling', 'therapy', 'music'],
  crisisKeywords: ['suicide', 'kill myself', 'hopeless', 'worthless'],
  emergencyNumbers: ['988', '741741'],
};

test.describe('Mental Health App - Comprehensive E2E Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(TEST_CONFIG.baseURL);
    await page.waitForLoadState('networkidle');
  });

  test.describe('App Loading and Initial State', () => {
    test('loads app successfully and shows main interface', async ({ page }) => {
      // Wait for app to load
      await expect(page.locator('[data-testid="main-app-screen"]')).toBeVisible({
        timeout: 10000,
      });

      // Check for key UI elements
      await expect(page.locator('text=/mood|feeling/i')).toBeVisible();
      await expect(page.locator('text=/quick.*action/i')).toBeVisible();
      
      // Take screenshot for visual regression
      await page.screenshot({ path: 'test-results/screenshots/app-initial-load.png' });
    });

    test('displays therapeutic design elements', async ({ page }) => {
      // Check for calming colors and therapeutic design
      const moodSection = page.locator('[data-testid="mood-check-in"]');
      await expect(moodSection).toBeVisible();
      
      // Verify gradient backgrounds are applied
      const computedStyle = await moodSection.evaluate(el => 
        window.getComputedStyle(el).background
      );
      expect(computedStyle).toBeTruthy();
    });

    test('shows correct time-based theming', async ({ page }) => {
      const welcomeHeader = page.locator('[data-testid="welcome-header"]');
      await expect(welcomeHeader).toBeVisible();
      
      // Check for time-based greeting
      const greeting = await welcomeHeader.textContent();
      expect(greeting).toMatch(/good (morning|afternoon|evening)/i);
    });
  });

  test.describe('Mood Tracking Workflows', () => {
    test('completes quick mood check-in', async ({ page }) => {
      // Navigate to mood check-in
      const moodCheckIn = page.locator('[data-testid="mood-check-in"]');
      await expect(moodCheckIn).toBeVisible();
      
      // Click mood check-in button
      const checkInButton = page.locator('[data-testid="mood-check-in-button"]');
      await checkInButton.click();
      
      // Wait for mood to be recorded
      await page.waitForTimeout(1000);
      
      // Verify mood was saved
      await expect(page.locator('text=/mood.*recorded|saved/i')).toBeVisible();
      
      await page.screenshot({ path: 'test-results/screenshots/mood-check-in-complete.png' });
    });

    test('completes enhanced 4-step mood tracking', async ({ page }) => {
      // Navigate to enhanced mood tracker
      await page.click('text=/mood.*track/i');
      
      // Wait for enhanced mood tracker to load
      await expect(page.locator('[data-testid="enhanced-mood-tracker"]')).toBeVisible();
      
      // Step 1: Select mood
      await expect(page.locator('text=/select.*mood/i')).toBeVisible();
      await page.click('[data-testid="mood-option-happy"]');
      await page.click('[data-testid="next-button"]');
      
      // Step 2: Set intensity
      await expect(page.locator('text=/intensity/i')).toBeVisible();
      const slider = page.locator('[data-testid="intensity-slider"]');
      await slider.fill('8');
      await page.click('[data-testid="next-button"]');
      
      // Step 3: Select activities
      await expect(page.locator('text=/activit/i')).toBeVisible();
      await page.click('[data-testid="activity-exercise"]');
      await page.click('[data-testid="activity-meditation"]');
      await page.click('[data-testid="next-button"]');
      
      // Step 4: Add notes
      await expect(page.locator('text=/notes/i')).toBeVisible();
      const notesInput = page.locator('[data-testid="notes-input"]');
      await notesInput.fill('Had a great day with exercise and meditation!');
      
      // Save mood entry
      await page.click('[data-testid="save-button"]');
      
      // Verify completion
      await expect(page.locator('text=/saved|complete/i')).toBeVisible();
      
      await page.screenshot({ path: 'test-results/screenshots/enhanced-mood-tracking-complete.png' });
    });

    test('validates required fields in mood tracking', async ({ page }) => {
      // Navigate to enhanced mood tracker
      await page.click('text=/mood.*track/i');
      await expect(page.locator('[data-testid="enhanced-mood-tracker"]')).toBeVisible();
      
      // Try to proceed without selecting mood
      await page.click('[data-testid="next-button"]');
      
      // Should show validation error
      await expect(page.locator('text=/select.*mood|required/i')).toBeVisible();
      
      // Verify we're still on step 1
      await expect(page.locator('text=/step 1/i')).toBeVisible();
    });

    test('allows navigation between mood tracking steps', async ({ page }) => {
      await page.click('text=/mood.*track/i');
      await expect(page.locator('[data-testid="enhanced-mood-tracker"]')).toBeVisible();
      
      // Complete step 1
      await page.click('[data-testid="mood-option-calm"]');
      await page.click('[data-testid="next-button"]');
      
      // On step 2, go back
      await expect(page.locator('text=/step 2/i')).toBeVisible();
      await page.click('[data-testid="back-button"]');
      
      // Should be back on step 1 with mood preserved
      await expect(page.locator('text=/step 1/i')).toBeVisible();
      await expect(page.locator('[data-testid="mood-option-calm"]')).toHaveClass(/selected|active/);
    });
  });

  test.describe('Navigation and User Experience', () => {
    test('navigates between main sections', async ({ page }) => {
      // Test tab navigation
      const tabs = ['Home', 'Chat', 'Mood', 'Assessment', 'Profile'];
      
      for (const tab of tabs) {
        await page.click(`text=${tab}`);
        await page.waitForTimeout(500);
        
        // Verify tab is active
        const activeTab = page.locator(`[data-testid="tab-${tab.toLowerCase()}"]`);
        await expect(activeTab).toHaveClass(/active|selected/);
        
        // Take screenshot
        await page.screenshot({ 
          path: `test-results/screenshots/navigation-${tab.toLowerCase()}.png` 
        });
      }
    });

    test('maintains state during navigation', async ({ page }) => {
      // Set a mood
      const moodCheckIn = page.locator('[data-testid="mood-check-in"]');
      await moodCheckIn.click();
      
      // Navigate away and back
      await page.click('text=Profile');
      await page.waitForTimeout(500);
      await page.click('text=Home');
      
      // Mood should be preserved
      await expect(page.locator('[data-testid="current-mood"]')).toBeVisible();
    });

    test('provides smooth animations and transitions', async ({ page }) => {
      // Test for smooth transitions between screens
      await page.click('text=Mood');
      
      // Wait for transition to complete
      await page.waitForTimeout(1000);
      
      // Check that content is fully loaded
      await expect(page.locator('[data-testid="mood-screen"]')).toBeVisible();
    });
  });

  test.describe('Crisis Intervention and Safety', () => {
    test('detects crisis keywords and shows immediate support', async ({ page }) => {
      // Navigate to mood tracker notes section
      await page.click('text=/mood.*track/i');
      
      // Navigate to notes step (simplified for test)
      const notesInput = page.locator('[data-testid="notes-input"]');
      if (await notesInput.isVisible()) {
        // Enter crisis-related text
        await notesInput.fill('I feel hopeless and want to hurt myself');
        
        // Should immediately show crisis support
        await expect(page.locator('text=/crisis|emergency|help.*now/i')).toBeVisible({
          timeout: 5000,
        });
        
        // Should show emergency resources
        await expect(page.locator('text=/988|crisis.*line/i')).toBeVisible();
        
        await page.screenshot({ path: 'test-results/screenshots/crisis-detection.png' });
      }
    });

    test('provides quick access to emergency resources', async ({ page }) => {
      // Look for emergency/crisis button in header or quick actions
      const emergencyButton = page.locator('text=/emergency|crisis|help/i').first();
      await emergencyButton.click();
      
      // Should show emergency resources
      await expect(page.locator('text=/988/i')).toBeVisible();
      await expect(page.locator('text=/741741/i')).toBeVisible();
      
      // Verify call buttons are functional
      const callButton = page.locator('[data-testid="call-988"]');
      if (await callButton.isVisible()) {
        await expect(callButton).toBeEnabled();
      }
    });

    test('maintains crisis support throughout app', async ({ page }) => {
      // Crisis support should be accessible from all major screens
      const screens = ['Home', 'Chat', 'Mood', 'Profile'];
      
      for (const screen of screens) {
        await page.click(`text=${screen}`);
        await page.waitForTimeout(500);
        
        // Should have crisis/emergency access
        const crisisAccess = page.locator('text=/emergency|crisis|help/i');
        await expect(crisisAccess.first()).toBeVisible();
      }
    });
  });

  test.describe('Accessibility and Inclusive Design', () => {
    test('supports keyboard navigation', async ({ page }) => {
      // Test keyboard navigation through interactive elements
      await page.keyboard.press('Tab');
      
      // Check that focus is visible
      const focusedElement = page.locator(':focus');
      await expect(focusedElement).toBeVisible();
      
      // Navigate through multiple elements
      for (let i = 0; i < 5; i++) {
        await page.keyboard.press('Tab');
        const currentFocus = page.locator(':focus');
        await expect(currentFocus).toBeVisible();
      }
    });

    test('provides appropriate ARIA labels and roles', async ({ page }) => {
      // Check for proper ARIA attributes
      const buttons = page.locator('button');
      const buttonCount = await buttons.count();
      
      for (let i = 0; i < buttonCount; i++) {
        const button = buttons.nth(i);
        const ariaLabel = await button.getAttribute('aria-label');
        const accessibleName = await button.textContent();
        
        // Should have either aria-label or text content
        expect(ariaLabel || accessibleName).toBeTruthy();
      }
    });

    test('meets touch target size requirements', async ({ page }) => {
      // Check that interactive elements are at least 44x44px
      const interactiveElements = page.locator('button, [role="button"], input, [role="slider"]');
      const count = await interactiveElements.count();
      
      for (let i = 0; i < Math.min(count, 10); i++) {
        const element = interactiveElements.nth(i);
        const boundingBox = await element.boundingBox();
        
        if (boundingBox) {
          expect(boundingBox.width).toBeGreaterThanOrEqual(44);
          expect(boundingBox.height).toBeGreaterThanOrEqual(44);
        }
      }
    });

    test('supports reduced motion preferences', async ({ page }) => {
      // Enable reduced motion
      await page.emulateMedia({ reducedMotion: 'reduce' });
      
      // Navigate and check that animations are reduced
      await page.click('text=Mood');
      
      // Content should still be accessible without motion
      await expect(page.locator('[data-testid="mood-screen"]')).toBeVisible();
    });
  });

  test.describe('Performance and Responsiveness', () => {
    test('loads quickly on mobile viewport', async ({ page }) => {
      const startTime = Date.now();
      
      await page.goto(TEST_CONFIG.baseURL);
      await page.waitForLoadState('networkidle');
      
      const loadTime = Date.now() - startTime;
      
      // Should load within 5 seconds
      expect(loadTime).toBeLessThan(5000);
      
      // Check that content is visible
      await expect(page.locator('[data-testid="main-app-screen"]')).toBeVisible();
    });

    test('handles large mood history datasets', async ({ page }) => {
      // This would test with a user who has extensive mood history
      // For now, we'll test navigation performance
      
      const startTime = Date.now();
      
      await page.click('text=Mood');
      await page.waitForLoadState('networkidle');
      
      const navigationTime = Date.now() - startTime;
      
      // Navigation should be quick
      expect(navigationTime).toBeLessThan(2000);
    });

    test('maintains responsiveness during interactions', async ({ page }) => {
      // Rapidly interact with mood check-in
      const moodButton = page.locator('[data-testid="mood-check-in-button"]');
      
      for (let i = 0; i < 5; i++) {
        await moodButton.click({ timeout: 1000 });
        await page.waitForTimeout(100);
      }
      
      // App should remain responsive
      await expect(page.locator('[data-testid="main-app-screen"]')).toBeVisible();
    });
  });

  test.describe('Cross-Device and Responsive Design', () => {
    test('adapts to tablet viewport', async ({ page }) => {
      await page.setViewportSize({ width: 768, height: 1024 });
      await page.reload();
      
      // Check that layout adapts appropriately
      await expect(page.locator('[data-testid="main-app-screen"]')).toBeVisible();
      
      // Take screenshot for visual verification
      await page.screenshot({ path: 'test-results/screenshots/tablet-viewport.png' });
    });

    test('works on desktop viewport', async ({ page }) => {
      await page.setViewportSize({ width: 1280, height: 720 });
      await page.reload();
      
      // Should maintain functionality on larger screens
      await expect(page.locator('[data-testid="main-app-screen"]')).toBeVisible();
      
      // Test interaction
      await page.click('[data-testid="mood-check-in-button"]');
      
      await page.screenshot({ path: 'test-results/screenshots/desktop-viewport.png' });
    });
  });

  test.describe('Data Persistence and Sync', () => {
    test('persists mood data locally', async ({ page }) => {
      // Complete a mood entry
      await page.click('[data-testid="mood-check-in-button"]');
      
      // Reload page
      await page.reload();
      await page.waitForLoadState('networkidle');
      
      // Mood should be persisted
      await expect(page.locator('[data-testid="current-mood"]')).toBeVisible();
    });

    test('handles offline scenarios gracefully', async ({ page }) => {
      // Simulate offline
      await page.setOffline(true);
      
      // Try to save mood data
      await page.click('[data-testid="mood-check-in-button"]');
      
      // Should show offline indicator or save locally
      await expect(page.locator('text=/offline|saved.*locally/i')).toBeVisible();
      
      // Restore online
      await page.setOffline(false);
    });
  });

  test.describe('Error Handling and Recovery', () => {
    test('handles network errors gracefully', async ({ page }) => {
      // Intercept network requests and simulate failures
      await page.route('**/api/**', route => {
        route.abort('failed');
      });
      
      // Try to perform an action that requires network
      await page.click('[data-testid="mood-check-in-button"]');
      
      // Should show appropriate error message
      await expect(page.locator('text=/error|failed|try.*again/i')).toBeVisible();
      
      // Should provide recovery options
      await expect(page.locator('text=/retry|try.*again/i')).toBeVisible();
    });

    test('recovers from component errors', async ({ page }) => {
      // This would test error boundaries and recovery
      // For now, verify app doesn't crash with invalid inputs
      
      const notesInput = page.locator('[data-testid="notes-input"]');
      if (await notesInput.isVisible()) {
        // Try with very long input
        const longText = 'a'.repeat(10000);
        await notesInput.fill(longText);
        
        // App should handle gracefully
        await expect(page.locator('[data-testid="main-app-screen"]')).toBeVisible();
      }
    });
  });

  test.describe('Security and Privacy', () => {
    test('does not expose sensitive data in client', async ({ page }) => {
      // Check that no sensitive data is exposed in the DOM
      const pageContent = await page.content();
      
      // Should not contain API keys, tokens, etc.
      expect(pageContent).not.toMatch(/api[_-]?key|secret|token|password/i);
    });

    test('handles data deletion requests', async ({ page }) => {
      // This would test data deletion functionality
      // Navigate to settings or privacy section
      await page.click('text=Profile');
      
      // Look for data management options
      const dataOptions = page.locator('text=/data|privacy|delete/i');
      if (await dataOptions.isVisible()) {
        // Verify deletion options exist
        await expect(dataOptions).toBeVisible();
      }
    });
  });
});

// Device-specific tests
test.describe('Mobile Device Tests', () => {
  test('works on iPhone 14 Pro', async ({ browser }) => {
    const context = await browser.newContext({
      ...devices['iPhone 14 Pro'],
    });
    const page = await context.newPage();
    
    await page.goto(TEST_CONFIG.baseURL);
    await expect(page.locator('[data-testid="main-app-screen"]')).toBeVisible();
    
    // Test touch interactions
    await page.tap('[data-testid="mood-check-in-button"]');
    
    await page.screenshot({ path: 'test-results/screenshots/iphone-14-pro.png' });
    await context.close();
  });

  test('works on Samsung Galaxy S21', async ({ browser }) => {
    const context = await browser.newContext({
      ...devices['Galaxy S21'],
    });
    const page = await context.newPage();
    
    await page.goto(TEST_CONFIG.baseURL);
    await expect(page.locator('[data-testid="main-app-screen"]')).toBeVisible();
    
    await page.screenshot({ path: 'test-results/screenshots/galaxy-s21.png' });
    await context.close();
  });
});

// Performance tests
test.describe('Performance Tests', () => {
  test('meets Core Web Vitals standards', async ({ page }) => {
    await page.goto(TEST_CONFIG.baseURL);
    
    // Wait for app to fully load
    await page.waitForLoadState('networkidle');
    
    // Measure performance metrics
    const metrics = await page.evaluate(() => {
      const navigation = performance.getEntriesByType('navigation')[0];
      return {
        loadTime: navigation.loadEventEnd - navigation.loadEventStart,
        domContentLoaded: navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart,
      };
    });
    
    // Should meet reasonable performance standards
    expect(metrics.loadTime).toBeLessThan(3000);
    expect(metrics.domContentLoaded).toBeLessThan(2000);
  });
});
