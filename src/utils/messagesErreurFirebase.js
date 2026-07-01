const messages = {
  'auth/invalid-email': "L'adresse e-mail n'est pas valide.",
  'auth/user-disabled': 'Ce compte a été désactivé.',
  'auth/user-not-found': 'Aucun compte ne correspond à cette adresse e-mail.',
  'auth/wrong-password': 'Mot de passe incorrect.',
  'auth/invalid-credential': 'Adresse e-mail ou mot de passe incorrect.',
  'auth/email-already-in-use': 'Cette adresse e-mail est déjà utilisée.',
  'auth/weak-password': 'Le mot de passe est trop faible.',
  'auth/too-many-requests': 'Trop de tentatives. Veuillez réessayer plus tard.',
  'auth/network-request-failed': 'Problème de connexion réseau.',
};

export function messageErreurFirebase(code) {
  return messages[code] || 'Une erreur est survenue. Veuillez réessayer.';
}
