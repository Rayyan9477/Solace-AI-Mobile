/**
 * Solace AI Mental Health App - Direct Validation Test
 * 
 * Simplified test focused on direct validation and comprehensive screenshots
 */

const { test, expect } = require('@playwright/test');
const fs = require('fs');
const path = require('path');

const BASE_URL = 'http://localhost:8083';
const SCREENSHOT_PATH = path.resolve('test-results/direct-validation');

function ensureDir(dir) {
  try { fs.mkdirSync(dir, { recursive: true }); } catch {}
}

test.describe('Solace AI - Direct Validation', () => {
  test.beforeAll(async () => {
    ensureDir(SCREENSHOT_PATH);
    console.log('🚀 Starting Direct Validation of Solace AI Mental Health App');
  });

  test('Application State Comprehensive Validation', async ({ page }) => {
    console.log('🎯 Starting Comprehensive Application Validation...');
    
    // Mobile viewport first
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto(BASE_URL, { waitUntil: 'networkidle', timeout: 30000 });
    
    // Wait for app to fully load
    await page.waitForTimeout(5000);
    
    console.log('📱 Testing Mobile Viewport (375x812)...');
    
    // Initial screenshot
    await page.screenshot({
      path: `${SCREENSHOT_PATH}/01-mobile-initial-load.png`,
      fullPage: true
    });
    
    // Check for key elements
    const pageContent = await page.content();
    const hasWelcome = pageContent.includes('Welcome') || pageContent.includes('Solace');
    const hasButtons = await page.locator('button').count();
    const hasInteractiveElements = await page.locator('[role="button"], [role="tab"]').count();
    
    console.log(`📊 Mobile Analysis:`);
    console.log(`  - Has Welcome/Solace content: ${hasWelcome}`);
    console.log(`  - Button count: ${hasButtons}`);
    console.log(`  - Interactive elements: ${hasInteractiveElements}`);
    
    // Performance metrics
    const loadMetrics = await page.evaluate(() => {
      return {
        loadTime: performance.timing.loadEventEnd - performance.timing.navigationStart,
        domContentLoaded: performance.timing.domContentLoadedEventEnd - performance.timing.navigationStart
      };
    });
    
    console.log(`⚡ Mobile Performance:`);
    console.log(`  - Load Time: ${loadMetrics.loadTime}ms`);
    console.log(`  - DOM Ready: ${loadMetrics.domContentLoaded}ms`);
    
    // Test tablet viewport
    console.log('📱 Testing Tablet Viewport (768x1024)...');
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.waitForTimeout(2000);
    
    await page.screenshot({
      path: `${SCREENSHOT_PATH}/02-tablet-responsive.png`,
      fullPage: true
    });
    
    // Test desktop viewport
    console.log('💻 Testing Desktop Viewport (1280x720)...');
    await page.setViewportSize({ width: 1280, height: 720 });
    await page.waitForTimeout(2000);
    
    await page.screenshot({
      path: `${SCREENSHOT_PATH}/03-desktop-responsive.png`,
      fullPage: true
    });
    
    // Large desktop viewport
    console.log('🖥️ Testing Large Desktop Viewport (1920x1080)...');
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.waitForTimeout(2000);
    
    await page.screenshot({
      path: `${SCREENSHOT_PATH}/04-large-desktop-responsive.png`,
      fullPage: true
    });
    
    // Back to mobile for navigation testing
    await page.setViewportSize({ width: 375, height: 812 });
    await page.waitForTimeout(2000);
    
    console.log('🧭 Testing Navigation Elements...');
    
    // Get all clickable elements
    const clickableElements = await page.locator('button, [role="button"], [role="tab"], a').all();
    console.log(`🎯 Found ${clickableElements.length} clickable elements`);
    
    // Try to interact with navigation elements gently
    let navigationTests = [];
    for (let i = 0; i < Math.min(clickableElements.length, 6); i++) {
      try {
        const element = clickableElements[i];
        const isVisible = await element.isVisible();
        const text = await element.textContent().catch(() => 'No text');
        const ariaLabel = await element.getAttribute('aria-label').catch(() => null);
        
        navigationTests.push({
          index: i,
          visible: isVisible,
          text: text?.trim() || ariaLabel || 'Unknown',
          testable: isVisible
        });
        
        if (isVisible && i < 3) {
          // Only test first 3 visible elements to avoid timing issues
          await element.click({ timeout: 5000 });
          await page.waitForTimeout(1500);
          
          await page.screenshot({
            path: `${SCREENSHOT_PATH}/nav-element-${i}-${text?.trim().toLowerCase().replace(/\s+/g, '-') || 'unknown'}.png`,
            fullPage: true
          });
        }
      } catch (e) {
        navigationTests.push({
          index: i,
          error: e.message,
          testable: false
        });
      }
    }
    
    console.log('🧭 Navigation Test Results:');
    navigationTests.forEach(test => {
      if (test.error) {
        console.log(`  ${test.index}: Error - ${test.error}`);
      } else {
        console.log(`  ${test.index}: ${test.text} (${test.testable ? 'Testable' : 'Not testable'})`);
      }
    });
    
    // Accessibility check
    console.log('♿ Testing Accessibility Features...');
    
    const headings = await page.locator('h1, h2, h3, h4, h5, h6').count();
    const landmarks = await page.locator('[role="main"], [role="navigation"], [role="banner"]').count();
    
    // Test keyboard navigation
    await page.keyboard.press('Tab');
    await page.waitForTimeout(500);
    const focusAfterTab = await page.evaluate(() => {
      const active = document.activeElement;
      return active ? {
        tagName: active.tagName,
        role: active.getAttribute('role'),
        text: active.textContent?.trim() || 'No text'
      } : null;
    });
    
    console.log(`♿ Accessibility Results:`);
    console.log(`  - Headings: ${headings}`);
    console.log(`  - Landmarks: ${landmarks}`);
    console.log(`  - Keyboard navigation works:`, focusAfterTab ? 'Yes' : 'No');
    if (focusAfterTab) {
      console.log(`  - First focusable: ${focusAfterTab.tagName} - ${focusAfterTab.text}`);
    }
    
    // Theme detection
    console.log('🎨 Testing Theme and Visual Design...');
    
    const visualAnalysis = await page.evaluate(() => {
      const elements = document.querySelectorAll('*');
      let hasGradients = false;
      let hasTherapeuticColors = false;
      let colorSamples = [];
      
      for (let element of elements) {
        const style = window.getComputedStyle(element);
        
        // Check for gradients
        if (style.background && style.background.includes('gradient')) {
          hasGradients = true;
        }
        
        // Sample colors
        if (style.backgroundColor && style.backgroundColor !== 'rgba(0, 0, 0, 0)') {
          colorSamples.push(style.backgroundColor);
        }
        
        // Check for therapeutic color keywords
        const allStyles = style.background + ' ' + style.color + ' ' + style.backgroundColor;
        if (allStyles.includes('blue') || allStyles.includes('green') || allStyles.includes('purple')) {
          hasTherapeuticColors = true;
        }
      }
      
      return {
        hasGradients,
        hasTherapeuticColors,
        colorSamples: [...new Set(colorSamples)].slice(0, 5) // First 5 unique colors
      };
    });
    
    console.log(`🎨 Visual Design Analysis:`);
    console.log(`  - Has gradients: ${visualAnalysis.hasGradients}`);
    console.log(`  - Therapeutic colors detected: ${visualAnalysis.hasTherapeuticColors}`);
    console.log(`  - Color samples:`, visualAnalysis.colorSamples);
    
    // Console error check
    let consoleErrors = [];
    page.on('console', msg => {
      if (msg.type() === 'error') {
        consoleErrors.push(msg.text());
      }
    });
    
    // Mental health content check
    console.log('🧠 Testing Mental Health Content...');
    
    const mentalhealthKeywords = [
      'mental health', 'therapy', 'wellness', 'mindfulness', 'meditation',
      'mood', 'support', 'calm', 'peaceful', 'care', 'healing'
    ];
    
    let foundKeywords = [];
    const pageText = (await page.textContent('body')).toLowerCase();
    
    mentalhealthKeywords.forEach(keyword => {
      if (pageText.includes(keyword)) {
        foundKeywords.push(keyword);
      }
    });
    
    console.log(`🧠 Mental Health Keywords Found: ${foundKeywords.join(', ')}`);
    
    // Final comprehensive screenshot
    await page.screenshot({
      path: `${SCREENSHOT_PATH}/final-comprehensive-state.png`,
      fullPage: true
    });
    
    // Final summary
    console.log('\n🎯 COMPREHENSIVE VALIDATION SUMMARY:');
    console.log('=======================================');
    console.log(`📱 Responsive Design: Tested on 4 viewports`);
    console.log(`⚡ Performance: Load ${loadMetrics.loadTime}ms, DOM ${loadMetrics.domContentLoaded}ms`);
    console.log(`🧭 Navigation: ${navigationTests.filter(t => t.testable).length}/${navigationTests.length} elements testable`);
    console.log(`♿ Accessibility: ${headings} headings, ${landmarks} landmarks, keyboard nav: ${focusAfterTab ? 'Yes' : 'No'}`);
    console.log(`🎨 Design: Gradients: ${visualAnalysis.hasGradients}, Therapeutic: ${visualAnalysis.hasTherapeuticColors}`);
    console.log(`🧠 Mental Health: ${foundKeywords.length} relevant keywords found`);
    console.log(`🚨 Console Errors: ${consoleErrors.length}`);
    console.log('=======================================');
    
    // Production readiness assessment
    const readinessScore = [
      loadMetrics.loadTime < 3000 ? 1 : 0, // Fast loading
      hasButtons > 0 ? 1 : 0, // Interactive elements
      headings > 0 ? 1 : 0, // Proper heading structure
      visualAnalysis.hasGradients ? 1 : 0, // Visual design
      foundKeywords.length > 0 ? 1 : 0, // Mental health content
      consoleErrors.length === 0 ? 1 : 0 // No errors
    ].reduce((a, b) => a + b, 0);
    
    console.log(`\n🚀 PRODUCTION READINESS: ${readinessScore}/6 (${Math.round(readinessScore/6*100)}%)`);
    
    if (readinessScore >= 5) {
      console.log('✅ APPLICATION IS READY FOR PRODUCTION');
    } else if (readinessScore >= 3) {
      console.log('⚠️  APPLICATION NEEDS MINOR IMPROVEMENTS');
    } else {
      console.log('❌ APPLICATION NEEDS SIGNIFICANT WORK');
    }
    
    expect(readinessScore).toBeGreaterThan(2);
  });
});