// Importation de password-validator
var passwordValidator = require('password-validator');

// Créer un schema
var passwordSchema = new passwordValidator();

// Ajout des propriétés
passwordSchema
  .is().min(8)              // Longueur minimale de 8 caractères
  .is().max(100)            // Longueur maximale de 100 caractères
  .has().uppercase()        // Doit contenir au moins une majuscule
  .has().lowercase()        // Doit contenir au moins une minuscule
  .digits(2)                // Doit contenir au moins deux chiffres
  .has().not() .spaces()    // Ne doit pas contenir d'espace

  module.exports = passwordSchema;
