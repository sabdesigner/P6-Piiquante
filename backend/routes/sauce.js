// Import d'Express
const express = require('express');
// Déclaration de la route utilisateur
const router = express.Router();

// Import du middleware d'authentification
const auth = require('../middleware/auth');
// Import du middleware de gestion de fichiers entrants
const multer = require('../middleware/multer-config');

// Import des controllers
const sauceCtrl = require('../controllers/sauce');

// Ajout des controllers aux routes (incluant le middleware d'authentification et la gestion de fichiers)
router.get('/', auth, sauceCtrl.getAllSauces);
router.post('/', auth, multer, sauceCtrl.createSauce);
router.get('/:id', auth, sauceCtrl.getOneSauce);
router.put('/:id', auth, multer, sauceCtrl.modifySauce);
router.delete('/:id', auth, sauceCtrl.deleteSauce);
router.post('/:id/like', auth, sauceCtrl.likeASauce);

// Export et explotation des routes
module.exports = router;