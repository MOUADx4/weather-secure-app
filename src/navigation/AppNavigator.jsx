import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { useTheme } from '../context/ThemeContext';
import { MainTabsNavigator } from './MainTabsNavigator';
import { DetailMeteoScreen } from '../screens/DetailMeteoScreen';

const Stack = createNativeStackNavigator();

export function AppNavigator() {
  const { colors } = useTheme();

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: colors.background },
      }}
    >
      <Stack.Screen name="Onglets" component={MainTabsNavigator} />
      <Stack.Screen name="DetailMeteo" component={DetailMeteoScreen} />
    </Stack.Navigator>
  );
}
