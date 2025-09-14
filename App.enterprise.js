import React, { useEffect, useState } from 'react';
import { AppRegistry, Platform } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import * as SplashScreen from 'expo-splash-screen';
import * as Font from 'expo-font';
import { ErrorBoundary } from 'react-error-boundary';

// Enterprise Providers and Navigation
import { EnterpriseAppProvider } from './src/providers/EnterpriseAppProvider';
import RootNavigator from './src/navigation/EnterpriseNavigator';

// Design System
import { Container } from './src/design-system/components/Layout';
import { Heading, Body } from './src/design-system/components/Typography';
import { Button } from './src/design-system/components/Button';
import { LoadingSpinner } from './src/design-system/animations/TherapeuticAnimations';

// Global polyfills for enterprise compatibility
if (!global.compact) {
  global.compact = (array) => array.filter(Boolean);
}

SplashScreen.preventAutoHideAsync();

const EnterpriseErrorFallback = ({ error, resetErrorBoundary }) => (
  <Container
    therapeuticColor="empathyOrange"
    safe
    style={{
      justifyContent: 'center',
      alignItems: 'center',
      padding: 24
    }}
  >
    <Heading level={2} therapeuticColor="empathyOrange" align="center">
      Something went wrong
    </Heading>
    <Body size="large" align="center" style={{ marginVertical: 16 }}>
      We encountered an unexpected error. Our team has been notified.
    </Body>
    <Body therapeuticColor="optimisticGray" align="center" style={{ marginBottom: 24 }}>
      Error: {error.message}
    </Body>
    <Button
      variant="filled"
      therapeuticColor="serenityGreen"
      onPress={resetErrorBoundary}
      animationType="bounce"
    >
      Try Again
    </Button>
  </Container>
);

const EnterpriseLoadingScreen = () => (
  <Container
    therapeuticColor="serenityGreen"
    gradient
    safe
    style={{
      justifyContent: 'center',
      alignItems: 'center'
    }}
  >
    <LoadingSpinner therapeuticColor="#7D944D" size={60} />
    <Heading level={3} therapeuticColor="serenityGreen" style={{ marginTop: 24 }}>
      Solace AI
    </Heading>
    <Body therapeuticColor="serenityGreen">
      Your Empathetic Digital Confidant
    </Body>
  </Container>
);

const EnterpriseApp = () => {
  const [isReady, setIsReady] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    async function prepare() {
      try {
        // Load custom fonts
        await Font.loadAsync({
          'Urbanist': require('./assets/fonts/Urbanist-Regular.ttf'),
          'Urbanist-Medium': require('./assets/fonts/Urbanist-Medium.ttf'),
          'Urbanist-SemiBold': require('./assets/fonts/Urbanist-SemiBold.ttf'),
          'Urbanist-Bold': require('./assets/fonts/Urbanist-Bold.ttf'),
          'Urbanist-ExtraBold': require('./assets/fonts/Urbanist-ExtraBold.ttf'),
        });

        // Check authentication status
        // This would typically check SecureStore or Redux persist
        setIsAuthenticated(false); // Default to false for demo

        // Additional enterprise initialization
        await new Promise(resolve => setTimeout(resolve, 1500));

      } catch (e) {
        console.warn('Enterprise app initialization error:', e);
      } finally {
        setIsReady(true);
        await SplashScreen.hideAsync();
      }
    }

    prepare();
  }, []);

  if (!isReady) {
    return <EnterpriseLoadingScreen />;
  }

  return (
    <ErrorBoundary
      FallbackComponent={EnterpriseErrorFallback}
      onError={(error, errorInfo) => {
        console.error('Enterprise App Error:', error, errorInfo);
        // Here you would log to enterprise error tracking service
      }}
    >
      <EnterpriseAppProvider>
        <StatusBar style="auto" />
        <RootNavigator isAuthenticated={isAuthenticated} />
      </EnterpriseAppProvider>
    </ErrorBoundary>
  );
};

// Enterprise-grade app registration
AppRegistry.registerComponent('SolaceAIEnterprise', () => EnterpriseApp);

export default EnterpriseApp;