export const darkTheme = {
  mode: 'dark',

  background: '#0A1426',
  surface: '#101E38',
  surfaceElevated: '#142440',
  surfaceHigh: '#1B2F50',

  text: '#F0F4FF',
  textSecondary: '#C4CFE8',
  textMuted: '#8A97BC',
  textDim: '#5A6788',

  primary: '#4F8EF7',
  primaryDark: '#2563EB',
  primaryLight: '#7EB3FF',

  accent: '#22D3EE',
  accentDim: 'rgba(34,211,238,0.12)',

  success: '#10B981',
  warning: '#F59E0B',
  danger: '#EF4444',

  border: 'rgba(255,255,255,0.10)',
  borderStrong: 'rgba(255,255,255,0.18)',

  // Fond du dock : sombre et très opaque pour la lisibilité des icônes.
  dock: 'rgba(16,30,56,0.96)',

  gradient: ['#11203D', '#0A1426'],
  cardGradient: ['#142440', '#0F1B33'],
};

export const lightTheme = {
  mode: 'light',

  background: '#7FB3DF',
  surface: '#E8F2FC',
  surfaceElevated: '#EAF4FE',
  surfaceHigh: '#DCEBF8',

  text: '#0E2238',
  textSecondary: '#274860',
  textMuted: '#46637E',
  textDim: '#6F8AA4',

  primary: '#1E6FD6',
  primaryDark: '#1559B8',
  primaryLight: '#4F8EF7',

  accent: '#0E7FA8',
  accentDim: 'rgba(14,127,168,0.12)',

  success: '#059669',
  warning: '#D97706',
  danger: '#DC2626',

  border: 'rgba(13,40,70,0.14)',
  borderStrong: 'rgba(13,40,70,0.24)',

  // Fond du dock : clair et très opaque.
  dock: 'rgba(238,247,255,0.96)',

  gradient: ['#A3CDEF', '#7FB3DF'],
  cardGradient: ['#EFF7FE', '#E2EEF9'],
};

export const radius = {
  sm: 6,
  md: 10,
  lg: 14,
  xl: 20,
  full: 999,
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  screen: 20,
  xl: 24,
  '2xl': 32,
};

export const typography = {
  display: { fontSize: 34, lineHeight: 40, letterSpacing: -1 },
  h1: { fontSize: 28, lineHeight: 34, letterSpacing: -0.5 },
  h2: { fontSize: 22, lineHeight: 28 },
  h3: { fontSize: 17, lineHeight: 23 },
  body: { fontSize: 14, lineHeight: 21 },
  small: { fontSize: 12, lineHeight: 17 },
};
