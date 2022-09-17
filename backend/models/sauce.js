/*//Data ModelsSauce
userId : String — l'identifiant MongoDB unique de l'utilisateur qui a créé la
sauce
name : String — nom de la sauce
manufacturer : String — fabricant de la sauce
description : String — description de la sauce
mainPepper : String — le principal ingrédient épicé de la sauce
imageUrl : String — l'URL de l'image de la sauce téléchargée par l'utilisateur
heat : Number — nombre entre 1 et 10 décrivant la sauce
likes : Number — nombre d'utilisateurs qui aiment (= likent) la sauce
dislikes : Number — nombre d'utilisateurs qui n'aiment pas (= dislike) la sauce
usersLiked : [ "String <userId>" ] — tableau des identifiants des utilisateurs qui ont aimé (= liked) la sauce
usersDisliked : [ "String <userId>" ] — tableau des identifiants des utilisateurs qui n'ont pas aimé (= disliked) la sauce*/

const mongoose = require('mongoose');

// Mise en place du schéma de données mongoDB
const sauceSchema = mongoose.Schema({
  userId: { type: String, required: true }, 
  name: { type: String, required: true },
  manufacturer: { type: String, required: true }, 
  description: { type: String, required: true }, 
  mainPepper: { type: String, required: true }, 
  imageUrl: { type: String, required: true }, 
  heat: { type: Number, required: true }, 
  likes: { type: Number, default: 0, required: true }, 
  dislikes: { type: Number, default: 0, required: true }, 
  usersLiked: { type: Array, default: [], required: true }, 
  usersDisliked: { type: Array, default: [], required: true }, 
});

// Pour exporter et exploiter le schéma de données
module.exports = mongoose.model('sauce', sauceSchema);