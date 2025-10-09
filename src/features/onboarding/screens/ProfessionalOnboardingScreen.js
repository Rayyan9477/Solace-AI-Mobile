import * as Haptics from "expo-haptics";
import { LinearGradient } from "expo-linear-gradient";
import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Dimensions,
  ScrollView,
  Animated,
  StatusBar,
  Platform,
} from "react-native";
import { useDispatch } from "react-redux";
import styled from "styled-components/native";

import { MentalHealthIcon, IconPresets } from "@/components/icons";
import { useTheme } from "@theme/ThemeContext";
import { completeOnboarding } from "@app/store/slices/authSlice";

const { width, height } = Dimensions.get("window");

// Styled Components
const OnboardingContainer = styled(View)`
  flex: 1;
  background-color: ${(props) => props.backgroundColor};
`;

const SlideContainer = styled(View)`
  width: ${width}px;
  height: ${height}px;
  justify-content: center;
  align-items: center;
  padding: 40px 24px;
`;

const IllustrationContainer = styled(View)`
  width: 200px;
  height: 200px;
  border-radius: 100px;
  justify-content: center;
  align-items: center;
  margin-bottom: 48px;
  shadow-color: ${(props) => props.shadowColor};
  shadow-offset: 0px 8px;
  shadow-opacity: 0.15;
  shadow-radius: 16px;
  elevation: 8;
`;

const BrandContainer = styled(View)`
  align-items: center;
  margin-bottom: 24px;
`;

const BrandText = styled(Text)`
  font-size: 32px;
  font-weight: 800;
  color: ${(props) => props.color};
  text-align: center;
  margin-bottom: 8px;
  letter-spacing: -0.5px;
`;

const SubBrandText = styled(Text)`
  font-size: 16px;
  font-weight: 500;
  color: ${(props) => props.color};
  text-align: center;
  opacity: 0.8;
`;

const TitleText = styled(Text)`
  font-size: 28px;
  font-weight: 700;
  color: ${(props) => props.color};
  text-align: center;
  margin-bottom: 16px;
  line-height: 36px;
  max-width: 320px;
`;

const DescriptionText = styled(Text)`
  font-size: 17px;
  color: ${(props) => props.color};
  text-align: center;
  line-height: 26px;
  max-width: 300px;
  font-weight: 400;
`;

const NavigationContainer = styled(View)`
  position: absolute;
  bottom: 60px;
  left: 0;
  right: 0;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 0 24px;
`;

const PaginationContainer = styled(View)`
  flex-direction: row;
  justify-content: center;
  align-items: center;
  position: absolute;
  bottom: 140px;
  left: 0;
  right: 0;
`;

const PaginationDot = styled(View)`
  height: 8px;
  border-radius: 4px;
  margin: 0 6px;
  background-color: ${(props) => props.backgroundColor};
  width: ${(props) => (props.active ? 32 : 8)}px;
`;

const PaginationProgress = styled(View)`
  height: 4px;
  background-color: ${(props) => props.backgroundColor};
  border-radius: 2px;
  margin: 0 2px 0 0;
  width: ${(props) => props.width}px;
`;

const NavigationButton = styled(TouchableOpacity)`
  background-color: ${(props) => props.backgroundColor};
  padding: 16px 32px;
  border-radius: 28px;
  min-width: 120px;
  align-items: center;
  shadow-color: ${(props) => props.shadowColor};
  shadow-offset: 0px 4px;
  shadow-opacity: 0.15;
  shadow-radius: 8px;
  elevation: 4;
`;

const ButtonText = styled(Text)`
  color: ${(props) => props.color};
  font-size: 16px;
  font-weight: 600;
`;

const SkipButton = styled(TouchableOpacity)`
  padding: 16px 20px;
  border-radius: 20px;
  background-color: ${(props) => props.backgroundColor};
`;

const SkipText = styled(Text)`
  color: ${(props) => props.color};
  font-size: 16px;
  font-weight: 500;
`;

const FeatureList = styled(View)`
  margin-top: 24px;
  align-items: flex-start;
  max-width: 280px;
`;

const FeatureItem = styled(View)`
  flex-direction: row;
  align-items: center;
  margin-bottom: 12px;
`;

const FeatureText = styled(Text)`
  color: ${(props) => props.color};
  font-size: 15px;
  font-weight: 500;
  margin-left: 12px;
  flex: 1;
`;

