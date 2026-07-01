import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { AlertTriangle } from 'lucide-react-native';

import { useTheme } from '../context/ThemeContext';
import { radius } from '../theme/colors';
import { Font } from '../theme/fonts';

export function MessageErreur({ message }) {
  const { colors } = useTheme();
  if (!message) return null;

  return (
    <View style={[styles.conteneur, { backgroundColor: 'rgba(239,68,68,0.12)', borderColor: colors.danger }]}>
      <AlertTriangle size={18} color={colors.danger} />
      <Text style={[styles.texte, { color: colors.danger }]}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  conteneur: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    borderWidth: 1,
    borderRadius: radius.md,
    padding: 12,
  },
  texte: { flex: 1, fontFamily: Font.medium, fontSize: 13 },
});
