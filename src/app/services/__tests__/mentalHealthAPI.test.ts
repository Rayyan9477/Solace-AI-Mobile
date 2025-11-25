/**
 * Unit tests for Mental Health API Service
 */

import mentalHealthAPI, {
  moodAPI,
  assessmentAPI,
  journalAPI,
  dashboardAPI,
  therapyAPI,
  communityAPI,
  mindfulnessAPI,
  emergencyAPI,
} from '../mentalHealthAPI';
import tokenService from '../tokenService';
import { API_CONFIG } from '../../../shared/config/environment';

// Mock dependencies
jest.mock('../tokenService');
jest.mock('../../../shared/config/environment', () => ({
  API_CONFIG: {
    baseURL: 'https://api.test.com',
  },
}));
jest.mock('@shared/utils/logger');

// Mock global fetch
global.fetch = jest.fn();

describe('Mental Health API Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (tokenService.getTokens as jest.Mock).mockResolvedValue({
      accessToken: 'test-token',
      refreshToken: 'refresh-token',
    });
  });

  describe('authenticatedFetch helper', () => {
    it('should add authorization header when token exists', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true }),
      });

      await moodAPI.getMoodEntries();

      expect(global.fetch).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          headers: expect.objectContaining({
            Authorization: 'Bearer test-token',
            'Content-Type': 'application/json',
          }),
        })
      );
    });

    it('should handle API errors properly', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        status: 400,
        statusText: 'Bad Request',
        json: async () => ({ message: 'Invalid data' }),
      });

      await expect(moodAPI.getMoodEntries()).rejects.toThrow('Invalid data');
    });

    it('should handle network errors', async () => {
      (global.fetch as jest.Mock).mockRejectedValueOnce(new Error('Network error'));

      await expect(moodAPI.getMoodEntries()).rejects.toThrow('Network error');
    });
  });

  describe('Mood API', () => {
    describe('createMoodEntry', () => {
      it('should create a mood entry successfully', async () => {
        const mockEntry = {
          mood: 'happy',
          intensity: 8,
          timestamp: '2025-01-15T10:00:00Z',
          notes: 'Feeling great today!',
          activities: ['exercise', 'meditation'],
        };

        (global.fetch as jest.Mock).mockResolvedValueOnce({
          ok: true,
          json: async () => ({ id: '123', ...mockEntry }),
        });

        const result = await moodAPI.createMoodEntry(mockEntry);

        expect(global.fetch).toHaveBeenCalledWith(
          'https://api.test.com/mood/entries',
          expect.objectContaining({
            method: 'POST',
            body: JSON.stringify(mockEntry),
          })
        );
        expect(result.id).toBe('123');
      });
    });

    describe('getMoodEntries', () => {
      it('should fetch mood entries without date filters', async () => {
        const mockEntries = [
          { id: '1', mood: 'happy', intensity: 8, timestamp: '2025-01-15' },
          { id: '2', mood: 'calm', intensity: 6, timestamp: '2025-01-14' },
        ];

        (global.fetch as jest.Mock).mockResolvedValueOnce({
          ok: true,
          json: async () => mockEntries,
        });

        const result = await moodAPI.getMoodEntries();

        expect(global.fetch).toHaveBeenCalledWith(
          'https://api.test.com/mood/entries',
          expect.any(Object)
        );
        expect(result).toEqual(mockEntries);
      });

      it('should fetch mood entries with date filters', async () => {
        (global.fetch as jest.Mock).mockResolvedValueOnce({
          ok: true,
          json: async () => [],
        });

        await moodAPI.getMoodEntries('2025-01-01', '2025-01-31');

        expect(global.fetch).toHaveBeenCalledWith(
          'https://api.test.com/mood/entries?startDate=2025-01-01&endDate=2025-01-31',
          expect.any(Object)
        );
      });
    });

    describe('updateMoodEntry', () => {
      it('should update a mood entry', async () => {
        const updates = { notes: 'Updated notes' };

        (global.fetch as jest.Mock).mockResolvedValueOnce({
          ok: true,
          json: async () => ({ id: '123', ...updates }),
        });

        await moodAPI.updateMoodEntry('123', updates);

        expect(global.fetch).toHaveBeenCalledWith(
          'https://api.test.com/mood/entries/123',
          expect.objectContaining({
            method: 'PUT',
            body: JSON.stringify(updates),
          })
        );
      });
    });

    describe('deleteMoodEntry', () => {
      it('should delete a mood entry', async () => {
        (global.fetch as jest.Mock).mockResolvedValueOnce({
          ok: true,
          json: async () => ({}),
        });

        await moodAPI.deleteMoodEntry('123');

        expect(global.fetch).toHaveBeenCalledWith(
          'https://api.test.com/mood/entries/123',
          expect.objectContaining({
            method: 'DELETE',
          })
        );
      });
    });

    describe('getMoodStats', () => {
      it('should fetch mood statistics with default period', async () => {
        const mockStats = { average: 7, total: 30 };

        (global.fetch as jest.Mock).mockResolvedValueOnce({
          ok: true,
          json: async () => mockStats,
        });

        const result = await moodAPI.getMoodStats();

        expect(global.fetch).toHaveBeenCalledWith(
          'https://api.test.com/mood/stats?period=month',
          expect.any(Object)
        );
        expect(result).toEqual(mockStats);
      });

      it('should fetch mood statistics with custom period', async () => {
        (global.fetch as jest.Mock).mockResolvedValueOnce({
          ok: true,
          json: async () => ({}),
        });

        await moodAPI.getMoodStats('week');

        expect(global.fetch).toHaveBeenCalledWith(
          'https://api.test.com/mood/stats?period=week',
          expect.any(Object)
        );
      });
    });

    describe('getMoodTrends', () => {
      it('should fetch mood trends', async () => {
        const mockTrends = { trending: 'up', data: [] };

        (global.fetch as jest.Mock).mockResolvedValueOnce({
          ok: true,
          json: async () => mockTrends,
        });

        const result = await moodAPI.getMoodTrends();

        expect(result).toEqual(mockTrends);
      });
    });
  });

  describe('Assessment API', () => {
    describe('submitAssessment', () => {
      it('should submit assessment answers', async () => {
        const answers = { 1: 'yes', 2: 'no', 3: 'sometimes' };
        const mockResult = {
          id: '123',
          score: 85,
          categories: {
            mentalClarity: 90,
            emotionalBalance: 80,
            stressManagement: 85,
            sleepQuality: 85,
          },
          answers,
          recommendations: ['Continue mindfulness practice'],
          timestamp: '2025-01-15T10:00:00Z',
        };

        (global.fetch as jest.Mock).mockResolvedValueOnce({
          ok: true,
          json: async () => mockResult,
        });

        const result = await assessmentAPI.submitAssessment(answers);

        expect(global.fetch).toHaveBeenCalledWith(
          'https://api.test.com/assessments',
          expect.objectContaining({
            method: 'POST',
            body: JSON.stringify({ answers }),
          })
        );
        expect(result).toEqual(mockResult);
      });
    });

    describe('getAssessmentHistory', () => {
      it('should fetch assessment history with default limit', async () => {
        const mockHistory = [{ id: '1', score: 85 }];

        (global.fetch as jest.Mock).mockResolvedValueOnce({
          ok: true,
          json: async () => mockHistory,
        });

        await assessmentAPI.getAssessmentHistory();

        expect(global.fetch).toHaveBeenCalledWith(
          'https://api.test.com/assessments?limit=10',
          expect.any(Object)
        );
      });

      it('should fetch assessment history with custom limit', async () => {
        (global.fetch as jest.Mock).mockResolvedValueOnce({
          ok: true,
          json: async () => [],
        });

        await assessmentAPI.getAssessmentHistory(5);

        expect(global.fetch).toHaveBeenCalledWith(
          'https://api.test.com/assessments?limit=5',
          expect.any(Object)
        );
      });
    });

    describe('getAssessment', () => {
      it('should fetch specific assessment by ID', async () => {
        const mockAssessment = { id: '123', score: 85 };

        (global.fetch as jest.Mock).mockResolvedValueOnce({
          ok: true,
          json: async () => mockAssessment,
        });

        const result = await assessmentAPI.getAssessment('123');

        expect(global.fetch).toHaveBeenCalledWith(
          'https://api.test.com/assessments/123',
          expect.any(Object)
        );
        expect(result).toEqual(mockAssessment);
      });
    });

    describe('getRecommendations', () => {
      it('should fetch assessment recommendations', async () => {
        const mockRecommendations = [
          'Practice mindfulness daily',
          'Get 8 hours of sleep',
        ];

        (global.fetch as jest.Mock).mockResolvedValueOnce({
          ok: true,
          json: async () => mockRecommendations,
        });

        const result = await assessmentAPI.getRecommendations();

        expect(result).toEqual(mockRecommendations);
      });
    });
  });

  describe('Journal API', () => {
    describe('createEntry', () => {
      it('should create a text journal entry', async () => {
        const mockEntry = {
          title: 'My Journal',
          content: 'Today was great',
          mood: 'happy',
          tags: ['gratitude'],
          timestamp: '2025-01-15T10:00:00Z',
          isVoice: false,
        };

        (global.fetch as jest.Mock).mockResolvedValueOnce({
          ok: true,
          json: async () => ({ id: '123', ...mockEntry }),
        });

        await journalAPI.createEntry(mockEntry);

        expect(global.fetch).toHaveBeenCalledWith(
          'https://api.test.com/journal/entries',
          expect.objectContaining({
            method: 'POST',
          })
        );
      });
    });

    describe('getEntries', () => {
      it('should fetch journal entries with pagination', async () => {
        const mockEntries = [
          { id: '1', title: 'Entry 1' },
          { id: '2', title: 'Entry 2' },
        ];

        (global.fetch as jest.Mock).mockResolvedValueOnce({
          ok: true,
          json: async () => mockEntries,
        });

        await journalAPI.getEntries(1, 20);

        expect(global.fetch).toHaveBeenCalledWith(
          'https://api.test.com/journal/entries?page=1&limit=20',
          expect.any(Object)
        );
      });
    });

    describe('getEntry', () => {
      it('should fetch a specific journal entry', async () => {
        const mockEntry = { id: '123', title: 'My Entry' };

        (global.fetch as jest.Mock).mockResolvedValueOnce({
          ok: true,
          json: async () => mockEntry,
        });

        const result = await journalAPI.getEntry('123');

        expect(result).toEqual(mockEntry);
      });
    });

    describe('updateEntry', () => {
      it('should update a journal entry', async () => {
        const updates = { title: 'Updated Title' };

        (global.fetch as jest.Mock).mockResolvedValueOnce({
          ok: true,
          json: async () => ({ id: '123', ...updates }),
        });

        await journalAPI.updateEntry('123', updates);

        expect(global.fetch).toHaveBeenCalledWith(
          'https://api.test.com/journal/entries/123',
          expect.objectContaining({
            method: 'PUT',
            body: JSON.stringify(updates),
          })
        );
      });
    });

    describe('deleteEntry', () => {
      it('should delete a journal entry', async () => {
        (global.fetch as jest.Mock).mockResolvedValueOnce({
          ok: true,
          json: async () => ({}),
        });

        await journalAPI.deleteEntry('123');

        expect(global.fetch).toHaveBeenCalledWith(
          'https://api.test.com/journal/entries/123',
          expect.objectContaining({
            method: 'DELETE',
          })
        );
      });
    });

    describe('searchEntries', () => {
      it('should search journal entries with query', async () => {
        const mockResults = [{ id: '1', title: 'Found Entry' }];

        (global.fetch as jest.Mock).mockResolvedValueOnce({
          ok: true,
          json: async () => mockResults,
        });

        await journalAPI.searchEntries('gratitude');

        expect(global.fetch).toHaveBeenCalledWith(
          'https://api.test.com/journal/search?q=gratitude',
          expect.any(Object)
        );
      });

      it('should properly encode search query', async () => {
        (global.fetch as jest.Mock).mockResolvedValueOnce({
          ok: true,
          json: async () => [],
        });

        await journalAPI.searchEntries('special & characters');

        expect(global.fetch).toHaveBeenCalledWith(
          expect.stringContaining(encodeURIComponent('special & characters')),
          expect.any(Object)
        );
      });
    });
  });

  describe('Dashboard API', () => {
    describe('getDashboardData', () => {
      it('should fetch complete dashboard data', async () => {
        const mockData = {
          mentalHealthScore: 85,
          streakDays: 7,
          weeklyMoodTrend: [],
          recentAssessments: [],
          upcomingActivities: [],
          insights: ['Keep up the good work!'],
        };

        (global.fetch as jest.Mock).mockResolvedValueOnce({
          ok: true,
          json: async () => mockData,
        });

        const result = await dashboardAPI.getDashboardData();

        expect(result).toEqual(mockData);
      });
    });

    describe('getMentalHealthScore', () => {
      it('should fetch mental health score details', async () => {
        const mockScore = { score: 85, breakdown: {} };

        (global.fetch as jest.Mock).mockResolvedValueOnce({
          ok: true,
          json: async () => mockScore,
        });

        const result = await dashboardAPI.getMentalHealthScore();

        expect(result).toEqual(mockScore);
      });
    });

    describe('getUpcomingActivities', () => {
      it('should fetch upcoming activities', async () => {
        const mockActivities = [{ id: '1', name: 'Meditation' }];

        (global.fetch as jest.Mock).mockResolvedValueOnce({
          ok: true,
          json: async () => mockActivities,
        });

        const result = await dashboardAPI.getUpcomingActivities();

        expect(result).toEqual(mockActivities);
      });
    });

    describe('getInsights', () => {
      it('should fetch personalized insights', async () => {
        const mockInsights = ['Great progress this week!'];

        (global.fetch as jest.Mock).mockResolvedValueOnce({
          ok: true,
          json: async () => mockInsights,
        });

        const result = await dashboardAPI.getInsights();

        expect(result).toEqual(mockInsights);
      });
    });

    describe('getStreakInfo', () => {
      it('should fetch streak information', async () => {
        const mockStreak = { current: 7, longest: 30 };

        (global.fetch as jest.Mock).mockResolvedValueOnce({
          ok: true,
          json: async () => mockStreak,
        });

        const result = await dashboardAPI.getStreakInfo();

        expect(result).toEqual(mockStreak);
      });
    });
  });

  describe('Therapy API', () => {
    describe('createSession', () => {
      it('should create a therapy session', async () => {
        const mockSession = {
          type: 'individual',
          duration: 60,
          notes: 'Great session',
          timestamp: '2025-01-15T10:00:00Z',
        };

        (global.fetch as jest.Mock).mockResolvedValueOnce({
          ok: true,
          json: async () => ({ id: '123', ...mockSession }),
        });

        await therapyAPI.createSession(mockSession);

        expect(global.fetch).toHaveBeenCalledWith(
          'https://api.test.com/therapy/sessions',
          expect.objectContaining({
            method: 'POST',
            body: JSON.stringify(mockSession),
          })
        );
      });
    });

    describe('getSessions', () => {
      it('should fetch therapy sessions', async () => {
        const mockSessions = [{ id: '1', type: 'individual' }];

        (global.fetch as jest.Mock).mockResolvedValueOnce({
          ok: true,
          json: async () => mockSessions,
        });

        await therapyAPI.getSessions();

        expect(global.fetch).toHaveBeenCalledWith(
          'https://api.test.com/therapy/sessions?limit=10',
          expect.any(Object)
        );
      });
    });

    describe('getTherapistRecommendations', () => {
      it('should fetch therapist recommendations', async () => {
        const mockRecommendations = [{ id: '1', name: 'Dr. Smith' }];

        (global.fetch as jest.Mock).mockResolvedValueOnce({
          ok: true,
          json: async () => mockRecommendations,
        });

        const result = await therapyAPI.getTherapistRecommendations();

        expect(result).toEqual(mockRecommendations);
      });
    });

    describe('scheduleAppointment', () => {
      it('should schedule a therapy appointment', async () => {
        const appointmentData = {
          therapistId: '123',
          date: '2025-01-20',
          time: '14:00',
        };

        (global.fetch as jest.Mock).mockResolvedValueOnce({
          ok: true,
          json: async () => ({ id: '456', ...appointmentData }),
        });

        await therapyAPI.scheduleAppointment(appointmentData);

        expect(global.fetch).toHaveBeenCalledWith(
          'https://api.test.com/therapy/appointments',
          expect.objectContaining({
            method: 'POST',
            body: JSON.stringify(appointmentData),
          })
        );
      });
    });
  });

  describe('Community API', () => {
    describe('getPosts', () => {
      it('should fetch community posts with pagination', async () => {
        const mockPosts = [{ id: '1', content: 'Hello community' }];

        (global.fetch as jest.Mock).mockResolvedValueOnce({
          ok: true,
          json: async () => mockPosts,
        });

        await communityAPI.getPosts(1, 20);

        expect(global.fetch).toHaveBeenCalledWith(
          'https://api.test.com/community/posts?page=1&limit=20',
          expect.any(Object)
        );
      });
    });

    describe('createPost', () => {
      it('should create a community post', async () => {
        const mockPost = { content: 'Hello everyone!' };

        (global.fetch as jest.Mock).mockResolvedValueOnce({
          ok: true,
          json: async () => ({ id: '123', ...mockPost }),
        });

        await communityAPI.createPost(mockPost);

        expect(global.fetch).toHaveBeenCalledWith(
          'https://api.test.com/community/posts',
          expect.objectContaining({
            method: 'POST',
            body: JSON.stringify(mockPost),
          })
        );
      });
    });

    describe('getSupportGroups', () => {
      it('should fetch support groups', async () => {
        const mockGroups = [{ id: '1', name: 'Anxiety Support' }];

        (global.fetch as jest.Mock).mockResolvedValueOnce({
          ok: true,
          json: async () => mockGroups,
        });

        const result = await communityAPI.getSupportGroups();

        expect(result).toEqual(mockGroups);
      });
    });

    describe('joinGroup', () => {
      it('should join a support group', async () => {
        (global.fetch as jest.Mock).mockResolvedValueOnce({
          ok: true,
          json: async () => ({ success: true }),
        });

        await communityAPI.joinGroup('123');

        expect(global.fetch).toHaveBeenCalledWith(
          'https://api.test.com/community/support-groups/123/join',
          expect.objectContaining({
            method: 'POST',
          })
        );
      });
    });

    describe('getEvents', () => {
      it('should fetch community events', async () => {
        const mockEvents = [{ id: '1', title: 'Group Meditation' }];

        (global.fetch as jest.Mock).mockResolvedValueOnce({
          ok: true,
          json: async () => mockEvents,
        });

        const result = await communityAPI.getEvents();

        expect(result).toEqual(mockEvents);
      });
    });
  });

  describe('Mindfulness API', () => {
    describe('getMeditationSessions', () => {
      it('should fetch meditation sessions', async () => {
        const mockSessions = [{ id: '1', title: 'Breathing Exercise' }];

        (global.fetch as jest.Mock).mockResolvedValueOnce({
          ok: true,
          json: async () => mockSessions,
        });

        const result = await mindfulnessAPI.getMeditationSessions();

        expect(result).toEqual(mockSessions);
      });
    });

    describe('startMeditation', () => {
      it('should start a meditation session', async () => {
        (global.fetch as jest.Mock).mockResolvedValueOnce({
          ok: true,
          json: async () => ({ started: true }),
        });

        await mindfulnessAPI.startMeditation('123');

        expect(global.fetch).toHaveBeenCalledWith(
          'https://api.test.com/mindfulness/meditations/123/start',
          expect.objectContaining({
            method: 'POST',
          })
        );
      });
    });

    describe('completeMeditation', () => {
      it('should complete a meditation session', async () => {
        (global.fetch as jest.Mock).mockResolvedValueOnce({
          ok: true,
          json: async () => ({ completed: true }),
        });

        await mindfulnessAPI.completeMeditation('123', 600);

        expect(global.fetch).toHaveBeenCalledWith(
          'https://api.test.com/mindfulness/meditations/123/complete',
          expect.objectContaining({
            method: 'POST',
            body: JSON.stringify({ duration: 600 }),
          })
        );
      });
    });

    describe('getBreathingExercises', () => {
      it('should fetch breathing exercises', async () => {
        const mockExercises = [{ id: '1', name: 'Box Breathing' }];

        (global.fetch as jest.Mock).mockResolvedValueOnce({
          ok: true,
          json: async () => mockExercises,
        });

        const result = await mindfulnessAPI.getBreathingExercises();

        expect(result).toEqual(mockExercises);
      });
    });

    describe('getMindfulnessStats', () => {
      it('should fetch mindfulness statistics', async () => {
        const mockStats = { totalMinutes: 120, sessionsCompleted: 15 };

        (global.fetch as jest.Mock).mockResolvedValueOnce({
          ok: true,
          json: async () => mockStats,
        });

        const result = await mindfulnessAPI.getMindfulnessStats();

        expect(result).toEqual(mockStats);
      });
    });
  });

  describe('Emergency API', () => {
    describe('getEmergencyContacts', () => {
      it('should fetch emergency contacts', async () => {
        const mockContacts = [{ id: '1', name: 'John Doe', phone: '555-0100' }];

        (global.fetch as jest.Mock).mockResolvedValueOnce({
          ok: true,
          json: async () => mockContacts,
        });

        const result = await emergencyAPI.getEmergencyContacts();

        expect(result).toEqual(mockContacts);
      });
    });

    describe('addEmergencyContact', () => {
      it('should add an emergency contact', async () => {
        const mockContact = { name: 'Jane Doe', phone: '555-0200' };

        (global.fetch as jest.Mock).mockResolvedValueOnce({
          ok: true,
          json: async () => ({ id: '123', ...mockContact }),
        });

        await emergencyAPI.addEmergencyContact(mockContact);

        expect(global.fetch).toHaveBeenCalledWith(
          'https://api.test.com/emergency/contacts',
          expect.objectContaining({
            method: 'POST',
            body: JSON.stringify(mockContact),
          })
        );
      });
    });

    describe('triggerEmergencyAlert', () => {
      it('should trigger emergency alert without location', async () => {
        (global.fetch as jest.Mock).mockResolvedValueOnce({
          ok: true,
          json: async () => ({ alerted: true }),
        });

        await emergencyAPI.triggerEmergencyAlert();

        expect(global.fetch).toHaveBeenCalledWith(
          'https://api.test.com/emergency/alert',
          expect.objectContaining({
            method: 'POST',
            body: JSON.stringify({ location: undefined }),
          })
        );
      });

      it('should trigger emergency alert with location', async () => {
        const location = { lat: 40.7128, lon: -74.0060 };

        (global.fetch as jest.Mock).mockResolvedValueOnce({
          ok: true,
          json: async () => ({ alerted: true }),
        });

        await emergencyAPI.triggerEmergencyAlert(location);

        expect(global.fetch).toHaveBeenCalledWith(
          'https://api.test.com/emergency/alert',
          expect.objectContaining({
            method: 'POST',
            body: JSON.stringify({ location }),
          })
        );
      });
    });

    describe('getCrisisResources', () => {
      it('should fetch crisis resources', async () => {
        const mockResources = [
          { id: '1', name: 'Crisis Hotline', phone: '988' },
        ];

        (global.fetch as jest.Mock).mockResolvedValueOnce({
          ok: true,
          json: async () => mockResources,
        });

        const result = await emergencyAPI.getCrisisResources();

        expect(result).toEqual(mockResources);
      });
    });
  });

  describe('Default Export', () => {
    it('should export all API modules', () => {
      expect(mentalHealthAPI).toHaveProperty('mood');
      expect(mentalHealthAPI).toHaveProperty('assessment');
      expect(mentalHealthAPI).toHaveProperty('journal');
      expect(mentalHealthAPI).toHaveProperty('dashboard');
      expect(mentalHealthAPI).toHaveProperty('therapy');
      expect(mentalHealthAPI).toHaveProperty('community');
      expect(mentalHealthAPI).toHaveProperty('mindfulness');
      expect(mentalHealthAPI).toHaveProperty('emergency');
    });
  });
});
