import { doc, setDoc, deleteDoc, getDocs, collection } from 'firebase/firestore';

import { db } from './sqliteClient';
import { db as firestore } from '../config/firebaseClient';

// Les chemins Firestore n'acceptent pas '/', '\' ni '.'.
function cleFavori(meteo) {
  return `${meteo.ville}-${meteo.pays}`
    .toLowerCase()
    .replace(/[/\\.\s]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export async function ajouterFavori(uid, meteo) {
  await db.runAsync(
    `INSERT OR IGNORE INTO favoris (uid, ville, pays, ajoute_le)
     VALUES (?, ?, ?, ?)`,
    [uid, meteo.ville, meteo.pays, Date.now()]
  );
  await synchroniserVersFirestore(uid, meteo);
}

export async function supprimerFavori(uid, meteo) {
  await db.runAsync(`DELETE FROM favoris WHERE uid = ? AND ville = ? AND pays = ?`, [
    uid,
    meteo.ville,
    meteo.pays,
  ]);
  try {
    await deleteDoc(doc(firestore, 'users', uid, 'favoris', cleFavori(meteo)));
  } catch {
    // La synchronisation distante est optionnelle : on ignore l'échec hors ligne.
  }
}

export function listerFavoris(uid) {
  return db.getAllAsync(`SELECT * FROM favoris WHERE uid = ? ORDER BY ajoute_le DESC`, [uid]);
}

export async function estFavori(uid, meteo) {
  const ligne = await db.getFirstAsync(
    `SELECT id FROM favoris WHERE uid = ? AND ville = ? AND pays = ?`,
    [uid, meteo.ville, meteo.pays]
  );
  return !!ligne;
}

async function synchroniserVersFirestore(uid, meteo) {
  try {
    await setDoc(doc(firestore, 'users', uid, 'favoris', cleFavori(meteo)), {
      ville: meteo.ville,
      pays: meteo.pays,
      ajouteLe: Date.now(),
    });
  } catch {
    // Si Firestore n'est pas configuré ou que l'appareil est hors ligne,
    // le favori reste tout de même disponible en local (SQLite).
  }
}

// Fusionne les favoris Firestore dans SQLite pour retrouver ses favoris après réinstallation.
export async function importerFavorisDistants(uid) {
  try {
    const snapshot = await getDocs(collection(firestore, 'users', uid, 'favoris'));
    for (const document of snapshot.docs) {
      const data = document.data();
      await db.runAsync(
        `INSERT OR IGNORE INTO favoris (uid, ville, pays, ajoute_le) VALUES (?, ?, ?, ?)`,
        [uid, data.ville, data.pays, data.ajouteLe ?? Date.now()]
      );
    }
  } catch {
    // Synchronisation impossible (hors ligne / Firestore non activé) : sans effet.
  }
}
