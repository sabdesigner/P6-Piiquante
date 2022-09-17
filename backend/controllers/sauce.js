// Import du schéma de données
const Sauce = require('../models/sauce');

// Controlleur de la route GET (récupération de toutes les sauces)
exports.getAllSauces = (req, res, next) => {
  Sauce.find()
    .then((sauces) => res.status(200).json(sauces))
    .catch((error) => res.status(404).json({ error }));
};
// Controlleur de la route GET (récupération d'une sauce spécifique)
exports.getOneSauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id })
    .then(sauce => res.status(200).json(sauce))
    .catch(error => res.status(404).json({ error }));
}
// Controlleur de la route POST
// Controlleur de la route PUT
// Controlleur de la route DELETE


