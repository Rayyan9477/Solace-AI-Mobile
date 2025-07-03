#!/usr/bin/env node

/**
 * Comprehensive Theme System Test
 * This script validates the entire theme implementation across all components
 */

const fs = require('fs');
const path = require('path');

console.log('🎨 Comprehensive Theme System Validation\n');

// Helper function to recursively find all JS files in components
const findComponentFiles = (dir, fileList = []) => {
  const files = fs.readdirSync(dir);
  
  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory()) {
      findComponentFiles(filePath, fileList);
    } else if (file.endsWith('.js') && !file.includes('.test.')) {
      fileList.push(filePath);
    }
  });
  
  return fileList;
};

// Check for theme consistency issues
const checkThemeConsistency = (content, filePath) => {
  const issues = [];
  
  // Check for old theme usage patterns
  if (content.includes('currentTheme.')) {
    issues.push('❌ Uses deprecated currentTheme pattern');
  }
  
  if (content.includes('colors.') && !content.includes('theme.colors.')) {
    const matches = content.match(/colors\.\w+/g);
    if (matches) {
      issues.push(`❌ Direct colors import detected: ${matches.join(', ')}`);
    }
  }
  
  if (content.includes('theme.theme.colors')) {
    issues.push('❌ Double theme nesting detected (theme.theme.colors)');
  }
  
  // Check for proper theme hook usage
  if (content.includes('import') && content.includes('useTheme') && !content.includes("import { useTheme } from '../../contexts/ThemeContext'")) {
    if (content.includes("from '../contexts/ThemeContext'") || content.includes("from '../../contexts/ThemeContext'")) {
      // This is OK - different levels
    } else {
      issues.push('⚠️  useTheme import path may be incorrect');
    }
  }
  
  // Check for hardcoded colors (common patterns)
  const hardcodedPatterns = [
    /#[0-9A-Fa-f]{6}/g, // Hex colors like #FFFFFF
    /#[0-9A-Fa-f]{3}/g,  // Short hex colors like #FFF
    /rgb\(/g,            // RGB colors
    /rgba\(/g,           // RGBA colors
  ];
  
  hardcodedPatterns.forEach(pattern => {
    const matches = content.match(pattern);
    if (matches) {
      const uniqueMatches = [...new Set(matches)];
      if (uniqueMatches.length > 0) {
        issues.push(`⚠️  Hardcoded colors detected: ${uniqueMatches.join(', ')}`);
      }
    }
  });
  
  return issues;
};

// Check for required theme structure
const checkThemeStructure = () => {
  console.log('📋 Checking theme structure...');
  
  const themePath = path.join(__dirname, '..', 'src', 'styles', 'theme.js');
  if (!fs.existsSync(themePath)) {
    console.log('❌ theme.js not found');
    return false;
  }
  
  const themeContent = fs.readFileSync(themePath, 'utf8');
  
  const requiredStructures = [
    'export const colors',
    'export const typography',
    'export const spacing',
    'export const borderRadius',
    'export const shadows',
    'export const lightTheme',
    'export const darkTheme',
    'primary:',
    'secondary:',
    'mood:',
    'therapeutic:',
    'background:',
    'text:',
    'border:'
  ];
  
  const missingStructures = requiredStructures.filter(structure => 
    !themeContent.includes(structure)
  );
  
  if (missingStructures.length === 0) {
    console.log('✅ Theme structure is complete');
    return true;
  } else {
    console.log('❌ Missing theme structures:', missingStructures);
    return false;
  }
};

// Check ThemeContext implementation
const checkThemeContext = () => {
  console.log('📋 Checking ThemeContext...');
  
  const contextPath = path.join(__dirname, '..', 'src', 'contexts', 'ThemeContext.js');
  if (!fs.existsSync(contextPath)) {
    console.log('❌ ThemeContext.js not found');
    return false;
  }
  
  const contextContent = fs.readFileSync(contextPath, 'utf8');
  
  const requiredFeatures = [
    'useTheme',
    'ThemeProvider',
    'toggleTheme',
    'setTheme',
    'isDarkMode',
    'AsyncStorage',
    'useColorScheme',
    'lightTheme',
    'darkTheme'
  ];
  
  const missingFeatures = requiredFeatures.filter(feature => 
    !contextContent.includes(feature)
  );
  
  if (missingFeatures.length === 0) {
    console.log('✅ ThemeContext implementation is complete');
    return true;
  } else {
    console.log('❌ Missing ThemeContext features:', missingFeatures);
    return false;
  }
};

// Main validation
const main = () => {
  let allPassed = true;
  
  // Check core theme files
  if (!checkThemeStructure()) allPassed = false;
  if (!checkThemeContext()) allPassed = false;
  
  console.log('\n📱 Checking component implementations...');
  
  const componentsDir = path.join(__dirname, '..', 'src', 'components');
  if (!fs.existsSync(componentsDir)) {
    console.log('❌ Components directory not found');
    return false;
  }
  
  const componentFiles = findComponentFiles(componentsDir);
  console.log(`Found ${componentFiles.length} component files`);
  
  let totalIssues = 0;
  const componentResults = [];
  
  componentFiles.forEach(filePath => {
    const relativePath = path.relative(process.cwd(), filePath);
    const content = fs.readFileSync(filePath, 'utf8');
    const issues = checkThemeConsistency(content, filePath);
    
    const result = {
      file: relativePath,
      issues: issues,
      status: issues.length === 0 ? '✅' : issues.some(i => i.includes('❌')) ? '❌' : '⚠️'
    };
    
    componentResults.push(result);
    totalIssues += issues.length;
  });
  
  // Display results
  console.log('\n📊 Component Analysis Results:');
  console.log('================================');
  
  const passedComponents = componentResults.filter(r => r.status === '✅');
  const warningComponents = componentResults.filter(r => r.status === '⚠️');
  const failedComponents = componentResults.filter(r => r.status === '❌');
  
  console.log(`✅ Passed: ${passedComponents.length}`);
  console.log(`⚠️  Warnings: ${warningComponents.length}`);
  console.log(`❌ Failed: ${failedComponents.length}`);
  console.log(`📊 Total Issues: ${totalIssues}\n`);
  
  // Show detailed results for failed/warning components
  [...failedComponents, ...warningComponents].forEach(result => {
    console.log(`${result.status} ${result.file}`);
    result.issues.forEach(issue => {
      console.log(`   ${issue}`);
    });
    console.log('');
  });
  
  // Check screens directory too
  const screensDir = path.join(__dirname, '..', 'src', 'screens');
  if (fs.existsSync(screensDir)) {
    console.log('🖥️  Checking screen implementations...');
    const screenFiles = findComponentFiles(screensDir);
    
    screenFiles.forEach(filePath => {
      const relativePath = path.relative(process.cwd(), filePath);
      const content = fs.readFileSync(filePath, 'utf8');
      const issues = checkThemeConsistency(content, filePath);
      
      if (issues.length > 0) {
        console.log(`⚠️  ${relativePath}`);
        issues.forEach(issue => {
          console.log(`   ${issue}`);
        });
      } else {
        console.log(`✅ ${relativePath}`);
      }
    });
  }
  
  // Summary and recommendations
  console.log('\n🎯 Summary and Recommendations:');
  console.log('================================');
  
  if (totalIssues === 0 && allPassed) {
    console.log('🎉 Perfect! Theme system is fully implemented and consistent.');
    console.log('✅ All components are using the new theme system correctly.');
    console.log('✅ No hardcoded colors or deprecated patterns found.');
    console.log('✅ Theme structure is complete and well-organized.');
  } else {
    console.log('🔧 Issues found that need attention:');
    
    if (failedComponents.length > 0) {
      console.log(`❌ ${failedComponents.length} components have critical issues`);
    }
    
    if (warningComponents.length > 0) {
      console.log(`⚠️  ${warningComponents.length} components have warnings`);
    }
    
    console.log('\n💡 Recommended actions:');
    console.log('1. Fix critical issues (❌) first');
    console.log('2. Replace hardcoded colors with theme colors');
    console.log('3. Update deprecated currentTheme usage to theme.colors');
    console.log('4. Remove any double theme nesting');
    console.log('5. Ensure all components import useTheme correctly');
  }
  
  console.log('\n🚀 Next Steps:');
  console.log('- Run this script after fixing issues to verify improvements');
  console.log('- Test the app in both light and dark modes');
  console.log('- Use ThemeShowcaseScreen to verify visual consistency');
  console.log('- Test accessibility with screen readers');
  
  return allPassed && totalIssues === 0;
};

// Run the validation
const success = main();
process.exit(success ? 0 : 1);
