const mongoose = require('mongoose');

// Mise en place du schéma de données mongoDB
const sauceSchema = mongoose.Schema({
  userId: {
    type: String,
    required: true
  },
  name: {
    type: String,
    minlength: [2, "le nom est trop court"],
    maxlength: [60, "le nom est trops long"],
    required: [true, "le nom est requis"]
  },
  manufacturer: {
    type: String,
    required: [true, "le nom du faricant est requis"]
  },
  description: {
    type: String,
    required: [true, "la description est requise"]
  },
  mainPepper: {
    type: String,
    required: [true, "les ingrédients sont requis"]
  },
  imageUrl: {
    type: String,
    required: [true, "l'image est requise"]
  },
  heat: {
    type: Number,
    required: [true, "la puissance est requise"]
  },
  //systheme des Likes et disLikes
  likes: {
    type: Number,
    default: 0
  },
  dislikes: {
    type: Number,
    default: 0
  },
  usersLiked: {
    type: [String],
    default: []
  },
  usersDisliked: {
    type: [String],
    default: []
  },
});

// Pour exporter et exploiter le schéma de données
module.exports = mongoose.model('sauce', sauceSchema);