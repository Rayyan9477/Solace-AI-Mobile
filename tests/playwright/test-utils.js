// tests/playwright/test-utils.js
// Testing utilities for Solace AI Mobile MCP testing environment

const fs = require('fs');
const path = require('path');

/**
 * Test Reporter Integration
 * Connects to existing test reporting system
 */
class TestReporter {
  constructor() {
    this.reports = [];
    this.startTime = Date.now();
    this.reportDir = path.resolve('./test-reports');
    this.ensureReportDirectory();
  }

  ensureReportDirectory() {
    if (!fs.existsSync(this.reportDir)) {
      fs.mkdirSync(this.reportDir, { recursive: true });
    }
  }

  /**
   * Add a test result to the report
   */
  addTestResult(testResult) {
    const result = {
      ...testResult,
      timestamp: new Date().toISOString(),
      duration: testResult.duration || 0,
      id: `playwright-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    };

    this.reports.push(result);
    return result.id;
  }

  /**
   * Generate comprehensive test report
   */
  generateReport() {
    const endTime = Date.now();
    const totalDuration = endTime - this.startTime;

    const summary = {
      totalTests: this.reports.length,
      passed: this.reports.filter(r => r.status === 'passed').length,
      failed: this.reports.filter(r => r.status === 'failed').length,
      skipped: this.reports.filter(r => r.status === 'skipped').length,
      duration: totalDuration,
      startTime: new Date(this.startTime).toISOString(),
      endTime: new Date(endTime).toISOString(),
    };

    const report = {
      summary,
      tests: this.reports,
      environment: {
        platform: process.platform,
        nodeVersion: process.version,
        testFramework: 'playwright',
        project: 'solace-ai-mobile',
      },
      metadata: {
        generated: new Date().toISOString(),
        version: '1.0.0',
        type: 'playwright-mcp-report',
      }
    };

    return report;
  }

  /**
   * Save report to file
   */
  async saveReport(filename = 'playwright-mcp-report.json') {
    const report = this.generateReport();
    const filePath = path.join(this.reportDir, filename);

    try {
      fs.writeFileSync(filePath, JSON.stringify(report, null, 2));
      console.log(`📊 Test report saved to: ${filePath}`);
      
      // Also generate HTML report
      await this.generateHtmlReport(report);
      
      return filePath;
    } catch (error) {
      console.error('Failed to save test report:', error);
      throw error;
    }
  }

  /**
   * Generate HTML report
   */
  async generateHtmlReport(report) {
    const htmlContent = this.generateHtmlContent(report);
    const htmlPath = path.join(this.reportDir, 'playwright-mcp-report.html');

    try {
      fs.writeFileSync(htmlPath, htmlContent);
      console.log(`📄 HTML report saved to: ${htmlPath}`);
    } catch (error) {
      console.warn('Failed to generate HTML report:', error);
    }
  }

  generateHtmlContent(report) {
    const { summary, tests } = report;
    const passRate = summary.totalTests > 0 ? (summary.passed / summary.totalTests * 100).toFixed(1) : 0;

    return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Solace AI Mobile - Playwright MCP Test Report</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            margin: 0;
            padding: 20px;
            background-color: #f5f5f5;
        }
        .header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 30px;
            border-radius: 10px;
            margin-bottom: 30px;
        }
        .summary {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 20px;
            margin-bottom: 30px;
        }
        .summary-card {
            background: white;
            padding: 20px;
            border-radius: 10px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            text-align: center;
        }
        .summary-card h3 {
            margin: 0 0 10px 0;
            color: #333;
        }
        .summary-card .number {
            font-size: 2em;
            font-weight: bold;
            margin: 10px 0;
        }
        .passed { color: #10b981; }
        .failed { color: #ef4444; }
        .skipped { color: #f59e0b; }
        .total { color: #6366f1; }
        .tests-table {
            background: white;
            border-radius: 10px;
            overflow: hidden;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }
        table {
            width: 100%;
            border-collapse: collapse;
        }
        th, td {
            padding: 15px;
            text-align: left;
            border-bottom: 1px solid #e5e7eb;
        }
        th {
            background-color: #f9fafb;
            font-weight: 600;
            color: #374151;
        }
        .status-badge {
            padding: 4px 12px;
            border-radius: 20px;
            font-size: 0.875rem;
            font-weight: 500;
        }
        .status-passed {
            background-color: #d1fae5;
            color: #065f46;
        }
        .status-failed {
            background-color: #fee2e2;
            color: #991b1b;
        }
        .status-skipped {
            background-color: #fef3c7;
            color: #92400e;
        }
        .duration {
            color: #6b7280;
            font-size: 0.875rem;
        }
        .error-details {
            background-color: #fef2f2;
            border: 1px solid #fecaca;
            border-radius: 6px;
            padding: 10px;
            margin-top: 10px;
            font-family: monospace;
            font-size: 0.875rem;
            color: #991b1b;
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>🧪 Solace AI Mobile - Playwright MCP Test Report</h1>
        <p>Generated on ${new Date().toLocaleString()}</p>
        <p>Test Duration: ${Math.round(summary.duration / 1000)}s | Pass Rate: ${passRate}%</p>
    </div>

    <div class="summary">
        <div class="summary-card">
            <h3>Total Tests</h3>
            <div class="number total">${summary.totalTests}</div>
        </div>
        <div class="summary-card">
            <h3>Passed</h3>
            <div class="number passed">${summary.passed}</div>
        </div>
        <div class="summary-card">
            <h3>Failed</h3>
            <div class="number failed">${summary.failed}</div>
        </div>
        <div class="summary-card">
            <h3>Skipped</h3>
            <div class="number skipped">${summary.skipped}</div>
        </div>
    </div>

    <div class="tests-table">
        <table>
            <thead>
                <tr>
                    <th>Test Name</th>
                    <th>Status</th>
                    <th>Duration</th>
                    <th>Device/Browser</th>
                    <th>Details</th>
                </tr>
            </thead>
            <tbody>
                ${tests.map(test => `
                    <tr>
                        <td>${test.testName || test.title || 'Unknown Test'}</td>
                        <td>
                            <span class="status-badge status-${test.status || 'unknown'}">
                                ${(test.status || 'unknown').toUpperCase()}
                            </span>
                        </td>
                        <td class="duration">${test.duration || 0}ms</td>
                        <td>${test.device || test.browser || 'Unknown'}</td>
                        <td>
                            ${test.error ? `<div class="error-details">${test.error}</div>` : ''}
                            ${test.screenshots ? `<small>📸 ${test.screenshots.length} screenshots</small>` : ''}
                        </td>
                    </tr>
                `).join('')}
            </tbody>
        </table>
    </div>
</body>
</html>`;
  }
}

/**
 * Device Configuration Utilities
 */
class DeviceConfig {
  static getDeviceViewports() {
    return {
      'iphone-se': { width: 375, height: 667, mobile: true, touch: true },
      'iphone-14-pro': { width: 393, height: 852, mobile: true, touch: true },
      'iphone-14-pro-max': { width: 430, height: 932, mobile: true, touch: true },
      'samsung-galaxy-s21': { width: 360, height: 800, mobile: true, touch: true },
      'samsung-galaxy-s21-ultra': { width: 384, height: 854, mobile: true, touch: true },
      'pixel-7': { width: 412, height: 915, mobile: true, touch: true },
      'pixel-7-pro': { width: 412, height: 892, mobile: true, touch: true },
      'ipad': { width: 768, height: 1024, mobile: false, touch: true },
      'ipad-pro': { width: 1024, height: 1366, mobile: false, touch: true },
      'desktop': { width: 1280, height: 720, mobile: false, touch: false },
      'desktop-large': { width: 1920, height: 1080, mobile: false, touch: false },
    };
  }

