// e2e/solace-mental-health-accessibility.spec.js
// Mental Health Accessibility and Crisis Safety Tests for Solace AI Mobile
const { test, expect } = require("@playwright/test");

test.describe("Solace AI Mobile - Mental Health Accessibility & Safety", () => {
  let accessibilityIssues = [];

  test.beforeEach(async ({ page }) => {
    accessibilityIssues = [];
    
    // Set viewport for accessibility testing
    await page.setViewportSize({ width: 1280, height: 720 });
  });

  test.afterEach(async ({ page }, testInfo) => {
    if (accessibilityIssues.length > 0) {
      console.log(`\n♿ Accessibility Issues (${testInfo.title}):`);
      accessibilityIssues.forEach(issue => {
        console.log(`  - ${issue.severity}: ${issue.description} (${issue.selector})`);
      });
    }

    if (testInfo.status !== testInfo.expectedStatus) {
      await page.screenshot({ 
        path: `test-results/accessibility-failure-${testInfo.title.replace(/[^a-zA-Z0-9]/g, '-')}-${Date.now()}.png`,
        fullPage: true 
      });
    }
  });

  test("1. Crisis Support Accessibility", async ({ page }) => {
    console.log("🔍 Testing: Crisis Support Access");
    
    await page.goto("http://localhost:8082", { 
      waitUntil: 'networkidle',
      timeout: 60000 
    });
    await page.waitForTimeout(3000);

    // Look for emergency/crisis support buttons
    const crisisKeywords = ['emergency', 'crisis', 'help', 'support', 'hotline', 'call', '911', '988'];
    let crisisElementFound = false;

    for (const keyword of crisisKeywords) {
      const crisisElement = await page.locator(`button:has-text("${keyword}"), a:has-text("${keyword}"), [aria-label*="${keyword}"], [data-testid*="${keyword}"]`).first();
      
      if (await crisisElement.isVisible()) {
        crisisElementFound = true;
        console.log(`✅ Crisis support element found: ${keyword}`);
        
        // Check accessibility of crisis element
        const ariaLabel = await crisisElement.getAttribute('aria-label');
        const role = await crisisElement.getAttribute('role');
        const tabIndex = await crisisElement.getAttribute('tabindex');
        
        if (!ariaLabel && !(await crisisElement.textContent())?.trim()) {
          accessibilityIssues.push({
            severity: 'Critical',
            description: 'Crisis support button lacks accessible label',
            selector: `text=${keyword}`
          });
        }

        // Test keyboard accessibility for crisis elements
        try {
          await crisisElement.focus();
          const isFocused = await crisisElement.evaluate(el => el === document.activeElement);
          
          if (!isFocused) {
            accessibilityIssues.push({
              severity: 'High',
              description: 'Crisis support element not keyboard accessible',
              selector: `text=${keyword}`
            });
          }
        } catch (error) {
          accessibilityIssues.push({
            severity: 'High',
            description: `Crisis support element focus failed: ${error.message}`,
            selector: `text=${keyword}`
          });
        }

        // Check if crisis button is prominently visible
        const boundingBox = await crisisElement.boundingBox();
        if (boundingBox && boundingBox.width < 100) {
          accessibilityIssues.push({
            severity: 'Medium',
            description: 'Crisis support button may be too small to notice easily',
            selector: `text=${keyword}`
          });
        }

        break;
      }
    }

    if (!crisisElementFound) {
      accessibilityIssues.push({
        severity: 'Critical',
        description: 'No visible crisis support/emergency help access found on main interface',
        selector: 'body'
      });
    }

    // Check for crisis intervention messaging
    const safetyMessages = await page.locator('text="safe", text="safety", text="confidential", text="private", text="secure"').count();
    if (safetyMessages === 0) {
      accessibilityIssues.push({
        severity: 'Medium',
        description: 'No safety/security messaging visible to reassure users',
        selector: 'body'
      });
    }

    console.log("✅ Crisis support accessibility check complete");
  });

  test("2. Color Contrast and Visual Accessibility", async ({ page }) => {
    console.log("🔍 Testing: Color Contrast and Visual Accessibility");
    
    await page.goto("http://localhost:8082", { 
      waitUntil: 'networkidle',
      timeout: 60000 
    });
    await page.waitForTimeout(3000);

    // Check text contrast ratios
    const textElements = await page.locator('h1, h2, h3, h4, h5, h6, p, span, a, button, label').all();
    const contrastIssues = [];

    for (const element of textElements.slice(0, 20)) { // Test first 20 elements
      if (await element.isVisible()) {
        try {
          const styles = await element.evaluate((el) => {
            const computed = window.getComputedStyle(el);
            return {
              color: computed.color,
              backgroundColor: computed.backgroundColor,
              fontSize: computed.fontSize,
              fontWeight: computed.fontWeight,
              text: el.textContent?.trim().substring(0, 50)
            };
          });

          // Simple contrast check (RGB values)
          const colorMatch = styles.color.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);
          const bgMatch = styles.backgroundColor.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);

          if (colorMatch && bgMatch) {
            const [, r1, g1, b1] = colorMatch.map(Number);
            const [, r2, g2, b2] = bgMatch.map(Number);

            // Calculate relative luminance (simplified)
            const luminance1 = (0.299 * r1 + 0.587 * g1 + 0.114 * b1) / 255;
            const luminance2 = (0.299 * r2 + 0.587 * g2 + 0.114 * b2) / 255;

            const contrast = Math.abs(luminance1 - luminance2);
            
            if (contrast < 0.3) { // Simplified contrast threshold
              contrastIssues.push({
                text: styles.text,
                color: styles.color,
                backgroundColor: styles.backgroundColor,
                contrast: contrast.toFixed(2)
              });
            }
          }
        } catch (error) {
          // Skip elements that can't be analyzed
        }
      }
    }

    if (contrastIssues.length > 0) {
      accessibilityIssues.push({
        severity: 'High',
        description: `Poor color contrast detected in ${contrastIssues.length} elements - may be difficult to read`,
        selector: 'text-elements'
      });
      
      console.log("⚠️ Contrast issues:", contrastIssues.slice(0, 3)); // Log first 3 issues
    }

    // Check for color-only information conveying
    const colorOnlyElements = await page.locator('[style*="color: red"], [style*="color: green"], .red, .green, .error-color, .success-color').count();
    if (colorOnlyElements > 0) {
      // Check if these elements also have text or icons
      const colorElementsWithContext = await page.locator('[style*="color: red"]:has-text("error"), [style*="color: green"]:has-text("success"), .red:has-text("error"), .green:has-text("success")').count();
      
      if (colorElementsWithContext < colorOnlyElements) {
        accessibilityIssues.push({
          severity: 'Medium',
          description: 'Information may be conveyed by color alone - add text or icons for clarity',
          selector: 'color-coded-elements'
        });
      }
    }

    console.log("✅ Color contrast check complete");
  });

  test("3. Keyboard Navigation and Focus Management", async ({ page }) => {
    console.log("🔍 Testing: Keyboard Navigation");
    
    await page.goto("http://localhost:8082", { 
      waitUntil: 'networkidle',
      timeout: 60000 
    });
    await page.waitForTimeout(3000);

    // Test tab order through interactive elements
    const interactiveElements = [];
    let tabPresses = 0;

    try {
      // Start from beginning of page
      await page.keyboard.press('Home');
      
      for (let i = 0; i < 20; i++) { // Test first 20 tab stops
        await page.keyboard.press('Tab');
        tabPresses++;
        
        const focusedElement = await page.evaluate(() => {
          const el = document.activeElement;
          return el ? {
            tagName: el.tagName.toLowerCase(),
            type: el.type || null,
            ariaLabel: el.getAttribute('aria-label'),
            text: el.textContent?.trim().substring(0, 30),
            role: el.getAttribute('role'),
            tabIndex: el.tabIndex,
            isVisible: el.offsetWidth > 0 && el.offsetHeight > 0
          } : null;
        });

        if (focusedElement && focusedElement.isVisible) {
          interactiveElements.push(focusedElement);
          
          // Check if focused element is properly labeled
          if (!focusedElement.ariaLabel && !focusedElement.text && !focusedElement.role) {
            accessibilityIssues.push({
              severity: 'Medium',
              description: `Focusable ${focusedElement.tagName} element lacks accessible label`,
              selector: `${focusedElement.tagName}[tabindex="${focusedElement.tabIndex}"]`
            });
          }

          // Check for focus indicators
          const hasFocusIndicator = await page.evaluate(() => {
            const el = document.activeElement;
            const styles = window.getComputedStyle(el);
            return styles.outline !== 'none' && styles.outline !== '0px' && styles.outline !== '';
          });

          if (!hasFocusIndicator) {
            accessibilityIssues.push({
              severity: 'Medium',
              description: `${focusedElement.tagName} element lacks visible focus indicator`,
              selector: focusedElement.tagName
            });
          }
        } else if (focusedElement && !focusedElement.isVisible) {
          accessibilityIssues.push({
            severity: 'High',
            description: 'Tab navigation reaches invisible element - focus trap issue',
            selector: 'keyboard-navigation'
          });
        }
      }

      console.log(`✅ Keyboard navigation tested: ${tabPresses} tab presses, ${interactiveElements.length} interactive elements`);

      // Test if essential functions are keyboard accessible
      const essentialElements = ['button', 'input', 'select', 'textarea', 'a'];
      for (const elementType of essentialElements) {
        const elements = await page.locator(elementType).all();
        let keyboardAccessibleCount = 0;

        for (const element of elements.slice(0, 5)) { // Check first 5 of each type
          if (await element.isVisible()) {
            try {
              await element.focus();
              const isFocused = await element.evaluate(el => el === document.activeElement);
              if (isFocused) keyboardAccessibleCount++;
            } catch (error) {
              // Element not focusable
            }
          }
        }

        if (elements.length > 0 && keyboardAccessibleCount === 0) {
          accessibilityIssues.push({
            severity: 'High',
            description: `No ${elementType} elements are keyboard accessible`,
            selector: elementType
          });
        }
      }

    } catch (error) {
      accessibilityIssues.push({
        severity: 'High',
        description: `Keyboard navigation test failed: ${error.message}`,
        selector: 'keyboard-navigation'
      });
    }

    console.log("✅ Keyboard navigation check complete");
  });

  test("4. Mental Health Content Accessibility", async ({ page }) => {
    console.log("🔍 Testing: Mental Health Content Accessibility");
    
    await page.goto("http://localhost:8082", { 
      waitUntil: 'networkidle',
      timeout: 60000 
    });
    await page.waitForTimeout(3000);

    // Navigate to mood tracker to test mental health forms
    const moodTab = await page.locator('button:has-text("Mood"), [data-testid*="mood"]').first();
    if (await moodTab.isVisible()) {
      await moodTab.click();
      await page.waitForTimeout(2000);
    }

    // Check form accessibility in mental health context
    const formElements = await page.locator('form, .form-container').all();
    
    for (const form of formElements) {
      if (await form.isVisible()) {
        // Check for proper form labeling
        const inputs = await form.locator('input, textarea, select').all();
        
        for (const input of inputs) {
          if (await input.isVisible()) {
            const inputId = await input.getAttribute('id');
            const ariaLabel = await input.getAttribute('aria-label');
            const ariaLabelledBy = await input.getAttribute('aria-labelledby');
            const placeholder = await input.getAttribute('placeholder');

            // Check if input has proper labeling
            let hasLabel = false;
            if (inputId) {
              const associatedLabel = await page.locator(`label[for="${inputId}"]`).count();
              hasLabel = associatedLabel > 0;
            }

            if (!hasLabel && !ariaLabel && !ariaLabelledBy && !placeholder) {
              accessibilityIssues.push({
                severity: 'High',
                description: 'Form input in mental health context lacks accessible label',
                selector: 'form input'
              });
            }

            // Check for sensitive input handling
            const inputType = await input.getAttribute('type');
            if (inputType === 'password' && !ariaLabel?.includes('password')) {
              accessibilityIssues.push({
                severity: 'Medium',
                description: 'Password input should have clear accessible label',
                selector: 'input[type="password"]'
              });
            }
          }
        }
      }
    }

    // Check for mental health trigger warnings
    const sensitiveKeywords = ['suicide', 'death', 'harm', 'abuse', 'trauma', 'depression', 'anxiety'];
    const hasContentWarnings = await page.locator('text="warning", text="sensitive", text="trigger", [aria-label*="warning"]').count();
    
    let hasSensitiveContent = false;
    for (const keyword of sensitiveKeywords) {
      const hasKeyword = await page.locator(`text="${keyword}"`).count();
      if (hasKeyword > 0) {
        hasSensitiveContent = true;
        break;
      }
    }

    if (hasSensitiveContent && hasContentWarnings === 0) {
      accessibilityIssues.push({
        severity: 'Medium',
        description: 'Potentially sensitive mental health content lacks trigger warnings',
        selector: 'sensitive-content'
      });
    }

    // Check for supportive language and tone
    const positiveLanguage = await page.locator('text="safe", text="support", text="help", text="care", text="wellness", text="healing"').count();
    const negativeLanguage = await page.locator('text="wrong", text="bad", text="failure", text="broken"').count();

    if (negativeLanguage > positiveLanguage) {
      accessibilityIssues.push({
        severity: 'Low',
        description: 'Language tone may not be supportive for mental health context',
        selector: 'content-language'
      });
    }

    console.log("✅ Mental health content accessibility check complete");
  });

  test("5. Screen Reader Compatibility", async ({ page }) => {
    console.log("🔍 Testing: Screen Reader Compatibility");
    
    await page.goto("http://localhost:8082", { 
      waitUntil: 'networkidle',
      timeout: 60000 
    });
    await page.waitForTimeout(3000);

    // Check for proper heading structure
    const headings = await page.locator('h1, h2, h3, h4, h5, h6').all();
    const headingStructure = [];

    for (const heading of headings) {
      if (await heading.isVisible()) {
        const tagName = await heading.evaluate(el => el.tagName.toLowerCase());
        const text = await heading.textContent();
        headingStructure.push({ level: parseInt(tagName.charAt(1)), text: text?.trim() });
      }
    }

    // Check for proper heading hierarchy
    if (headingStructure.length > 0) {
      // Should start with h1
      if (headingStructure[0].level !== 1) {
        accessibilityIssues.push({
          severity: 'Medium',
          description: 'Page should start with h1 heading for screen reader navigation',
          selector: 'heading-structure'
        });
      }

      // Check for skipped levels
      for (let i = 1; i < headingStructure.length; i++) {
        const currentLevel = headingStructure[i].level;
        const previousLevel = headingStructure[i-1].level;
        
        if (currentLevel > previousLevel + 1) {
          accessibilityIssues.push({
            severity: 'Medium',
            description: `Heading level skipped: h${previousLevel} to h${currentLevel} - should be sequential`,
            selector: `h${currentLevel}`
          });
        }
      }
    } else {
      accessibilityIssues.push({
        severity: 'High',
        description: 'No heading elements found - screen readers need headings for navigation',
        selector: 'body'
      });
    }

    // Check for landmark regions
    const landmarks = await page.locator('[role="main"], [role="navigation"], [role="banner"], [role="contentinfo"], main, nav, header, footer').count();
    if (landmarks === 0) {
      accessibilityIssues.push({
        severity: 'Medium',
        description: 'No landmark regions found - add main, nav, header, footer or ARIA roles',
        selector: 'landmarks'
      });
    }

    // Check for alt text on images
    const images = await page.locator('img').all();
    let imagesWithoutAlt = 0;

    for (const image of images) {
      if (await image.isVisible()) {
        const alt = await image.getAttribute('alt');
        const role = await image.getAttribute('role');
        
        if (!alt && role !== 'presentation') {
          imagesWithoutAlt++;
        }
      }
    }

    if (imagesWithoutAlt > 0) {
      accessibilityIssues.push({
        severity: 'Medium',
        description: `${imagesWithoutAlt} images lack alt text - screen readers need descriptions`,
        selector: 'img'
      });
    }

    // Check for skip links
    const skipLinks = await page.locator('a:has-text("skip"), a[href*="#main"], a[href*="#content"]').count();
    if (skipLinks === 0) {
      accessibilityIssues.push({
        severity: 'Low',
        description: 'No skip navigation links found - helpful for screen reader users',
        selector: 'skip-links'
      });
    }

    console.log("✅ Screen reader compatibility check complete");
  });

  test("6. Reduced Motion and Sensory Accessibility", async ({ page }) => {
    console.log("🔍 Testing: Reduced Motion and Sensory Accessibility");
    
    // Test with reduced motion preference
    await page.emulateMedia({ reducedMotion: 'reduce' });
    
    await page.goto("http://localhost:8082", { 
      waitUntil: 'networkidle',
      timeout: 60000 
    });
    await page.waitForTimeout(3000);

    // Check if animations respect reduced motion
    const animatedElements = await page.locator('[style*="animation"], [style*="transition"], .animate, .animated').all();
    
    for (const element of animatedElements.slice(0, 5)) {
      if (await element.isVisible()) {
        const styles = await element.evaluate((el) => {
          const computed = window.getComputedStyle(el);
          return {
            animationDuration: computed.animationDuration,
            transitionDuration: computed.transitionDuration
          };
        });

        if (styles.animationDuration !== '0s' && styles.animationDuration !== '') {
          accessibilityIssues.push({
            severity: 'Medium',
            description: 'Animation does not respect prefers-reduced-motion setting',
            selector: 'animated-element'
          });
        }
      }
    }

    // Check for auto-playing media
    const autoplayMedia = await page.locator('video[autoplay], audio[autoplay]').count();
    if (autoplayMedia > 0) {
      accessibilityIssues.push({
        severity: 'High',
        description: 'Auto-playing media found - can be disorienting and inaccessible',
        selector: 'autoplay-media'
      });
    }

    // Check for flashing content
    const flashingElements = await page.locator('[style*="blink"], .blink, .flash').count();
    if (flashingElements > 0) {
      accessibilityIssues.push({
        severity: 'High',
        description: 'Flashing/blinking content may trigger seizures - avoid or add controls',
        selector: 'flashing-content'
      });
    }

    console.log("✅ Reduced motion and sensory accessibility check complete");
  });

  test("7. Final Mental Health Accessibility Report", async ({ page }) => {
    console.log("\n" + "=".repeat(70));
    console.log("♿ SOLACE AI MOBILE - MENTAL HEALTH ACCESSIBILITY REPORT");
    console.log("=".repeat(70));

    // Categorize accessibility issues by severity
    const criticalIssues = accessibilityIssues.filter(issue => issue.severity === 'Critical');
    const highIssues = accessibilityIssues.filter(issue => issue.severity === 'High');
    const mediumIssues = accessibilityIssues.filter(issue => issue.severity === 'Medium');
    const lowIssues = accessibilityIssues.filter(issue => issue.severity === 'Low');

    console.log("\n🚨 CRITICAL ACCESSIBILITY ISSUES:");
    if (criticalIssues.length === 0) {
      console.log("   ✅ No critical accessibility issues found");
    } else {
      criticalIssues.forEach(issue => {
        console.log(`   • ${issue.description}`);
      });
    }

    console.log("\n⚠️  HIGH PRIORITY ISSUES:");
    if (highIssues.length === 0) {
      console.log("   ✅ No high priority accessibility issues found");
    } else {
      highIssues.forEach(issue => {
        console.log(`   • ${issue.description}`);
      });
    }

    console.log("\n📋 MEDIUM PRIORITY ISSUES:");
    if (mediumIssues.length === 0) {
      console.log("   ✅ No medium priority accessibility issues found");
    } else {
      mediumIssues.slice(0, 5).forEach(issue => { // Show first 5
        console.log(`   • ${issue.description}`);
      });
      if (mediumIssues.length > 5) {
        console.log(`   ... and ${mediumIssues.length - 5} more medium priority issues`);
      }
    }

    console.log("\n🔧 MENTAL HEALTH SPECIFIC RECOMMENDATIONS:");
    
    if (criticalIssues.some(i => i.description.includes('crisis'))) {
      console.log("   🆘 URGENT: Ensure crisis support access is clearly visible and accessible");
    }
    
    if (highIssues.some(i => i.description.includes('keyboard'))) {
      console.log("   ⌨️  Implement full keyboard navigation for users who cannot use mice/touch");
    }
    
    if (mediumIssues.some(i => i.description.includes('contrast'))) {
      console.log("   🎨 Improve color contrast for users with visual impairments");
    }
    
    if (accessibilityIssues.some(i => i.description.includes('trigger'))) {
      console.log("   ⚠️  Add content warnings for potentially triggering mental health content");
    }

    console.log("\n✅ WCAG 2.1 COMPLIANCE STATUS:");
    
    const totalIssues = accessibilityIssues.length;
    if (totalIssues === 0) {
      console.log("   🏆 Excellent! No major accessibility issues detected");
    } else if (criticalIssues.length === 0 && highIssues.length <= 2) {
      console.log("   ✅ Good compliance with minor improvements needed");
    } else if (criticalIssues.length === 0) {
      console.log("   ⚠️  Partial compliance - address high priority issues");
    } else {
      console.log("   ❌ Poor compliance - critical issues must be resolved immediately");
    }

    console.log(`\n📊 SUMMARY: ${totalIssues} total issues found`);
    console.log(`   • Critical: ${criticalIssues.length}`);
    console.log(`   • High: ${highIssues.length}`);
    console.log(`   • Medium: ${mediumIssues.length}`);
    console.log(`   • Low: ${lowIssues.length}`);

    console.log("\n" + "=".repeat(70));

    // Take final accessibility test screenshot
    await page.goto("http://localhost:8081");
    await page.waitForTimeout(3000);
    await page.screenshot({ 
      path: 'test-results/mental-health-accessibility-final.png', 
      fullPage: true 
    });
  });
});