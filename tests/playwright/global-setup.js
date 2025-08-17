// tests/playwright/global-setup.js
// Global setup for Playwright MCP testing environment with port cleanup

const { execSync, spawn } = require('child_process');
const net = require('net');
let expoProc = null;

/**
 * Check if a port is in use
 * @param {number} port - Port number to check
 * @returns {Promise<boolean>} - True if port is in use
 */
async function isPortInUse(port) {
  return new Promise((resolve) => {
    const server = net.createServer();
    server.listen(port, () => {
      server.once('close', () => resolve(false));
      server.close();
    });
    server.on('error', () => resolve(true));
  });
}

/**
 * Kill processes on specific ports
 * @param {number[]} ports - Array of port numbers to clear
 */
async function killPortProcesses(ports) {
  for (const port of ports) {
    try {
      if (process.platform === 'win32') {
        // Windows: Find and kill processes using the port
        try {
          const output = execSync(`netstat -ano | findstr :${port}`, { encoding: 'utf8' });
          const lines = output.split('\n').filter(line => line.includes(`${port}`));
          
          for (const line of lines) {
            const parts = line.trim().split(/\s+/);
            const pid = parts[parts.length - 1];
            if (pid && pid !== '0') {
              console.log(`Killing process ${pid} on port ${port}`);
              execSync(`taskkill /PID ${pid} /F`, { stdio: 'ignore' });
            }
          }
        } catch (error) {
          // Port might not be in use, continue
        }
      } else {
        // Unix/Linux/Mac: Use lsof and kill
        try {
          const pid = execSync(`lsof -ti:${port}`, { encoding: 'utf8' }).trim();
          if (pid) {
            console.log(`Killing process ${pid} on port ${port}`);
            execSync(`kill -9 ${pid}`, { stdio: 'ignore' });
          }
        } catch (error) {
          // Port might not be in use, continue
        }
      }
    } catch (error) {
      console.warn(`Warning: Could not clean up port ${port}:`, error.message);
    }
  }
}

/**
 * Wait for port to become available
 * @param {number} port - Port number to wait for
 * @param {number} timeout - Timeout in milliseconds
 */
async function waitForPort(port, timeout = 20000) {
  const startTime = Date.now();
  
  while (Date.now() - startTime < timeout) {
    if (await isPortInUse(port)) {
      return true;
    }
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
  
  throw new Error(`Port ${port} did not become available within ${timeout}ms`);
}

/**
 * Global setup function
 */
async function globalSetup() {
  console.log('🚀 Starting Playwright MCP Testing Environment Setup...');
  
  const testPorts = [8081, 3000, 8082, 3001, 19006]; // Common React Native / Expo ports
  
  try {
    // Step 1: Clean up any existing processes on test ports
    console.log('🧹 Cleaning up existing processes on test ports...');
    await killPortProcesses(testPorts);
    
    // Step 2: Wait a moment for cleanup to complete
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Step 3: Verify ports are available
    console.log('🔍 Verifying port availability...');
    for (const port of [8081, 3000]) {
      const inUse = await isPortInUse(port);
      if (inUse) {
        console.warn(`⚠️  Port ${port} is still in use after cleanup attempt`);
      } else {
        console.log(`✅ Port ${port} is available`);
      }
    }
    
    // Step 4: Set environment variables for testing
    process.env.NODE_ENV = 'test';
    process.env.EXPO_USE_FAST_RESOLVER = 'true';
    process.env.PLAYWRIGHT_TEST_MODE = 'true';
    process.env.CI = process.env.CI || '1';
    
    // Step 5: Create test directories if they don't exist
    const fs = require('fs');
    const path = require('path');
    
    const testDirs = [
      './test-results/playwright',
      './test-reports/playwright-html',
      './test-reports',
    ];
    
    for (const dir of testDirs) {
      const fullPath = path.resolve(dir);
      if (!fs.existsSync(fullPath)) {
        fs.mkdirSync(fullPath, { recursive: true });
        console.log(`📁 Created test directory: ${dir}`);
      }
    }
    
    // Step 6: Start Expo Web server (non-interactive)
    console.log('🌐 Launching Expo Web server...');
    const npxCmd = process.platform === 'win32' ? 'npx.cmd' : 'npx';
    expoProc = spawn(npxCmd, [
      '--yes',
      'expo',
      'start',
      '--web',
      '--non-interactive',
      '--port',
      '8081',
    ], {
      env: {
        ...process.env,
        NODE_ENV: 'development',
        BROWSER: 'none',
        CI: '1',
      },
      stdio: 'inherit',
      shell: true,
    });

    // Wait for server to become available (20s)
    await waitForPort(8081, 20000).catch(async () => {
      console.warn('⚠️  Port 8081 not ready, trying 19006...');
      return waitForPort(19006, 20000);
    });
    console.log('✅ Expo Web server is up');

    // Step 7: Setup therapy testing environment mocks
    console.log('🎭 Setting up therapy testing mocks...');
    await setupTherapyTestingMocks();
    
    console.log('✅ Global setup completed successfully');
    
    // Return setup data that can be used in tests
    return {
      testStartTime: Date.now(),
      availablePorts: testPorts.filter(async port => !(await isPortInUse(port))),
      testEnvironment: 'playwright-mcp',
      expoPid: expoProc?.pid || null,
    };
    
  } catch (error) {
    console.error('❌ Global setup failed:', error);
    throw error;
  }
}

/**
 * Setup therapy-specific testing mocks and utilities
 */
async function setupTherapyTestingMocks() {
  // This function sets up global mocks that will be available in all tests
  // The actual mocks are injected into each page context during test execution
  
  console.log('  📝 Preparing crisis detection test data...');
  console.log('  🎤 Preparing voice recording mocks...');
  console.log('  🚨 Preparing emergency services mocks...');
  console.log('  🧠 Preparing AI response mocks...');
  console.log('  💾 Preparing data persistence mocks...');
  console.log('  ♿ Preparing accessibility testing utilities...');
  
  // Mock data can be prepared here for consistency across tests
  global.therapyTestData = {
    crisisKeywords: [
      'kill myself', 'suicide', 'end my life', 'hurt myself',
      'want to die', 'not worth living', 'better off dead'
    ],
    
    emergencyContacts: [
      { name: 'Crisis Hotline', number: '988', type: 'crisis' },
      { name: 'Emergency Services', number: '911', type: 'emergency' },
      { name: 'Mental Health Provider', number: '555-HELP', type: 'provider' }
    ],
    
    therapyExercises: [
      { id: 'grounding_5_4_3_2_1', name: '5-4-3-2-1 Grounding' },
      { id: 'breathing_exercise', name: 'Mindful Breathing' },
      { id: 'thought_challenging', name: 'Thought Challenging' },
      { id: 'mood_exploration', name: 'Mood Check-In' }
    ],
    
    mockResponses: {
      anxiety: 'I hear that you\'re feeling anxious. Anxiety can be really challenging to deal with.',
      depression: 'Thank you for sharing that you\'re feeling down. It takes courage to reach out.',
      crisis: 'I\'m very concerned about what you\'re sharing with me. If you\'re having thoughts of hurting yourself, please reach out for immediate help.'
    }
  };
  
  console.log('  ✅ Therapy testing mocks prepared');
}

module.exports = globalSetup;