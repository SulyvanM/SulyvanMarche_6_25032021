const Sauce = require('../models/sauce');
const fs = require('fs');


// Export de la fonction pour récupérer toutes les sauces
exports.getAllSauces = (req, res, next) => {
  Sauce.find()
    .then((sauces) => res.status(200).json(sauces))
    .catch((error) => res.status(404).json({ error }));
};

// Export de la fonction pour récupérer une sauce
exports.getOneSauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id })
    .then((sauce) => res.status(200).json(sauce))
    .catch((error) => res.status(404).json({ error }));
};

// Export de la fonction pour créer une sauce
exports.createSauce = (req, res, next) => {
  const sauceObject = JSON.parse(req.body.sauce);
  delete sauceObject._id;
  const sauce = new Sauce({ // mot clé new avec modèle Mongoose créé automatiquement un champ_id. L'utiliser générerait une erreur car nous tenterions de modifier un champ immuable dans un document de la BDD. Nous devons donc utiliser le paramètre id de la requête pour configurer notre Sauce avec le même _id qu'avant.
    ...sauceObject, // L'opérateur spread (...) va copier tous les éléments de req.body.sauce
    imageUrl: `${req.protocol}://${req.get('host')}/images/${
      req.file.filename
    }`,
    likes: 0,
    dislikes: 0,
    usersLiked: [' '],
    usersdisLiked: [' '],
  });
  sauce
    .save() // Enregistre dans la base de donnée
    .then(() => res.status(201).json({ message: 'Sauce enregistrée' }))
    .catch((error) => res.status(400).json({ error }));
};

// Export de la fonction pour modifier une sauce
exports.updateSauce = (req, res, next) => {
  const sauceObject = req.file
    ? {
        ...JSON.parse(req.body.sauce),
        imageUrl: `${req.protocol}://${req.get('host')}/images/${
          req.file.filename
        }`,
      }
    : { ...req.body };

  Sauce.updateOne(
    { _id: req.params.id },
    { ...sauceObject, _id: req.params.id }
  )
    .then(res.status(200).json({ message: 'Sauce modifiée' }))
    .catch((error) => res.status(400).json({ error }));
};

// Export de la fonction pour supprimer une sauce
exports.deleteSauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id })
    .then((sauce) => {
      const filename = sauce.imageUrl.split('/images/')[1];
      fs.unlink(`images/${filename}`, () => {
        Sauce.deleteOne({ _id: req.params.id })
          .then(res.status(200).json({ message: 'Sauce supprimée' }))
          .catch((error) => res.status(400).json({ error }));
      });
    })
    .catch((error) => res.status(500).json({ error }));
};

// Export de la fonction pour gérer les likes d'une sauce
exports.likeSauce = (req, res, next) => {
  let like = req.body.like;
  let userId = req.body.userId;
  let sauceId = req.params.id;

  switch (like) {
    case 1: // Like
      Sauce.updateOne(
        { _id: sauceId },
        { $push: { usersLiked: userId }, $inc: { likes: +1 } }
      ) // $push et $inc son des opérateurs MongDB. $push ajoute une valeur spécifiée à un tableau et $inc incrémente un champ d'une valeur spécifiée.
        .then(() => res.status(200).json({ message: "like" }))
        .catch((error) => res.status(400).json({ error }));

      break;

    case 0: // Supprimer Like / Dislike
      Sauce.findOne({ _id: sauceId })
        .then((sauce) => {
          if (sauce.usersLiked.includes(userId)) { // Vérifie si le tableau contient l'userId
            Sauce.updateOne(
              { _id: sauceId },
              { $pull: { usersLiked: userId }, $inc: { likes: -1 } }
            ) // L'opérateur $pull supprime d'un tableau existant toutes les instances d'une valeur ou des valeurs qui correspondent à une condition spécifiée.
              .then(() => res.status(200).json({ message: "neutre" }))
              .catch((error) => res.status(400).json({ error }));
          }
          if (sauce.usersDisliked.includes(userId)) {
            Sauce.updateOne(
              { _id: sauceId },
              { $pull: { usersDisliked: userId }, $inc: { dislikes: -1 } }
            )
              .then(() => res.status(200).json({ message: "neutre" }))
              .catch((error) => res.status(400).json({ error }));
          }
        })
        .catch((error) => res.status(404).json({ error }));
      break;

    case -1: // Dislike
      Sauce.updateOne(
        { _id: sauceId },
        { $push: { usersDisliked: userId }, $inc: { dislikes: +1 } }
      )
        .then(() => {
          res.status(200).json({ message: "dislike" });
        })
        .catch((error) => res.status(400).json({ error }));
      break;

    default:
      console.log(error);
  }
};
