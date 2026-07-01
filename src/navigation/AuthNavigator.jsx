import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { ConnexionScreen } from '../screens/ConnexionScreen';
import { InscriptionScreen } from '../screens/InscriptionScreen';
import { MotDePasseOublieScreen } from '../screens/MotDePasseOublieScreen';

const Stack = createNativeStackNavigator();

export function AuthNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Connexion" component={ConnexionScreen} />
      <Stack.Screen name="Inscription" component={InscriptionScreen} />
      <Stack.Screen name="MotDePasseOublie" component={MotDePasseOublieScreen} />
    </Stack.Navigator>
  );
}
