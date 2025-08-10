// scripts/basic-ui-analysis.js
// Basic UI/UX Analysis without Playwright - Manual inspection
const fs = require('fs');
const path = require('path');
const http = require('http');

console.log('🔍 SOLACE AI MOBILE - BASIC UI/UX ANALYSIS');
console.log('=' .repeat(60));

// Function to check if server is running
function checkServerStatus(port) {
  return new Promise((resolve, reject) => {
    const req = http.get(`http://localhost:${port}`, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        resolve({ status: res.statusCode, html: data });
      });
    });
    
    req.on('error', (err) => {
      reject(err);
    });
    
    req.setTimeout(10000, () => {
      req.destroy();
      reject(new Error('Request timeout'));
    });
  });
}

// Function to analyze HTML content
function analyzeHTML(html) {
  const issues = [];
  
  // Check for React Native Web
  if (html.includes('react-native-web') || html.includes('ReactNativeWeb')) {
    console.log('✅ React Native Web detected');
  } else {
    issues.push({
      type: 'Framework Issue',
      description: 'React Native Web not detected in HTML',
      severity: 'High'
    });
  }
  
  // Check for basic HTML structure
  if (!html.includes('<title>')) {
    issues.push({
      type: 'SEO Issue',
      description: 'No title tag found',
      severity: 'Medium'
    });
  } else {
    const titleMatch = html.match(/<title[^>]*>(.*?)<\/title>/i);
    if (titleMatch) {
      console.log(`✅ Title found: "${titleMatch[1]}"`);
      if (!titleMatch[1].toLowerCase().includes('solace')) {
        issues.push({
          type: 'Branding Issue',
          description: 'Title does not include app name "Solace"',
          severity: 'Low'
        });
      }
    }
  }
  
  // Check for viewport meta tag
  if (!html.includes('viewport')) {
    issues.push({
      type: 'Mobile Issue',
      description: 'No viewport meta tag found - mobile rendering may be affected',
      severity: 'High'
    });
  } else {
    console.log('✅ Viewport meta tag found');
  }
  
  // Check for accessibility
  if (html.includes('aria-') || html.includes('role=')) {
    console.log('✅ ARIA attributes detected in initial HTML');
  } else {
    issues.push({
      type: 'Accessibility Issue',
      description: 'No ARIA attributes in initial HTML - may indicate accessibility issues',
      severity: 'Medium'
    });
  }
  
  // Check for error indicators
  if (html.includes('error') || html.includes('Error') || html.includes('ERROR')) {
    issues.push({
      type: 'Runtime Error',
      description: 'Error text detected in HTML content',
      severity: 'Critical'
    });
  }
  
  // Check for loading indicators
  if (html.includes('loading') || html.includes('Loading') || html.includes('spinner')) {
    console.log('⏳ Loading indicators detected');
  }
  
  return issues;
}

// Function to analyze project structure
function analyzeProjectStructure() {
  const issues = [];
  const srcPath = path.join(__dirname, '..', 'src');
  
  console.log('\n📁 ANALYZING PROJECT STRUCTURE');
  console.log('-'.repeat(40));
  
  // Check critical directories
  const criticalDirs = [
    'src/screens',
    'src/components', 
    'src/navigation',
    'src/contexts',
    'src/store'
  ];
  
  criticalDirs.forEach(dir => {
    const fullPath = path.join(__dirname, '..', dir);
    if (fs.existsSync(fullPath)) {
      const files = fs.readdirSync(fullPath);
      console.log(`✅ ${dir}: ${files.length} files`);
      
      if (files.length === 0) {
        issues.push({
          type: 'Structure Issue',
          description: `${dir} directory is empty`,
          severity: 'Medium'
        });
      }
    } else {
      issues.push({
        type: 'Structure Issue', 
        description: `${dir} directory missing`,
        severity: 'High'
      });
    }
  });
  
  // Check for specific important files
  const importantFiles = [
    'src/navigation/OptimizedAppNavigator.js',
    'src/screens/MainAppScreen.js',
    'src/screens/mood/EnhancedMoodTrackerScreen.js',
    'src/components/icons/index.js',
    'src/contexts/ThemeContext.js'
  ];
  
  importantFiles.forEach(file => {
    const fullPath = path.join(__dirname, '..', file);
    if (fs.existsSync(fullPath)) {
      const stats = fs.statSync(fullPath);
      console.log(`✅ ${file}: ${(stats.size / 1024).toFixed(1)}KB`);
      
      // Check file size for potential issues
      if (stats.size > 50000) { // 50KB
        issues.push({
          type: 'Performance Issue',
          description: `${file} is large (${(stats.size / 1024).toFixed(1)}KB) - consider splitting`,
          severity: 'Low'
        });
      }
      
      if (stats.size < 100) { // Very small files might be stubs
        issues.push({
          type: 'Implementation Issue',
          description: `${file} is very small (${stats.size} bytes) - may be incomplete`,
          severity: 'Medium'
        });
      }
    } else {
      issues.push({
        type: 'Missing File',
        description: `${file} not found`,
        severity: 'High'
      });
    }
  });
  
  return issues;
}

