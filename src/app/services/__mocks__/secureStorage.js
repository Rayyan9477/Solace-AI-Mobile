const mockSecureStorage = {
  storeSecureData: jest.fn(),
  getSecureData: jest.fn(),
  removeSecureData: jest.fn(),
};

module.exports = {
  default: mockSecureStorage,
  __esModule: true,
};