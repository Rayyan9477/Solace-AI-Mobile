import React from 'react';
import { View, ActivityIndicator } from 'react-native';
import styled from 'styled-components/native';
import { useTheme } from '../contexts/ThemeContext';

const LoadingContainer = styled(View)`
  flex: 1;
  justify-content: center;
  align-items: center;
  background-color: ${props => props.backgroundColor};
`;

const LoadingText = styled.Text`
  margin-top: 16px;
  font-size: 16px;
  color: ${props => props.textColor};
  text-align: center;
`;

const LoadingScreen = ({ text = 'Loading...' }) => {
  const { theme } = useTheme();

  return (
    <LoadingContainer backgroundColor={theme.colors.background.primary}>
      <ActivityIndicator 
        size="large" 
        color={theme.colors.primary[500]} 
      />
      <LoadingText textColor={theme.colors.text.secondary}>
        {text}
      </LoadingText>
    </LoadingContainer>
  );
};

export default LoadingScreen;
