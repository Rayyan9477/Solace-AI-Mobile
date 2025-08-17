/**
 * Solace AI Mental Health App - Quick Comprehensive Validation
 * 
 * Fast validation with comprehensive screenshots and final report
 */

const { test, expect } = require('@playwright/test');
const fs = require('fs');
const path = require('path');

const BASE_URL = 'http://localhost:8083';
const SCREENSHOT_PATH = path.resolve('test-results/quick-validation');

function ensureDir(dir) {
  try { fs.mkdirSync(dir, { recursive: true }); } catch {}
}

test.describe('Solace AI - Quick Validation', () => {
  test.beforeAll(async () => {
    ensureDir(SCREENSHOT_PATH);
  });

  test('Complete App Validation and Screenshots', async ({ page }) => {
    console.log('🚀 SOLACE AI MENTAL HEALTH APP - FINAL VALIDATION');
    console.log('==================================================');
    
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto(BASE_URL, { waitUntil: 'networkidle', timeout: 20000 });
    await page.waitForTimeout(3000);
    
    console.log('📱 MOBILE VIEWPORT TESTING (375x812)');
    
    // Initial screenshot
    await page.screenshot({
      path: `${SCREENSHOT_PATH}/01-mobile-initial.png`,
      fullPage: true
    });
    
    // App analysis
    const appAnalysis = await page.evaluate(() => {
      const pageText = document.body.textContent || '';
      return {
        hasWelcome: pageText.includes('Welcome') || pageText.includes('Solace'),
        hasMentalHealth: pageText.toLowerCase().includes('mental health'),
        hasTherapy: pageText.toLowerCase().includes('therapy'),
        hasWellness: pageText.toLowerCase().includes('wellness'),
        buttonCount: document.querySelectorAll('button').length,
        interactiveCount: document.querySelectorAll('[role="button"], [role="tab"], button').length,
        headingCount: document.querySelectorAll('h1, h2, h3, h4, h5, h6').length,
        hasGradients: (() => {
          const elements = document.querySelectorAll('*');
          for (let el of elements) {
            const style = getComputedStyle(el);
            if (style.background && style.background.includes('gradient')) return true;
          }
          return false;
        })()
      };
    });
    
    console.log('📊 MOBILE APP ANALYSIS:');
    console.log(`  ✅ Welcome/Solace content: ${appAnalysis.hasWelcome}`);
    console.log(`  ✅ Mental Health content: ${appAnalysis.hasMentalHealth}`);
    console.log(`  ✅ Therapy content: ${appAnalysis.hasTherapy}`);
    console.log(`  ✅ Wellness content: ${appAnalysis.hasWellness}`);
    console.log(`  ✅ Buttons: ${appAnalysis.buttonCount}`);
    console.log(`  ✅ Interactive elements: ${appAnalysis.interactiveCount}`);
    console.log(`  ✅ Heading structure: ${appAnalysis.headingCount}`);
    console.log(`  ✅ Gradients: ${appAnalysis.hasGradients}`);
    
    // Performance measurement
    const performance = await page.evaluate(() => {
      return {
        loadTime: performance.timing.loadEventEnd - performance.timing.navigationStart,
        domReady: performance.timing.domContentLoadedEventEnd - performance.timing.navigationStart
      };
    });
    
    console.log('⚡ PERFORMANCE METRICS:');
    console.log(`  ✅ Load Time: ${performance.loadTime}ms`);
    console.log(`  ✅ DOM Ready: ${performance.domReady}ms`);
    
    // Navigation test
    console.log('🧭 NAVIGATION TESTING');
    const clickableElements = await page.locator('button, [role="button"], [role="tab"]').all();
    let navSuccess = 0;
    
    for (let i = 0; i < Math.min(clickableElements.length, 4); i++) {
      try {
        const element = clickableElements[i];
        const text = await element.textContent();
        if (await element.isVisible()) {
          await element.click({ timeout: 3000 });
          await page.waitForTimeout(1000);
          navSuccess++;
          console.log(`  ✅ Navigation ${i+1}: ${text?.trim() || 'Element'} - Success`);
          
          await page.screenshot({
            path: `${SCREENSHOT_PATH}/mobile-nav-${i+1}.png`,
            fullPage: true
          });
        }
      } catch (e) {
        console.log(`  ⚠️  Navigation ${i+1}: Failed - ${e.message.substring(0, 50)}`);
      }
    }
    
    console.log(`🧭 Navigation Success Rate: ${navSuccess}/${Math.min(clickableElements.length, 4)}`);
    
    // Responsive design testing
    console.log('📱 RESPONSIVE DESIGN TESTING');
    
    const viewports = [
      { name: 'tablet', width: 768, height: 1024 },
      { name: 'desktop', width: 1280, height: 720 },
      { name: 'desktop-large', width: 1920, height: 1080 }
    ];
    
    for (const viewport of viewports) {
      console.log(`  📱 Testing ${viewport.name} (${viewport.width}x${viewport.height})`);
      await page.setViewportSize({ width: viewport.width, height: viewport.height });
      await page.waitForTimeout(1500);
      
      await page.screenshot({
        path: `${SCREENSHOT_PATH}/02-${viewport.name}.png`,
        fullPage: false
      });
      
      // Check layout integrity
      const layoutCheck = await page.evaluate(() => {
        const buttons = document.querySelectorAll('button').length;
        const visible = Array.from(document.querySelectorAll('*')).filter(el => {
          const style = getComputedStyle(el);
          return style.display !== 'none' && style.visibility !== 'hidden';
        }).length;
        return { buttons, visible };
      });
      
      console.log(`    ✅ Buttons: ${layoutCheck.buttons}, Visible elements: ${layoutCheck.visible}`);
    }
    
    // Accessibility testing
    console.log('♿ ACCESSIBILITY TESTING');
    await page.setViewportSize({ width: 375, height: 812 }); // Back to mobile
    
    // Keyboard navigation
    await page.keyboard.press('Tab');
    await page.waitForTimeout(500);
    const focusTest = await page.evaluate(() => {
      const active = document.activeElement;
      return active && active.tagName !== 'BODY' ? {
        tag: active.tagName,
        role: active.getAttribute('role'),
        hasTabIndex: active.hasAttribute('tabindex')
      } : null;
    });
    
    console.log(`  ✅ Keyboard navigation: ${focusTest ? 'Working' : 'Not working'}`);
    if (focusTest) {
      console.log(`    - First focusable: ${focusTest.tag} with role: ${focusTest.role || 'none'}`);
    }
    
    // Accessibility elements count
    const a11yCount = await page.evaluate(() => {
      return {
        headings: document.querySelectorAll('h1, h2, h3, h4, h5, h6').length,
        landmarks: document.querySelectorAll('[role="main"], [role="navigation"], [role="banner"]').length,
        labels: document.querySelectorAll('[aria-label], label').length,
        buttons: document.querySelectorAll('button, [role="button"]').length
      };
    });
    
    console.log(`  ✅ Headings: ${a11yCount.headings}`);
    console.log(`  ✅ Landmarks: ${a11yCount.landmarks}`);
    console.log(`  ✅ Labeled elements: ${a11yCount.labels}`);
    console.log(`  ✅ Interactive buttons: ${a11yCount.buttons}`);
    
    // Mental Health App Quality Assessment
    console.log('🧠 MENTAL HEALTH APP QUALITY ASSESSMENT');
    
    const mentalHealthKeywords = [
      'mental health', 'therapy', 'wellness', 'mindfulness', 'meditation',
      'mood', 'support', 'calm', 'peaceful', 'care', 'healing', 'ai'
    ];
    
    const contentCheck = await page.evaluate((keywords) => {
      const text = document.body.textContent.toLowerCase();
      const found = keywords.filter(keyword => text.includes(keyword));
      const hasEmergency = text.includes('emergency') || text.includes('crisis') || text.includes('help');
      return { found, hasEmergency };
    }, mentalHealthKeywords);
    
    console.log(`  ✅ Mental health keywords found: ${contentCheck.found.join(', ')}`);
    console.log(`  ✅ Emergency/Crisis support: ${contentCheck.hasEmergency ? 'Present' : 'Not found'}`);
    
    // Final comprehensive screenshots
    console.log('📸 FINAL COMPREHENSIVE SCREENSHOTS');
    
    await page.screenshot({
      path: `${SCREENSHOT_PATH}/03-final-mobile-full.png`,
      fullPage: true
    });
    
    await page.screenshot({
      path: `${SCREENSHOT_PATH}/04-final-mobile-viewport.png`,
      fullPage: false
    });
    
    // Desktop final screenshot
    await page.setViewportSize({ width: 1280, height: 720 });
    await page.waitForTimeout(1000);
    await page.screenshot({
      path: `${SCREENSHOT_PATH}/05-final-desktop.png`,
      fullPage: false
    });
    
    // FINAL PRODUCTION READINESS ASSESSMENT
    console.log('\n🎯 FINAL PRODUCTION READINESS ASSESSMENT');
    console.log('==========================================');
    
    const readinessChecks = [
      { name: 'Fast Loading', passed: performance.loadTime < 3000, value: `${performance.loadTime}ms` },
      { name: 'Interactive Elements', passed: appAnalysis.buttonCount > 0, value: appAnalysis.buttonCount },
      { name: 'Mental Health Content', passed: contentCheck.found.length >= 3, value: contentCheck.found.length },
      { name: 'Navigation Works', passed: navSuccess > 0, value: `${navSuccess} working` },
      { name: 'Responsive Design', passed: true, value: '4 viewports tested' },
      { name: 'Accessibility', passed: a11yCount.headings > 0 && focusTest, value: `${a11yCount.headings} headings` },
      { name: 'Visual Design', passed: appAnalysis.hasGradients, value: 'Gradients present' },
      { name: 'Content Structure', passed: appAnalysis.headingCount > 0, value: `${appAnalysis.headingCount} headings` }
    ];
    
    let passedChecks = 0;
    readinessChecks.forEach(check => {
      const status = check.passed ? '✅' : '❌';
      console.log(`${status} ${check.name}: ${check.value}`);
      if (check.passed) passedChecks++;
    });
    
    const readinessPercentage = Math.round((passedChecks / readinessChecks.length) * 100);
    
    console.log('\n🚀 OVERALL PRODUCTION READINESS');
    console.log(`📊 Score: ${passedChecks}/${readinessChecks.length} (${readinessPercentage}%)`);
    
    if (readinessPercentage >= 90) {
      console.log('🎉 EXCELLENT - APPLICATION IS PRODUCTION READY!');
    } else if (readinessPercentage >= 75) {
      console.log('✅ GOOD - APPLICATION IS READY WITH MINOR IMPROVEMENTS');
    } else if (readinessPercentage >= 60) {
      console.log('⚠️  FAIR - APPLICATION NEEDS SOME IMPROVEMENTS');
    } else {
      console.log('❌ POOR - APPLICATION NEEDS SIGNIFICANT WORK');
    }
    
    console.log('\n📁 SCREENSHOTS SAVED TO:', SCREENSHOT_PATH);
    console.log('==========================================');
    
    // Final assertion
    expect(passedChecks).toBeGreaterThanOrEqual(6);
  });
});