// Import du schéma de données
const Sauce = require('../models/sauce');

// Import du package file system
const fs = require('fs');

// Controlleur de la route GET (récupération de toutes les sauces)
exports.getAllSauces = (req, res, next) => {
  Sauce.find()
    .then((sauces) => res.status(200).json(sauces))
    .catch((error) => res.status(404).json({
      error
    }));
};
// Controlleur de la route GET (récupération d'une sauce spécifique)
exports.getOneSauce = (req, res, next) => {
  Sauce.findOne({
      _id: req.params.id
    })
    .then(sauce => res.status(200).json(sauce))
    .catch(error => res.status(404).json({
      error
    }));
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
    likes: 0,
    dislikes: 0,
    usersLiked: [],
    usersDisliked: [],
  });
  sauce.save()
    .then(() => res.status(201).json({
      message: 'Sauce enregistrée !'
    }))
    .catch(error => res.status(400).json({
      error
    }));
};
// Controlleur de la route PUT    
exports.modifySauce = (req, res, next) => {
  console.log(`req.auth.userId`),
    //si l'user auth different Sauce.userId err 403 Sauce.findOne sinon ok
    // Vérification que la sauce appartient à la personne qui effectue la requête
    Sauce.findOne({
      _id: req.params.id
    })
    .then((sauce) => {
      // 403 indique qu'un serveur comprend la requête mais refuse de l'autoriser.
      if (sauce.userId !== req.auth.userId) {
        return res.status(403).json({
          error: "Unauthorized request"
        });
      }

      // Récupération de la sauce dans la base de données
      const sauceObject = req.file ?
        // vérifier si une image à été téléchargée avec l'objet
        {
          ...JSON.parse(req.body.sauce),
          //si oui, on récup. les informations au format JSON
          imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
          // puis cela génére une nouvelle URL
        } : {
          ...req.body
        };
      // sinon on modifie son contenu

      Sauce.updateOne({
          _id: req.params.id
        }, {
          ...sauceObject,
          _id: req.params.id
        })
        .then(() => res.status(200).json({
          message: 'Sauce modifiée !'
        }))
        .catch(error => res.status(400).json({
          error
        }));
    })
}

// Controlleur de la route DELETE
// verification si l'User auth est bien le createur sauce Id 
exports.deleteSauce = (req, res, next) => {

  Sauce.findOne({
      _id: req.params.id
    })
    //on recherche l'objet dans la base de données
    .then(sauce => {
      // 403 indique qu'un serveur comprend la requête mais refuse de l'autoriser.
      if (sauce.userId !== req.auth.userId) {
        return res.status(403).json({
          error: "Unauthorized request"
        });
      }
      // quand il est trouvé
      const filename = sauce.imageUrl.split('/images/')[1];
      // on extrait le nom du fichier à supprimer
      fs.unlink(`images/${filename}`, () => {
        // on supprime ce fichier (ici l'image)
        Sauce.deleteOne({
            _id: req.params.id
          })
          // puis on supprime l'objet de la base de données
          .then(() => res.status(200).json({
            message: 'Sauce supprimée !'
          }))
          .catch(error => res.status(400).json({
            error
          }));
      });
    })
    .catch(error => res.status(500).json({
      error
    }));
};

// Contrôleur de la fonction like des sauces
exports.likeSauce = (req, res, next) => {
  Sauce.findOne({
      _id: req.params.id
    })
    .then(sauce => {
      // Si l'utilisateur n'a pas encore aimé ou n'aime pas une sauce
      // modification de la sauce dans la base de donnée push de l'ID utilisateur dans le tableau 
      //...et incrémentation du like dans le compteur de like
      if (sauce.usersDisliked.indexOf(req.body.userId) == -1 && sauce.usersLiked.indexOf(req.body.userId) == -1) {
        if (req.body.like == 1) {
          // L'utilisateur aime la sauce
          sauce.usersLiked.push(req.body.userId);
          sauce.likes += req.body.like;
        } else if (req.body.like == -1) {
          // L'utilisateur n'aime pas la sauce
          sauce.usersDisliked.push(req.body.userId);
          sauce.dislikes -= req.body.like;
        };
      };
      // Si l'utilisateur veut annuler son "like"
      if (sauce.usersLiked.indexOf(req.body.userId) != -1 && req.body.like == 0) {
        const likesUserIndex = sauce.usersLiked.findIndex(user => user === req.body.userId);
        sauce.usersLiked.splice(likesUserIndex, 1);
        sauce.likes -= 1;
      };
      // Si l'utilisateur veut annuler son "dislike"
      if (sauce.usersDisliked.indexOf(req.body.userId) != -1 && req.body.like == 0) {
        const likesUserIndex = sauce.usersDisliked.findIndex(user => user === req.body.userId);
        sauce.usersDisliked.splice(likesUserIndex, 1);
        sauce.dislikes -= 1;
      }
      sauce.save();
      // 201 indique que la requête a réussi et qu'une ressource a été créée en conséquence.
      res.status(201).json({
        message: 'Like et/ou Dislike mis à jour'
      });
    })
    .catch(error => res.status(500).json({
      error
    }));
};