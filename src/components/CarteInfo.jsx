import React from 'react';
import { StyleSheet, Text } from 'react-native';

import { CarteVerre } from './CarteVerre';
import { Font } from '../theme/fonts';

export function CarteInfo({ titre, icone, valeur, sousTexte, ambiance }) {
  return (
    <CarteVerre titre={titre} icone={icone} ambiance={ambiance} style={styles.carte}>
      <Text style={[styles.valeur, { color: ambiance.texte }]}>{valeur}</Text>
      {sousTexte ? (
        <Text style={[styles.sousTexte, { color: ambiance.texteDoux }]}>{sousTexte}</Text>
      ) : null}
    </CarteVerre>
  );
}

const styles = StyleSheet.create({
  carte: { flex: 1, minHeight: 130, justifyContent: 'flex-start' },
  valeur: { fontFamily: Font.light, fontSize: 32, marginTop: 2 },
  sousTexte: { fontFamily: Font.regular, fontSize: 13, marginTop: 'auto', paddingTop: 8 },
});
