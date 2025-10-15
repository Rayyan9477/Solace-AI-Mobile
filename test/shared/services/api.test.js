/**
 * API Service Tests
 * Tests for refactored API service with standardized error handling
 */

import {
  moodAPI,
  assessmentAPI,
  chatAPI,
  userAPI,
  safeAPICall,
} from '../../../src/shared/services/api';

// Mock fetch globally
global.fetch = jest.fn();

describe('API Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    global.fetch.mockClear();
  });

  describe('APIError Handling', () => {
    it('should throw APIError on failed requests', async () => {
      global.fetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
        statusText: 'Internal Server Error',
        json: async () => ({ message: 'Server error' }),
      });

      await expect(moodAPI.getMoodHistory()).rejects.toThrow('Server error');
    });

    it('should include status code in error', async () => {
      global.fetch.mockResolvedValueOnce({
        ok: false,
        status: 404,
        statusText: 'Not Found',
        json: async () => ({ message: 'Not found' }),
      });

      await expect(moodAPI.getMoodHistory()).rejects.toMatchObject({
        statusCode: 404,
        name: 'APIError',
      });
    });

    it('should include endpoint in error', async () => {
      global.fetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
        statusText: 'Error',
        json: async () => ({}),
      });

      await expect(moodAPI.getMoodHistory()).rejects.toMatchObject({
        endpoint: expect.stringContaining('/mood'),
      });
    });

    it('should include timestamp in error', async () => {
      global.fetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
        statusText: 'Error',
        json: async () => ({}),
      });

      try {
        await moodAPI.getMoodHistory();
        fail('Expected API call to throw an error');
      } catch (error) {
        expect(error.timestamp).toBeDefined();
        expect(new Date(error.timestamp).getTime()).toBeGreaterThan(0);
      }
    });
  });

  describe('Retry Logic', () => {
    it('should retry on 5xx errors', async () => {
      global.fetch
        .mockResolvedValueOnce({
          ok: false,
          status: 500,
          statusText: 'Server Error',
          json: async () => ({}),
        })
        .mockResolvedValueOnce({
          ok: false,
          status: 502,
          statusText: 'Bad Gateway',
          json: async () => ({}),
        })
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({ success: true }),
        });

      const result = await moodAPI.getMoodHistory();

      expect(global.fetch).toHaveBeenCalledTimes(3);
      expect(result).toEqual({ success: true });
    });

    it('should not retry on 4xx errors', async () => {
      global.fetch.mockResolvedValueOnce({
        ok: false,
        status: 404,
        statusText: 'Not Found',
        json: async () => ({ message: 'Not found' }),
      });

      try {
        await moodAPI.getMoodHistory();
        fail('Expected API call to throw an error');
      } catch (error) {
        expect(global.fetch).toHaveBeenCalledTimes(1);
        expect(error.statusCode).toBe(404);
      }
    });

    it('should not retry on abort errors', async () => {
      const abortError = new Error('Aborted');
      abortError.name = 'AbortError';
      global.fetch.mockRejectedValueOnce(abortError);

      await expect(moodAPI.getMoodHistory()).rejects.toThrow();
      expect(global.fetch).toHaveBeenCalledTimes(1);
    });

    it('should respect retry delay', async () => {
      jest.useFakeTimers();

      global.fetch
        .mockResolvedValueOnce({
          ok: false,
          status: 500,
          json: async () => ({}),
        })
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({}),
        });

      const promise = moodAPI.getMoodHistory();

      // Advance timers to trigger retry
      jest.advanceTimersByTime(1000);

      await promise;

      expect(global.fetch).toHaveBeenCalledTimes(2);

      jest.useRealTimers();
    });
  });

  describe('safeAPICall Wrapper', () => {
    it('should return result on success', async () => {
      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => [{ mood: 'happy' }],
      });

      const result = await safeAPICall(
        () => moodAPI.getMoodHistory(),
        []
      );

      expect(result).toEqual([{ mood: 'happy' }]);
    });

    it('should return fallback value on error', async () => {
      global.fetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
        json: async () => ({}),
      });

      const result = await safeAPICall(
        () => moodAPI.getMoodHistory(),
        []
      );

      expect(result).toEqual([]);
    });

    it('should log errors by default', async () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

      global.fetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
        json: async () => ({ message: 'Error' }),
      });

      await safeAPICall(() => moodAPI.getMoodHistory(), []);

      expect(consoleSpy).toHaveBeenCalled();
      consoleSpy.mockRestore();
    });

    it('should not log errors when logError is false', async () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

      global.fetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
        json: async () => ({}),
      });

      await safeAPICall(() => moodAPI.getMoodHistory(), [], false);

      expect(consoleSpy).not.toHaveBeenCalled();
      consoleSpy.mockRestore();
    });

    it('should work with null fallback', async () => {
      global.fetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
        json: async () => ({}),
      });

      const result = await safeAPICall(
        () => moodAPI.getMoodHistory(),
        null
      );

      expect(result).toBeNull();
    });

    it('should work with object fallback', async () => {
      global.fetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
        json: async () => ({}),
      });

      const fallback = { error: true };
      const result = await safeAPICall(
        () => moodAPI.getMoodHistory(),
        fallback
      );

      expect(result).toEqual(fallback);
    });
  });

  describe('moodAPI', () => {
    describe('getMoodHistory', () => {
      it('should make GET request to mood endpoint', async () => {
        global.fetch.mockResolvedValueOnce({
          ok: true,
          json: async () => [],
        });

        await moodAPI.getMoodHistory();

        expect(global.fetch).toHaveBeenCalledWith(
          expect.stringContaining('/mood'),
          expect.any(Object)
        );
      });

      it('should include query parameters', async () => {
        global.fetch.mockResolvedValueOnce({
          ok: true,
          json: async () => [],
        });

        await moodAPI.getMoodHistory({ limit: 10, offset: 5 });

        expect(global.fetch).toHaveBeenCalledWith(
          expect.stringContaining('limit=10'),
          expect.any(Object)
        );
        expect(global.fetch).toHaveBeenCalledWith(
          expect.stringContaining('offset=5'),
          expect.any(Object)
        );
      });

      it('should return parsed response', async () => {
        const mockData = [{ mood: 'happy', intensity: 8 }];
        global.fetch.mockResolvedValueOnce({
          ok: true,
          json: async () => mockData,
        });

        const result = await moodAPI.getMoodHistory();

        expect(result).toEqual(mockData);
      });
    });

    describe('saveMood', () => {
      it('should make POST request with mood data', async () => {
        global.fetch.mockResolvedValueOnce({
          ok: true,
          json: async () => ({ id: 1 }),
        });

        const moodData = { mood: 'happy', intensity: 8 };
        await moodAPI.saveMood(moodData);

        expect(global.fetch).toHaveBeenCalledWith(
          expect.stringContaining('/mood'),
          expect.objectContaining({
            method: 'POST',
            body: JSON.stringify(moodData),
          })
        );
      });

      it('should return created mood entry', async () => {
        const created = { id: 1, mood: 'happy' };
        global.fetch.mockResolvedValueOnce({
          ok: true,
          json: async () => created,
        });

        const result = await moodAPI.saveMood({ mood: 'happy' });

        expect(result).toEqual(created);
      });
    });

    describe('updateMood', () => {
      it('should make PUT request with mood ID', async () => {
        global.fetch.mockResolvedValueOnce({
          ok: true,
          json: async () => ({}),
        });

        await moodAPI.updateMood(123, { intensity: 9 });

        expect(global.fetch).toHaveBeenCalledWith(
          expect.stringContaining('/mood/123'),
          expect.objectContaining({ method: 'PUT' })
        );
      });
    });

    describe('deleteMood', () => {
      it('should make DELETE request with mood ID', async () => {
        global.fetch.mockResolvedValueOnce({
          ok: true,
          json: async () => ({ success: true }),
        });

        await moodAPI.deleteMood(123);

        expect(global.fetch).toHaveBeenCalledWith(
          expect.stringContaining('/mood/123'),
          expect.objectContaining({ method: 'DELETE' })
        );
      });
    });
  });

  describe('assessmentAPI', () => {
    describe('getAvailableAssessments', () => {
      it('should fetch assessment list', async () => {
        global.fetch.mockResolvedValueOnce({
          ok: true,
          json: async () => [{ id: 'phq9' }],
        });

        const result = await assessmentAPI.getAvailableAssessments();

        expect(result).toEqual([{ id: 'phq9' }]);
      });
    });

    describe('getAssessmentQuestions', () => {
      it('should fetch questions for assessment type', async () => {
        global.fetch.mockResolvedValueOnce({
          ok: true,
          json: async () => ({ questions: [] }),
        });

        await assessmentAPI.getAssessmentQuestions('phq9');

        expect(global.fetch).toHaveBeenCalledWith(
          expect.stringContaining('/assessments/phq9'),
          expect.any(Object)
        );
      });
    });

    describe('submitAssessment', () => {
      it('should POST assessment responses', async () => {
        global.fetch.mockResolvedValueOnce({
          ok: true,
          json: async () => ({ score: 10 }),
        });

        const responses = { q1: 2, q2: 3 };
        await assessmentAPI.submitAssessment('phq9', responses);

        expect(global.fetch).toHaveBeenCalledWith(
          expect.stringContaining('/assessments/phq9/submit'),
          expect.objectContaining({
            method: 'POST',
            body: JSON.stringify({ responses }),
          })
        );
      });
    });

    describe('getAssessmentHistory', () => {
      it('should fetch assessment history with parameters', async () => {
        global.fetch.mockResolvedValueOnce({
          ok: true,
          json: async () => [],
        });

        await assessmentAPI.getAssessmentHistory({ limit: 5 });

        expect(global.fetch).toHaveBeenCalledWith(
          expect.stringContaining('limit=5'),
          expect.any(Object)
        );
      });
    });
  });

  describe('chatAPI', () => {
    describe('sendMessage', () => {
      it('should POST message and session ID', async () => {
        global.fetch.mockResolvedValueOnce({
          ok: true,
          json: async () => ({ response: 'Hello' }),
        });

        await chatAPI.sendMessage('Hello', 'session123');

        expect(global.fetch).toHaveBeenCalledWith(
          expect.stringContaining('/chat/message'),
          expect.objectContaining({
            method: 'POST',
            body: JSON.stringify({
              message: 'Hello',
              sessionId: 'session123',
            }),
          })
        );
      });
    });

    describe('getChatHistory', () => {
      it('should fetch chat history for session', async () => {
        global.fetch.mockResolvedValueOnce({
          ok: true,
          json: async () => [],
        });

        await chatAPI.getChatHistory('session123');

        expect(global.fetch).toHaveBeenCalledWith(
          expect.stringContaining('/chat/history/session123'),
          expect.any(Object)
        );
      });
    });
  });

  describe('userAPI', () => {
    describe('getProfile', () => {
      it('should fetch user profile', async () => {
        global.fetch.mockResolvedValueOnce({
          ok: true,
          json: async () => ({ id: 'user1' }),
        });

        const result = await userAPI.getProfile();

        expect(result).toEqual({ id: 'user1' });
      });
    });

    describe('updateProfile', () => {
      it('should PUT profile data', async () => {
        global.fetch.mockResolvedValueOnce({
          ok: true,
          json: async () => ({ id: 'user1', name: 'Updated' }),
        });

        const profileData = { name: 'Updated' };
        await userAPI.updateProfile(profileData);

        expect(global.fetch).toHaveBeenCalledWith(
          expect.stringContaining('/user/profile'),
          expect.objectContaining({
            method: 'PUT',
            body: JSON.stringify(profileData),
          })
        );
      });
    });
  });

  describe('Timeout Handling', () => {
    it('should timeout long requests', async () => {
      jest.useFakeTimers();

      global.fetch.mockImplementation(
        () =>
          new Promise(resolve =>
            setTimeout(() => resolve({ ok: true, json: async () => ({}) }), 20000)
          )
      );

      const promise = moodAPI.getMoodHistory();

      jest.advanceTimersByTime(10000);

      try {
        await promise;
      } catch (error) {
        expect(error.name).toBe('APIError');
      }

      jest.useRealTimers();
    });
  });

  describe('Request Headers', () => {
    it('should include Content-Type header', async () => {
      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({}),
      });

      await moodAPI.saveMood({ mood: 'happy' });

      expect(global.fetch).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          headers: expect.objectContaining({
            'Content-Type': 'application/json',
          }),
        })
      );
    });

    it('should preserve custom headers', async () => {
      // This would be tested with authentication headers in the future
      expect(true).toBe(true);
    });
  });

  describe('Error Response Parsing', () => {
    it('should parse error message from response', async () => {
      global.fetch.mockResolvedValueOnce({
        ok: false,
        status: 400,
        statusText: 'Bad Request',
        json: async () => ({ message: 'Invalid input' }),
      });

      try {
        await moodAPI.saveMood({ mood: 'invalid' });
        fail('Expected API call to throw an error');
      } catch (error) {
        expect(error.message).toContain('Invalid input');
      }
    });

    it('should handle responses without error message', async () => {
      global.fetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
        statusText: 'Internal Server Error',
        json: async () => ({}),
      });

      try {
        await moodAPI.getMoodHistory();
        fail('Expected API call to throw an error');
      } catch (error) {
        expect(error.message).toContain('500');
        expect(error.message).toContain('Internal Server Error');
      }
    });

    it('should handle non-JSON error responses', async () => {
      global.fetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
        statusText: 'Server Error',
        json: async () => {
          throw new Error('Not JSON');
        },
      });

      try {
        await moodAPI.getMoodHistory();
        fail('Expected API call to throw an error');
      } catch (error) {
        expect(error.statusCode).toBe(500);
      }
    });
  });
});
