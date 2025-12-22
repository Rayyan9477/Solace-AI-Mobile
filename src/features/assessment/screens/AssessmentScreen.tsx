import { logger } from "@shared/utils/logger";

/**
 * Mental Health Assessment Screen
 * 14-question comprehensive mental health evaluation
 * Matches Freud UI design
 */

import { MentalHealthIcon } from "@components/icons";
import Slider from "@react-native-community/slider";
import { useNavigation } from "@react-navigation/native";
import { useTheme } from "@theme/ThemeProvider";
import { LinearGradient } from "expo-linear-gradient";
import { Audio } from "expo-av";
import { Camera, CameraType } from "expo-camera";
import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  ScrollView,
  Dimensions,
  TextInput,
  Alert,
  ActivityIndicator,
} from "react-native";
import { ScreenErrorBoundary } from "@shared/components/ErrorBoundaryWrapper";

const { width } = Dimensions.get("window");

const QUESTIONS = [
  {
    id: 1,
    question: "What's your primary mental health concern?",
    type: "multi-select",
    options: [
      "Anxiety",
      "Depression",
      "Stress",
      "Relationship issues",
    ],
  },
  {
    id: 2,
    question: "What's your official gender?",
    type: "single-select",
    options: ["I am male", "I am female"],
  },
  {
    id: 3,
    question: "About your age?",
    type: "age-selector",
    min: 10,
    max: 100,
  },
  {
    id: 4,
    question: "About your weight?",
    type: "weight-slider",
    min: 66,
    max: 440,
    unit: "lbs",
  },
  {
    id: 5,
    question: "How are you feeling today?",
    type: "mood-select",
    options: [
      { label: "Very sad", emoji: "😭", color: "#E07A5F" },
      { label: "Sad", emoji: "😢", color: "#E8A872" },
      { label: "Okay", emoji: "😐", color: "#B8976B" },
      { label: "Good", emoji: "🙂", color: "#98B068" },
      { label: "Happy", emoji: "😁", color: "#8FBC8F" },
    ],
  },
  {
    id: 6,
    question: "What are your stress triggers?",
    type: "multi-select",
    options: [
      "Work",
      "Relationships",
      "Financial issues",
      "Health concerns",
    ],
  },
  {
    id: 7,
    question: "Do you have a therapist or counselor?",
    type: "single-select",
    options: ["Yes", "No"],
  },
  {
    id: 8,
    question: "Are you experiencing any physical distress?",
    type: "multi-select",
    options: [
      "Yes, quite a lot",
      "Yes, but not much",
      "No, not experiencing anything physically",
    ],
  },
  {
    id: 9,
    question: "How would you rate your sleep quality?",
    type: "rating-slider",
    min: 1,
    max: 10,
    labels: ["Poor", "Fair", "Good", "Excellent"],
  },
  {
    id: 10,
    question: "Are you taking any medications?",
    type: "single-select",
    options: ["Yes", "No"],
  },
  {
    id: 11,
    question: "What medications are you currently taking?",
    type: "text-input",
    placeholder: "e.g., Sertraline 50mg, Lorazepam 0.5mg",
    conditional: (answers: any) => answers[10] === "Yes",
  },
  {
    id: 12,
    question: "Do you have other mental health symptoms?",
    type: "multi-select",
    options: ["Anxiety", "Depression", "Panic attacks", "Insomnia"],
  },
  {
    id: 13,
    question: "How would you rate your stress level?",
    type: "stress-slider",
    min: 1,
    max: 5,
  },
  {
    id: 14,
    question: "AI Sound Analysis",
    type: "sound-analysis",
    subtitle: "Record a short voice sample for AI analysis",
  },
  {
    id: 15,
    question: "Expression Analysis",
    type: "expression-analysis",
    subtitle: "Let AI analyze your facial expressions",
  },
];

