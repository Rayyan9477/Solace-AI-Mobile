const mockTokenService = {
  isAuthenticated: jest.fn(),
  getTokens: jest.fn(),
  clearTokens: jest.fn(),
  invalidateSession: jest.fn(),
};

module.exports = {
  default: mockTokenService,
  __esModule: true,
};