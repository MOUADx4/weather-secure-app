import React, { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';

import { auth } from '../config/firebaseClient';
import { importerFavorisDistants } from '../database/favorisRepository';

const SessionContext = createContext(null);

export function SessionProvider({ children }) {
  const [utilisateur, setUtilisateur] = useState(null);
  const [chargement, setChargement] = useState(true);

  useEffect(() => {
    const desabonner = onAuthStateChanged(auth, async (user) => {
      setUtilisateur(user);
      if (user) {
        // À la connexion, on récupère les favoris enregistrés à distance.
        await importerFavorisDistants(user.uid);
      }
      setChargement(false);
    });

    return desabonner;
  }, []);

  return (
    <SessionContext.Provider value={{ utilisateur, chargement }}>
      {children}
    </SessionContext.Provider>
  );
}

export function useSession() {
  const contexte = useContext(SessionContext);
  if (!contexte) {
    throw new Error('useSession doit être utilisé à l\'intérieur de SessionProvider.');
  }
  return contexte;
}
