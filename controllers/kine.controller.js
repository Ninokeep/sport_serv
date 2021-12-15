const Kine = require('../models/kine');
const bcrypt = require('bcrypt');
const {validationResult } = require('express-validator');
const token = require('../config/token');
const { Op, where } = require('sequelize');
const jwt = require('jsonwebtoken');
const Patient  = require('../models/patient');

exports.register =   (req,res) => {
    const {nom,prenom,email,password,} = req.body
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        res.status(400).json({"success":false, "response": errors}) 
    }
    else{
       try{

        Patient.findOne({where: {
            email: email
        }}).then(
            rep => {
                // tu fais une requête pour voir dans kine sinon nada
                if(rep === null){
                    Kine.create({nom,prenom,email,password: bcrypt.hashSync(password,10)}).then(
                        rep => {
                            res.status(201).json({"success":true,"response": rep})
                        },
                        err =>{
                            res.status(400).json({"success":false,"response": "email déjà prise"})

                        }
                    )
                    .catch(err => {
                        console.log("err")
                    })
                }
                else{
                    res.status(400).json({"success":false,"response": "email déjà prise"})
                }
            }
        ).catch(
            err => {
                res.status(400).json({"success":false, "response": "erreur dans la requête"})

            }
        )
        

    }
       catch(e){    
        res.status(404).json({"success":false,"response":e})  
       }
    }

}

exports.login = async (req,res) =>{

        const {email,password} = req.body;

        console.log("ici")
        
        const errors = validationResult(req);
        if(!errors.isEmpty()){
            res.status(400).json({"success":false, "response": errors}) 
        }
        else{
            try{
                const kineRequest = await Kine.findAll({
                    where: {
                        email : email
                    }
                })
                
                if(kineRequest.length > 0){       
                    bcrypt.compare( password, kineRequest[0].dataValues.password).then(
                    async(rep)=>{                      
                        if(rep){  
                            
                            const jwt = token.createToken(kineRequest[0].dataValues.id);   
                            await Kine.update({token: jwt}, {
                                where: {
                                    email : email
                                },
                                
                            });
                            // j'insère le jwt dans l'objet de ma request sequelize 
                            kineRequest[0].dataValues.jwt = jwt        
                            res.status(200).json({"success":true,"response":kineRequest})  
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
        
        
        // select EMAIL from KINE where EMAIL = EMAIL and token = token 

        const kineRequest = await Kine.update({token: null}, {
            where : {
                email : email,
                token : token
            }
        });
        if(kineRequest[0] == 0){
            
            res.status(400).json({"success":false,"response":"erreur"})
            
        }else{
            req.session.destroy();
            res.status(200).json({"success":true,"response":"déconnecté"})
        }
  
    }
}

exports.registerPatient = async (req,res) => {

    //je vais capturer l'id du kiné grâce au token ! 

    // mon token decodé est { user : 1, expit : ... , expot : ...} donc je fais user.user pour avoir l'id

        const id_kine = req.user;

  


    const {nom,prenom,sexe,email,password,numero_telephone, age,pathologie, seance_restante} = req.body
    const obj_request = {
        nom,
        prenom,
        sexe,
        email,
        password : bcrypt.hashSync(password,10),
        numero_telephone,
        age,
        pathologie,
        seance_restante,
        id_kine
    }
    
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        res.status(400).json({"success":false, "response": errors}) 
    }
    
    // je regarde si l'id du kiné existe
    const request_id_kine = await Kine.findOne({where:{
        id : id_kine
    }})
    
    if(request_id_kine === null){
        res.status(400).json({"success":false, "response": "id kiné pas bon"})
    }
    try{
        const request_create_kine = await Patient.create(obj_request);
        res.status(201).json({"success":true, "response": request_create_kine})
    }catch(e){
        res.status(400).json({"success":true, "response": "user déjà existant"})

    }
}



/**
 * 
    1) récupérer l'id du kiné dans le token
    2) récupérer le patient
    3) mettre à jour les données du patient
 */
exports.updatePatient = async (req,res) => {
    const id_kine = req.user;
    const {id_patient} = req.body;


    const {...rest_request } = req.body
    // je récupère les erreurs de express-validator
    const errors = validationResult(req);

    if(!errors.isEmpty()){
        res.status(400).json({"success":false, "response": errors}) 
    }

    //je récupère l'objet patient que je veux modifier.
    // update renvoit 0 si aucun changement et 1 s'il la requête passe
    const  request_patient = await Patient.update(
         {...rest_request},
        {where:
    {
        id : id_patient,
        id_kine : id_kine
    }});
    

    if(request_patient.includes(0)){
        res.status(201).json({"success":true, "response":"aucun changement"})
    }
    res.status(201).json({"success":true, "response":"mise  à jour ok"})

  

}



exports.testToken = (req,res) => {
    if(req.user === 1){
        console.log("welcome jojos")
        console.log(req.user)
    }
    else{
        console.log("bonjour inconnu")
        console.log(req.user)
    }
    res.status(200).json({"coucou":"test"})
}


