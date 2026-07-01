// Le code d'icône OpenWeather se termine par 'd' (jour) ou 'n' (nuit).
function estNuit(icone) {
  return typeof icone === 'string' && icone.endsWith('n');
}

const TEXTE = {
  texte: '#FFFFFF',
  texteDoux: 'rgba(255,255,255,0.75)',
  verre: 'rgba(255,255,255,0.10)',
  bordure: 'rgba(255,255,255,0.16)',
};

export function ambianceMeteo(icone = '01d') {
  const nuit = estNuit(icone);
  const prefixe = (icone || '01d').slice(0, 2);

  if (nuit) {
    return { ...TEXTE, gradient: ['#14233F', '#0E1730', '#080B1A'] };
  }

  switch (prefixe) {
    // Ciel dégagé
    case '01':
      return { ...TEXTE, gradient: ['#1C3A5E', '#13294A', '#0C1B33'] };
    // Nuages
    case '02':
    case '03':
    case '04':
      return { ...TEXTE, gradient: ['#243B55', '#1A2C44', '#101F33'] };
    // Pluie / averses / orage
    case '09':
    case '10':
    case '11':
      return { ...TEXTE, gradient: ['#22303F', '#1A2735', '#101A26'] };
    // Neige
    case '13':
      return { ...TEXTE, gradient: ['#2A3E55', '#1F3047', '#142235'] };
    // Brume / brouillard
    case '50':
      return { ...TEXTE, gradient: ['#283643', '#1E2A36', '#141E28'] };
    default:
      return { ...TEXTE, gradient: ['#1C3A5E', '#13294A', '#0C1B33'] };
  }
}
