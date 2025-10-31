/**
 * Mock Token Service for testing
 */

const tokenService = {
  storeTokens: jest.fn(),
  getTokens: jest.fn(),
  clearTokens: jest.fn(),
  isAuthenticated: jest.fn(),
  getAccessToken: jest.fn(),
  getRefreshToken: jest.fn(),
  isTokenExpired: jest.fn(),
  refreshAccessToken: jest.fn(),
  invalidateSession: jest.fn(),
  getTokenExpiration: jest.fn(),
  shouldRefreshToken: jest.fn(),
};

export default tokenService;