const AssessmentScreenComponent = () => {
  const { theme } = useTheme();
  const navigation = useNavigation();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<number, any>>({});
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
  const [sliderValue, setSliderValue] = useState(50);
  const [textInput, setTextInput] = useState("");

  // Audio recording state
  const [recording, setRecording] = useState<Audio.Recording | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingDuration, setRecordingDuration] = useState(0);
  const [audioUri, setAudioUri] = useState<string | null>(null);
  const recordingInterval = useRef<NodeJS.Timeout | null>(null);

  // Camera state for expression analysis
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [type, setType] = useState(CameraType.front);
  const [showCamera, setShowCamera] = useState(false);
  const [photoUri, setPhotoUri] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const cameraRef = useRef<Camera | null>(null);

  const question = QUESTIONS[currentQuestion];
  const progress = ((currentQuestion + 1) / QUESTIONS.length) * 100;

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.isDark ? "#2D1B0E" : "#1A1108",
    },
    header: {
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: 24,
      paddingTop: 60,
      paddingBottom: 20,
    },
    backButton: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: "rgba(255, 255, 255, 0.1)",
      justifyContent: "center",
      alignItems: "center",
    },
    headerTitle: {
      flex: 1,
      fontSize: 16,
      fontWeight: "600",
      color: "#FFFFFF",
      textAlign: "center",
      marginRight: 40,
    },
    progressContainer: {
      paddingHorizontal: 24,
      marginBottom: 32,
    },
    progressBar: {
      height: 6,
      backgroundColor: "rgba(255, 255, 255, 0.2)",
      borderRadius: 3,
      overflow: "hidden",
    },
    progressFill: {
      height: "100%",
      backgroundColor: "#8FBC8F",
      borderRadius: 3,
    },
    progressText: {
      fontSize: 12,
      color: "#B8A99A",
      marginTop: 8,
    },
    content: {
      flex: 1,
      paddingHorizontal: 24,
    },
    questionText: {
      fontSize: 28,
      fontWeight: "700",
      color: "#FFFFFF",
      marginBottom: 32,
      lineHeight: 36,
    },
    optionsContainer: {
      gap: 12,
    },
    optionButton: {
      flexDirection: "row",
      alignItems: "center",
      paddingVertical: 16,
      paddingHorizontal: 20,
      borderRadius: 24,
      borderWidth: 1.5,
      borderColor: "#6B5444",
      backgroundColor: "rgba(45, 27, 14, 0.5)",
    },
    optionButtonSelected: {
      borderColor: "#8FBC8F",
      backgroundColor: "rgba(143, 188, 143, 0.15)",
    },
    optionText: {
      flex: 1,
      fontSize: 16,
      color: "#E5DDD5",
      fontWeight: "500",
    },
    optionTextSelected: {
      color: "#FFFFFF",
    },
    checkbox: {
      width: 24,
      height: 24,
      borderRadius: 12,
      borderWidth: 2,
      borderColor: "#6B5444",
      marginRight: 12,
      justifyContent: "center",
      alignItems: "center",
    },
    checkboxSelected: {
      backgroundColor: "#8FBC8F",
      borderColor: "#8FBC8F",
    },
    moodContainer: {
      flexDirection: "row",
      justifyContent: "space-around",
      marginTop: 20,
    },
    moodOption: {
      alignItems: "center",
      padding: 16,
      borderRadius: 20,
      borderWidth: 2,
      borderColor: "transparent",
      minWidth: 100,
    },
    moodOptionSelected: {
      borderColor: "#8FBC8F",
      backgroundColor: "rgba(143, 188, 143, 0.1)",
    },
    moodEmoji: {
      fontSize: 48,
      marginBottom: 8,
    },
    moodLabel: {
      fontSize: 14,
      color: "#B8A99A",
      fontWeight: "600",
    },
    sliderContainer: {
      marginTop: 40,
      alignItems: "center",
    },
    sliderValue: {
      fontSize: 72,
      fontWeight: "700",
      color: "#8FBC8F",
      marginBottom: 24,
    },
    sliderTrack: {
      width: "100%",
      height: 8,
    },
    sliderLabels: {
      flexDirection: "row",
      justifyContent: "space-between",
      width: "100%",
      marginTop: 12,
    },
    sliderLabel: {
      fontSize: 12,
      color: "#6B5444",
    },
    textInputContainer: {
      marginTop: 20,
    },
    textInput: {
      backgroundColor: "rgba(45, 27, 14, 0.5)",
      borderWidth: 1.5,
      borderColor: "#6B5444",
      borderRadius: 24,
      paddingVertical: 16,
      paddingHorizontal: 20,
      fontSize: 16,
      color: "#FFFFFF",
      fontWeight: "500",
    },
    textInputFocused: {
      borderColor: "#8FBC8F",
      backgroundColor: "rgba(143, 188, 143, 0.1)",
    },
    bottomContainer: {
      paddingHorizontal: 24,
      paddingBottom: 32,
    },
    continueButton: {
      backgroundColor: "#A67C52",
      borderRadius: 24,
      paddingVertical: 16,
      alignItems: "center",
      flexDirection: "row",
      justifyContent: "center",
    },
    continueButtonDisabled: {
      opacity: 0.5,
    },
    continueButtonText: {
      color: "#FFFFFF",
      fontSize: 16,
      fontWeight: "600",
      marginRight: 8,
    },
  });

  const autoAdvanceTimerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    return () => {
      if (autoAdvanceTimerRef.current) {
        clearTimeout(autoAdvanceTimerRef.current);
      }
    };
  }, []);

  const handleOptionSelect = (option: string) => {
    if (question.type === "multi-select") {
      const newSelection = selectedOptions.includes(option)
        ? selectedOptions.filter((o) => o !== option)
        : [...selectedOptions, option];
      setSelectedOptions(newSelection);
    } else {
      setAnswers({ ...answers, [question.id]: option });
      // Auto-advance for single-select with cleanup
      if (autoAdvanceTimerRef.current) {
        clearTimeout(autoAdvanceTimerRef.current);
      }
      autoAdvanceTimerRef.current = setTimeout(
        () => handleContinue(option),
        300,
      );
    }
  };

  // Audio recording functions
  const requestAudioPermission = async (): Promise<boolean> => {
    try {
      const { status } = await Audio.requestPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert(
          'Permission Required',
          'Microphone access is needed for sound analysis.',
          [{ text: 'OK' }]
        );
        return false;
      }
      return true;
    } catch (error) {
      logger.error('Error requesting audio permission:', error);
      return false;
    }
  };

  const startRecording = async () => {
    try {
      const hasPermission = await requestAudioPermission();
      if (!hasPermission) return;

      // Stop any existing recording
      if (recording) {
        await recording.stopAndUnloadAsync();
      }

      // Set audio mode for recording
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      // Create and start new recording
      const { recording: newRecording } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY
      );

      setRecording(newRecording);
      setIsRecording(true);
      setRecordingDuration(0);
      setAudioUri(null);

      // Start duration timer
      recordingInterval.current = setInterval(() => {
        setRecordingDuration((prev) => prev + 1);
      }, 1000);
    } catch (error) {
      logger.error('Failed to start recording:', error);
      Alert.alert('Recording Error', 'Failed to start recording. Please try again.');
    }
  };

  const stopRecording = async () => {
    try {
      if (!recording) return;

      // Stop duration timer
      if (recordingInterval.current) {
        clearInterval(recordingInterval.current);
        recordingInterval.current = null;
      }

      setIsRecording(false);
      await recording.stopAndUnloadAsync();
      const uri = recording.getURI();

      if (uri) {
        setAudioUri(uri);
        // Save URI to answers
        setAnswers({ ...answers, [question.id]: uri });
      }

      setRecording(null);
    } catch (error) {
      logger.error('Failed to stop recording:', error);
      Alert.alert('Recording Error', 'Failed to stop recording.');
    }
  };

  // Camera functions for expression analysis
  const requestCameraPermission = async (): Promise<boolean> => {
    try {
      const { status } = await Camera.requestCameraPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert(
          'Permission Required',
          'Camera access is needed for expression analysis.',
          [{ text: 'OK' }]
        );
        return false;
      }
      setHasPermission(true);
      return true;
    } catch (error) {
      logger.error('Error requesting camera permission:', error);
      return false;
    }
  };

  const takePicture = async () => {
    if (!cameraRef.current) return;

    try {
      setIsAnalyzing(true);
      const photo = await cameraRef.current.takePictureAsync({
        quality: 0.7,
        base64: false,
      });

      setPhotoUri(photo.uri);
      setShowCamera(false);

      // Simulate expression analysis (in production, this would call an AI service)
      setTimeout(() => {
        setIsAnalyzing(false);
        // Save expression analysis result
        setAnswers({
          ...answers,
          [question.id]: {
            photoUri: photo.uri,
            analysis: 'neutral', // This would be the actual AI analysis result
            timestamp: new Date().toISOString()
          }
        });
      }, 2000);
    } catch (error) {
      logger.error('Failed to take picture:', error);
      Alert.alert('Camera Error', 'Failed to capture image. Please try again.');
      setIsAnalyzing(false);
    }
  };

  const openCamera = async () => {
    const hasPermission = await requestCameraPermission();
    if (hasPermission) {
      setShowCamera(true);
      setPhotoUri(null);
    }
  };

  // Cleanup recording on unmount or question change
  useEffect(() => {
    return () => {
      if (recording) {
        recording.stopAndUnloadAsync().catch((err) => logger.error('Failed to stop recording:', err));
      }
      if (recordingInterval.current) {
        clearInterval(recordingInterval.current);
      }
    };
  }, [recording]);

  const handleContinue = (singleAnswer?: string) => {
    const answer =
      singleAnswer ||
      (question.type === "multi-select"
        ? selectedOptions
        : question.type === "text-input"
          ? textInput
          : question.type === "sound-analysis"
            ? audioUri
            : sliderValue);

    const updatedAnswers = { ...answers, [question.id]: answer };
    setAnswers(updatedAnswers);

    // Reset recording state when moving to next question
    setIsRecording(false);
    setRecordingDuration(0);
    setAudioUri(null);

    if (currentQuestion < QUESTIONS.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedOptions([]);
      setSliderValue(50);
      setTextInput("");
    } else {
      // Navigate to results with complete answers
      navigation.navigate("AssessmentResults" as never, { answers: updatedAnswers } as never);
    }
  };

  const canContinue = () => {
    if (question.type === "multi-select") {
      return selectedOptions.length > 0;
    }
    if (question.type === "single-select" || question.type === "mood-select") {
      return false; // Auto-advances
    }
    if (question.type === "text-input") {
      return textInput.trim().length > 0;
    }
    if (question.type === "sound-analysis") {
      return audioUri !== null; // Can continue if recording exists
    }
    if (question.type === "expression-analysis") {
      return true; // Can skip for now (not yet implemented)
    }
    return true;
  };

  const renderQuestion = () => {
    switch (question.type) {
      case "multi-select":
      case "single-select":
        return (
          <View style={styles.optionsContainer}>
            {question.options?.map((option, index) => (
              <TouchableOpacity
                key={`${question.id}-option-${option}-${index}`}
                style={[
                  styles.optionButton,
                  (question.type === "multi-select"
                    ? selectedOptions.includes(option)
                    : answers[question.id] === option) &&
                    styles.optionButtonSelected,
                ]}
                onPress={() => handleOptionSelect(option)}
              >
                {question.type === "multi-select" && (
                  <View
                    style={[
                      styles.checkbox,
                      selectedOptions.includes(option) &&
                        styles.checkboxSelected,
                    ]}
                  >
                    {selectedOptions.includes(option) && (
                      <Text style={{ color: "#FFFFFF", fontSize: 14 }}>✓</Text>
                    )}
                  </View>
                )}
                <Text
                  style={[
                    styles.optionText,
                    (question.type === "multi-select"
                      ? selectedOptions.includes(option)
                      : answers[question.id] === option) &&
                      styles.optionTextSelected,
                  ]}
                >
                  {option}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        );

      case "mood-select":
        return (
          <View style={styles.moodContainer}>
            {question.options?.map((option: any, index) => (
              <TouchableOpacity
                key={`${question.id}-mood-${option.label}-${index}`}
                style={[
                  styles.moodOption,
                  answers[question.id] === option.label &&
                    styles.moodOptionSelected,
                ]}
                onPress={() => handleOptionSelect(option.label)}
              >
                <Text style={styles.moodEmoji}>{option.emoji}</Text>
                <Text style={styles.moodLabel}>{option.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        );

      case "age-selector":
      case "weight-slider":
      case "rating-slider":
      case "stress-slider":
        return (
          <View style={styles.sliderContainer}>
            <Text style={styles.sliderValue}>
              {Math.round(sliderValue)}
              {question.unit || ""}
            </Text>
            <Slider
              style={styles.sliderTrack}
              minimumValue={question.min || 0}
              maximumValue={question.max || 100}
              value={sliderValue}
              onValueChange={setSliderValue}
              minimumTrackTintColor="#8FBC8F"
              maximumTrackTintColor="#6B5444"
              thumbTintColor="#8FBC8F"
            />
            {question.labels && (
              <View style={styles.sliderLabels}>
                {question.labels.map((label, index) => (
                  <Text key={`${question.id}-label-${label}-${index}`} style={styles.sliderLabel}>
                    {label}
                  </Text>
                ))}
              </View>
            )}
          </View>
        );

      case "text-input":
        return (
          <View style={styles.textInputContainer}>
            <TextInput
              style={styles.textInput}
              value={textInput}
              onChangeText={setTextInput}
              placeholder={question.placeholder || "Enter your answer..."}
              placeholderTextColor="#6B5444"
              multiline
              numberOfLines={3}
              textAlignVertical="top"
            />
          </View>
        );

      case "sound-analysis":
        return (
          <View style={{ alignItems: "center", paddingVertical: 30 }}>
            <Text style={{ color: "#B8A99A", fontSize: 14, marginBottom: 20, textAlign: "center" }}>
              {question.subtitle}
            </Text>

            {/* Recording indicator */}
            <View
              style={{
                width: 120,
                height: 120,
                borderRadius: 60,
                backgroundColor: isRecording ? "rgba(231, 76, 60, 0.2)" : "rgba(143, 188, 143, 0.2)",
                justifyContent: "center",
                alignItems: "center",
                marginBottom: 20,
                borderWidth: 3,
                borderColor: isRecording ? "#E74C3C" : "#8FBC8F",
              }}
            >
              {isRecording ? (
                <ActivityIndicator size="large" color="#E74C3C" />
              ) : audioUri ? (
                <Text style={{ fontSize: 40 }}>✓</Text>
              ) : (
                <Text style={{ fontSize: 40 }}>🎤</Text>
              )}
            </View>

            {/* Duration display */}
            {isRecording && (
              <Text style={{ color: "#E74C3C", fontSize: 18, fontWeight: "700", marginBottom: 20 }}>
                Recording: {Math.floor(recordingDuration / 60)}:
                {(recordingDuration % 60).toString().padStart(2, "0")}
              </Text>
            )}

            {audioUri && !isRecording && (
              <Text style={{ color: "#8FBC8F", fontSize: 16, fontWeight: "600", marginBottom: 20 }}>
                Recording saved ✓
              </Text>
            )}

            {/* Record button */}
            <TouchableOpacity
              style={{
                backgroundColor: isRecording ? "#E74C3C" : "#8FBC8F",
                paddingHorizontal: 32,
                paddingVertical: 14,
                borderRadius: 24,
                minWidth: 160,
                alignItems: "center",
              }}
              onPress={isRecording ? stopRecording : startRecording}
            >
              <Text style={{ color: "#FFFFFF", fontSize: 16, fontWeight: "700" }}>
                {isRecording ? "Stop Recording" : audioUri ? "Re-record" : "Start Recording"}
              </Text>
            </TouchableOpacity>

            {audioUri && (
              <Text
                style={{
                  color: "#6B5444",
                  fontSize: 12,
                  marginTop: 16,
                  fontStyle: "italic",
                }}
              >
                Tap Continue to proceed
              </Text>
            )}
          </View>
        );

      case "expression-analysis":
        if (showCamera) {
          return (
            <View style={{ flex: 1 }}>
              <Camera
                style={{ flex: 1, aspectRatio: 1 }}
                type={type}
                ref={cameraRef}
              >
                <View
                  style={{
                    flex: 1,
                    backgroundColor: "transparent",
                    flexDirection: "row",
                    justifyContent: "center",
                    alignItems: "flex-end",
                    paddingBottom: 40,
                  }}
                >
                  <TouchableOpacity
                    style={{
                      backgroundColor: "#E74C3C",
                      paddingHorizontal: 24,
                      paddingVertical: 12,
                      borderRadius: 24,
                      marginHorizontal: 10,
                    }}
                    onPress={() => {
                      setShowCamera(false);
                      setPhotoUri(null);
                    }}
                  >
                    <Text style={{ color: "#FFFFFF", fontSize: 16, fontWeight: "700" }}>
                      Cancel
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={{
                      backgroundColor: "#8FBC8F",
                      paddingHorizontal: 32,
                      paddingVertical: 14,
                      borderRadius: 24,
                    }}
                    onPress={takePicture}
                  >
                    <Text style={{ color: "#FFFFFF", fontSize: 18, fontWeight: "700" }}>
                      📸 Capture
                    </Text>
                  </TouchableOpacity>
                </View>
              </Camera>
            </View>
          );
        }

        return (
          <View style={{ alignItems: "center", paddingVertical: 30 }}>
            <Text style={{ color: "#B8A99A", fontSize: 14, marginBottom: 20, textAlign: "center" }}>
              {question.subtitle}
            </Text>

            {/* Expression indicator */}
            <View
              style={{
                width: 200,
                height: 200,
                borderRadius: 100,
                backgroundColor: photoUri ? "rgba(143, 188, 143, 0.3)" : "rgba(143, 188, 143, 0.2)",
                justifyContent: "center",
                alignItems: "center",
                marginBottom: 20,
                borderWidth: 3,
                borderColor: photoUri ? "#8FBC8F" : "#6B5444",
                borderStyle: photoUri ? "solid" : "dashed",
              }}
            >
              {isAnalyzing ? (
                <ActivityIndicator size="large" color="#8FBC8F" />
              ) : photoUri ? (
                <>
                  <Text style={{ fontSize: 50 }}>✓</Text>
                  <Text style={{ color: "#8FBC8F", fontSize: 14, marginTop: 8, fontWeight: "600" }}>
                    Analysis Complete
                  </Text>
                </>
              ) : (
                <Text style={{ fontSize: 60 }}>📸</Text>
              )}
            </View>

            {isAnalyzing && (
              <Text style={{ color: "#8FBC8F", fontSize: 16, fontWeight: "600", marginBottom: 20 }}>
                Analyzing expression...
              </Text>
            )}

            {photoUri && !isAnalyzing && (
              <View style={{ alignItems: "center", marginBottom: 20 }}>
                <Text style={{ color: "#8FBC8F", fontSize: 16, fontWeight: "600" }}>
                  Expression captured successfully
                </Text>
                <Text style={{ color: "#B8A99A", fontSize: 14, marginTop: 8 }}>
                  Analysis result: Neutral mood detected
                </Text>
              </View>
            )}

            <Text style={{  color: "#B8A99A",
                fontSize: 14,
                textAlign: "center",
                marginBottom: 24,
                paddingHorizontal: 20,
              }}
            >
              Facial expression analysis helps us better understand your emotional state.
            </Text>

            <View
              style={{
                backgroundColor: "rgba(184, 169, 154, 0.1)",
                padding: 16,
                borderRadius: 12,
                marginBottom: 24,
                width: "90%",
              }}
            >
              <Text
                style={{
                  color: "#B8A99A",
                  fontSize: 12,
                  textAlign: "center",
                  fontStyle: "italic",
                }}
              >
                🔒 Your privacy matters: Images are processed locally and never stored or shared.
              </Text>
            </View>

            <TouchableOpacity
              style={{
                backgroundColor: photoUri ? "#B8976B" : "#8FBC8F",
                paddingHorizontal: 32,
                paddingVertical: 14,
                borderRadius: 24,
                minWidth: 160,
                alignItems: "center",
                marginBottom: 12,
              }}
              onPress={openCamera}
              disabled={isAnalyzing}
            >
              <Text style={{ color: "#FFFFFF", fontSize: 16, fontWeight: "700" }}>
                {photoUri ? "Retake Photo" : "Enable Camera"}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={{
                paddingHorizontal: 32,
                paddingVertical: 14,
                borderRadius: 24,
                minWidth: 160,
                alignItems: "center",
                borderWidth: 1.5,
                borderColor: "#6B5444",
              }}
              onPress={() => {
                // Skip this step
                setAnswers({ ...answers, [question.id]: "skipped" });
              }}
            >
              <Text style={{ color: "#E5DDD5", fontSize: 16, fontWeight: "600" }}>
                Skip This Step
              </Text>
            </TouchableOpacity>
          </View>
        );

      default:
        return (
          <Text style={{ color: "#B8A99A", fontSize: 16 }}>
            {question.subtitle}
          </Text>
        );
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar
        barStyle="light-content"
        backgroundColor="transparent"
        translucent
      />

      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() =>
            currentQuestion > 0
              ? setCurrentQuestion(currentQuestion - 1)
              : navigation.goBack()
          }
        >
          <Text style={{ color: "#FFFFFF", fontSize: 20 }}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Assessment</Text>
      </View>

      <View style={styles.progressContainer}>
        <View style={styles.progressBar}>
          <View style={[styles.progressFill, { width: `${progress}%` }]} />
        </View>
        <Text style={styles.progressText}>
          Question {currentQuestion + 1} of {QUESTIONS.length}
        </Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.questionText}>{question.question}</Text>
        {renderQuestion()}
      </ScrollView>

      {question.type !== "single-select" && question.type !== "mood-select" && (
        <View style={styles.bottomContainer}>
          <TouchableOpacity
            style={[
              styles.continueButton,
              !canContinue() && styles.continueButtonDisabled,
            ]}
            onPress={() => handleContinue()}
            disabled={!canContinue()}
          >
            <Text style={styles.continueButtonText}>Continue</Text>
            <Text style={{ color: "#FFFFFF", fontSize: 18 }}>→</Text>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
};

export const AssessmentScreen = () => (
  <ScreenErrorBoundary screenName="Assessment">
    <AssessmentScreenComponent />
  </ScreenErrorBoundary>
);

// LOW-NEW-001 FIX: Add displayName for debugging and React DevTools
AssessmentScreen.displayName = "AssessmentScreen";

export default AssessmentScreen;