// Onboarding Data - Professional 6-step flow
const onboardingData = [
  {
    id: 1,
    title: "Welcome to Doctor Freud.AI",
    description: "The ultimate mental health companion powered by AI",
    subtitle: "Your journey to wellness starts here",
    icon: "brain",
    colorScheme: "empathy", // Warm orange from therapeutic palette
    features: [
      "AI-powered emotional intelligence",
      "Personalized mental health insights",
      "Private & secure conversations",
      "Evidence-based therapeutic approaches",
    ],
  },
  {
    id: 2,
    title: "Personalize Your Mental Health State",
    description:
      "Advanced AI that understands your unique emotional patterns and provides tailored support",
    subtitle: "AI that truly understands you",
    icon: "heart",
    colorScheme: "kind", // Purple from therapeutic palette
    features: [
      "Personalized AI therapy sessions",
      "Adaptive mood recognition",
      "Custom wellness recommendations",
      "Individual care plans",
    ],
  },
  {
    id: 3,
    title: "Intelligent Mood Tracking",
    description:
      "Smart mood analytics with AI emotion insights that help you understand your mental wellness patterns",
    subtitle: "AI-powered emotional insights",
    icon: "mindfulness",
    colorScheme: "calming", // Blue from therapeutic palette
    features: [
      "Advanced mood pattern analysis",
      "AI emotion detection",
      "Predictive wellness insights",
      "Progress tracking & trends",
    ],
  },
  {
    id: 4,
    title: "AI Mental Journaling & Therapy",
    description:
      "Intelligent journaling with AI therapy chatbot for deep emotional processing and growth",
    subtitle: "Your AI therapy companion",
    icon: "therapy",
    colorScheme: "nurturing", // Green from therapeutic palette
    features: [
      "AI-guided journaling prompts",
      "24/7 therapy chatbot access",
      "Emotional processing support",
      "Therapeutic writing insights",
    ],
  },
  {
    id: 5,
    title: "Mindful Resources for Happiness",
    description:
      "Curated wellness resources and mindfulness tools that bring joy and balance to your life",
    subtitle: "Discover your path to happiness",
    icon: "insights",
    colorScheme: "zen", // Yellow from therapeutic palette
    features: [
      "Personalized mindfulness exercises",
      "Guided meditation library",
      "Wellness activity recommendations",
      "Happiness tracking tools",
    ],
  },
  {
    id: 6,
    title: "Loving & Supportive Community",
    description:
      "Connect with others on similar journeys in a safe, supportive environment built for healing",
    subtitle: "You're never alone in your journey",
    icon: "journal",
    colorScheme: "grounding", // Purple from therapeutic palette
    features: [
      "Anonymous peer support groups",
      "Moderated community discussions",
      "Shared wellness experiences",
      "Professional community guidance",
    ],
  },
];

// Therapeutic gradient mappings
const getTherapeuticGradients = (colorScheme, colors) => {
  const gradientMap = {
    empathy: [
      colors.therapeutic.empathy[50],
      colors.therapeutic.empathy[100],
      colors.therapeutic.empathy[200],
    ],
    kind: [
      colors.therapeutic.kind[50],
      colors.therapeutic.kind[100],
      colors.therapeutic.kind[200],
    ],
    calming: [
      colors.therapeutic.calming[50],
      colors.therapeutic.calming[100],
      colors.therapeutic.calming[200],
    ],
    nurturing: [
      colors.therapeutic.nurturing[50],
      colors.therapeutic.nurturing[100],
      colors.therapeutic.nurturing[200],
    ],
    zen: [
      colors.therapeutic.zen[50],
      colors.therapeutic.zen[100],
      colors.therapeutic.zen[200],
    ],
    grounding: [
      colors.therapeutic.grounding[50],
      colors.therapeutic.grounding[100],
      colors.therapeutic.grounding[200],
    ],
    optimistic: [
      colors.therapeutic.optimistic[50],
      colors.therapeutic.optimistic[100],
      colors.therapeutic.optimistic[200],
    ],
  };

  return gradientMap[colorScheme] || gradientMap.calming;
};

