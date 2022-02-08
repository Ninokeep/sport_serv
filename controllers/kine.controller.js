const Kine = require("../models/kine");
const bcrypt = require("bcrypt");
const { validationResult } = require("express-validator");
const token = require("../config/token");
const { Op, where } = require("sequelize");
const jwt = require("jsonwebtoken");
const Patient = require("../models/patient");
const Entrainement = require("../models/entrainement");
const Session = require("../models/session");
const SessionMeta = require('../models/session_meta')
const mysql = require("mysql2");
const connection = mysql.createConnection({
  host: "localhost", //change to my_db for container
  dialect: "mysql",
  password: "password",
  user: "root",
  port: "3306",

  database: "ia_sport",
});

exports.register = (req, res) => {
  const { nom, prenom, email, password } = req.body;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(200).json({ success: false, response: errors });
  } else {
    try {
      Patient.findOne({
        where: {
          email: email,
        },
      })
        .then((rep) => {
          // tu fais une requête pour voir dans kine sinon nada
          if (rep === null) {
            Kine.create({
              nom,
              prenom,
              email,
              password: bcrypt.hashSync(password, 10),
            })
              .then(
                (rep) => {
                  res.status(201).json({ success: true, response: rep });
                },
                (err) => {
                  res
                    .status(200)
                    .json({ success: false, response: "email déjà prise" });
                }
              )
              .catch((err) => {
                res.status(200).json({ success: false, response: err });
              });
          } else {
            res
              .status(200)
              .json({ success: false, response: "email déjà prise" });
          }
        })
        .catch((err) => {
          res
            .status(200)
            .json({ success: false, response: "erreur dans la requête" });
        });
    } catch (e) {
      res.status(200).json({ success: false, response: e });
    }
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;

  console.log("ici");

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({ success: false, response: errors });
  } else {
    try {
      const kineRequest = await Kine.findAll({
        where: {
          email: email,
        },
      });

      if (kineRequest.length > 0) {
        bcrypt
          .compare(password, kineRequest[0].dataValues.password)
          .then(async (rep) => {
            if (rep) {
              const jwt = token.createToken(kineRequest[0].dataValues.id);
              // await Kine.update(
              //   { token: jwt },
              //   {
              //     where: {
              //       email: email,
              //     },
              //   }
              // );
              // j'insère le jwt dans l'objet de ma request sequelize
              kineRequest[0].dataValues.jwt = jwt;
              res.status(200).json({ success: true, response: kineRequest });
            } else {
              res
                .status(200)
                .json({ success: false, response: "mauvais mot de passe" });
            }
          });
      } else {
        return res
          .status(200)
          .json({ success: false, response: "utilisateur pas trouvé" });
      }
    } catch (e) {
      return res
        .status(400)
        .json({ success: false, response: "utilisateur pas trouvé" });
    }
  }
};

exports.logout = async (req, res) => {
  const { email } = req.body;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, response: errors });
  } else {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    // select EMAIL from KINE where EMAIL = EMAIL and token = token

    const kineRequest = await Kine.update(
      { token: null },
      {
        where: {
          email: email,
          token: token,
        },
      }
    );
    if (kineRequest[0] == 0) {
      res.status(400).json({ success: false, response: "erreur" });
    } else {
      req.session.destroy();
      res.status(200).json({ success: true, response: "déconnecté" });
    }
  }
};

exports.registerPatient = async (req, res) => {
  //je vais capturer l'id du kiné grâce au token !

  // mon token decodé est { user : 1, expit : ... , expot : ...} donc je fais user.user pour avoir l'id

  const id_kine = req.user;

  const {
    nom,
    prenom,
    sexe,
    email,
    password,
    numero_telephone,
    age,
    pathologie,
    seance_restante,
  } = req.body;
  const obj_request = {
    nom,
    prenom,
    sexe,
    email,
    password: bcrypt.hashSync(password, 10),
    numero_telephone,
    age,
    pathologie,
    seance_restante,
    id_kine,
  };

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({ success: false, response: errors });
  }

  // je regarde si l'id du kiné existe
  const request_id_kine = await Kine.findOne({
    where: {
      id: id_kine,
    },
  });

  if (request_id_kine === null) {
    res.status(400).json({ success: false, response: "id kiné pas bon" });
  }
  try {
    const request_create_kine = await Patient.create(obj_request);
    res.status(201).json({ success: true, response: request_create_kine });
  } catch (e) {
    res.status(400).json({ success: true, response: e });
  }
};

