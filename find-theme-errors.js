#!/usr/bin/env node

// Quick script to find theme errors in bundle systematically
const https = require('http');

async function findThemeErrors() {
  console.log('🔍 Finding theme errors in bundle...');
  
  try {
    const bundleUrl = 'http://localhost:8081/node_modules/expo/AppEntry.bundle?platform=web&dev=true&hot=false&transform.engine=hermes&transform.routerRoot=app&unstable_transformProfile=hermes-stable';
    
    const response = await fetch(bundleUrl);
    const bundleContent = await response.text();
    
    console.log(`Bundle size: ${bundleContent.length} characters`);
    
    // Look for "theme is not defined" and surrounding context
    const lines = bundleContent.split('\n');
    
    // Search for direct theme references in StyleSheet contexts
    const themePatterns = [
      /color:\s*theme\.colors/g,
      /backgroundColor:\s*theme\.colors/g,  
      /shadowColor:\s*theme\.colors/g,
      /borderColor:\s*theme\.colors/g,
      /[^a-zA-Z_]theme\.colors[^.]/g
    ];
    
    let foundErrors = [];
    
    themePatterns.forEach((pattern, patternIndex) => {
      let match;
      while ((match = pattern.exec(bundleContent)) !== null) {
        const position = match.index;
        const lineNumber = bundleContent.substring(0, position).split('\n').length;
        
        // Get context around the match
        const start = Math.max(0, position - 200);
        const end = Math.min(bundleContent.length, position + 200);
        const context = bundleContent.substring(start, end);
        
        // Check if this looks like a StyleSheet definition (not inline style)
        if (context.includes('StyleSheet.create') || 
            (context.includes('{') && context.includes('}') && !context.includes('style={{'))) {
          
          foundErrors.push({
            pattern: pattern.source,
            line: lineNumber,
            match: match[0],
            context: context.substring(0, 100) + '...'
          });
        }
      }
    });
    
    if (foundErrors.length > 0) {
      console.log('\n🚨 Found potential theme errors in StyleSheets:');
      foundErrors.forEach((error, index) => {
        console.log(`${index + 1}. Line ~${error.line}: ${error.match}`);
        console.log(`   Context: ${error.context}`);
        console.log('');
      });
    } else {
      console.log('✅ No obvious StyleSheet theme errors found');
    }
    
    // Also check for the specific error location from the browser
    console.log('\n🎯 Checking for current ReferenceError location...');
    
  } catch (error) {
    console.error('❌ Error analyzing bundle:', error.message);
  }
}

// Use a simpler approach with curl if fetch isn't available
console.log('Please run: curl -s "http://localhost:8081/node_modules/expo/AppEntry.bundle?platform=web&dev=true&hot=false&transform.engine=hermes&transform.routerRoot=app&unstable_transformProfile=hermes-stable" | grep -n "theme\.colors" | head -20');