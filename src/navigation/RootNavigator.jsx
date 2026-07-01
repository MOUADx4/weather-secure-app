import React from 'react';
import { View } from 'react-native';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';

import { useSession } from '../context/SessionContext';
import { useTheme } from '../context/ThemeContext';
import { IndicateurChargement } from '../components/IndicateurChargement';
import { AuthNavigator } from './AuthNavigator';
import { AppNavigator } from './AppNavigator';

// Aiguille l'utilisateur vers la zone publique (authentification) ou la zone
// connectée selon l'état de la session : c'est la protection des routes.
export function RootNavigator() {
  const { utilisateur, chargement } = useSession();
  const { colors } = useTheme();

  const themeNavigation = {
    ...DefaultTheme,
    colors: { ...DefaultTheme.colors, background: colors.background },
  };

  if (chargement) {
    return (
      <View style={{ flex: 1, backgroundColor: colors.background, justifyContent: 'center' }}>
        <IndicateurChargement message="Chargement de la session..." />
      </View>
    );
  }

  return (
    <NavigationContainer theme={themeNavigation}>
      {utilisateur ? <AppNavigator /> : <AuthNavigator />}
    </NavigationContainer>
  );
}
