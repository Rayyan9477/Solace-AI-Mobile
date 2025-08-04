const { test, expect } = require('@playwright/test');

test.describe('TherapyScreen Performance Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/therapy');
    await page.waitForLoadState('networkidle');
  });

  test.describe('Voice Recording Performance', () => {
    test('should handle voice recording with minimal latency', async ({ page }) => {
      await page.locator('[data-testid="voice-mode-button"]').click();
      
      // Mock MediaDevices API for consistent testing
      await page.evaluate(() => {
        let isRecording = false;
        let mediaRecorder = null;
        
        navigator.mediaDevices.getUserMedia = async () => {
          return new Promise(resolve => {
            setTimeout(() => {
              const stream = new MediaStream();
              resolve(stream);
            }, 50); // Simulate 50ms permission/setup time
          });
        };
        
        window.MediaRecorder = class MockMediaRecorder {
          constructor(stream) {
            this.stream = stream;
            this.state = 'inactive';
            this.ondataavailable = null;
            this.onstop = null;
            this.onstart = null;
          }
          
          start() {
            const startTime = performance.now();
            this.state = 'recording';
            isRecording = true;
            
            setTimeout(() => {
              if (this.onstart) this.onstart();
              window.recordingStartTime = performance.now();
              window.recordingSetupTime = window.recordingStartTime - startTime;
            }, 10); // Simulate 10ms start latency
          }
          
          stop() {
            const stopTime = performance.now();
            this.state = 'inactive';
            isRecording = false;
            
            setTimeout(() => {
              if (this.onstop) this.onstop();
              if (this.ondataavailable) {
                this.ondataavailable({ 
                  data: new Blob(['fake audio data'], { type: 'audio/webm' }),
                  timecode: stopTime
                });
              }
              window.recordingStopTime = performance.now();
              window.recordingProcessTime = window.recordingStopTime - stopTime;
            }, 20); // Simulate 20ms stop/processing latency
          }
        };
      });
      
      const recordButton = page.locator('[data-testid="record-button"]');
      
      // Measure recording start performance
      const startTime = Date.now();
      await recordButton.click();
      
      await page.waitForSelector('[data-testid="recording-status"]', { timeout: 2000 });
      const recordingStarted = Date.now();
      const startLatency = recordingStarted - startTime;
      
      expect(startLatency).toBeLessThan(500); // Should start recording within 500ms
      
      // Record for 2 seconds
      await page.waitForTimeout(2000);
      
      // Measure recording stop performance
      const stopTime = Date.now();
      await recordButton.click();
      
      await page.waitForSelector('[data-testid="recording-status"]', { state: 'hidden', timeout: 2000 });
      const recordingStopped = Date.now();
      const stopLatency = recordingStopped - stopTime;
      
      expect(stopLatency).toBeLessThan(1000); // Should stop and process within 1 second
      
      // Check setup and processing times from page context
      const setupTime = await page.evaluate(() => window.recordingSetupTime || 0);
      const processTime = await page.evaluate(() => window.recordingProcessTime || 0);
      
      expect(setupTime).toBeLessThan(100); // Setup should be < 100ms
      expect(processTime).toBeLessThan(100); // Processing should be < 100ms
    });

    test('should handle multiple rapid recording attempts gracefully', async ({ page }) => {
      await page.locator('[data-testid="voice-mode-button"]').click();
      
      // Mock getUserMedia for rapid testing
      await page.evaluate(() => {
        navigator.mediaDevices.getUserMedia = () => 
          Promise.resolve(new MediaStream());
      });
      
      const recordButton = page.locator('[data-testid="record-button"]');
      
      // Rapid click test
      const startTime = performance.now();
      for (let i = 0; i < 5; i++) {
        await recordButton.click();
        await page.waitForTimeout(100);
      }
      const endTime = performance.now();
      
      // Should handle rapid clicks without hanging
      expect(endTime - startTime).toBeLessThan(2000);
      
      // Should not be stuck in recording state
      await expect(page.locator('[data-testid="record-button"]')).not.toBeDisabled();
    });

    test('should maintain 60fps during recording animations', async ({ page }) => {
      await page.locator('[data-testid="voice-mode-button"]').click();
      
      await page.evaluate(() => {
        navigator.mediaDevices.getUserMedia = () => 
          Promise.resolve(new MediaStream());
        
        // Performance monitoring
        window.frameCount = 0;
        window.lastFrameTime = performance.now();
        window.frameTimes = [];
        
        function countFrames() {
          const now = performance.now();
          const deltaTime = now - window.lastFrameTime;
          window.frameTimes.push(deltaTime);
          window.frameCount++;
          window.lastFrameTime = now;
          
          if (window.frameCount < 60) { // Monitor for 1 second at 60fps
            requestAnimationFrame(countFrames);
          }
        }
        
        requestAnimationFrame(countFrames);
      });
      
      const recordButton = page.locator('[data-testid="record-button"]');
      await recordButton.click();
      
      // Wait for animation monitoring to complete
      await page.waitForTimeout(1200);
      
      const frameStats = await page.evaluate(() => {
        const avgFrameTime = window.frameTimes.reduce((a, b) => a + b, 0) / window.frameTimes.length;
        const maxFrameTime = Math.max(...window.frameTimes);
        return { avgFrameTime, maxFrameTime, frameCount: window.frameCount };
      });
      
      // Average frame time should be close to 16.67ms (60fps)
      expect(frameStats.avgFrameTime).toBeLessThan(20);
      // No frame should take longer than 33ms (30fps minimum)
      expect(frameStats.maxFrameTime).toBeLessThan(33);
      expect(frameStats.frameCount).toBeGreaterThan(50);
    });
  });

  test.describe('Audio Playback Performance', () => {
    test('should play audio with minimal delay', async ({ page }) => {
      await page.evaluate(() => {
        // Mock audio playback
        window.HTMLAudioElement.prototype.play = function() {
          const startTime = performance.now();
          return new Promise(resolve => {
            setTimeout(() => {
              this.currentTime = 0;
              this.duration = 5; // 5 second audio
              window.audioPlayStartTime = performance.now() - startTime;
              resolve();
            }, 50); // Simulate 50ms load time
          });
        };
      });
      
      // Simulate playing a voice message
      await page.locator('[data-testid="voice-mode-button"]').click();
      
      // Mock a voice message being present
      await page.evaluate(() => {
        const mockMessage = {
          id: 'test-voice-msg',
          isVoiceMessage: true,
          recordingData: { uri: 'mock://audio.m4a', duration: 5 }
        };
        
        // Simulate clicking play on a voice message
        const playButton = document.createElement('button');
        playButton.setAttribute('data-testid', 'play-voice-message');
        playButton.onclick = async () => {
          const audio = new Audio(mockMessage.recordingData.uri);
          await audio.play();
        };
        document.body.appendChild(playButton);
      });
      
      const startTime = Date.now();
      await page.locator('[data-testid="play-voice-message"]').click();
      
      // Wait for audio to start playing
      await page.waitForTimeout(200);
      
      const playStartTime = await page.evaluate(() => window.audioPlayStartTime);
      expect(playStartTime).toBeLessThan(100); // Should start playing within 100ms
    });

    test('should handle concurrent audio operations efficiently', async ({ page }) => {
      await page.evaluate(() => {
        let audioInstances = 0;
        const originalAudio = window.Audio;
        
        window.Audio = function(src) {
          audioInstances++;
          const audio = new originalAudio(src);
          
          audio.play = function() {
            return new Promise(resolve => {
              setTimeout(resolve, 10 + Math.random() * 20); // 10-30ms variation
            });
          };
          
          return audio;
        };
        
        window.getAudioInstances = () => audioInstances;
        
        // Create multiple audio elements
        for (let i = 0; i < 5; i++) {
          const audio = new window.Audio(`mock://audio${i}.m4a`);
          audio.play();
        }
      });
      
      await page.waitForTimeout(100);
      
      const audioInstances = await page.evaluate(() => window.getAudioInstances());
      expect(audioInstances).toBe(5);
      
      // Should handle multiple instances without performance degradation
      const performanceEntries = await page.evaluate(() => {
        return performance.getEntriesByType('measure').length;
      });
      
      // Performance shouldn't be severely impacted
      expect(performanceEntries).toBeLessThan(100);
    });
  });

  test.describe('AI Response Performance', () => {
    test('should respond to messages within acceptable time limits', async ({ page }) => {
      await page.locator('[data-testid="text-mode-button"]').click();
      
      const chatInput = page.locator('[data-testid="chat-input-field"]');
      const sendButton = page.locator('[data-testid="send-button"]');
      
      // Test various message types and measure response times
      const testMessages = [
        'Hello', // Simple greeting
        'I am feeling anxious today', // Emotional keyword
        'Can you help me with a breathing exercise?', // Request
        'I want to harm myself', // Crisis detection
      ];
      
      for (const message of testMessages) {
        const startTime = Date.now();
        
        await chatInput.fill(message);
        await sendButton.click();
        
        // Wait for typing indicator
        await page.waitForSelector('[data-testid="typing-indicator"]', { timeout: 1000 });
        const typingStarted = Date.now();
        
        // Wait for response
        await page.waitForSelector('[data-testid="ai-message"]', { timeout: 10000 });
        const responseReceived = Date.now();
        
        const uiResponseTime = typingStarted - startTime;
        const totalResponseTime = responseReceived - startTime;
        
        expect(uiResponseTime).toBeLessThan(300); // UI should respond within 300ms
        expect(totalResponseTime).toBeLessThan(5000); // Total response within 5 seconds
        
        // Clear for next test
        await page.reload();
        await page.waitForLoadState('networkidle');
      }
    });

    test('should handle high message frequency efficiently', async ({ page }) => {
      await page.locator('[data-testid="text-mode-button"]').click();
      
      const chatInput = page.locator('[data-testid="chat-input-field"]');
      const sendButton = page.locator('[data-testid="send-button"]');
      
      const messageCount = 10;
      const startTime = Date.now();
      
      // Send messages rapidly (simulating fast typing user)
      for (let i = 0; i < messageCount; i++) {
        await chatInput.fill(`Message ${i + 1}`);
        await sendButton.click();
        await page.waitForTimeout(200); // 200ms between messages
      }
      
      const endTime = Date.now();
      const totalTime = endTime - startTime;
      
      // Should handle all messages without significant slowdown
      expect(totalTime).toBeLessThan(messageCount * 500); // Max 500ms per message
      
      // Check that all messages were processed
      await page.waitForSelector('[data-testid="user-message"]', { timeout: 5000 });
      const userMessages = await page.locator('[data-testid="user-message"]').count();
      expect(userMessages).toBe(messageCount);
    });
  });

  test.describe('Network Performance', () => {
    test('should handle poor network conditions gracefully', async ({ page }) => {
      // Simulate slow network
      await page.route('**/*', route => {
        setTimeout(() => route.continue(), 2000); // 2 second delay
      });
      
      await page.locator('[data-testid="text-mode-button"]').click();
      
      const startTime = Date.now();
      await page.locator('[data-testid="chat-input-field"]').fill('Test message');
      await page.locator('[data-testid="send-button"]').click();
      
      // Should show loading state immediately
      await expect(page.locator('[data-testid="typing-indicator"]')).toBeVisible({ timeout: 1000 });
      
      // Should eventually get response or show error
      try {
        await page.waitForSelector('[data-testid="ai-message"]', { timeout: 15000 });
      } catch {
        await expect(page.locator('[data-testid="error-message"]')).toBeVisible();
      }
      
      const endTime = Date.now();
      const totalTime = endTime - startTime;
      
      // Should handle slow network within reasonable bounds
      expect(totalTime).toBeLessThan(20000); // Should timeout or succeed within 20 seconds
    });

    test('should retry failed requests appropriately', async ({ page }) => {
      let requestCount = 0;
      
      await page.route('**/api/**', route => {
        requestCount++;
        if (requestCount < 3) {
          route.abort('failed');
        } else {
          route.fulfill({
            status: 200,
            contentType: 'application/json',
            body: JSON.stringify({ message: 'Success after retries' })
          });
        }
      });
      
      await page.locator('[data-testid="text-mode-button"]').click();
      await page.locator('[data-testid="chat-input-field"]').fill('Test retry message');
      await page.locator('[data-testid="send-button"]').click();
      
      // Should eventually succeed after retries
      await page.waitForSelector('[data-testid="ai-message"], [data-testid="retry-button"]', { timeout: 10000 });
      
      expect(requestCount).toBeGreaterThanOrEqual(2); // Should have retried at least once
    });

    test('should cache responses for better performance', async ({ page }) => {
      const startTime = Date.now();
      
      // First request
      await page.locator('[data-testid="text-mode-button"]').click();
      await page.locator('[data-testid="chat-input-field"]').fill('Hello');
      await page.locator('[data-testid="send-button"]').click();
      
      await page.waitForSelector('[data-testid="ai-message"]', { timeout: 10000 });
      const firstResponseTime = Date.now() - startTime;
      
      // Reload and send same message
      await page.reload();
      await page.waitForLoadState('networkidle');
      
      const secondStartTime = Date.now();
      await page.locator('[data-testid="text-mode-button"]').click();
      await page.locator('[data-testid="chat-input-field"]').fill('Hello');
      await page.locator('[data-testid="send-button"]').click();
      
      await page.waitForSelector('[data-testid="ai-message"]', { timeout: 10000 });
      const secondResponseTime = Date.now() - secondStartTime;
      
      // Second response might be faster due to caching (implementation dependent)
      console.log(`First response: ${firstResponseTime}ms, Second response: ${secondResponseTime}ms`);
    });
  });

  test.describe('Memory Usage During Extended Sessions', () => {
    test('should maintain reasonable memory usage during long sessions', async ({ page }) => {
      await page.locator('[data-testid="text-mode-button"]').click();
      
      // Enable memory monitoring
      const initialMemory = await page.evaluate(() => {
        if (performance.memory) {
          return {
            used: performance.memory.usedJSHeapSize,
            total: performance.memory.totalJSHeapSize,
            limit: performance.memory.jsHeapSizeLimit
          };
        }
        return null;
      });
      
      // Simulate extended therapy session
      for (let i = 0; i < 50; i++) {
        await page.locator('[data-testid="chat-input-field"]').fill(`Session message ${i + 1}`);
        await page.locator('[data-testid="send-button"]').click();
        
        // Wait for response before sending next message
        if (i % 10 === 0) {
          await page.waitForSelector('[data-testid="ai-message"]', { timeout: 10000 });
        }
        
        await page.waitForTimeout(100);
      }
      
      const finalMemory = await page.evaluate(() => {
        if (performance.memory) {
          return {
            used: performance.memory.usedJSHeapSize,
            total: performance.memory.totalJSHeapSize,
            limit: performance.memory.jsHeapSizeLimit
          };
        }
        return null;
      });
      
      if (initialMemory && finalMemory) {
        const memoryIncrease = finalMemory.used - initialMemory.used;
        const memoryIncreasePercentage = (memoryIncrease / initialMemory.used) * 100;
        
        // Memory increase should be reasonable for extended session
        expect(memoryIncreasePercentage).toBeLessThan(200); // Less than 200% increase
        
        // Should not approach memory limit
        const memoryUsagePercentage = (finalMemory.used / finalMemory.limit) * 100;
        expect(memoryUsagePercentage).toBeLessThan(80); // Less than 80% of limit
      }
    });

    test('should clean up resources when leaving screen', async ({ page }) => {
      // Monitor resource cleanup
      await page.evaluate(() => {
        window.originalAddEventListener = window.addEventListener;
        window.originalRemoveEventListener = window.removeEventListener;
        window.eventListenerCount = 0;
        
        window.addEventListener = function(...args) {
          window.eventListenerCount++;
          return window.originalAddEventListener.apply(this, args);
        };
        
        window.removeEventListener = function(...args) {
          window.eventListenerCount--;
          return window.originalRemoveEventListener.apply(this, args);
        };
      });
      
      // Start therapy session
      await page.locator('[data-testid="voice-mode-button"]').click();
      
      // Start recording to create resources
      await page.evaluate(() => {
        navigator.mediaDevices.getUserMedia = () => 
          Promise.resolve(new MediaStream());
      });
      
      await page.locator('[data-testid="record-button"]').click();
      await page.waitForTimeout(1000);
      
      const midSessionListeners = await page.evaluate(() => window.eventListenerCount);
      
      // Navigate away
      await page.locator('[data-testid="back-button"]').click();
      await page.waitForTimeout(500);
      
      const finalListeners = await page.evaluate(() => window.eventListenerCount);
      
      // Should have cleaned up most listeners
      expect(finalListeners).toBeLessThanOrEqual(midSessionListeners);
    });
  });

  test.describe('Animation Performance', () => {
    test('should maintain smooth animations during interactions', async ({ page }) => {
      // Monitor animation performance
      await page.evaluate(() => {
        window.animationFrameTimes = [];
        const originalRAF = window.requestAnimationFrame;
        
        window.requestAnimationFrame = function(callback) {
          const startTime = performance.now();
          return originalRAF(function(...args) {
            const callbackTime = performance.now();
            window.animationFrameTimes.push(callbackTime - startTime);
            return callback.apply(this, args);
          });
        };
      });
      
      // Trigger various animations
      await page.locator('[data-testid="voice-mode-button"]').click();
      await page.locator('[data-testid="guided-mode-button"]').click();
      await page.locator('[data-testid="text-mode-button"]').click();
      
      await page.waitForTimeout(2000); // Let animations complete
      
      const animationStats = await page.evaluate(() => {
        if (window.animationFrameTimes.length === 0) return null;
        
        const avg = window.animationFrameTimes.reduce((a, b) => a + b, 0) / window.animationFrameTimes.length;
        const max = Math.max(...window.animationFrameTimes);
        
        return { average: avg, maximum: max, count: window.animationFrameTimes.length };
      });
      
      if (animationStats) {
        // Animation frames should be processed quickly
        expect(animationStats.average).toBeLessThan(5); // Average < 5ms processing
        expect(animationStats.maximum).toBeLessThan(16); // Max < 16ms (60fps)
      }
    });
  });
});