// Import du schéma de données
const Sauce = require('../models/sauce');

// Import du package file system
const fs = require('fs');

// Controlleur de la route GET (récupération de toutes les sauces)
exports.getAllSauces = (req, res, next) => {
  Sauce.find()
    .then((sauces) => res.status(200).json(sauces))
    .catch((error) => res.status(404).json({ error }));
};
// Controlleur de la route GET (récupération d'une sauce spécifique)
exports.getOneSauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id })
    .then(sauce => res.status(200).json(sauce))
    .catch(error => res.status(404).json({ error }));
}
// Controlleur de la route POST
exports.createSauce = (req, res, next) => {
  // extraire les données JSON de l'objet
  const sauceObject = JSON.parse(req.body.sauce); 
  delete sauceObject._id;
  const sauce = new Sauce({
    ...sauceObject,
    // générer l'URL de l'image de l'objet 
    imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
  });
  sauce.save()
    .then(() => res.status(201).json({ message: 'Sauce enregistrée !'}))
    .catch(error => res.status(400).json({ error }));
};
// Controlleur de la route PUT
exports.modifySauce = (req, res, next) => {
  const sauceObject = req.file ? 
  // vérifier si une image à été téléchargée avec l'objet
    {
      ...JSON.parse(req.body.sauce), 
      //si oui, on récup. les informations au format JSON
      imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}` 
      // puis cela génére une nouvelle URL
    } : { ...req.body }; 
    // sinon on modifie son contenu
  Sauce.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id })
    .then(() => res.status(200).json({ message: 'Sauce modifiée !'}))
    .catch(error => res.status(400).json({ error }));
};

// Controlleur de la route DELETE
exports.deleteSauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id }) 
  //on recherche l'objet dans la base de données
    .then(sauce => { 
      // quand il est trouvé
      const filename = sauce.imageUrl.split('/images/')[1]; 
      // on extrait le nom du fichier à supprimer
      fs.unlink(`images/${filename}`, () => { 
        // on supprime ce fichier (ici l'image)
        Sauce.deleteOne({ _id: req.params.id }) 
        // puis on supprime l'objet de la base de données
          .then(() => res.status(200).json({ message: 'Sauce supprimée !'}))
          .catch(error => res.status(400).json({ error }));
      });
    })
    .catch(error => res.status(500).json({ error }));
};

// Contrôleur de la fonction like des sauces
exports.likeSauce = (req, res, next) => {
  console.log=("je suis dans like");
  // Si on Like cette sauce 
    // On pousse l'identifiant de l'utilisateur dans le tableau usersLikes et on incrémente les likes de 1
 /* if (req.body.like === 1) {
    Sauce.findOneAndUpdate(
      { _id: req.params.id },
      { $inc: { likes: 1 }, $push: { usersLiked: req.body.userId } }
    )
      .then(() => res.status(200).json({ message: "Like ajouté !" }))
      .catch((error) => res.status(400).json({ error }));

    // Si on disLike cette sauce 
    // On pousse l'identifiant de l'utilisateur dans le tableau usersLikes et on enleve les likes de 1
  } else if (req.body.like === -1) {
    Sauce.findOneAndUpdate(
      { _id: req.params.id },
      { $inc: { dislikes: 1 }, $push: { usersDisliked: req.body.userId } }
    )
      .then(() => res.status(200).json({ message: "Dislike ajouté !" }))
      .catch((error) => res.status(400).json({ error }));

  // Le choix est annulé
  // Selon si l'user aime ou n'aime pas la sauce avant d'annuler son avis :
  // Recherche et effacement de l'identifiant de l'utilisateur dans le tableau usersLikes ou userDislikes
  } else {
    Sauce.findOne({ _id: req.params.id }).then((resultat) => {
      if (resultat.usersLiked.includes(req.body.userId)) {
        
        Sauce.findOneAndUpdate(
          { _id: req.params.id },
          { $inc: { likes: -1
           }, $pull: { usersLiked: req.body.userId } }
        )
          .then(() => res.status(200).json({ message: "like en moins !" }))
          .catch((error) => res.status(400).json({ error }));
      } else if (resultat.usersDisliked.includes(req.body.userId)) {
        
        Sauce.findOneAndUpdate(
          { _id: req.params.id },
          { $inc: { dislikes: -1 }, $pull: { usersDisliked: req.body.userId } }
        )
          .then(() => res.status(200).json({ message: "dislike en moins !" }))
      }
    });
  }*/
};