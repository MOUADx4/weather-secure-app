import { db } from './sqliteClient';

export async function ajouterHistorique(uid, meteo) {
  await db.runAsync(
    `INSERT INTO historique (uid, ville, pays, temperature, icone, recherche_le)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [uid, meteo.ville, meteo.pays, meteo.temperature ?? null, meteo.icone, Date.now()]
  );
}

export function listerHistorique(uid) {
  return db.getAllAsync(
    `SELECT * FROM historique WHERE uid = ? ORDER BY recherche_le DESC LIMIT 50`,
    [uid]
  );
}

export async function supprimerHistorique(id) {
  await db.runAsync(`DELETE FROM historique WHERE id = ?`, [id]);
}

export async function viderHistorique(uid) {
  await db.runAsync(`DELETE FROM historique WHERE uid = ?`, [uid]);
}
