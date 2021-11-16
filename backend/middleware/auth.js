const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(' ')[1]; // Extrait le token du header authorization de la requête entrante. Split récupère tout après l'espace dans header.
    const decodedToken = jwt.verify(token, process.env.SECRET_TOKEN); // Fonction verify décode le token. Si non valide, génère une erreur.
    const userId = decodedToken.userId; // Extrait l'ID utilisateur du Token
    if (req.body.userId && req.body.userId !== userId) { //Si la demande contient un ID utilisateur, compare à celui du token. Si différent, génère une erreur
      throw '403: unauthorized request';
    } else {
      next();
    }
  } catch {
    res.status(401).json({
      error: new Error('Invalid request!'),
    });
  }
};
