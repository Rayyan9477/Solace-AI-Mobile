/**
 * Mock Secure Storage Service for testing
 */

const secureStorage = {
  storeSecureData: jest.fn(),
  getSecureData: jest.fn(),
  removeSecureData: jest.fn(),
  clearAllSecureData: jest.fn(),
  getAllKeys: jest.fn(),
  hasData: jest.fn(),
  storeSensitiveData: jest.fn(),
  storeData: jest.fn(),
  migrateData: jest.fn(),
};

export default secureStorage;
