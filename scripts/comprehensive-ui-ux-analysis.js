// scripts/comprehensive-ui-ux-analysis.js
const fs = require('fs');
const path = require('path');

// Analysis results storage
const analysisResults = {
  accessibility: {
    issues: [],
    score: 0
  },
  performance: {
    issues: [],
    score: 0
  },
  usability: {
    issues: [],
    score: 0
  },
  mobileOptimization: {
    issues: [],
    score: 0
  },
  formHandling: {
    issues: [],
    score: 0
  },
  navigation: {
    issues: [],
    score: 0
  },
  overall: {
    totalIssues: 0,
    criticalIssues: 0,
    score: 0
  }
};

// Comprehensive analysis rules
const ANALYSIS_RULES = {
  accessibility: {
    missingAccessibilityLabels: (content, filePath) => {
      const touchables = content.match(/<(TouchableOpacity|TouchableHighlight|Pressable|Button)[^>]*>/g) || [];
      const issues = [];
      
      touchables.forEach((touchable, index) => {
        if (!touchable.includes('accessibilityLabel') && !touchable.includes('accessible=')) {
          issues.push({
            severity: 'HIGH',
            category: 'Accessibility',
            issue: 'Missing accessibility label',
            file: filePath,
            line: getLineNumber(content, touchable),
            recommendation: 'Add accessibilityLabel prop for screen reader support',
            code: touchable.substring(0, 80) + '...'
          });
        }
      });
      
      return issues;
    },
    
    colorContrastIssues: (content, filePath) => {
      const issues = [];
      const colorUsage = content.match(/color:\s*['"][^'"]+['"]/g) || [];
      
      // Check for potential contrast issues
      const lightColors = colorUsage.filter(color => 
        color.includes('#fff') || color.includes('white') || color.includes('#f')
      );
      const darkColors = colorUsage.filter(color => 
        color.includes('#000') || color.includes('black') || color.includes('#1')
      );
      
      if (lightColors.length > 0 && darkColors.length === 0) {
        issues.push({
          severity: 'MEDIUM',
          category: 'Accessibility',
          issue: 'Potential color contrast issue - only light colors found',
          file: filePath,
          recommendation: 'Ensure adequate contrast ratios (4.5:1 for normal text, 3:1 for large text)',
          code: 'Color palette may lack sufficient contrast'
        });
      }
      
      return issues;
    },
    
    missingKeyboardSupport: (content, filePath) => {
      const issues = [];
      const hasOnPress = /onPress/.test(content);
      const hasKeyboardSupport = /onKeyPress|KeyboardAvoidingView|accessibilityActions/.test(content);
      
      if (hasOnPress && !hasKeyboardSupport && filePath.includes('Screen')) {
        issues.push({
          severity: 'MEDIUM',
          category: 'Accessibility',
          issue: 'Screen lacks keyboard navigation support',
          file: filePath,
          recommendation: 'Add keyboard navigation and focus management',
          code: 'Screen with interactive elements but no keyboard support'
        });
      }
      
      return issues;
    }
  },
  
  performance: {
    unoptimizedImages: (content, filePath) => {
      const issues = [];
      const images = content.match(/<Image[^>]*>/g) || [];
      
      images.forEach(img => {
        if (!img.includes('resizeMode')) {
          issues.push({
            severity: 'MEDIUM',
            category: 'Performance',
            issue: 'Image without resizeMode optimization',
            file: filePath,
            recommendation: 'Add resizeMode prop (cover, contain, stretch, etc.)',
            code: img.substring(0, 80) + '...'
          });
        }
        
        if (!img.includes('cache') && img.includes('uri')) {
          issues.push({
            severity: 'LOW',
            category: 'Performance',
            issue: 'Remote image without caching strategy',
            file: filePath,
            recommendation: 'Consider image caching for remote images',
            code: img.substring(0, 80) + '...'
          });
        }
      });
      
      return issues;
    },
    
    missingMemoization: (content, filePath) => {
      const issues = [];
      const mapCount = (content.match(/\.map\(/g) || []).length;
      const hasMemoization = /useMemo|useCallback|React\.memo/.test(content);
      
      if (mapCount > 3 && !hasMemoization) {
        issues.push({
          severity: 'HIGH',
          category: 'Performance',
          issue: `Multiple array operations (${mapCount}) without memoization`,
          file: filePath,
          recommendation: 'Use useMemo for expensive calculations and useCallback for functions',
          code: `Found ${mapCount} .map() operations without optimization`
        });
      }
      
      return issues;
    },
    
    inefficientRendering: (content, filePath) => {
      const issues = [];
      
      // Check for inline object creation in render
      const inlineObjects = content.match(/style=\{\{[^}]+\}\}/g) || [];
      if (inlineObjects.length > 3) {
        issues.push({
          severity: 'MEDIUM',
          category: 'Performance',
          issue: 'Multiple inline style objects causing re-renders',
          file: filePath,
          recommendation: 'Move styles to StyleSheet.create() or use styled-components',
          code: `Found ${inlineObjects.length} inline style objects`
        });
      }
      
      return issues;
    }
  },
  
  usability: {
    smallTouchTargets: (content, filePath) => {
      const issues = [];
      const touchTargets = content.match(/width:\s*(\d+)[^}]*height:\s*(\d+)|height:\s*(\d+)[^}]*width:\s*(\d+)/g) || [];
      
      touchTargets.forEach(target => {
        const sizes = target.match(/\d+/g);
        if (sizes && sizes.some(size => parseInt(size) < 44)) {
          issues.push({
            severity: 'HIGH',
            category: 'Usability',
            issue: 'Touch target smaller than recommended 44x44 pixels',
            file: filePath,
            recommendation: 'Increase touch target size to minimum 44x44 pixels',
            code: target
          });
        }
      });
      
      return issues;
    },
    
    missingLoadingStates: (content, filePath) => {
      const issues = [];
      const hasAsync = /async|\.then|await|fetch|axios/.test(content);
      const hasLoading = /loading|isLoading|ActivityIndicator|Spinner/.test(content);
      
      if (hasAsync && !hasLoading) {
        issues.push({
          severity: 'MEDIUM',
          category: 'Usability',
          issue: 'Async operations without loading indicators',
          file: filePath,
          recommendation: 'Add loading states to provide user feedback during async operations',
          code: 'Async operations detected without loading UI'
        });
      }
      
      return issues;
    },
    
    poorErrorHandling: (content, filePath) => {
      const issues = [];
      const hasErrorProne = /fetch|axios|async/.test(content);
      const hasErrorHandling = /try.*catch|\.catch|error|Error/.test(content);
      
      if (hasErrorProne && !hasErrorHandling) {
        issues.push({
          severity: 'HIGH',
          category: 'Usability',
          issue: 'Missing error handling for async operations',
          file: filePath,
          recommendation: 'Implement try-catch blocks and user-friendly error messages',
          code: 'Error-prone operations without proper error handling'
        });
      }
      
      return issues;
    }
  },
  
  mobileOptimization: {
    missingKeyboardAvoidance: (content, filePath) => {
      const issues = [];
      const hasInputs = /<TextInput|<Input/.test(content);
      const hasKeyboardAvoidance = /KeyboardAvoidingView|KeyboardAware/.test(content);
      
      if (hasInputs && !hasKeyboardAvoidance) {
        issues.push({
          severity: 'HIGH',
          category: 'Mobile Optimization',
          issue: 'Form inputs without keyboard avoidance',
          file: filePath,
          recommendation: 'Wrap form in KeyboardAvoidingView to prevent keyboard overlap',
          code: 'TextInput components found without KeyboardAvoidingView'
        });
      }
      
      return issues;
    },
    
    missingHapticFeedback: (content, filePath) => {
      const issues = [];
      const importantActions = /onPress.*(?:submit|delete|save|confirm)/gi.test(content);
      const hasHaptics = /Haptics|haptic|vibrate/.test(content);
      
      if (importantActions && !hasHaptics) {
        issues.push({
          severity: 'LOW',
          category: 'Mobile Optimization',
          issue: 'Important actions without haptic feedback',
          file: filePath,
          recommendation: 'Add haptic feedback for important user actions',
          code: 'Important actions detected without haptic feedback'
        });
      }
      
      return issues;
    }
  },
  
  formHandling: {
    missingValidation: (content, filePath) => {
      const issues = [];
      const hasForm = /<TextInput|<Input/.test(content);
      const hasValidation = /validate|validation|error.*Text|yup|formik/.test(content);
      
      if (hasForm && !hasValidation && !filePath.includes('Chat')) {
        issues.push({
          severity: 'MEDIUM',
          category: 'Form Handling',
          issue: 'Form inputs without validation',
          file: filePath,
          recommendation: 'Implement input validation with clear error messages',
          code: 'Form inputs found without validation logic'
        });
      }
      
      return issues;
    },
    
    missingFormLabels: (content, filePath) => {
      const issues = [];
      const inputs = content.match(/<TextInput[^>]*>/g) || [];
      
      inputs.forEach(input => {
        if (!input.includes('placeholder') && !input.includes('accessibilityLabel')) {
          issues.push({
            severity: 'MEDIUM',
            category: 'Form Handling',
            issue: 'Input without label or placeholder',
            file: filePath,
            recommendation: 'Add placeholder text or accessibility label for form inputs',
            code: input.substring(0, 80) + '...'
          });
        }
      });
      
      return issues;
    }
  },
  
  navigation: {
    missingBackNavigation: (content, filePath) => {
      const issues = [];
      const isScreen = filePath.includes('Screen');
      const hasBackNav = /goBack|HeaderBackButton|navigation\.pop/.test(content);
      
      if (isScreen && !hasBackNav && !filePath.includes('Dashboard') && !filePath.includes('Splash')) {
        issues.push({
          severity: 'MEDIUM',
          category: 'Navigation',
          issue: 'Screen without back navigation handling',
          file: filePath,
          recommendation: 'Implement proper back navigation for user flow',
          code: 'Screen component without back navigation'
        });
      }
      
      return issues;
    },
    
    inconsistentNavigation: (content, filePath) => {
      const issues = [];
      const hasNavigation = /navigation\.navigate|navigation\.push/.test(content);
      const hasConsistentPattern = /useNavigation|navigation\s*=/.test(content);
      
      if (hasNavigation && !hasConsistentPattern) {
        issues.push({
          severity: 'LOW',
          category: 'Navigation',
          issue: 'Inconsistent navigation pattern',
          file: filePath,
          recommendation: 'Use consistent navigation patterns across the app',
          code: 'Navigation usage without consistent hook pattern'
        });
      }
      
      return issues;
    }
  }
};

