import React, { useState, useEffect } from 'react';
import * as Haptics from 'expo-haptics';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
  BackHandler,
} from 'react-native';
import styled from 'styled-components/native';
import { useDispatch, useSelector } from 'react-redux';
import { loginStart, loginSuccess, loginFailure } from '../../store/slices/authSlice';
import { useTheme } from '../../contexts/ThemeContext';
import LoadingScreen from '../../components/LoadingScreen';

const LoginContainer = styled(KeyboardAvoidingView)`
  flex: 1;
  background-color: ${props => props.backgroundColor};
`;

const ScrollContainer = styled(ScrollView)`
  flex: 1;
`;

const ContentContainer = styled(View)`
  flex: 1;
  justify-content: center;
  padding: 40px 20px;
  min-height: 600px;
`;

const HeaderContainer = styled(View)`
  align-items: center;
  margin-bottom: 40px;
`;

const LogoContainer = styled(View)`
  width: 80px;
  height: 80px;
  border-radius: 40px;
  background-color: ${props => props.color};
  justify-content: center;
  align-items: center;
  margin-bottom: 20px;
`;

const LogoText = styled(Text)`
  font-size: 32px;
  color: ${props => props.theme.colors.text.inverse};
`;

const WelcomeTitle = styled(Text)`
  font-size: 28px;
  font-weight: bold;
  color: ${props => props.color};
  text-align: center;
  margin-bottom: 8px;
`;

const WelcomeSubtitle = styled(Text)`
  font-size: 16px;
  color: ${props => props.color};
  text-align: center;
  line-height: 22px;
`;

const FormContainer = styled(View)`
  margin-bottom: 30px;
`;

const InputContainer = styled(View)`
  margin-bottom: 20px;
`;

const InputLabel = styled(Text)`
  font-size: 14px;
  font-weight: 600;
  color: ${props => props.color};
  margin-bottom: 8px;
`;

const StyledTextInput = styled(TextInput)`
  background-color: ${props => props.backgroundColor};
  border: 1px solid ${props => props.borderColor};
  border-radius: 12px;
  padding: 16px;
  font-size: 16px;
  color: ${props => props.textColor};
`;

const LoginButton = styled(TouchableOpacity)`
  background-color: ${props => props.backgroundColor};
  padding: 18px;
  border-radius: 12px;
  align-items: center;
  margin-bottom: 20px;
  opacity: ${props => props.disabled ? 0.6 : 1};
`;

const ButtonText = styled(Text)`
  color: ${props => props.theme.colors.text.inverse};
  font-size: 16px;
  font-weight: 600;
`;

const SecondaryButton = styled(TouchableOpacity)`
  padding: 16px;
  align-items: center;
`;

const SecondaryButtonText = styled(Text)`
  color: ${props => props.color};
  font-size: 16px;
  font-weight: 500;
`;

const ForgotPasswordButton = styled(TouchableOpacity)`
  align-items: center;
  margin-bottom: 20px;
`;

const ForgotPasswordText = styled(Text)`
  color: ${props => props.color};
  font-size: 14px;
`;

