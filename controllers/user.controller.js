const Sportif = require('../models/sportif');
const bcrypt = require('bcrypt');
const {validationResult } = require('express-validator');
const token = require('../config/token');
const { Op } = require('sequelize');
const jwt = require('jsonwebtoken');
const Entrainement = require('../models/entrainement');
const SportifEntrainement = require('../models/sportifEntrainement');
exports.register =  async (req,res) => {
    const {nom,prenom,email,sport,poids,sexe,password,age,niveau} = req.body
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        res.status(400).json({"success":false, "response": errors}) 
    }
    else{
       try{
        
        const sportif = await Sportif.create({nom,prenom,email,sport,poids,sexe,password: bcrypt.hashSync(password,10), age,niveau});
        
        res.status(200).json({"success":true,"response":"user créé"})  

    }
       catch(e){    
        res.status(200).json({"success":false,"response":"veuillez entrer une émail valide"})  
       }
    }

}
exports.login = async (req,res) =>{

        const {email,password} = req.body;

      
        
        const errors = validationResult(req);
        if(!errors.isEmpty()){
            res.status(400).json({"success":false, "response": errors}) 
        }
        else{
            try{
                const sportRequest = await Sportif.findAll({
                    where: {
                        email : email
                    }
                })
                
                if(sportRequest.length > 0){       
                    bcrypt.compare( password, sportRequest[0].dataValues.password).then(
                    async(rep)=>{                      
                        if(rep){  
                            
                            const jwt = token.createToken(sportRequest[0].dataValues.id);   
                            await Sportif.update({token: jwt}, {
                                where: {
                                    email : email
                                },
                                
                            });
                            // j'insère le jwt dans l'objet de ma request sequelize 
                            sportRequest[0].dataValues.jwt = jwt        
                            res.status(200).json({"success":true,"response":sportRequest})  
                        }else{
                            res.status(200).json({"success":false, "response": "mauvais mot de passe"}) 
                        }
                    }
                )
                }
                else {    
                    return res.status(200).json({"success":false, "response": "utilisateur pas trouvé"})

                }
               
            }
            catch(e){
                return res.status(400).json({"success":false, "response": "utilisateur pas trouvé"}
                )}
        }
    


}
exports.logout = async(req,res)=>{
    const {email}  = req.body;
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({"success":false, "response": errors})
    }
    else{
        const authHeader = req.headers['authorization']
        const token = authHeader && authHeader.split(' ')[1]
        
        
        // select EMAIL from SPORTIF where EMAIL = EMAIL and token = token 

        const requestSportif = await Sportif.update({token: null}, {
            where : {
                email : email,
                token : token
            }
        });
        if(requestSportif[0] == 0){
            
            res.status(400).json({"success":false,"response":"erreur"})
            
        }else{
            req.session.destroy();
            res.status(200).json({"success":true,"response":"déconnecté"})
        }
  
    }
}


exports.update = async(req,res)=>{
    const errors = validationResult(req);
    const { nom,prenom,email,sport,poids,sexe,password} = req.body  
    if(!errors.isEmpty()){
        return res.status(400).json({"success":false, "response": errors})

    }
    
     await Sportif.update({nom,prenom,email,sport,poids,sexe,password: bcrypt.hashSync(password,10)} , {
        where  : {
            id : req.session.userId
        }
    });

    res.status(200).json({"success":true,"response":"bien mis à jour"})

  

}
exports.test = (req,res)=>{
    
    res.status(200).json({"test":req.session})
}





exports.suivreEntrainement = async(req,res)=>{
    const { sportif_id , entrainement_id} = req.body;
    //vérifier si l'user l'est pas un entraîneur !
        Sportif.findOne({where: {id: sportif_id}}).then(
            userFound =>{
                if(userFound === null){
                    res.status(400).json({"success": false, "response" :"id non existant"})
                }
                // l'id est trouvé
                userFound.addEntrainement(entrainement_id).then(
                    rep=>{
                        if(rep=== undefined){
                            res.status(403).json({"success": false, "response" :"entrainement déjà pris"})
                        }
                        res.status(200).json({"success": true, "response" :rep})
                  }            
                ).catch(
                    err =>{
                        res.status(400).json({"success": false, "response" :"l'id de l'entraînement n'existe pas"})
                    }
                )
            
            }
        )
        .catch(err=>{
            res.status(400).json({"success": false, "response" :err})
        })
}


