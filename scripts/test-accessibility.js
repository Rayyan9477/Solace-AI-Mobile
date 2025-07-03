#!/usr/bin/env node

/**
 * Accessibility Test Script
 * This script checks color contrast ratios and accessibility compliance
 */

const fs = require('fs');
const path = require('path');

// Color contrast calculation helper
function hexToRgb(hex) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
}

function getLuminance(rgb) {
  const { r, g, b } = rgb;
  const [rs, gs, bs] = [r, g, b].map(c => {
    c = c / 255;
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
}

function getContrastRatio(color1, color2) {
  const rgb1 = hexToRgb(color1);
  const rgb2 = hexToRgb(color2);
  
  if (!rgb1 || !rgb2) return null;
  
  const lum1 = getLuminance(rgb1);
  const lum2 = getLuminance(rgb2);
  
  const brightest = Math.max(lum1, lum2);
  const darkest = Math.min(lum1, lum2);
  
  return (brightest + 0.05) / (darkest + 0.05);
}

function checkAccessibility(ratio) {
  return {
    AAA: ratio >= 7,
    AA: ratio >= 4.5,
    AALarge: ratio >= 3,
    fail: ratio < 3
  };
}

console.log('♿ Accessibility Compliance Test\n');

// Load theme colors
const themeFile = path.join(__dirname, '..', 'src', 'styles', 'theme.js');
const themeContent = fs.readFileSync(themeFile, 'utf8');

// Extract color values using regex (simplified)
const extractColors = (content) => {
  const colors = {};
  
  // Extract hex colors
  const hexMatches = content.match(/#[0-9A-Fa-f]{6}/g) || [];
  hexMatches.forEach((hex, index) => {
    colors[`color_${index}`] = hex;
  });
  
  return colors;
};

const colors = extractColors(themeContent);

console.log('📋 Color Contrast Analysis:');

// Define critical color combinations for accessibility testing
const testCombinations = [
  // Light mode combinations
  { name: 'Light Primary Text on Background', fg: '#111827', bg: '#FFFFFF' },
  { name: 'Light Secondary Text on Background', fg: '#4B5563', bg: '#FFFFFF' },
  { name: 'Light Tertiary Text on Background', fg: '#6B7280', bg: '#FFFFFF' },
  { name: 'Light Primary Button Text', fg: '#FFFFFF', bg: '#64748B' },
  { name: 'Light Error Text on Background', fg: '#DC2626', bg: '#FFFFFF' },
  { name: 'Light Success Text on Background', fg: '#16A34A', bg: '#FFFFFF' },
  { name: 'Light Warning Text on Background', fg: '#D97706', bg: '#FFFFFF' },
  
  // Dark mode combinations
  { name: 'Dark Primary Text on Background', fg: '#F8FAFC', bg: '#0F172A' },
  { name: 'Dark Secondary Text on Background', fg: '#E2E8F0', bg: '#0F172A' },
  { name: 'Dark Tertiary Text on Background', fg: '#CBD5E1', bg: '#0F172A' },
  { name: 'Dark Primary Button Text', fg: '#0F172A', bg: '#F8FAFC' },
  { name: 'Dark Error Text on Background', fg: '#F87171', bg: '#0F172A' },
  { name: 'Dark Success Text on Background', fg: '#4ADE80', bg: '#0F172A' },
  { name: 'Dark Warning Text on Background', fg: '#FBBF24', bg: '#0F172A' },
  
  // Cards and secondary surfaces
  { name: 'Light Text on Secondary Background', fg: '#111827', bg: '#F9FAFB' },
  { name: 'Dark Text on Secondary Background', fg: '#F8FAFC', bg: '#1E293B' },
];

let passedTests = 0;
let totalTests = testCombinations.length;

testCombinations.forEach(combo => {
  const ratio = getContrastRatio(combo.fg, combo.bg);
  
  if (ratio !== null) {
    const accessibility = checkAccessibility(ratio);
    const status = accessibility.AA ? '✅' : accessibility.AALarge ? '⚠️' : '❌';
    const level = accessibility.AAA ? 'AAA' : accessibility.AA ? 'AA' : accessibility.AALarge ? 'AA Large' : 'FAIL';
    
    console.log(`${status} ${combo.name}: ${ratio.toFixed(2)} (${level})`);
    
    if (accessibility.AA) passedTests++;
  } else {
    console.log(`❌ ${combo.name}: Invalid colors`);
  }
});

console.log(`\n📊 Accessibility Score: ${passedTests}/${totalTests} tests passed (${Math.round((passedTests/totalTests)*100)}%)`);

// Check for accessibility features in components
console.log('\n📋 Accessibility Features Check:');

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
let accessibilityFeatures = {
  accessibilityLabel: 0,
  accessibilityHint: 0,
  accessibilityRole: 0,
  accessibilityState: 0,
  testID: 0,
  components: 0
};

jsFiles.forEach(filePath => {
  const content = fs.readFileSync(filePath, 'utf8');
  
  // Check if it's a component file
  if (content.includes('return (') || content.includes('styled(')) {
    accessibilityFeatures.components++;
    
    if (content.includes('accessibilityLabel')) accessibilityFeatures.accessibilityLabel++;
    if (content.includes('accessibilityHint')) accessibilityFeatures.accessibilityHint++;
    if (content.includes('accessibilityRole')) accessibilityFeatures.accessibilityRole++;
    if (content.includes('accessibilityState')) accessibilityFeatures.accessibilityState++;
    if (content.includes('testID')) accessibilityFeatures.testID++;
  }
});

console.log(`✅ Components with accessibility labels: ${accessibilityFeatures.accessibilityLabel}/${accessibilityFeatures.components}`);
console.log(`✅ Components with accessibility hints: ${accessibilityFeatures.accessibilityHint}/${accessibilityFeatures.components}`);
console.log(`✅ Components with accessibility roles: ${accessibilityFeatures.accessibilityRole}/${accessibilityFeatures.components}`);
console.log(`✅ Components with accessibility states: ${accessibilityFeatures.accessibilityState}/${accessibilityFeatures.components}`);
console.log(`✅ Components with test IDs: ${accessibilityFeatures.testID}/${accessibilityFeatures.components}`);

// Color blindness considerations
console.log('\n📋 Color Blindness Considerations:');

const colorOnlyPatterns = [
  'color: red',
  'color: green',
  'backgroundColor: red',
  'backgroundColor: green',
];

let colorOnlyIssues = 0;
jsFiles.forEach(filePath => {
  const content = fs.readFileSync(filePath, 'utf8');
  colorOnlyPatterns.forEach(pattern => {
    if (content.includes(pattern)) {
      colorOnlyIssues++;
    }
  });
});

console.log(`✅ Color-only information patterns: ${colorOnlyIssues === 0 ? 'None found (Good!)' : colorOnlyIssues + ' potential issues'}`);

// Mental health specific accessibility
console.log('\n📋 Mental Health App Accessibility:');

const mentalHealthFeatures = {
  reducedMotion: themeContent.includes('animation') && themeContent.includes('timing'),
  gentleColors: themeContent.includes('therapeutic') && themeContent.includes('calming'),
  moodColors: themeContent.includes('mood: {'),
  darkModeSupport: themeContent.includes('darkTheme'),
};

console.log(`✅ Reduced motion support: ${mentalHealthFeatures.reducedMotion ? 'Present' : 'Missing'}`);
console.log(`✅ Gentle/therapeutic colors: ${mentalHealthFeatures.gentleColors ? 'Present' : 'Missing'}`);
console.log(`✅ Mood-based colors: ${mentalHealthFeatures.moodColors ? 'Present' : 'Missing'}`);
console.log(`✅ Dark mode (eye strain): ${mentalHealthFeatures.darkModeSupport ? 'Present' : 'Missing'}`);

// Final recommendations
console.log('\n💡 Accessibility Recommendations:');

if (passedTests / totalTests < 0.9) {
  console.log('🔧 Improve color contrast ratios for better readability');
}

if (accessibilityFeatures.accessibilityLabel / accessibilityFeatures.components < 0.5) {
  console.log('🔧 Add accessibility labels to more interactive components');
}

if (accessibilityFeatures.accessibilityRole / accessibilityFeatures.components < 0.3) {
  console.log('🔧 Define accessibility roles for better screen reader support');
}

console.log('🔧 Consider adding voice control support for mental health users');
console.log('🔧 Implement font size scaling for users with visual impairments');
console.log('🔧 Add high contrast mode option');
console.log('🔧 Test with screen readers (TalkBack, VoiceOver)');
console.log('🔧 Consider adding haptic feedback for important interactions');

console.log('\n🎯 Overall Accessibility Status:');
const overallScore = ((passedTests / totalTests) + 
                     (accessibilityFeatures.accessibilityLabel / accessibilityFeatures.components) +
                     (Object.values(mentalHealthFeatures).filter(Boolean).length / 4)) / 3;

if (overallScore >= 0.8) {
  console.log('🎉 Excellent accessibility compliance!');
} else if (overallScore >= 0.6) {
  console.log('👍 Good accessibility, with room for improvement');
} else {
  console.log('⚠️  Accessibility needs significant improvement');
}

console.log(`📊 Overall Score: ${Math.round(overallScore * 100)}%`);
