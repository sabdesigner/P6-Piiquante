// Import du package de création de token
const jwt = require('jsonwebtoken');
const Sauce = require('../models/sauce');

// Création du middleware d'authentification
module.exports = (req, res, next) => {
   try {
       const token = req.headers.authorization.split(' ')[1];
       // La clé d'authentification du token est correcte
       const decodedToken = jwt.verify(token, 'RANDOM_TOKEN_SECRET');
    
       // Récupération de l'userId du token
       const userId = decodedToken.userId;
       req.auth = {
           userId: userId
       }; 

	next();

   } 
  

   catch(error) {
       res.status(401).json({ error:"user non autorisée" });
   }
};

