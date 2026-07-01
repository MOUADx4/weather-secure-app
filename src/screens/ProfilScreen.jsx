import React, { useCallback, useState } from 'react';
import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useFocusEffect } from '@react-navigation/native';
import { Check, Clock, LogOut, Moon, Pencil, Star, Trash2 } from 'lucide-react-native';

import { useTheme } from '../context/ThemeContext';
import { useSession } from '../context/SessionContext';
import { useHaptic } from '../hooks/useHaptic';
import { BoutonPrincipal } from '../components/BoutonPrincipal';
import { deconnecter, definirSurnom } from '../services/authService';
import { listerHistorique, viderHistorique } from '../database/historiqueRepository';
import { listerFavoris } from '../database/favorisRepository';
import { formatTemperature } from '../utils/formatMeteo';
import { radius } from '../theme/colors';
import { Font } from '../theme/fonts';

// Surnom par défaut dérivé de l'adresse e-mail.
function surnomParDefaut(utilisateur) {
  if (utilisateur?.displayName) return utilisateur.displayName;
  if (utilisateur?.email) return utilisateur.email.split('@')[0];
  return 'Utilisateur';
}

export function ProfilScreen() {
  const { colors, modeSombre, basculerTheme } = useTheme();
  const { utilisateur } = useSession();
  const { success } = useHaptic();

  const [historique, setHistorique] = useState([]);
  const [nbFavoris, setNbFavoris] = useState(0);
  const [surnom, setSurnom] = useState(surnomParDefaut(utilisateur));
  const [edition, setEdition] = useState(false);
  const [brouillon, setBrouillon] = useState(surnom);

  const charger = useCallback(async () => {
    if (!utilisateur) return;
    const [hist, favs] = await Promise.all([
      listerHistorique(utilisateur.uid),
      listerFavoris(utilisateur.uid),
    ]);
    setHistorique(hist);
    setNbFavoris(favs.length);
  }, [utilisateur]);

  useFocusEffect(
    useCallback(() => {
      charger();
    }, [charger])
  );

  const enregistrerSurnom = async () => {
    const valeur = brouillon.trim();
    if (valeur.length < 2) return;
    await definirSurnom(valeur);
    setSurnom(valeur);
    setEdition(false);
    success();
  };

  const seDeconnecter = () => {
    Alert.alert('Déconnexion', 'Voulez-vous vraiment vous déconnecter ?', [
      { text: 'Annuler', style: 'cancel' },
      { text: 'Déconnexion', style: 'destructive', onPress: () => deconnecter() },
    ]);
  };

  const effacerHistorique = () => {
    Alert.alert('Historique', "Effacer tout l'historique de recherche ?", [
      { text: 'Annuler', style: 'cancel' },
      {
        text: 'Effacer',
        style: 'destructive',
        onPress: async () => {
          await viderHistorique(utilisateur.uid);
          setHistorique([]);
        },
      },
    ]);
  };

  const initiale = surnom.charAt(0).toUpperCase();
  const membreDepuis = utilisateur?.metadata?.creationTime
    ? new Date(utilisateur.metadata.creationTime).toLocaleDateString('fr-FR', {
        month: 'long',
        year: 'numeric',
      })
    : null;

  return (
    <View style={styles.racine}>
      <LinearGradient colors={colors.gradient} style={StyleSheet.absoluteFill} />
      <SafeAreaView style={styles.safe} edges={['top']}>
        <ScrollView contentContainerStyle={styles.contenu} showsVerticalScrollIndicator={false}>
          <Text style={[styles.titre, { color: colors.text }]}>Profil</Text>

          <View style={styles.entete}>
            <LinearGradient colors={[colors.primary, colors.accent]} style={styles.avatar}>
              <Text style={styles.initiale}>{initiale}</Text>
            </LinearGradient>

            {edition ? (
              <View style={styles.editionLigne}>
                <TextInput
                  value={brouillon}
                  onChangeText={setBrouillon}
                  autoFocus
                  maxLength={20}
                  style={[
                    styles.champSurnom,
                    { color: colors.text, borderColor: colors.primary, backgroundColor: colors.surfaceElevated },
                  ]}
                  placeholder="Votre surnom"
                  placeholderTextColor={colors.textDim}
                  onSubmitEditing={enregistrerSurnom}
                />
                <Pressable onPress={enregistrerSurnom} hitSlop={8} style={[styles.boutonRond, { backgroundColor: colors.primary }]}>
                  <Check size={18} color="#fff" />
                </Pressable>
              </View>
            ) : (
              <Pressable
                style={styles.surnomLigne}
                onPress={() => {
                  setBrouillon(surnom);
                  setEdition(true);
                }}
              >
                <Text style={[styles.surnom, { color: colors.text }]}>{surnom}</Text>
                <Pencil size={16} color={colors.textMuted} />
              </Pressable>
            )}

            {membreDepuis ? (
              <Text style={[styles.membre, { color: colors.textMuted }]}>
                Membre depuis {membreDepuis}
              </Text>
            ) : null}
          </View>

          <View style={styles.stats}>
            <View style={[styles.statCarte, { backgroundColor: colors.surfaceElevated, borderColor: colors.border }]}>
              <Star size={20} color={colors.warning} />
              <Text style={[styles.statValeur, { color: colors.text }]}>{nbFavoris}</Text>
              <Text style={[styles.statLabel, { color: colors.textMuted }]}>Favoris</Text>
            </View>
            <View style={[styles.statCarte, { backgroundColor: colors.surfaceElevated, borderColor: colors.border }]}>
              <Clock size={20} color={colors.primary} />
              <Text style={[styles.statValeur, { color: colors.text }]}>{historique.length}</Text>
              <Text style={[styles.statLabel, { color: colors.textMuted }]}>Recherches</Text>
            </View>
          </View>

          <View style={[styles.ligneOption, { backgroundColor: colors.surfaceElevated, borderColor: colors.border }]}>
            <View style={styles.optionGauche}>
              <Moon size={20} color={colors.primary} />
              <Text style={[styles.optionTexte, { color: colors.text }]}>Mode sombre</Text>
            </View>
            <Switch
              value={modeSombre}
              onValueChange={basculerTheme}
              trackColor={{ true: colors.primary, false: colors.borderStrong }}
              thumbColor="#fff"
            />
          </View>

          <View style={styles.sectionHistorique}>
            <View style={styles.enteteHistorique}>
              <View style={styles.optionGauche}>
                <Clock size={18} color={colors.textMuted} />
                <Text style={[styles.titreSection, { color: colors.text }]}>Historique</Text>
              </View>
              {historique.length > 0 ? (
                <Pressable onPress={effacerHistorique} hitSlop={8} style={styles.optionGauche}>
                  <Trash2 size={16} color={colors.danger} />
                  <Text style={[styles.effacer, { color: colors.danger }]}>Effacer</Text>
                </Pressable>
              ) : null}
            </View>

            {historique.length === 0 ? (
              <Text style={[styles.vide, { color: colors.textMuted }]}>
                Aucune recherche pour le moment.
              </Text>
            ) : (
              historique.slice(0, 8).map((item) => (
                <View
                  key={item.id}
                  style={[styles.ligneHisto, { backgroundColor: colors.surfaceElevated, borderColor: colors.border }]}
                >
                  <Text style={[styles.histoVille, { color: colors.text }]}>
                    {item.ville}
                    {item.pays ? `, ${item.pays}` : ''}
                  </Text>
                  <Text style={[styles.histoTemp, { color: colors.textSecondary }]}>
                    {formatTemperature(item.temperature)}
                  </Text>
                </View>
              ))
            )}
          </View>

          <BoutonPrincipal
            libelle="Se déconnecter"
            variant="danger"
            icone={<LogOut size={18} color="#fff" />}
            onPress={seDeconnecter}
          />
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  racine: { flex: 1 },
  safe: { flex: 1 },
  contenu: { padding: 20, paddingBottom: 120, gap: 18 },
  titre: { fontFamily: Font.extraBold, fontSize: 30, letterSpacing: -0.5 },
  entete: { alignItems: 'center', gap: 8 },
  avatar: { width: 84, height: 84, borderRadius: radius.full, alignItems: 'center', justifyContent: 'center' },
  initiale: { fontFamily: Font.extraBold, fontSize: 36, color: '#fff' },
  surnomLigne: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  surnom: { fontFamily: Font.bold, fontSize: 22 },
  editionLigne: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  champSurnom: {
    fontFamily: Font.semiBold,
    fontSize: 18,
    borderWidth: 1.5,
    borderRadius: radius.lg,
    paddingHorizontal: 14,
    height: 46,
    minWidth: 180,
    textAlign: 'center',
  },
  boutonRond: { width: 44, height: 44, borderRadius: radius.full, alignItems: 'center', justifyContent: 'center' },
  membre: { fontFamily: Font.regular, fontSize: 13 },
  stats: { flexDirection: 'row', gap: 14 },
  statCarte: {
    flex: 1,
    alignItems: 'center',
    gap: 4,
    borderWidth: 1,
    borderRadius: radius.xl,
    paddingVertical: 18,
  },
  statValeur: { fontFamily: Font.extraBold, fontSize: 26 },
  statLabel: { fontFamily: Font.medium, fontSize: 12 },
  ligneOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderRadius: radius.lg,
    padding: 16,
  },
  optionGauche: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  optionTexte: { fontFamily: Font.semiBold, fontSize: 15 },
  sectionHistorique: { gap: 10 },
  enteteHistorique: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  titreSection: { fontFamily: Font.bold, fontSize: 17 },
  effacer: { fontFamily: Font.semiBold, fontSize: 13 },
  vide: { fontFamily: Font.regular, fontSize: 14, paddingVertical: 8 },
  ligneHisto: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: radius.md,
    paddingVertical: 12,
    paddingHorizontal: 14,
  },
  histoVille: { fontFamily: Font.medium, fontSize: 14, flex: 1 },
  histoTemp: { fontFamily: Font.bold, fontSize: 15 },
});