// Helper function to get line number
function getLineNumber(content, searchString) {
  const lines = content.substring(0, content.indexOf(searchString)).split('\n');
  return lines.length;
}

// Analyze a single file
function analyzeFile(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const allIssues = [];
    
    // Run all analysis rules
    Object.entries(ANALYSIS_RULES).forEach(([category, rules]) => {
      Object.values(rules).forEach(rule => {
        const issues = rule(content, filePath);
        allIssues.push(...issues);
        analysisResults[category].issues.push(...issues);
      });
    });
    
    return allIssues;
  } catch (error) {
    console.error(`Error analyzing ${filePath}:`, error.message);
    return [];
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
      analyzeFile(filePath);
    }
  });
}

// Calculate scores
function calculateScores() {
  Object.keys(analysisResults).forEach(category => {
    if (category === 'overall') return;
    
    const categoryData = analysisResults[category];
    const totalIssues = categoryData.issues.length;
    const criticalIssues = categoryData.issues.filter(issue => issue.severity === 'HIGH').length;
    
    // Score calculation: start with 100, deduct points for issues
    let score = 100;
    score -= criticalIssues * 15; // High severity: -15 points each
    score -= categoryData.issues.filter(issue => issue.severity === 'MEDIUM').length * 8; // Medium: -8 points each
    score -= categoryData.issues.filter(issue => issue.severity === 'LOW').length * 3; // Low: -3 points each
    
    categoryData.score = Math.max(0, score);
  });
  
  // Calculate overall score
  const totalIssues = Object.values(analysisResults).reduce((sum, category) => {
    return sum + (category.issues ? category.issues.length : 0);
  }, 0);
  
  const criticalIssues = Object.values(analysisResults).reduce((sum, category) => {
    return sum + (category.issues ? category.issues.filter(issue => issue.severity === 'HIGH').length : 0);
  }, 0);
  
  analysisResults.overall.totalIssues = totalIssues;
  analysisResults.overall.criticalIssues = criticalIssues;
  
  // Overall score is average of category scores
  const categoryScores = Object.keys(analysisResults).filter(key => key !== 'overall').map(key => analysisResults[key].score);
  analysisResults.overall.score = Math.round(categoryScores.reduce((sum, score) => sum + score, 0) / categoryScores.length);
}

