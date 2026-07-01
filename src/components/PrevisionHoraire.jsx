import React from 'react';
import { Image, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Clock } from 'lucide-react-native';

import { CarteVerre } from './CarteVerre';
import { Font } from '../theme/fonts';
import { formatHeure, formatTemperature, urlIconeMeteo } from '../utils/formatMeteo';

export function PrevisionHoraire({ liste, ambiance }) {
  if (!liste || liste.length === 0) return null;

  return (
    <CarteVerre
      titre="Prévisions horaires"
      ambiance={ambiance}
      icone={<Clock size={14} color={ambiance.texteDoux} />}
    >
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View style={styles.rangee}>
          {liste.map((item, index) => (
            <View key={item.date} style={styles.colonne}>
              <Text style={[styles.heure, { color: ambiance.texte }]}>
                {index === 0 ? "Maint." : formatHeure(item.date)}
              </Text>
              <Image source={{ uri: urlIconeMeteo(item.icone) }} style={styles.icone} />
              <Text style={[styles.temp, { color: ambiance.texte }]}>
                {formatTemperature(item.temperature)}
              </Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </CarteVerre>
  );
}

const styles = StyleSheet.create({
  rangee: { flexDirection: 'row', gap: 4 },
  colonne: { alignItems: 'center', width: 60, gap: 4 },
  heure: { fontFamily: Font.semiBold, fontSize: 13 },
  icone: { width: 40, height: 40 },
  temp: { fontFamily: Font.bold, fontSize: 17 },
});
