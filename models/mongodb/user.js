const mongoose = require('mongoose');
const validator = require('validator');
const uniqueValidator = require('mongoose-unique-validator');


const {Schema} = mongoose;

const agendaSchema = new Schema({
    entrainementID: {type : mongoose.Types.ObjectId },
    date: {type: Date, min: '2021-01-01', max: '2025-01-01'},
    fini : {type:Boolean, default:false},
    appreciation: {type: Boolean, default: false},
    commentaire: {type: String, default:"Un entraînement cool"}  
});

const entrainementSchema = new Schema({
    nom : 
        {
            type : String, default: "fractionne"
        }
    ,
    repetition : 
        {
            type : Number, default: 5
        }
    ,
    temps : 
        {
            type: Number,
            enum: {
                values: [30,60],
                message: "tu dois choisir entre 30s ou 60s"
            },
            default: 30,
           
        },
    commentaire: {
        type : String,
        default: "Lorem lipium"
    },
    niveau : {
        type: String,
        enum : {
            values: ["débutant","intermédiaire","expert"],
            message: "tu dois choisir un niveau débutant, intermédiaire ou expert"
        },
        default: "débutant"
    }
    

});




const userSchema = new Schema({

    entrainement : {
        type: [entrainementSchema], 
        default : () => ([
            {
            nom:"fractionne",
            repetition : 10,
            temps : 60,
            commentaire : " un super bon entraînement",
            niveau :"expert"
        },
        {
            nom:"sprint",
            repetition : 10,
            temps : 60,
            commentaire : " un super bon sprint",
            niveau :"intermédiaire"
        },
        {
            nom:"footing",
            repetition : 10,
            temps : 60,
            commentaire : " un super bon entraînement",
            niveau :"débutant"
        }])
    },
    nom : {
        type: String,
        required: true
    },
    prenom: {
        type: String,
        required: true
    },
    password : {
        type: String,
        required:true,
        minlength: [8,'le champ mot de passe doit faire 8 caractéres']
    },
    email: {
        type: String,
        required: true,
        validate : [validator.isEmail,'invalide email'],
        unique: true,
        
    },
    discipline: {
        type: String,
        enum : {
            values: ["course","natation","streetworkout"],
            message : "mauvaise valeur pour la discipline"
        },
        required: false,
        default: "course"
    },
    agenda : {
        type: [agendaSchema],
        default: () => ({})
    },
    poids : {
        type: Number,
        required : true
    },
    sexe : {
        type: Boolean,
        required: false
    },
    rule : {
        type: String,
        enum : {
            values: ["administrateur","sportif","entraineur"],
            message : "mauvaise valeur pour le rôle"
        },
        required: true,
        default : "sportif"
    },
    objectif : {
        type : String,
        enum : {
            values: ["marathon","semi-marathon"],
            message : "mauvaise valeur pour l'objectif"
        },
        required:false,
        default: "marathon"
    },
    niveau : {
        type: String,
        enum : {
            values: ["débutant","intermédiaire","expert"],
            message: "mauvaise valeur pour le niveau"
        },
        required : false,
        default : "débutant"
    }
   
    
},

{strict:true},
{
    timestamps: true
});






userSchema.plugin(uniqueValidator);



const User = mongoose.model('User',userSchema); 
module.exports = User;
