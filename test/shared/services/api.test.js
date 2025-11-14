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

describe('API Service', () => {
  beforeEach(() => {
    // Reset fetch mock for each test
    global.fetch = jest.fn();
    jest.clearAllTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  describe('APIError Handling', () => {
    it('should throw APIError on failed requests', async () => {
      // Mock 3 failed responses (API retries 3 times on 5xx errors)
      global.fetch
        .mockResolvedValueOnce({
          ok: false,
          status: 500,
          statusText: 'Internal Server Error',
          json: async () => ({ message: 'Server error' }),
        })
        .mockResolvedValueOnce({
          ok: false,
          status: 500,
          statusText: 'Internal Server Error',
          json: async () => ({ message: 'Server error' }),
        })
        .mockResolvedValueOnce({
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
      // Mock 3 failed responses for retry attempts
      global.fetch
        .mockResolvedValueOnce({
          ok: false,
          status: 500,
          statusText: 'Error',
          json: async () => ({}),
        })
        .mockResolvedValueOnce({
          ok: false,
          status: 500,
          statusText: 'Error',
          json: async () => ({}),
        })
        .mockResolvedValueOnce({
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
      // Mock 3 failed responses for retry attempts
      global.fetch
        .mockResolvedValueOnce({
          ok: false,
          status: 500,
          statusText: 'Error',
          json: async () => ({}),
        })
        .mockResolvedValueOnce({
          ok: false,
          status: 500,
          statusText: 'Error',
          json: async () => ({}),
        })
        .mockResolvedValueOnce({
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
      await jest.advanceTimersByTimeAsync(1000);
      await promise;

      expect(global.fetch).toHaveBeenCalledTimes(2);
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
      // Mock 3 failed responses for retry attempts
      global.fetch
        .mockResolvedValueOnce({
          ok: false,
          status: 500,
          json: async () => ({}),
        })
        .mockResolvedValueOnce({
          ok: false,
          status: 500,
          json: async () => ({}),
        })
        .mockResolvedValueOnce({
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

      // Mock 3 failed responses for retry attempts
      global.fetch
        .mockResolvedValueOnce({
          ok: false,
          status: 500,
          json: async () => ({ message: 'Error' }),
        })
        .mockResolvedValueOnce({
          ok: false,
          status: 500,
          json: async () => ({ message: 'Error' }),
        })
        .mockResolvedValueOnce({
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

      // Mock 3 failed responses for retry attempts
      global.fetch
        .mockResolvedValueOnce({
          ok: false,
          status: 500,
          json: async () => ({}),
        })
        .mockResolvedValueOnce({
          ok: false,
          status: 500,
          json: async () => ({}),
        })
        .mockResolvedValueOnce({
          ok: false,
          status: 500,
          json: async () => ({}),
        });

      await safeAPICall(() => moodAPI.getMoodHistory(), [], false);

      expect(consoleSpy).not.toHaveBeenCalled();
      consoleSpy.mockRestore();
    });

    it('should work with null fallback', async () => {
      // Mock 3 failed responses for retry attempts
      global.fetch
        .mockResolvedValueOnce({
          ok: false,
          status: 500,
          json: async () => ({}),
        })
        .mockResolvedValueOnce({
          ok: false,
          status: 500,
          json: async () => ({}),
        })
        .mockResolvedValueOnce({
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
      // Mock 3 failed responses for retry attempts
      global.fetch
        .mockResolvedValueOnce({
          ok: false,
          status: 500,
          json: async () => ({}),
        })
        .mockResolvedValueOnce({
          ok: false,
          status: 500,
          json: async () => ({}),
        })
        .mockResolvedValueOnce({
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
    it('should include timeout in fetch options', async () => {
      // Verify that API calls include AbortSignal for timeout handling
      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true }),
      });

      await moodAPI.getMoodHistory();

      const [[url, options]] = global.fetch.mock.calls;
      expect(options).toHaveProperty('signal');
      expect(options.signal).toBeInstanceOf(AbortSignal);
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
      // Mock 3 failed responses for retry attempts
      global.fetch
        .mockResolvedValueOnce({
          ok: false,
          status: 500,
          statusText: 'Internal Server Error',
          json: async () => ({}),
        })
        .mockResolvedValueOnce({
          ok: false,
          status: 500,
          statusText: 'Internal Server Error',
          json: async () => ({}),
        })
        .mockResolvedValueOnce({
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
      // Mock 3 failed responses for retry attempts
      global.fetch
        .mockResolvedValueOnce({
          ok: false,
          status: 500,
          statusText: 'Server Error',
          json: async () => {
            throw new Error('Not JSON');
          },
        })
        .mockResolvedValueOnce({
          ok: false,
          status: 500,
          statusText: 'Server Error',
          json: async () => {
            throw new Error('Not JSON');
          },
        })
        .mockResolvedValueOnce({
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

describe("Input Sanitization", () => {
  const { sanitizeText } = require("../../../src/shared/utils/sanitization");

  describe("XSS Prevention", () => {
    it("removes script tags from input", () => {
      const malicious = '<script>alert("xss")</script>Hello';
      const sanitized = sanitizeText(malicious, 1000);

      expect(sanitized).not.toContain("<script>");
      expect(sanitized).not.toContain("</script>");
      expect(sanitized).toContain("Hello");
    });

    it("removes event handlers from input", () => {
      const malicious = '<img src=x onerror="alert(1)">';
      const sanitized = sanitizeText(malicious, 1000);

      expect(sanitized).not.toContain("onerror");
      expect(sanitized).not.toContain("alert");
    });

    it("removes javascript protocol from URLs", () => {
      const malicious = '<a href="javascript:void(0)">Click</a>';
      const sanitized = sanitizeText(malicious, 1000);

      expect(sanitized).not.toContain("javascript:");
    });

    it("removes iframe tags", () => {
      const malicious = '<iframe src="evil.com"></iframe>Normal text';
      const sanitized = sanitizeText(malicious, 1000);

      expect(sanitized).not.toContain("<iframe");
      expect(sanitized).not.toContain("</iframe>");
    });

    it("removes style tags that could contain malicious CSS", () => {
      const malicious = '<style>body { display: none; }</style>Text';
      const sanitized = sanitizeText(malicious, 1000);

      expect(sanitized).not.toContain("<style>");
      expect(sanitized).not.toContain("</style>");
    });
  });

  describe("Length Validation", () => {
    it("truncates input to maximum length", () => {
      const longText = "a".repeat(500);
      const sanitized = sanitizeText(longText, 200);

      expect(sanitized.length).toBeLessThanOrEqual(200);
    });

    it("preserves short input unchanged", () => {
      const shortText = "Hello world";
      const sanitized = sanitizeText(shortText, 200);

      expect(sanitized).toBe(shortText);
    });

    it("handles exact length correctly", () => {
      const exactText = "a".repeat(200);
      const sanitized = sanitizeText(exactText, 200);

      expect(sanitized).toBe(exactText);
      expect(sanitized.length).toBe(200);
    });
  });

  describe("SQL Injection Prevention", () => {
    it("escapes SQL injection attempts", () => {
      const sqlInjection = "'; DROP TABLE users; --";
      const sanitized = sanitizeText(sqlInjection, 1000);

      // Should not contain raw SQL commands
      expect(sanitized).not.toMatch(/DROP\s+TABLE/i);
      expect(sanitized).not.toContain("--");
    });

    it("escapes union-based SQL injection", () => {
      const sqlInjection = "1' UNION SELECT * FROM passwords --";
      const sanitized = sanitizeText(sqlInjection, 1000);

      expect(sanitized).not.toMatch(/UNION\s+SELECT/i);
    });
  });

  describe("Journal Input Sanitization", () => {
    it("allows safe journal content", () => {
      const safeJournal = "Today was a good day. I felt happy and relaxed.";
      const sanitized = sanitizeText(safeJournal, 10000);

      expect(sanitized).toBe(safeJournal);
    });

    it("removes HTML from journal while preserving text", () => {
      const journalWithHTML = "I felt <strong>really</strong> happy today.";
      const sanitized = sanitizeText(journalWithHTML, 10000);

      expect(sanitized).not.toContain("<strong>");
      expect(sanitized).not.toContain("</strong>");
      expect(sanitized).toContain("really");
      expect(sanitized).toContain("happy");
    });

    it("preserves line breaks in journal entries", () => {
      const journalWithBreaks = "Line 1\nLine 2\nLine 3";
      const sanitized = sanitizeText(journalWithBreaks, 10000);

      expect(sanitized).toContain("\n");
      expect(sanitized).toBe(journalWithBreaks);
    });

    it("handles empty journal input", () => {
      const empty = "";
      const sanitized = sanitizeText(empty, 10000);

      expect(sanitized).toBe("");
    });

    it("handles null and undefined gracefully", () => {
      expect(sanitizeText(null, 1000)).toBe("");
      expect(sanitizeText(undefined, 1000)).toBe("");
    });
  });

  describe("Title Sanitization", () => {
    it("sanitizes journal title correctly", () => {
      const title = "<script>alert('xss')</script>My Journal";
      const sanitized = sanitizeText(title, 200);

      expect(sanitized.length).toBeLessThanOrEqual(200);
      expect(sanitized).not.toContain("<script>");
      expect(sanitized).toContain("My Journal");
    });

    it("limits title to 200 characters", () => {
      const longTitle = "A very long title ".repeat(20);
      const sanitized = sanitizeText(longTitle, 200);

      expect(sanitized.length).toBe(200);
    });
  });

  describe("Special Characters", () => {
    it("preserves safe special characters", () => {
      const text = "I'm feeling great! It's a wonderful day :)";
      const sanitized = sanitizeText(text, 1000);

      expect(sanitized).toContain("I'm");
      expect(sanitized).toContain("!");
      expect(sanitized).toContain(":)");
    });

    it("handles unicode characters", () => {
      const unicode = "Hello 你好 مرحبا";
      const sanitized = sanitizeText(unicode, 1000);

      expect(sanitized).toBe(unicode);
    });

    it("handles emojis correctly", () => {
      const emojis = "I'm feeling 😊 happy today!";
      const sanitized = sanitizeText(emojis, 1000);

      expect(sanitized).toContain("😊");
    });
  });
});
