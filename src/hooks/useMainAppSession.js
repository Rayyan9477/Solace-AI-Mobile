import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { useState, useEffect, useCallback, useMemo } from "react";
import { BackHandler, Alert, Linking } from "react-native";
import { useSelector, useDispatch } from "react-redux";

/**
 * Custom hook for managing main app screen session logic
 * Handles data fetching, error handling, navigation, and emergency actions
 */
export const useMainAppSession = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const [currentSection, setCurrentSection] = useState("dashboard");

  // Redux state selectors with fallbacks
  const { user, mood, chat, loading } = useSelector((state) => ({
    user: state.user || { profile: { name: "Friend" }, stats: {} },
    mood: state.mood || {
      currentMood: null,
      insights: [],
      weeklyStats: {},
      moodHistory: [],
    },
    chat: state.chat || { conversations: [] },
    loading: state.mood?.loading || state.user?.loading || false,
  }));

  // Data fetching with error handling
  const fetchData = useCallback(async () => {
    try {
      setError(null);
      // Simulate data fetching - replace with actual API calls
      await new Promise((resolve) => setTimeout(resolve, 1000));
      // TODO: Implement actual data fetching logic
      // await dispatch(fetchUserData());
      // await dispatch(fetchMoodData());
    } catch (error) {
      console.error("Failed to fetch app data:", error);
      setError(
        "Unable to load app data. Please check your connection and try again.",
      );
      Alert.alert(
        "Data Load Error",
        "We couldn't load your app data. Please check your internet connection and try again.",
        [
          { text: "Retry", onPress: () => fetchData() },
          { text: "OK", style: "cancel" },
        ],
      );
    }
  }, [dispatch]);

  // Initialize data on mount
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Pull-to-refresh handler
  const handleRefresh = useCallback(async () => {
    try {
      setRefreshing(true);
      setError(null);
      await fetchData();
    } catch (error) {
      // Error already handled in fetchData
    } finally {
      setRefreshing(false);
    }
  }, [fetchData]);

  // Back handler for Android
  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      () => {
        if (navigation.canGoBack()) {
          navigation.goBack();
          return true;
        }
        return false;
      },
    );

    return () => backHandler.remove();
  }, [navigation]);

  // Computed values
  const greeting = useMemo(() => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 17) return "Good afternoon";
    return "Good evening";
  }, []);

  const moodHistorySlice = useMemo(
    () => mood?.moodHistory?.slice(0, 3) || [],
    [mood.moodHistory],
  );

  const chatHistorySlice = useMemo(
    () => chat?.conversations?.slice(0, 2) || [],
    [chat.conversations],
  );

  return {
    // State
    refreshing,
    error,
    currentSection,
    loading,

    // Data
    user,
    mood,
    chat,
    greeting,
    moodHistorySlice,
    chatHistorySlice,

    // Actions
    handleRefresh,
    setCurrentSection,
    setError,
  };
};

/**
 * Custom hook for navigation actions from main app screen
 */
export const useMainAppNavigation = () => {
  const navigation = useNavigation();

  const handleMoodCheckIn = useCallback(() => {
    navigation.navigate("Mood");
  }, [navigation]);

  const handleStartChat = useCallback(() => {
    navigation.navigate("Chat");
  }, [navigation]);

  const handleTakeAssessment = useCallback(() => {
    navigation.navigate("Assessment");
  }, [navigation]);

  const handleViewProfile = useCallback(() => {
    navigation.navigate("Profile");
  }, [navigation]);

  return {
    handleMoodCheckIn,
    handleStartChat,
    handleTakeAssessment,
    handleViewProfile,
  };
};

/**
 * Custom hook for emergency actions and crisis support
 */
export const useEmergencySupport = () => {
  const showEmergencyAlert = useCallback(() => {
    Alert.alert(
      "Emergency Resources",
      "If you are experiencing a mental health crisis, please contact:\n\n• National Suicide Prevention Lifeline: 988\n• Crisis Text Line: Text HOME to 741741\n• Or call 911 for immediate assistance",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Call 988",
          onPress: async () => {
            try {
              const supported = await Linking.canOpenURL("tel:988");
              if (supported) {
                await Linking.openURL("tel:988");
              } else {
                Alert.alert(
                  "Unable to Call",
                  "Your device cannot make phone calls. Please dial 988 manually or contact emergency services.",
                  [{ text: "OK" }],
                );
              }
            } catch (error) {
              console.error("Error making emergency call:", error);
              Alert.alert(
                "Call Error",
                "Unable to place call. Please dial 988 manually for immediate assistance.",
                [{ text: "OK" }],
              );
            }
          },
        },
        {
          text: "Text Crisis Line",
          onPress: async () => {
            try {
              const supported = await Linking.canOpenURL("sms:741741");
              if (supported) {
                await Linking.openURL("sms:741741?body=HOME");
              } else {
                Alert.alert(
                  "Unable to Text",
                  "Your device cannot send text messages. Please text HOME to 741741 manually.",
                  [{ text: "OK" }],
                );
              }
            } catch (error) {
              console.error("Error opening text messaging:", error);
              Alert.alert(
                "Text Error",
                "Unable to open messaging. Please text HOME to 741741 manually.",
                [{ text: "OK" }],
              );
            }
          },
        },
      ],
    );
  }, []);

  return {
    showEmergencyAlert,
  };
};