const LoginScreen = ({ navigation }) => {
  const { theme } = useTheme();
  const dispatch = useDispatch();
  const { isLoading } = useSelector(state => state.auth);
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');

  // Handle hardware back button on Android
  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      () => {
        if (navigation.canGoBack()) {
          navigation.goBack();
          return true;
        }
        return false;
      }
    );

    return () => backHandler.remove();
  }, [navigation]);

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleLogin = async () => {
    // Reset errors
    setEmailError('');
    setPasswordError('');

    // Validation
    let hasErrors = false;

    if (!email) {
      setEmailError('Email is required');
      hasErrors = true;
    } else if (!validateEmail(email)) {
      setEmailError('Please enter a valid email');
      hasErrors = true;
    }

    if (!password) {
      setPasswordError('Password is required');
      hasErrors = true;
    } else if (password.length < 6) {
      setPasswordError('Password must be at least 6 characters');
      hasErrors = true;
    }

    if (hasErrors) return;

    try {
      dispatch(loginStart());
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Mock successful login
      const mockUser = {
        id: '1',
        email: email,
        name: 'John Doe',
        avatar: null,
      };
      
      const mockToken = 'mock_jwt_token_' + Date.now();
      
      dispatch(loginSuccess({ user: mockUser, token: mockToken }));
      
    } catch (error) {
      dispatch(loginFailure('Login failed. Please try again.'));
      Alert.alert('Login Failed', 'Please check your credentials and try again.');
    }
  };

  const handleRegister = () => {
    navigation.navigate('Register');
  };

  const handleForgotPassword = () => {
    Alert.alert(
      'Reset Password',
      'Password reset functionality will be implemented soon.',
      [{ text: 'OK' }]
    );
  };

  if (isLoading) {
    return <LoadingScreen text="Signing you in..." />;
  }

  return (
    <LoginContainer
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      backgroundColor={theme.colors.background.primary}
    >
      <ScrollContainer contentContainerStyle={{ flexGrow: 1 }}>
        <ContentContainer>
          <HeaderContainer>
            <LogoContainer color={theme.colors.primary[500]}>
              <LogoText theme={theme}>🧠</LogoText>
            </LogoContainer>
            
            <WelcomeTitle color={theme.colors.text.primary}>
              Welcome Back
            </WelcomeTitle>
            
            <WelcomeSubtitle color={theme.colors.text.secondary}>
              Sign in to continue your mental wellness journey
            </WelcomeSubtitle>
          </HeaderContainer>

          <FormContainer>
            <InputContainer>
              <InputLabel color={theme.colors.text.primary}>Email</InputLabel>
              <StyledTextInput
                placeholder="Enter your email"
                placeholderTextColor={theme.colors.text.tertiary}
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                autoComplete="email"
                backgroundColor={theme.colors.background.secondary}
                borderColor={emailError ? theme.colors.error[500] : theme.colors.gray[300]}
                textColor={theme.colors.text.primary}
              />
              {emailError ? (
                <Text style={{ color: theme.colors.error[500], fontSize: 12, marginTop: 4 }}>
                  {emailError}
                </Text>
              ) : null}
            </InputContainer>

            <InputContainer>
              <InputLabel color={theme.colors.text.primary}>Password</InputLabel>
              <StyledTextInput
                placeholder="Enter your password"
                placeholderTextColor={theme.colors.text.tertiary}
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                autoComplete="password"
                backgroundColor={theme.colors.background.secondary}
                borderColor={passwordError ? theme.colors.error[500] : theme.colors.gray[300]}
                textColor={theme.colors.text.primary}
              />
              {passwordError ? (
                <Text style={{ color: theme.colors.error[500], fontSize: 12, marginTop: 4 }}>
                  {passwordError}
                </Text>
              ) : null}
            </InputContainer>

            <ForgotPasswordButton onPress={handleForgotPassword}>
              <ForgotPasswordText color={theme.colors.primary[500]}>
                Forgot Password?
              </ForgotPasswordText>
            </ForgotPasswordButton>

            <LoginButton
              backgroundColor={theme.colors.primary[500]}
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                handleLogin();
              }}
              disabled={isLoading}
              accessibilityLabel="Sign in to your account"
              accessibilityHint="Tap to log in with your email and password"
              accessibilityRole="button"
            >
              <ButtonText theme={theme}>Sign In</ButtonText>
            </LoginButton>

            <SecondaryButton 
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                handleRegister();
              }}
              accessibilityLabel="Go to registration"
              accessibilityHint="Navigate to create a new account"
              accessibilityRole="button"
            >
              <SecondaryButtonText color={theme.colors.text.secondary}>
                Don't have an account? Sign Up
              </SecondaryButtonText>
            </SecondaryButton>
          </FormContainer>
        </ContentContainer>
      </ScrollContainer>
    </LoginContainer>
  );
};

export default LoginScreen;
