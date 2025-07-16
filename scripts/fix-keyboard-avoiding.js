// scripts/fix-keyboard-avoiding.js
const fs = require('fs');
const path = require('path');

// Track changes
let totalFixed = 0;
const fixedFiles = [];

// Check if file needs KeyboardAvoidingView
function needsKeyboardAvoidingView(content) {
  const hasTextInput = /<(TextInput|Input)[^>]*>/g.test(content);
  const hasKeyboardAvoidingView = /KeyboardAvoidingView/.test(content);
  const hasKeyboardAware = /KeyboardAware/.test(content);
  
  return hasTextInput && !hasKeyboardAvoidingView && !hasKeyboardAware;
}

// Add necessary imports
function addKeyboardAvoidingImports(content) {
  // Check if imports already exist
  if (content.includes('KeyboardAvoidingView')) {
    return content;
  }
  
  // Find React Native import line
  const importRegex = /import\s*{\s*([^}]+)\s*}\s*from\s*['"]react-native['"]/;
  const match = content.match(importRegex);
  
  if (match) {
    const currentImports = match[1];
    const importsList = currentImports.split(',').map(s => s.trim());
    
    // Add missing imports
    if (!importsList.includes('KeyboardAvoidingView')) {
      importsList.push('KeyboardAvoidingView');
    }
    if (!importsList.includes('Platform')) {
      importsList.push('Platform');
    }
    
    // Sort imports alphabetically
    importsList.sort();
    
    // Replace the import statement
    const newImportStatement = `import { ${importsList.join(', ')} } from 'react-native'`;
    content = content.replace(match[0], newImportStatement);
  }
  
  return content;
}

// Wrap component with KeyboardAvoidingView
function wrapWithKeyboardAvoidingView(content, filePath) {
  // Find the main return statement of the component
  const componentNameMatch = filePath.match(/([^/\\]+)\.(js|jsx)$/);
  const componentName = componentNameMatch ? componentNameMatch[1] : 'Component';
  
  // Pattern to find the return statement
  const returnPattern = /return\s*\(\s*(<[\s\S]+?>[\s\S]+?<\/[\s\S]+?>)\s*\)/g;
  
  let modifiedContent = content;
  let changesMade = false;
  
  modifiedContent = modifiedContent.replace(returnPattern, (match, jsx) => {
    // Check if it's already wrapped
    if (jsx.trim().startsWith('<KeyboardAvoidingView')) {
      return match;
    }
    
    changesMade = true;
    
    // Extract the root element
    const rootElementMatch = jsx.match(/^(\s*)<(\w+)/);
    const indent = rootElementMatch ? rootElementMatch[1] : '';
    
    // Wrap with KeyboardAvoidingView
    const wrapped = `return (
${indent}<KeyboardAvoidingView
${indent}  behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
${indent}  style={{ flex: 1 }}
${indent}  keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}
${indent}>
${jsx}
${indent}</KeyboardAvoidingView>
${indent})`;
    
    return wrapped;
  });
  
  return { content: modifiedContent, changesMade };
}

// Fix keyboard avoiding in a file
function fixKeyboardAvoidingInFile(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    const originalContent = content;
    
    // Check if file needs fixing
    if (!needsKeyboardAvoidingView(content)) {
      return;
    }
    
    // Add imports
    content = addKeyboardAvoidingImports(content);
    
    // Wrap with KeyboardAvoidingView
    const { content: wrappedContent, changesMade } = wrapWithKeyboardAvoidingView(content, filePath);
    content = wrappedContent;
    
    // Write changes if any were made
    if (changesMade && content !== originalContent) {
      fs.writeFileSync(filePath, content);
      totalFixed++;
      fixedFiles.push(filePath);
      console.log(`✅ Fixed keyboard avoiding in: ${filePath}`);
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
      fixKeyboardAvoidingInFile(filePath);
    }
  });
}

// Main execution
console.log('🔧 Starting Keyboard Avoiding View Fix...\n');

const srcDir = path.join(__dirname, '..', 'src');
if (fs.existsSync(srcDir)) {
  processDirectory(srcDir);
  
  console.log('\n📊 Summary:');
  console.log(`Total files fixed: ${totalFixed}`);
  
  if (fixedFiles.length > 0) {
    console.log('\n📝 Fixed files:');
    fixedFiles.forEach(file => {
      console.log(`  - ${file}`);
    });
  }
  
  console.log('\n✨ Keyboard avoiding view fix completed!');
} else {
  console.error('❌ Source directory not found!');
  process.exit(1);
} 