import React, { useEffect, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import * as SplashScreen from 'expo-splash-screen';
import {
  useFonts,
  PlusJakartaSans_300Light,
  PlusJakartaSans_400Regular,
  PlusJakartaSans_500Medium,
  PlusJakartaSans_600SemiBold,
  PlusJakartaSans_700Bold,
  PlusJakartaSans_800ExtraBold,
} from '@expo-google-fonts/plus-jakarta-sans';

import { ThemeProvider } from './src/context/ThemeContext';
import { SessionProvider } from './src/context/SessionContext';
import { RootNavigator } from './src/navigation/RootNavigator';
import { initBaseDeDonnees } from './src/database/sqliteClient';

SplashScreen.preventAutoHideAsync();

export default function App() {
  const [basePrete, setBasePrete] = useState(false);

  const [policesChargees] = useFonts({
    PlusJakartaSans_300Light,
    PlusJakartaSans_400Regular,
    PlusJakartaSans_500Medium,
    PlusJakartaSans_600SemiBold,
    PlusJakartaSans_700Bold,
    PlusJakartaSans_800ExtraBold,
  });

  useEffect(() => {
    initBaseDeDonnees().finally(() => setBasePrete(true));
  }, []);

  useEffect(() => {
    if (policesChargees && basePrete) {
      SplashScreen.hideAsync();
    }
  }, [policesChargees, basePrete]);

  if (!policesChargees || !basePrete) {
    return null;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <ThemeProvider>
          <SessionProvider>
            <StatusBar style="light" />
            <RootNavigator />
          </SessionProvider>
        </ThemeProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
