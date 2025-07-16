// scripts/add-haptic-feedback.js
const fs = require('fs');
const path = require('path');

// Track changes
let totalFixed = 0;
const fixedFiles = [];

// Check if file needs haptic feedback
function needsHapticFeedback(content) {
  const hasImportantActions = /onPress.*=.*{[^}]*(submit|save|delete|confirm|login|register|complete)/gi.test(content);
  const hasHaptics = /HapticFeedback|Haptics|vibrate|expo-haptics/.test(content);
  
  return hasImportantActions && !hasHaptics;
}

// Add haptic feedback imports
function addHapticImports(content) {
  if (content.includes('expo-haptics')) {
    return content;
  }
  
  // Find the first import statement to insert after
  const firstImportRegex = /import[^;]+;/;
  const match = content.match(firstImportRegex);
  
  if (match) {
    const hapticImport = "import * as Haptics from 'expo-haptics';";
    const insertion = match[0] + '\n' + hapticImport;
    content = content.replace(match[0], insertion);
  }
  
  return content;
}

// Detect action type and return appropriate haptic feedback
function getHapticForAction(actionContent) {
  const action = actionContent.toLowerCase();
  
  if (action.includes('delete') || action.includes('remove')) {
    return 'Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning)';
  } else if (action.includes('submit') || action.includes('save') || action.includes('complete')) {
    return 'Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success)';
  } else if (action.includes('login') || action.includes('register') || action.includes('confirm')) {
    return 'Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)';
  } else if (action.includes('cancel') || action.includes('error')) {
    return 'Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error)';
  } else {
    return 'Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)';
  }
}

// Add haptic feedback to actions
function addHapticFeedback(content) {
  let modifiedContent = content;
  let changesMade = false;
  
  // Pattern to match onPress handlers with important actions
  const actionPattern = /onPress=\{([^}]*(?:submit|save|delete|confirm|login|register|complete)[^}]*)\}/gi;
  
  modifiedContent = modifiedContent.replace(actionPattern, (match, handler) => {
    // Skip if already has haptic feedback
    if (handler.includes('Haptics.') || handler.includes('haptic')) {
      return match;
    }
    
    changesMade = true;
    const hapticCall = getHapticForAction(handler);
    
    // Handle different onPress patterns
    if (handler.trim().startsWith('()')) {
      // Arrow function
      const functionBody = handler.replace(/^\(\)\s*=>\s*{?/, '').replace(/}?$/, '');
      return `onPress={() => {
      ${hapticCall};
      ${functionBody}
    }}`;
    } else if (handler.includes('=>')) {
      // Arrow function with parameters
      const arrowIndex = handler.indexOf('=>');
      const params = handler.substring(0, arrowIndex).trim();
      const body = handler.substring(arrowIndex + 2).trim();
      return `onPress={${params} => {
      ${hapticCall};
      ${body.replace(/^{|}$/g, '')}
    }}`;
    } else {
      // Direct function call
      return `onPress={() => {
      ${hapticCall};
      ${handler}();
    }}`;
    }
  });
  
  // Also handle TouchableOpacity/Pressable with onPress
  const touchablePattern = /<(TouchableOpacity|Pressable|Button)([^>]*onPress=\{[^}]*(?:submit|save|delete|confirm|login|register|complete)[^}]*\}[^>]*)>/gi;
  
  modifiedContent = modifiedContent.replace(touchablePattern, (match, component, props) => {
    if (props.includes('Haptics.') || props.includes('haptic')) {
      return match;
    }
    
    // Extract onPress handler
    const onPressMatch = props.match(/onPress=\{([^}]+)\}/);
    if (onPressMatch) {
      const handler = onPressMatch[1];
      const hapticCall = getHapticForAction(handler);
      
      const newOnPress = `onPress={() => {
        ${hapticCall};
        ${handler}();
      }}`;
      
      const newProps = props.replace(/onPress=\{[^}]+\}/, newOnPress);
      changesMade = true;
      return `<${component}${newProps}>`;
    }
    
    return match;
  });
  
  return { content: modifiedContent, changesMade };
}

// Add haptic feedback to file
function addHapticFeedbackToFile(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    const originalContent = content;
    
    // Check if file needs fixing
    if (!needsHapticFeedback(content)) {
      return;
    }
    
    // Add imports
    content = addHapticImports(content);
    
    // Add haptic feedback
    const { content: modifiedContent, changesMade } = addHapticFeedback(content);
    content = modifiedContent;
    
    // Write changes if any were made
    if (changesMade && content !== originalContent) {
      fs.writeFileSync(filePath, content);
      totalFixed++;
      fixedFiles.push(filePath);
      console.log(`✅ Added haptic feedback to: ${filePath}`);
    }
  } catch (error) {
    console.error(`❌ Error processing ${filePath}:`, error.message);
  }
}

// Process directory recursively
function processDirectory(dir) {
  const files = fs.readdirSync(dir);
  
  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory() && !file.includes('node_modules') && !file.startsWith('.')) {
      processDirectory(filePath);
    } else if ((file.endsWith('.js') || file.endsWith('.jsx')) && !file.includes('.test.')) {
      addHapticFeedbackToFile(filePath);
    }
  });
}

// Main execution
console.log('🔧 Starting Haptic Feedback Addition...\n');

const srcDir = path.join(__dirname, '..', 'src');
if (fs.existsSync(srcDir)) {
  processDirectory(srcDir);
  
  console.log('\n📊 Summary:');
  console.log(`Total files with haptic feedback added: ${totalFixed}`);
  
  if (fixedFiles.length > 0) {
    console.log('\n📝 Modified files:');
    fixedFiles.forEach(file => {
      console.log(`  - ${file}`);
    });
  }
  
  console.log('\n✨ Haptic feedback addition completed!');
  console.log('\n💡 Benefits:');
  console.log('  - Enhanced user experience with tactile feedback');
  console.log('  - Better accessibility for users with visual impairments');
  console.log('  - Modern mobile app feel with haptic responses');
} else {
  console.error('❌ Source directory not found!');
  process.exit(1);
} 