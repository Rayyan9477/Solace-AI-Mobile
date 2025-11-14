/**
 * Playwright Global Setup
 * Runs once before all tests
 */

module.exports = async (config) => {
  console.log('🚀 Starting Playwright test suite for Solace AI Mobile...');
  console.log('📱 Testing mental health app UI and functionality');
  console.log(`🌐 Base URL: ${config?.use?.baseURL || 'http://localhost:8081'}`);
  console.log('');
  
  // You can add global setup logic here:
  // - Start mock servers
  // - Set up test databases
  // - Initialize test data
  
  console.log('✅ Global setup complete');
};
