#!/usr/bin/env node

/**
 * Script to update all components to use the new theme system
 * This script replaces old theme usage patterns with the new theme pattern
 */

const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');

// Files to update
const filesToUpdate = [
  'src/components/dashboard/DailyInsights.js',
  'src/components/dashboard/QuickActions.js',
  'src/components/dashboard/ProgressOverview.js',
  'src/components/dashboard/RecentActivity.js',
  'src/screens/mood/MoodTrackerScreen.js',
  'src/components/mood/MoodSelector.js',
  'src/components/mood/IntensitySlider.js',
  'src/components/mood/ActivitySelector.js',
  'src/screens/profile/ProfileScreen.js',
  'src/components/profile/ProfileHeader.js',
  'src/components/profile/SettingsSection.js',
  'src/components/profile/StatsCard.js',
  'src/screens/assessment/AssessmentScreen.js',
  'src/components/assessment/AssessmentCard.js',
  'src/components/assessment/AssessmentHistory.js',
];

console.log('🔄 Updating components to use new theme system...\n');

filesToUpdate.forEach(file => {
  const filePath = path.join(__dirname, '..', file);
  
  if (fs.existsSync(filePath)) {
    console.log(`📝 Updating: ${file}`);
    
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Replace old theme imports and usage
    content = content.replace(
      /import.*colors.*typography.*spacing.*borderRadius.*shadows.*from.*theme.*\n/g,
      ''
    );
    
    // Replace old theme hook usage
    content = content.replace(
      /const\s*{\s*isDarkMode\s*}\s*=\s*useTheme\(\);/g,
      'const { theme } = useTheme();'
    );
    
    // Replace old theme variable
    content = content.replace(
      /const\s*currentTheme\s*=\s*isDarkMode\s*\?\s*colors\.dark\s*:\s*colors;/g,
      ''
    );
    
    // Replace usage of currentTheme with theme.colors
    content = content.replace(/currentTheme\./g, 'theme.colors.');
    
    // Replace direct colors usage with theme.colors
    content = content.replace(/colors\./g, 'theme.colors.');
    
    // Replace typography usage
    content = content.replace(/typography\./g, 'theme.typography.');
    
    // Replace spacing usage
    content = content.replace(/spacing\[/g, 'theme.spacing[');
    
    // Replace borderRadius usage
    content = content.replace(/borderRadius\./g, 'theme.borderRadius.');
    
    // Replace shadows usage
    content = content.replace(/shadows\./g, 'theme.shadows.');
    
    // Write updated content
    fs.writeFileSync(filePath, content);
    console.log(`✅ Updated: ${file}`);
  } else {
    console.log(`⚠️  File not found: ${file}`);
  }
});

console.log('\n🎉 All components updated to use new theme system!');
console.log('📋 Summary:');
console.log('- Removed old theme imports');
console.log('- Updated useTheme hook usage');
console.log('- Replaced currentTheme with theme.colors');
console.log('- Updated all design token references');
console.log('\n🧪 Run tests to verify the changes work correctly.');