// Function to analyze package.json dependencies
function analyzeDependencies() {
  const issues = [];
  console.log('\n📦 ANALYZING DEPENDENCIES');
  console.log('-'.repeat(40));
  
  try {
    const packagePath = path.join(__dirname, '..', 'package.json');
    const packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
    
    const deps = { ...packageJson.dependencies, ...packageJson.devDependencies };
    const depCount = Object.keys(deps).length;
    console.log(`📊 Total dependencies: ${depCount}`);
    
    // Check for essential React Native dependencies
    const essentialDeps = [
      '@react-navigation/native',
      '@react-navigation/bottom-tabs', 
      'react-native-svg',
      'expo-linear-gradient',
      '@reduxjs/toolkit',
      'react-redux'
    ];
    
    essentialDeps.forEach(dep => {
      if (deps[dep]) {
        console.log(`✅ ${dep}: ${deps[dep]}`);
      } else {
        issues.push({
          type: 'Dependency Issue',
          description: `Essential dependency ${dep} not found`,
          severity: 'High'
        });
      }
    });
    
    // Check for Playwright testing
    if (deps['@playwright/test']) {
      console.log(`✅ Playwright testing: ${deps['@playwright/test']}`);
    } else {
      issues.push({
        type: 'Testing Issue',
        description: 'Playwright testing dependency not found',
        severity: 'Medium'
      });
    }
    
    // Check for outdated React Native
    if (deps['react-native']) {
      const version = deps['react-native'].replace(/[^\d\.]/g, '');
      console.log(`📱 React Native: ${deps['react-native']}`);
      
      if (parseFloat(version) < 0.70) {
        issues.push({
          type: 'Version Issue',
          description: `React Native version ${version} is outdated`,
          severity: 'Medium'
        });
      }
    }
    
  } catch (error) {
    issues.push({
      type: 'Config Issue',
      description: `Cannot read package.json: ${error.message}`,
      severity: 'Critical'
    });
  }
  
  return issues;
}

