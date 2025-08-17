#!/usr/bin/env node
/**
 * Mental Health E2E Test Runner
 * 
 * Provides easy commands to run comprehensive mental health app tests
 * with different configurations and reporting options.
 */

const { spawn } = require('child_process');
const path = require('path');

// Test configurations
const TEST_CONFIGS = {
  all: {
    description: 'Run all mental health tests on all devices',
    projects: ['mental-health-comprehensive', 'mental-health-desktop', 'mental-health-ios', 'mental-health-android']
  },
  mobile: {
    description: 'Run mobile-focused tests (iOS + Android)',
    projects: ['mental-health-ios', 'mental-health-android']
  },
  desktop: {
    description: 'Run desktop browser tests',
    projects: ['mental-health-desktop']
  },
  comprehensive: {
    description: 'Run main comprehensive test suite',
    projects: ['mental-health-comprehensive']
  },
  quick: {
    description: 'Quick smoke test on main project',
    projects: ['mental-health-comprehensive'],
    extra: ['--grep', '"App Loading and Initial State"']
  }
};

// Helper to run Playwright tests
function runTests(config, options = {}) {
  const { projects, extra = [] } = config;
  
  const args = [
    'npx', 'playwright', 'test',
    ...projects.map(p => ['--project', p]).flat(),
    '--reporter=html,line',
    ...extra
  ];

  if (options.headed) {
    args.push('--headed');
  }

  if (options.debug) {
    args.push('--debug');
  }

  console.log(`\n🧠 Running Mental Health E2E Tests: ${config.description}`);
  console.log(`📋 Projects: ${projects.join(', ')}`);
  console.log(`🔧 Command: ${args.join(' ')}\n`);

  const child = spawn('cmd', ['/c', ...args], {
    stdio: 'inherit',
    cwd: path.resolve(__dirname, '../..')
  });

  child.on('close', (code) => {
    if (code === 0) {
      console.log('\n✅ Mental Health E2E Tests completed successfully!');
      console.log('📊 View detailed report: test-reports/playwright-html/index.html');
      console.log('📸 Screenshots available in: test-results/screenshots/');
    } else {
      console.log(`\n❌ Tests failed with code ${code}`);
      console.log('🔍 Check the HTML report for detailed failure information');
    }
  });

  return child;
}

// Command line interface
function main() {
  const args = process.argv.slice(2);
  const command = args[0] || 'comprehensive';
  const options = {
    headed: args.includes('--headed'),
    debug: args.includes('--debug')
  };

  console.log('🩺 Solace AI Mobile - Mental Health E2E Test Runner');
  console.log('================================================\n');

  if (command === 'help' || command === '--help' || command === '-h') {
    console.log('Available commands:');
    Object.entries(TEST_CONFIGS).forEach(([name, config]) => {
      console.log(`  ${name.padEnd(15)} - ${config.description}`);
    });
    console.log('\nOptions:');
    console.log('  --headed      - Run tests in headed mode (show browser)');
    console.log('  --debug       - Run tests in debug mode');
    console.log('\nExamples:');
    console.log('  node run-mental-health-tests.js comprehensive');
    console.log('  node run-mental-health-tests.js mobile --headed');
    console.log('  node run-mental-health-tests.js quick --debug');
    return;
  }

  const config = TEST_CONFIGS[command];
  
  if (!config) {
    console.error(`❌ Unknown command: ${command}`);
    console.log('Run "node run-mental-health-tests.js help" for available commands');
    process.exit(1);
  }

  // Check if app is running
  console.log('🔍 Checking if Solace AI Mobile app is running on http://localhost:8082...\n');
  
  const http = require('http');
  const req = http.get('http://localhost:8082', (res) => {
    console.log('✅ App is running, starting tests...\n');
    runTests(config, options);
  });

  req.on('error', (err) => {
    console.error('❌ Cannot connect to app on http://localhost:8082');
    console.error('Please ensure the Solace AI Mobile app is running before executing tests');
    console.error('Run: npm start or expo start in the project directory\n');
    process.exit(1);
  });

  req.setTimeout(5000, () => {
    console.error('❌ Timeout connecting to app on http://localhost:8082');
    console.error('Please ensure the app is fully loaded and accessible\n');
    process.exit(1);
  });
}

if (require.main === module) {
  main();
}

module.exports = { runTests, TEST_CONFIGS };