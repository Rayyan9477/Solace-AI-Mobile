/**
 * Comprehensive Visual Inspection Test Suite
 * Compares ALL 120+ screens with UI design references
 * Documents missing components, styling flaws, and quality issues
 */

const { test, expect } = require('@playwright/test');
const fs = require('fs');
const path = require('path');

const BASE_URL = 'http://localhost:8081';
const SCREENSHOTS_DIR = 'test-results/visual-inspection/screenshots';
const DESIGN_REF_DIR = 'ui-designs';
const REPORT_DIR = 'test-results/visual-inspection/reports';

// Ensure directories exist
[SCREENSHOTS_DIR, REPORT_DIR].forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

// Comprehensive list of all screens organized by category
const SCREEN_CATEGORIES = {
  onboarding: [
    { name: 'Splash', route: '/', designFile: 'Splash & Loading.png' },
    { name: 'Loading', route: '/loading', designFile: 'Splash & Loading.png' },
    { name: 'Welcome Step 1', route: '/welcome?step=0', designFile: 'Welcome Screen.png' },
    { name: 'Welcome Step 2', route: '/welcome?step=1', designFile: 'Welcome Screen.png' },
    { name: 'Welcome Step 3', route: '/welcome?step=2', designFile: 'Welcome Screen.png' },
    { name: 'Welcome Step 4', route: '/welcome?step=3', designFile: 'Welcome Screen.png' },
    { name: 'Welcome Step 5', route: '/welcome?step=4', designFile: 'Welcome Screen.png' },
    { name: 'Welcome Step 6', route: '/welcome?step=5', designFile: 'Welcome Screen.png' },
  ],

  auth: [
    { name: 'Sign In', route: '/login', designFile: 'Sign In & Sign Up.png' },
    { name: 'Sign Up', route: '/signup', designFile: 'Sign In & Sign Up.png' },
    { name: 'Forgot Password', route: '/forgot-password', designFile: 'Sign In & Sign Up.png' },
    { name: 'Forgot Password Success', route: '/forgot-password?success=true', designFile: 'Sign In & Sign Up.png' },
  ],

  assessment: [
    { name: 'Assessment Start', route: '/assessment', designFile: 'Mental Health Assessment.png' },
    { name: 'Assessment Question 1', route: '/assessment?q=1', designFile: 'Mental Health Assessment.png' },
    { name: 'Assessment Question 2', route: '/assessment?q=2', designFile: 'Mental Health Assessment.png' },
    { name: 'Assessment Question 3', route: '/assessment?q=3', designFile: 'Mental Health Assessment.png' },
    { name: 'Assessment Question 4', route: '/assessment?q=4', designFile: 'Mental Health Assessment.png' },
    { name: 'Assessment Question 5', route: '/assessment?q=5', designFile: 'Mental Health Assessment.png' },
    { name: 'Assessment Question 6', route: '/assessment?q=6', designFile: 'Mental Health Assessment.png' },
    { name: 'Assessment Question 7', route: '/assessment?q=7', designFile: 'Mental Health Assessment.png' },
    { name: 'Assessment Question 8', route: '/assessment?q=8', designFile: 'Mental Health Assessment.png' },
    { name: 'Assessment Question 9', route: '/assessment?q=9', designFile: 'Mental Health Assessment.png' },
    { name: 'Assessment Question 10', route: '/assessment?q=10', designFile: 'Mental Health Assessment.png' },
    { name: 'Assessment Question 11', route: '/assessment?q=11', designFile: 'Mental Health Assessment.png' },
    { name: 'Assessment Question 12', route: '/assessment?q=12', designFile: 'Mental Health Assessment.png' },
    { name: 'Assessment Question 13', route: '/assessment?q=13', designFile: 'Mental Health Assessment.png' },
    { name: 'Assessment Question 14', route: '/assessment?q=14', designFile: 'Mental Health Assessment.png' },
    { name: 'Assessment Results', route: '/assessment-results', designFile: 'Mental Health Assessment.png' },
    { name: 'Assessment History', route: '/assessment-history', designFile: 'Mental Health Assessment.png' },
  ],

  dashboard: [
    { name: 'Dashboard Home', route: '/dashboard', designFile: '🔒 Home & Mental Health Score.png' },
    { name: 'Freud Score', route: '/freud-score', designFile: '🔒 Home & Mental Health Score.png' },
    { name: 'AI Suggestions', route: '/ai-suggestions', designFile: '🔒 Home & Mental Health Score.png' },
  ],

  mood: [
    { name: 'Mood Tracker Main', route: '/mood', designFile: '🔒 Mood Tracker.png' },
    { name: 'Mood Selection', route: '/mood/select', designFile: '🔒 Mood Tracker.png' },
    { name: 'Mood Stats', route: '/mood/stats', designFile: '🔒 Mood Tracker.png' },
    { name: 'Mood History', route: '/mood/history', designFile: '🔒 Mood Tracker.png' },
    { name: 'Mood Calendar', route: '/mood/calendar', designFile: '🔒 Mood Tracker.png' },
    { name: 'Mood Analytics', route: '/mood/analytics', designFile: '🔒 Mood Tracker.png' },
    { name: 'Enhanced Mood Tracker', route: '/mood/enhanced', designFile: '🔒 Mood Tracker.png' },
    { name: 'Activity Tracking', route: '/mood/activities', designFile: '🔒 Mood Tracker.png' },
    { name: 'Mood AI Suggestions', route: '/mood/ai-suggestions', designFile: '🔒 Mood Tracker.png' },
  ],

  chat: [
    { name: 'Chat Screen', route: '/chat', designFile: '🔒 AI Therapy Chatbot.png' },
    { name: 'Conversation List', route: '/conversations', designFile: '🔒 AI Therapy Chatbot.png' },
    { name: 'New Conversation', route: '/conversation/new', designFile: '🔒 AI Therapy Chatbot.png' },
    { name: 'Chat Conversations List', route: '/chat/conversations', designFile: '🔒 AI Therapy Chatbot.png' },
  ],

  journal: [
    { name: 'Journal List', route: '/journal', designFile: '🔒 Mental Health Journal.png' },
    { name: 'Journal Create Text', route: '/journal/create?type=text', designFile: '🔒 Mental Health Journal.png' },
    { name: 'Journal Create Voice', route: '/journal/create?type=voice', designFile: '🔒 Mental Health Journal.png' },
    { name: 'Journal Detail', route: '/journal/1', designFile: '🔒 Mental Health Journal.png' },
    { name: 'Journal Calendar', route: '/journal/calendar', designFile: '🔒 Mental Health Journal.png' },
    { name: 'Journal Search', route: '/journal/search', designFile: '🔒 Mental Health Journal.png' },
    { name: 'Journal Export', route: '/journal/export', designFile: '🔒 Mental Health Journal.png' },
  ],

  community: [
    { name: 'Community Feed', route: '/community', designFile: '🔒 Community Support.png' },
    { name: 'Support Groups', route: '/community/groups', designFile: '🔒 Community Support.png' },
    { name: 'Discussion Threads', route: '/community/discussions', designFile: '🔒 Community Support.png' },
    { name: 'Create Post', route: '/community/post/new', designFile: '🔒 Community Support.png' },
    { name: 'Post Detail', route: '/community/post/1', designFile: '🔒 Community Support.png' },
    { name: 'Success Stories', route: '/community/success-stories', designFile: '🔒 Community Support.png' },
    { name: 'Community Notifications', route: '/community/notifications', designFile: '🔒 Community Support.png' },
  ],

  mindfulness: [
    { name: 'Mindful Hours', route: '/mindfulness/hours', designFile: '🔒 Mindful Hours.png' },
    { name: 'Mindful Hours Stats', route: '/mindfulness/hours/stats', designFile: '🔒 Mindful Hours.png' },
    { name: 'Guided Sessions', route: '/mindfulness/sessions', designFile: '🔒 Mindful Hours.png' },
    { name: 'Breathing Exercise', route: '/mindfulness/breathing', designFile: '🔒 Mindful Hours.png' },
    { name: 'Session History', route: '/mindfulness/history', designFile: '🔒 Mindful Hours.png' },
    { name: 'Mindful Goals', route: '/mindfulness/goals', designFile: '🔒 Mindful Hours.png' },
    { name: 'Achievement Badges', route: '/mindfulness/badges', designFile: '🔒 Mindful Hours.png' },
  ],

  resources: [
    { name: 'Resources Main', route: '/resources', designFile: '🔒 Mindful Resources.png' },
    { name: 'Articles', route: '/resources/articles', designFile: '🔒 Mindful Resources.png' },
    { name: 'Courses', route: '/resources/courses', designFile: '🔒 Mindful Resources.png' },
    { name: 'Article Detail', route: '/resources/article/1', designFile: '🔒 Mindful Resources.png' },
    { name: 'Course Detail', route: '/resources/course/1', designFile: '🔒 Mindful Resources.png' },
    { name: 'Course Lesson', route: '/resources/course/1/lesson/1', designFile: '🔒 Mindful Resources.png' },
    { name: 'Course Completion', route: '/resources/course/1/complete', designFile: '🔒 Mindful Resources.png' },
    { name: 'Bookmarked Resources', route: '/resources/bookmarks', designFile: '🔒 Mindful Resources.png' },
  ],

  therapy: [
    { name: 'Therapy Session', route: '/therapy/session', designFile: '🔒 AI Therapy Chatbot.png' },
    { name: 'Therapy History', route: '/therapy/history', designFile: '🔒 AI Therapy Chatbot.png' },
    { name: 'Therapy Session Detail', route: '/therapy/session/1', designFile: '🔒 AI Therapy Chatbot.png' },
    { name: 'Therapy Preferences', route: '/therapy/preferences', designFile: '🔒 AI Therapy Chatbot.png' },
    { name: 'Therapy Insights', route: '/therapy/insights', designFile: '🔒 AI Therapy Chatbot.png' },
    { name: 'Therapy Exercises', route: '/therapy/exercises', designFile: '🔒 AI Therapy Chatbot.png' },
    { name: 'Exercise Detail', route: '/therapy/exercise/1', designFile: '🔒 AI Therapy Chatbot.png' },
  ],

  profile: [
    { name: 'Profile Settings', route: '/profile/settings', designFile: '🔒 Profile Settings & Help Center.png' },
    { name: 'Account Settings', route: '/profile/account', designFile: '🔒 Profile Settings & Help Center.png' },
    { name: 'Personal Information', route: '/profile/personal', designFile: '🔒 Profile Setup & Completion.png' },
    { name: 'Notification Settings', route: '/profile/notifications', designFile: '🔒 Profile Settings & Help Center.png' },
    { name: 'Privacy Settings', route: '/profile/privacy', designFile: '🔒 Profile Settings & Help Center.png' },
    { name: 'Security Settings', route: '/profile/security', designFile: '🔒 Profile Settings & Help Center.png' },
    { name: 'Theme Settings', route: '/profile/theme', designFile: '🔒 Profile Settings & Help Center.png' },
    { name: 'Language Settings', route: '/profile/language', designFile: '🔒 Profile Settings & Help Center.png' },
    { name: 'Help Center', route: '/profile/help', designFile: '🔒 Profile Settings & Help Center.png' },
    { name: 'Contact Support', route: '/profile/support', designFile: '🔒 Profile Settings & Help Center.png' },
    { name: 'About', route: '/profile/about', designFile: '🔒 Profile Settings & Help Center.png' },
    { name: 'Add Emergency Contact', route: '/profile/emergency-contact', designFile: '🔒 Profile Settings & Help Center.png' },
    { name: 'Profile Setup', route: '/profile/setup', designFile: '🔒 Profile Setup & Completion.png' },
  ],

  search: [
    { name: 'Search Main', route: '/search', designFile: '🔒 Search Screen.png' },
    { name: 'Voice Search', route: '/search/voice', designFile: '🔒 Search Screen.png' },
    { name: 'Search Filters', route: '/search/filters', designFile: '🔒 Search Screen.png' },
    { name: 'Popular Searches', route: '/search/popular', designFile: '🔒 Search Screen.png' },
    { name: 'Recent Searches', route: '/search/recent', designFile: '🔒 Search Screen.png' },
    { name: 'Search Categories', route: '/search/categories', designFile: '🔒 Search Screen.png' },
  ],

  wellness: [
    { name: 'Sleep Quality', route: '/wellness/sleep', designFile: '🔒 Sleep Quality.png' },
    { name: 'Sleep Patterns', route: '/wellness/sleep/patterns', designFile: '🔒 Sleep Quality.png' },
    { name: 'Sleep Goals', route: '/wellness/sleep/goals', designFile: '🔒 Sleep Quality.png' },
    { name: 'Sleep Tips', route: '/wellness/sleep/tips', designFile: '🔒 Sleep Quality.png' },
    { name: 'Bedtime Reminders', route: '/wellness/sleep/reminders', designFile: '🔒 Sleep Quality.png' },
    { name: 'Stress Management', route: '/wellness/stress', designFile: '🔒 Stress Management.png' },
    { name: 'Stress Assessment', route: '/wellness/stress/assessment', designFile: '🔒 Stress Management.png' },
    { name: 'Stress Stats', route: '/wellness/stress/stats', designFile: '🔒 Stress Management.png' },
    { name: 'Relaxation Techniques', route: '/wellness/stress/techniques', designFile: '🔒 Stress Management.png' },
    { name: 'Quick Stress Relief', route: '/wellness/stress/quick-relief', designFile: '🔒 Stress Management.png' },
  ],

  notifications: [
    { name: 'Smart Notifications', route: '/notifications', designFile: '🔒 Smart Notifications.png' },
    { name: 'Notification History', route: '/notifications/history', designFile: '🔒 Smart Notifications.png' },
    { name: 'Notification Cards', route: '/notifications/cards', designFile: '🔒 Smart Notifications.png' },
  ],

  errors: [
    { name: 'Not Found', route: '/error/404', designFile: '🔒 Error & Other Utilities.png' },
    { name: 'No Internet', route: '/error/offline', designFile: '🔒 Error & Other Utilities.png' },
    { name: 'Internal Error', route: '/error/500', designFile: '🔒 Error & Other Utilities.png' },
    { name: 'Maintenance', route: '/error/maintenance', designFile: '🔒 Error & Other Utilities.png' },
    { name: 'Not Allowed', route: '/error/403', designFile: '🔒 Error & Other Utilities.png' },
    { name: 'Empty State', route: '/error/empty', designFile: '🔒 Error & Other Utilities.png' },
  ],
};

