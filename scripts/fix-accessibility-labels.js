// scripts/fix-accessibility-labels.js
const fs = require('fs');
const path = require('path');

// Track changes made
let totalFixed = 0;
const fixedFiles = [];

// Helper to extract meaningful label from component context
function generateAccessibilityLabel(touchableContent, filePath) {
  // Extract text content from the touchable
  const textMatches = touchableContent.match(/<Text[^>]*>([^<]+)<\/Text>/);
  const titleMatch = touchableContent.match(/title=["']([^"']+)["']/);
  
  if (textMatches && textMatches[1]) {
    return textMatches[1].trim();
  } else if (titleMatch && titleMatch[1]) {
    return titleMatch[1].trim();
  } else {
    // Generate from context
    const onPressMatch = touchableContent.match(/onPress=\{(?:handle)?(\w+)\}/);
    if (onPressMatch && onPressMatch[1]) {
      // Convert camelCase to readable text
      return onPressMatch[1]
        .replace(/([A-Z])/g, ' $1')
        .trim()
        .toLowerCase()
        .replace(/^./, str => str.toUpperCase());
    }
  }
  
  return 'Button'; // Default fallback
}

// Helper to generate hint based on component type
function generateAccessibilityHint(label) {
  const lowerLabel = label.toLowerCase();
  
  if (lowerLabel.includes('submit') || lowerLabel.includes('save')) {
    return 'Double tap to submit';
  } else if (lowerLabel.includes('delete') || lowerLabel.includes('remove')) {
    return 'Double tap to delete';
  } else if (lowerLabel.includes('edit') || lowerLabel.includes('update')) {
    return 'Double tap to edit';
  } else if (lowerLabel.includes('profile') || lowerLabel.includes('settings')) {
    return 'Double tap to open';
  } else if (lowerLabel.includes('emergency') || lowerLabel.includes('help')) {
    return 'Double tap to get help';
  }
  
  return 'Double tap to activate';
}

// Fix touchable elements in a file
function fixAccessibilityInFile(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    const originalContent = content;
    let changesMade = 0;
    
    // Regex to match touchable components without accessibility props
    const touchablePattern = /<(TouchableOpacity|TouchableHighlight|TouchableWithoutFeedback|Pressable)([^>]*?)(\/>|>)/g;
    
    content = content.replace(touchablePattern, (match, componentName, props, closing) => {
      // Check if already has accessibility props
      if (props.includes('accessibilityLabel') || props.includes('accessible=')) {
        return match;
      }
      
      // Extract the full component including children
      let fullComponent = match;
      let endTagIndex = -1;
      
      if (closing === '>') {
        // Find the closing tag
        const startIndex = content.indexOf(match);
        const componentRegex = new RegExp(`</${componentName}>`, 'g');
        componentRegex.lastIndex = startIndex + match.length;
        const endMatch = componentRegex.exec(content);
        if (endMatch) {
          endTagIndex = endMatch.index + endMatch[0].length;
          fullComponent = content.substring(startIndex, endTagIndex);
        }
      }
      
      // Generate accessibility props
      const label = generateAccessibilityLabel(fullComponent, filePath);
      const hint = generateAccessibilityHint(label);
      
      // Insert accessibility props
      const accessibilityProps = `\n        accessible={true}\n        accessibilityRole="button"\n        accessibilityLabel="${label}"\n        accessibilityHint="${hint}"`;
      
      // Insert before the closing bracket
      if (closing === '/>') {
        changesMade++;
        return match.replace('/>', accessibilityProps + '\n      />');
      } else {
        changesMade++;
        return match.replace('>', accessibilityProps + '\n      >');
      }
    });
    
    // Only write if changes were made
    if (changesMade > 0 && content !== originalContent) {
      fs.writeFileSync(filePath, content);
      totalFixed += changesMade;
      fixedFiles.push({ file: filePath, count: changesMade });
      console.log(`✅ Fixed ${changesMade} accessibility issues in: ${filePath}`);
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
      fixAccessibilityInFile(filePath);
    }
  });
}

// Main execution
console.log('🔧 Starting Accessibility Label Fix...\n');

const srcDir = path.join(__dirname, '..', 'src');
if (fs.existsSync(srcDir)) {
  processDirectory(srcDir);
  
  console.log('\n📊 Summary:');
  console.log(`Total accessibility labels added: ${totalFixed}`);
  console.log(`Files modified: ${fixedFiles.length}`);
  
  if (fixedFiles.length > 0) {
    console.log('\n📝 Modified files:');
    fixedFiles.forEach(({ file, count }) => {
      console.log(`  - ${file} (${count} fixes)`);
    });
  }
  
  console.log('\n✨ Accessibility labels fix completed!');
} else {
  console.error('❌ Source directory not found!');
  process.exit(1);
} 