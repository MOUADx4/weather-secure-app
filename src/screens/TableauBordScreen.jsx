import React, { useCallback, useState } from 'react';
import {
  Image,
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import { useFocusEffect } from '@react-navigation/native';
import * as Location from 'expo-location';
import { Droplets, MapPin, Navigation, Search, Wind } from 'lucide-react-native';

import { useSession } from '../context/SessionContext';
import { CarteVerre } from '../components/CarteVerre';
import { CarteInfo } from '../components/CarteInfo';
import { PrevisionHoraire } from '../components/PrevisionHoraire';
import { PrevisionJournaliere } from '../components/PrevisionJournaliere';
import { IndicateurChargement } from '../components/IndicateurChargement';
import { MessageErreur } from '../components/MessageErreur';
import { meteoParVille, meteoParCoordonnees, previsionsParVille } from '../services/meteoService';
import { ajouterHistorique } from '../database/historiqueRepository';
import { grouperParJour } from '../utils/agregerPrevisions';
import { ambianceMeteo } from '../theme/cielMeteo';
import {
  capitaliser,
  formatHumidite,
  formatTemperature,
  formatVent,
  urlIconeMeteo,
} from '../utils/formatMeteo';
import { Font } from '../theme/fonts';

const VILLE_PAR_DEFAUT = 'Paris';

export function TableauBordScreen({ navigation }) {
  const { utilisateur } = useSession();
  const [meteo, setMeteo] = useState(null);
  const [horaire, setHoraire] = useState([]);
  const [jours, setJours] = useState([]);
  const [estPosition, setEstPosition] = useState(false);
  const [chargement, setChargement] = useState(true);
  const [erreur, setErreur] = useState('');
  const [rafraichissement, setRafraichissement] = useState(false);

  const charger = useCallback(async (promesseMeteo, position = false) => {
    setErreur('');
    try {
      const donnees = await promesseMeteo;
      setMeteo(donnees);
      setEstPosition(position);
      const liste = await previsionsParVille(donnees.ville);
      setHoraire(liste.slice(0, 10));
      setJours(grouperParJour(liste));
    } catch (e) {
      setErreur(e.message);
    } finally {
      setChargement(false);
      setRafraichissement(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      if (!meteo) {
        charger(meteoParVille(VILLE_PAR_DEFAUT));
      }
    }, [meteo, charger])
  );

  const utiliserMaPosition = async () => {
    setChargement(true);
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErreur('Autorisation de localisation refusée.');
        setChargement(false);
        return;
      }
      const position = await Location.getCurrentPositionAsync({});
      await charger(
        meteoParCoordonnees(position.coords.latitude, position.coords.longitude),
        true
      );
      if (utilisateur && meteo) {
        await ajouterHistorique(utilisateur.uid, meteo);
      }
    } catch (e) {
      setErreur(e.message || 'Impossible de récupérer votre position.');
      setChargement(false);
    }
  };

  const ambiance = ambianceMeteo(meteo?.icone);
  const maxJour = jours[0]?.max;
  const minJour = jours[0]?.min;

  return (
    <View style={styles.racine}>
      <StatusBar style="light" />
      <LinearGradient colors={ambiance.gradient} style={StyleSheet.absoluteFill} />

      <SafeAreaView style={styles.safe} edges={['top']}>
        <View style={styles.barreHaute}>
          <Pressable onPress={utiliserMaPosition} hitSlop={10} style={styles.iconeBtn}>
            <Navigation size={22} color={ambiance.texte} fill={estPosition ? ambiance.texte : 'transparent'} />
          </Pressable>
          <Pressable onPress={() => navigation.navigate('Recherche')} hitSlop={10} style={styles.iconeBtn}>
            <Search size={22} color={ambiance.texte} />
          </Pressable>
        </View>

        <ScrollView
          contentContainerStyle={styles.contenu}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={rafraichissement}
              onRefresh={() => {
                setRafraichissement(true);
                charger(
                  meteo ? meteoParVille(meteo.ville) : meteoParVille(VILLE_PAR_DEFAUT),
                  estPosition
                );
              }}
              tintColor={ambiance.texte}
            />
          }
        >
          <MessageErreur message={erreur} />

          {chargement && !meteo ? (
            <IndicateurChargement message="Chargement de la météo..." />
          ) : meteo ? (
            <>
              <Pressable
                style={styles.hero}
                onPress={() => navigation.navigate('DetailMeteo', { meteo })}
              >
                <View style={styles.localisation}>
                  <MapPin size={16} color={ambiance.texte} />
                  <Text style={[styles.ville, { color: ambiance.texte }]}>{meteo.ville}</Text>
                </View>
                <Text style={[styles.temperature, { color: ambiance.texte }]}>
                  {formatTemperature(meteo.temperature)}
                </Text>
                <Text style={[styles.description, { color: ambiance.texteDoux }]}>
                  {capitaliser(meteo.description)}
                </Text>
                {maxJour !== undefined ? (
                  <Text style={[styles.minmax, { color: ambiance.texte }]}>
                    Min {minJour}° / Max {maxJour}°
                  </Text>
                ) : null}
                <Image source={{ uri: urlIconeMeteo(meteo.icone) }} style={styles.iconeHero} />
              </Pressable>

              <PrevisionHoraire liste={horaire} ambiance={ambiance} />
              <PrevisionJournaliere jours={jours} ambiance={ambiance} />

              <View style={styles.grille}>
                <CarteInfo
                  titre="Vent"
                  ambiance={ambiance}
                  icone={<Wind size={14} color={ambiance.texteDoux} />}
                  valeur={formatVent(meteo.vent)}
                  sousTexte="Vitesse actuelle du vent."
                />
                <CarteInfo
                  titre="Humidité"
                  ambiance={ambiance}
                  icone={<Droplets size={14} color={ambiance.texteDoux} />}
                  valeur={formatHumidite(meteo.humidite)}
                  sousTexte={`Ressenti ${formatTemperature(meteo.ressenti)}.`}
                />
              </View>

              <CarteVerre ambiance={ambiance} style={styles.lien}>
                <Pressable onPress={() => navigation.navigate('DetailMeteo', { meteo })}>
                  <Text style={[styles.lienTexte, { color: ambiance.texte }]}>
                    Voir tous les détails
                  </Text>
                </Pressable>
              </CarteVerre>
            </>
          ) : null}
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
    paddingVertical: 8,
  },
  iconeBtn: { padding: 4 },
  contenu: { paddingHorizontal: 16, paddingBottom: 120, gap: 14 },
  hero: { alignItems: 'center', paddingVertical: 8 },
  localisation: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  ville: { fontFamily: Font.semiBold, fontSize: 22 },
  temperature: { fontFamily: Font.light, fontSize: 92, letterSpacing: -4 },
  description: { fontFamily: Font.medium, fontSize: 18 },
  minmax: { fontFamily: Font.semiBold, fontSize: 15, marginTop: 4 },
  iconeHero: { width: 90, height: 90, marginTop: 4 },
  grille: { flexDirection: 'row', gap: 14 },
  lien: { alignItems: 'center', paddingVertical: 16 },
  lienTexte: { fontFamily: Font.semiBold, fontSize: 15 },
});
