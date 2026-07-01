const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Profil de transformation "default" : Babel transpile les champs privés de classe
// (syntaxe #champ), que la version de Hermes embarquée dans Expo Go ne gère pas.
config.transformer.unstable_transformProfile = 'default';

module.exports = config;
