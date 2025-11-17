/**
 * Mock Authentication Service
 * Provides local authentication for development and testing
 * Stores user data in AsyncStorage (web: localStorage, native: AsyncStorage)
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import { logger } from '@shared/utils/logger';

const USERS_STORAGE_KEY = '@solace_users';
const CURRENT_USER_KEY = '@solace_current_user';

export interface User {
  id: string;
  email: string;
  name: string;
  password: string; // In production, this would be hashed
  createdAt: string;
  lastLogin?: string;
}

export interface AuthResponse {
  user: Omit<User, 'password'>;
  access_token: string;
  refresh_token: string;
  expires_in: number;
}

/**
 * Simple hash function for passwords (NOT for production use)
 */
const simpleHash = (str: string): string => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return hash.toString(36);
};

/**
 * Generate a mock JWT token
 */
const generateToken = (userId: string): string => {
  const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
  const payload = btoa(JSON.stringify({ 
    userId, 
    exp: Date.now() + (3600 * 1000), // 1 hour
    iat: Date.now() 
  }));
  const signature = simpleHash(`${header}.${payload}`);
  return `${header}.${payload}.${signature}`;
};

/**
 * Get all users from storage
 */
const getUsers = async (): Promise<User[]> => {
  try {
    const usersJson = await AsyncStorage.getItem(USERS_STORAGE_KEY);
    return usersJson ? JSON.parse(usersJson) : [];
  } catch (error) {
    logger.error('Failed to get users from storage:', error);
    return [];
  }
};

/**
 * Save users to storage
 */
const saveUsers = async (users: User[]): Promise<void> => {
  try {
    await AsyncStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
  } catch (error) {
    logger.error('Failed to save users to storage:', error);
    throw new Error('Failed to save user data');
  }
};

/**
 * Mock Authentication Service
 */
const mockAuthService = {
  /**
   * Register a new user
   */
  async register(email: string, password: string, name?: string): Promise<AuthResponse> {
    try {
      // Validate credentials
      if (!email || !email.trim() || !password || !password.trim()) {
        throw new Error('Email and password are required');
      }
      
      const users = await getUsers();
      
      // Check if user already exists
      const existingUser = users.find(u => u.email.toLowerCase() === email.toLowerCase());
      if (existingUser) {
        throw new Error('An account with this email already exists');
      }

      // Create new user
      const newUser: User = {
        id: `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        email: email.toLowerCase(),
        name: name || email.split('@')[0],
        password: simpleHash(password),
        createdAt: new Date().toISOString(),
        lastLogin: new Date().toISOString(),
      };

      // Save user
      users.push(newUser);
      await saveUsers(users);

      // Generate tokens
      const access_token = generateToken(newUser.id);
      const refresh_token = generateToken(`${newUser.id}_refresh`);

      // Remove password from response
      const { password: _, ...userWithoutPassword } = newUser;

      logger.info('User registered successfully:', newUser.email);

      return {
        user: userWithoutPassword,
        access_token,
        refresh_token,
        expires_in: 3600,
      };
    } catch (error: any) {
      logger.error('Registration failed:', error);
      throw error;
    }
  },

  /**
   * Login user
   */
  async login(email: string, password: string): Promise<AuthResponse> {
    try {
      const users = await getUsers();
      
      // Find user
      const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());
      if (!user) {
        throw new Error('Invalid email or password');
      }

      // Verify password
      const hashedPassword = simpleHash(password);
      if (user.password !== hashedPassword) {
        throw new Error('Invalid email or password');
      }

      // Update last login
      user.lastLogin = new Date().toISOString();
      await saveUsers(users);

      // Generate tokens
      const access_token = generateToken(user.id);
      const refresh_token = generateToken(`${user.id}_refresh`);

      // Store current user
      await AsyncStorage.setItem(CURRENT_USER_KEY, JSON.stringify({ userId: user.id }));

      // Remove password from response
      const { password: _, ...userWithoutPassword } = user;

      logger.info('User logged in successfully:', user.email);

      return {
        user: userWithoutPassword,
        access_token,
        refresh_token,
        expires_in: 3600,
      };
    } catch (error: any) {
      logger.error('Login failed:', error);
      throw error;
    }
  },

  /**
   * Logout user
   */
  async logout(): Promise<void> {
    try {
      await AsyncStorage.removeItem(CURRENT_USER_KEY);
      logger.info('User logged out successfully');
    } catch (error) {
      logger.error('Logout failed:', error);
      throw error;
    }
  },

  /**
   * Get current user
   */
  async getCurrentUser(): Promise<Omit<User, 'password'> | null> {
    try {
      const currentUserJson = await AsyncStorage.getItem(CURRENT_USER_KEY);
      if (!currentUserJson) {
        return null;
      }

      const { userId } = JSON.parse(currentUserJson);
      const users = await getUsers();
      const user = users.find(u => u.id === userId);

      if (!user) {
        await AsyncStorage.removeItem(CURRENT_USER_KEY);
        return null;
      }

      const { password: _, ...userWithoutPassword } = user;
      return userWithoutPassword;
    } catch (error) {
      logger.error('Failed to get current user:', error);
      return null;
    }
  },

  /**
   * Check if user is authenticated
   */
  async isAuthenticated(): Promise<boolean> {
    try {
      const currentUser = await this.getCurrentUser();
      return currentUser !== null;
    } catch (error) {
      return false;
    }
  },

  /**
   * Verify token (mock implementation)
   */
  async verifyToken(token: string): Promise<{ userId: string; exp: number; iat: number }> {
    try {
      const parts = token.split('.');
      if (parts.length !== 3) {
        throw new Error('Invalid token format');
      }

      const payload = JSON.parse(atob(parts[1]));
      if (payload.exp <= Date.now()) {
        throw new Error('Token expired');
      }
      
      return payload;
    } catch (error: any) {
      throw error.message ? error : new Error('Invalid token');
    }
  },

  /**
   * Get all registered users (for debugging)
   */
  async getAllUsers(): Promise<Omit<User, 'password'>[]> {
    try {
      const users = await getUsers();
      return users.map(({ password, ...user }) => user);
    } catch (error) {
      logger.error('Failed to get all users:', error);
      return [];
    }
  },

  /**
   * Clear all users (for testing)
   */
  async clearAllUsers(): Promise<void> {
    try {
      await AsyncStorage.removeItem(USERS_STORAGE_KEY);
      await AsyncStorage.removeItem(CURRENT_USER_KEY);
      logger.info('All users cleared');
    } catch (error) {
      logger.error('Failed to clear users:', error);
      throw error;
    }
  },
};

export default mockAuthService;
