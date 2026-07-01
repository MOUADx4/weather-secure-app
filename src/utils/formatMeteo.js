export function formatTemperature(valeur) {
  if (valeur === null || valeur === undefined) return '--°';
  return `${Math.round(valeur)}°`;
}

// Vitesse du vent : conversion m/s -> km/h.
export function formatVent(metresParSeconde) {
  if (metresParSeconde === null || metresParSeconde === undefined) return '-- km/h';
  return `${Math.round(metresParSeconde * 3.6)} km/h`;
}

export function formatHumidite(valeur) {
  if (valeur === null || valeur === undefined) return '--%';
  return `${Math.round(valeur)}%`;
}

// OpenWeather renvoie les descriptions en minuscules.
export function capitaliser(texte) {
  if (!texte) return '';
  return texte.charAt(0).toUpperCase() + texte.slice(1);
}

export function urlIconeMeteo(code) {
  return `https://openweathermap.org/img/wn/${code}@4x.png`;
}

// Date lisible à partir d'un timestamp (en secondes) renvoyé par l'API.
export function formatDate(timestampSecondes) {
  const date = new Date(timestampSecondes * 1000);
  return date.toLocaleDateString('fr-FR', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
  });
}

// Heure lisible (HH:mm) à partir d'un timestamp en secondes.
export function formatHeure(timestampSecondes) {
  const date = new Date(timestampSecondes * 1000);
  return date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
}
