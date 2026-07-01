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
import { ArrowLeft, Mail, MailCheck } from 'lucide-react-native';

import { useTheme } from '../context/ThemeContext';
import { ChampTexte } from '../components/ChampTexte';
import { BoutonPrincipal } from '../components/BoutonPrincipal';
import { MessageErreur } from '../components/MessageErreur';
import { reinitialiserMotDePasse } from '../services/authService';
import { schemaConnexion } from '../validation/schemaConnexion';
import { validerFormulaire } from '../utils/validerFormulaire';
import { messageErreurFirebase } from '../utils/messagesErreurFirebase';
import { Font } from '../theme/fonts';

export function MotDePasseOublieScreen({ navigation }) {
  const { colors } = useTheme();
  const [email, setEmail] = useState('');
  const [erreur, setErreur] = useState('');
  const [erreurGlobale, setErreurGlobale] = useState('');
  const [envoye, setEnvoye] = useState(false);
  const [chargement, setChargement] = useState(false);

  const soumettre = async () => {
    setErreurGlobale('');
    // On contrôle l'adresse e-mail avant l'envoi (le mot de passe n'est pas requis ici).
    const champErreurs = validerFormulaire(schemaConnexion, { email, motDePasse: 'x' });
    if (champErreurs.email) {
      setErreur(champErreurs.email);
      return;
    }
    setErreur('');

    setChargement(true);
    try {
      await reinitialiserMotDePasse(email.trim());
      setEnvoye(true);
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
            <Text style={[styles.titre, { color: colors.text }]}>Mot de passe oublié</Text>
            <Text style={[styles.sousTitre, { color: colors.textMuted }]}>
              Saisissez votre e-mail pour recevoir un lien de réinitialisation.
            </Text>
          </View>

          {envoye ? (
            <View style={[styles.succes, { backgroundColor: colors.accentDim, borderColor: colors.success }]}>
              <MailCheck size={22} color={colors.success} />
              <Text style={[styles.succesTexte, { color: colors.text }]}>
                Un e-mail de réinitialisation a été envoyé à {email}. Pensez à vérifier vos spams.
              </Text>
            </View>
          ) : (
            <View style={styles.formulaire}>
              <MessageErreur message={erreurGlobale} />
              <ChampTexte
                label="Adresse e-mail"
                placeholder="exemple@email.com"
                autoCapitalize="none"
                keyboardType="email-address"
                value={email}
                onChangeText={setEmail}
                erreur={erreur}
                icone={<Mail size={18} color={colors.textMuted} />}
              />
              <BoutonPrincipal
                libelle="Envoyer le lien"
                onPress={soumettre}
                chargement={chargement}
              />
            </View>
          )}

          <Pressable onPress={() => navigation.navigate('Connexion')} style={styles.lien}>
            <Text style={[styles.lienTexte, { color: colors.primary }]}>Retour à la connexion</Text>
          </Pressable>
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
  succes: { flexDirection: 'row', gap: 12, alignItems: 'center', borderWidth: 1, borderRadius: 14, padding: 16 },
  succesTexte: { flex: 1, fontFamily: Font.medium, fontSize: 14 },
  lien: { alignItems: 'center' },
  lienTexte: { fontFamily: Font.semiBold, fontSize: 13 },
});
