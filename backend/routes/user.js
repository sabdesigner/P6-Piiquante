// Import d'Express
const express = require('express');

// Déclaration de la route utilisateur
const router = express.Router();

// Import du middleware/password
const password = require("../middleware/password")
const controlemail = require("../middleware/controlemail")
// Import des middleware/auth
const auth = require('../middleware/auth');

// Import des controlleurs utilisateur
const userCtrl = require('../controllers/user');

// Mise en place des opérations utilisateur (Inscription et login)
router.post('/signup', password, controlemail, userCtrl.signup);
router.post('/login', userCtrl.login);

// Export de la route
module.exports = router;