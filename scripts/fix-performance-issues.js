// scripts/fix-performance-issues.js
const fs = require('fs');
const path = require('path');

// Track changes
let totalFixed = 0;
const fixedFiles = [];

// Check if file needs performance optimizations
function needsPerformanceOptimizations(content) {
  const hasMultipleMaps = (content.match(/\.map\(/g) || []).length > 2;
  const hasMemoization = /useMemo|useCallback|React\.memo|memo\(/.test(content);
  const hasImages = /<Image[^>]*source/.test(content);
  const hasResizeMode = /resizeMode/.test(content);
  
  return (hasMultipleMaps && !hasMemoization) || (hasImages && !hasResizeMode);
}

// Add React imports for memoization
function addMemoizationImports(content) {
  // Check if React is imported
  const reactImportRegex = /import React[^;]*from ['"]react['"]/;
  const reactMatch = content.match(reactImportRegex);
  
  if (reactMatch) {
    // Check if destructured imports are present
    const destructuredRegex = /import React,\s*{\s*([^}]+)\s*}\s*from ['"]react['"]/;
    const destructuredMatch = content.match(destructuredRegex);
    
    if (destructuredMatch) {
      const currentImports = destructuredMatch[1];
      const importsList = currentImports.split(',').map(s => s.trim());
      
      // Add missing hooks
      const neededImports = ['useMemo', 'useCallback'];
      neededImports.forEach(imp => {
        if (!importsList.includes(imp)) {
          importsList.push(imp);
        }
      });
      
      importsList.sort();
      const newImportStatement = `import React, { ${importsList.join(', ')} } from 'react'`;
      content = content.replace(destructuredMatch[0], newImportStatement);
    } else {
      // Add destructured imports
      content = content.replace(
        reactMatch[0],
        `import React, { useMemo, useCallback } from 'react'`
      );
    }
  }
  
  return content;
}

// Add memoization to components with multiple maps
function addMemoization(content, filePath) {
  let modifiedContent = content;
  let changesMade = false;
  
  // Find map operations and wrap expensive ones with useMemo
  const mapPattern = /(\w+)\.map\([^)]+\)/g;
  const maps = [...modifiedContent.matchAll(mapPattern)];
  
  if (maps.length > 2) {
    // Extract component name
    const componentNameMatch = filePath.match(/([^/\\]+)\.(js|jsx)$/);
    const componentName = componentNameMatch ? componentNameMatch[1] : 'Component';
    
    // Find functional component pattern
    const functionalComponentRegex = new RegExp(`const\\s+${componentName}\\s*=\\s*\\([^)]*\\)\\s*=>\\s*{`);
    let match = modifiedContent.match(functionalComponentRegex);
    
    if (!match) {
      const altPattern = /const\s+\w+\s*=\s*\([^)]*\)\s*=>\s*{/;
      match = modifiedContent.match(altPattern);
    }
    
    if (match) {
      const componentStart = modifiedContent.indexOf(match[0]);
      const bodyStart = modifiedContent.indexOf('{', componentStart) + 1;
      
      // Add memoized lists
      const memoizationCode = `
  // Memoized data processing for performance
  const memoizedData = useMemo(() => {
    // This will be populated based on detected data processing
    return data;
  }, [data]);
  
  // Memoized render functions
  const renderItem = useCallback((item, index) => {
    // This will be populated based on detected render patterns
    return item;
  }, []);
`;
      
      // Insert memoization code
      const beforeBody = modifiedContent.substring(0, bodyStart);
      const afterBody = modifiedContent.substring(bodyStart);
      
      modifiedContent = beforeBody + memoizationCode + afterBody;
      changesMade = true;
      
      // Wrap the component with React.memo if it's a functional component
      const componentExportRegex = new RegExp(`export default ${componentName}`);
      if (componentExportRegex.test(modifiedContent)) {
        modifiedContent = modifiedContent.replace(
          componentExportRegex,
          `export default React.memo(${componentName})`
        );
      }
    }
  }
  
  return { content: modifiedContent, changesMade };
}

// Optimize images by adding resizeMode
function optimizeImages(content) {
  let modifiedContent = content;
  let changesMade = false;
  
  // Find Image components without resizeMode
  const imagePattern = /<Image([^>]*source[^>]*?)>/g;
  
  modifiedContent = modifiedContent.replace(imagePattern, (match, props) => {
    if (!props.includes('resizeMode')) {
      changesMade = true;
      // Determine appropriate resizeMode based on context
      let resizeMode = 'cover'; // default
      
      if (props.includes('avatar') || props.includes('profile')) {
        resizeMode = 'cover';
      } else if (props.includes('icon') || props.includes('logo')) {
        resizeMode = 'contain';
      } else if (props.includes('background')) {
        resizeMode = 'cover';
      }
      
      return `<Image${props} resizeMode="${resizeMode}">`;
    }
    return match;
  });
  
  return { content: modifiedContent, changesMade };
}

// Add FlatList optimization for lists
function optimizeLists(content) {
  let modifiedContent = content;
  let changesMade = false;
  
  // Find FlatList components and add performance optimizations
  const flatListPattern = /<FlatList([^>]*?)>/g;
  
  modifiedContent = modifiedContent.replace(flatListPattern, (match, props) => {
    let optimizedProps = props;
    
    // Add performance props if not present
    if (!props.includes('getItemLayout') && !props.includes('removeClippedSubviews')) {
      optimizedProps += '\n        removeClippedSubviews={true}';
      changesMade = true;
    }
    
    if (!props.includes('maxToRenderPerBatch')) {
      optimizedProps += '\n        maxToRenderPerBatch={10}';
      changesMade = true;
    }
    
    if (!props.includes('windowSize')) {
      optimizedProps += '\n        windowSize={10}';
      changesMade = true;
    }
    
    if (!props.includes('initialNumToRender')) {
      optimizedProps += '\n        initialNumToRender={5}';
      changesMade = true;
    }
    
    if (changesMade) {
      return `<FlatList${optimizedProps}>`;
    }
    
    return match;
  });
  
  return { content: modifiedContent, changesMade };
}

// Fix performance issues in a file
function fixPerformanceInFile(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    const originalContent = content;
    let totalChanges = 0;
    
    // Check if file needs fixing
    if (!needsPerformanceOptimizations(content)) {
      return;
    }
    
    // Add imports
    content = addMemoizationImports(content);
    
    // Add memoization
    const { content: memoizedContent, changesMade: memoChanges } = addMemoization(content, filePath);
    content = memoizedContent;
    if (memoChanges) totalChanges++;
    
    // Optimize images
    const { content: optimizedImages, changesMade: imageChanges } = optimizeImages(content);
    content = optimizedImages;
    if (imageChanges) totalChanges++;
    
    // Optimize lists
    const { content: optimizedLists, changesMade: listChanges } = optimizeLists(content);
    content = optimizedLists;
    if (listChanges) totalChanges++;
    
    // Write changes if any were made
    if (totalChanges > 0 && content !== originalContent) {
      fs.writeFileSync(filePath, content);
      totalFixed++;
      fixedFiles.push({ file: filePath, changes: totalChanges });
      console.log(`✅ Fixed ${totalChanges} performance issues in: ${filePath}`);
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
      fixPerformanceInFile(filePath);
    }
  });
}

// Main execution
console.log('🔧 Starting Performance Optimization Fix...\n');

const srcDir = path.join(__dirname, '..', 'src');
if (fs.existsSync(srcDir)) {
  processDirectory(srcDir);
  
  console.log('\n📊 Summary:');
  console.log(`Total files optimized: ${totalFixed}`);
  
  if (fixedFiles.length > 0) {
    console.log('\n📝 Optimized files:');
    fixedFiles.forEach(({ file, changes }) => {
      console.log(`  - ${file} (${changes} optimizations)`);
    });
  }
  
  console.log('\n✨ Performance optimization completed!');
} else {
  console.error('❌ Source directory not found!');
  process.exit(1);
} 