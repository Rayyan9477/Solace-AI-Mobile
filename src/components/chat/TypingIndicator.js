import React, { useEffect, useRef } from "react";
import { View, Text, Animated, StyleSheet } from "react-native";
import styled from "styled-components/native";

import { useTheme } from "../../contexts/ThemeContext";

const Container = styled(View)`
  padding: 12px 16px;
  margin-left: 16px;
  margin-bottom: 16px;
  max-width: 70%;
  border-radius: 20px;
  background-color: ${(props) => props.backgroundColor};
  align-self: flex-start;
`;

const DotContainer = styled(View)`
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
`;

const TypingIndicator = () => {
  const { theme } = useTheme();
  const dot1Opacity = useRef(new Animated.Value(0.3)).current;
  const dot2Opacity = useRef(new Animated.Value(0.3)).current;
  const dot3Opacity = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    const animateDots = () => {
      Animated.sequence([
        // Dot 1 animation
        Animated.timing(dot1Opacity, {
          toValue: 1,
          duration: 400,
          useNativeDriver: true,
        }),
        // Dot 2 animation
        Animated.timing(dot2Opacity, {
          toValue: 1,
          duration: 400,
          useNativeDriver: true,
        }),
        // Dot 3 animation
        Animated.timing(dot3Opacity, {
          toValue: 1,
          duration: 400,
          useNativeDriver: true,
        }),
        // Reset all dots
        Animated.parallel([
          Animated.timing(dot1Opacity, {
            toValue: 0.3,
            duration: 400,
            useNativeDriver: true,
          }),
          Animated.timing(dot2Opacity, {
            toValue: 0.3,
            duration: 400,
            useNativeDriver: true,
          }),
          Animated.timing(dot3Opacity, {
            toValue: 0.3,
            duration: 400,
            useNativeDriver: true,
          }),
        ]),
      ]).start(() => {
        // Loop the animation
        animateDots();
      });
    };

    animateDots();

    return () => {
      // Clean up animations
      Animated.timing(dot1Opacity).stop();
      Animated.timing(dot2Opacity).stop();
      Animated.timing(dot3Opacity).stop();
    };
  }, [dot1Opacity, dot2Opacity, dot3Opacity]);

  const Dot = ({ opacity }) => (
    <Animated.View
      style={[
        styles.dot,
        {
          backgroundColor: theme.colors.text.secondary,
          opacity,
        },
      ]}
      accessibilityLabel="Typing indicator dot"
    />
  );

  return (
    <Container
      backgroundColor={theme.colors.background.secondary}
      accessibilityLabel="Solace AI is typing"
      accessibilityRole="image"
      accessibilityHint="The AI assistant is typing a response"
    >
      <DotContainer>
        <Dot opacity={dot1Opacity} />
        <Dot opacity={dot2Opacity} />
        <Dot opacity={dot3Opacity} />
      </DotContainer>
    </Container>
  );
};

const styles = StyleSheet.create({
  dot: {
    width: 44,
    height: 44,
    borderRadius: 4,
    marginRight: 4,
  },
});

export default TypingIndicator;
