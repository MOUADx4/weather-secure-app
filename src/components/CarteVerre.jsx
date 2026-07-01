import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { radius } from '../theme/colors';
import { Font } from '../theme/fonts';

export function CarteVerre({ titre, icone, ambiance, children, style }) {
  return (
    <View
      style={[
        styles.carte,
        { backgroundColor: ambiance.verre, borderColor: ambiance.bordure },
        style,
      ]}
    >
      {titre ? (
        <View style={styles.entete}>
          {icone}
          <Text style={[styles.titre, { color: ambiance.texteDoux }]}>{titre.toUpperCase()}</Text>
        </View>
      ) : null}
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  carte: {
    borderWidth: 1,
    borderRadius: radius.xl,
    padding: 16,
  },
  entete: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 12,
  },
  titre: {
    fontFamily: Font.semiBold,
    fontSize: 12,
    letterSpacing: 0.8,
  },
});
