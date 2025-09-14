import React from 'react';
import { Provider as PaperProvider } from 'react-native-paper';
import { Provider as ReduxProvider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { store, persistor } from '../store/store';
import { lightTheme, darkTheme } from '../design-system/theme/MaterialTheme';
import { Container } from '../design-system/components/Layout';
import { LoadingSpinner } from '../design-system/animations/TherapeuticAnimations';
import { useColorScheme } from 'react-native';

const EnterpriseLoadingScreen = () => (
  <Container
    therapeuticColor="serenityGreen"
    animationType="fade"
    style={{
      justifyContent: 'center',
      alignItems: 'center'
    }}
  >
    <LoadingSpinner therapeuticColor="#7D944D" size={60} />
  </Container>
);

export const EnterpriseAppProvider = ({ children }) => {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  return (
    <ReduxProvider store={store}>
      <PersistGate loading={<EnterpriseLoadingScreen />} persistor={persistor}>
        <PaperProvider theme={isDark ? darkTheme : lightTheme}>
          {children}
        </PaperProvider>
      </PersistGate>
    </ReduxProvider>
  );
};

export default EnterpriseAppProvider;