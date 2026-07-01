import { formatDate } from './formatMeteo';

// Regroupe les prévisions (pas de 3 h) par journée : min, max et icône majoritaire.
export function grouperParJour(liste) {
  const jours = new Map();

  for (const item of liste) {
    const cle = new Date(item.date * 1000).toDateString();
    if (!jours.has(cle)) {
      jours.set(cle, {
        date: item.date,
        min: item.temperature,
        max: item.temperature,
        icones: {},
      });
    }
    const jour = jours.get(cle);
    jour.min = Math.min(jour.min, item.temperature);
    jour.max = Math.max(jour.max, item.temperature);
    jour.icones[item.icone] = (jour.icones[item.icone] || 0) + 1;
  }

  return Array.from(jours.values()).map((jour) => ({
    date: jour.date,
    libelle: formatDate(jour.date),
    min: Math.round(jour.min),
    max: Math.round(jour.max),
    icone: Object.entries(jour.icones).sort((a, b) => b[1] - a[1])[0][0],
  }));
}

// Bornes globales utilisées pour normaliser la largeur des barres de température.
export function bornesTemperatures(jours) {
  if (jours.length === 0) return { min: 0, max: 0 };
  let min = jours[0].min;
  let max = jours[0].max;
  for (const jour of jours) {
    min = Math.min(min, jour.min);
    max = Math.max(max, jour.max);
  }
  return { min, max };
}