/**
 * 
    1) récupérer l'id du kiné dans le token
    2) récupérer le patient
    3) mettre à jour les données du patient
 */
exports.updatePatient = async (req, res) => {
  const id_kine = req.user;
  const { id_patient } = req.body;

  console.log(id_kine);
  const { password, ...rest_request } = req.body;
  // je récupère les erreurs de express-validator
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    res.status(200).json({ success: false, response: errors });
  }

  //je récupère l'objet patient que je veux modifier.
  // update renvoit 0 si aucun changement et 1 s'il la requête passe
  else {
    const request_patient = await Patient.update(
      { password: bcrypt.hashSync(password, 10), ...rest_request },
      {
        where: {
          id: id_patient,
          id_kine: id_kine,
        },
      }
    );

    if (request_patient.includes(0)) {
      res.status(201).json({ success: true, response: "aucun changement" });
    }
    res.status(201).json({ success: true, response: "mise  à jour ok" });
  }
};

//delete du patient
exports.deletePatient = async (req, res) => {
  const id_kine = req.user;
  const { id } = req.params;
  const errors = validationResult(req);
  console.log(id)
  //j'attrape l'erreur.
  if (!errors.isEmpty()) {
    res.status(200).json({ success: false, response: errors });
  }

  const request_patient = await Patient.findOne({
    where: {
      // chercher son émail au patient
      id: id,
      // je regarde si l'id du kiné est le même que celui dans la table
      id_kine: id_kine,
    },
  });

  if (request_patient === null) {
    res
      .status(200)
      .json({ success: false, response: request_patient });
  }
  // je delete ici mon patient

  await request_patient.destroy();
  res
    .status(200)
    .json({ success: true, response: "utilisateur bien supprimé" });
};

exports.allPatient = async (req, res) => {
  const id_kine = req.user;

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({ success: false, response: errors });
  }

  const request_all_patient = await Patient.findAll({
    where: {
      id_kine: id_kine,
    },
  });
  res.status(200).json({ success: true, response: request_all_patient });
};

// -------------------------------------------------------------
//                      création d'un entraînement

/**
 * @param Token - Je récupère l'id du kiné créateur qui se trouve dans le token et qui est stocké dans la session req.user
 * @param {Object} req - il va contenir le nom, niveau,gif, commentaire
 * @param {Object} res - il contient la réponse qui peut être 200 ou 400, 401
 * @return {Promise} retourne une promesse
 */
exports.createEntrainement = async (req, res) => {
  // const id_kine = req.user;
  const { nom, niveau } = req.body;

  const errors = validationResult(req);
  //j'attrape l'erreur.
  // la variable errors vient de express-validator
  if (!errors.isEmpty()) {
    res.status(200).json({ success: false, response: errors });
  } else {
    const response = await Entrainement.create({ nom, niveau, gif });

    console.log(response);
    res.status(201).json({ success: true, response: "entraînement créé !" });
  }
};

exports.getKine = async (req, res) => {
  const id_kine = req.user;
  const response = await Kine.findOne({ where: { id: id_kine } });

  return res.status(200).json({ success: true, response: response });
};

exports.testToken = (req, res) => {
  if (req.user === 1) {
    console.log("welcome jojos");
    console.log(req.user);
  } else {
    console.log("bonjour inconnu");
    console.log(req.user);
  }
  res.status(200).json({ coucou: "test" });
};

