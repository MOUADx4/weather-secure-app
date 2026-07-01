import React, { useEffect, useState } from 'react';
import { Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import {
  ArrowLeft,
  Droplets,
  Eye,
  Gauge,
  Star,
  Sunrise,
  Sunset,
  Thermometer,
  Wind,
} from 'lucide-react-native';

import { useSession } from '../context/SessionContext';
import { CarteInfo } from '../components/CarteInfo';
import { PrevisionHoraire } from '../components/PrevisionHoraire';
import { GraphiqueTemperature } from '../components/GraphiqueTemperature';
import { PrevisionJournaliere } from '../components/PrevisionJournaliere';
import { useHaptic } from '../hooks/useHaptic';
import { previsionsParVille } from '../services/meteoService';
import { ajouterFavori, supprimerFavori, estFavori } from '../database/favorisRepository';
import { grouperParJour } from '../utils/agregerPrevisions';
import { ambianceMeteo } from '../theme/cielMeteo';
import {
  capitaliser,
  formatHeure,
  formatHumidite,
  formatTemperature,
  formatVent,
  urlIconeMeteo,
} from '../utils/formatMeteo';
import { Font } from '../theme/fonts';

export function DetailMeteoScreen({ route, navigation }) {
  const { utilisateur } = useSession();
  const { success } = useHaptic();
  const { meteo } = route.params;
  const ambiance = ambianceMeteo(meteo.icone);

  const [favori, setFavori] = useState(false);
  const [horaire, setHoraire] = useState([]);
  const [jours, setJours] = useState([]);

  useEffect(() => {
    if (utilisateur) {
      estFavori(utilisateur.uid, meteo).then(setFavori);
    }
  }, [utilisateur, meteo]);

  useEffect(() => {
    previsionsParVille(meteo.ville)
      .then((liste) => {
        setHoraire(liste.slice(0, 10));
        setJours(grouperParJour(liste));
      })
      .catch(() => {});
  }, [meteo.ville]);

  const basculerFavori = async () => {
    if (!utilisateur) return;
    success();
    if (favori) {
      await supprimerFavori(utilisateur.uid, meteo);
      setFavori(false);
    } else {
      await ajouterFavori(utilisateur.uid, meteo);
      setFavori(true);
    }
  };

  const visibiliteKm = meteo.visibilite ? `${Math.round(meteo.visibilite / 1000)} km` : '--';

  return (
    <View style={styles.racine}>
      <StatusBar style="light" />
      <LinearGradient colors={ambiance.gradient} style={StyleSheet.absoluteFill} />

      <SafeAreaView style={styles.safe} edges={['top']}>
        <View style={styles.barreHaute}>
          <Pressable onPress={() => navigation.goBack()} hitSlop={10} style={styles.iconeBtn}>
            <ArrowLeft size={24} color={ambiance.texte} />
          </Pressable>
          <Pressable onPress={basculerFavori} hitSlop={10} style={styles.iconeBtn}>
            <Star
              size={24}
              color={ambiance.texte}
              fill={favori ? ambiance.texte : 'transparent'}
            />
          </Pressable>
        </View>

        <ScrollView contentContainerStyle={styles.contenu} showsVerticalScrollIndicator={false}>
          <View style={styles.hero}>
            <Text style={[styles.ville, { color: ambiance.texte }]}>
              {meteo.ville}
              {meteo.pays ? `, ${meteo.pays}` : ''}
            </Text>
            <Text style={[styles.temperature, { color: ambiance.texte }]}>
              {formatTemperature(meteo.temperature)}
            </Text>
            <Text style={[styles.description, { color: ambiance.texteDoux }]}>
              {capitaliser(meteo.description)}
            </Text>
            <Image source={{ uri: urlIconeMeteo(meteo.icone) }} style={styles.iconeHero} />
          </View>

          <PrevisionHoraire liste={horaire} ambiance={ambiance} />
          <GraphiqueTemperature liste={horaire} ambiance={ambiance} />
          <PrevisionJournaliere jours={jours} ambiance={ambiance} />

          <View style={styles.grille}>
            <CarteInfo
              titre="Ressenti"
              ambiance={ambiance}
              icone={<Thermometer size={14} color={ambiance.texteDoux} />}
              valeur={formatTemperature(meteo.ressenti)}
              sousTexte="Température ressentie."
            />
            <CarteInfo
              titre="Humidité"
              ambiance={ambiance}
              icone={<Droplets size={14} color={ambiance.texteDoux} />}
              valeur={formatHumidite(meteo.humidite)}
              sousTexte="Taux d'humidité de l'air."
            />
          </View>
          <View style={styles.grille}>
            <CarteInfo
              titre="Vent"
              ambiance={ambiance}
              icone={<Wind size={14} color={ambiance.texteDoux} />}
              valeur={formatVent(meteo.vent)}
              sousTexte="Vitesse du vent."
            />
            <CarteInfo
              titre="Pression"
              ambiance={ambiance}
              icone={<Gauge size={14} color={ambiance.texteDoux} />}
              valeur={meteo.pression ? `${meteo.pression}` : '--'}
              sousTexte="hPa"
            />
          </View>
          <View style={styles.grille}>
            <CarteInfo
              titre="Visibilité"
              ambiance={ambiance}
              icone={<Eye size={14} color={ambiance.texteDoux} />}
              valeur={visibiliteKm}
              sousTexte="Distance de visibilité."
            />
            <CarteInfo
              titre="Soleil"
              ambiance={ambiance}
              icone={<Sunrise size={14} color={ambiance.texteDoux} />}
              valeur={meteo.leverSoleil ? formatHeure(meteo.leverSoleil) : '--'}
              sousTexte={
                meteo.coucherSoleil ? `Coucher à ${formatHeure(meteo.coucherSoleil)}.` : ''
              }
            />
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  racine: { flex: 1 },
  safe: { flex: 1 },
  barreHaute: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 6,
  },
  iconeBtn: { padding: 4 },
  contenu: { paddingHorizontal: 16, paddingBottom: 32, gap: 14 },
  hero: { alignItems: 'center', paddingVertical: 4 },
  ville: { fontFamily: Font.semiBold, fontSize: 24 },
  temperature: { fontFamily: Font.light, fontSize: 88, letterSpacing: -4 },
  description: { fontFamily: Font.medium, fontSize: 17 },
  iconeHero: { width: 80, height: 80, marginTop: 4 },
  grille: { flexDirection: 'row', gap: 14 },
});
