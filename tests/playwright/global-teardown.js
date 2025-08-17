// tests/playwright/global-teardown.js
// Global teardown for Playwright MCP testing environment with comprehensive cleanup

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

/**
 * Kill processes on specific ports with enhanced error handling
 * @param {number[]} ports - Array of port numbers to clear
 */
async function killPortProcesses(ports) {
  console.log('🧹 Starting port cleanup process...');
  
  for (const port of ports) {
    try {
      if (process.platform === 'win32') {
        // Windows: Enhanced process cleanup
        try {
          // Find all processes using the port
          const output = execSync(`netstat -ano | findstr :${port}`, { 
            encoding: 'utf8',
            timeout: 5000 
          });
          
          const lines = output.split('\n').filter(line => 
            line.includes(`:${port}`) && line.includes('LISTENING')
          );
          
          const pids = new Set();
          for (const line of lines) {
            const parts = line.trim().split(/\s+/);
            const pid = parts[parts.length - 1];
            if (pid && pid !== '0' && !isNaN(pid)) {
              pids.add(pid);
            }
          }
          
          // Kill each unique PID
          for (const pid of pids) {
            try {
              console.log(`🔫 Terminating process ${pid} on port ${port}`);
              execSync(`taskkill /PID ${pid} /F`, { 
                stdio: 'ignore',
                timeout: 3000 
              });
              
              // Verify process is killed
              await new Promise(resolve => setTimeout(resolve, 500));
              
              try {
                execSync(`tasklist /FI "PID eq ${pid}"`, { stdio: 'ignore' });
                console.log(`⚠️  Process ${pid} may still be running`);
              } catch {
                console.log(`✅ Process ${pid} successfully terminated`);
              }
            } catch (killError) {
              console.warn(`⚠️  Could not kill process ${pid}:`, killError.message);
            }
          }
        } catch (netstatError) {
          // No processes found on this port
          console.log(`ℹ️  No processes found on port ${port}`);
        }
      } else {
        // Unix/Linux/Mac: Enhanced process cleanup
        try {
          const pids = execSync(`lsof -ti:${port}`, { 
            encoding: 'utf8',
            timeout: 5000 
          }).trim().split('\n').filter(pid => pid);
          
          for (const pid of pids) {
            if (pid && !isNaN(pid)) {
              try {
                console.log(`🔫 Terminating process ${pid} on port ${port}`);
                
                // Try graceful termination first
                execSync(`kill ${pid}`, { stdio: 'ignore', timeout: 2000 });
                await new Promise(resolve => setTimeout(resolve, 1000));
                
                // Check if process still exists, force kill if necessary
                try {
                  execSync(`kill -0 ${pid}`, { stdio: 'ignore' });
                  console.log(`🔨 Force killing process ${pid}`);
                  execSync(`kill -9 ${pid}`, { stdio: 'ignore', timeout: 2000 });
                } catch {
                  console.log(`✅ Process ${pid} successfully terminated`);
                }
              } catch (killError) {
                console.warn(`⚠️  Could not kill process ${pid}:`, killError.message);
              }
            }
          }
        } catch (lsofError) {
          // No processes found on this port
          console.log(`ℹ️  No processes found on port ${port}`);
        }
      }
    } catch (error) {
      console.warn(`⚠️  Error cleaning up port ${port}:`, error.message);
    }
  }
}

/**
 * Clean up test artifacts and temporary files
 */
