/**
 * Migration Script: Apply Error Boundaries to All Screens
 *
 * This script automatically applies ScreenErrorBoundary to all screen components
 * that don't already have error boundaries.
 *
 * Usage:
 *   npx ts-node src/scripts/applyErrorBoundaries.ts
 *
 * What it does:
 * 1. Finds all *Screen.tsx files in src/features
 * 2. Checks if they already have error boundaries
 * 3. Adds ScreenErrorBoundary import if missing
 * 4. Wraps the exported component with ScreenErrorBoundary
 */

import * as fs from 'fs';
import * as path from 'path';
import { glob } from 'glob';

interface ScreenInfo {
  filePath: string;
  fileName: string;
  screenName: string;
  hasErrorBoundary: boolean;
  exportName: string | null;
}

/**
 * Find all screen files in the project
 */
async function findScreenFiles(): Promise<string[]> {
  const pattern = 'src/features/**/screens/*Screen.tsx';
  const files = await glob(pattern, { cwd: process.cwd() });
  return files;
}

/**
 * Extract screen name from file name
 * Example: MoodHistoryScreen.tsx -> Mood History
 */
function getScreenDisplayName(fileName: string): string {
  // Remove .tsx extension
  const name = fileName.replace('.tsx', '');

  // Remove 'Screen' suffix
  const baseName = name.replace(/Screen$/, '');

  // Add spaces before capital letters
  const displayName = baseName.replace(/([A-Z])/g, ' $1').trim();

  return displayName;
}

/**
 * Analyze a screen file to check if it already has error boundaries
 */
function analyzeScreenFile(filePath: string): ScreenInfo {
  const content = fs.readFileSync(filePath, 'utf-8');
  const fileName = path.basename(filePath);
  const screenName = getScreenDisplayName(fileName);

  // Check if file already imports ScreenErrorBoundary
  const hasErrorBoundaryImport = content.includes('ScreenErrorBoundary');

  // Check if file already wraps component with ScreenErrorBoundary
  const hasErrorBoundaryWrapper = /<ScreenErrorBoundary/.test(content);

  // Extract export name
  const exportMatch = content.match(/export\s+const\s+(\w+)\s*=\s*\(/);
  const exportName = exportMatch ? exportMatch[1] : null;

  return {
    filePath,
    fileName,
    screenName,
    hasErrorBoundary: hasErrorBoundaryImport && hasErrorBoundaryWrapper,
    exportName,
  };
}

/**
 * Apply error boundary to a single screen file
 */
function applyErrorBoundary(screenInfo: ScreenInfo): boolean {
  try {
    let content = fs.readFileSync(screenInfo.filePath, 'utf-8');
    const { exportName, screenName } = screenInfo;

    if (!exportName) {
      console.log(`⚠️  Skipping ${screenInfo.fileName}: Could not find export statement`);
      return false;
    }

    // Step 1: Add import if missing
    if (!content.includes('ScreenErrorBoundary')) {
      // Find the last import statement
      const importRegex = /import\s+.*from\s+['"].*['"];?\n/g;
      const imports = content.match(importRegex) || [];

      if (imports.length > 0) {
        const lastImport = imports[imports.length - 1];
        const lastImportIndex = content.lastIndexOf(lastImport);
        const insertPosition = lastImportIndex + lastImport.length;

        const errorBoundaryImport = `import { ScreenErrorBoundary } from "@shared/components/ErrorBoundaryWrapper";\n`;
        content = content.slice(0, insertPosition) + errorBoundaryImport + content.slice(insertPosition);
      }
    }

    // Step 2: Rename the exported component
    const componentName = `${exportName}Component`;
    const exportPattern = new RegExp(`export\\s+const\\s+${exportName}\\s*=`, 'g');
    content = content.replace(exportPattern, `const ${componentName} =`);

    // Step 3: Find the export default statement
    const defaultExportPattern = new RegExp(`export\\s+default\\s+${exportName};`);
    const hasDefaultExport = defaultExportPattern.test(content);

    // Step 4: Add wrapped export before export default
    const wrappedExport = `
export const ${exportName} = (props: any) => (
  <ScreenErrorBoundary screenName="${screenName}">
    <${componentName} {...props} />
  </ScreenErrorBoundary>
);
`;

    if (hasDefaultExport) {
      // Insert before export default
      content = content.replace(
        defaultExportPattern,
        `${wrappedExport}\nexport default ${exportName};`
      );
    } else {
      // Just append at the end
      content += `\n${wrappedExport}\n`;
    }

    // Write back to file
    fs.writeFileSync(screenInfo.filePath, content, 'utf-8');
    console.log(`✅ Applied error boundary to ${screenInfo.fileName}`);
    return true;
  } catch (error) {
    console.error(`❌ Failed to apply error boundary to ${screenInfo.fileName}:`, error);
    return false;
  }
}

/**
 * Main execution
 */
async function main() {
  console.log('🔍 Finding all screen files...\n');

  const screenFiles = await findScreenFiles();
  console.log(`Found ${screenFiles.length} screen files\n`);

  // Analyze all screens
  const screenInfos = screenFiles.map(analyzeScreenFile);

  // Separate screens with and without error boundaries
  const screensWithEB = screenInfos.filter(s => s.hasErrorBoundary);
  const screensWithoutEB = screenInfos.filter(s => !s.hasErrorBoundary);

  console.log(`📊 Status:`);
  console.log(`  ✅ ${screensWithEB.length} screens already have error boundaries`);
  console.log(`  ⏳ ${screensWithoutEB.length} screens need error boundaries\n`);

  if (screensWithoutEB.length === 0) {
    console.log('🎉 All screens already have error boundaries!');
    return;
  }

  console.log('🔧 Applying error boundaries to remaining screens...\n');

  let successCount = 0;
  let failCount = 0;

  for (const screenInfo of screensWithoutEB) {
    if (applyErrorBoundary(screenInfo)) {
      successCount++;
    } else {
      failCount++;
    }
  }

  console.log('\n✨ Migration Complete!');
  console.log(`  ✅ Successfully updated: ${successCount} screens`);
  console.log(`  ❌ Failed: ${failCount} screens`);
  console.log(`  📝 Total coverage: ${screensWithEB.length + successCount}/${screenFiles.length} screens (${Math.round(((screensWithEB.length + successCount) / screenFiles.length) * 100)}%)`);

  if (failCount > 0) {
    console.log('\n⚠️  Some screens failed to update. Please review them manually.');
  }
}

// Run the migration
main().catch(console.error);
