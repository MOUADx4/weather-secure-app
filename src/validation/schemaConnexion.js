import Joi from 'joi';

export const schemaConnexion = Joi.object({
  email: Joi.string()
    .email({ tlds: { allow: false } })
    .required()
    .messages({
      'string.empty': "L'adresse e-mail est obligatoire.",
      'string.email': "L'adresse e-mail n'est pas valide.",
    }),
  motDePasse: Joi.string().min(1).required().messages({
    'string.empty': 'Le mot de passe est obligatoire.',
  }),
});
