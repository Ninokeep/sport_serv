const Sportif = require('../models/sportif');

function isEntraineur(req,res,next){

    //request
    //si l'utilisateur est un sportif alors ok tu peux faire ça !
    console.log(req.body);
    Sportif.findOne({where : {
        id : req.body.sportif_id,
        rule : 'entraineur'
    }}).then(
        rep=>{
            if(rep == null){
               
                res.status(400).json({"success":false,"response": "seul les sportifs ont accès"})
            }
           
            next();
        }
    ).catch(
        err=>{
            res.status(400).json({"success":false,"response":err})
        }
    )
}
module.exports = isEntraineur;
