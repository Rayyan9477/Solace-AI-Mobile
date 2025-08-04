/**
 * Port Manager for Navigation Testing
 * Handles port conflicts, cleanup, and process management
 */

const { exec, spawn } = require('child_process');
const { promisify } = require('util');
const execAsync = promisify(exec);

class PortManager {
  constructor(config) {
    this.config = config;
    this.activeProcesses = new Map();
    this.portChecks = new Map();
  }

  /**
   * Check if a port is in use
   */
  async isPortInUse(port) {
    try {
      const command = process.platform === 'win32' 
        ? `netstat -ano | findstr :${port}`
        : `lsof -i :${port}`;
      
      const { stdout } = await execAsync(command);
      return stdout.trim().length > 0;
    } catch (error) {
      // If command fails, assume port is free
      return false;
    }
  }

  /**
   * Find next available port starting from given port
   */
  async findAvailablePort(startPort, maxAttempts = 10) {
    for (let i = 0; i < maxAttempts; i++) {
      const port = startPort + i;
      const inUse = await this.isPortInUse(port);
      
      if (!inUse) {
        console.log(`✅ Found available port: ${port}`);
        return port;
      }
      
      console.log(`⚠️ Port ${port} is in use, trying next...`);
    }
    
    throw new Error(`Could not find available port starting from ${startPort} after ${maxAttempts} attempts`);
  }

  /**
   * Kill process using specific port
   */
  async killProcessOnPort(port) {
    try {
      console.log(`🔪 Attempting to kill process on port ${port}...`);
      
      if (process.platform === 'win32') {
        // Windows
        const { stdout } = await execAsync(`netstat -ano | findstr :${port}`);
        const lines = stdout.trim().split('\n');
        
        for (const line of lines) {
          const parts = line.trim().split(/\s+/);
          const pid = parts[parts.length - 1];
          
          if (pid && !isNaN(pid)) {
            try {
              await execAsync(`taskkill /F /PID ${pid}`);
              console.log(`✅ Killed process ${pid} on port ${port}`);
            } catch (killError) {
              console.warn(`⚠️ Could not kill process ${pid}:`, killError.message);
            }
          }
        }
      } else {
        // Unix-like systems
        const { stdout } = await execAsync(`lsof -ti :${port}`);
        const pids = stdout.trim().split('\n').filter(pid => pid);
        
        for (const pid of pids) {
          try {
            await execAsync(`kill -9 ${pid}`);
            console.log(`✅ Killed process ${pid} on port ${port}`);
          } catch (killError) {
            console.warn(`⚠️ Could not kill process ${pid}:`, killError.message);
          }
        }
      }
      
      // Wait a moment for the process to die
      await this.sleep(2000);
      
    } catch (error) {
      console.warn(`⚠️ Error killing process on port ${port}:`, error.message);
    }
  }

  /**
   * Start Expo web server on specified port
   */
  async startExpoWeb(port = null) {
    const targetPort = port || this.config.EXPO_WEB_PORT;
    
    // Check if port is available
    const portInUse = await this.isPortInUse(targetPort);
    if (portInUse) {
      console.log(`⚠️ Port ${targetPort} is in use, attempting to free it...`);
      await this.killProcessOnPort(targetPort);
    }
    
    // Find available port if needed
    const availablePort = await this.findAvailablePort(targetPort);
    
    return new Promise((resolve, reject) => {
      console.log(`🚀 Starting Expo web server on port ${availablePort}...`);
      
      const expoProcess = spawn('npx', ['expo', 'start', '--web', '--port', availablePort.toString(), '--no-dev', '--minify'], {
        stdio: ['pipe', 'pipe', 'pipe'],
        shell: true
      });

      let serverReady = false;
      let startupTimeout;

      // Set startup timeout
      startupTimeout = setTimeout(() => {
        if (!serverReady) {
          console.error('❌ Expo server startup timeout');
          expoProcess.kill();
          reject(new Error('Expo server startup timeout'));
        }
      }, 60000); // 60 second timeout

      expoProcess.stdout.on('data', (data) => {
        const output = data.toString();
        console.log(`[Expo] ${output}`);
        
        // Check for server ready indicators
        if (output.includes('Web is waiting on') || 
            output.includes('Local:') || 
            output.includes(`http://localhost:${availablePort}`)) {
          if (!serverReady) {
            serverReady = true;
            clearTimeout(startupTimeout);
            this.activeProcesses.set('expo-web', {
              process: expoProcess,
              port: availablePort,
              startTime: Date.now()
            });
            
            console.log(`✅ Expo web server ready on port ${availablePort}`);
            resolve({
              port: availablePort,
              process: expoProcess,
              url: `http://localhost:${availablePort}`
            });
          }
        }
      });

      expoProcess.stderr.on('data', (data) => {
        const output = data.toString();
        console.error(`[Expo Error] ${output}`);
        
        // Check for port conflict errors
        if (output.includes('EADDRINUSE') || output.includes('port')) {
          console.log('🔄 Port conflict detected, retrying...');
          expoProcess.kill();
          // Retry with next available port
          this.startExpoWeb(availablePort + 1).then(resolve).catch(reject);
        }
      });

      expoProcess.on('close', (code) => {
        clearTimeout(startupTimeout);
        if (!serverReady) {
          console.error(`❌ Expo process exited with code ${code}`);
          reject(new Error(`Expo process exited with code ${code}`));
        }
      });

      expoProcess.on('error', (error) => {
        clearTimeout(startupTimeout);
        console.error('❌ Failed to start Expo process:', error);
        reject(error);
      });
    });
  }

