/*Data ModelsUser
email : String — adresse e-mail de l'utilisateur [unique]
password : String — mot de passe de l'utilisateur haché*/

const mongoose = require('mongoose');

const uniqueValidator = require('mongoose-unique-validator');

// Mise en place du schéma de données mongoDB
const userSchema = mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    }
});

// Securité conseillé pour ne pas enregistrer 2 fois le même email dans MongoDB
userSchema.plugin(uniqueValidator);

// Pour exporter et exploiter le schéma de données
module.exports = mongoose.model('User', userSchema);