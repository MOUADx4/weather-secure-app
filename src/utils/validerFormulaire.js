// Renvoie { champ: message } pour chaque erreur, ou {} si tout est valide.
export function validerFormulaire(schema, donnees) {
  const { error } = schema.validate(donnees, { abortEarly: false });

  if (!error) {
    return {};
  }

  const erreurs = {};
  for (const detail of error.details) {
    const champ = detail.path[0];
    if (champ && !erreurs[champ]) {
      erreurs[champ] = detail.message;
    }
  }
  return erreurs;
}
