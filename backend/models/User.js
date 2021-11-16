const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const userSchema = mongoose.Schema({
  email: { type: String,
           unique: true,},

  password: { type: String, required: true },

});

userSchema.plugin(uniqueValidator); // Vérifie que l'adresse mail des utilisateurs est unique.

module.exports = mongoose.model('User', userSchema);
