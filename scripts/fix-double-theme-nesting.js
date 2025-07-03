#!/usr/bin/env node

/**
 * Fix Double Theme Nesting Script
 * This script automatically fixes theme.theme.colors to theme.colors
 */

const fs = require('fs');
const path = require('path');

// Helper function to recursively find all JS files
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

// Fix double theme nesting in a file
const fixDoubleThemeNesting = (filePath) => {
  const content = fs.readFileSync(filePath, 'utf8');
  const originalContent = content;
  
  // Replace theme.theme.colors with theme.colors
  const fixedContent = content.replace(/theme\.theme\.colors/g, 'theme.colors');
  
  if (fixedContent !== originalContent) {
    fs.writeFileSync(filePath, fixedContent, 'utf8');
    const relativePath = path.relative(process.cwd(), filePath);
    console.log(`✅ Fixed: ${relativePath}`);
    return true;
  }
  
  return false;
};

// Main function
const main = () => {
  console.log('🔧 Fixing Double Theme Nesting Issues\n');
  
  const srcDir = path.join(__dirname, '..', 'src');
  const jsFiles = findJSFiles(srcDir);
  
  let fixedCount = 0;
  
  jsFiles.forEach(filePath => {
    if (fixDoubleThemeNesting(filePath)) {
      fixedCount++;
    }
  });
  
  console.log(`\n🎉 Fixed ${fixedCount} files with double theme nesting issues.`);
  
  if (fixedCount > 0) {
    console.log('\n✅ All theme.theme.colors have been replaced with theme.colors');
    console.log('💡 You should now run the comprehensive test again to verify the fixes.');
  } else {
    console.log('\n✅ No double theme nesting issues found.');
  }
};

main();