  /**
   * Wait for server to be ready
   */
  async waitForServer(url, maxWaitTime = 30000) {
    const startTime = Date.now();
    const checkInterval = 1000;
    
    console.log(`⏳ Waiting for server to be ready: ${url}`);
    
    while (Date.now() - startTime < maxWaitTime) {
      try {
        const response = await fetch(url, { 
          method: 'HEAD',
          timeout: 5000 
        });
        
        if (response.ok) {
          console.log(`✅ Server is ready: ${url}`);
          return true;
        }
      } catch (error) {
        // Server not ready yet, continue waiting
      }
      
      await this.sleep(checkInterval);
    }
    
    throw new Error(`Server did not become ready within ${maxWaitTime}ms: ${url}`);
  }

  /**
   * Clean up all active processes
   */
  async cleanup() {
    console.log('🧹 Cleaning up active processes...');
    
    const cleanupPromises = [];
    
    for (const [name, processInfo] of this.activeProcesses) {
      cleanupPromises.push(this.cleanupProcess(name, processInfo));
    }
    
    await Promise.all(cleanupPromises);
    this.activeProcesses.clear();
    
    // Additional cleanup for common testing ports
    const commonPorts = [
      this.config.EXPO_WEB_PORT,
      this.config.SELENIUM_HUB_PORT,
      this.config.CHROME_DEBUG_PORT,
      8081, // Metro bundler
      19000, // Expo dev tools
      19001, // Expo dev tools
      19002  // Expo dev tools
    ];
    
    for (const port of commonPorts) {
      const inUse = await this.isPortInUse(port);
      if (inUse) {
        await this.killProcessOnPort(port);
      }
    }
    
    console.log('✅ Cleanup completed');
  }

  /**
   * Clean up specific process
   */
  async cleanupProcess(name, processInfo) {
    try {
      console.log(`🧹 Cleaning up ${name} (PID: ${processInfo.process.pid})...`);
      
      // First try graceful shutdown
      processInfo.process.kill('SIGTERM');
      
      // Wait a moment
      await this.sleep(2000);
      
      // Force kill if still running
      if (!processInfo.process.killed) {
        processInfo.process.kill('SIGKILL');
      }
      
      // Clean up port if specified
      if (processInfo.port) {
        await this.killProcessOnPort(processInfo.port);
      }
      
      console.log(`✅ Cleaned up ${name}`);
    } catch (error) {
      console.warn(`⚠️ Error cleaning up ${name}:`, error.message);
    }
  }

  /**
   * Handle parallel testing port conflicts
   */
  async setupParallelTesting(testId) {
    const basePort = this.config.EXPO_WEB_PORT;
    const testPort = basePort + (testId * 10); // Spread ports apart
    
    console.log(`🔧 Setting up parallel testing for test ${testId} on port ${testPort}`);
    
    try {
      const serverInfo = await this.startExpoWeb(testPort);
      await this.waitForServer(serverInfo.url);
      
      return {
        testId,
        port: serverInfo.port,
        url: serverInfo.url,
        process: serverInfo.process
      };
    } catch (error) {
      console.error(`❌ Failed to setup parallel testing for test ${testId}:`, error);
      throw error;
    }
  }

  /**
   * Utility function to sleep
   */
  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Get system information for debugging
   */
  async getSystemInfo() {
    try {
      const platform = process.platform;
      const arch = process.arch;
      const nodeVersion = process.version;
      
      let portInfo = {};
      const ports = [
        this.config.EXPO_WEB_PORT,
        this.config.SELENIUM_HUB_PORT,
        this.config.CHROME_DEBUG_PORT
      ];
      
      for (const port of ports) {
        portInfo[port] = await this.isPortInUse(port);
      }
      
      return {
        platform,
        arch,
        nodeVersion,
        portInfo,
        activeProcesses: this.activeProcesses.size,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      return { error: error.message };
    }
  }
}

module.exports = PortManager;