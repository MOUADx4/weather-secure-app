import React, { createContext, useContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { darkTheme, lightTheme } from '../theme/colors';

const CLE_STOCKAGE = '@weather-secure/theme';

const ThemeContext = createContext(null);

export function ThemeProvider({ children }) {
  const [modeSombre, setModeSombre] = useState(true);

  useEffect(() => {
    AsyncStorage.getItem(CLE_STOCKAGE).then((valeur) => {
      if (valeur !== null) {
        setModeSombre(valeur === 'dark');
      }
    });
  }, []);

  const basculerTheme = () => {
    setModeSombre((precedent) => {
      const suivant = !precedent;
      AsyncStorage.setItem(CLE_STOCKAGE, suivant ? 'dark' : 'light');
      return suivant;
    });
  };

  const colors = modeSombre ? darkTheme : lightTheme;

  return (
    <ThemeContext.Provider value={{ colors, modeSombre, basculerTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const contexte = useContext(ThemeContext);
  if (!contexte) {
    throw new Error('useTheme doit être utilisé à l\'intérieur de ThemeProvider.');
  }
  return contexte;
}