async function cleanupTestArtifacts() {
  console.log('🗑️  Cleaning up test artifacts...');
  
  const cleanupPaths = [
    './test-results/playwright',
    './playwright-report',
    './.playwright',
    './coverage/playwright',
  ];
  
  for (const cleanupPath of cleanupPaths) {
    try {
      const fullPath = path.resolve(cleanupPath);
      if (fs.existsSync(fullPath)) {
        // Only clean up if it's a test directory
        if (cleanupPath.includes('test-results') || 
            cleanupPath.includes('playwright-report') ||
            cleanupPath.includes('.playwright')) {
          
          const stats = fs.statSync(fullPath);
          if (stats.isDirectory()) {
            // Clean directory contents but keep directory structure
            const files = fs.readdirSync(fullPath);
            for (const file of files) {
              const filePath = path.join(fullPath, file);
              try {
                const fileStats = fs.statSync(filePath);
                if (fileStats.isFile()) {
                  fs.unlinkSync(filePath);
                }
              } catch (fileError) {
                console.warn(`⚠️  Could not delete file ${filePath}:`, fileError.message);
              }
            }
            console.log(`🧹 Cleaned directory: ${cleanupPath}`);
          }
        }
      }
    } catch (error) {
      console.warn(`⚠️  Could not clean up ${cleanupPath}:`, error.message);
    }
  }
}

/**
 * Generate cleanup report
 */
function generateCleanupReport() {
  const report = {
    timestamp: new Date().toISOString(),
    testSession: process.env.PLAYWRIGHT_TEST_SESSION || 'unknown',
    cleanup: {
      ports: [8081, 3000, 8082, 3001, 19006],
      artifacts: ['screenshots', 'videos', 'traces', 'reports'],
      status: 'completed'
    },
    environment: {
      nodeVersion: process.version,
      platform: process.platform,
      arch: process.arch,
    }
  };
  
  try {
    const reportPath = path.resolve('./test-reports/cleanup-report.json');
    fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
    console.log(`📊 Cleanup report saved to: ${reportPath}`);
  } catch (error) {
    console.warn('⚠️  Could not save cleanup report:', error.message);
  }
  
  return report;
}

/**
 * Global teardown function
 */
async function globalTeardown() {
  console.log('🏁 Starting Playwright MCP Testing Environment Teardown...');
  
  try {
    // Step 1: Kill processes on test ports with comprehensive cleanup
    const testPorts = [8081, 3000, 8082, 3001, 19006];
    await killPortProcesses(testPorts);
    // Ensure Expo process tree is terminated on Windows
    try {
      if (process.platform === 'win32' && process.env.EXPO_PID) {
        execSync(`taskkill /PID ${process.env.EXPO_PID} /T /F`, { stdio: 'ignore' });
      }
    } catch {}
    
    // Step 2: Wait for processes to fully terminate
    console.log('⏳ Waiting for processes to terminate...');
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // Step 3: Clean up test artifacts (optional - preserve for debugging)
    if (process.env.CLEANUP_TEST_ARTIFACTS === 'true') {
      await cleanupTestArtifacts();
    } else {
      console.log('ℹ️  Preserving test artifacts for debugging (set CLEANUP_TEST_ARTIFACTS=true to clean)');
    }
    
    // Step 4: Reset environment variables
    delete process.env.PLAYWRIGHT_TEST_MODE;
    delete process.env.NODE_ENV;
    
    // Step 5: Generate cleanup report
    const report = generateCleanupReport();
    
    // Step 6: Final verification
    console.log('🔍 Performing final verification...');
    let activeProcesses = 0;
    
    for (const port of testPorts) {
      try {
        if (process.platform === 'win32') {
          execSync(`netstat -ano | findstr :${port}`, { stdio: 'ignore', timeout: 2000 });
          activeProcesses++;
        } else {
          execSync(`lsof -ti:${port}`, { stdio: 'ignore', timeout: 2000 });
          activeProcesses++;
        }
      } catch {
        // Port is free - this is expected
      }
    }
    
    if (activeProcesses > 0) {
      console.warn(`⚠️  ${activeProcesses} processes may still be active on test ports`);
    } else {
      console.log('✅ All test ports successfully cleaned up');
    }
    
    console.log('✅ Global teardown completed successfully');
    
    return report;
    
  } catch (error) {
    console.error('❌ Global teardown failed:', error);
    throw error;
  }
}

module.exports = globalTeardown;