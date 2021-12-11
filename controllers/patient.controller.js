const Patient = require('../models/patient');
const bcrypt = require('bcrypt');
const {validationResult } = require('express-validator');
const token = require('../config/token');
const { Op } = require('sequelize');
const jwt = require('jsonwebtoken');




exports.patients = async (req,res) => {
    const {id_kine}  = req.body
    // je fais une requête qui me permet de récupérer tous mes patients en tant que kiné 
    User.findOne({where : {
        id : id_kine,
        rule: true
    }}).then(
        rep => {
            // l'id n'est pas bon
            if(rep === null){
                return res.status(200).json({"success":false, "response": "l'id est mauvais"})
            }
            User.findAll({where : {
                id_kine : rep.id
            }}).then(
                rep => {
                    return res.status(200).json({"success":true,"response": rep }) 
                }
            )
        }
    )
    .catch(
        err => {
            return res.status(200).json({"success":false,"response":err})  
        }
    )
  
    
    

}


exports.create = async(req,res) => {
    const {nom,prenom,email,sexe,password,age,numero_telephone,seance_restante,id_kine,pathologie} = req.body
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        res.status(400).json({"success":false, "response": errors}) 
    }
    else{
        Patient.findOne({where : {
            id : id_kine,
            rule: true
        }}).then(
            rep => {
                // l'id n'est pas bon
                if(rep === null){
                    return res.status(200).json({"success":false, "response": "l'id est mauvais"})
                }
                User.findAll({where : {
                    id_kine : rep.id
                }}).then(
                    async (rep) => {
                        try{
                            const rule = false
                            const patient = await User.create({nom,prenom,rule, email,sexe,password,age,numero_telephone,seance_restante,id_kine,pathologie,password: bcrypt.hashSync(password,10)});
                            
                            res.status(200).json({"success":true,"response":patient})  
                    
                        }
                        catch(e){    
                            if(e.errors[0].path === "numero_telephone"){
                                res.status(200).json({"success":false,"response":"numéro de téléphone déjà pris ! "})  
                            }
                            else if(e.errors[0].path === "email"){
                                res.status(200).json({"success":false,"response":"émail déjà pris !"})  
                            }
                            res.status(200).json({"success":false,"response":e})  
                        }
                            }
                        )
                    }
        )
        .catch(
            err => {
                return res.status(200).json({"success":false,"response":err})  
            }
        )
      
    }

}

exports.update = async(req,res) => {

}

exports.delete = async(req,res) => {
    
}