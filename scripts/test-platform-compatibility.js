#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🚀 SOLACE AI MOBILE - PLATFORM COMPATIBILITY TEST SUITE');
console.log('========================================================');

// Test results storage
let testResults = {
  total: 0,
  passed: 0,
  failed: 0,
  warnings: 0,
  tests: []
};

function runTest(testName, testFunction, priority = 'medium') {
  testResults.total++;
  try {
    const result = testFunction();
    if (result.success) {
      testResults.passed++;
      console.log(`✅ ${testName}`);
      if (result.message) console.log(`   ${result.message}`);
    } else {
      if (result.warning) {
        testResults.warnings++;
        console.log(`⚠️  ${testName}`);
      } else {
        testResults.failed++;
        console.log(`❌ ${testName}`);
      }
      if (result.message) console.log(`   ${result.message}`);
    }
    
    testResults.tests.push({
      name: testName,
      success: result.success,
      warning: result.warning || false,
      message: result.message || '',
      priority
    });
  } catch (error) {
    testResults.failed++;
    console.log(`❌ ${testName}`);
    console.log(`   Error: ${error.message}`);
    
    testResults.tests.push({
      name: testName,
      success: false,
      warning: false,
      message: `Error: ${error.message}`,
      priority
    });
  }
}

// Test 1: Check Expo configuration
function testExpoConfig() {
  const appJsonPath = path.join(process.cwd(), 'app.json');
  
  if (!fs.existsSync(appJsonPath)) {
    return { success: false, message: 'app.json not found' };
  }
  
  const appJson = JSON.parse(fs.readFileSync(appJsonPath, 'utf8'));
  const expo = appJson.expo;
  
  if (!expo) {
    return { success: false, message: 'No expo configuration found in app.json' };
  }
  
  // Check required platforms
  const requiredFields = ['name', 'slug', 'version', 'platforms'];
  const missingFields = requiredFields.filter(field => !expo[field]);
  
  if (missingFields.length > 0) {
    return { 
      success: false, 
      message: `Missing required fields: ${missingFields.join(', ')}` 
    };
  }
  
  // Check if all platforms are configured
  const platforms = expo.platforms || [];
  const expectedPlatforms = ['ios', 'android', 'web'];
  const missingPlatforms = expectedPlatforms.filter(p => !platforms.includes(p));
  
  if (missingPlatforms.length > 0) {
    return {
      success: false,
      warning: true,
      message: `Missing platform configurations: ${missingPlatforms.join(', ')}`
    };
  }
  
  return { success: true, message: 'Expo configuration is complete' };
}

// Test 2: Check platform-specific configurations
function testPlatformConfigs() {
  const appJsonPath = path.join(process.cwd(), 'app.json');
  const appJson = JSON.parse(fs.readFileSync(appJsonPath, 'utf8'));
  const expo = appJson.expo;
  
  const issues = [];
  
  // Check iOS config
  if (!expo.ios || !expo.ios.bundleIdentifier) {
    issues.push('iOS bundle identifier missing');
  }
  
  // Check Android config
  if (!expo.android || !expo.android.package) {
    issues.push('Android package name missing');
  }
  
  // Check web config
  if (!expo.web) {
    issues.push('Web configuration missing');
  }
  
  if (issues.length > 0) {
    return { success: false, message: issues.join(', ') };
  }
  
  return { success: true, message: 'All platform configurations present' };
}

// Test 3: Check React Native compatibility
function testReactNativeCompatibility() {
  const packageJsonPath = path.join(process.cwd(), 'package.json');
  
  if (!fs.existsSync(packageJsonPath)) {
    return { success: false, message: 'package.json not found' };
  }
  
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
  const dependencies = { ...packageJson.dependencies, ...packageJson.devDependencies };
  
  // Check for critical React Native packages
  const requiredPackages = [
    'react',
    'react-native',
    'expo',
    '@react-navigation/native',
    '@react-navigation/stack',
    'react-native-safe-area-context',
    'react-native-screens'
  ];
  
  const missingPackages = requiredPackages.filter(pkg => !dependencies[pkg]);
  
  if (missingPackages.length > 0) {
    return { 
      success: false, 
      message: `Missing required packages: ${missingPackages.join(', ')}` 
    };
  }
  
  // Check React Native version compatibility
  const rnVersion = dependencies['react-native'];
  if (rnVersion && !rnVersion.includes('0.76')) {
    return {
      success: true,
      warning: true,
      message: `React Native version ${rnVersion} may not be the latest`
    };
  }
  
  return { success: true, message: 'React Native dependencies are compatible' };
}

