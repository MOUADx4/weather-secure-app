import React, { useState } from 'react';
import { Keyboard, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Search } from 'lucide-react-native';

import { useTheme } from '../context/ThemeContext';
import { useSession } from '../context/SessionContext';
import { useHaptic } from '../hooks/useHaptic';
import { ChampTexte } from '../components/ChampTexte';
import { BoutonPrincipal } from '../components/BoutonPrincipal';
import { CarteMeteo } from '../components/CarteMeteo';
import { MessageErreur } from '../components/MessageErreur';
import { IndicateurChargement } from '../components/IndicateurChargement';
import { meteoParVille } from '../services/meteoService';
import { ajouterHistorique } from '../database/historiqueRepository';
import { schemaRecherche } from '../validation/schemaRecherche';
import { validerFormulaire } from '../utils/validerFormulaire';
import { radius } from '../theme/colors';
import { Font } from '../theme/fonts';

const SUGGESTIONS = ['Paris', 'Lyon', 'Marseille', 'Tokyo', 'New York', 'Londres'];

export function RechercheScreen({ navigation }) {
  const { colors } = useTheme();
  const { utilisateur } = useSession();
  const { light } = useHaptic();
  const [ville, setVille] = useState('');
  const [erreurChamp, setErreurChamp] = useState('');
  const [erreur, setErreur] = useState('');
  const [meteo, setMeteo] = useState(null);
  const [chargement, setChargement] = useState(false);

  const lancer = async (nom) => {
    Keyboard.dismiss();
    setErreur('');
    const champErreurs = validerFormulaire(schemaRecherche, { ville: nom });
    setErreurChamp(champErreurs.ville || '');
    if (champErreurs.ville) return;

    setChargement(true);
    setMeteo(null);
    try {
      const donnees = await meteoParVille(nom.trim());
      setMeteo(donnees);
      if (utilisateur) {
        await ajouterHistorique(utilisateur.uid, donnees);
      }
    } catch (e) {
      setErreur(e.message);
    } finally {
      setChargement(false);
    }
  };

  const choisirSuggestion = (nom) => {
    light();
    setVille(nom);
    lancer(nom);
  };

  return (
    <View style={styles.racine}>
      <LinearGradient colors={colors.gradient} style={StyleSheet.absoluteFill} />
      <SafeAreaView style={styles.safe} edges={['top']}>
        <ScrollView contentContainerStyle={styles.contenu} keyboardShouldPersistTaps="handled">
          <View>
            <Text style={[styles.titre, { color: colors.text }]}>Rechercher</Text>
            <Text style={[styles.sousTitre, { color: colors.textMuted }]}>
              Consultez la météo de n'importe quelle ville
            </Text>
          </View>

          <ChampTexte
            placeholder="Ex : Lyon, Tokyo, New York..."
            value={ville}
            onChangeText={setVille}
            erreur={erreurChamp}
            onSubmitEditing={() => lancer(ville)}
            returnKeyType="search"
            icone={<Search size={18} color={colors.textMuted} />}
          />

          <BoutonPrincipal
            libelle="Rechercher"
            onPress={() => lancer(ville)}
            chargement={chargement}
            icone={<Search size={18} color="#fff" />}
          />

          {!meteo && !chargement ? (
            <View style={styles.suggestions}>
              <Text style={[styles.label, { color: colors.textMuted }]}>SUGGESTIONS</Text>
              <View style={styles.puces}>
                {SUGGESTIONS.map((nom) => (
                  <Pressable
                    key={nom}
                    onPress={() => choisirSuggestion(nom)}
                    style={({ pressed }) => [
                      styles.puce,
                      { backgroundColor: colors.surfaceElevated, borderColor: colors.border },
                      pressed && styles.presse,
                    ]}
                  >
                    <Text style={[styles.puceTexte, { color: colors.text }]}>{nom}</Text>
                  </Pressable>
                ))}
              </View>
            </View>
          ) : null}

          <MessageErreur message={erreur} />

          {chargement ? <IndicateurChargement message="Recherche en cours..." /> : null}

          {meteo && !chargement ? (
            <View style={styles.resultat}>
              <Text style={[styles.label, { color: colors.textMuted }]}>RÉSULTAT</Text>
              <CarteMeteo
                meteo={meteo}
                onPress={() => navigation.navigate('DetailMeteo', { meteo })}
              />
              <Text style={[styles.aide, { color: colors.textDim }]}>
                Touchez la carte pour voir tous les détails.
              </Text>
            </View>
          ) : null}
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  racine: { flex: 1 },
  safe: { flex: 1 },
  contenu: { padding: 20, paddingBottom: 120, gap: 16 },
  titre: { fontFamily: Font.extraBold, fontSize: 30, letterSpacing: -0.5 },
  sousTitre: { fontFamily: Font.regular, fontSize: 14, marginTop: 2 },
  label: { fontFamily: Font.bold, fontSize: 12, letterSpacing: 1 },
  suggestions: { gap: 12, marginTop: 4 },
  puces: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  puce: { borderWidth: 1, borderRadius: radius.full, paddingVertical: 10, paddingHorizontal: 18 },
  puceTexte: { fontFamily: Font.semiBold, fontSize: 14 },
  presse: { opacity: 0.7 },
  resultat: { gap: 10, marginTop: 4 },
  aide: { fontFamily: Font.regular, fontSize: 12, textAlign: 'center' },
});
