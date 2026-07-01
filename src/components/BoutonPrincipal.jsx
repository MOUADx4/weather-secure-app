import React from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

import { useTheme } from '../context/ThemeContext';
import { radius } from '../theme/colors';
import { Font } from '../theme/fonts';

// variant : 'primary' (dégradé), 'secondary' (contour) ou 'danger'.
export function BoutonPrincipal({
  libelle,
  onPress,
  variant = 'primary',
  chargement = false,
  desactive = false,
  icone = null,
  style,
}) {
  const { colors } = useTheme();
  const inactif = desactive || chargement;

  const contenu = chargement ? (
    <ActivityIndicator color={variant === 'secondary' ? colors.text : '#fff'} />
  ) : (
    <View style={styles.contenu}>
      {icone}
      <Text
        style={[
          styles.libelle,
          { color: variant === 'secondary' ? colors.text : '#fff' },
        ]}
      >
        {libelle}
      </Text>
    </View>
  );

  if (variant === 'primary') {
    return (
      <Pressable
        onPress={onPress}
        disabled={inactif}
        style={({ pressed }) => [
          inactif && styles.inactif,
          pressed && !inactif && styles.presse,
          style,
        ]}
      >
        <LinearGradient
          colors={[colors.primaryDark, colors.primary]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.base}
        >
          {contenu}
        </LinearGradient>
      </Pressable>
    );
  }

  const styleVariant =
    variant === 'danger'
      ? { backgroundColor: colors.danger }
      : { backgroundColor: colors.surfaceElevated, borderWidth: 1.5, borderColor: colors.borderStrong };

  return (
    <Pressable
      onPress={onPress}
      disabled={inactif}
      style={({ pressed }) => [
        styles.base,
        styleVariant,
        inactif && styles.inactif,
        pressed && !inactif && styles.presse,
        style,
      ]}
    >
      {contenu}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    height: 52,
    borderRadius: radius.lg,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  contenu: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  libelle: {
    fontFamily: Font.bold,
    fontSize: 15,
    letterSpacing: 0.2,
  },
  inactif: { opacity: 0.45 },
  presse: { opacity: 0.85, transform: [{ scale: 0.98 }] },
});
