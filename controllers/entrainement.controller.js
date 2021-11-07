const Entrainement = require('../models/entrainement');
const Sportif = require('../models/sportif');
const SportifEntrainement = require('../models/sportifEntrainement');


    // const result = await Sportif.findOne({
    //     where : {
    //         email : 'fabrizio@gmail.com'
    //     },
    //     include: Entrainement
    // });
    
    //        res.status(200).json({"success":true, "response" : result})



exports.allEntrainement= async(req,res)=>{

    //afficher tous les entraînements disponibles

    const requestEntrainement = await Entrainement.findAll({
        attributes: ['id','nom','commentaire','objectif','rating','niveau']
    });
    res.status(200).json({"success":true, "response": requestEntrainement})
    
}

//pour créer une jointure en sportif entrainement table
// try{
//     const requestSportifEntrainement = await SportifEntrainement.create({sportif_id : 2, entrainement_id : 2})
//     res.status(200).json({"success":true, "response":requestSportifEntrainement})
// }
// catch(e){
//     res.status(400).json({"success":true, "response":e})

// }


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