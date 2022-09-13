// Import d'Express
const express = require('express');
// Déclaration de la route utilisateur
const router = express.Router();

// Import des controlleurs utilisateur
const userCtrl = require('../controllers/user');

const auth = require('../middleware/auth');


// Mise en place des opérations utilisateur (Inscription et login)
router.post('/signup', userCtrl.signup);
router.post('/login', userCtrl.login);

// Export de la route
module.exports = router;