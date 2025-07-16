// scripts/fix-loading-states.js
const fs = require('fs');
const path = require('path');

// Track changes
let totalFixed = 0;
const fixedFiles = [];

// Check if file needs loading states
function needsLoadingStates(content) {
  const hasAsync = /async\s+[\w]+|\.then\(|await\s+|fetch\(|axios\./g.test(content);
  const hasLoading = /isLoading|loading|ActivityIndicator|Skeleton|LoadingSpinner/i.test(content);
  
  return hasAsync && !hasLoading;
}

// Add ActivityIndicator import
function addActivityIndicatorImport(content) {
  if (content.includes('ActivityIndicator')) {
    return content;
  }
  
  const rnImportRegex = /import\s*{\s*([^}]+)\s*}\s*from\s*['"]react-native['"]/;
  const match = content.match(rnImportRegex);
  
  if (match) {
    const currentImports = match[1];
    const importsList = currentImports.split(',').map(s => s.trim());
    
    if (!importsList.includes('ActivityIndicator')) {
      importsList.push('ActivityIndicator');
      importsList.sort();
      
      const newImportStatement = `import { ${importsList.join(', ')} } from 'react-native'`;
      content = content.replace(match[0], newImportStatement);
    }
  }
  
  return content;
}

// Add loading state to component
function addLoadingState(content, filePath) {
  let modifiedContent = content;
  let changesMade = false;
  
  // Extract component name
  const componentNameMatch = filePath.match(/([^/\\]+)\.(js|jsx)$/);
  const componentName = componentNameMatch ? componentNameMatch[1] : 'Component';
  
  // Find functional component pattern
  const functionalComponentRegex = new RegExp(`const\\s+${componentName}\\s*=\\s*\\([^)]*\\)\\s*=>\\s*{`);
  let match = modifiedContent.match(functionalComponentRegex);
  
  if (!match) {
    // Try alternative patterns
    const altPattern = /const\s+\w+\s*=\s*\([^)]*\)\s*=>\s*{/;
    match = modifiedContent.match(altPattern);
  }
  
  if (match) {
    const componentStart = modifiedContent.indexOf(match[0]);
    const bodyStart = modifiedContent.indexOf('{', componentStart) + 1;
    
    // Add loading state hook
    const loadingStateHook = `
  const [isLoading, setIsLoading] = React.useState(false);
`;
    
    // Insert after component body start
    const beforeBody = modifiedContent.substring(0, bodyStart);
    const afterBody = modifiedContent.substring(bodyStart);
    
    modifiedContent = beforeBody + loadingStateHook + afterBody;
    changesMade = true;
    
    // Find async operations and wrap them with loading states
    const asyncPatterns = [
      /const\s+(\w+)\s*=\s*async\s*\([^)]*\)\s*=>\s*{/g,
      /const\s+(\w+)\s*=\s*\([^)]*\)\s*=>\s*{[^}]*await/g,
      /const\s+(\w+)\s*=\s*\([^)]*\)\s*=>\s*{[^}]*fetch\(/g
    ];
    
    asyncPatterns.forEach(pattern => {
      modifiedContent = modifiedContent.replace(pattern, (match, funcName) => {
        if (match.includes('setIsLoading')) {
          return match; // Already has loading state
        }
        
        const funcStart = match;
        const bodyStartIndex = match.indexOf('{') + 1;
        const beforeFuncBody = match.substring(0, bodyStartIndex);
        const afterFuncBody = match.substring(bodyStartIndex);
        
        const loadingWrapper = `
    setIsLoading(true);
    try {${afterFuncBody}
    } catch (error) {
      console.error('Error in ${funcName}:', error);
    } finally {
      setIsLoading(false);
    }`;
        
        return beforeFuncBody + loadingWrapper;
      });
    });
    
    // Add loading indicator to JSX return
    const returnPattern = /return\s*\(\s*(<[\s\S]+?>[\s\S]+?<\/[\s\S]+?>)\s*\)/;
    const returnMatch = modifiedContent.match(returnPattern);
    
    if (returnMatch) {
      const jsxContent = returnMatch[1];
      
      // Add loading check before main content
      const loadingWrapper = `return (
    <>
      {isLoading && (
        <View style={{ 
          position: 'absolute', 
          top: 0, 
          left: 0, 
          right: 0, 
          bottom: 0, 
          justifyContent: 'center', 
          alignItems: 'center', 
          backgroundColor: 'rgba(255, 255, 255, 0.8)',
          zIndex: 1000 
        }}>
          <ActivityIndicator size="large" color="#007AFF" />
        </View>
      )}
      ${jsxContent}
    </>
  )`;
      
      modifiedContent = modifiedContent.replace(returnMatch[0], loadingWrapper);
    }
  }
  
  return { content: modifiedContent, changesMade };
}

// Fix loading states in a file
function fixLoadingStatesInFile(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    const originalContent = content;
    
    // Check if file needs fixing
    if (!needsLoadingStates(content)) {
      return;
    }
    
    // Add imports
    content = addActivityIndicatorImport(content);
    
    // Add loading state
    const { content: modifiedContent, changesMade } = addLoadingState(content, filePath);
    content = modifiedContent;
    
    // Write changes if any were made
    if (changesMade && content !== originalContent) {
      fs.writeFileSync(filePath, content);
      totalFixed++;
      fixedFiles.push(filePath);
      console.log(`✅ Fixed loading states in: ${filePath}`);
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
      fixLoadingStatesInFile(filePath);
    }
  });
}

// Main execution
console.log('🔧 Starting Loading States Fix...\n');

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
  
  console.log('\n✨ Loading states fix completed!');
} else {
  console.error('❌ Source directory not found!');
  process.exit(1);
} 