// Test 4: Check web-specific compatibility
function testWebCompatibility() {
  const packageJsonPath = path.join(process.cwd(), 'package.json');
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
  const dependencies = { ...packageJson.dependencies, ...packageJson.devDependencies };
  
  // Check for web-compatible packages
  const webPackages = ['react-native-web', 'react-dom'];
  const missingWebPackages = webPackages.filter(pkg => !dependencies[pkg]);
  
  if (missingWebPackages.length > 0) {
    return { 
      success: false, 
      message: `Missing web packages: ${missingWebPackages.join(', ')}` 
    };
  }
  
  return { success: true, message: 'Web compatibility packages present' };
}

// Test 5: Check for platform-specific code
function testPlatformSpecificCode() {
  const srcPath = path.join(process.cwd(), 'src');
  
  if (!fs.existsSync(srcPath)) {
    return { success: false, message: 'src directory not found' };
  }
  
  let platformSelectCount = 0;
  let platformOSCount = 0;
  
  function searchFiles(dir) {
    const files = fs.readdirSync(dir);
    
    for (const file of files) {
      const filePath = path.join(dir, file);
      const stat = fs.statSync(filePath);
      
      if (stat.isDirectory()) {
        searchFiles(filePath);
      } else if (file.endsWith('.js') || file.endsWith('.jsx') || file.endsWith('.ts') || file.endsWith('.tsx')) {
        const content = fs.readFileSync(filePath, 'utf8');
        
        // Count Platform.select usage
        const platformSelectMatches = content.match(/Platform\.select/g);
        if (platformSelectMatches) {
          platformSelectCount += platformSelectMatches.length;
        }
        
        // Count Platform.OS usage
        const platformOSMatches = content.match(/Platform\.OS/g);
        if (platformOSMatches) {
          platformOSCount += platformOSMatches.length;
        }
      }
    }
  }
  
  searchFiles(srcPath);
  
  return { 
    success: true, 
    message: `Found ${platformSelectCount} Platform.select and ${platformOSCount} Platform.OS usages` 
  };
}

// Test 6: Check assets for all platforms
function testAssetCompatibility() {
  const assetsPath = path.join(process.cwd(), 'assets');
  
  if (!fs.existsSync(assetsPath)) {
    return { success: false, message: 'assets directory not found' };
  }
  
  const requiredAssets = [
    'icon.png',
    'splash.png',
    'adaptive-icon.png',
    'favicon.png'
  ];
  
  const missingAssets = requiredAssets.filter(asset => 
    !fs.existsSync(path.join(assetsPath, asset))
  );
  
  if (missingAssets.length > 0) {
    return { 
      success: false, 
      message: `Missing assets: ${missingAssets.join(', ')}` 
    };
  }
  
  return { success: true, message: 'All required assets present' };
}

// Test 7: Check Metro configuration
function testMetroConfig() {
  const metroPossibleFiles = [
    'metro.config.js',
    'metro.config.json',
    '.expo/metro.config.js'
  ];
  
  const metroConfigExists = metroPossibleFiles.some(file => 
    fs.existsSync(path.join(process.cwd(), file))
  );
  
  if (!metroConfigExists) {
    return { 
      success: true,
      warning: true,
      message: 'No Metro config found - using Expo defaults' 
    };
  }
  
  return { success: true, message: 'Metro configuration present' };
}

// Test 8: Check environment configuration
function testEnvironmentConfig() {
  const envFiles = ['.env', '.env.example', '.env.production'];
  const existingEnvFiles = envFiles.filter(file => 
    fs.existsSync(path.join(process.cwd(), file))
  );
  
  if (existingEnvFiles.length === 0) {
    return { 
      success: false, 
      message: 'No environment configuration files found' 
    };
  }
  
  // Check if environment config file exists
  const envConfigPath = path.join(process.cwd(), 'src', 'config', 'environment.js');
  if (!fs.existsSync(envConfigPath)) {
    return {
      success: true,
      warning: true,
      message: 'Environment configuration utility not found'
    };
  }
  
  return { 
    success: true, 
    message: `Environment files found: ${existingEnvFiles.join(', ')}` 
  };
}

// Test 9: Check API service configuration
function testApiServiceConfig() {
  const apiServicePath = path.join(process.cwd(), 'src', 'services', 'api.js');
  
  if (!fs.existsSync(apiServicePath)) {
    return { success: false, message: 'API service not found' };
  }
  
  const apiService = fs.readFileSync(apiServicePath, 'utf8');
  
  // Check if platform-specific configurations exist
  if (!apiService.includes('Platform.select')) {
    return {
      success: true,
      warning: true,
      message: 'API service may not have platform-specific configurations'
    };
  }
  
  return { success: true, message: 'API service configured with platform support' };
}

