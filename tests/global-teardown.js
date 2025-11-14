/**
 * Playwright Global Teardown
 * Runs once after all tests
 */

module.exports = async (config) => {
  console.log('');
  console.log('🏁 All tests completed');
  console.log('📊 Check test-results/ for detailed reports');
  
  // You can add global cleanup logic here:
  // - Stop mock servers
  // - Clean up test databases
  // - Archive test results
};
