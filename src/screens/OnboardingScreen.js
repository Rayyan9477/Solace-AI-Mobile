import * as Haptics from "expo-haptics";
import React, { useState, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Dimensions,
  ScrollView,
  Animated,
} from "react-native";
import { useDispatch } from "react-redux";
import styled from "styled-components/native";

import { useTheme } from "../contexts/ThemeContext";
import { completeOnboarding } from "../store/slices/authSlice";
import { lightTheme } from "../styles/theme";

const { width, height } = Dimensions.get("window");

const OnboardingContainer = styled(View)`
  flex: 1;
  background-color: ${(props) => props.backgroundColor};
`;

const SlideContainer = styled(View)`
  width: ${width}px;
  height: ${height}px;
  justify-content: center;
  align-items: center;
  padding: 40px 20px;
`;

const IllustrationContainer = styled(View)`
  width: 200px;
  height: 200px;
  border-radius: 100px;
  background-color: ${(props) => props.color};
  justify-content: center;
  align-items: center;
  margin-bottom: 40px;
`;

const IllustrationText = styled(Text)`
  font-size: 80px;
  color: ${(props) => props.theme.colors.text.inverse};
`;

const TitleText = styled(Text)`
  font-size: 28px;
  font-weight: bold;
  color: ${(props) => props.color};
  text-align: center;
  margin-bottom: 16px;
`;

const DescriptionText = styled(Text)`
  font-size: 16px;
  color: ${(props) => props.color};
  text-align: center;
  line-height: 24px;
  max-width: 300px;
`;

const NavigationContainer = styled(View)`
  position: absolute;
  bottom: 60px;
  left: 0;
  right: 0;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 0 20px;
`;

const PaginationContainer = styled(View)`
  flex-direction: row;
  justify-content: center;
  align-items: center;
`;

const PaginationDot = styled(View)`
  width: 12px;
  height: 12px;
  border-radius: 6px;
  background-color: ${(props) =>
    props.active ? props.activeColor : props.inactiveColor};
  margin: 0 4px;
`;

const NavigationButton = styled(TouchableOpacity)`
  background-color: ${(props) => props.backgroundColor};
  padding: 16px 32px;
  border-radius: 25px;
  min-width: 100px;
  align-items: center;
`;

const ButtonText = styled(Text)`
  color: ${(props) => props.color};
  font-size: 16px;
  font-weight: 600;
`;

const SkipButton = styled(TouchableOpacity)`
  padding: 16px;
`;

const SkipText = styled(Text)`
  color: ${(props) => props.color};
  font-size: 16px;
`;

const onboardingData = [
  {
    id: 1,
    title: "Welcome to Solace AI",
    description:
      "Your personal mental health companion that understands your emotions and provides empathetic support.",
    illustration: "🧠",
    color: lightTheme.colors.primary[500],
  },
  {
    id: 2,
    title: "Emotional Intelligence",
    description:
      "Advanced AI that detects emotions in your voice and text to provide personalized therapeutic responses.",
    illustration: "💝",
    color: lightTheme.colors.warning[500],
  },
  {
    id: 3,
    title: "Privacy & Security",
    description:
      "Your conversations are encrypted and secure. Your mental health journey remains completely private.",
    illustration: "🔒",
    color: lightTheme.colors.success[500],
  },
  {
    id: 4,
    title: "Track Your Progress",
    description:
      "Monitor your emotional patterns and mental wellness journey with beautiful insights and analytics.",
    illustration: "📊",
    color: lightTheme.colors.secondary[500],
  },
];

const OnboardingScreen = () => {
  const { theme } = useTheme();
  const dispatch = useDispatch();
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollViewRef = useRef(null);
  const fadeAnim = useRef(new Animated.Value(1)).current;

  const handleNext = () => {
    if (currentIndex < onboardingData.length - 1) {
      const nextIndex = currentIndex + 1;
      setCurrentIndex(nextIndex);
      scrollViewRef.current?.scrollTo({
        x: nextIndex * width,
        animated: true,
      });
    } else {
      handleComplete();
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      const prevIndex = currentIndex - 1;
      setCurrentIndex(prevIndex);
      scrollViewRef.current?.scrollTo({
        x: prevIndex * width,
        animated: true,
      });
    }
  };

  const handleComplete = () => {
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      dispatch(completeOnboarding());
    });
  };

  const handleScroll = (event) => {
    const contentOffset = event.nativeEvent.contentOffset;
    const currentIndex = Math.round(contentOffset.x / width);
    setCurrentIndex(currentIndex);
  };

  return (
    <Animated.View style={{ flex: 1, opacity: fadeAnim }}>
      <OnboardingContainer backgroundColor={theme.colors.background.primary}>
        <ScrollView
          ref={scrollViewRef}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onScroll={handleScroll}
          scrollEventThrottle={16}
        >
          {onboardingData.map((item, index) => (
            <SlideContainer key={item.id}>
              <IllustrationContainer color={item.color}>
                <IllustrationText theme={theme}>
                  {item.illustration}
                </IllustrationText>
              </IllustrationContainer>

              <TitleText color={theme.colors.text.primary}>
                {item.title}
              </TitleText>

              <DescriptionText color={theme.colors.text.secondary}>
                {item.description}
              </DescriptionText>
            </SlideContainer>
          ))}
        </ScrollView>

        <NavigationContainer>
          {currentIndex > 0 ? (
            <NavigationButton
              backgroundColor={theme.colors.gray[200]}
              onPress={handlePrevious}
              accessibilityLabel="Go to previous step"
              accessibilityHint="Navigate to the previous onboarding screen"
              accessibilityRole="button"
            >
              <ButtonText color={theme.colors.text.primary}>
                Previous
              </ButtonText>
            </NavigationButton>
          ) : (
            <SkipButton
              onPress={() => {
                Haptics.notificationAsync(
                  Haptics.NotificationFeedbackType.Success,
                );
                handleComplete();
              }}
              accessibilityLabel="Skip onboarding"
              accessibilityHint="Skip the introduction and go to main app"
              accessibilityRole="button"
            >
              <SkipText color={theme.colors.text.secondary}>Skip</SkipText>
            </SkipButton>
          )}

          <PaginationContainer>
            {onboardingData.map((_, index) => (
              <PaginationDot
                key={index}
                active={index === currentIndex}
                activeColor={theme.colors.primary[500]}
                inactiveColor={theme.colors.gray[300]}
              />
            ))}
          </PaginationContainer>

          <NavigationButton
            backgroundColor={theme.colors.primary[500]}
            onPress={handleNext}
            accessibilityLabel={
              currentIndex === onboardingData.length - 1
                ? "Get started with Solace"
                : "Continue to next step"
            }
            accessibilityHint={
              currentIndex === onboardingData.length - 1
                ? "Complete onboarding and enter the app"
                : "Proceed to the next onboarding screen"
            }
            accessibilityRole="button"
          >
            <ButtonText color={theme.colors.text.inverse}>
              {currentIndex === onboardingData.length - 1
                ? "Get Started"
                : "Next"}
            </ButtonText>
          </NavigationButton>
        </NavigationContainer>
      </OnboardingContainer>
    </Animated.View>
  );
};

export default OnboardingScreen;
