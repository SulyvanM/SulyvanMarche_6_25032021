const mongoose = require('mongoose');

const sauceSchema = mongoose.Schema({
  userId: { type: String, required: true },
  name: { type: String, required: true },
  manufacturer: { type: String, required: true },
  description: { type: String, required: true },
  mainPepper: { type: String, required: true },
  imageUrl: { type: String, required: true },
  heat: { type: Number, required: true },
  likes: { type: Number, required: true },
  dislikes: { type: Number, required: true },
  usersLiked: { type: [String], required: true },
  usersDisliked: { type: [String], required: true },
});

module.exports = mongoose.model('Sauce', sauceSchema);

// Schéma de données qui contient les champs souhaités pour chaque sauces indiquant leur type et leur caractère.
// Utilisation de la méthode schema mise à disposition par Mongoose. Le champ d'ID est automatiquement générer par Mongoose.
// Export du schema en tant que modèle Mongoose appelé 'Sauce', le rendant disponible pour l'application Express
