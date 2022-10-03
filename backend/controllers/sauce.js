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
    imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
    likes : 0,           
    dislikes : 0,        
    usersLiked : [],     
    usersDisliked : [], 
  });
  sauce.save()
    .then(() => res.status(201).json({ message: 'Sauce enregistrée !'}))
    .catch(error => res.status(400).json({ error }));
};
// Controlleur de la route PUT    
exports.modifySauce = (req, res, next) => {
console.log(`req.auth.userId`),
//si l'user auth different Sauce.userId err 403 Sauce.findOne sinon ok
    // Vérification que la sauce appartient à la personne qui effectue la requête
    Sauce.findOne({ _id: req.params.id })
    .then((sauce) => {
      if (sauce.userId !== req.auth.userId) {
        res.status(403).json({ message: 'Demande non autorisée' });
      }

  // Récupération de la sauce dans la base de données
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
})
}

// Controlleur de la route DELETE
    // verification si l'User auth est bien le createur sauce Id 
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
  Sauce.findOne({ _id: req.params.id })
  .then(sauce => {
      // Si l'utilisateur n'a pas encore aimé ou non une sauce
      // modification de la sauce dans la base de donnée push de l'ID utilisateur dans le tableau et incrémentation du like dans le compteur de like
      if(sauce.usersDisliked.indexOf(req.body.userId) == -1 && sauce.usersLiked.indexOf(req.body.userId) == -1) {
          if(req.body.like == 1) { 
            // L'utilisateur aime la sauce
              sauce.usersLiked.push(req.body.userId);
              sauce.likes += req.body.like;
          } else if(req.body.like == -1) { 
            // L'utilisateur n'aime pas la sauce
              sauce.usersDisliked.push(req.body.userId);
              sauce.dislikes -= req.body.like;
          };
      };
      // Si l'utilisateur veut annuler son "like"
      if(sauce.usersLiked.indexOf(req.body.userId) != -1 && req.body.like == 0) {
          const likesUserIndex = sauce.usersLiked.findIndex(user => user === req.body.userId);
          sauce.usersLiked.splice(likesUserIndex, 1);
          sauce.likes -= 1;
      };
      // Si l'utilisateur veut annuler son "dislike"
      if(sauce.usersDisliked.indexOf(req.body.userId) != -1 && req.body.like == 0) {
          const likesUserIndex = sauce.usersDisliked.findIndex(user => user === req.body.userId);
          sauce.usersDisliked.splice(likesUserIndex, 1);
          sauce.dislikes -= 1;
      }
      sauce.save();
      res.status(201).json({ message: 'Like et/ou Dislike mis à jour' });
  })
  .catch(error => res.status(500).json({ error }));
};





  /*console.log("je suis dans like");
  // récupération du like présent dans le body (0 par défaut)
  const like = req.body.like;
  // récupération de l'user ID  présent dans le body
  const userId = req.body.userId;
  // si l'utilisateur like
  if (like === 1) {
    // modification de la sauce dans la base de donnée push de l'ID utilisateur dans le tableau et incrémentation du like dans le compteur de like
    Sauce.updateOne({_id: req.params.id},{$push: { usersLiked: userId }, $inc: {likes: 1}})
    // réponse 200 + message
    .then(() => res.status(200).json({ message: "Votre like a été pris en compte!" }))
    // si erreur réponse 400
    .catch(error => res.status(400).json({ error: error }));
  }
  // si l'utilisateur dislike
  else if (like === -1) {
    // modification de la sauce dans la base de donnée push de l'ID utilisateur dans le tableau et incrémentation du dislike dans le compteur dislike
    Sauce.updateOne({_id: req.params.id}, {$push: { usersDisliked: userId }, $inc: {dislikes: 1}})
    .then(() => res.status(200).json({message: "Votre dislike a été pris en compte!"}))
    .catch(error => res.status(400).json({ error: error }))
  }
  // si l'utilisateur enlève son like ou son dislike 
  else if (like === 0) {
    Sauce.findOne({_id: req.params.id})
    .then(sauce => {
      // si l'utilisateur enlève son like
      // vérifie sur l'ID de l'utilisateur apparait bien dans le tableau usersLiked
      if (sauce.usersLiked.includes(userId)) {
          // modification de la sauce, incrémentation du like retiré dans le compteur like et retire l'ID de l'utilisateur dans le tableau usersLiked
          Sauce.updateOne({_id: req.params.id}, {$inc: {likes: -1}, $pull: {usersLiked: userId}})
          // réponse 200 + message si aucune erreur   
          .then(() => res.status(200).json({ message: "Votre like à bien été supprimé" }))
          // réponse 400 + message si erreur
          .catch(error => res.status(400).json({ error: error }));
        }
      // si l'utilisateur enlève son dislike
      // vérifie sur l'ID de l'utilisateur apparait bien dans le tableau usersLiked
      if (sauce.usersDisliked.includes(userId)) {
          // modification de la sauce, incrémentation du dislike retiré dans le compteur dislike et retire l'ID de l'utilisateur dans le tableau usersDisliked
          Sauce.updateOne({_id: req.params.id}, {$inc: {dislikes: -1}, $pull: {usersDisliked: userId}})
          // réponse 200 + message si aucune erreur 
          .then(() => res.status(200).json({ message: "Votre dislike à bien été supprimé" }))
          // réponse 400 + message si erreur
          .catch(error => res.status(400).json({ error: error }))
      }
    })
  // réponse 500 si erreur
  .catch(error => res.status(500).json({ error: error }))
  }
};*/





  // Si on Like cette sauce v01
  //if verif si like userId est-il dans le tab usersLiked si deja return err
  // On pousse l'identifiant de l'utilisateur dans le tableau usersLikes et on incrémente les likes de 1

 /*if (req.body.like === 1) {
    Sauce.findOneAndUpdate(
      { _id: req.params.id },
      //+1 operateur MongoDB
      { $inc: { likes: +1 }, $push: { usersLiked: req.body.userId } }
    )
      .then(() => res.status(200).json({ message: "Like ajouté !" }))
      .catch((error) => res.status(400).json({ error }));

    // Si on disLike cette sauce 
    // On pousse l'identifiant de l'utilisateur dans le tableau usersLikes et on enleve les likes de 1
  }
if (req.body.like === -1) 
//on verif UserId tab est deja err sinon on affiche dislike ajout dislike 
//usertabl dans le tab Dislike
{
    Sauce.findOneAndUpdate(
      { _id: req.params.id },
      { $inc: { dislikes: 1 }, $push: { usersDisliked: req.body.userId } }
    )
      .then(() => res.status(200).json({ message: "Dislike ajouté !" }))
      .catch((error) => res.status(400).json({ error }));

  // Le choix est annulé
  // Selon si l'user aime ou n'aime pas la sauce avant d'annuler son avis :
  // Recherche et effacement de l'identifiant de l'utilisateur dans le tableau usersLikes ou userDislikes
  } 
if (req.body.like === 0) 
// si l'userId est deja le tabl like on retire like et l'UserId, si l'userId dans dislike on retire le dislike et UserId
 {
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
  }
};*/
//Mettre 4 if Si user 1
/*si il a deja liké (dans le tableau userlike) enlever le like et on enlève son id du tableau
si jamais liker : +1 like et ajout dans le tableau*/
