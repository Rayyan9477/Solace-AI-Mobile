import React, { useEffect, useRef, useMemo } from 'react';
import { View, Text, Animated, Dimensions, StyleSheet } from 'react-native';
import styled from 'styled-components/native';
import LinearGradient from 'react-native-linear-gradient';
import { useTheme } from '../contexts/ThemeContext';

const { width, height } = Dimensions.get('window');

const SplashContainer = styled(LinearGradient)`
  flex: 1;
  justify-content: center;
  align-items: center;
  width: ${width}px;
  height: ${height}px;
`;

const LogoContainer = styled(Animated.View)`
  align-items: center;
  margin-bottom: 40px;
`;

const AppTitle = styled(Animated.Text)`
  font-size: 32px;
  font-weight: bold;
  color: ${props => props.theme.colors.text.inverse};
  margin-bottom: 8px;
  text-align: center;
`;

const AppSubtitle = styled(Animated.Text)`
  font-size: 16px;
  color: ${props => props.theme.colors.text.inverse};
  opacity: 0.9;
  text-align: center;
  max-width: 280px;
  line-height: 22px;
`;

const LoadingIndicator = styled(Animated.View)`
  width: 60px;
  height: 4px;
  background-color: ${props => props.theme.colors.overlay.light};
  border-radius: 2px;
  overflow: hidden;
  margin-top: 30px;
`;

const LoadingBar = styled(Animated.View)`
  height: 100%;
  background-color: ${props => props.theme.colors.text.inverse};
  border-radius: 2px;
`;

const SplashScreen = () => {
  const { theme } = useTheme();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const progressAnim = useRef(new Animated.Value(0)).current;

  // Memoize animated styles to prevent recreation on each render
  const logoContainerStyle = useMemo(() => ({
    opacity: fadeAnim,
    transform: [{ scale: scaleAnim }],
  }), [fadeAnim, scaleAnim]);

  const fadeStyle = useMemo(() => ({
    opacity: fadeAnim,
  }), [fadeAnim]);

  const progressBarStyle = useMemo(() => ({
    width: progressAnim.interpolate({
      inputRange: [0, 1],
      outputRange: ['0%', '100%'],
    }),
  }), [progressAnim]);

  useEffect(() => {
    // Start animations
    Animated.sequence([
      // Fade in and scale up
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          tension: 50,
          friction: 5,
          useNativeDriver: true,
        }),
      ]),
      // Progress bar animation
      Animated.timing(progressAnim, {
        toValue: 1,
        duration: 1500,
        useNativeDriver: false,
      }),
    ]).start();
  }, []);

  return (
    <SplashContainer
      colors={[theme.colors.primary[600], theme.colors.primary[400], theme.colors.secondary[400]]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      <LogoContainer
        style={logoContainerStyle}
      >
        {/* Logo Icon Placeholder */}
        <View
          style={[
            styles.logoIcon,
            { backgroundColor: theme.colors.overlay.light }
          ]}
        >
          <Text style={[styles.logoIconText, { color: theme.colors.text.inverse }]}>🧠</Text>
        </View>
        
        <AppTitle
          style={fadeStyle}
          theme={theme}
        >
          Solace AI
        </AppTitle>
        
        <AppSubtitle
          style={fadeStyle}
          theme={theme}
        >
          Your Empathetic Digital Confidant
        </AppSubtitle>
      </LogoContainer>

      <LoadingIndicator
        style={fadeStyle}
      >
        <LoadingBar
          style={progressBarStyle}
          theme={theme}
        />
      </LoadingIndicator>
    </SplashContainer>
  );
};

const styles = StyleSheet.create({
  logoIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  logoIconText: {
    fontSize: 32,
  },
});

export default SplashScreen;
