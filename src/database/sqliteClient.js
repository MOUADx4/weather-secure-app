import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabaseSync('weather-secure.db');

// La colonne uid rattache chaque ligne au compte connecté,
// ce qui isole l'historique et les favoris entre utilisateurs.
export async function initBaseDeDonnees() {
  await db.execAsync(`
    PRAGMA journal_mode = WAL;

    CREATE TABLE IF NOT EXISTS historique (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      uid TEXT NOT NULL,
      ville TEXT NOT NULL,
      pays TEXT,
      temperature REAL,
      icone TEXT,
      recherche_le INTEGER NOT NULL
    );

    CREATE TABLE IF NOT EXISTS favoris (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      uid TEXT NOT NULL,
      ville TEXT NOT NULL,
      pays TEXT,
      ajoute_le INTEGER NOT NULL,
      UNIQUE (uid, ville, pays)
    );
  `);
}

export { db };
