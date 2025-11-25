/**
 * Batch Apply Error Boundaries to Critical Screens
 *
 * This script applies error boundaries to a predefined list of critical screens.
 * Run with: node src/scripts/applyErrorBoundariesBatch.js
 */

const fs = require('fs');
const path = require('path');

// List of critical screens to update
const CRITICAL_SCREENS = [
  'src/features/auth/LoginScreen.tsx',
  'src/features/auth/SignupScreen.tsx',
  'src/features/auth/ForgotPasswordScreen.tsx',
  'src/features/auth/screens/SocialLoginScreen.tsx',
  'src/features/onboarding/screens/WelcomeScreen.tsx',
  'src/features/onboarding/screens/SplashScreen.tsx',
  'src/features/crisis/screens/CrisisSupportScreen.tsx',
  'src/features/profile/screens/ProfileSettingsScreen.tsx',
  'src/features/profile/screens/AccountSettingsScreen.tsx',
  'src/features/profile/screens/SecuritySettingsScreen.tsx',
];

/**
 * Extract screen name from file path
 */
function getScreenDisplayName(filePath) {
  const fileName = path.basename(filePath, '.tsx');
  const baseName = fileName.replace(/Screen$/, '');
  return baseName.replace(/([A-Z])/g, ' $1').trim();
}

/**
 * Check if file already has error boundary
 */
function hasErrorBoundary(content) {
  return content.includes('ScreenErrorBoundary') && /<ScreenErrorBoundary/.test(content);
}

/**
 * Find the export statement in the file
 */
function findExportName(content) {
  // Try to find: export const ScreenName = ...
  const match1 = content.match(/export\s+const\s+(\w+)\s*=\s*\(/);
  if (match1) return match1[1];

  // Try to find: export const ScreenName: React.FC = ...
  const match2 = content.match(/export\s+const\s+(\w+)\s*:\s*\w+\s*=\s*\(/);
  if (match2) return match2[1];

  // Try to find: export function ScreenName
  const match3 = content.match(/export\s+function\s+(\w+)\s*\(/);
  if (match3) return match3[1];

  return null;
}

/**
 * Apply error boundary to a screen file
 */
function applyErrorBoundary(filePath) {
  try {
    if (!fs.existsSync(filePath)) {
      console.log(`⚠️  File not found: ${filePath}`);
      return false;
    }

    let content = fs.readFileSync(filePath, 'utf-8');

    // Check if already has error boundary
    if (hasErrorBoundary(content)) {
      console.log(`✓  ${path.basename(filePath)} already has error boundary`);
      return true;
    }

    const exportName = findExportName(content);
    if (!exportName) {
      console.log(`⚠️  Could not find export in ${path.basename(filePath)}`);
      return false;
    }

    const screenName = getScreenDisplayName(filePath);
    const componentName = `${exportName}Component`;

    // Step 1: Add import if missing
    if (!content.includes('ScreenErrorBoundary')) {
      // Find position after the last import
      const importMatches = [...content.matchAll(/import\s+.*from\s+['"].*['"];?\n/g)];

      if (importMatches.length > 0) {
        const lastImport = importMatches[importMatches.length - 1];
        const insertPosition = lastImport.index + lastImport[0].length;
        const errorBoundaryImport = `import { ScreenErrorBoundary } from "@shared/components/ErrorBoundaryWrapper";\n`;
        content = content.slice(0, insertPosition) + errorBoundaryImport + content.slice(insertPosition);
      }
    }

    // Step 2: Rename the exported component
    const exportPatterns = [
      new RegExp(`export\\s+const\\s+${exportName}\\s*=`, 'g'),
      new RegExp(`export\\s+const\\s+${exportName}\\s*:\\s*\\w+\\s*=`, 'g'),
      new RegExp(`export\\s+function\\s+${exportName}\\s*\\(`, 'g'),
    ];

    for (const pattern of exportPatterns) {
      if (pattern.test(content)) {
        content = content.replace(pattern, (match) => {
          if (match.includes('function')) {
            return `function ${componentName}(`;
          }
          return match.replace(exportName, componentName).replace('export ', '');
        });
        break;
      }
    }

    // Step 3: Add wrapped export
    const defaultExportPattern = new RegExp(`export\\s+default\\s+${exportName};?`);
    const hasDefaultExport = defaultExportPattern.test(content);

    const wrappedExport = `
export const ${exportName} = (props: any) => (
  <ScreenErrorBoundary screenName="${screenName}">
    <${componentName} {...props} />
  </ScreenErrorBoundary>
);
`;

    if (hasDefaultExport) {
      content = content.replace(defaultExportPattern, `${wrappedExport}\nexport default ${exportName};`);
    } else {
      content += `\n${wrappedExport}\n`;
    }

    // Write back to file
    fs.writeFileSync(filePath, content, 'utf-8');
    console.log(`✅ Applied error boundary to ${path.basename(filePath)}`);
    return true;

  } catch (error) {
    console.error(`❌ Error processing ${path.basename(filePath)}:`, error.message);
    return false;
  }
}

/**
 * Main execution
 */
function main() {
  console.log('🔧 Applying error boundaries to critical screens...\n');

  let successCount = 0;
  let skipCount = 0;
  let failCount = 0;

  for (const screenPath of CRITICAL_SCREENS) {
    const result = applyErrorBoundary(screenPath);

    if (result === true) {
      successCount++;
    } else if (result === 'skip') {
      skipCount++;
    } else {
      failCount++;
    }
  }

  console.log('\n✨ Batch processing complete!');
  console.log(`  ✅ Successfully updated: ${successCount} screens`);
  console.log(`  ✓  Already had boundaries: ${skipCount} screens`);
  console.log(`  ❌ Failed/Skipped: ${failCount} screens`);
  console.log(`  📝 Total: ${CRITICAL_SCREENS.length} screens processed`);
}

// Run the script
main();
