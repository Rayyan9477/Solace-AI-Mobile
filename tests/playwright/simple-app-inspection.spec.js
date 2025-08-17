/**
 * Simple App Inspection - Direct Testing
 * Quick test to capture what's actually being displayed
 */

const { test, expect } = require('@playwright/test');
const fs = require('fs');
const path = require('path');

const BASE_URL = 'http://localhost:8083';
const SCREENSHOT_PATH = path.resolve('test-results/screenshots/simple-inspection');

function ensureDir(dir) {
  try { 
    fs.mkdirSync(dir, { recursive: true }); 
  } catch (e) {}
}

test.describe('Simple App Inspection', () => {
  test.beforeAll(async () => {
    ensureDir(SCREENSHOT_PATH);
  });

  test('Capture and analyze current app state', async ({ page }) => {
    console.log('🔍 Direct inspection of app on http://localhost:8083');
    
    // Navigate to the app
    await page.goto(BASE_URL, { 
      waitUntil: 'networkidle',
      timeout: 20000 
    });

    // Wait for app to load
    await page.waitForTimeout(5000);

    // Get page title
    const title = await page.title();
    console.log(`📱 Page Title: "${title}"`);

    // Get page content
    const bodyText = await page.textContent('body');
    console.log(`📄 Page has content: ${bodyText ? bodyText.length > 0 : false}`);
    
    if (bodyText) {
      const contentPreview = bodyText.substring(0, 500).replace(/\s+/g, ' ').trim();
      console.log(`📝 Content preview: "${contentPreview}..."`);
    }

    // Check what's actually visible
    const allText = await page.locator('*').allTextContents();
    const visibleTexts = allText.filter(text => text.trim().length > 0);
    console.log(`🔤 Visible text elements: ${visibleTexts.length}`);
    console.log(`📋 First 10 visible texts:`, visibleTexts.slice(0, 10));

    // Count different element types
    const elementCounts = {
      divs: await page.locator('div').count(),
      buttons: await page.locator('button').count(),
      spans: await page.locator('span').count(),
      paragraphs: await page.locator('p').count(),
      links: await page.locator('a').count(),
      images: await page.locator('img').count(),
      svgs: await page.locator('svg').count(),
      inputs: await page.locator('input').count()
    };
    console.log(`🧮 Element counts:`, elementCounts);

    // Check for React/Expo root
    const rootElement = await page.locator('#root').count();
    const expoRoot = await page.locator('#expo-root').count();
    console.log(`⚛️  React root: ${rootElement}, Expo root: ${expoRoot}`);

    // Check for any visible text that might indicate what's shown
    const commonAppTexts = ['Solace', 'Mental', 'Health', 'Therapy', 'Welcome', 'Home', 'Loading'];
    const foundTexts = [];
    for (const text of commonAppTexts) {
      const count = await page.locator(`text="${text}"`).count();
      if (count > 0) {
        foundTexts.push(`${text}(${count})`);
      }
    }
    console.log(`🎯 App-specific texts found: ${foundTexts.join(', ')}`);

    // Check console errors
    const consoleErrors = [];
    page.on('console', msg => {
      if (msg.type() === 'error') {
        consoleErrors.push(msg.text());
      }
    });

    await page.waitForTimeout(2000);
    console.log(`❌ Console errors: ${consoleErrors.length}`);
    if (consoleErrors.length > 0) {
      console.log(`🚨 Error samples:`, consoleErrors.slice(0, 3));
    }

    // Check if there's a loading state or error state
    const loadingIndicators = await page.locator('text="Loading"').count();
    const errorIndicators = await page.locator('text="Error"').count();
    console.log(`⏳ Loading indicators: ${loadingIndicators}, Error indicators: ${errorIndicators}`);

    // Take screenshots
    await page.screenshot({
      path: `${SCREENSHOT_PATH}/current-app-state.png`,
      fullPage: true
    });

    await page.screenshot({
      path: `${SCREENSHOT_PATH}/current-app-viewport.png`,
      fullPage: false
    });

    // Check viewport size
    const viewportSize = page.viewportSize();
    console.log(`📐 Viewport: ${viewportSize.width}x${viewportSize.height}`);

    // Check document state
    const documentState = await page.evaluate(() => {
      return {
        readyState: document.readyState,
        contentLength: document.body ? document.body.innerHTML.length : 0,
        hasContent: document.body && document.body.children.length > 0,
        scripts: document.scripts.length,
        stylesheets: document.styleSheets.length
      };
    });
    console.log(`📄 Document state:`, documentState);

    console.log('✅ Simple inspection completed');
  });
});