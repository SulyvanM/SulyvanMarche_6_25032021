const bcrypt = require('bcrypt'); // Utilise un algorithme undirectionnel pour chiffrer et créer un hash des mots de passe utilisateur
const User = require('../models/user');
const jwt = require('jsonwebtoken'); // Créer un vérifier les tokens d'authentification, les tokens d'authentification permettent aux utilisateurs de se connecter, ils reçoivent le token et le renvoient à chaque requête par la suite pour permettre au back-end de vérifier que la requête est authentifiée.

// Export de la fonction d'enregistrement
exports.signup = (req, res, next) => {
  bcrypt
    .hash(req.body.password, 10) // Hash le mot de passe et le 'sale' 10 fois.
    .then((hash) => {
      const user = new User({
        email: req.body.email,
        password: hash,
      });
      user
        .save()
        .then(() => res.status(201).json({ message: 'Utilisateur créé !' }))
        .catch((error) => res.status(400).json({ message : 'Un compte existe déjà avec cet Email.' }));
    })
    .catch((error) => res.status(500).json({ error }));
};


// Export de la fonction pour se connecter
exports.login = (req, res, next) => {
  User.findOne({ email: req.body.email })
    .then((user) => {
      if (!user) {
        return res.status(401).json({ message : 'Utilisateur non trouvé !' });
      }
      bcrypt
        .compare(req.body.password, user.password)
        .then((valid) => {
          if (!valid) {
            return res.status(401).json({ error: 'Mot de passe incorrect !' });
          }
          res.status(200).json({
            userId: user._id,
            token: jwt.sign({ userId: user._id }, process.env.SECRET_TOKEN, { // Chaîne secrète de développement temporaire pour encoder le token
              expiresIn: '24h',
            }),
          });
        })
        .catch((error) => res.status(500).json({ error }));
    })
    .catch((error) => res.status(500).json({ error }));
};
