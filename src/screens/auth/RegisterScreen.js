import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  Alert,
} from 'react-native';
import styled from 'styled-components/native';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../../contexts/ThemeContext';
import { Button, Input } from '../../components/common';

const RegisterContainer = styled(KeyboardAvoidingView)`
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

const Title = styled(Text)`
  font-size: 28px;
  font-weight: bold;
  color: ${props => props.color};
  text-align: center;
  margin-bottom: 8px;
`;

const Subtitle = styled(Text)`
  font-size: 16px;
  color: ${props => props.color};
  text-align: center;
  line-height: 22px;
  max-width: 300px;
`;

const FormContainer = styled(View)`
  width: 100%;
  margin-bottom: 30px;
`;

const FooterContainer = styled(View)`
  align-items: center;
  margin-top: 20px;
`;

const FooterText = styled(Text)`
  font-size: 14px;
  color: ${props => props.color};
  text-align: center;
  margin-bottom: 10px;
`;

const LinkText = styled(Text)`
  font-size: 14px;
  color: ${props => props.color};
  font-weight: 600;
`;

const RegisterScreen = () => {
  const navigation = useNavigation();
  const { theme } = useTheme();
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    }
    
    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRegister = async () => {
    if (!validateForm()) return;
    
    setIsLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      Alert.alert(
        'Success',
        'Account created successfully! Please check your email to verify your account.',
        [
          {
            text: 'OK',
            onPress: () => navigation.navigate('Login'),
          },
        ]
      );
    } catch (error) {
      Alert.alert('Error', 'Failed to create account. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const updateFormData = (key, value) => {
    setFormData(prev => ({ ...prev, [key]: value }));
    if (errors[key]) {
      setErrors(prev => ({ ...prev, [key]: null }));
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.background.primary }}>
      <RegisterContainer
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        backgroundColor={theme.colors.background.primary}
      >
        <ScrollContainer
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps="handled"
        >
          <ContentContainer>
            <HeaderContainer>
              <LogoContainer color={theme.colors.primary.main}>
                <LogoText theme={theme}>S</LogoText>
              </LogoContainer>
              <Title color={theme.colors.text.primary}>
                Join Solace
              </Title>
              <Subtitle color={theme.colors.text.secondary}>
                Create your account and start your journey to better mental health
              </Subtitle>
            </HeaderContainer>

            <FormContainer>
              <Input
                label="First Name"
                value={formData.firstName}
                onChangeText={(value) => updateFormData('firstName', value)}
                placeholder="Enter your first name"
                error={errors.firstName}
                autoCapitalize="words"
                accessibilityLabel="First name input"
              />
              
              <Input
                label="Last Name"
                value={formData.lastName}
                onChangeText={(value) => updateFormData('lastName', value)}
                placeholder="Enter your last name"
                error={errors.lastName}
                autoCapitalize="words"
                accessibilityLabel="Last name input"
              />
              
              <Input
                label="Email"
                value={formData.email}
                onChangeText={(value) => updateFormData('email', value)}
                placeholder="Enter your email"
                error={errors.email}
                keyboardType="email-address"
                autoCapitalize="none"
                accessibilityLabel="Email input"
              />
              
              <Input
                label="Password"
                value={formData.password}
                onChangeText={(value) => updateFormData('password', value)}
                placeholder="Create a password"
                error={errors.password}
                secureTextEntry
                accessibilityLabel="Password input"
              />
              
              <Input
                label="Confirm Password"
                value={formData.confirmPassword}
                onChangeText={(value) => updateFormData('confirmPassword', value)}
                placeholder="Confirm your password"
                error={errors.confirmPassword}
                secureTextEntry
                accessibilityLabel="Confirm password input"
              />
            </FormContainer>

            <Button
              title={isLoading ? "Creating Account..." : "Create Account"}
              onPress={handleRegister}
              disabled={isLoading}
              fullWidth
              accessibilityLabel="Create account button"
              accessibilityHint="Creates your Solace account"
            />

            <FooterContainer>
              <FooterText color={theme.colors.text.secondary}>
                Already have an account?
              </FooterText>
              <Button
                title="Sign In"
                variant="text"
                onPress={() => navigation.navigate('Login')}
                accessibilityLabel="Sign in button"
                accessibilityHint="Navigate to login screen"
              />
            </FooterContainer>
          </ContentContainer>
        </ScrollContainer>
      </RegisterContainer>
    </SafeAreaView>
  );
};

export default RegisterScreen;