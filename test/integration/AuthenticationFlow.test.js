/**
 * Authentication Flow Integration Test
 * Tests signup and login functionality with mock auth service
 */

describe('Authentication Flow', () => {
  const mockAuthService = require('../../src/shared/services/mockAuthService').default;
  
  beforeEach(async () => {
    // Clear all users before each test
    await mockAuthService.clearAllUsers();
  });

  describe('User Signup', () => {
    test('should create a new user successfully', async () => {
      const email = 'test@example.com';
      const password = 'Test123!@#';
      const name = 'Test User';

      const response = await mockAuthService.register(email, password, name);

      expect(response).toBeDefined();
      expect(response.user).toBeDefined();
      expect(response.user.email).toBe(email.toLowerCase());
      expect(response.user.name).toBe(name);
      expect(response.user.id).toContain('user_');
      expect(response.access_token).toBeDefined();
      expect(response.refresh_token).toBeDefined();
      expect(response.expires_in).toBe(3600);
    });

    test('should prevent duplicate email registration', async () => {
      const email = 'duplicate@example.com';
      const password = 'Test123!@#';
      const name = 'First User';

      // First registration should succeed
      await mockAuthService.register(email, password, name);

      // Second registration with same email should fail
      await expect(
        mockAuthService.register(email, 'DifferentPass123!', 'Second User')
      ).rejects.toThrow('An account with this email already exists');
    });

    test('should store user in AsyncStorage', async () => {
      const email = 'storage@example.com';
      const password = 'Test123!@#';
      const name = 'Storage Test';

      await mockAuthService.register(email, password, name);

      const users = await mockAuthService.getAllUsers();
      expect(users).toHaveLength(1);
      expect(users[0].email).toBe(email.toLowerCase());
      expect(users[0].name).toBe(name);
    });

    test('should handle email case-insensitivity', async () => {
      const email = 'UPPERCASE@EXAMPLE.COM';
      const password = 'Test123!@#';
      const name = 'Case Test';

      const response = await mockAuthService.register(email, password, name);

      expect(response.user.email).toBe('uppercase@example.com');
      
      // Should prevent duplicate even with different case
      await expect(
        mockAuthService.register('uppercase@example.com', password, name)
      ).rejects.toThrow('An account with this email already exists');
    });
  });

  describe('User Login', () => {
    beforeEach(async () => {
      // Create a test user before each login test
      await mockAuthService.register('login@example.com', 'Test123!@#', 'Login User');
    });

    test('should login with valid credentials', async () => {
      const response = await mockAuthService.login('login@example.com', 'Test123!@#');

      expect(response).toBeDefined();
      expect(response.user).toBeDefined();
      expect(response.user.email).toBe('login@example.com');
      expect(response.user.name).toBe('Login User');
      expect(response.access_token).toBeDefined();
      expect(response.refresh_token).toBeDefined();
    });

    test('should fail with invalid email', async () => {
      await expect(
        mockAuthService.login('nonexistent@example.com', 'Test123!@#')
      ).rejects.toThrow('Invalid email or password');
    });

    test('should fail with invalid password', async () => {
      await expect(
        mockAuthService.login('login@example.com', 'WrongPassword123!')
      ).rejects.toThrow('Invalid email or password');
    });

    test('should handle email case-insensitivity on login', async () => {
      const response = await mockAuthService.login('LOGIN@EXAMPLE.COM', 'Test123!@#');
      expect(response.user.email).toBe('login@example.com');
    });

    test('should update lastLogin timestamp', async () => {
      const users1 = await mockAuthService.getAllUsers();
      const initialLastLogin = users1[0].lastLogin;

      // Wait a bit to ensure timestamp difference
      await new Promise(resolve => setTimeout(resolve, 100));

      await mockAuthService.login('login@example.com', 'Test123!@#');

      const users2 = await mockAuthService.getAllUsers();
      const updatedLastLogin = users2[0].lastLogin;

      expect(updatedLastLogin).toBeDefined();
      expect(new Date(updatedLastLogin).getTime()).toBeGreaterThan(
        new Date(initialLastLogin).getTime()
      );
    });

    test('should set current user after login', async () => {
      await mockAuthService.login('login@example.com', 'Test123!@#');

      const currentUser = await mockAuthService.getCurrentUser();
      expect(currentUser).toBeDefined();
      expect(currentUser.email).toBe('login@example.com');
      expect(currentUser.name).toBe('Login User');
    });
  });

  describe('User Session', () => {
    beforeEach(async () => {
      await mockAuthService.register('session@example.com', 'Test123!@#', 'Session User');
      await mockAuthService.login('session@example.com', 'Test123!@#');
    });

    test('should retrieve current user', async () => {
      const currentUser = await mockAuthService.getCurrentUser();
      
      expect(currentUser).toBeDefined();
      expect(currentUser.email).toBe('session@example.com');
      expect(currentUser.name).toBe('Session User');
      expect(currentUser.password).toBeUndefined(); // Password should not be returned
    });

    test('should check authentication status', async () => {
      const isAuth = await mockAuthService.isAuthenticated();
      expect(isAuth).toBe(true);
    });

    test('should logout successfully', async () => {
      await mockAuthService.logout();

      const isAuth = await mockAuthService.isAuthenticated();
      expect(isAuth).toBe(false);

      const currentUser = await mockAuthService.getCurrentUser();
      expect(currentUser).toBeNull();
    });

    test('should return null for current user when not authenticated', async () => {
      await mockAuthService.logout();
      
      const currentUser = await mockAuthService.getCurrentUser();
      expect(currentUser).toBeNull();
    });
  });

  describe('Token Management', () => {
    test('should generate valid token format', async () => {
      const response = await mockAuthService.register('token@example.com', 'Test123!@#', 'Token User');
      
      // JWT tokens have base64-encoded parts which can include '=' padding
      expect(response.access_token).toMatch(/^[A-Za-z0-9+/=]+\.[A-Za-z0-9+/=]+\.[A-Za-z0-9-]+$/);
      expect(response.refresh_token).toMatch(/^[A-Za-z0-9+/=]+\.[A-Za-z0-9+/=]+\.[A-Za-z0-9-]+$/);
    });

    test('should verify valid tokens', async () => {
      const response = await mockAuthService.register('verify@example.com', 'Test123!@#', 'Verify User');
      
      const decoded = await mockAuthService.verifyToken(response.access_token);
      expect(decoded).toBeDefined();
      expect(decoded.userId).toContain('user_');
      expect(decoded.exp).toBeDefined();
    });

    test('should reject expired tokens', async () => {
      // Create a token that's already expired
      const expiredToken = 'header.' + Buffer.from(JSON.stringify({
        userId: 'user_123',
        exp: Date.now() - 1000 // 1 second ago
      })).toString('base64') + '.signature';

      await expect(mockAuthService.verifyToken(expiredToken)).rejects.toThrow('Token expired');
    });

    test('should reject invalid token format', async () => {
      await expect(mockAuthService.verifyToken('invalid')).rejects.toThrow('Invalid token format');
    });
  });

  describe('Multiple Users', () => {
    test('should handle multiple user registrations', async () => {
      await mockAuthService.register('user1@example.com', 'Test123!@#', 'User One');
      await mockAuthService.register('user2@example.com', 'Test123!@#', 'User Two');
      await mockAuthService.register('user3@example.com', 'Test123!@#', 'User Three');

      const users = await mockAuthService.getAllUsers();
      expect(users).toHaveLength(3);
      expect(users.map(u => u.email)).toContain('user1@example.com');
      expect(users.map(u => u.email)).toContain('user2@example.com');
      expect(users.map(u => u.email)).toContain('user3@example.com');
    });

    test('should maintain separate sessions', async () => {
      await mockAuthService.register('user1@example.com', 'Test123!@#', 'User One');
      await mockAuthService.register('user2@example.com', 'Test123!@#', 'User Two');

      // Login as user1
      await mockAuthService.login('user1@example.com', 'Test123!@#');
      let currentUser = await mockAuthService.getCurrentUser();
      expect(currentUser.email).toBe('user1@example.com');

      // Login as user2
      await mockAuthService.login('user2@example.com', 'Test123!@#');
      currentUser = await mockAuthService.getCurrentUser();
      expect(currentUser.email).toBe('user2@example.com');
    });
  });

  describe('Edge Cases', () => {
    test('should handle empty credentials', async () => {
      await expect(mockAuthService.register('', '', '')).rejects.toThrow();
    });

    test('should handle special characters in name', async () => {
      const response = await mockAuthService.register(
        'special@example.com',
        'Test123!@#',
        'User O\'Brien-Smith 李明'
      );
      expect(response.user.name).toBe('User O\'Brien-Smith 李明');
    });

    test('should clear all users successfully', async () => {
      await mockAuthService.register('user1@example.com', 'Test123!@#', 'User One');
      await mockAuthService.register('user2@example.com', 'Test123!@#', 'User Two');

      await mockAuthService.clearAllUsers();

      const users = await mockAuthService.getAllUsers();
      expect(users).toHaveLength(0);

      const isAuth = await mockAuthService.isAuthenticated();
      expect(isAuth).toBe(false);
    });
  });
});
