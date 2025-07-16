// scripts/analyze-ui-ux-issues.js
const fs = require('fs');
const path = require('path');

const UI_UX_ISSUES = [];

// UI/UX Analysis Rules
const ANALYSIS_RULES = {
  accessibility: {
    checkAriaLabels: (content, filePath) => {
      // Check for missing accessibility labels on interactive elements
      const touchablePattern = /<(TouchableOpacity|TouchableHighlight|TouchableWithoutFeedback|Pressable|Button)[^>]*>/g;
      const matches = content.match(touchablePattern) || [];
      
      matches.forEach(match => {
        if (!match.includes('accessibilityLabel') && !match.includes('accessible')) {
          UI_UX_ISSUES.push({
            type: 'ACCESSIBILITY',
            severity: 'HIGH',
            file: filePath,
            issue: 'Missing accessibility label on touchable element',
            recommendation: 'Add accessibilityLabel prop to make the element accessible to screen readers',
            snippet: match.substring(0, 100) + '...'
          });
        }
      });
    },
    
    checkAccessibilityRole: (content, filePath) => {
      // Check for missing accessibility roles
      const interactiveElements = /<(View|ScrollView|FlatList)[^>]*onPress/g;
      const matches = content.match(interactiveElements) || [];
      
      matches.forEach(match => {
        if (!match.includes('accessibilityRole')) {
          UI_UX_ISSUES.push({
            type: 'ACCESSIBILITY',
            severity: 'MEDIUM',
            file: filePath,
            issue: 'Interactive View without accessibility role',
            recommendation: 'Add accessibilityRole="button" to Views with onPress handlers',
            snippet: match.substring(0, 100) + '...'
          });
        }
      });
    }
  },
  
  touchTargets: {
    checkMinimumSize: (content, filePath) => {
      // Check for small touch targets (less than 44x44)
      const stylePattern = /height:\s*(\d+)|width:\s*(\d+)/g;
      const touchablePattern = /<(TouchableOpacity|TouchableHighlight|Pressable)[^>]*style/g;
      
      const touchables = content.match(touchablePattern) || [];
      touchables.forEach(touchable => {
        const nearbyStyles = content.substring(
          content.indexOf(touchable), 
          content.indexOf(touchable) + 200
        );
        
        const heights = nearbyStyles.match(/height:\s*(\d+)/g) || [];
        const widths = nearbyStyles.match(/width:\s*(\d+)/g) || [];
        
        heights.forEach(h => {
          const height = parseInt(h.match(/\d+/)[0]);
          if (height < 44) {
            UI_UX_ISSUES.push({
              type: 'TOUCH_TARGET',
              severity: 'HIGH',
              file: filePath,
              issue: `Touch target height too small (${height}px)`,
              recommendation: 'Minimum touch target size should be 44x44 pixels for accessibility',
              snippet: touchable.substring(0, 100) + '...'
            });
          }
        });
      });
    }
  },
  
  loading: {
    checkLoadingStates: (content, filePath) => {
      // Check for async operations without loading states
      const asyncPattern = /async\s+[\w]+|\.then\(|await\s+/g;
      const loadingPattern = /isLoading|loading|ActivityIndicator|Skeleton/i;
      
      if (content.match(asyncPattern) && !content.match(loadingPattern)) {
        UI_UX_ISSUES.push({
          type: 'LOADING_STATE',
          severity: 'MEDIUM',
          file: filePath,
          issue: 'Async operations without loading indicators',
          recommendation: 'Add loading states to provide feedback during async operations',
          snippet: 'File contains async operations but no loading indicators'
        });
      }
    }
  },
  
  errorHandling: {
    checkErrorStates: (content, filePath) => {
      // Check for error handling in components
      const catchPattern = /\.catch\(|try\s*{|error\s*\?|isError/g;
      const errorUIPattern = /error|Error|Alert\.alert/g;
      
      if (content.includes('fetch(') || content.includes('axios')) {
        if (!content.match(catchPattern)) {
          UI_UX_ISSUES.push({
            type: 'ERROR_HANDLING',
            severity: 'HIGH',
            file: filePath,
            issue: 'Network requests without error handling',
            recommendation: 'Add try-catch blocks and error UI states for network requests',
            snippet: 'Network requests found without proper error handling'
          });
        }
      }
    }
  },
  
  performance: {
    checkMemoization: (content, filePath) => {
      // Check for missing memoization in expensive operations
      const mapPattern = /\.map\(/g;
      const memoPattern = /useMemo|useCallback|React\.memo|memo\(/;
      
      const mapCount = (content.match(mapPattern) || []).length;
      if (mapCount > 3 && !content.match(memoPattern)) {
        UI_UX_ISSUES.push({
          type: 'PERFORMANCE',
          severity: 'MEDIUM',
          file: filePath,
          issue: 'Multiple map operations without memoization',
          recommendation: 'Consider using React.memo, useMemo, or useCallback for performance optimization',
          snippet: `Found ${mapCount} map operations without memoization`
        });
      }
    },
    
    checkImageOptimization: (content, filePath) => {
      // Check for unoptimized images
      const imagePattern = /<Image[^>]*source/g;
      const images = content.match(imagePattern) || [];
      
      images.forEach(img => {
        if (!img.includes('resizeMode')) {
          UI_UX_ISSUES.push({
            type: 'PERFORMANCE',
            severity: 'LOW',
            file: filePath,
            issue: 'Image without resizeMode specified',
            recommendation: 'Add resizeMode prop to optimize image rendering',
            snippet: img.substring(0, 100) + '...'
          });
        }
      });
    }
  },
  
  userFeedback: {
    checkHapticFeedback: (content, filePath) => {
      // Check for missing haptic feedback on important actions
      const importantActions = /onPress.*=.*{[^}]*(submit|save|delete|confirm)/gi;
      const hapticPattern = /HapticFeedback|Haptics|vibrate/;
      
      if (content.match(importantActions) && !content.match(hapticPattern)) {
        UI_UX_ISSUES.push({
          type: 'USER_FEEDBACK',
          severity: 'LOW',
          file: filePath,
          issue: 'Important actions without haptic feedback',
          recommendation: 'Add haptic feedback for important user actions to improve UX',
          snippet: 'Important actions detected without haptic feedback'
        });
      }
    }
  },
  
  navigation: {
    checkBackButton: (content, filePath) => {
      // Check for screens without back button handling
      if (filePath.includes('Screen') && !content.includes('HeaderBackButton') && !content.includes('goBack')) {
        UI_UX_ISSUES.push({
          type: 'NAVIGATION',
          severity: 'MEDIUM',
          file: filePath,
          issue: 'Screen component without back navigation',
          recommendation: 'Ensure proper back navigation is implemented',
          snippet: 'Screen component without back button handling'
        });
      }
    }
  },
  
  forms: {
    checkKeyboardAvoidance: (content, filePath) => {
      // Check for forms without keyboard avoiding view
      const formPattern = /<(TextInput|Input)[^>]*>/g;
      const keyboardPattern = /KeyboardAvoidingView|KeyboardAware/;
      
      if (content.match(formPattern) && !content.match(keyboardPattern)) {
        UI_UX_ISSUES.push({
          type: 'FORMS',
          severity: 'HIGH',
          file: filePath,
          issue: 'Form inputs without keyboard avoiding behavior',
          recommendation: 'Wrap forms in KeyboardAvoidingView to prevent keyboard overlap',
          snippet: 'TextInput found without KeyboardAvoidingView'
        });
      }
    },
    
    checkInputValidation: (content, filePath) => {
      // Check for inputs without validation
      const inputPattern = /<(TextInput|Input)[^>]*>/g;
      const validationPattern = /validate|validation|error|isValid/i;
      
      const inputs = content.match(inputPattern) || [];
      if (inputs.length > 0 && !content.match(validationPattern)) {
        UI_UX_ISSUES.push({
          type: 'FORMS',
          severity: 'MEDIUM',
          file: filePath,
          issue: 'Form inputs without validation',
          recommendation: 'Add input validation to provide immediate feedback to users',
          snippet: 'Input fields found without validation logic'
        });
      }
    }
  }
};

// Analyze a single file
function analyzeFile(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    
    // Skip test files and non-component files
    if (filePath.includes('.test.') || filePath.includes('.spec.')) {
      return;
    }
    
    // Run all analysis rules
    Object.values(ANALYSIS_RULES).forEach(category => {
      Object.values(category).forEach(rule => {
        rule(content, filePath);
      });
    });
  } catch (error) {
    console.error(`Error analyzing ${filePath}:`, error.message);
  }
}

// Recursively analyze directory
function analyzeDirectory(dir) {
  const files = fs.readdirSync(dir);
  
  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory() && !file.includes('node_modules') && !file.startsWith('.')) {
      analyzeDirectory(filePath);
    } else if (file.endsWith('.js') || file.endsWith('.jsx')) {
      analyzeFile(filePath);
    }
  });
}

// Generate report
function generateReport() {
  console.log('\n🔍 SOLACE AI MOBILE - UI/UX ANALYSIS REPORT\n');
  console.log('=' .repeat(80));
  
  // Group issues by type
  const groupedIssues = UI_UX_ISSUES.reduce((acc, issue) => {
    if (!acc[issue.type]) acc[issue.type] = [];
    acc[issue.type].push(issue);
    return acc;
  }, {});
  
  // Summary
  console.log('\n📊 SUMMARY\n');
  console.log(`Total Issues Found: ${UI_UX_ISSUES.length}`);
  console.log(`High Severity: ${UI_UX_ISSUES.filter(i => i.severity === 'HIGH').length}`);
  console.log(`Medium Severity: ${UI_UX_ISSUES.filter(i => i.severity === 'MEDIUM').length}`);
  console.log(`Low Severity: ${UI_UX_ISSUES.filter(i => i.severity === 'LOW').length}`);
  
  // Detailed issues by category
  Object.entries(groupedIssues).forEach(([type, issues]) => {
    console.log(`\n\n📌 ${type} ISSUES (${issues.length})\n`);
    console.log('-'.repeat(80));
    
    issues.forEach((issue, index) => {
      console.log(`\n${index + 1}. [${issue.severity}] ${issue.issue}`);
      console.log(`   File: ${issue.file}`);
      console.log(`   Recommendation: ${issue.recommendation}`);
      if (issue.snippet && issue.snippet !== issue.issue) {
        console.log(`   Code: ${issue.snippet}`);
      }
    });
  });
  
  // Recommendations
  console.log('\n\n🎯 TOP RECOMMENDATIONS\n');
  console.log('-'.repeat(80));
  console.log('\n1. ACCESSIBILITY: Add accessibility labels to all interactive elements');
  console.log('2. TOUCH TARGETS: Ensure all touchable elements are at least 44x44 pixels');
  console.log('3. LOADING STATES: Implement loading indicators for all async operations');
  console.log('4. ERROR HANDLING: Add proper error handling and user feedback');
  console.log('5. KEYBOARD: Use KeyboardAvoidingView for all forms');
  console.log('6. PERFORMANCE: Implement memoization for lists and expensive operations');
  
  // Save report to file
  const reportPath = path.join(__dirname, '..', 'ui-ux-analysis-report.json');
  fs.writeFileSync(reportPath, JSON.stringify({
    timestamp: new Date().toISOString(),
    summary: {
      total: UI_UX_ISSUES.length,
      high: UI_UX_ISSUES.filter(i => i.severity === 'HIGH').length,
      medium: UI_UX_ISSUES.filter(i => i.severity === 'MEDIUM').length,
      low: UI_UX_ISSUES.filter(i => i.severity === 'LOW').length
    },
    issues: UI_UX_ISSUES
  }, null, 2));
  
  console.log(`\n\n✅ Full report saved to: ${reportPath}\n`);
}

// Main execution
console.log('🚀 Starting UI/UX Analysis for Solace AI Mobile...\n');

const srcDir = path.join(__dirname, '..', 'src');
if (fs.existsSync(srcDir)) {
  analyzeDirectory(srcDir);
  generateReport();
} else {
  console.error('❌ Source directory not found!');
  process.exit(1);
} 