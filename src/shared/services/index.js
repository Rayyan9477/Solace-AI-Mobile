/**
 * Services Module Exports
 * External service integrations
 */

// Mock services for now
export const apiService = {
  mood: {
    async logMood(data) {
      console.log('Mock mood logging:', data);
      return { id: Date.now().toString(), ...data };
    },
  },
  user: {
    async getProfile() {
      console.log('Mock user profile fetch');
      return { id: '1', name: 'Test User' };
    },
  },
};
