import React from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';

import { useTheme } from '../context/ThemeContext';
import { Font } from '../theme/fonts';

export function IndicateurChargement({ message }) {
  const { colors } = useTheme();
  return (
    <View style={styles.conteneur}>
      <ActivityIndicator size="large" color={colors.primary} />
      {message ? <Text style={[styles.texte, { color: colors.textMuted }]}>{message}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  conteneur: { alignItems: 'center', justifyContent: 'center', padding: 24, gap: 12 },
  texte: { fontFamily: Font.medium, fontSize: 14 },
});
