import React, { useState } from 'react';
import {
  Image,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, Lock, Mail, ShieldCheck } from 'lucide-react-native';

import { useTheme } from '../context/ThemeContext';
import { ChampTexte } from '../components/ChampTexte';
import { BoutonPrincipal } from '../components/BoutonPrincipal';
import { MessageErreur } from '../components/MessageErreur';
import { inscrire } from '../services/authService';
import { schemaInscription } from '../validation/schemaInscription';
import { validerFormulaire } from '../utils/validerFormulaire';
import { messageErreurFirebase } from '../utils/messagesErreurFirebase';
import { Font } from '../theme/fonts';

export function InscriptionScreen({ navigation }) {
  const { colors } = useTheme();
  const [email, setEmail] = useState('');
  const [motDePasse, setMotDePasse] = useState('');
  const [confirmation, setConfirmation] = useState('');
  const [erreurs, setErreurs] = useState({});
  const [erreurGlobale, setErreurGlobale] = useState('');
  const [chargement, setChargement] = useState(false);

  const soumettre = async () => {
    setErreurGlobale('');
    const champErreurs = validerFormulaire(schemaInscription, {
      email,
      motDePasse,
      confirmation,
    });
    setErreurs(champErreurs);
    if (Object.keys(champErreurs).length > 0) return;

    setChargement(true);
    try {
      await inscrire(email.trim(), motDePasse);
    } catch (e) {
      setErreurGlobale(messageErreurFirebase(e.code));
    } finally {
      setChargement(false);
    }
  };

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.background }]}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView contentContainerStyle={styles.contenu} keyboardShouldPersistTaps="handled">
          <Pressable onPress={() => navigation.goBack()} style={styles.retour}>
            <ArrowLeft size={22} color={colors.text} />
          </Pressable>

          <Image
            source={require('../../assets/logo.png')}
            style={styles.logo}
            resizeMode="contain"
          />

          <View style={styles.entete}>
            <Text style={[styles.titre, { color: colors.text }]}>Créer un compte</Text>
            <Text style={[styles.sousTitre, { color: colors.textMuted }]}>
              Rejoignez Weather Secure en quelques secondes
            </Text>
          </View>

          <View style={styles.formulaire}>
            <MessageErreur message={erreurGlobale} />

            <ChampTexte
              label="Adresse e-mail"
              placeholder="exemple@email.com"
              autoCapitalize="none"
              keyboardType="email-address"
              value={email}
              onChangeText={setEmail}
              erreur={erreurs.email}
              icone={<Mail size={18} color={colors.textMuted} />}
            />

            <ChampTexte
              label="Mot de passe"
              placeholder="8 caractères, 1 majuscule, 1 chiffre"
              secureTextEntry
              value={motDePasse}
              onChangeText={setMotDePasse}
              erreur={erreurs.motDePasse}
              icone={<Lock size={18} color={colors.textMuted} />}
            />

            <ChampTexte
              label="Confirmer le mot de passe"
              placeholder="Saisissez à nouveau le mot de passe"
              secureTextEntry
              value={confirmation}
              onChangeText={setConfirmation}
              erreur={erreurs.confirmation}
              icone={<ShieldCheck size={18} color={colors.textMuted} />}
            />

            <BoutonPrincipal libelle="S'inscrire" onPress={soumettre} chargement={chargement} />
          </View>

          <View style={styles.bas}>
            <Text style={[styles.basTexte, { color: colors.textMuted }]}>Déjà inscrit ?</Text>
            <Pressable onPress={() => navigation.navigate('Connexion')}>
              <Text style={[styles.lienTexte, { color: colors.primary }]}>Se connecter</Text>
            </Pressable>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  flex: { flex: 1 },
  contenu: { flexGrow: 1, justifyContent: 'center', padding: 24, gap: 28 },
  retour: { position: 'absolute', top: 8, left: 8, padding: 12 },
  logo: { width: 80, height: 80, alignSelf: 'center' },
  entete: { gap: 8 },
  titre: { fontFamily: Font.extraBold, fontSize: 28, letterSpacing: -0.5 },
  sousTitre: { fontFamily: Font.regular, fontSize: 14 },
  formulaire: { gap: 16 },
  lienTexte: { fontFamily: Font.semiBold, fontSize: 13 },
  bas: { flexDirection: 'row', justifyContent: 'center', gap: 6 },
  basTexte: { fontFamily: Font.regular, fontSize: 13 },
});
