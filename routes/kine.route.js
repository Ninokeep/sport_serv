const express = require('express');
const router = express.Router();
const kineController = require('../controllers/kine.controller');
const {check} = require('express-validator');
const authenticateToken = require('../middlewares/authenticateJWT');

router.post('/create',
check('password').trim().notEmpty().isLength({min:8}).withMessage('petit mot de passe'),
check('nom').trim().not().isNumeric().notEmpty().toLowerCase().withMessage('le nom peut pas être vide'),
check('prenom').trim().not().isNumeric().notEmpty().toLowerCase().withMessage('le prénom ne peut pas être vide'),
check('email').trim().notEmpty().toLowerCase().isEmail().withMessage('mauvais format d email'),
check('age').trim().isNumeric().notEmpty().withMessage("l'age peut pas être vide"),
check('sexe').trim().isBoolean().notEmpty().withMessage('le sexe peut pas être vide'),
check('pathologie').trim().not().isNumeric().notEmpty().withMessage("la pathologie ne peut pas être vide"),
check("numero_telephone").trim().isString().notEmpty().withMessage("le numéro de téléphone ne peut pas être vide"),
check("seance_restante").trim().isNumeric().notEmpty().withMessage("le nombre de séance ne peut pas être vide"),
check("id_kine").trim().isNumeric().notEmpty().withMessage("l'id du kiné de séance ne peut pas être vide"),
kineController.register);

router.post('/register',
check('password').trim().notEmpty().isLength({min:8}).withMessage('petit mot de passe'),
check('nom').trim().not().isNumeric().notEmpty().toLowerCase().withMessage('le nom peut pas être vide'),
check('prenom').trim().not().isNumeric().notEmpty().toLowerCase().withMessage('le prénom ne peut pas être vide'),
check('email').trim().notEmpty().toLowerCase().isEmail().withMessage('mauvais format d email'),
kineController.register);





router.post('/logout',check('email').trim().notEmpty().isEmail().withMessage('mauvais format d email')
,[authenticateToken],kineController.logout)

router.post('/login',check('password').trim().notEmpty().isLength({min:8}).withMessage('petit mot de passe'),
check('email').trim().notEmpty().isEmail().toLowerCase().withMessage('mauvais format d email'), kineController.login)





module.exports = router;
