import Joi from 'joi';

// Mot de passe fort : au moins 8 caractères, une majuscule et un chiffre.
const motDePasseFort = /^(?=.*[A-Z])(?=.*\d).{8,}$/;

export const schemaInscription = Joi.object({
  email: Joi.string()
    .email({ tlds: { allow: false } })
    .required()
    .messages({
      'string.empty': "L'adresse e-mail est obligatoire.",
      'string.email': "L'adresse e-mail n'est pas valide.",
    }),
  motDePasse: Joi.string().pattern(motDePasseFort).required().messages({
    'string.empty': 'Le mot de passe est obligatoire.',
    'string.pattern.base':
      'Le mot de passe doit contenir au moins 8 caractères, une majuscule et un chiffre.',
  }),
  confirmation: Joi.string()
    .required()
    .valid(Joi.ref('motDePasse'))
    .messages({
      'string.empty': 'La confirmation est obligatoire.',
      'any.only': 'Les deux mots de passe ne correspondent pas.',
    }),
});
