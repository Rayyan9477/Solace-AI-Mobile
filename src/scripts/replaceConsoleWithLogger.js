/**
 * Script to replace console.log/warn/error/info/debug with logger utility
 *
 * Run with: node src/scripts/replaceConsoleWithLogger.js
 */

const fs = require('fs');
const path = require('path');

// Files to process (excluding scripts, tests, and logger itself)
const filesToProcess = [
  // Dashboard
  'src/features/dashboard/DashboardScreen.tsx',

  // Mood screens
  'src/features/mood/MoodScreen.tsx',
  'src/features/mood/screens/MoodHistoryScreen.tsx',
  'src/features/mood/screens/MoodCalendarScreen.tsx',
  'src/features/mood/screens/MoodSelectionScreen.tsx',
  'src/features/mood/screens/MoodStatsScreen.tsx',
  'src/features/mood/screens/MoodAnalyticsScreen.tsx',
  'src/features/mood/screens/ActivityTrackingScreen.tsx',
  'src/features/mood/components/EnhancedMoodTracker.tsx',

  // Journal screens
  'src/features/journal/screens/JournalListScreen.tsx',
  'src/features/journal/screens/JournalDetailScreen.tsx',
  'src/features/journal/screens/JournalCreateScreen.tsx',

  // Assessment screens
  'src/features/assessment/screens/AssessmentScreen.tsx',

  // Chat screens
  'src/features/chat/ChatScreen.tsx',
  'src/features/chat/components/ChatBubble.tsx',

  // Crisis screens
  'src/features/crisis/CrisisManager.ts',
  'src/features/crisis/crisisConfig.ts',

  // Auth screens
  'src/features/auth/screens/SocialLoginScreen.tsx',

  // Profile screens
  'src/features/profile/screens/ThemeSettingsScreen.tsx',

  // Error screens
  'src/features/error/screens/OfflineModeScreen.tsx',
  'src/features/error/screens/MaintenanceModeScreen.tsx',

  // Notifications
  'src/features/smartNotifications/NotificationManager.ts',

  // Offline
  'src/features/offlineMode/OfflineManager.ts',

  // Services
  'src/shared/services/socialAuthService.ts',
  'src/shared/services/api.ts',
  'src/shared/hooks/useSocialAuth.ts',

  // Theme
  'src/shared/theme/ThemeProvider.tsx',
  'src/shared/theme/customColors.ts',
  'src/shared/theme/ColorPalette.ts',

  // Components
  'src/shared/components/atoms/layout/SafeScreen.tsx',
  'src/shared/components/molecules/cards/MentalHealthCard.tsx',

  // Utils
  'src/shared/utils/accessibility.ts',
  'src/shared/utils/BundleOptimization.ts',

  // App
  'src/app/providers/AppProvider.tsx',
  'src/app/store/slices/assessmentSlice.ts',
  'src/app/store/slices/moodSlice.ts',
  'src/app/store/slices/userSlice.ts',

  // Config
  'src/shared/config/environment.ts',

  // i18n
  'src/i18n/index.ts',
];

/**
 * Check if file already imports logger
 */
function hasLoggerImport(content) {
  return content.includes("from '@shared/utils/logger'") ||
         content.includes('from "@shared/utils/logger"') ||
         content.includes("import { logger }") ||
         content.includes("import logger");
}

/**
 * Add logger import if not present
 */
function addLoggerImport(content) {
  if (hasLoggerImport(content)) {
    return content;
  }

  // Find the last import statement
  const importMatches = [...content.matchAll(/import\s+.*from\s+['"].*['"];?\n/g)];

  if (importMatches.length > 0) {
    const lastImport = importMatches[importMatches.length - 1];
    const insertPosition = lastImport.index + lastImport[0].length;
    const loggerImport = `import { logger } from "@shared/utils/logger";\n`;
    return content.slice(0, insertPosition) + loggerImport + content.slice(insertPosition);
  }

  // If no imports found, add at the beginning
  return `import { logger } from "@shared/utils/logger";\n\n` + content;
}

/**
 * Replace console statements with logger
 */
function replaceConsoleStatements(content) {
  // Replace console.log with logger.debug
  content = content.replace(/console\.log\(/g, 'logger.debug(');

  // Replace console.info with logger.info
  content = content.replace(/console\.info\(/g, 'logger.info(');

  // Replace console.warn with logger.warn
  content = content.replace(/console\.warn\(/g, 'logger.warn(');

  // Replace console.error with logger.error
  content = content.replace(/console\.error\(/g, 'logger.error(');

  // Replace console.debug with logger.debug
  content = content.replace(/console\.debug\(/g, 'logger.debug(');

  return content;
}

/**
 * Process a single file
 */
function processFile(filePath) {
  try {
    if (!fs.existsSync(filePath)) {
      console.log(`⚠️  File not found: ${filePath}`);
      return false;
    }

    let content = fs.readFileSync(filePath, 'utf-8');
    const originalContent = content;

    // Check if file has any console statements
    if (!content.match(/console\.(log|warn|error|info|debug)\(/)) {
      console.log(`✓  ${path.basename(filePath)}: No console statements found`);
      return true;
    }

    // Add logger import
    content = addLoggerImport(content);

    // Replace console statements
    content = replaceConsoleStatements(content);

    // Check if anything changed
    if (content === originalContent) {
      console.log(`✓  ${path.basename(filePath)}: Already using logger`);
      return true;
    }

    // Write back
    fs.writeFileSync(filePath, content, 'utf-8');
    console.log(`✅ ${path.basename(filePath)}: Replaced console with logger`);
    return true;

  } catch (error) {
    console.error(`❌ Error processing ${filePath}:`, error.message);
    return false;
  }
}

/**
 * Main execution
 */
function main() {
  console.log('🔧 Replacing console statements with logger...\n');

  let successCount = 0;
  let failCount = 0;

  for (const file of filesToProcess) {
    if (processFile(file)) {
      successCount++;
    } else {
      failCount++;
    }
  }

  console.log('\n✨ Replacement complete!');
  console.log(`  ✅ Processed: ${successCount} files`);
  console.log(`  ❌ Failed: ${failCount} files`);
}

main();
