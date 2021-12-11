const Kine  = require('../models/kine');

async function isKine(req,res,next){


    console.log(req.body)
    Kine.findOne({where:{
        id : req.body.id_kine,
        rule : true
    }}).then(
        rep => {
            if (rep === null){
                return res.status(401).json({"success":false,"response":"tu n'es pas kiné"}) 
            }
            next();
        }
    )
    
    
}



module.exports = isKine;