// Generate comprehensive report
function generateReport() {
  console.log('\n🔍 SOLACE AI MOBILE - COMPREHENSIVE UI/UX ANALYSIS\n');
  console.log('=' .repeat(80));
  
  // Overall Summary
  console.log(`\n📊 OVERALL SCORE: ${analysisResults.overall.score}/100`);
  console.log(`Total Issues Found: ${analysisResults.overall.totalIssues}`);
  console.log(`Critical Issues: ${analysisResults.overall.criticalIssues}`);
  
  // Category Scores
  console.log('\n📈 CATEGORY SCORES:');
  console.log('-'.repeat(50));
  Object.entries(analysisResults).forEach(([category, data]) => {
    if (category === 'overall') return;
    const emoji = getScoreEmoji(data.score);
    console.log(`${emoji} ${category.toUpperCase().padEnd(20)} ${data.score}/100 (${data.issues.length} issues)`);
  });
  
  // Detailed Issues by Category
  Object.entries(analysisResults).forEach(([category, data]) => {
    if (category === 'overall' || data.issues.length === 0) return;
    
    console.log(`\n\n📌 ${category.toUpperCase()} ISSUES (${data.issues.length})\n`);
    console.log('-'.repeat(80));
    
    // Group by severity
    const groupedBySeverity = data.issues.reduce((acc, issue) => {
      if (!acc[issue.severity]) acc[issue.severity] = [];
      acc[issue.severity].push(issue);
      return acc;
    }, {});
    
    ['HIGH', 'MEDIUM', 'LOW'].forEach(severity => {
      if (!groupedBySeverity[severity]) return;
      
      console.log(`\n🔴 ${severity} SEVERITY (${groupedBySeverity[severity].length} issues):`);
      groupedBySeverity[severity].forEach((issue, index) => {
        console.log(`\n${index + 1}. ${issue.issue}`);
        console.log(`   File: ${issue.file}`);
        console.log(`   Recommendation: ${issue.recommendation}`);
        if (issue.line) console.log(`   Line: ${issue.line}`);
        if (issue.code && issue.code !== issue.issue) {
          console.log(`   Code: ${issue.code}`);
        }
      });
    });
  });
  
  // Recommendations
  console.log('\n\n🎯 TOP PRIORITY RECOMMENDATIONS\n');
  console.log('-'.repeat(80));
  console.log('\n1. 🚨 Fix Critical Accessibility Issues');
  console.log('   - Add accessibility labels to all interactive elements');
  console.log('   - Ensure minimum touch target sizes (44x44px)');
  console.log('   - Implement proper keyboard navigation');
  
  console.log('\n2. ⚡ Optimize Performance');
  console.log('   - Add memoization to components with multiple array operations');
  console.log('   - Optimize images with proper resizeMode');
  console.log('   - Move inline styles to StyleSheet');
  
  console.log('\n3. 📱 Enhance Mobile Experience');
  console.log('   - Add KeyboardAvoidingView to all forms');
  console.log('   - Implement haptic feedback for important actions');
  console.log('   - Add loading states for async operations');
  
  console.log('\n4. 🛡️ Improve Error Handling');
  console.log('   - Add try-catch blocks for async operations');
  console.log('   - Implement user-friendly error messages');
  console.log('   - Add form validation with clear feedback');
  
  // Save detailed report
  const reportPath = path.join(__dirname, '..', 'comprehensive-ui-ux-report.json');
  fs.writeFileSync(reportPath, JSON.stringify(analysisResults, null, 2));
  console.log(`\n\n✅ Detailed report saved to: ${reportPath}\n`);
  
  return analysisResults;
}

// Helper function for score emojis
function getScoreEmoji(score) {
  if (score >= 90) return '🟢';
  if (score >= 75) return '🟡';
  if (score >= 60) return '🟠';
  return '🔴';
}

// Main execution
console.log('🚀 Starting Comprehensive UI/UX Analysis...\n');

const srcDir = path.join(__dirname, '..', 'src');
if (fs.existsSync(srcDir)) {
  processDirectory(srcDir);
  calculateScores();
  const results = generateReport();
  
  // Return results for programmatic use
  process.exit(results.overall.score < 70 ? 1 : 0);
} else {
  console.error('❌ Source directory not found!');
  process.exit(1);
} 