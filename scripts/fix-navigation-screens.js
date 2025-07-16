// scripts/fix-navigation-screens.js
const fs = require('fs');
const path = require('path');

// Track changes
let totalFixed = 0;
const fixedFiles = [];

// Check if file is a screen component that needs navigation
function needsNavigationFix(content, filePath) {
  const isScreen = filePath.includes('Screen');
  const hasNavigation = /navigation\.goBack|HeaderBackButton|useFocusEffect/.test(content);
  const hasNavigationProp = /navigation[\s\S]*=[\s\S]*{/.test(content);
  
  return isScreen && !hasNavigation && hasNavigationProp;
}

// Add navigation imports if needed
function addNavigationImports(content) {
  // Check if we need to add navigation hook import
  if (!content.includes('useNavigation') && !content.includes('navigation')) {
    // Find @react-navigation imports
    const navImportRegex = /import\s*{\s*([^}]+)\s*}\s*from\s*['"]@react-navigation\/native['"]/;
    const match = content.match(navImportRegex);
    
    if (match) {
      const currentImports = match[1];
      const importsList = currentImports.split(',').map(s => s.trim());
      
      if (!importsList.includes('useNavigation')) {
        importsList.push('useNavigation');
        importsList.sort();
        
        const newImportStatement = `import { ${importsList.join(', ')} } from '@react-navigation/native'`;
        content = content.replace(match[0], newImportStatement);
      }
    } else {
      // Add new import after React import
      const reactImportRegex = /import React[^;]+;/;
      const reactMatch = content.match(reactImportRegex);
      if (reactMatch) {
        content = content.replace(
          reactMatch[0],
          `${reactMatch[0]}\nimport { useNavigation } from '@react-navigation/native';`
        );
      }
    }
  }
  
  return content;
}

// Add navigation handling to component
function addNavigationHandling(content, filePath) {
  // Extract component name
  const componentNameMatch = filePath.match(/([^/\\]+)Screen\.(js|jsx)$/);
  const screenName = componentNameMatch ? componentNameMatch[1] : 'Screen';
  
  // Check if it's a functional component
  const functionalComponentRegex = new RegExp(`const\\s+${screenName}Screen\\s*=\\s*\\([^)]*\\)\\s*=>\\s*{`);
  const match = content.match(functionalComponentRegex);
  
  if (!match) {
    // Try alternative patterns
    const altPattern = /const\s+\w+Screen\s*=\s*\([^)]*\)\s*=>\s*{/;
    const altMatch = content.match(altPattern);
    if (!altMatch) return { content, changesMade: false };
  }
  
  // Find the component body start
  const componentStart = content.indexOf(match ? match[0] : content.match(/const\s+\w+Screen\s*=\s*\([^)]*\)\s*=>\s*{/)[0]);
  const bodyStart = content.indexOf('{', componentStart) + 1;
  
  // Check if component already has navigation prop in params
  const hasNavigationParam = /\(\s*{\s*[^}]*navigation[^}]*}\s*\)/.test(match ? match[0] : '');
  
  let navigationSetup = '';
  if (!hasNavigationParam) {
    navigationSetup = '\n  const navigation = useNavigation();';
  }
  
  // Add navigation handling
  const navigationHandling = `${navigationSetup}

  // Handle hardware back button on Android
  React.useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      () => {
        if (navigation.canGoBack()) {
          navigation.goBack();
          return true;
        }
        return false;
      }
    );

    return () => backHandler.remove();
  }, [navigation]);
`;
  
  // Insert after the component body start
  const beforeBody = content.substring(0, bodyStart);
  const afterBody = content.substring(bodyStart);
  
  // Check if we need BackHandler import
  if (!content.includes('BackHandler')) {
    const rnImportRegex = /import\s*{\s*([^}]+)\s*}\s*from\s*['"]react-native['"]/;
    const rnMatch = content.match(rnImportRegex);
    
    if (rnMatch) {
      const currentImports = rnMatch[1];
      const importsList = currentImports.split(',').map(s => s.trim());
      importsList.push('BackHandler');
      importsList.sort();
      
      const newImportStatement = `import { ${importsList.join(', ')} } from 'react-native'`;
      content = content.replace(rnMatch[0], newImportStatement);
    }
  }
  
  const modifiedContent = beforeBody + navigationHandling + afterBody;
  
  return { content: modifiedContent, changesMade: true };
}

// Fix navigation in a file
function fixNavigationInFile(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    const originalContent = content;
    
    // Check if file needs fixing
    if (!needsNavigationFix(content, filePath)) {
      return;
    }
    
    // Add imports
    content = addNavigationImports(content);
    
    // Add navigation handling
    const { content: modifiedContent, changesMade } = addNavigationHandling(content, filePath);
    content = modifiedContent;
    
    // Write changes if any were made
    if (changesMade && content !== originalContent) {
      fs.writeFileSync(filePath, content);
      totalFixed++;
      fixedFiles.push(filePath);
      console.log(`✅ Fixed navigation in: ${filePath}`);
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
    } else if ((file.endsWith('.js') || file.endsWith('.jsx')) && file.includes('Screen') && !file.includes('.test.')) {
      fixNavigationInFile(filePath);
    }
  });
}

// Main execution
console.log('🔧 Starting Navigation Screen Fix...\n');

const srcDir = path.join(__dirname, '..', 'src');
if (fs.existsSync(srcDir)) {
  processDirectory(srcDir);
  
  console.log('\n📊 Summary:');
  console.log(`Total screens fixed: ${totalFixed}`);
  
  if (fixedFiles.length > 0) {
    console.log('\n📝 Fixed screens:');
    fixedFiles.forEach(file => {
      console.log(`  - ${file}`);
    });
  }
  
  console.log('\n✨ Navigation screen fix completed!');
} else {
  console.error('❌ Source directory not found!');
  process.exit(1);
} 