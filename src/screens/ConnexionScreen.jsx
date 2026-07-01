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
import { Lock, Mail } from 'lucide-react-native';

import { useTheme } from '../context/ThemeContext';
import { ChampTexte } from '../components/ChampTexte';
import { BoutonPrincipal } from '../components/BoutonPrincipal';
import { MessageErreur } from '../components/MessageErreur';
import { connecter } from '../services/authService';
import { schemaConnexion } from '../validation/schemaConnexion';
import { validerFormulaire } from '../utils/validerFormulaire';
import { messageErreurFirebase } from '../utils/messagesErreurFirebase';
import { Font } from '../theme/fonts';

export function ConnexionScreen({ navigation }) {
  const { colors } = useTheme();
  const [email, setEmail] = useState('');
  const [motDePasse, setMotDePasse] = useState('');
  const [erreurs, setErreurs] = useState({});
  const [erreurGlobale, setErreurGlobale] = useState('');
  const [chargement, setChargement] = useState(false);

  const soumettre = async () => {
    setErreurGlobale('');
    const champErreurs = validerFormulaire(schemaConnexion, { email, motDePasse });
    setErreurs(champErreurs);
    if (Object.keys(champErreurs).length > 0) return;

    setChargement(true);
    try {
      await connecter(email.trim(), motDePasse);
      // La redirection est gérée automatiquement par la session (RootNavigator).
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
          <View style={styles.entete}>
            <Image source={require('../../assets/logo.png')} style={styles.logo} resizeMode="contain" />
            <Text style={[styles.titre, { color: colors.text }]}>Weather Secure</Text>
            <Text style={[styles.sousTitre, { color: colors.textMuted }]}>
              Connectez-vous pour consulter la météo
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
              placeholder="Votre mot de passe"
              secureTextEntry
              value={motDePasse}
              onChangeText={setMotDePasse}
              erreur={erreurs.motDePasse}
              icone={<Lock size={18} color={colors.textMuted} />}
            />

            <Pressable
              onPress={() => navigation.navigate('MotDePasseOublie')}
              style={styles.lienMdp}
            >
              <Text style={[styles.lienTexte, { color: colors.primary }]}>
                Mot de passe oublié ?
              </Text>
            </Pressable>

            <BoutonPrincipal libelle="Se connecter" onPress={soumettre} chargement={chargement} />
          </View>

          <View style={styles.bas}>
            <Text style={[styles.basTexte, { color: colors.textMuted }]}>Pas encore de compte ?</Text>
            <Pressable onPress={() => navigation.navigate('Inscription')}>
              <Text style={[styles.lienTexte, { color: colors.primary }]}>Créer un compte</Text>
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
  contenu: { flexGrow: 1, justifyContent: 'center', padding: 24, gap: 32 },
  entete: { alignItems: 'center', gap: 10 },
  logo: { width: 96, height: 96 },
  titre: { fontFamily: Font.extraBold, fontSize: 28, letterSpacing: -0.5 },
  sousTitre: { fontFamily: Font.regular, fontSize: 14, textAlign: 'center' },
  formulaire: { gap: 16 },
  lienMdp: { alignSelf: 'flex-end' },
  lienTexte: { fontFamily: Font.semiBold, fontSize: 13 },
  bas: { flexDirection: 'row', justifyContent: 'center', gap: 6 },
  basTexte: { fontFamily: Font.regular, fontSize: 13 },
});