const ProfessionalOnboardingScreen = () => {
  const { theme } = useTheme();
  const dispatch = useDispatch();
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollViewRef = useRef(null);
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const slideAnim = useRef(new Animated.Value(0)).current;

  // Individual animation refs for staggered effects
  const brandFadeAnim = useRef(new Animated.Value(0)).current;
  const titleSlideAnim = useRef(new Animated.Value(30)).current;
  const descSlideAnim = useRef(new Animated.Value(30)).current;
  const featureSlideAnim = useRef(new Animated.Value(30)).current;

  useEffect(() => {
    // Staggered entrance animation
    const animateEntrance = () => {
      // Reset animations
      brandFadeAnim.setValue(0);
      titleSlideAnim.setValue(30);
      descSlideAnim.setValue(30);
      featureSlideAnim.setValue(30);

      // Staggered animation sequence
      Animated.stagger(150, [
        Animated.timing(brandFadeAnim, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
        Animated.timing(titleSlideAnim, {
          toValue: 0,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(descSlideAnim, {
          toValue: 0,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(featureSlideAnim, {
          toValue: 0,
          duration: 500,
          useNativeDriver: true,
        }),
      ]).start();
    };

    animateEntrance();
  }, [currentIndex]);

  const handleNext = () => {
    // Haptic feedback
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

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
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

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
    // Success haptic feedback
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 400,
      useNativeDriver: true,
    }).start(() => {
      dispatch(completeOnboarding());
    });
  };

  const handleScroll = (event) => {
    const contentOffset = event.nativeEvent.contentOffset;
    const newIndex = Math.round(contentOffset.x / width);
    if (newIndex !== currentIndex) {
      setCurrentIndex(newIndex);
    }
  };

  const currentData = onboardingData[currentIndex];
  const gradientColors = getTherapeuticGradients(
    currentData.colorScheme,
    theme.colors,
  );
  const iconColor =
    theme.colors.therapeutic[currentData.colorScheme]?.[600] ||
    theme.colors.primary[600];

  return (
    <>
      <StatusBar
        barStyle={
          theme.colors.background.primary === "#FFFFFF"
            ? "dark-content"
            : "light-content"
        }
        backgroundColor="transparent"
        translucent
      />
      <Animated.View style={{ flex: 1, opacity: fadeAnim }}>
        <OnboardingContainer backgroundColor={theme.colors.background.primary}>
          <ScrollView
            ref={scrollViewRef}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onScroll={handleScroll}
            scrollEventThrottle={16}
            decelerationRate="fast"
          >
            {onboardingData.map((item, index) => {
              const itemGradientColors = getTherapeuticGradients(
                item.colorScheme,
                theme.colors,
              );
              const itemIconColor =
                theme.colors.therapeutic[item.colorScheme]?.[600] ||
                theme.colors.primary[600];

              return (
                <SlideContainer key={item.id}>
                  {/* Illustration with Gradient Background */}
                  <IllustrationContainer shadowColor={itemIconColor}>
                    <LinearGradient
                      colors={itemGradientColors}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 1 }}
                      style={{
                        width: 200,
                        height: 200,
                        borderRadius: 100,
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <MentalHealthIcon
                        name={item.icon}
                        size="4xl"
                        color={itemIconColor}
                        variant="outline"
                        strokeWidth={1.5}
                      />
                    </LinearGradient>
                  </IllustrationContainer>

                  {/* Brand Section - Only show on first screen */}
                  {index === 0 && (
                    <Animated.View
                      style={{
                        opacity: brandFadeAnim,
                        transform: [{ translateY: titleSlideAnim }],
                      }}
                    >
                      <BrandContainer>
                        <BrandText color={theme.colors.text.primary}>
                          Doctor Freud.AI
                        </BrandText>
                        <SubBrandText color={theme.colors.text.secondary}>
                          Professional Mental Health Care
                        </SubBrandText>
                      </BrandContainer>
                    </Animated.View>
                  )}

                  {/* Title */}
                  <Animated.View
                    style={{
                      transform: [{ translateY: titleSlideAnim }],
                    }}
                  >
                    <TitleText color={theme.colors.text.primary}>
                      {item.title}
                    </TitleText>
                  </Animated.View>

                  {/* Description */}
                  <Animated.View
                    style={{
                      transform: [{ translateY: descSlideAnim }],
                    }}
                  >
                    <DescriptionText color={theme.colors.text.secondary}>
                      {item.description}
                    </DescriptionText>
                  </Animated.View>

                  {/* Feature List */}
                  <Animated.View
                    style={{
                      transform: [{ translateY: featureSlideAnim }],
                    }}
                  >
                    <FeatureList>
                      {item.features.map((feature, featureIndex) => (
                        <FeatureItem key={featureIndex}>
                          <View
                            style={{
                              width: 6,
                              height: 6,
                              borderRadius: 3,
                              backgroundColor: itemIconColor,
                            }}
                          />
                          <FeatureText color={theme.colors.text.tertiary}>
                            {feature}
                          </FeatureText>
                        </FeatureItem>
                      ))}
                    </FeatureList>
                  </Animated.View>
                </SlideContainer>
              );
            })}
          </ScrollView>

          {/* Progress Indicators */}
          <PaginationContainer>
            {onboardingData.map((_, index) => (
              <PaginationDot
                key={index}
                active={index === currentIndex}
                backgroundColor={
                  index === currentIndex
                    ? theme.colors.therapeutic[
                        currentData.colorScheme
                      ]?.[500] || theme.colors.primary[500]
                    : theme.colors.gray[300]
                }
              />
            ))}
          </PaginationContainer>

          {/* Navigation */}
          <NavigationContainer>
            {/* Previous/Skip Button */}
            {currentIndex > 0 ? (
              <NavigationButton
                backgroundColor={theme.colors.gray[100]}
                shadowColor={theme.colors.gray[400]}
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
                backgroundColor={theme.colors.gray[50]}
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

            {/* Next/Get Started Button */}
            <NavigationButton
              backgroundColor={iconColor}
              shadowColor={iconColor}
              onPress={handleNext}
              accessibilityLabel={
                currentIndex === onboardingData.length - 1
                  ? "Get started with Doctor Freud.AI"
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
    </>
  );
};

export default ProfessionalOnboardingScreen;
