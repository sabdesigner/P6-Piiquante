// Import du modèle utilisateur
const User = require('../models/user');

/*Le mot de passe n'est pas haché. Veillez à hacher le mot de passe.
 Un utilisateur peut s'inscrire plusieurs fois avec la même adresse
électronique. Assurez-vous que le code vérifie qu’une adresse
électronique est unique.*/
// Import du package de cryptage (hacher le mot de passe)
const bcrypt = require('bcrypt');
// Import des tokens d'authentification 
const jwt = require('jsonwebtoken');
// Controleur pour la création d'un compte utilisateur
exports.signup = (req, res, next) => {
    bcrypt.hash(req.body.password, 10)
      .then(hash => {
        const user = new User({
          email: req.body.email,
          password: hash 
          // hash cryptage du mot du passe
        });
        // sauvegarde de l'user dans la base de donnée
        user.save() 
          .then(() => res.status(201).json({ message: 'Utilisateur créé !' }))
          .catch(error => res.status(400).json({ error }));
      })
      .catch(error => res.status(500).json({ error }));
  };
// Vérification si un utilisateur qui tente de se connecter et si il dispose d'identifiants valides
exports.login = (req, res, next) => {
    User.findOne({ email: req.body.email })
        .then(user => {
            if (!user) {
                return res.status(401).json({ error: 'Utilisateur non trouvé !' });
            }
            bcrypt.compare(req.body.password, user.password)
                .then(valid => {
                    if (!valid) {
                        return res.status(401).json({ error: 'Mot de passe incorrect !' });
                    }
                    res.status(200).json({
                        userId: user._id,
                        token: jwt.sign(
                            { userId: user._id },
                            'RANDOM_TOKEN_SECRET',
                            { expiresIn: '24h' }
                        )
                    });
                })
                .catch(error => res.status(500).json({ error }));
        })
        .catch(error => res.status(500).json({ error }));
 };