exports.quitterEntrainement = async(req,res)=>{
    const { sportif_id , entrainement_id} = req.body;
    //vérifier si l'user l'est pas un entraîneur !
        Sportif.findOne({where: {id: sportif_id}, include: Entrainement}).then(
            userFound =>{
                if(userFound === null){
                    res.status(400).json({"success": false, "response" :"id non existant"})
                }
                // l'id est trouvé 
                //pour supprimer si j'ai bine supprimé je reçois un 1 sinon un 0
                SportifEntrainement.destroy({where:{entrainement_id: entrainement_id, sportif_id: sportif_id}}).then(
                    rep =>{
                                if(rep===0){
                                    res.status(400).json({"success": false, "response" :"l'id de l'entraînement n'existe pas ou il est déjà supprimé"})
                                }
                                res.status(200).json({"success": false, "response" :"entrainement bien supprimé"})
                    }
                  
                )

    
            
            }
        )
        .catch(err=>{
            res.status(400).json({"success": false, "response" :err})
        })


}


exports.getEntrainementByUser = (req,res)=>{
    const {sportif_id} = req.body;
    if(typeof sportif_id === 'string' || sportif_id instanceof String ){
        res.status(400).json({"success":false,"response":"string interdit !!!"})
    }
    Sportif.findOne({where: {id: sportif_id}, include: [
        Entrainement,
        
        ],
    attributes: []}
        )
        
        .then(
        rep=>{
            if(!rep){
                res.status(200).json({"success":false,"response":"id not found"})
            }
            res.status(200).json({"success":true,"response":rep})
        }
    )
    .catch(err =>{
        res.status(400).json({"success":false,"response":err})

    })

}



exports.getEntrainementFinishedByUser = (req,res)=>{

    const {sportif_id} = req.body;

    if(typeof sportif_id === 'string' || sportif_id instanceof String ){
        res.status(400).json({"success":false,"response":"string interdit !!!"})
    }
    

    Sportif.findAll({
        where : {
            id : sportif_id
        },
        attributes: [],
        include: [{
            model:Entrainement,
            required: false,
            through: {
                where : {
                    finished: true
                },
                
                attributes: []}
        }]
    }).then(
        data => {
            
            if(data.length>0){
                res.status(200).json({"success":true,"response": data})
            }
            res.status(200).json({"success":false,"response": "pas d'entrainement fini"})


        }
    )
    .catch(err => {
            console.log(err)
        })

}









exports.checkSport = async (req,res)=>{
    const {user} = req.user;
    
    const {sport} = req.body;

    const errors = validationResult(req);

    if(!errors.isEmpty()){
        return res.status(400).json({"success":false, "response": errors})
    }
    else{
        try{
            const request = await User.findOneAndUpdate({_id:user},{discipline:sport},{strict:false,returnOriginal:false,runValidators:true});
            if(request===null){
                res.status(400).json({"success":false,"response":"problème dans la requête update sport"})
            }
            else{
                res.status(200).json({"success":false,"response":"sport bien changé"})
        
            }
        }
        catch(e){
            res.status(400).json({"response":false,"response":e.errors.discipline.message})
        }
    }

}
exports.objectifSport = async(req,res)=>{

    const {niveau} = req.body;
    function defineTraining(niveau){
        if(niveau==="débutant"){
            //selectionner un entraînement débutant
        }
        else if(niveau==="intermédiaire"){
            //selectionner un entraînement intermédiaire
        }
        else{
            //selectionner un entraînement expert
            //je dois aller dans le document Entraînement
        }
    }   
    const {user} = req.user;
    
    const {objectif} = req.body;
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({"success":false, "response": errors})

    }
    else{
        try{
            const request = await User.findOneAndUpdate({_id:user},{objectif:objectif},{strict:false,returnOriginal:false,runValidators:true});
            if(request===null){
                res.status(400).json({"success":false,"response":"problème dans la requête update objectif"})
            }
            else{
                res.status(200).json({"success":false,"response":"objectif bien changé"})
        
            }
        }
        catch(e){
            res.status(400).json({"success":false,"response":e.errors.objectif.message})
        }
    }

}


exports.getUser = async(req,res)=> {
    const {id} = req.params;
    const request = await Sportif.findByPk(id)
    if(request === null){
        console.log("erreur au niveau de la recherche l'id")
    }else{
        return res.status(200).json({"success":true,"response":request})
    }
}


exports.defineLevel = async(req,res)=>{

}

