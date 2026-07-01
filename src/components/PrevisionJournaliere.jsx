import React from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { CalendarDays } from 'lucide-react-native';

import { CarteVerre } from './CarteVerre';
import { Font } from '../theme/fonts';
import { urlIconeMeteo } from '../utils/formatMeteo';
import { bornesTemperatures } from '../utils/agregerPrevisions';

const LARGEUR_BARRE = 90;

export function PrevisionJournaliere({ jours, ambiance }) {
  if (!jours || jours.length === 0) return null;
  const { min, max } = bornesTemperatures(jours);
  const amplitude = Math.max(max - min, 1);

  return (
    <CarteVerre
      titre={`Prévisions sur ${jours.length} jours`}
      ambiance={ambiance}
      icone={<CalendarDays size={14} color={ambiance.texteDoux} />}
    >
      {jours.map((jour, index) => {
        const debut = ((jour.min - min) / amplitude) * LARGEUR_BARRE;
        const longueur = Math.max(((jour.max - jour.min) / amplitude) * LARGEUR_BARRE, 8);

        return (
          <View
            key={jour.date}
            style={[
              styles.ligne,
              index < jours.length - 1 && { borderBottomColor: ambiance.bordure, borderBottomWidth: 1 },
            ]}
          >
            <Text style={[styles.jour, { color: ambiance.texte }]}>
              {index === 0 ? "Auj." : jour.libelle.split(' ')[0]}
            </Text>
            <Image source={{ uri: urlIconeMeteo(jour.icone) }} style={styles.icone} />
            <Text style={[styles.min, { color: ambiance.texteDoux }]}>{jour.min}°</Text>

            <View style={[styles.piste, { backgroundColor: ambiance.bordure }]}>
              <LinearGradient
                colors={['#4F8EF7', '#22D3EE', '#F59E0B']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={[styles.remplissage, { left: debut, width: longueur }]}
              />
            </View>

            <Text style={[styles.max, { color: ambiance.texte }]}>{jour.max}°</Text>
          </View>
        );
      })}
    </CarteVerre>
  );
}

const styles = StyleSheet.create({
  ligne: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    gap: 10,
  },
  jour: { fontFamily: Font.semiBold, fontSize: 15, width: 46 },
  icone: { width: 30, height: 30 },
  min: { fontFamily: Font.medium, fontSize: 15, width: 34, textAlign: 'right' },
  piste: {
    width: LARGEUR_BARRE,
    height: 5,
    borderRadius: 3,
    overflow: 'hidden',
    justifyContent: 'center',
  },
  remplissage: { position: 'absolute', height: 5, borderRadius: 3 },
  max: { fontFamily: Font.bold, fontSize: 15, width: 34 },
});
