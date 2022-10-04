
// Import d'Express
const express = require('express');
const helmet = require('helmet')
// Utilisation d'Express
const app = express();
app.use (helmet());

// Import de mongoDB
const mongoose = require('mongoose');

// Import des routes (CRUD)
const sauceRoutes = require('./routes/sauce');

// Pour mettre en place le chemin d'accès à un fichier téléchargé par l'utilisateur
const path = require('path');

// Import des routes utilisateur
const userRoutes = require('./routes/user');

// Import DOTENV


// Configuration de mongoDB
mongoose.connect('mongodb+srv://SabDesigner:SabDesigner@cluster0.romkqoq.mongodb.net/?retryWrites=true&w=majority',
  { useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));

//Intégration des Middlewares
//méthode app.use() permet d'attribuer un middleware à une route spécifique
// Intégration du body
app.use(express.json());

// Ajout des Middlewares d'autorisations
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
  });

// Mise en place des routes utilisateur
app.use('/api/auth', userRoutes);

// Mise en place des routes Sauce (CRUD)
app.use('/api/sauces', sauceRoutes);

// Middleware de téléchargement de fichiers (images des sauces)
app.use('/images', express.static(path.join(__dirname, 'images')));

module.exports = app;