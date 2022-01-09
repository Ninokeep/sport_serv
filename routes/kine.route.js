const express = require('express');
const router = express.Router();
const kineController = require('../controllers/kine.controller');
const {check, body} = require('express-validator');
const authenticateToken = require('../middlewares/authenticateJWT');



// GET INFORMATION KINE
router.get('/', authenticateToken, kineController.getKine);


// CREATE PATINET
router.post('/create-patient',
check('password').trim().notEmpty().isLength({min:8}).withMessage('petit mot de passe'),
check('nom').trim().not().isNumeric().notEmpty().toLowerCase().withMessage('le nom peut pas être vide'),
check('prenom').trim().not().isNumeric().notEmpty().toLowerCase().withMessage('le prénom ne peut pas être vide'),
check('email').trim().notEmpty().toLowerCase().isEmail().withMessage('mauvais format d email'),
check('age').trim().isFloat({min:1,max:100}).notEmpty().withMessage("l'age peut pas être vide"),
check('sexe').trim().isBoolean().notEmpty().withMessage('le sexe peut pas être vide'),
check('pathologie').trim().not().isNumeric().notEmpty().withMessage("la pathologie ne peut pas être vide"),
// check("numero_telephone").trim().isString().notEmpty().withMessage("le numéro de téléphone ne peut pas être vide"),
check("seance_restante").trim().isFloat({min:1,max:100}).notEmpty().withMessage("le nombre de séance ne peut pas être vide"),
authenticateToken,
kineController.registerPatient);

// REGISTER PATIENT
router.post('/register',
check('password').trim().notEmpty().isLength({min:8}).withMessage('petit mot de passe'),
check('nom').trim().not().isNumeric().notEmpty().toLowerCase().withMessage('le nom peut pas être vide'),
check('prenom').trim().not().isNumeric().notEmpty().toLowerCase().withMessage('le prénom ne peut pas être vide'),
check('email').trim().notEmpty().toLowerCase().isEmail().withMessage('mauvais format d email'),
kineController.register);


// UPDATE PATIENT
router.post('/update-patient',
body('password').trim().notEmpty().isLength({min:8}).withMessage('petit mot de passe'),
body('nom').trim().not().isNumeric().notEmpty().toLowerCase().withMessage('le nom peut pas être vide'),
body('prenom').trim().not().isNumeric().notEmpty().toLowerCase().withMessage('le prénom ne peut pas être vide'),
body('email').trim().notEmpty().toLowerCase().isEmail().withMessage('mauvais format d email'),
body('age').trim().isFloat({min:1,max:100}).notEmpty().withMessage("l'age peut pas être vide"),
body('sexe').trim().isBoolean().notEmpty().withMessage('le sexe peut pas être vide'),
body('pathologie').trim().not().isNumeric().notEmpty().withMessage("la pathologie ne peut pas être vide"),
// body("numero_telephone").trim().isString().notEmpty().withMessage("le numéro de téléphone ne peut pas être vide"),
body("seance_restante").trim().isFloat({min:1,max:100}).notEmpty().withMessage("le nombre de séance ne peut pas être vide"),
body('id_patient').trim().isNumeric().notEmpty().withMessage("l'id du patient ne peut pas être vide"),authenticateToken,

kineController.updatePatient)

// LOGOUT KINE
router.post('/logout',check('email').trim().notEmpty().isEmail().withMessage('mauvais format d email')
,[authenticateToken],kineController.logout)

// CONNECTION KINE
router.post('/login',check('password').trim().notEmpty().isLength({min:8}).withMessage('petit mot de passe'),
check('email').trim().notEmpty().isEmail().toLowerCase().withMessage('mauvais format d email'), kineController.login)


router.get('/token', authenticateToken, kineController.testToken);




// DELETE PATIENT
router.delete('/delete-patient',body('email_patient').trim().notEmpty().isEmail().withMessage('le champ ne correspond pas à une adresse émail'), authenticateToken , kineController.deletePatient);

//all patient
router.get('/get-patient', authenticateToken, kineController.allPatient);

// création entraînement patient
router.post('/create-entrainement', body('nom').trim().not().isNumeric().notEmpty().toLowerCase().withMessage('le nom peut pas être vide'),
body('niveau').trim().not().isNumeric().notEmpty().toLowerCase().withMessage('le niveau peut pas être vide'),
body('commentaire').trim().not().isNumeric().notEmpty().toLowerCase().withMessage('le commentaire peut pas être vide'), authenticateToken,
kineController.createEntrainement);

router.post('/get-entrainement-user', kineController.getAllEntrainementByPatient)


module.exports = router;
