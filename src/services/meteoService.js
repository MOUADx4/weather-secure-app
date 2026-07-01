import { env } from '../config/env';

const BASE_URL = 'https://api.openweathermap.org/data/2.5';
const DUREE_CACHE = 10 * 60 * 1000; // 10 minutes

// Cache mémoire : évite de rappeler l'API pour une même requête
// tant que les données ne sont pas périmées.
const cache = new Map();

function lireCache(cle) {
  const entree = cache.get(cle);
  if (entree && Date.now() - entree.date < DUREE_CACHE) {
    return entree.donnees;
  }
  return null;
}

function ecrireCache(cle, donnees) {
  cache.set(cle, { donnees, date: Date.now() });
}

function normaliserMeteo(data) {
  return {
    ville: data.name,
    pays: data.sys?.country ?? '',
    temperature: data.main?.temp,
    ressenti: data.main?.feels_like,
    humidite: data.main?.humidity,
    pression: data.main?.pressure,
    vent: data.wind?.speed,
    visibilite: data.visibility,
    description: data.weather?.[0]?.description ?? '',
    icone: data.weather?.[0]?.icon ?? '01d',
    leverSoleil: data.sys?.sunrise,
    coucherSoleil: data.sys?.sunset,
    coordonnees: { lat: data.coord?.lat, lon: data.coord?.lon },
  };
}

async function appelerApi(url, cle) {
  const enCache = lireCache(cle);
  if (enCache) return enCache;

  let reponse;
  try {
    reponse = await fetch(url);
  } catch {
    throw new Error('Impossible de joindre le serveur. Vérifiez votre connexion.');
  }

  if (reponse.status === 404) {
    throw new Error('Ville introuvable. Vérifiez l\'orthographe.');
  }
  if (!reponse.ok) {
    throw new Error('Le service météo est momentanément indisponible.');
  }

  const data = await reponse.json();
  ecrireCache(cle, data);
  return data;
}

export async function meteoParVille(ville) {
  const url = `${BASE_URL}/weather?q=${encodeURIComponent(ville)}&units=metric&lang=fr&appid=${env.openWeatherKey}`;
  const data = await appelerApi(url, `ville:${ville.toLowerCase()}`);
  return normaliserMeteo(data);
}

export async function meteoParCoordonnees(lat, lon) {
  const url = `${BASE_URL}/weather?lat=${lat}&lon=${lon}&units=metric&lang=fr&appid=${env.openWeatherKey}`;
  const data = await appelerApi(url, `coord:${lat.toFixed(2)},${lon.toFixed(2)}`);
  return normaliserMeteo(data);
}

// L'API renvoie des prévisions par pas de 3 h sur 5 jours.
export async function previsionsParVille(ville) {
  const url = `${BASE_URL}/forecast?q=${encodeURIComponent(ville)}&units=metric&lang=fr&appid=${env.openWeatherKey}`;
  const data = await appelerApi(url, `prev:${ville.toLowerCase()}`);
  return (data.list ?? []).map((item) => ({
    date: item.dt,
    temperature: item.main?.temp,
    icone: item.weather?.[0]?.icon ?? '01d',
    description: item.weather?.[0]?.description ?? '',
  }));
}
