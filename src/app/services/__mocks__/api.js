/**
 * Mock API Service for testing
 */

const mockAuthAPI = {
  login: jest.fn(),
  register: jest.fn(),
  refreshToken: jest.fn(),
  logout: jest.fn(),
  getProfile: jest.fn(),
  updateProfile: jest.fn(),
  changePassword: jest.fn(),
  requestPasswordReset: jest.fn(),
  resetPassword: jest.fn(),
};

const mockUserAPI = {
  getPreferences: jest.fn(),
  updatePreferences: jest.fn(),
  deleteAccount: jest.fn(),
};

const apiService = {
  auth: mockAuthAPI,
  user: mockUserAPI,
};

export default apiService;
