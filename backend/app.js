const express = require('express');
const mongoose = require('mongoose'); // Package qui facilite les interactions avec BDD MongoDB
const path = require('path');
const helmet = require('helmet');

require('dotenv').config();

const userRoutes = require('./routes/user');
const sauceRoutes = require('./routes/sauce');

const app = express(); // Créer une constante express

app.use((req, res, next) => { // Permettent d'accéder à notre API depuis n'importe quelle origine ('*'), d'ajouter les headers mentionnés aux requêtes envoyées vers API et d'envoyer des requêtes avec les méthodes mentionnées.
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization'
  );
  res.setHeader(
    'Access-Control-Allow-Methods',
    'GET, POST, PUT, DELETE, PATCH, OPTIONS'
  );
  next(); // Permet a chaque middleware de passer l'éxécution au middleware suivant
});

app.use(helmet());
console.log(process.env.DB_URL)
mongoose.connect(process.env.DB_URL,
    { useNewUrlParser: true,
      useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch((error) => console.log('Connexion à MongoDB échouée !', error));

app.use(express.json());

app.use('/images', express.static(path.join(__dirname, 'images')));
app.use('/api/auth', userRoutes);
app.use('/api/sauces', sauceRoutes);


module.exports = app;
