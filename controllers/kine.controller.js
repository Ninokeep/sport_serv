const Kine = require('../models/kine');
const bcrypt = require('bcrypt');
const {validationResult } = require('express-validator');
const token = require('../config/token');
const { Op } = require('sequelize');
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
                            res.status(200).json({"success":true,"response": rep})
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
        
        
        // select EMAIL from SPORTIF where EMAIL = EMAIL and token = token 

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







