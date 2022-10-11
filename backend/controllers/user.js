// Import du modèle utilisateur
const User = require('../models/user');

// Import du package de cryptage (hacher le mot de passe)
const bcrypt = require('bcrypt');
// Import des tokens d'authentification 
const jwt = require('jsonwebtoken');

// Import de CryptoJS
const cryptojs = require('crypto-js');

//  Import DotEnv
const dotenv = require("dotenv")
const result = dotenv.config();

// Controleur pour la création d'un compte utilisateur
exports.signup = (req, res, next) => {
  // chiffrer l'email avant envoi dans la base de donnée
  const emailCryptoJS = cryptojs.HmacSHA256(req.body.email, `${process.env.CRYPTOJS_EMAIL}`).toString();

  bcrypt.hash(req.body.password, 10)
    .then(hash => {
      const user = new User({
        email: emailCryptoJS,
        password: hash
        // hash cryptage du mot du passe
      });
      // sauvegarde de l'user dans la base de donnée
      user.save()
        .then(() => res.status(201).json({
          message: 'Utilisateur créé !'
        }))
        .catch(error => res.status(400).json({
          error
        }));
    })
    .catch(error => res.status(500).json({
      error
    }));
};
// Vérification si un utilisateur qui tente de se connecter et si il dispose d'identifiants valides
exports.login = (req, res, next) => {
  const emailCryptoJS = cryptojs.HmacSHA256(req.body.email, `${process.env.CRYPTOJS_EMAIL}`).toString();

  User.findOne({
      email: emailCryptoJS
    })
    .then(user => {
      if (!user) {
        return res.status(401).json({
          error: 'Utilisateur non trouvé !'
        });
      }
      bcrypt.compare(req.body.password, user.password)
        .then(valid => {
          // Le mot de passe est incorrect

          if (!valid) {
            return res.status(401).json({
              error: 'Mot de passe incorrect !'
            });
          }
          // Le mot de passe est correct
          // envoie de la reponse server du userId et du token d'authentification
          res.status(200).json({
            userId: user._id,
            token: jwt.sign({
                userId: user._id
              },
              process.env.JWT_KEY_TOKEN, {
                expiresIn: '24h'
              }
            )
          });
        })
        .catch(error => res.status(500).json({
          error
        }));
    })
    .catch(error => res.status(500).json({
      error
    }));
};