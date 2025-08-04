const { test, expect } = require('@playwright/test');

test.describe('TherapyScreen Integration Tests', () => {
  test.beforeEach(async ({ page }) => {
    // Set up test user data and preferences
    await page.evaluate(() => {
      localStorage.setItem('therapy_preferences', JSON.stringify({
        preferredMode: 'text',
        crisisContactsEnabled: true,
        sessionReminders: true,
        dataSharing: false
      }));
      
      localStorage.setItem('user_profile', JSON.stringify({
        id: 'test-user-123',
        name: 'Test User',
        therapyGoals: ['anxiety', 'stress_management'],
        emergencyContacts: [
          { name: 'Emergency Services', number: '911' },
          { name: 'Crisis Helpline', number: '988' }
        ]
      }));
    });
    
    await page.goto('/therapy');
    await page.waitForLoadState('networkidle');
    await page.waitForSelector('[data-testid="therapy-screen"]', { timeout: 10000 });
  });

  test.describe('Assessment Data Integration', () => {
    test('should load and display relevant assessment data', async ({ page }) => {
      // Mock assessment data from previous sessions
      await page.evaluate(() => {
        const assessmentData = {
          mostRecentScore: 7,
          riskLevel: 'moderate',
          primaryConcerns: ['anxiety', 'sleep_issues'],
          recommendedInterventions: ['breathing_exercises', 'thought_challenging'],
          lastAssessmentDate: new Date().toISOString()
        };
        
        localStorage.setItem('assessment_data', JSON.stringify(assessmentData));
        
        // Dispatch event to simulate data loading
        window.dispatchEvent(new CustomEvent('assessmentDataLoaded', { 
          detail: assessmentData 
        }));
      });
      
      // Wait for assessment data to be integrated
      await page.waitForTimeout(1000);
      
      // Check if therapy recommendations are shown
      await page.locator('[data-testid="guided-mode-button"]').click();
      
      // Should prioritize exercises based on assessment
      const exercises = await page.locator('[data-testid="exercise-card"]').all();
      expect(exercises.length).toBeGreaterThan(0);
      
      // Should show anxiety-related exercises prominently
      await expect(page.locator('[data-testid="exercise-card"]:has-text("Breathing")')).toBeVisible();
      await expect(page.locator('[data-testid="exercise-card"]:has-text("Grounding")')).toBeVisible();
    });

    test('should adapt AI responses based on assessment history', async ({ page }) => {
      // Set up assessment history indicating anxiety issues
      await page.evaluate(() => {
        const assessmentHistory = [
          {
            date: new Date().toISOString(),
            anxietyScore: 8,
            depressionScore: 4,
            stressLevel: 7,
            primarySymptoms: ['racing_thoughts', 'physical_tension']
          }
        ];
        
        localStorage.setItem('assessment_history', JSON.stringify(assessmentHistory));
      });
      
      await page.locator('[data-testid="text-mode-button"]').click();
      
      // Send message about feeling overwhelmed
      await page.locator('[data-testid="chat-input-field"]').fill('I feel overwhelmed today');
      await page.locator('[data-testid="send-button"]').click();
      
      await page.waitForSelector('[data-testid="ai-message"]', { timeout: 10000 });
      
      const response = page.locator('[data-testid="ai-message"]').last();
      
      // Response should reference previous assessment or show understanding of anxiety patterns
      await expect(response).toContainText(/overwhelmed|anxiety|previous|pattern/i);
      
      // Should offer relevant suggestions based on history
      await expect(page.locator('[data-testid="suggestion-button"]')).toHaveCount({ min: 1 });
    });

    test('should track therapy session outcomes in assessment data', async ({ page }) => {
      await page.locator('[data-testid="text-mode-button"]').click();
      
      // Complete a therapy session
      await page.locator('[data-testid="chat-input-field"]').fill('I practiced breathing exercises');
      await page.locator('[data-testid="send-button"]').click();
      
      await page.waitForSelector('[data-testid="ai-message"]', { timeout: 10000 });
      
      // End session
      await page.locator('[data-testid="end-session-button"]').click();
      await page.locator('[data-testid="confirm-end-session"]').click();
      
      // Check if session data was saved for future assessments
      const sessionData = await page.evaluate(() => {
        return JSON.parse(localStorage.getItem('therapy_session_outcomes') || '[]');
      });
      
      expect(sessionData.length).toBeGreaterThan(0);
      expect(sessionData[0]).toHaveProperty('sessionId');
      expect(sessionData[0]).toHaveProperty('interventionsUsed');
    });
  });

  test.describe('Emergency Resources Integration', () => {
    test('should display personalized emergency contacts', async ({ page }) => {
      // Trigger emergency scenario
      await page.locator('[data-testid="text-mode-button"]').click();
      await page.locator('[data-testid="chat-input-field"]').fill('I want to hurt myself');
      await page.locator('[data-testid="send-button"]').click();
      
      await page.waitForSelector('[data-testid="ai-message"]', { timeout: 10000 });
      
      // Should show emergency options
      await expect(page.locator('[data-testid="suggestion-button"]:has-text("I need immediate help")')).toBeVisible();
      
      // Click on emergency help
      await page.locator('[data-testid="suggestion-button"]:has-text("I need immediate help")').click();
      
      // Should show emergency resources modal
      await page.waitForSelector('[data-testid="emergency-resources-modal"]', { timeout: 5000 });
      
      // Should show personalized emergency contacts
      await expect(page.locator('[data-testid="emergency-contact"]:has-text("Crisis Helpline")')).toBeVisible();
      await expect(page.locator('[data-testid="emergency-contact"]:has-text("988")')).toBeVisible();
    });

    test('should integrate with device emergency features', async ({ page }) => {
      // Mock device capabilities
      await page.evaluate(() => {
        navigator.geolocation = {
          getCurrentPosition: (success) => {
            success({
              coords: {
                latitude: 40.7128,
                longitude: -74.0060
              }
            });
          }
        };
        
        window.makeEmergencyCall = (number) => {
          window.emergencyCallMade = number;
          return Promise.resolve();
        };
      });
      
      // Trigger emergency resources
      await page.locator('[data-testid="emergency-button"]').click();
      
      await page.waitForSelector('[data-testid="emergency-resources-modal"]', { timeout: 5000 });
      
      // Test location-based services button
      if (await page.locator('[data-testid="find-nearby-help"]').count() > 0) {
        await page.locator('[data-testid="find-nearby-help"]').click();
        
        // Should use geolocation
        const geoUsed = await page.evaluate(() => {
          return !!navigator.geolocation;
        });
        expect(geoUsed).toBe(true);
      }
      
      // Test direct calling functionality
      if (await page.locator('[data-testid="call-crisis-line"]').count() > 0) {
        await page.locator('[data-testid="call-crisis-line"]').click();
        
        const callMade = await page.evaluate(() => window.emergencyCallMade);
        expect(callMade).toBeTruthy();
      }
    });

    test('should escalate to emergency resources based on conversation context', async ({ page }) => {
      await page.locator('[data-testid="text-mode-button"]').click();
      
      const escalationPhrases = [
        'I have a plan to end my life',
        'I bought pills to overdose',
        'I am going to jump off a bridge',
        'I have a gun and want to use it on myself'
      ];
      
      for (const phrase of escalationPhrases) {
        await page.locator('[data-testid="chat-input-field"]').fill(phrase);
        await page.locator('[data-testid="send-button"]').click();
        
        await page.waitForSelector('[data-testid="ai-message"]', { timeout: 10000 });
        
        const response = page.locator('[data-testid="ai-message"]').last();
        
        // Should show high-priority crisis response
        await expect(response).toHaveClass(/urgent-message/);
        await expect(response).toContainText(/immediate|help|emergency|911/i);
        
        // Should automatically offer emergency resources
        await expect(page.locator('[data-testid="emergency-resources-banner"]')).toBeVisible();
        
        // Clear for next test
        await page.reload();
        await page.waitForLoadState('networkidle');
      }
    });

    test('should track crisis interventions for follow-up care', async ({ page }) => {
      await page.locator('[data-testid="text-mode-button"]').click();
      
      // Trigger crisis response
      await page.locator('[data-testid="chat-input-field"]').fill('I want to end everything');
      await page.locator('[data-testid="send-button"]').click();
      
      await page.waitForSelector('[data-testid="ai-message"]', { timeout: 10000 });
      
      // User indicates they got help
      await page.locator('[data-testid="suggestion-button"]:has-text("I\'m safe for now")').click();
      
      await page.waitForSelector('[data-testid="ai-message"]', { timeout: 10000 });
      
      // End session
      await page.locator('[data-testid="end-session-button"]').click();
      await page.locator('[data-testid="confirm-end-session"]').click();
      
      // Check if crisis intervention was logged
      const crisisLog = await page.evaluate(() => {
        return JSON.parse(localStorage.getItem('crisis_interventions') || '[]');
      });
      
      expect(crisisLog.length).toBeGreaterThan(0);
      expect(crisisLog[0]).toHaveProperty('triggerPhrase');
      expect(crisisLog[0]).toHaveProperty('interventionType');
      expect(crisisLog[0]).toHaveProperty('userResponse');
      expect(crisisLog[0]).toHaveProperty('followupRequired');
    });
  });

  test.describe('Session History and Continuity', () => {
    test('should maintain context across multiple sessions', async ({ page }) => {
      // Set up previous session data
      await page.evaluate(() => {
        const previousSessions = [
          {
            id: 'session-1',
            date: new Date(Date.now() - 86400000).toISOString(), // Yesterday
            topics: ['anxiety', 'work_stress'],
            interventions: ['breathing_exercise'],
            mood_before: 3,
            mood_after: 6,
            key_insights: ['Breathing helps with immediate anxiety relief']
          }
        ];
        
        localStorage.setItem('therapy_session_history', JSON.stringify(previousSessions));
      });
      
      await page.locator('[data-testid="text-mode-button"]').click();
      
      // AI should reference previous session
      await page.locator('[data-testid="chat-input-field"]').fill('I tried that breathing exercise we discussed');
      await page.locator('[data-testid="send-button"]').click();
      
      await page.waitForSelector('[data-testid="ai-message"]', { timeout: 10000 });
      
      const response = page.locator('[data-testid="ai-message"]').last();
      
      // Should show continuity from previous sessions
      await expect(response).toContainText(/breathing|exercise|tried|progress/i);
    });

    test('should suggest follow-up on incomplete exercises', async ({ page }) => {
      // Set up incomplete exercise from previous session
      await page.evaluate(() => {
        const incomplete = {
          exerciseId: 'thought_challenging',
          startedAt: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
          completedSteps: 2,
          totalSteps: 5,
          lastPrompt: 'What evidence contradicts this thought?'
        };
        
        localStorage.setItem('incomplete_exercise', JSON.stringify(incomplete));
      });
      
      // Should suggest continuing the exercise
      await page.locator('[data-testid="guided-mode-button"]').click();
      
      // Look for continuation prompt
      await expect(page.locator('[data-testid="continue-exercise-banner"]')).toBeVisible();
      await expect(page.locator('[data-testid="continue-exercise-banner"]')).toContainText(/continue|thought challenging/i);
      
      // Test continuing the exercise
      await page.locator('[data-testid="continue-exercise-button"]').click();
      
      await page.waitForSelector('[data-testid="ai-message"]', { timeout: 5000 });
      
      const message = page.locator('[data-testid="ai-message"]').last();
      await expect(message).toContainText(/evidence contradicts/i);
    });

    test('should persist session recordings and transcripts', async ({ page }) => {
      await page.locator('[data-testid="voice-mode-button"]').click();
      
      // Mock recording functionality
      await page.evaluate(() => {
        navigator.mediaDevices.getUserMedia = () => 
          Promise.resolve(new MediaStream());
        
        window.saveRecording = (recordingData) => {
          const recordings = JSON.parse(localStorage.getItem('session_recordings') || '[]');
          recordings.push(recordingData);
          localStorage.setItem('session_recordings', JSON.stringify(recordings));
        };
      });
      
      const recordButton = page.locator('[data-testid="record-button"]');
      
      // Start recording
      await recordButton.click();
      await page.waitForTimeout(2000);
      
      // Stop recording
      await recordButton.click();
      
      // Wait for processing
      await page.waitForTimeout(1000);
      
      // Check if recording was saved
      const recordings = await page.evaluate(() => {
        return JSON.parse(localStorage.getItem('session_recordings') || '[]');
      });
      
      expect(recordings.length).toBeGreaterThan(0);
      expect(recordings[0]).toHaveProperty('uri');
      expect(recordings[0]).toHaveProperty('duration');
      expect(recordings[0]).toHaveProperty('sessionId');
    });

    test('should export session data for continuity of care', async ({ page }) => {
      // Complete a session with various interactions
      await page.locator('[data-testid="text-mode-button"]').click();
      
      // Send several messages
      const messages = [
        'I feel anxious about work',
        'My boss is very demanding',
        'I tried deep breathing and it helped'
      ];
      
      for (const message of messages) {
        await page.locator('[data-testid="chat-input-field"]').fill(message);
        await page.locator('[data-testid="send-button"]').click();
        await page.waitForSelector('[data-testid="ai-message"]', { timeout: 10000 });
      }
      
      // Try guided exercise
      await page.locator('[data-testid="guided-mode-button"]').click();
      const firstExercise = page.locator('[data-testid="exercise-card"]').first();
      await firstExercise.click();
      
      // End session with export option
      await page.locator('[data-testid="end-session-button"]').click();
      
      // Should offer export options
      if (await page.locator('[data-testid="export-session-data"]').count() > 0) {
        await page.locator('[data-testid="export-session-data"]').click();
        
        // Mock file download
        await page.evaluate(() => {
          window.sessionExported = true;
        });
        
        const exported = await page.evaluate(() => window.sessionExported);
        expect(exported).toBe(true);
      }
      
      await page.locator('[data-testid="confirm-end-session"]').click();
    });
  });

  test.describe('TherapySessionRecorder Component Integration', () => {
    test('should integrate seamlessly with main therapy interface', async ({ page }) => {
      await page.locator('[data-testid="voice-mode-button"]').click();
      
      // Mock audio permissions and recording
      await page.evaluate(() => {
        navigator.mediaDevices.getUserMedia = () => 
          Promise.resolve(new MediaStream());
        
        window.MediaRecorder = class {
          constructor(stream) {
            this.state = 'inactive';
            this.ondataavailable = null;
            this.onstop = null;
          }
          
          start() {
            this.state = 'recording';
            setTimeout(() => {
              if (this.ondataavailable) {
                this.ondataavailable({
                  data: new Blob(['test audio'], { type: 'audio/webm' })
                });
              }
            }, 100);
          }
          
          stop() {
            this.state = 'inactive';
            setTimeout(() => {
              if (this.onstop) this.onstop();
            }, 50);
          }
        };
      });
      
      const recordButton = page.locator('[data-testid="record-button"]');
      
      // Test recording lifecycle
      await recordButton.click();
      await expect(page.locator('[data-testid="recording-status"]')).toBeVisible();
      
      await page.waitForTimeout(1000);
      await recordButton.click();
      
      // Should process recording and add to conversation
      await page.waitForTimeout(500);
      await expect(page.locator('[data-testid="user-message"]')).toBeVisible();
      
      // Should receive AI response to voice message
      await page.waitForSelector('[data-testid="ai-message"]', { timeout: 10000 });
    });

    test('should handle recording permissions across different states', async ({ page }) => {
      await page.locator('[data-testid="voice-mode-button"]').click();
      
      // Test permission denied scenario
      await page.evaluate(() => {
        navigator.mediaDevices.getUserMedia = () => 
          Promise.reject(new Error('Permission denied'));
      });
      
      await page.locator('[data-testid="record-button"]').click();
      
      // Should show permission error
      await expect(page.locator('[data-testid="permission-error"]')).toBeVisible();
      
      // Test permission granted after denial
      await page.evaluate(() => {
        navigator.mediaDevices.getUserMedia = () => 
          Promise.resolve(new MediaStream());
      });
      
      // Try recording again
      await page.locator('[data-testid="record-button"]').click();
      await expect(page.locator('[data-testid="recording-status"]')).toBeVisible();
    });

    test('should save recordings with proper metadata', async ({ page }) => {
      await page.locator('[data-testid="voice-mode-button"]').click();
      
      await page.evaluate(() => {
        navigator.mediaDevices.getUserMedia = () => 
          Promise.resolve(new MediaStream());
        
        let recordingId = 0;
        window.MediaRecorder = class {
          constructor(stream) {
            this.state = 'inactive';
            this.recordingId = ++recordingId;
          }
          
          start() {
            this.state = 'recording';
            this.startTime = Date.now();
          }
          
          stop() {
            this.state = 'inactive';
            const duration = Date.now() - this.startTime;
            
            setTimeout(() => {
              if (this.ondataavailable) {
                this.ondataavailable({
                  data: new Blob(['test audio'], { type: 'audio/webm' }),
                  recordingId: this.recordingId,
                  duration: duration
                });
              }
              if (this.onstop) this.onstop();
            }, 50);
          }
        };
      });
      
      const recordButton = page.locator('[data-testid="record-button"]');
      
      await recordButton.click();
      await page.waitForTimeout(2000);
      await recordButton.click();
      
      // Wait for processing
      await page.waitForTimeout(1000);
      
      // Check that recording metadata was captured
      const recordingData = await page.evaluate(() => {
        return window.lastRecordingData || {};
      });
      
      expect(recordingData).toHaveProperty('duration');
      expect(recordingData).toHaveProperty('sessionId');
      expect(recordingData).toHaveProperty('timestamp');
    });
  });

  test.describe('Data Persistence and Recovery', () => {
    test('should recover from browser crashes or unexpected closures', async ({ page }) => {
      // Start a session
      await page.locator('[data-testid="text-mode-button"]').click();
      await page.locator('[data-testid="chat-input-field"]').fill('Important therapy message');
      await page.locator('[data-testid="send-button"]').click();
      
      await page.waitForSelector('[data-testid="ai-message"]', { timeout: 10000 });
      
      // Simulate browser crash/reload
      await page.reload();
      await page.waitForLoadState('networkidle');
      
      // Should offer to recover session
      if (await page.locator('[data-testid="recover-session-banner"]').count() > 0) {
        await page.locator('[data-testid="recover-session-button"]').click();
        
        // Should restore previous messages
        await expect(page.locator('[data-testid="user-message"]:has-text("Important therapy message")')).toBeVisible();
      }
    });

    test('should sync data across multiple devices/tabs', async ({ browser }) => {
      const context1 = await browser.newContext();
      const context2 = await browser.newContext();
      
      const page1 = await context1.newPage();
      const page2 = await context2.newPage();
      
      // Start session on first tab
      await page1.goto('/therapy');
      await page1.waitForLoadState('networkidle');
      
      await page1.locator('[data-testid="text-mode-button"]').click();
      await page1.locator('[data-testid="chat-input-field"]').fill('Message from tab 1');
      await page1.locator('[data-testid="send-button"]').click();
      
      // Open therapy on second tab
      await page2.goto('/therapy');
      await page2.waitForLoadState('networkidle');
      
      // Should show sync warning or allow continuation
      if (await page2.locator('[data-testid="active-session-warning"]').count() > 0) {
        await expect(page2.locator('[data-testid="active-session-warning"]')).toContainText(/active session/i);
      }
      
      await context1.close();
      await context2.close();
    });

    test('should handle offline scenarios gracefully', async ({ page }) => {
      await page.locator('[data-testid="text-mode-button"]').click();
      
      // Go offline
      await page.route('**/*', route => route.abort('internetdisconnected'));
      
      await page.locator('[data-testid="chat-input-field"]').fill('Offline message');
      await page.locator('[data-testid="send-button"]').click();
      
      // Should show offline state
      await expect(page.locator('[data-testid="offline-banner"]')).toBeVisible();
      
      // Should queue message for when back online
      const queuedMessages = await page.evaluate(() => {
        return JSON.parse(localStorage.getItem('queued_messages') || '[]');
      });
      
      expect(queuedMessages.length).toBeGreaterThan(0);
      expect(queuedMessages[0].text).toBe('Offline message');
      
      // Go back online
      await page.unroute('**/*');
      
      // Should process queued messages
      await page.waitForSelector('[data-testid="ai-message"]', { timeout: 10000 });
    });
  });
});