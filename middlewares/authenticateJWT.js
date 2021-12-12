const jwt  = require('jsonwebtoken');
const Kine = require('../models/kine');

//eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjoyLCJpYXQiOjE2MzQ2MzIwNTgsImV4cCI6MTYzNDgwNDg1OH0.g8YqLCV0b8_JCoXIHuxf4Mkse4OtB0gH828AZGsJjKI
//vérifie si le client a un bon token valide par rapport à mes informations de .env et je regarde dans la db si un token existe
function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]
  
    if (token == null) return res.sendStatus(401)
  
    jwt.verify(token, process.env.TOKEN, (err, user) => {    
      if (err) {  
        return res.status(401).json({"success":false,"response":"mauvais token"})
      }
      
      else{
        Kine.findOne({where: {
          token : token
        }}).then( rep => {
          if(rep == null){
            //mauvais format de token
            return res.status(401).json({"success":false,"response":"mauvais format token"})

          }
          //création de session
          
          req.user = user.user;
          
         
          next();
        },
        err=>console.log("err"))
      }
    });
}

module.exports = authenticateToken