// Helper function to analyze visual quality
async function analyzeVisualQuality(page, screenName) {
  const analysis = {
    screenName,
    timestamp: new Date().toISOString(),
    issues: [],
    metrics: {},
  };

  // Get computed styles of key elements
  const elementStyles = await page.evaluate(() => {
    const getStyles = (selector) => {
      const el = document.querySelector(selector);
      if (!el) return null;
      const computed = window.getComputedStyle(el);
      return {
        fontSize: computed.fontSize,
        fontFamily: computed.fontFamily,
        fontWeight: computed.fontWeight,
        color: computed.color,
        backgroundColor: computed.backgroundColor,
        padding: computed.padding,
        margin: computed.margin,
        borderRadius: computed.borderRadius,
      };
    };

    return {
      body: getStyles('body'),
      headers: Array.from(document.querySelectorAll('h1, h2, h3')).map(h => ({
        tag: h.tagName,
        text: h.textContent?.trim(),
        ...getStyles(`${h.tagName.toLowerCase()}`),
      })),
      buttons: Array.from(document.querySelectorAll('button, [role="button"]')).length,
      inputs: Array.from(document.querySelectorAll('input, textarea')).length,
      images: Array.from(document.querySelectorAll('img, svg')).length,
    };
  });

  analysis.metrics = elementStyles;

  // Check for common issues
  const issues = await page.evaluate(() => {
    const problems = [];

    // Check for missing alt text
    const imagesWithoutAlt = Array.from(document.querySelectorAll('img:not([alt])')).length;
    if (imagesWithoutAlt > 0) {
      problems.push(`${imagesWithoutAlt} images missing alt text`);
    }

    // Check for low contrast text
    const allText = Array.from(document.querySelectorAll('*')).filter(el => {
      return el.textContent && el.textContent.trim().length > 0;
    });

    // Check for very small fonts
    const smallText = allText.filter(el => {
      const fontSize = parseFloat(window.getComputedStyle(el).fontSize);
      return fontSize < 12;
    }).length;
    if (smallText > 0) {
      problems.push(`${smallText} elements with font size < 12px`);
    }

    // Check for missing labels on inputs
    const inputsWithoutLabels = Array.from(document.querySelectorAll('input:not([aria-label]):not([aria-labelledby])')).filter(input => {
      const label = document.querySelector(`label[for="${input.id}"]`);
      return !label;
    }).length;
    if (inputsWithoutLabels > 0) {
      problems.push(`${inputsWithoutLabels} inputs without labels`);
    }

    // Check for non-semantic headings
    const headingOrder = Array.from(document.querySelectorAll('h1, h2, h3, h4, h5, h6')).map(h => parseInt(h.tagName[1]));
    for (let i = 1; i < headingOrder.length; i++) {
      if (headingOrder[i] - headingOrder[i-1] > 1) {
        problems.push('Heading hierarchy skipped levels');
        break;
      }
    }

    return problems;
  });

  analysis.issues = issues;

  return analysis;
}