// Test 10: Check theme system compatibility
function testThemeSystemCompatibility() {
  const themeFiles = [
    path.join(process.cwd(), 'src', 'styles', 'theme.js'),
    path.join(process.cwd(), 'src', 'contexts', 'ThemeContext.js')
  ];
  
  const missingThemeFiles = themeFiles.filter(file => !fs.existsSync(file));
  
  if (missingThemeFiles.length > 0) {
    return { 
      success: false, 
      message: `Missing theme files: ${missingThemeFiles.map(f => path.basename(f)).join(', ')}` 
    };
  }
  
  // Check if platform optimizations exist
  const platformOptPath = path.join(process.cwd(), 'src', 'utils', 'platformOptimizations.js');
  if (!fs.existsSync(platformOptPath)) {
    return {
      success: true,
      warning: true,
      message: 'Platform optimization utilities not found'
    };
  }
  
  return { success: true, message: 'Theme system with platform support configured' };
}

// Run all tests
console.log('\n🔍 RUNNING PLATFORM COMPATIBILITY TESTS');
console.log('----------------------------------------');

runTest('Expo Configuration', testExpoConfig, 'high');
runTest('Platform-Specific Configs', testPlatformConfigs, 'high');
runTest('React Native Compatibility', testReactNativeCompatibility, 'high');
runTest('Web Compatibility', testWebCompatibility, 'medium');
runTest('Platform-Specific Code Usage', testPlatformSpecificCode, 'low');
runTest('Asset Compatibility', testAssetCompatibility, 'medium');
runTest('Metro Configuration', testMetroConfig, 'low');
runTest('Environment Configuration', testEnvironmentConfig, 'medium');
runTest('API Service Configuration', testApiServiceConfig, 'medium');
runTest('Theme System Compatibility', testThemeSystemCompatibility, 'medium');

// Display results
console.log('\n📊 PLATFORM COMPATIBILITY TEST RESULTS');
console.log('========================================');
console.log(`Total Tests: ${testResults.total}`);
console.log(`✅ Passed: ${testResults.passed}`);
console.log(`❌ Failed: ${testResults.failed}`);
console.log(`⚠️  Warnings: ${testResults.warnings}`);

const successRate = ((testResults.passed / testResults.total) * 100).toFixed(1);
console.log(`📈 Success Rate: ${successRate}%`);

// Platform readiness assessment
let readinessLevel;
if (testResults.failed === 0 && testResults.warnings <= 2) {
  readinessLevel = '🟢 READY FOR ALL PLATFORMS';
} else if (testResults.failed <= 2 && testResults.warnings <= 4) {
  readinessLevel = '🟡 MOSTLY READY - MINOR ISSUES';
} else {
  readinessLevel = '🔴 NEEDS ATTENTION - MAJOR ISSUES';
}

console.log(`\n🎯 Platform Readiness: ${readinessLevel}`);

// Critical issues summary
const criticalIssues = testResults.tests.filter(test => !test.success && test.priority === 'high');
if (criticalIssues.length > 0) {
  console.log('\n🚨 CRITICAL ISSUES TO ADDRESS:');
  criticalIssues.forEach(issue => {
    console.log(`   • ${issue.name}: ${issue.message}`);
  });
}

// Recommendations
console.log('\n💡 RECOMMENDATIONS:');
if (testResults.failed === 0) {
  console.log('   ✨ Great! Your app is ready for cross-platform deployment');
  console.log('   🚀 Consider running platform-specific tests on actual devices');
  console.log('   📱 Test on both iOS and Android simulators/emulators');
  console.log('   🌐 Verify web compatibility in different browsers');
} else {
  console.log('   🔧 Address failed tests before deploying to production');
  console.log('   ⚠️  Review warnings to improve compatibility');
  console.log('   🧪 Run tests again after making fixes');
}

console.log('\n📱 NEXT STEPS FOR DEPLOYMENT:');
console.log('   1. Fix any critical issues identified above');
console.log('   2. Test on iOS: npx expo run:ios');
console.log('   3. Test on Android: npx expo run:android');
console.log('   4. Test on Web: npx expo start --web');
console.log('   5. Build for production: eas build --platform all');

// Save detailed report
const reportPath = path.join(process.cwd(), 'platform-compatibility-report.json');
fs.writeFileSync(reportPath, JSON.stringify({
  timestamp: new Date().toISOString(),
  summary: {
    total: testResults.total,
    passed: testResults.passed,
    failed: testResults.failed,
    warnings: testResults.warnings,
    successRate: successRate + '%',
    readinessLevel: readinessLevel.replace(/🟢|🟡|🔴/, '').trim()
  },
  tests: testResults.tests
}, null, 2));

console.log(`\n📋 Detailed report saved to: ${reportPath}`);