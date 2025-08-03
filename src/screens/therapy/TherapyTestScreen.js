import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';

import { MentalHealthIcon } from '../../components/icons';
import { useTheme } from '../../contexts/ThemeContext';
import { TherapySessionRecorder } from '../../components/therapy';
import { 
  startSession, 
  endSession, 
  setInteractionMode,
  selectCurrentSession,
  selectIsSessionActive 
} from '../../store/slices/therapySlice';

const TherapyTestScreen = ({ navigation }) => {
  const { theme } = useTheme();
  const dispatch = useDispatch();
  const currentSession = useSelector(selectCurrentSession);
  const isSessionActive = useSelector(selectIsSessionActive);

  const handleStartSession = () => {
    const sessionId = `test_${Date.now()}`;
    dispatch(startSession({
      sessionId,
      startTime: new Date().toISOString(),
    }));
  };

  const handleEndSession = () => {
    dispatch(endSession({
      endTime: new Date().toISOString(),
      mood: 'neutral',
      notes: 'Test session completed',
    }));
  };

  const handleRecordingComplete = (recordingData) => {
    console.log('Recording completed:', recordingData);
  };

  const testComponents = [
    {
      title: 'Redux Store Integration',
      status: currentSession ? 'Working' : 'Not initialized',
      color: currentSession ? theme.colors.success[500] : theme.colors.warning[500],
    },
    {
      title: 'Session Management', 
      status: isSessionActive ? 'Active Session' : 'No Active Session',
      color: isSessionActive ? theme.colors.success[500] : theme.colors.gray[500],
    },
    {
      title: 'Voice Recording Component',
      status: 'Ready to test',
      color: theme.colors.therapeutic.calming[500],
    },
    {
      title: 'Navigation Integration',
      status: 'Accessible from Wellness tab',
      color: theme.colors.therapeutic.nurturing[500],
    },
  ];

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background.primary }]}>
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backButton}
          >
            <MentalHealthIcon
              name="Heart"
              size={24}
              color={theme.colors.text.primary}
              variant="outline"
            />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: theme.colors.text.primary }]}>
            Therapy System Test
          </Text>
        </View>

        {/* Component Status */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text.primary }]}>
            Component Status
          </Text>
          {testComponents.map((component, index) => (
            <View key={index} style={[styles.statusCard, { backgroundColor: theme.colors.background.secondary }]}>
              <View style={styles.statusHeader}>
                <Text style={[styles.statusTitle, { color: theme.colors.text.primary }]}>
                  {component.title}
                </Text>
                <View style={[styles.statusIndicator, { backgroundColor: component.color }]} />
              </View>
              <Text style={[styles.statusText, { color: theme.colors.text.secondary }]}>
                {component.status}
              </Text>
            </View>
          ))}
        </View>

        {/* Session Management Test */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text.primary }]}>
            Session Management Test
          </Text>
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[
                styles.button,
                styles.primaryButton,
                { backgroundColor: theme.colors.therapeutic.calming[500] },
              ]}
              onPress={handleStartSession}
              disabled={isSessionActive}
            >
              <Text style={[styles.buttonText, { color: theme.colors.text.inverse }]}>
                Start Test Session
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.button,
                styles.secondaryButton,
                { 
                  backgroundColor: isSessionActive 
                    ? theme.colors.error[500] 
                    : theme.colors.gray[300] 
                },
              ]}
              onPress={handleEndSession}
              disabled={!isSessionActive}
            >
              <Text style={[styles.buttonText, { color: theme.colors.text.inverse }]}>
                End Test Session
              </Text>
            </TouchableOpacity>
          </View>

          {currentSession && (
            <View style={[styles.sessionInfo, { backgroundColor: theme.colors.therapeutic.calming[50] }]}>
              <Text style={[styles.sessionInfoTitle, { color: theme.colors.text.primary }]}>
                Current Session
              </Text>
              <Text style={[styles.sessionInfoText, { color: theme.colors.text.secondary }]}>
                ID: {currentSession.sessionId}
              </Text>
              <Text style={[styles.sessionInfoText, { color: theme.colors.text.secondary }]}>
                Status: {currentSession.isActive ? 'Active' : 'Inactive'}
              </Text>
              <Text style={[styles.sessionInfoText, { color: theme.colors.text.secondary }]}>
                Mode: {currentSession.interactionMode}
              </Text>
            </View>
          )}
        </View>

        {/* Voice Recording Test */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text.primary }]}>
            Voice Recording Test
          </Text>
          <Text style={[styles.sectionDescription, { color: theme.colors.text.secondary }]}>
            Test the TherapySessionRecorder component
          </Text>
          
          <TherapySessionRecorder
            onRecordingComplete={handleRecordingComplete}
            sessionId="test_session"
            maxDuration={60}
            style={styles.recorderContainer}
          />
        </View>

        {/* Navigation Test */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text.primary }]}>
            Navigation Test
          </Text>
          <TouchableOpacity
            style={[
              styles.button,
              styles.primaryButton,
              { backgroundColor: theme.colors.therapeutic.nurturing[500] },
            ]}
            onPress={() => navigation.navigate('Therapy')}
          >
            <Text style={[styles.buttonText, { color: theme.colors.text.inverse }]}>
              Open Full Therapy Screen
            </Text>
          </TouchableOpacity>
        </View>

        {/* Interaction Mode Test */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text.primary }]}>
            Interaction Mode Test
          </Text>
          <View style={styles.modeButtons}>
            {['text', 'voice', 'guided'].map((mode) => (
              <TouchableOpacity
                key={mode}
                style={[
                  styles.modeButton,
                  { 
                    backgroundColor: currentSession?.interactionMode === mode
                      ? theme.colors.therapeutic.calming[500]
                      : theme.colors.background.secondary,
                  },
                ]}
                onPress={() => dispatch(setInteractionMode(mode))}
              >
                <Text 
                  style={[
                    styles.modeButtonText,
                    { 
                      color: currentSession?.interactionMode === mode
                        ? theme.colors.text.inverse
                        : theme.colors.text.primary,
                    },
                  ]}
                >
                  {mode.charAt(0).toUpperCase() + mode.slice(1)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  backButton: {
    marginRight: 16,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
  },
  sectionDescription: {
    fontSize: 14,
    marginBottom: 16,
    lineHeight: 20,
  },
  statusCard: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
  },
  statusHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  statusTitle: {
    fontSize: 16,
    fontWeight: '500',
  },
  statusIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  statusText: {
    fontSize: 14,
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  button: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 48,
  },
  primaryButton: {
    // backgroundColor set dynamically
  },
  secondaryButton: {
    // backgroundColor set dynamically
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '500',
  },
  sessionInfo: {
    padding: 16,
    borderRadius: 12,
  },
  sessionInfoTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  sessionInfoText: {
    fontSize: 14,
    marginBottom: 4,
  },
  recorderContainer: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  modeButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  modeButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 44,
  },
  modeButtonText: {
    fontSize: 14,
    fontWeight: '500',
  },
});

export default TherapyTestScreen;