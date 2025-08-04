const { test, expect } = require('@playwright/test');

test.describe('TherapyScreen Accessibility Tests', () => {
  test.beforeEach(async ({ page }) => {
    // Set up accessibility testing environment
    await page.goto('/therapy');
    await page.waitForLoadState('networkidle');
    await page.waitForSelector('[data-testid="therapy-screen"]', { timeout: 10000 });
    
    // Inject accessibility testing utilities
    await page.evaluate(() => {
      window.a11yTestUtils = {
        // Check if element has proper ARIA attributes
        hasProperAria: (element) => {
          return element.hasAttribute('aria-label') || 
                 element.hasAttribute('aria-labelledby') || 
                 element.textContent.trim().length > 0;
        },
        
        // Check color contrast ratio
        getContrastRatio: (foreground, background) => {
          // Simplified contrast calculation for testing
          const getLuminance = (rgb) => {
            const [r, g, b] = rgb.match(/\d+/g).map(Number);
            return (0.299 * r + 0.587 * g + 0.114 * b) / 255;
          };
          
          const fgLum = getLuminance(foreground);
          const bgLum = getLuminance(background);
          
          const lighter = Math.max(fgLum, bgLum);
          const darker = Math.min(fgLum, bgLum);
          
          return (lighter + 0.05) / (darker + 0.05);
        },
        
        // Check touch target size
        hasAdequateTouchTarget: (element) => {
          const rect = element.getBoundingClientRect();
          return rect.width >= 44 && rect.height >= 44;
        }
      };
    });
  });

  test.describe('Screen Reader Support', () => {
    test('should have proper heading structure', async ({ page }) => {
      const headings = await page.locator('h1, h2, h3, h4, h5, h6, [role="heading"]').all();
      
      expect(headings.length).toBeGreaterThan(0);
      
      // Check heading hierarchy
      let previousLevel = 0;
      for (const heading of headings) {
        const tagName = await heading.evaluate(el => el.tagName.toLowerCase());
        const role = await heading.getAttribute('role');
        const level = role === 'heading' 
          ? parseInt(await heading.getAttribute('aria-level') || '1')
          : parseInt(tagName.replace('h', ''));
        
        // Heading levels should not skip more than one level
        expect(level - previousLevel).toBeLessThanOrEqual(1);
        previousLevel = level;
      }
    });

    test('should have proper ARIA labels for all interactive elements', async ({ page }) => {
      const interactiveElements = await page.locator('button, [role="button"], input, [role="textbox"], [role="slider"]').all();
      
      for (const element of interactiveElements) {
        const hasLabel = await element.evaluate((el) => {
          return el.hasAttribute('aria-label') ||
                 el.hasAttribute('aria-labelledby') ||
                 el.hasAttribute('title') ||
                 (el.textContent && el.textContent.trim().length > 0) ||
                 el.querySelector('label');
        });
        
        expect(hasLabel).toBe(true);
      }
    });

    test('should have proper ARIA live regions for dynamic content', async ({ page }) => {
      // Check for live regions that announce dynamic changes
      await page.locator('[data-testid="text-mode-button"]').click();
      
      // Send a message to trigger AI response
      await page.locator('[data-testid="chat-input-field"]').fill('Hello');
      await page.locator('[data-testid="send-button"]').click();
      
      // Check for typing indicator with proper ARIA live region
      const typingIndicator = page.locator('[data-testid="typing-indicator"]');
      if (await typingIndicator.count() > 0) {
        const ariaLive = await typingIndicator.getAttribute('aria-live');
        expect(['polite', 'assertive']).toContain(ariaLive);
      }
      
      // Check for message area with live region
      const messagesContainer = page.locator('[data-testid="messages-container"]');
      const hasLiveRegion = await messagesContainer.evaluate(el => {
        return el.hasAttribute('aria-live') || 
               el.querySelector('[aria-live]') !== null;
      });
      
      expect(hasLiveRegion).toBe(true);
    });

    test('should announce crisis situations with assertive live regions', async ({ page }) => {
      await page.locator('[data-testid="text-mode-button"]').click();
      
      // Trigger crisis detection
      await page.locator('[data-testid="chat-input-field"]').fill('I want to hurt myself');
      await page.locator('[data-testid="send-button"]').click();
      
      await page.waitForSelector('[data-testid="ai-message"]', { timeout: 10000 });
      
      // Crisis messages should have assertive live regions
      const crisisMessage = page.locator('[data-testid="ai-message"]').last();
      const parentLiveRegion = await crisisMessage.evaluate(el => {
        let current = el;
        while (current && current !== document.body) {
          if (current.getAttribute('aria-live') === 'assertive') {
            return true;
          }
          current = current.parentElement;
        }
        return false;
      });
      
      expect(parentLiveRegion).toBe(true);
    });

    test('should provide descriptive text for voice recordings', async ({ page }) => {
      await page.locator('[data-testid="voice-mode-button"]').click();
      
      const recordButton = page.locator('[data-testid="record-button"]');
      
      // Check accessibility properties
      await expect(recordButton).toHaveAttribute('aria-label');
      await expect(recordButton).toHaveAttribute('role', 'button');
      
      const ariaLabel = await recordButton.getAttribute('aria-label');
      expect(ariaLabel).toContain('therapy session recording');
      
      // Check for screen reader hints
      const ariaDescription = await recordButton.getAttribute('aria-describedby');
      if (ariaDescription) {
        const descriptionElement = page.locator(`#${ariaDescription}`);
        await expect(descriptionElement).toBeVisible();
      }
    });
  });

  test.describe('Keyboard Navigation', () => {
    test('should support full keyboard navigation', async ({ page }) => {
      // Start from first focusable element
      await page.keyboard.press('Tab');
      
      const focusableElements = await page.locator('button, [role="button"], input, [tabindex="0"]').all();
      
      for (let i = 0; i < Math.min(focusableElements.length, 10); i++) {
        const focused = page.locator(':focus');
        await expect(focused).toBeVisible();
        
        // Element should have visible focus indicator
        const focusStyles = await focused.evaluate(el => {
          const styles = window.getComputedStyle(el);
          return {
            outline: styles.outline,
            outlineWidth: styles.outlineWidth,
            boxShadow: styles.boxShadow,
            border: styles.border
          };
        });
        
        const hasFocusIndicator = 
          focusStyles.outline !== 'none' ||
          focusStyles.outlineWidth !== '0px' ||
          focusStyles.boxShadow !== 'none' ||
          focusStyles.border.includes('px');
        
        expect(hasFocusIndicator).toBe(true);
        
        await page.keyboard.press('Tab');
      }
    });

    test('should activate buttons with Enter and Space keys', async ({ page }) => {
      // Test mode selector buttons
      const textModeButton = page.locator('[data-testid="text-mode-button"]');
      
      await textModeButton.focus();
      await page.keyboard.press('Enter');
      
      await expect(textModeButton).toHaveClass(/modeButtonActive/);
      
      // Test with Space key
      const voiceModeButton = page.locator('[data-testid="voice-mode-button"]');
      await voiceModeButton.focus();
      await page.keyboard.press('Space');
      
      await expect(voiceModeButton).toHaveClass(/modeButtonActive/);
    });

    test('should support keyboard navigation in crisis situations', async ({ page }) => {
      await page.locator('[data-testid="text-mode-button"]').click();
      await page.locator('[data-testid="chat-input-field"]').fill('I want to end my life');
      await page.locator('[data-testid="send-button"]').click();
      
      await page.waitForSelector('[data-testid="ai-message"]', { timeout: 10000 });
      
      // Emergency resources should be keyboard accessible
      const emergencyElements = await page.locator('[data-testid*="emergency"], [data-testid*="crisis"]').all();
      
      for (const element of emergencyElements) {
        const tabIndex = await element.getAttribute('tabindex');
        const role = await element.getAttribute('role');
        
        if (role === 'button' || element.evaluate(el => el.tagName === 'BUTTON')) {
          expect(parseInt(tabIndex) || 0).toBeGreaterThanOrEqual(0);
        }
      }
    });

    test('should trap focus in modal dialogs', async ({ page }) => {
      // Trigger end session modal
      await page.locator('[data-testid="end-session-button"]').click();
      
      if (await page.locator('[data-testid="end-session-modal"]').count() > 0) {
        const modal = page.locator('[data-testid="end-session-modal"]');
        
        // Modal should have focus trap
        const focusableInModal = await modal.locator('button, [role="button"], input').all();
        expect(focusableInModal.length).toBeGreaterThan(0);
        
        // First element should be focused
        const firstFocusable = focusableInModal[0];
        await expect(firstFocusable).toBeFocused();
        
        // Tab through modal elements
        for (let i = 0; i < focusableInModal.length * 2; i++) {
          await page.keyboard.press('Tab');
          
          // Focus should stay within modal
          const currentFocus = page.locator(':focus');
          const isInModal = await currentFocus.evaluate((el, modalEl) => {
            return modalEl.contains(el);
          }, await modal.elementHandle());
          
          expect(isInModal).toBe(true);
        }
      }
    });
  });

  test.describe('Color Contrast and Visual Design', () => {
    test('should meet WCAG AA color contrast requirements', async ({ page }) => {
      const textElements = await page.locator('p, span, button, input, [role="button"]').all();
      
      for (const element of textElements.slice(0, 10)) { // Test first 10 elements
        const styles = await element.evaluate(el => {
          const computed = window.getComputedStyle(el);
          return {
            color: computed.color,
            backgroundColor: computed.backgroundColor,
            fontSize: computed.fontSize
          };
        });
        
        if (styles.color && styles.backgroundColor && 
            styles.color !== 'rgba(0, 0, 0, 0)' && 
            styles.backgroundColor !== 'rgba(0, 0, 0, 0)') {
          
          const contrast = await element.evaluate((el, styles) => {
            return window.a11yTestUtils.getContrastRatio(styles.color, styles.backgroundColor);
          }, styles);
          
          const fontSize = parseFloat(styles.fontSize);
          const requiredRatio = fontSize >= 18 || (fontSize >= 14 && await element.evaluate(el => 
            getComputedStyle(el).fontWeight >= 700)) ? 3 : 4.5;
          
          expect(contrast).toBeGreaterThanOrEqual(requiredRatio);
        }
      }
    });

    test('should have high contrast mode support', async ({ page }) => {
      // Simulate high contrast mode
      await page.evaluate(() => {
        document.body.classList.add('high-contrast');
      });
      
      // Check that important elements are still visible
      const criticalElements = [
        '[data-testid="therapy-title"]',
        '[data-testid="record-button"]',
        '[data-testid="send-button"]',
        '[data-testid="end-session-button"]'
      ];
      
      for (const selector of criticalElements) {
        if (await page.locator(selector).count() > 0) {
          const element = page.locator(selector).first();
          await expect(element).toBeVisible();
          
          // Element should have sufficient contrast in high contrast mode
          const isHighContrast = await element.evaluate(el => {
            const styles = getComputedStyle(el);
            const bgColor = styles.backgroundColor;
            const textColor = styles.color;
            
            // In high contrast mode, colors should be more extreme
            return bgColor.includes('255') || bgColor.includes('0') ||
                   textColor.includes('255') || textColor.includes('0');
          });
          
          expect(isHighContrast).toBe(true);
        }
      }
    });

    test('should support reduced motion preferences', async ({ page }) => {
      // Simulate prefers-reduced-motion
      await page.emulateMedia({ reducedMotion: 'reduce' });
      
      // Check that animations are disabled or reduced
      const animatedElements = await page.locator('[style*="animation"], [class*="animate"]').all();
      
      for (const element of animatedElements) {
        const animationDuration = await element.evaluate(el => {
          const styles = getComputedStyle(el);
          return styles.animationDuration;
        });
        
        // Animation should be disabled or very short
        expect(animationDuration === '0s' || animationDuration === 'none').toBe(true);
      }
    });
  });

  test.describe('Touch Target Accessibility', () => {
    test('should have adequate touch target sizes', async ({ page }) => {
      const touchTargets = await page.locator('button, [role="button"], input[type="submit"]').all();
      
      for (const target of touchTargets) {
        const isAdequate = await target.evaluate(el => {
          return window.a11yTestUtils.hasAdequateTouchTarget(el);
        });
        
        expect(isAdequate).toBe(true);
      }
    });

    test('should have adequate spacing between touch targets', async ({ page }) => {
      const buttons = await page.locator('button, [role="button"]').all();
      
      for (let i = 0; i < buttons.length - 1; i++) {
        const currentButton = buttons[i];
        const nextButton = buttons[i + 1];
        
        const currentRect = await currentButton.boundingBox();
        const nextRect = await nextButton.boundingBox();
        
        if (currentRect && nextRect) {
          // Check if buttons are in the same row (similar y coordinates)
          const sameRow = Math.abs(currentRect.y - nextRect.y) < 20;
          
          if (sameRow) {
            const horizontalDistance = Math.abs(currentRect.x - nextRect.x) - 
                                     Math.min(currentRect.width, nextRect.width);
            expect(horizontalDistance).toBeGreaterThanOrEqual(8); // 8px minimum spacing
          }
        }
      }
    });
  });

  test.describe('Voice Recording Accessibility', () => {
    test('should provide audio feedback for recording states', async ({ page }) => {
      await page.locator('[data-testid="voice-mode-button"]').click();
      
      // Mock audio feedback
      await page.evaluate(() => {
        window.AudioContext = window.AudioContext || window.webkitAudioContext || class {
          createOscillator() {
            return {
              frequency: { value: 440 },
              connect: () => {},
              start: () => {},
              stop: () => {}
            };
          }
          createGain() {
            return { 
              gain: { value: 0.1 },
              connect: () => {}
            };
          }
          get destination() { return {}; }
        };
      });
      
      const recordButton = page.locator('[data-testid="record-button"]');
      
      // Should have proper ARIA states for recording
      await recordButton.click();
      
      if (await page.locator('[data-testid="recording-status"]').count() > 0) {
        const recordingState = await recordButton.getAttribute('aria-pressed');
        expect(recordingState).toBe('true');
        
        // Should have live region announcing recording state
        const statusElement = page.locator('[data-testid="recording-status"]');
        const hasLiveRegion = await statusElement.evaluate(el => {
          return el.hasAttribute('aria-live') || 
                 el.closest('[aria-live]') !== null;
        });
        
        expect(hasLiveRegion).toBe(true);
      }
    });

    test('should support users who cannot use voice input', async ({ page }) => {
      await page.locator('[data-testid="voice-mode-button"]').click();
      
      // Should provide alternative input method
      const hasAlternative = await page.evaluate(() => {
        // Check if there's a way to input text as alternative to voice
        const textInput = document.querySelector('[data-testid="chat-input-field"]');
        const textMode = document.querySelector('[data-testid="text-mode-button"]');
        
        return textInput !== null || textMode !== null;
      });
      
      expect(hasAlternative).toBe(true);
      
      // Should have instructions for alternative methods
      const instructions = await page.locator('text=/alternative|text|type|keyboard/i').count();
      expect(instructions).toBeGreaterThan(0);
    });
  });

  test.describe('Crisis Situation Accessibility', () => {
    test('should make emergency resources highly accessible', async ({ page }) => {
      await page.locator('[data-testid="text-mode-button"]').click();
      await page.locator('[data-testid="chat-input-field"]').fill('I want to hurt myself');
      await page.locator('[data-testid="send-button"]').click();
      
      await page.waitForSelector('[data-testid="ai-message"]', { timeout: 10000 });
      
      // Emergency resources should be prominently marked
      const emergencyElements = await page.locator('[data-testid*="emergency"], [data-testid*="crisis"]').all();
      
      for (const element of emergencyElements) {
        // Should have proper ARIA roles
        const role = await element.getAttribute('role');
        expect(['button', 'link', 'alert', 'region']).toContain(role);
        
        // Should be keyboard accessible
        const tabIndex = await element.getAttribute('tabindex');
        expect(parseInt(tabIndex) || 0).toBeGreaterThanOrEqual(0);
        
        // Should have clear labeling
        const hasLabel = await element.evaluate(el => {
          return el.hasAttribute('aria-label') ||
                 el.textContent.toLowerCase().includes('emergency') ||
                 el.textContent.toLowerCase().includes('crisis') ||
                 el.textContent.toLowerCase().includes('help');
        });
        
        expect(hasLabel).toBe(true);
      }
    });

    test('should provide multiple ways to access help', async ({ page }) => {
      // Trigger crisis scenario
      await page.locator('[data-testid="text-mode-button"]').click();
      await page.locator('[data-testid="chat-input-field"]').fill('I need immediate help');
      await page.locator('[data-testid="send-button"]').click();
      
      await page.waitForSelector('[data-testid="ai-message"]', { timeout: 10000 });
      
      // Should provide multiple contact methods
      const contactMethods = await page.evaluate(() => {
        const methods = [];
        
        // Look for call buttons
        if (document.querySelector('[data-testid*="call"]')) methods.push('call');
        
        // Look for text/SMS options
        if (document.querySelector('[data-testid*="text"], [data-testid*="sms"]')) methods.push('text');
        
        // Look for chat options
        if (document.querySelector('[data-testid*="chat"]')) methods.push('chat');
        
        // Look for web resources
        if (document.querySelector('[data-testid*="web"], [data-testid*="link"]')) methods.push('web');
        
        return methods;
      });
      
      expect(contactMethods.length).toBeGreaterThan(1);
    });

    test('should work without color or sound dependencies', async ({ page }) => {
      // Simulate colorblind user
      await page.evaluate(() => {
        // Remove all color styling to test color-independence
        const style = document.createElement('style');
        style.textContent = '* { color: black !important; background-color: white !important; }';
        document.head.appendChild(style);
      });
      
      await page.locator('[data-testid="text-mode-button"]').click();
      await page.locator('[data-testid="chat-input-field"]').fill('I am in crisis');
      await page.locator('[data-testid="send-button"]').click();
      
      await page.waitForSelector('[data-testid="ai-message"]', { timeout: 10000 });
      
      // Crisis elements should still be identifiable without color
      const crisisElements = await page.locator('[data-testid*="emergency"], [data-testid*="crisis"]').all();
      
      for (const element of crisisElements) {
        // Should have text or icon indicators, not just color
        const hasTextIndicator = await element.evaluate(el => {
          const text = el.textContent.toLowerCase();
          return text.includes('emergency') || 
                 text.includes('crisis') || 
                 text.includes('help') ||
                 text.includes('urgent') ||
                 el.querySelector('[aria-label*="emergency"]') ||
                 el.querySelector('[aria-label*="crisis"]');
        });
        
        expect(hasTextIndicator).toBe(true);
      }
    });
  });

  test.describe('Cognitive Accessibility', () => {
    test('should use clear and simple language', async ({ page }) => {
      const textElements = await page.locator('p, span, button, [aria-label]').all();
      
      for (const element of textElements.slice(0, 10)) {
        const text = await element.textContent();
        const ariaLabel = await element.getAttribute('aria-label');
        const textToCheck = text || ariaLabel || '';
        
        if (textToCheck && textToCheck.length > 10) {
          // Check for overly complex words (simplified test)
          const complexWords = textToCheck.match(/\w{12,}/g) || [];
          const totalWords = textToCheck.split(/\s+/).length;
          const complexRatio = complexWords.length / totalWords;
          
          expect(complexRatio).toBeLessThan(0.2); // Less than 20% complex words
        }
      }
    });

    test('should provide clear instructions and feedback', async ({ page }) => {
      // Check for helpful instructions
      const instructions = await page.locator('text=/how to|instructions|help|guide/i').count();
      expect(instructions).toBeGreaterThan(0);
      
      // Check for error messages that are helpful
      await page.locator('[data-testid="text-mode-button"]').click();
      
      // Try to send empty message
      await page.locator('[data-testid="send-button"]').click();
      
      // Should provide clear feedback (not send empty message)
      const emptyMessageSent = await page.locator('[data-testid="user-message"]').count();
      expect(emptyMessageSent).toBe(0); // No empty message should be sent
    });

    test('should maintain consistent navigation patterns', async ({ page }) => {
      // Check that similar elements have consistent interactions
      const modeButtons = await page.locator('[data-testid*="mode-button"]').all();
      
      for (const button of modeButtons) {
        // All mode buttons should have similar structure
        const hasIcon = await button.locator('svg, img, [role="img"]').count() > 0;
        const hasText = (await button.textContent()).trim().length > 0;
        
        expect(hasIcon || hasText).toBe(true);
        
        // Should have consistent ARIA attributes
        const role = await button.getAttribute('role');
        expect(role).toBe('button');
      }
    });
  });
});