  static getMobileDevices() {
    const viewports = this.getDeviceViewports();
    return Object.entries(viewports)
      .filter(([_, config]) => config.mobile)
      .map(([name, config]) => ({ name, ...config }));
  }

  static getDesktopDevices() {
    const viewports = this.getDeviceViewports();
    return Object.entries(viewports)
      .filter(([_, config]) => !config.mobile)
      .map(([name, config]) => ({ name, ...config }));
  }
}

/**
 * Error Handling Utilities
 */
class ErrorHandler {
  static async handleTestError(error, page, testName) {
    const errorInfo = {
      message: error.message,
      stack: error.stack,
      testName,
      url: page?.url() || 'unknown',
      timestamp: new Date().toISOString(),
    };

    // Take screenshot on error
    if (page) {
      try {
        const screenshotPath = `./test-results/playwright/error-screenshots/${testName}-${Date.now()}.png`;
        await page.screenshot({ path: screenshotPath, fullPage: true });
        errorInfo.screenshot = screenshotPath;
        console.log(`📸 Error screenshot saved: ${screenshotPath}`);
      } catch (screenshotError) {
        console.warn('Failed to take error screenshot:', screenshotError.message);
      }
    }

    // Log error details
    console.error('❌ Test Error Details:', errorInfo);

    return errorInfo;
  }

