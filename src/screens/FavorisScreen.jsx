import React, { useCallback, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useFocusEffect } from '@react-navigation/native';
import { Star } from 'lucide-react-native';

import { useTheme } from '../context/ThemeContext';
import { useSession } from '../context/SessionContext';
import { useHaptic } from '../hooks/useHaptic';
import { CarteMeteo } from '../components/CarteMeteo';
import { MessageErreur } from '../components/MessageErreur';
import { IndicateurChargement } from '../components/IndicateurChargement';
import { listerFavoris, supprimerFavori } from '../database/favorisRepository';
import { meteoParVille } from '../services/meteoService';
import { Font } from '../theme/fonts';

export function FavorisScreen({ navigation }) {
  const { colors } = useTheme();
  const { utilisateur } = useSession();
  const { success } = useHaptic();
  const [cartes, setCartes] = useState([]);
  const [chargement, setChargement] = useState(true);
  const [erreur, setErreur] = useState('');

  const charger = useCallback(async () => {
    if (!utilisateur) return;
    setErreur('');
    const liste = await listerFavoris(utilisateur.uid);

    // Récupère la météo actuelle de chaque ville favorite.
    const resultats = await Promise.all(
      liste.map(async (favori) => {
        try {
          const meteo = await meteoParVille(favori.ville);
          return { favori, meteo };
        } catch {
          return null;
        }
      })
    );

    setCartes(resultats.filter(Boolean));
    setChargement(false);
  }, [utilisateur]);

  useFocusEffect(
    useCallback(() => {
      charger();
    }, [charger])
  );

  const retirer = async (favori) => {
    success();
    await supprimerFavori(utilisateur.uid, { ville: favori.ville, pays: favori.pays });
    setCartes((precedent) => precedent.filter((c) => c.favori.id !== favori.id));
  };

  return (
    <View style={styles.racine}>
      <LinearGradient colors={colors.gradient} style={StyleSheet.absoluteFill} />
      <SafeAreaView style={styles.safe} edges={['top']}>
        <View style={styles.entete}>
          <Text style={[styles.titre, { color: colors.text }]}>Mes favoris</Text>
          <Text style={[styles.sousTitre, { color: colors.textMuted }]}>
            Vos villes enregistrées
          </Text>
        </View>

        <MessageErreur message={erreur} />

        {chargement ? (
          <IndicateurChargement message="Mise à jour des favoris..." />
        ) : cartes.length === 0 ? (
          <View style={styles.vide}>
            <Star size={40} color={colors.textDim} />
            <Text style={[styles.videTitre, { color: colors.text }]}>Aucun favori</Text>
            <Text style={[styles.videTexte, { color: colors.textMuted }]}>
              Ajoutez une ville depuis l'écran de détail météo.
            </Text>
          </View>
        ) : (
          <ScrollView
            contentContainerStyle={styles.liste}
            showsVerticalScrollIndicator={false}
          >
            {cartes.map(({ favori, meteo }) => (
              <CarteMeteo
                key={favori.id}
                meteo={meteo}
                favori
                onFavori={() => retirer(favori)}
                onPress={() => navigation.navigate('DetailMeteo', { meteo })}
              />
            ))}
          </ScrollView>
        )}
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  racine: { flex: 1 },
  safe: { flex: 1 },
  entete: { paddingHorizontal: 20, paddingTop: 8, paddingBottom: 4 },
  titre: { fontFamily: Font.extraBold, fontSize: 30, letterSpacing: -0.5 },
  sousTitre: { fontFamily: Font.regular, fontSize: 14, marginTop: 2 },
  liste: { padding: 20, paddingBottom: 130, gap: 14 },
  vide: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 8, padding: 40 },
  videTitre: { fontFamily: Font.bold, fontSize: 18 },
  videTexte: { fontFamily: Font.regular, fontSize: 14, textAlign: 'center' },
});
