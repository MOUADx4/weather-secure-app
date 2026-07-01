import React from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MapPin, Star } from 'lucide-react-native';

import { useTheme } from '../context/ThemeContext';
import { radius } from '../theme/colors';
import { Font } from '../theme/fonts';
import { capitaliser, formatTemperature, urlIconeMeteo } from '../utils/formatMeteo';

// Si onFavori est fourni, une étoile permet d'ajouter/retirer la ville des favoris.
export function CarteMeteo({ meteo, onPress, onFavori, favori = false }) {
  const { colors } = useTheme();

  return (
    <Pressable onPress={onPress} style={({ pressed }) => pressed && onPress && styles.presse}>
      <LinearGradient
        colors={colors.cardGradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[styles.conteneur, { borderColor: colors.border }]}
      >
        <View style={styles.haut}>
          <View style={styles.localisation}>
            <MapPin size={16} color={colors.primary} />
            <Text style={[styles.ville, { color: colors.text }]} numberOfLines={1}>
              {meteo.ville}
              {meteo.pays ? `, ${meteo.pays}` : ''}
            </Text>
          </View>

          <View style={styles.droite}>
            <Image source={{ uri: urlIconeMeteo(meteo.icone) }} style={styles.icone} />
            {onFavori ? (
              <Pressable onPress={onFavori} hitSlop={12} style={styles.etoile}>
                <Star
                  size={24}
                  color={favori ? colors.warning : colors.textMuted}
                  fill={favori ? colors.warning : 'transparent'}
                />
              </Pressable>
            ) : null}
          </View>
        </View>

        <Text style={[styles.temperature, { color: colors.text }]}>
          {formatTemperature(meteo.temperature)}
        </Text>
        <Text style={[styles.description, { color: colors.textSecondary }]}>
          {capitaliser(meteo.description)}
        </Text>
      </LinearGradient>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  conteneur: {
    borderWidth: 1,
    borderRadius: radius.xl,
    padding: 20,
  },
  haut: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  localisation: { flexDirection: 'row', alignItems: 'center', gap: 6, flex: 1 },
  ville: { fontFamily: Font.semiBold, fontSize: 16, flexShrink: 1 },
  droite: { alignItems: 'center', gap: 2 },
  icone: { width: 64, height: 64 },
  etoile: { padding: 2 },
  temperature: { fontFamily: Font.extraBold, fontSize: 56, letterSpacing: -2, marginTop: 4 },
  description: { fontFamily: Font.medium, fontSize: 15 },
  presse: { opacity: 0.85 },
});
