import Joi from 'joi';

export const schemaRecherche = Joi.object({
  ville: Joi.string().trim().min(2).required().messages({
    'string.empty': 'Veuillez saisir le nom d\'une ville.',
    'string.min': 'Le nom de la ville doit contenir au moins 2 caractères.',
  }),
});
