const Entrainement = require('../models/entrainement');
const Sportif = require('../models/user');
const SportifEntrainement = require('../models/sportifEntrainement');




exports.allEntrainement= async(req,res)=>{

    //afficher tous les entraînements disponibles

    const requestEntrainement = await Entrainement.findAll({
        attributes: ['id','nom','commentaire','objectif','rating','niveau']
    });
    res.status(200).json({"success":true, "response": requestEntrainement})
    
}



exports.create =  async (req,res)=>{
    //je récupére l'id de l'utilisateur qui va créer un entraînement
    const {sportif_id} = req.body;
    const {nom,commentaire,objectif,niveau} = req.body;
    Entrainement.create({nom,commentaire,objectif,niveau}).then(
        (rep)=>{
            SportifEntrainement.create({sportif_id,entrainement_id : rep.id}).then(
                (rep)=>{
                    res.status(200).json({"success":true,"response":rep})
                }
            ).catch(err=>{
                
                res.status(400).json({"success":false,"response":err})
            })
        }
    )
    .catch((err)=>{
        res.status(400).json({"success":false,"response":err})
    })  
}