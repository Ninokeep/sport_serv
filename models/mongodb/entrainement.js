const mongoose = require('mongoose');
const validator = require('validator');
const uniqueValidator = require('mongoose-unique-validator');


const {Schema} = mongoose;


const entrainementSchema = new Schema({
    nom : String,
    prenom : String
});


const Entrainement = mongoose.model('Entrainement', entrainementSchema)

module.exports = Entrainement;