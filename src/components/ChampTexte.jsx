import React, { useState } from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';

import { useTheme } from '../context/ThemeContext';
import { radius } from '../theme/colors';
import { Font } from '../theme/fonts';

export function ChampTexte({ label, erreur, icone = null, style, ...props }) {
  const { colors } = useTheme();
  const [focus, setFocus] = useState(false);

  const couleurBordure = erreur
    ? colors.danger
    : focus
    ? colors.primary
    : colors.border;

  return (
    <View style={styles.wrapper}>
      {label ? (
        <Text style={[styles.label, { color: colors.textMuted }]}>{label}</Text>
      ) : null}

      <View
        style={[
          styles.conteneur,
          { backgroundColor: colors.surfaceElevated, borderColor: couleurBordure },
        ]}
      >
        {icone ? <View style={styles.icone}>{icone}</View> : null}
        <TextInput
          placeholderTextColor={colors.textDim}
          style={[styles.input, { color: colors.text }, icone && styles.inputAvecIcone, style]}
          onFocus={() => setFocus(true)}
          onBlur={() => setFocus(false)}
          {...props}
        />
      </View>

      {erreur ? <Text style={[styles.erreur, { color: colors.danger }]}>{erreur}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { gap: 7 },
  label: {
    fontFamily: Font.bold,
    fontSize: 11,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  conteneur: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderRadius: radius.lg,
  },
  icone: { paddingLeft: 14 },
  input: {
    flex: 1,
    height: 52,
    paddingHorizontal: 16,
    fontFamily: Font.regular,
    fontSize: 15,
  },
  inputAvecIcone: { paddingLeft: 10 },
  erreur: { fontFamily: Font.medium, fontSize: 12 },
});
