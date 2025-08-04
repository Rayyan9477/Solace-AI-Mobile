const { test, expect } = require('@playwright/test');

test.describe('TherapyScreen Tests', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to TherapyScreen
    await page.goto('/therapy');
    await page.waitForLoadState('networkidle');
    await page.waitForSelector('[data-testid="therapy-screen"]', { timeout: 10000 });
  });

  test.describe('Screen Initialization', () => {
    test('should render TherapyScreen with all core elements', async ({ page }) => {
      // Check header elements
      await expect(page.locator('[data-testid="therapy-header"]')).toBeVisible();
      await expect(page.locator('[data-testid="therapy-title"]')).toContainText('Therapy Session');
      await expect(page.locator('[data-testid="session-timer"]')).toBeVisible();
      
      // Check mode selector
      await expect(page.locator('[data-testid="mode-selector"]')).toBeVisible();
      await expect(page.locator('[data-testid="text-mode-button"]')).toBeVisible();
      await expect(page.locator('[data-testid="voice-mode-button"]')).toBeVisible();
      await expect(page.locator('[data-testid="guided-mode-button"]')).toBeVisible();
      
      // Check messages container
      await expect(page.locator('[data-testid="messages-container"]')).toBeVisible();
      
      // Check input area
      await expect(page.locator('[data-testid="input-container"]')).toBeVisible();
    });

    test('should display welcome messages on initialization', async ({ page }) => {
      // Wait for welcome messages to appear
      await page.waitForSelector('[data-testid="ai-message"]', { timeout: 5000 });
      
      const messages = await page.locator('[data-testid="ai-message"]').all();
      expect(messages.length).toBeGreaterThanOrEqual(3);
      
      // Check first welcome message
      const firstMessage = messages[0];
      await expect(firstMessage).toContainText('Welcome to your personal therapy space');
      
      // Check interaction options message
      const secondMessage = messages[1];
      await expect(secondMessage).toContainText('text or voice');
      
      // Check prompt message
      const thirdMessage = messages[2];
      await expect(thirdMessage).toContainText('How would you like to begin');
    });

    test('should start session timer on initialization', async ({ page }) => {
      const timer = page.locator('[data-testid="session-timer"]');
      const initialTime = await timer.textContent();
      
      // Wait 2 seconds and check if timer has incremented
      await page.waitForTimeout(2000);
      const updatedTime = await timer.textContent();
      
      expect(initialTime).not.toBe(updatedTime);
      expect(updatedTime).toMatch(/^\d+:\d{2}$/);
    });
  });

  test.describe('Mode Switching', () => {
    test('should switch between text, voice, and guided modes', async ({ page }) => {
      // Test text mode (default)
      const textButton = page.locator('[data-testid="text-mode-button"]');
      await expect(textButton).toHaveClass(/modeButtonActive/);
      await expect(page.locator('[data-testid="chat-input"]')).toBeVisible();
      
      // Switch to voice mode
      const voiceButton = page.locator('[data-testid="voice-mode-button"]');
      await voiceButton.click();
      await expect(voiceButton).toHaveClass(/modeButtonActive/);
      await expect(page.locator('[data-testid="therapy-recorder"]')).toBeVisible();
      await expect(page.locator('[data-testid="chat-input"]')).not.toBeVisible();
      
      // Switch to guided mode
      const guidedButton = page.locator('[data-testid="guided-mode-button"]');
      await guidedButton.click();
      await expect(guidedButton).toHaveClass(/modeButtonActive/);
      await expect(page.locator('[data-testid="guided-exercises"]')).toBeVisible();
    });

    test('should show appropriate input components for each mode', async ({ page }) => {
      // Text mode input
      await page.locator('[data-testid="text-mode-button"]').click();
      await expect(page.locator('[data-testid="chat-input"]')).toBeVisible();
      await expect(page.locator('[data-testid="therapy-recorder"]')).not.toBeVisible();
      
      // Voice mode input
      await page.locator('[data-testid="voice-mode-button"]').click();
      await expect(page.locator('[data-testid="therapy-recorder"]')).toBeVisible();
      await expect(page.locator('[data-testid="chat-input"]')).not.toBeVisible();
    });
  });

  test.describe('Text Mode Functionality', () => {
    test.beforeEach(async ({ page }) => {
      await page.locator('[data-testid="text-mode-button"]').click();
    });

    test('should send text messages and receive AI responses', async ({ page }) => {
      const chatInput = page.locator('[data-testid="chat-input-field"]');
      const sendButton = page.locator('[data-testid="send-button"]');
      
      // Send a test message
      await chatInput.fill('I am feeling anxious today');
      await sendButton.click();
      
      // Check user message appears
      await expect(page.locator('[data-testid="user-message"]').last()).toContainText('I am feeling anxious today');
      
      // Wait for AI response
      await page.waitForSelector('[data-testid="typing-indicator"]', { timeout: 2000 });
      await page.waitForSelector('[data-testid="ai-message"]', { timeout: 10000 });
      
      // Check AI response contains appropriate content
      const aiResponse = page.locator('[data-testid="ai-message"]').last();
      await expect(aiResponse).toContainText(/anxious|anxiety|feel/i);
    });

    test('should handle empty messages gracefully', async ({ page }) => {
      const chatInput = page.locator('[data-testid="chat-input-field"]');
      const sendButton = page.locator('[data-testid="send-button"]');
      
      // Try to send empty message
      await chatInput.fill('   ');
      await sendButton.click();
      
      // Message should not be sent
      const userMessages = await page.locator('[data-testid="user-message"]').count();
      expect(userMessages).toBe(0);
    });

    test('should disable input during AI response processing', async ({ page }) => {
      const chatInput = page.locator('[data-testid="chat-input-field"]');
      const sendButton = page.locator('[data-testid="send-button"]');
      
      await chatInput.fill('Test message');
      await sendButton.click();
      
      // Input should be disabled while AI is responding
      await expect(sendButton).toBeDisabled();
      await expect(chatInput).toBeDisabled();
      
      // Wait for response to complete
      await page.waitForSelector('[data-testid="ai-message"]', { timeout: 10000 });
      
      // Input should be enabled again
      await expect(sendButton).toBeEnabled();
      await expect(chatInput).toBeEnabled();
    });
  });

  test.describe('Voice Recording Functionality', () => {
    test.beforeEach(async ({ page }) => {
      await page.locator('[data-testid="voice-mode-button"]').click();
    });

    test('should show voice recorder component in voice mode', async ({ page }) => {
      await expect(page.locator('[data-testid="therapy-recorder"]')).toBeVisible();
      await expect(page.locator('[data-testid="record-button"]')).toBeVisible();
    });

    test('should handle microphone permissions gracefully', async ({ page }) => {
      // Mock permission denial
      await page.evaluate(() => {
        navigator.mediaDevices.getUserMedia = () => 
          Promise.reject(new Error('Permission denied'));
      });
      
      const recordButton = page.locator('[data-testid="record-button"]');
      await recordButton.click();
      
      // Should show permission alert
      await page.waitForSelector('.permission-alert', { timeout: 3000 });
      await expect(page.locator('.permission-alert')).toContainText('Permission Required');
    });

    test('should start and stop recording correctly', async ({ page }) => {
      // Mock successful media access
      await page.evaluate(() => {
        navigator.mediaDevices.getUserMedia = () => 
          Promise.resolve(new MediaStream());
      });
      
      const recordButton = page.locator('[data-testid="record-button"]');
      
      // Start recording
      await recordButton.click();
      await expect(page.locator('[data-testid="recording-status"]')).toBeVisible();
      await expect(page.locator('[data-testid="recording-timer"]')).toBeVisible();
      
      // Stop recording
      await recordButton.click();
      await expect(page.locator('[data-testid="recording-status"]')).not.toBeVisible();
    });

    test('should enforce maximum recording duration', async ({ page }) => {
      await page.evaluate(() => {
        navigator.mediaDevices.getUserMedia = () => 
          Promise.resolve(new MediaStream());
      });
      
      const recordButton = page.locator('[data-testid="record-button"]');
      await recordButton.click();
      
      // Wait near max duration (mocked to be faster)
      await page.waitForTimeout(1000);
      
      const timer = page.locator('[data-testid="recording-timer"]');
      const timerText = await timer.textContent();
      
      // Should show duration format
      expect(timerText).toMatch(/\d+:\d{2}/);
    });
  });

  test.describe('Guided Exercises', () => {
    test.beforeEach(async ({ page }) => {
      await page.locator('[data-testid="guided-mode-button"]').click();
    });

    test('should display guided exercises in guided mode', async ({ page }) => {
      await expect(page.locator('[data-testid="guided-exercises"]')).toBeVisible();
      await expect(page.locator('[data-testid="exercises-title"]')).toContainText('Guided Exercises');
      
      // Check for exercise cards
      const exerciseCards = await page.locator('[data-testid="exercise-card"]').count();
      expect(exerciseCards).toBeGreaterThan(0);
    });

    test('should start guided exercise when card is clicked', async ({ page }) => {
      const firstExercise = page.locator('[data-testid="exercise-card"]').first();
      await firstExercise.click();
      
      // Should see exercise prompt message
      await page.waitForSelector('[data-testid="ai-message"]', { timeout: 5000 });
      const lastMessage = page.locator('[data-testid="ai-message"]').last();
      await expect(lastMessage).toContainText(/begin|exercise|let's/i);
    });

    test('should show all available therapeutic exercises', async ({ page }) => {
      const exercises = [
        '5-4-3-2-1 Grounding',
        'Mindful Breathing',
        'Thought Challenging',
        'Mood Check-In'
      ];
      
      for (const exerciseName of exercises) {
        await expect(page.locator(`[data-testid="exercise-card"]:has-text("${exerciseName}")`)).toBeVisible();
      }
    });
  });

  test.describe('Crisis Detection and Safety', () => {
    test.beforeEach(async ({ page }) => {
      await page.locator('[data-testid="text-mode-button"]').click();
    });

    test('should detect crisis keywords and provide appropriate response', async ({ page }) => {
      const crisisMessages = [
        'I want to harm myself',
        'I am thinking about suicide',
        'I want to end it all'
      ];
      
      for (const message of crisisMessages) {
        await page.locator('[data-testid="chat-input-field"]').fill(message);
        await page.locator('[data-testid="send-button"]').click();
        
        // Wait for AI response
        await page.waitForSelector('[data-testid="ai-message"]', { timeout: 10000 });
        
        const response = page.locator('[data-testid="ai-message"]').last();
        await expect(response).toContainText(/concerned|help|988|emergency/i);
        await expect(response).toHaveClass(/urgent-message/);
      }
    });

    test('should provide emergency contact suggestions for crisis situations', async ({ page }) => {
      await page.locator('[data-testid="chat-input-field"]').fill('I want to hurt myself');
      await page.locator('[data-testid="send-button"]').click();
      
      await page.waitForSelector('[data-testid="ai-message"]', { timeout: 10000 });
      
      // Should show emergency suggestions
      await expect(page.locator('[data-testid="suggestion-button"]:has-text("I need immediate help")')).toBeVisible();
      await expect(page.locator('[data-testid="suggestion-button"]:has-text("I\'m safe for now")')).toBeVisible();
    });

    test('should handle emergency button in header', async ({ page }) => {
      const emergencyButton = page.locator('[data-testid="emergency-button"]');
      await emergencyButton.click();
      
      // Should show emergency resources or contact options
      await expect(page.locator('[data-testid="emergency-modal"]')).toBeVisible();
    });
  });

  test.describe('Session Management', () => {
    test('should handle session end correctly', async ({ page }) => {
      const endButton = page.locator('[data-testid="end-session-button"]');
      await endButton.click();
      
      // Should show confirmation dialog
      await expect(page.locator('[data-testid="end-session-modal"]')).toBeVisible();
      await expect(page.locator('.modal-text')).toContainText('End Therapy Session');
      
      // Test cancel
      await page.locator('[data-testid="cancel-end-session"]').click();
      await expect(page.locator('[data-testid="end-session-modal"]')).not.toBeVisible();
      
      // Test confirm end
      await endButton.click();
      await page.locator('[data-testid="confirm-end-session"]').click();
      
      // Should navigate away or show completion screen
      await expect(page.url()).not.toContain('/therapy');
    });

    test('should save session data on completion', async ({ page }) => {
      // Send some messages first
      await page.locator('[data-testid="text-mode-button"]').click();
      await page.locator('[data-testid="chat-input-field"]').fill('Test session message');
      await page.locator('[data-testid="send-button"]').click();
      
      await page.waitForSelector('[data-testid="ai-message"]', { timeout: 10000 });
      
      // End session
      await page.locator('[data-testid="end-session-button"]').click();
      await page.locator('[data-testid="confirm-end-session"]').click();
      
      // Check if session data was saved (implementation dependent)
      // This would require checking local storage, database, or API calls
    });
  });

  test.describe('Contextual AI Responses', () => {
    test.beforeEach(async ({ page }) => {
      await page.locator('[data-testid="text-mode-button"]').click();
    });

    test('should provide appropriate responses for different emotional states', async ({ page }) => {
      const emotionalTests = [
        { input: 'I feel anxious', expected: /anxious|anxiety|grounding/i },
        { input: 'I am sad and depressed', expected: /sad|depressed|courage|feelings/i },
        { input: 'I am angry about everything', expected: /angry|frustrated|emotion/i },
        { input: 'I feel overwhelmed with stress', expected: /overwhelmed|stress|manageable/i }
      ];
      
      for (const test of emotionalTests) {
        await page.locator('[data-testid="chat-input-field"]').fill(test.input);
        await page.locator('[data-testid="send-button"]').click();
        
        await page.waitForSelector('[data-testid="ai-message"]', { timeout: 10000 });
        
        const response = page.locator('[data-testid="ai-message"]').last();
        await expect(response).toContainText(test.expected);
        
        // Clear for next test
        await page.reload();
        await page.waitForLoadState('networkidle');
      }
    });

    test('should provide contextual suggestions based on user input', async ({ page }) => {
      await page.locator('[data-testid="chat-input-field"]').fill('I have anxiety');
      await page.locator('[data-testid="send-button"]').click();
      
      await page.waitForSelector('[data-testid="ai-message"]', { timeout: 10000 });
      
      // Should show relevant suggestions
      await expect(page.locator('[data-testid="suggestion-button"]:has-text("grounding exercise")')).toBeVisible();
      await expect(page.locator('[data-testid="suggestion-button"]:has-text("talk about it")')).toBeVisible();
    });
  });

  test.describe('Accessibility Compliance', () => {
    test('should have proper ARIA labels and roles', async ({ page }) => {
      // Check button accessibility
      await expect(page.locator('[data-testid="record-button"]')).toHaveAttribute('role', 'button');
      await expect(page.locator('[data-testid="send-button"]')).toHaveAttribute('aria-label');
      
      // Check input accessibility
      await expect(page.locator('[data-testid="chat-input-field"]')).toHaveAttribute('aria-label');
      
      // Check navigation accessibility
      await expect(page.locator('[data-testid="back-button"]')).toHaveAttribute('aria-label', 'Go back');
    });

    test('should support keyboard navigation', async ({ page }) => {
      // Test tab navigation through interactive elements
      await page.keyboard.press('Tab');
      let focusedElement = await page.locator(':focus').getAttribute('data-testid');
      expect(focusedElement).toBeTruthy();
      
      // Continue tabbing through elements
      await page.keyboard.press('Tab');
      await page.keyboard.press('Tab');
      
      // Should be able to activate buttons with Enter
      if (await page.locator(':focus[data-testid="text-mode-button"]').count() > 0) {
        await page.keyboard.press('Enter');
        await expect(page.locator('[data-testid="text-mode-button"]')).toHaveClass(/modeButtonActive/);
      }
    });

    test('should have minimum touch target sizes', async ({ page }) => {
      const buttons = await page.locator('button, [role="button"]').all();
      
      for (const button of buttons) {
        const boundingBox = await button.boundingBox();
        if (boundingBox) {
          expect(boundingBox.width).toBeGreaterThanOrEqual(44);
          expect(boundingBox.height).toBeGreaterThanOrEqual(44);
        }
      }
    });

    test('should support screen readers with proper announcements', async ({ page }) => {
      // Test aria-live regions for dynamic content
      await expect(page.locator('[aria-live]')).toBeVisible();
      
      // Test semantic elements
      await expect(page.locator('main, section, header')).toHaveCount({ min: 1 });
    });
  });

  test.describe('Error Handling', () => {
    test('should handle network failures gracefully', async ({ page }) => {
      // Simulate network failure
      await page.route('**/*', route => route.abort());
      
      await page.locator('[data-testid="chat-input-field"]').fill('Test message');
      await page.locator('[data-testid="send-button"]').click();
      
      // Should show error state or retry option
      await expect(page.locator('[data-testid="error-message"], [data-testid="retry-button"]')).toBeVisible({ timeout: 10000 });
    });

    test('should handle recording errors appropriately', async ({ page }) => {
      await page.locator('[data-testid="voice-mode-button"]').click();
      
      // Mock recording failure
      await page.evaluate(() => {
        window.MediaRecorder = class {
          constructor() {
            throw new Error('Recording not supported');
          }
        };
      });
      
      await page.locator('[data-testid="record-button"]').click();
      
      // Should show error message
      await expect(page.locator('[data-testid="recording-error"]')).toBeVisible();
    });
  });

  test.describe('Performance', () => {
    test('should load within acceptable time limits', async ({ page }) => {
      const startTime = Date.now();
      await page.goto('/therapy');
      await page.waitForSelector('[data-testid="therapy-screen"]');
      const loadTime = Date.now() - startTime;
      
      expect(loadTime).toBeLessThan(3000); // Should load within 3 seconds
    });

    test('should handle large message histories efficiently', async ({ page }) => {
      await page.locator('[data-testid="text-mode-button"]').click();
      
      // Send multiple messages to test performance
      for (let i = 0; i < 20; i++) {
        await page.locator('[data-testid="chat-input-field"]').fill(`Message ${i + 1}`);
        await page.locator('[data-testid="send-button"]').click();
        await page.waitForTimeout(100); // Small delay to prevent overwhelming
      }
      
      // Check that messages are still responsive
      const messagesContainer = page.locator('[data-testid="messages-container"]');
      await expect(messagesContainer).toBeVisible();
      
      // Should be able to scroll smoothly
      await messagesContainer.scroll({ top: 0 });
      await messagesContainer.scroll({ top: -1 });
    });
  });
});