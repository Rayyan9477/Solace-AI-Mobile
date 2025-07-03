#!/usr/bin/env node

/**
 * Test script to validate the new light mode theme system
 * This script checks that all theme colors are properly defined
 * and that the theme system is working correctly.
 */

const fs = require('fs');
const path = require('path');

// Import theme (simulated for testing)
const themePath = path.join(__dirname, '..', 'src', 'styles', 'theme.js');
const themeContextPath = path.join(__dirname, '..', 'src', 'contexts', 'ThemeContext.js');
const showcasePath = path.join(__dirname, '..', 'src', 'screens', 'ThemeShowcaseScreen.js');

console.log('🎨 Testing Freud UI Kit Light Mode Theme System\n');

// Check if theme files exist
const checkFile = (filePath, fileName) => {
  if (fs.existsSync(filePath)) {
    console.log(`✅ ${fileName} exists`);
    return true;
  } else {
    console.log(`❌ ${fileName} missing`);
    return false;
  }
};

// Test theme file structure
console.log('📁 Checking theme files...');
const themeExists = checkFile(themePath, 'theme.js');
const contextExists = checkFile(themeContextPath, 'ThemeContext.js');
const showcaseExists = checkFile(showcasePath, 'ThemeShowcaseScreen.js');

if (themeExists && contextExists && showcaseExists) {
  console.log('\n✅ All theme files are present!\n');
  
  // Read theme file and check for required colors
  const themeContent = fs.readFileSync(themePath, 'utf8');
  
  console.log('🎨 Checking color definitions...');
  
  const requiredColors = [
    'primary',
    'secondary',
    'success',
    'warning',
    'error',
    'gray',
    'mood',
    'therapeutic',
    'background',
    'text',
    'border'
  ];
  
  const missingColors = requiredColors.filter(color => 
    !themeContent.includes(color + ':')
  );
  
  if (missingColors.length === 0) {
    console.log('✅ All required colors are defined');
    
    // Check specific therapeutic colors
    const therapeuticColors = [
      'calming',
      'energizing',
      'grounding',
      'nurturing',
      'peaceful'
    ];
    
    const missingTherapeutic = therapeuticColors.filter(color => 
      !themeContent.includes(color + ':')
    );
    
    if (missingTherapeutic.length === 0) {
      console.log('✅ All therapeutic colors are defined');
    } else {
      console.log('⚠️  Missing therapeutic colors:', missingTherapeutic);
    }
    
    // Check mood colors
    const moodColors = [
      'happy',
      'calm',
      'anxious',
      'sad',
      'content'
    ];
    
    const missingMood = moodColors.filter(color => 
      !themeContent.includes(color + ':')
    );
    
    if (missingMood.length === 0) {
      console.log('✅ All mood colors are defined');
    } else {
      console.log('⚠️  Missing mood colors:', missingMood);
    }
    
  } else {
    console.log('❌ Missing required colors:', missingColors);
  }
  
  console.log('\n📱 Theme system validation complete!');
  console.log('\n🚀 To see the theme in action:');
  console.log('1. Run your React Native app');
  console.log('2. Navigate to ThemeShowcaseScreen');
  console.log('3. Toggle between light and dark modes');
  console.log('4. Check the demo components\n');
  
  console.log('📚 Documentation:');
  console.log('- See LIGHT_MODE_DESIGN_SYSTEM.md for full documentation');
  console.log('- Check src/components/demo/LightModeDemo.js for examples');
  console.log('- Use src/screens/ThemeShowcaseScreen.js to preview all colors\n');
  
} else {
  console.log('\n❌ Some theme files are missing. Please check your installation.\n');
}

// Check for demo component
const demoPath = path.join(__dirname, '..', 'src', 'components', 'demo', 'LightModeDemo.js');
if (fs.existsSync(demoPath)) {
  console.log('✅ Light mode demo component is available');
} else {
  console.log('⚠️  Light mode demo component not found');
}

console.log('\n🎨 Theme validation complete! ✨');