  static async collectDebugInfo(page) {
    try {
      const debugInfo = {
        url: page.url(),
        title: await page.title(),
        viewport: page.viewportSize(),
        cookies: await page.context().cookies(),
        localStorage: await page.evaluate(() => {
          try {
            return JSON.stringify(localStorage);
          } catch {
            return 'Unable to access localStorage';
          }
        }),
        sessionStorage: await page.evaluate(() => {
          try {
            return JSON.stringify(sessionStorage);
          } catch {
            return 'Unable to access sessionStorage';
          }
        }),
        userAgent: await page.evaluate(() => navigator.userAgent),
        timestamp: new Date().toISOString(),
      };

      return debugInfo;
    } catch (error) {
      console.warn('Failed to collect debug info:', error.message);
      return { error: error.message };
    }
  }
}

/**
 * Port Management Utilities
 */
class PortManager {
  static async findAvailablePort(startPort = 3000, maxAttempts = 100) {
    const net = require('net');
    
    for (let port = startPort; port < startPort + maxAttempts; port++) {
      if (await this.isPortAvailable(port)) {
        return port;
      }
    }
    
    throw new Error(`No available port found in range ${startPort}-${startPort + maxAttempts}`);
  }

  static async isPortAvailable(port) {
    return new Promise((resolve) => {
      const server = net.createServer();
      
      server.listen(port, () => {
        server.once('close', () => resolve(true));
        server.close();
      });
      
      server.on('error', () => resolve(false));
    });
  }

  static async waitForPortToBeReady(port, timeout = 30000) {
    const startTime = Date.now();
    
    while (Date.now() - startTime < timeout) {
      if (!await this.isPortAvailable(port)) {
        return true; // Port is in use, meaning service is ready
      }
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
    
    throw new Error(`Port ${port} did not become ready within ${timeout}ms`);
  }
}

/**
 * Test Data Utilities
 */
class TestData {
  static getTestCredentials() {
    return {
      valid: {
        email: 'test@solace-ai.com',
        password: 'TestPassword123!'
      },
      invalid: {
        email: 'invalid@example.com',
        password: 'wrongpassword'
      },
      demo: {
        email: 'demo@solace-ai.com',
        password: 'DemoUser123!'
      }
    };
  }

  static getTestUser() {
    return {
      name: 'Test User',
      email: 'test@solace-ai.com',
      age: 28,
      preferences: {
        theme: 'light',
        notifications: true,
        privacy: 'standard'
      }
    };
  }

  static getMoodTestData() {
    return [
      { mood: 'happy', intensity: 4, activity: 'exercise', notes: 'Great workout today!' },
      { mood: 'anxious', intensity: 2, activity: 'work', notes: 'Stressful meeting' },
      { mood: 'calm', intensity: 5, activity: 'meditation', notes: 'Peaceful morning session' },
      { mood: 'sad', intensity: 2, activity: 'social', notes: 'Missing friends' },
    ];
  }
}

module.exports = {
  TestReporter,
  DeviceConfig,
  ErrorHandler,
  PortManager,
  TestData,
};