exports.getAllEntrainementByPatient = async (req, res) => {
  // const id_kine = req.user;
  // const {email} = req.body;
  // if(!errors.isEmpty()){
  //     res.status(200).json({"success":false, "response": errors})
  // }

  // je prends l'id de l'user qui me permettra de récupérer tous ses entraînements
  const { id_user } = req.body;
  connection.execute(
    "SELECT * FROM `user`  INNER JOIN `session`  ON user.id = ? AND session.id_user = user.id INNER JOIN `entrainement` ON entrainement.id = session.id_entrainement INNER JOIN `session_meta` ON session_meta.id_session  = session.id  ",
    [id_user],
    function (err, results, fields) {
      res.status(200).json({ success: true, response: results });

      // if (results.length > 0) {
      //   res.status(200).json({ success: true, response: results });
      // } else {
      //   res.status(200).json({ success: false, response: "pas trouvé" });
      // }
    }
  );
};



// je dois encore pouvoir modifier, supprimer
exports.GetEntrainementForPatient =  async (req, res) => {
  const { id_user, id_entrainement, commentaire_kine,meta_value } = req.body;
  const id_kine = req.user;
  // ID PATIENT
  // ID KINE
  // NOM ENTRAINEMENT
  // REPETITION A FAIRE

    //ici je dois vérifier si mon kiné est bien le kiné de l'user !
    const request_user = await Patient.findAll({
        where: {
            id : id_user,
            id_kine : id_kine
        }
    })
    if(request_user.length > 0){
      try {
        const request_session =  await Session.create({
          id_user: id_user,
          id_entrainement: id_entrainement,
          id_kine: id_kine,
          commentaire_kine: commentaire_kine,
        });
        
        try {
            console.log(request_session.id)
          const request_session_meta = await  SessionMeta.create({
            meta_name: "nombre_repetition",
            meta_value: meta_value,
            id_session: request_session.id,
          });
       
          res.status(200).json({ success: true, response: request_session_meta });
        } catch (err) {
          res.status(200).json({ success: false, response: err });
        }
      } catch (err) {
        res.status(200).json({ success: false, response: err });
      }    }
    else{
        res.status(200).json({success:false,response:"l'user n'appartient pas au kiné"})
    }



    // 

  async function createSession(id_user, id_entrainement, id_kine, commentaire_kine,meta_value){
    try {
        const request_session =  await Session.create({
          id_user: id_user,
          id_entrainement: id_entrainement,
          id_kine: id_kine,
          commentaire_kine: commentaire_kine,
        });
        
        try {
            console.log(request_session.id)
          const request_session_meta = await  SessionMeta.create({
            meta_name: "nombre_repetition",
            meta_value: meta_value,
            id_session: request_session.id,
          });
       
          res.status(200).json({ success: true, response: request_session_meta });
        } catch (err) {
          res.status(200).json({ success: false, response: err });
        }
      } catch (err) {
        res.status(200).json({ success: false, response: err });
      }
  }
  

};


exports.deleteEntrainementForPatient = async(req,res)=>{
    const { id_user,  id_session } = req.body;
    const id_kine = req.user;
    // ID PATIENT
    // ID KINE
    // NOM ENTRAINEMENT
    // REPETITION A FAIRE
      //ici je dois vérifier si mon kiné est bien le kiné de l'user !
      console.log(req.body)
      const request_user = await Patient.findAll({
          where: {
              id : id_user,
              id_kine : id_kine
          }
      })
      
      if(request_user.length > 0){
        const request_session = await Session.destroy({
            where: {
                id : id_session
            }
        })
        res.status(200).json({success:true, response: request_session})

    }
   
    else{
        res.status(200).json({success:false,response:"l'user n'appartient pas au kiné"})
    }
}



exports.getAllEntrainement  = async(req,res) => {

  const request_entrainement = await Entrainement.findAll();
  return res.status(200).json({success:true,response:request_entrainement})
}