// Main analysis function
async function runAnalysis() {
  console.log('🚀 Starting Basic UI/UX Analysis...\n');
  
  let allIssues = [];
  
  // Test 1: Server Status
  console.log('🌐 TESTING SERVER CONNECTIVITY');
  console.log('-'.repeat(40));
  
  for (const port of [8081, 8082]) {
    try {
      const result = await checkServerStatus(port);
      console.log(`✅ Port ${port}: Server responding (${result.status})`);
      
      if (result.status === 200 && result.html) {
        console.log(`📄 HTML size: ${(result.html.length / 1024).toFixed(1)}KB`);
        const htmlIssues = analyzeHTML(result.html);
        allIssues.push(...htmlIssues);
        
        if (port === 8082) {
          // Save HTML for manual inspection
          fs.writeFileSync(
            path.join(__dirname, '..', 'test-results', 'server-response.html'),
            result.html
          );
          console.log('💾 HTML response saved to test-results/server-response.html');
        }
      }
      
      break; // If one port works, we're good
      
    } catch (error) {
      console.log(`❌ Port ${port}: ${error.message}`);
      if (port === 8082) { // Last port to try
        allIssues.push({
          type: 'Server Issue',
          description: 'No web server responding on expected ports (8081, 8082)',
          severity: 'Critical'
        });
      }
    }
  }
  
  // Test 2: Project Structure
  const structureIssues = analyzeProjectStructure();
  allIssues.push(...structureIssues);
  
  // Test 3: Dependencies
  const depIssues = analyzeDependencies();
  allIssues.push(...depIssues);
  
  // Generate Report
  console.log('\n' + '='.repeat(60));
  console.log('📋 BASIC UI/UX ANALYSIS REPORT');
  console.log('='.repeat(60));
  
  const criticalIssues = allIssues.filter(i => i.severity === 'Critical');
  const highIssues = allIssues.filter(i => i.severity === 'High');
  const mediumIssues = allIssues.filter(i => i.severity === 'Medium');
  const lowIssues = allIssues.filter(i => i.severity === 'Low');
  
  console.log('\n🚨 CRITICAL ISSUES:');
  if (criticalIssues.length === 0) {
    console.log('   ✅ No critical issues detected');
  } else {
    criticalIssues.forEach(issue => {
      console.log(`   • ${issue.description} (${issue.type})`);
    });
  }
  
  console.log('\n⚠️  HIGH PRIORITY ISSUES:');
  if (highIssues.length === 0) {
    console.log('   ✅ No high priority issues detected');
  } else {
    highIssues.forEach(issue => {
      console.log(`   • ${issue.description} (${issue.type})`);
    });
  }
  
  console.log('\n📋 MEDIUM PRIORITY ISSUES:');
  if (mediumIssues.length === 0) {
    console.log('   ✅ No medium priority issues detected');
  } else {
    mediumIssues.slice(0, 5).forEach(issue => {
      console.log(`   • ${issue.description} (${issue.type})`);
    });
    if (mediumIssues.length > 5) {
      console.log(`   ... and ${mediumIssues.length - 5} more medium priority issues`);
    }
  }
  
  console.log('\n🎯 RECOMMENDATIONS:');
  
  if (criticalIssues.length > 0) {
    console.log('   🆘 URGENT: Address critical issues immediately before proceeding');
  }
  
  if (allIssues.some(i => i.type === 'Server Issue')) {
    console.log('   🌐 Start the development server: npm run web');
  }
  
  if (allIssues.some(i => i.type === 'Dependency Issue')) {
    console.log('   📦 Install missing dependencies: npm install');
  }
  
  if (allIssues.some(i => i.type === 'Accessibility Issue')) {
    console.log('   ♿ Review accessibility implementation in components');
  }
  
  console.log('\n📊 SUMMARY:');
  console.log(`   Total Issues Found: ${allIssues.length}`);
  console.log(`   • Critical: ${criticalIssues.length}`);
  console.log(`   • High: ${highIssues.length}`);
  console.log(`   • Medium: ${mediumIssues.length}`);
  console.log(`   • Low: ${lowIssues.length}`);
  
  if (allIssues.length === 0) {
    console.log('\n🏆 EXCELLENT: No issues detected in basic analysis!');
    console.log('   Ready for comprehensive Playwright testing.');
  } else if (criticalIssues.length === 0 && highIssues.length <= 2) {
    console.log('\n✅ GOOD: Minor issues detected, mostly ready for testing.');
  } else {
    console.log('\n⚠️  NEEDS ATTENTION: Address high-priority issues before comprehensive testing.');
  }
  
  console.log('\n' + '='.repeat(60));
  console.log('💡 Next Steps:');
  console.log('   1. Address any critical/high priority issues');
  console.log('   2. Ensure web server is running (npm run web)');
  console.log('   3. Run comprehensive Playwright tests: npm run test:playwright');
  
  // Save detailed report
  const report = {
    timestamp: new Date().toISOString(),
    summary: {
      totalIssues: allIssues.length,
      critical: criticalIssues.length,
      high: highIssues.length,
      medium: mediumIssues.length,
      low: lowIssues.length
    },
    issues: allIssues
  };
  
  try {
    fs.mkdirSync(path.join(__dirname, '..', 'test-results'), { recursive: true });
    fs.writeFileSync(
      path.join(__dirname, '..', 'test-results', 'basic-ui-analysis.json'),
      JSON.stringify(report, null, 2)
    );
    console.log('   4. View detailed report: test-results/basic-ui-analysis.json');
  } catch (error) {
    console.log(`   ⚠️  Could not save report: ${error.message}`);
  }
}

// Run the analysis
runAnalysis().catch(error => {
  console.error('❌ Analysis failed:', error);
  process.exit(1);
});