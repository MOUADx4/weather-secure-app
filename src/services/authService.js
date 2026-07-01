import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  updateProfile,
} from 'firebase/auth';

import { auth } from '../config/firebaseClient';

// Le surnom par défaut est dérivé de l'adresse e-mail (partie avant @).
export async function inscrire(email, motDePasse) {
  const identifiants = await createUserWithEmailAndPassword(auth, email, motDePasse);
  const surnomDefaut = email.split('@')[0];
  await updateProfile(identifiants.user, { displayName: surnomDefaut });
  return identifiants;
}

export function definirSurnom(surnom) {
  return updateProfile(auth.currentUser, { displayName: surnom });
}

export function connecter(email, motDePasse) {
  return signInWithEmailAndPassword(auth, email, motDePasse);
}

export function deconnecter() {
  return signOut(auth);
}

export function reinitialiserMotDePasse(email) {
  return sendPasswordResetEmail(auth, email);
}
