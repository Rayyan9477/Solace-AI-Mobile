#!/usr/bin/env node

/**
 * Light/Dark Mode Theme Test
 * This script validates the light/dark mode implementation
 */

const fs = require('fs');
const path = require('path');

console.log('🎨 Testing Light/Dark Mode Implementation\n');

// Test 1: Verify theme structure
const themeFile = path.join(__dirname, '..', 'src', 'styles', 'theme.js');
if (!fs.existsSync(themeFile)) {
  console.log('❌ Theme file not found');
  process.exit(1);
}

const themeContent = fs.readFileSync(themeFile, 'utf8');

console.log('📋 Theme Structure Tests:');

// Check for light theme colors
const hasLightColors = themeContent.includes('background: {') && 
                      themeContent.includes('text: {') &&
                      themeContent.includes('border: {');
console.log(`✅ Light theme colors: ${hasLightColors ? 'Present' : 'Missing'}`);

// Check for dark theme colors
const hasDarkColors = themeContent.includes('dark: {') &&
                     themeContent.includes('dark.background') &&
                     themeContent.includes('dark.text');
console.log(`✅ Dark theme colors: ${hasDarkColors ? 'Present' : 'Missing'}`);

// Check for light/dark theme exports
const hasThemeExports = themeContent.includes('lightTheme') && 
                       themeContent.includes('darkTheme');
console.log(`✅ Theme exports: ${hasThemeExports ? 'Present' : 'Missing'}`);

// Test 2: Verify ThemeContext
const contextFile = path.join(__dirname, '..', 'src', 'contexts', 'ThemeContext.js');
if (!fs.existsSync(contextFile)) {
  console.log('❌ ThemeContext file not found');
  process.exit(1);
}

const contextContent = fs.readFileSync(contextFile, 'utf8');

console.log('\n📋 ThemeContext Tests:');

const hasThemeToggle = contextContent.includes('toggleTheme') &&
                      contextContent.includes('isDarkMode');
console.log(`✅ Theme toggle functionality: ${hasThemeToggle ? 'Present' : 'Missing'}`);

const hasPersistence = contextContent.includes('AsyncStorage') &&
                      contextContent.includes('theme_preference');
console.log(`✅ Theme persistence: ${hasPersistence ? 'Present' : 'Missing'}`);

const hasSystemDefault = contextContent.includes('useColorScheme');
console.log(`✅ System theme detection: ${hasSystemDefault ? 'Present' : 'Missing'}`);

// Test 3: Check App.js integration
const appFile = path.join(__dirname, '..', 'App.js');
if (!fs.existsSync(appFile)) {
  console.log('❌ App.js file not found');
  process.exit(1);
}

const appContent = fs.readFileSync(appFile, 'utf8');

console.log('\n📋 App Integration Tests:');

const hasThemeProvider = appContent.includes('ThemeProvider') &&
                        appContent.includes('useTheme');
console.log(`✅ ThemeProvider integration: ${hasThemeProvider ? 'Present' : 'Missing'}`);

const hasStatusBarTheming = appContent.includes('StatusBar') &&
                           appContent.includes('isDarkMode');
console.log(`✅ StatusBar theming: ${hasStatusBarTheming ? 'Present' : 'Missing'}`);

// Test 4: Count components using theme
const srcDir = path.join(__dirname, '..', 'src');
const findJSFiles = (dir, fileList = []) => {
  const files = fs.readdirSync(dir);
  
  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory()) {
      findJSFiles(filePath, fileList);
    } else if (file.endsWith('.js') && !file.includes('.test.')) {
      fileList.push(filePath);
    }
  });
  
  return fileList;
};

const jsFiles = findJSFiles(srcDir);
let componentsUsingTheme = 0;
let componentsTotal = 0;

jsFiles.forEach(filePath => {
  const content = fs.readFileSync(filePath, 'utf8');
  
  // Check if it's a component file (has JSX or styled components)
  if (content.includes('return (') || content.includes('styled(')) {
    componentsTotal++;
    
    // Check if it uses theme
    if (content.includes('useTheme') || content.includes('theme.colors')) {
      componentsUsingTheme++;
    }
  }
});

console.log('\n📋 Component Theme Usage:');
console.log(`✅ Components using theme: ${componentsUsingTheme}/${componentsTotal}`);

// Test 5: Color consistency check
const moodColors = [
  'happy', 'calm', 'anxious', 'sad', 'angry', 'neutral',
  'excited', 'tired', 'stressed', 'content'
];

console.log('\n📋 Color System Tests:');

const hasMoodColors = moodColors.every(mood => 
  themeContent.includes(`mood: {`) && 
  themeContent.includes(`${mood}:`)
);
console.log(`✅ Mood color palette: ${hasMoodColors ? 'Complete' : 'Incomplete'}`);

const hasTherapeuticColors = themeContent.includes('therapeutic: {') &&
                            themeContent.includes('calming:') &&
                            themeContent.includes('grounding:');
console.log(`✅ Therapeutic color palette: ${hasTherapeuticColors ? 'Complete' : 'Incomplete'}`);

// Final Summary
console.log('\n🎯 Summary:');
const allTestsPassed = hasLightColors && hasDarkColors && hasThemeExports &&
                      hasThemeToggle && hasPersistence && hasSystemDefault &&
                      hasThemeProvider && hasStatusBarTheming &&
                      (componentsUsingTheme / componentsTotal > 0.8) &&
                      hasMoodColors && hasTherapeuticColors;

if (allTestsPassed) {
  console.log('🎉 All theme tests passed! Light/Dark mode implementation is complete.');
} else {
  console.log('⚠️  Some theme tests failed. Please review the implementation.');
}

console.log(`\n💡 Theme adoption rate: ${Math.round((componentsUsingTheme / componentsTotal) * 100)}%`);

console.log('\n🚀 Next Steps:');
console.log('1. Test the app visually in both light and dark modes');
console.log('2. Run accessibility tests');
console.log('3. Test theme persistence across app restarts');
console.log('4. Verify smooth theme transitions');
console.log('5. Check color contrast ratios for accessibility');