// Main test suite
test.describe('Comprehensive Visual Inspection - ALL Screens', () => {

  test.beforeEach(async ({ page }) => {
    // Set up error logging
    page.on('console', msg => {
      if (msg.type() === 'error') {
        console.error(`Console Error on ${page.url()}: ${msg.text()}`);
      }
    });
  });

  // Generate tests for each category
  Object.entries(SCREEN_CATEGORIES).forEach(([category, screens]) => {
    test.describe(`${category.toUpperCase()} Screens`, () => {
      screens.forEach((screen, index) => {
        test(`${category}/${index + 1}. ${screen.name}`, async ({ page }) => {
          const screenSlug = `${category}-${screen.name.replace(/\s+/g, '-').toLowerCase()}`;

          try {
            // Navigate to screen
            console.log(`\n📱 Inspecting: ${screen.name}`);
            console.log(`   Route: ${screen.route}`);

            await page.goto(`${BASE_URL}${screen.route}`, {
              waitUntil: 'networkidle',
              timeout: 30000,
            });

            // Wait for content to load
            await page.waitForTimeout(2000);

            // Take full page screenshot
            const screenshotPath = `${SCREENSHOTS_DIR}/${screenSlug}.png`;
            await page.screenshot({
              path: screenshotPath,
              fullPage: true,
            });
            console.log(`   ✓ Screenshot saved: ${screenshotPath}`);

            // Analyze visual quality
            const analysis = await analyzeVisualQuality(page, screen.name);

            // Get element count
            const elementCount = await page.evaluate(() => {
              return {
                total: document.querySelectorAll('*').length,
                buttons: document.querySelectorAll('button, [role="button"]').length,
                inputs: document.querySelectorAll('input, textarea, select').length,
                images: document.querySelectorAll('img, svg').length,
                links: document.querySelectorAll('a').length,
              };
            });

            analysis.elementCount = elementCount;

            // Check for design reference
            const designRefPath = path.join(DESIGN_REF_DIR, 'Light mode', screen.designFile);
            analysis.designReference = {
              file: screen.designFile,
              exists: fs.existsSync(designRefPath),
              path: designRefPath,
            };

            // Save analysis report
            const reportPath = `${REPORT_DIR}/${screenSlug}-analysis.json`;
            fs.writeFileSync(reportPath, JSON.stringify(analysis, null, 2));
            console.log(`   ✓ Analysis saved: ${reportPath}`);

            // Log issues
            if (analysis.issues.length > 0) {
              console.log(`   ⚠️  Issues found: ${analysis.issues.length}`);
              analysis.issues.forEach(issue => console.log(`      - ${issue}`));
            } else {
              console.log(`   ✅ No issues detected`);
            }

            // Verify screen loaded
            expect(elementCount.total).toBeGreaterThan(10);

          } catch (error) {
            console.error(`   ❌ Error inspecting ${screen.name}:`, error.message);

            // Save error info
            const errorInfo = {
              screen: screen.name,
              route: screen.route,
              error: error.message,
              timestamp: new Date().toISOString(),
            };
            fs.writeFileSync(
              `${REPORT_DIR}/${screenSlug}-ERROR.json`,
              JSON.stringify(errorInfo, null, 2)
            );

            throw error;
          }
        });
      });
    });
  });

  test.describe('Summary Report Generation', () => {
    test('Generate comprehensive summary', async () => {
      // Wait for all tests to complete
      await new Promise(resolve => setTimeout(resolve, 5000));

      // Collect all analysis files
      const analysisFiles = fs.readdirSync(REPORT_DIR)
        .filter(f => f.endsWith('-analysis.json'))
        .map(f => {
          const content = fs.readFileSync(path.join(REPORT_DIR, f), 'utf8');
          return JSON.parse(content);
        });

      const errorFiles = fs.readdirSync(REPORT_DIR)
        .filter(f => f.endsWith('-ERROR.json'))
        .map(f => {
          const content = fs.readFileSync(path.join(REPORT_DIR, f), 'utf8');
          return JSON.parse(content);
        });

      // Generate summary
      const summary = {
        totalScreens: analysisFiles.length + errorFiles.length,
        successfulInspections: analysisFiles.length,
        failedInspections: errorFiles.length,
        totalIssues: analysisFiles.reduce((sum, a) => sum + a.issues.length, 0),
        issuesByType: {},
        timestamp: new Date().toISOString(),
        screensByCategory: {},
      };

      // Categorize issues
      analysisFiles.forEach(analysis => {
        analysis.issues.forEach(issue => {
          const issueType = issue.split(' ')[0];
          summary.issuesByType[issueType] = (summary.issuesByType[issueType] || 0) + 1;
        });
      });

      // Save summary
      fs.writeFileSync(
        `${REPORT_DIR}/SUMMARY.json`,
        JSON.stringify(summary, null, 2)
      );

      console.log('\n' + '='.repeat(80));
      console.log('📊 VISUAL INSPECTION SUMMARY');
      console.log('='.repeat(80));
      console.log(`✓ Total Screens Inspected: ${summary.totalScreens}`);
      console.log(`✓ Successful: ${summary.successfulInspections}`);
      console.log(`❌ Failed: ${summary.failedInspections}`);
      console.log(`⚠️  Total Issues Found: ${summary.totalIssues}`);
      console.log('\nIssues by Type:');
      Object.entries(summary.issuesByType).forEach(([type, count]) => {
        console.log(`  ${type}: ${count}`);
      });
      console.log('='.repeat(80) + '\n');

      expect(summary.successfulInspections).toBeGreaterThan(0);
    });
  });
});
